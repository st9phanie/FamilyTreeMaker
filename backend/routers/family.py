from fastapi import APIRouter, HTTPException
from supabaseClient import supabase
from fastapi import FastAPI, Header, HTTPException, status, Depends
from models import FamilyNameUpdate, Family
from dependencies import get_current_user

router = APIRouter(
    prefix="/family",
    tags=["family"] # Grouping in Swagger docs
)


# get the families created by a user
@router.get("/all")
def read_user_families(user_id: str = Depends(get_current_user)):
    families = supabase.table("family").select("*").eq("user_id", user_id).execute()
    return families.data if families.data else []

# get family members of a certain family
@router.get("/{family_id}")
def get_family_members(family_id: str, user_id: str = Depends(get_current_user)):
    check = supabase.table("family").select("id").eq("id", family_id).eq("user_id", user_id).execute()
    if not check.data:
        raise HTTPException(status_code=403, detail="Forbidden: You do not own this family")

    members = supabase.table("person").select("*").eq("family_id", family_id).execute()
    return members.data

# update family card name
@router.put("/{id}/update_name")
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
        
@router.post("")
def create_new_family(family: Family, user_id: str = Depends(get_current_user)):
    
    family_data = family.model_dump(exclude_unset=True)    
    family_data["user_id"] = user_id
    
    res = supabase.table("family").insert(family_data).execute()
    
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to create new family")

    return {
        "status": "success", 
        "id": res.data[0]["id"]
    }