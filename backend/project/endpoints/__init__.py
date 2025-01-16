from fastapi import FastAPI

from project.endpoints import map
from project.dependencies import lifespan

app = FastAPI(root_path="/api", lifespan=lifespan)
app.include_router(map.app, prefix='/map')
