from supabaseClient import supabase
from fastapi import FastAPI, HTTPException, status
from models import Person, PersonUpdate, PersonCreate
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)


    
# get person info
@app.get("/person/{id}")
def get_person(id: int):
    person = supabase.table("person").select("*").eq("id", id).execute()

    if not person.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person with id {id} not found",
        )
    return person.data[0]


# update person
@app.put("/person/{id}")
def update_person(id: int, person: PersonUpdate):
    data = person.model_dump(mode="json", exclude_unset=True)
    print(data)
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


# create person
@app.post("/person")
def add_person(person: Person):
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

#----------- ADD PARTNER -----------------
@app.post("/person/{id}/add_partner")
def add_partner(id: int, partner: PersonCreate):  # use a creation model
    data = partner.model_dump(exclude_unset=True)
    res = supabase.table("person").insert(data).execute()

    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to create partner")

    new_id = res.data[0]["id"]

    # Get original person's partner_id safely
    original = supabase.table("person").select("partner_id").eq("id", id).execute()
    if not original.data:
        raise HTTPException(status_code=404, detail=f"Person {id} not found")

    partners = original.data[0].get("partner_id") or []
    partners.append(new_id)

    supabase.table("person").update({"partner_id": partners}).eq("id", id).execute()

    return {"status": "success", "new_partner_id": new_id}

# -------------------------------------- ADD PARENT -----------------------------------------------
@app.post("/person/{id}/add_parent")
def add_parent(id: int, partner: PersonCreate):

    # 1. Create new parent
    data = partner.model_dump(exclude_unset=True)
    res = supabase.table("person").insert(data).execute()

    if not res.data:
        raise HTTPException(400, "Failed to create parent")

    new_parent_id = res.data[0]["id"]

    # 2. Fetch child's current parents in ONE query
    original = (
        supabase.table("person")
        .select("pid1, pid2")
        .eq("id", id)
        .execute()
    )

    if not original.data:
        raise HTTPException(404, f"Person {id} not found")

    row = original.data[0]
    pid1 = row.get("pid1")
    pid2 = row.get("pid2")

    # CASE 1: no parents at all → assign pid1
    if pid1 is None:
        update = (
            supabase.table("person")
            .update({"pid1": new_parent_id})
            .eq("id", id)
            .execute()
        )

        if not update.data:
            raise HTTPException(500, "Failed to add parent")

        return {"status": "success", "assigned": "pid1", "parent_id": new_parent_id}

    # CASE 2: only one parent → assign pid2
    if pid2 is None:
        update = (
            supabase.table("person")
            .update({"pid2": new_parent_id})
            .eq("id", id)
            .execute()
        )

        if not update.data:
            raise HTTPException(500, "Failed to add parent")

        # ---- Link the two parents as partners ----
        parent1_id = pid1
        parent2_id = new_parent_id

        # Get existing partner list of parent1
        p1 = (
            supabase.table("person")
            .select("partner_id")
            .eq("id", parent1_id)
            .execute()
        )

        if not p1.data:
            raise HTTPException(404, "Parent 1 not found (data corruption?)")

        partners = p1.data[0].get("partner_id") or []
        if parent2_id not in partners:
            partners.append(parent2_id)

        # Update parent1's partner list
        supabase.table("person").update({"partner_id": partners}).eq("id", parent1_id).execute()

        # add parent1 to parent2’s partner list as well  
        supabase.table("person").update({"partner_id": [parent1_id]}).eq("id", parent2_id).execute()

        return {
            "status": "success",
            "assigned": "pid2",
            "parent_id": new_parent_id,
            "linked_parents": True,
        }

    # CASE 3: already has two parents
    return {"status": "fail", "message": "Person already has two parents"}




# delete person
@app.delete("/person/{id}")
def delete_person(id: int):
    response = supabase.table("person").delete().eq("id", id).execute()

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person with id {id} could not be deleted",
        )

    return {"status": "success", "id": id}


# get family members of a certain family
@app.get("/family/{id}")
def get_family(id: str):
    members = supabase.table("person").select("*").eq("family_id", id).execute()
    if not members.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Family with id {id} not found",
        )
    return members.data


# get the families created by a user
@app.get("/family")
def get_user_families(userid: int):
    families = supabase.table("family").select("*").eq("user_id", userid).execute()
    if not families.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No results")
    return families.data


######################################## NOTES ############################################################
######################################## CONTACT ############################################################
