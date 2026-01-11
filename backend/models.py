from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from enum import Enum

# ------- ENUMS --------------
class Sex(str, Enum):
    MALE = "M"
    FEMALE = "F"
    UNDISCLOSED = "U"


class Status(str, Enum):
    LIVE = "L"
    DECEASED = "D"
    UNKNOWN = "U"


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
    deathplace: Optional[str] = None
    sex: Optional[Sex] = Sex.UNDISCLOSED
    status: Optional[Status] = Status.UNKNOWN
    pid1: Optional[int] = None
    pid2: Optional[int] = None
    partner_id: Optional[List[int]] = None
    family_id: Optional[str] = None


class Family(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    name: Optional[str]

class PersonUpdate(BaseModel):
    firstname: Optional[str] = None
    middlename: Optional[str] = None
    lastname: Optional[str] = None
    governorate: Optional[str] = None
    district: Optional[str] = None
    area: Optional[str] = None
    birth: Optional[date] = None
    pid1: Optional[int] = None
    pid2: Optional[int] = None
    death: Optional[date] = None
    sex: Optional[Sex] = None
    status: Optional[Status] = None
    photo: Optional[str] = None
    partner_id: Optional[List[int]] = None
    family_id: Optional[str] = None
    deathplace: Optional[str] = None
    
    
class PersonCreate(BaseModel):
    photo: Optional[str] = None
    firstname: Optional[str] = None
    middlename: Optional[str] = None
    lastname: Optional[str] = None
    sex: Optional[Sex] = "U"
    family_id: Optional[str] = None
    partner_id:Optional[List[int]] = None
    pid1: Optional[int] = None
    pid2: Optional[int] = None
    
    
#------------------ AUTH --------------------------
class UserAuth(BaseModel):
    email: str
    password: str
    
class EmailRequest(BaseModel):
    email: str
    
class FamilyNameUpdate(BaseModel):
    new_name: str