from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import date
from enum import Enum
from fastapi import File, UploadFile
# ------- ENUMS --------------
class Sex(str, Enum):
    MALE = "M"
    FEMALE = "F"
    UNDISCLOSED = "U"


class Status(str, Enum):
    LIVE = "L"
    DECEASED = "D"
    any = "U"


# ------- MODELS --------------
class Person(BaseModel):
    id: Optional[int] = None
    firstname: Optional[str] = None
    middlename: Optional[str] = None
    lastname: Optional[str] = None
    birth: Optional[date] = None
    death: Optional[date] = None
    photo: Optional[str] = None
    governorate: Optional[str] = None
    district: Optional[str] = None
    area: Optional[str] = None
    sex: Optional[Sex] = Sex.UNDISCLOSED
    status: Optional[Status] = Status.any
    pid1: Optional[int] = None
    pid2: Optional[int] = None
    partner_id: Optional[List[int]] = None
    family_id: Optional[str] = None
    country: Optional[str] = None
    country_of_death: Optional[str] = None
    death_governorate: Optional[str] = None
    death_area: Optional[str] = None
    death_district: Optional[str] = None


class Family(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    name: Optional[str]
    
class UserAuth(BaseModel):
    email: str
    password: str
    
class EmailRequest(BaseModel):
    email: str
    
class FamilyNameUpdate(BaseModel):
    new_name: str