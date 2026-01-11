from fastapi import Header, HTTPException
from supabaseClient import supabase

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
        