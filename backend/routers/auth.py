from fastapi import APIRouter, HTTPException
from supabaseClient import supabase
from models import UserAuth, EmailRequest

router = APIRouter(
    prefix="/auth",
    tags=["auth"] # Grouping in Swagger docs
)

# ---------------------------------- AUTH -----------------------------------------------
# Sign Up
@router.post("/signup")
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
@router.post("/login")
def login(user: UserAuth):
    try:
        response = supabase.auth.sign_in_with_password(
            {"email": user.email, "password": user.password}
        )
        return {"access_token": response.session.access_token, "user": response.user, "status":"success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#Resend Confirmation Email
@router.post("/resend-confirmation")
def resend_confirmation(email: EmailRequest):
    try:
        supabase.auth.resend({"type": "signup", "email": email})
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(400, str(e))
