from fastapi import APIRouter, HTTPException,File, UploadFile
from supabaseClient import supabase
from fastapi import FastAPI, Header, HTTPException, status, Depends
from models import Person
from dependencies import get_current_user
from typing import Optional, Any

router = APIRouter(
    prefix="/person",
    tags=["person"] # Grouping in Swagger docs
)

#---------------------------------- APP -----------------------------------------------

# get person info
@router.get("/{id}")
def get_person(id: int):
    person = supabase.table("person").select("*").eq("id", id).execute()

    if not person.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person with id {id} not found",
        )
    return person.data[0]


# update person
@router.put("/{id}")
def update_person(id: int, person: Person):
    data = person.model_dump(mode="json", exclude_unset=True)

    if not data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update.",
        )
        
    response = supabase.table("person").update(data).eq("id", id).execute()
    if response.data:
        return {
            "status": "success",
            "person": response.data[0],
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person with id {id} not found",
        )

# picture
@router.post("/{id}/upload-photo")
async def change_picture(id: int, photo: UploadFile = File(...)):
    try:
        file_content = await photo.read()
        file_extension = photo.filename.split('.')[-1]
        storage_path = f"/person_{id}.{file_extension}"
        
        response = supabase.storage.from_("images").upload(
            path=storage_path,       
            file=file_content,        
            file_options={
                "cache-control": "3600",
                "upsert": "true"
            }
        )

        public_url_response = supabase.storage.from_('images').get_public_url(storage_path)
        print(public_url_response)
        db_response = supabase.table('person').update(
            {"photo": str(public_url_response)}
        ).eq('id', id).execute()

        return {
            "status": "success",
            "url": public_url_response,
            "data": db_response.data
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

#create oerson        
@router.post("")
def add_person(person: Person, user_id: str = Depends(get_current_user)):
    family_check = supabase.table("family").select("id").eq("id", person.family_id).eq("user_id", user_id).execute()
    
    if not family_check.data:
        raise HTTPException(status_code=403, detail="You cannot add members to a family you don't own")

    data = person.model_dump(mode="json", exclude_unset=True)
    response = supabase.table("person").insert(data).execute()
    
    if response.data:
        return {
            "status": "success",
            "person": response.data[0],
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to insert person: {response.error}",
        )

# ----------- ADD PARTNER -----------------
@router.post("/{id}/add_partner")
def add_partner(id: int, partner: Person):
    new_person = add_person(partner)
    new_id = new_person["id"]

    # Get original person's partner_id []
    original = supabase.table("person").select("partner_id").eq("id", id).execute()
    if not original.data:
        raise HTTPException(status_code=404, detail=f"Person {id} not found")

    partners = original.data[0].get("partner_id") or []
    partners.append(new_id)

    supabase.table("person").update({"partner_id": partners}).eq("id", id).execute()

    return {"status": "success", "new_partner_id": new_id}

# -------------------------------------- ADD PARENT -----------------------------------------------
@router.post("/{id}/add_parent")
def add_parent(id: int, parent: Person):
    data = parent.model_dump(exclude_unset=True)

    # --------------------------------------------
    # CASE A: existing parent (ID provided)
    # --------------------------------------------
    if "id" in data:
        new_parent_id = data["id"]

    # --------------------------------------------
    # CASE B: create new parent
    # --------------------------------------------
    else:
        new_person = add_person(parent)
        new_parent_id = new_person["id"]

    # --------------------------------------------
    # Fetch child's current parents
    # --------------------------------------------
    original = supabase.table("person").select("pid1, pid2").eq("id", id).execute()

    if not original.data:
        raise HTTPException(404, f"Person {id} not found")

    row = original.data[0]
    pid1 = row.get("pid1")
    pid2 = row.get("pid2")

    # CASE 1: no parents → pid1
    if pid1 is None:
        supabase.table("person").update({"pid1": new_parent_id}).eq("id", id).execute()

        return {"status": "success", "assigned": "pid1", "parent_id": new_parent_id}

    # CASE 2: one parent → pid2 + partner link
    if pid2 is None:
        supabase.table("person").update({"pid2": new_parent_id}).eq("id", id).execute()

        # link parents as partners
        p1 = supabase.table("person").select("partner_id").eq("id", pid1).execute()
        partners = p1.data[0].get("partner_id") or []

        if new_parent_id not in partners:
            partners.append(new_parent_id)

        supabase.table("person").update({"partner_id": partners}).eq(
            "id", pid1
        ).execute()

        supabase.table("person").update({"partner_id": [pid1]}).eq(
            "id", new_parent_id
        ).execute()

        return {
            "status": "success",
            "assigned": "pid2",
            "parent_id": new_parent_id,
            "linked_parents": True,
        }

    return {"status": "fail", "message": "Person already has two parents"}


@router.delete("/{id}")
def delete_person(id: int):
    # 1. Fetch the person (we need their partner list)
    person = supabase.table("person").select("partner_id").eq("id", id).execute()

    if not person.data:
        raise HTTPException(404, f"Person {id} not found")

    partner_ids = person.data[0].get("partner_id") or []

    # ---------------------------------------------------
    # 2. Remove this person from all partners’ partner_id arrays
    # ---------------------------------------------------
    for pid in partner_ids:
        result = supabase.table("person").select("partner_id").eq("id", pid).execute()

        if not result.data:
            continue  # partner missing or corrupted entry

        arr = result.data[0].get("partner_id") or []
        cleaned = [p for p in arr if p != id]

        supabase.table("person").update({"partner_id": cleaned}).eq("id", pid).execute()

    # ---------------------------------------------------
    # 3. Nullify parent references in children
    # ---------------------------------------------------

    # All children where deleted person is pid1
    children_pid1 = supabase.table("person").select("id").eq("pid1", id).execute()

    for child in children_pid1.data:
        supabase.table("person").update({"pid1": None}).eq("id", child["id"]).execute()

    # All children where deleted person is pid2
    children_pid2 = supabase.table("person").select("id").eq("pid2", id).execute()

    for child in children_pid2.data:
        supabase.table("person").update({"pid2": None}).eq("id", child["id"]).execute()

    # ---------------------------------------------------
    # 4. Delete the person record
    # ---------------------------------------------------
    delete_res = supabase.table("person").delete().eq("id", id).execute()

    if not delete_res.data:
        raise HTTPException(
            status_code=404,
            detail=f"Person with id {id} could not be deleted",
        )

    return {"status": "success", "deleted": id}
