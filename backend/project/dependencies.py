import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
load_dotenv()

class EarthEngine:
    def __init__(self, project_name):
        import ee
        ee.Authenticate()
        ee.Initialize(project=project_name)
        self.project_ee = ee

    async def __call__(self):
        return self.project_ee


earth_engine = EarthEngine(os.environ.get('PROJECT_NAME'))


@asynccontextmanager
async def lifespan(_):
    yield
