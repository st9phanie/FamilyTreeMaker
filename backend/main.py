from supabaseClient import supabase
from fastapi import FastAPI, HTTPException, status
from models import Person
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    'http://localhost:5173']

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials =True, allow_headers =['*'], allow_methods=['*'])

       
@app.get("/person/{id}", response_model=Person)
def get_person(id: int):
    person = supabase.table("person").select("*").eq("id",id).execute()
    
    if not person.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person with id {id} not found"
        )
    return person.data[0]

@app.post("/person/")
def add_person(person: Person):
    data = person.model_dump(mode="json") 
    response = supabase.table("person").insert(data).execute()
    
    if response.data:
        return {
            "message": f"Person {person.firstname} added successfully",
            "person": response.data[0] 
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to insert person: {response.error}"
        )

@app.get("/family/{id}")
def get_family(id:str):
    members = supabase.table("person").select("*").contains("family_id", [id]).execute()
    if not members.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Family with id {id} not found"
        )
    return members.data

@app.get("/family/")
def get_user_families(userid:int):
    families = supabase.table("family").select("*").eq("user_id",userid).execute()
    if not families.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No results"
        )
    return families.data