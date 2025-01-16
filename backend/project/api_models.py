from typing import List

from pydantic import BaseModel

class Cords(BaseModel):
    lat: float
    lng: float

class Figure(BaseModel):
    polygon: List[List[Cords]]
    scale: int
    patch_size: int