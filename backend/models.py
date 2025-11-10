from pydantic import BaseModel
from typing import Optional
from datetime import date
from enum import Enum

#------- ENUMS --------------
class Sex(str,Enum):
    MALE = "M"
    FEMALE = "F"
    UNDISCLOSED = "U"

class Role(str,Enum):
    CHILD = "Child"
    ADOPTED_CHILD = "Adopted_child"
    SPOUSE = "Spouse"
    PARTNER = "Partner"

#------- MODELS --------------
class Person(BaseModel):  
    id: Optional[int] = None
    firstname: str
    middlename: Optional[str] = None
    lastname: Optional[str] = None
    birth: Optional[date] = None
    death: Optional[date] = None
    photo: Optional[str] = None
    birth_governorate: Optional[str] = None
    birth_district: Optional[str] = None
    birth_area: Optional[str] = None
    death_governorate: Optional[str] = None
    death_district: Optional[str] = None
    death_area: Optional[str] = None
    sex: Sex = Sex.UNDISCLOSED
    family_id : int
    pid1: Optional[int]
    pid2: Optional[int]

class Relationship(BaseModel):
    person: int
    related_person: int
    relationship_type: Role
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    
class Family(BaseModel):
    id: Optional[int] = None
    user_id: int
    lastname: Optional[str]
    