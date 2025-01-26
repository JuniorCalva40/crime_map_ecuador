from fastapi import APIRouter
from fastapi.params import Query, Optional
from app.services import process_crime_data

router = APIRouter()

@router.get("/crime-data")
async def get_crime_data(
    sexo: Optional[str] = Query(None, alias="sexo"),
    type_weapon: Optional[str] = Query(None, alias="tipo_arma"),
    age_min: Optional[int] = Query(None, alias="edad_min"),
    age_max: Optional[int] = Query(None, alias="edad_max")
):
    return process_crime_data()