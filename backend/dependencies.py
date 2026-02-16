from fastapi import Header, HTTPException
from supabaseClient import supabase

#Get Logged in user's id
async def get_current_user(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    
    token = authorization.split(" ")[1]
    try:
        response = supabase.auth.get_user(token)
        if not response.user:
            raise HTTPException(status_code=401, detail="User not found")
        return response.user.id # Return just the string
    except Exception:
        raise HTTPException(status_code=401, detail="Authentication failed")
        
        
def check_person_ownership(person_id: int, user_id: str):
    person_check = (
        supabase.table("person")
        .select("id, family:family_id(user_id)")
        .eq("id", person_id)
        .execute()
    )

    if not person_check.data:
        raise HTTPException(status_code=404, detail="Person not found")

    family_owner = person_check.data[0].get("family", {}).get("user_id")
    
    if family_owner != user_id:
        raise HTTPException(
            status_code=403, 
            detail="Access denied: You do not own the family this person belongs to"
        )