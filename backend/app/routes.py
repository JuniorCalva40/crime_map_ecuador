from fastapi import APIRouter
from fastapi.params import Query, Optional
from enum import Enum
from app.services import process_crime_data, get_location_details

class WeaponType(str, Enum):
    knife = "ARMA BLANCA"
    firearm = "ARMA DE FUEGO"
    others = "OTROS"

class SexType(str, Enum):
    male = "HOMBRE"
    female = "MUJER"

router = APIRouter()

@router.get("/crime-data")
async def get_crime_data(
    gender: Optional[str] = Query(None, alias="gender"),
    weapon: Optional[str] = Query(None, alias="weapon"),
    age_min: Optional[int] = Query(None, alias="age_min"),
    age_max: Optional[int] = Query(None, alias="age_max"),
    year: Optional[int] = Query(None, description="Año para filtrar (ej: 2023)")
):
    weapon_value = None
    gender_value = None
    
    if weapon:
        weapon_map = {
            "knife": "ARMA BLANCA",
            "firearm": "ARMA DE FUEGO",
            "others": "OTROS"
        }
        weapon_value = weapon_map.get(weapon.lower())
    
    if gender:
        gender_map = {
            "male": "HOMBRE",
            "female": "MUJER"
        }
        gender_value = gender_map.get(gender.lower())
    
    return process_crime_data(gender_value, weapon_value, age_min, age_max, year)



@router.get("/crime-data/details-by-location")
async def get_crime_details_by_location(
    latitude: float = Query(..., description="Latitud de la ubicación"),
    longitude: float = Query(..., description="Longitud de la ubicación")
):
    return get_location_details(latitude, longitude)
