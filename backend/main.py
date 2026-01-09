from supabaseClient import supabase
from fastapi import FastAPI, Header, HTTPException, status, Depends
from models import Person, PersonUpdate, PersonCreate, UserAuth, EmailRequest, FamilyNameUpdate
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)


# ---------------------------------- AUTH -----------------------------------------------
# Sign Up
@app.post("/auth/signup")
def signup(user: UserAuth):
    try:
        response = supabase.auth.sign_up(
            {"email": user.email, "password": user.password}
        )
        return {
            "status": "success",
            "message": "Sign up successful, check email for verification",
            "user": response.user,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Log In
@app.post("/auth/login")
def login(user: UserAuth):
    try:
        response = supabase.auth.sign_in_with_password(
            {"email": user.email, "password": user.password}
        )
        return {"access_token": response.session.access_token, "user": response.user, "status":"success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#Resend Confirmation Email
@app.post("/auth/resend-confirmation")
def resend_confirmation(email: EmailRequest):
    try:
        supabase.auth.resend({"type": "signup", "email": email})
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(400, str(e))

#Get Logged in user's id
async def get_current_user(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    
    token = authorization.replace("Bearer ", "")
    try:
        response = supabase.auth.get_user(token)
        if not response.user:
            raise HTTPException(status_code=401, detail="User not found")
        return response.user.id # Return just the string
    except Exception:
        raise HTTPException(status_code=401, detail="Authentication failed")
        
# ---------------------------------- APP -----------------------------------------------

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

#create oerson        
@app.post("/person")
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


# ----------- ADD CHILD -----------------
@app.post("/person/{id}/add_child")
def add_child(id: int, child: Optional[PersonCreate] = None):
    data = child.model_dump(exclude_unset=True)
    res = supabase.table("person").insert(data).execute()

    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to create child")

    new_id = res.data[0]["id"]

    return {"status": "success", "new_child_id": new_id}


# ----------- ADD SIBLING -----------------
@app.post("/person/{id}/add_sibling")
def add_sibling(id: int, sibling: PersonCreate):  # use a creation model
    data = sibling.model_dump(exclude_unset=True)
    res = supabase.table("person").insert(data).execute()

    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to create sibling")

    new_id = res.data[0]["id"]

    return {"status": "success", "sibling_id": new_id}


# -------------------------------------- ADD PARENT -----------------------------------------------
@app.post("/person/{id}/add_parent")
def add_parent(id: int, partner: Person):
    data = partner.model_dump(exclude_unset=True)

    # --------------------------------------------
    # CASE A: existing parent (ID provided)
    # --------------------------------------------
    if "id" in data:
        new_parent_id = data["id"]

    # --------------------------------------------
    # CASE B: create new parent
    # --------------------------------------------
    else:
        res = supabase.table("person").insert(data).execute()

        if not res.data:
            raise HTTPException(400, "Failed to create parent")

        new_parent_id = res.data[0]["id"]

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


@app.delete("/person/{id}")
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

# get the families created by a user
@app.get("/families")
def read_user_families(user_id: str = Depends(get_current_user)):
    families = supabase.table("family").select("*").eq("user_id", user_id).execute()
    return families.data if families.data else []

# get family members of a certain family
@app.get("/family/{family_id}")
def get_family_members(family_id: str, user_id: str = Depends(get_current_user)):
    check = supabase.table("family").select("id").eq("id", family_id).eq("user_id", user_id).execute()
    if not check.data:
        raise HTTPException(status_code=403, detail="Forbidden: You do not own this family")

    members = supabase.table("person").select("*").eq("family_id", family_id).execute()
    return members.data

# update family card name
@app.put("/family/{id}/update_name")
def update_family_card_name(id: str, new_name:FamilyNameUpdate,user_id: str = Depends(get_current_user)):
    check = supabase.table("family").select("id").eq("id", id).eq("user_id", user_id).execute()
    if not check.data:
        raise HTTPException(status_code=403, detail="Forbidden: You do not own this family")
    response = supabase.table("family").update({"name": new_name.new_name}).eq("id", id).execute()
    if response.data:
        return {
            "status": "success",
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Family with id {id} not found",
        )
######################################## NOTES ############################################################
######################################## CONTACT ############################################################
