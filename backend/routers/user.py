from fastapi import APIRouter, HTTPException, File, UploadFile
from supabaseClient import supabase
from fastapi import status, Depends
from models import User, PhotoRequest
from dependencies import get_current_user
from typing import Any

router = APIRouter(prefix="/user", tags=["user"])

# ---------------------------------- APP -----------------------------------------------


# get user info
@router.get("/me")
def get_user(current_user: Any = Depends(get_current_user)):
    user = supabase.table("user").select("*").eq(current_user).execute()

    if not user.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person with id {current_user} not found",
        )
    return user.data[0]


# update user
@router.put("/update")
def update_user(user: User, current_user: Any = Depends(get_current_user)):
    data = user.model_dump(mode="json", exclude_unset=True)

    if not data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update.",
        )

    response = supabase.table("user").update(data).eq("id", current_user).execute()
    if response.data:
        return {
            "status": "success",
            "user": response.data[0],
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Person with id {current_user} not found",
        )


# picture
@router.post("/upload-photo")
async def change_picture(
    photo: UploadFile = File(...), current_user: Any = Depends(get_current_user)
):
    try:
        file_content = await photo.read()
        file_extension = photo.filename.split(".")[-1]
        storage_path = f"/user_{current_user}.{file_extension}"

        response = supabase.storage.from_("images").upload(
            path=storage_path,
            file=file_content,
            file_options={"cache-control": "3600", "upsert": "true"},
        )

        public_url_response = supabase.storage.from_("images").get_public_url(
            storage_path
        )
        db_response = (
            supabase.table("user")
            .update({"photo": str(public_url_response)})
            .eq("id", current_user)
            .execute()
        )

        return {
            "status": "success",
            "url": public_url_response,
            "data": db_response.data,
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.delete("/delete-photo")
async def delete_picutre(
    photo: PhotoRequest, current_user: Any = Depends(get_current_user)
):
    try:
        file_path = photo.photo.split("/")[-1]

        supabase.storage.from_("images").remove([file_path])

        db_response = (
            supabase.table("user")
            .update({"photo": ""})
            .eq("id", current_user)
            .execute()
        )

        if not db_response.data:
            raise HTTPException(status_code=404, detail="User record not found")

        return {"status": "success"}

    except Exception as e:
        print(f"Delete error: {e}") # Keep logs for yourself
        raise HTTPException(status_code=400, detail=str(e))