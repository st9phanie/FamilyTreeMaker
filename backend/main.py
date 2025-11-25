from supabaseClient import supabase
from fastapi import FastAPI, HTTPException, status
from models import Person, PersonUpdate
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
@app.get("/person/{id}", response_model=Person)
def get_person(id: int):
    person = supabase.table("person").select("*").eq("id", id).execute()

    if not person.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person with id {id} not found",
        )
    return person.data[0]


# update person
@app.put("/person/{id}", response_model=Person)
def update_person(id: int, person: PersonUpdate):
    data = person.model_dump(mode="json", exclude_unset=True)
    print(data)
    if not data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update.",
        )

    response = supabase.table("person").update(data).eq("id", id).execute()

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person with id {id} not found",
        )

    return {"status": "success"}


# create person
@app.post("/person/")
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
@app.get("/family/{id}/")
def get_family(id: str):
    members = supabase.table("person").select("*").contains("family_id", [id]).execute()
    if not members.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Family with id {id} not found",
        )
    return members.data


# get the families created by a user
@app.get("/family/")
def get_user_families(userid: int):
    families = supabase.table("family").select("*").eq("user_id", userid).execute()
    if not families.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No results")
    return families.data
