import geemap
import matplotlib as mpl
import numpy as np
from PIL import Image
from dotenv import load_dotenv
from fastapi import APIRouter, Depends
from fastapi import HTTPException
from fastapi.responses import FileResponse

from project import api_models as am
from project.dependencies import earth_engine
from project.utils import preprocess, create_patches, predict

load_dotenv()

app = APIRouter()


@app.post("/predict")
async def get_photo(figure: am.Figure,
                    engine=Depends(earth_engine)):
    try:
        geojsonObject = {
            "type": "Polygon",
            "coordinates": [[[cords.lng, cords.lat] for cords in figure.polygon[0]]]
        }
        roi = engine.Geometry(geojsonObject)

        image = engine.ImageCollection('COPERNICUS/S2_SR') \
            .filterBounds(roi) \
            .filterDate('2021-06-01', '2021-06-30') \
            .sort('CLOUD_COVER') \
            .first() \
            .clip(roi)

        landcover = engine.Image('ESA/WorldCover/v100/2020') \
            .select('Map') \
            .clip(roi)

        image_np = geemap.ee_to_numpy(image, region=roi, scale=figure.scale)
        landcover_np = geemap.ee_to_numpy(landcover, region=roi, scale=figure.scale)

        image_np, landcover_np = preprocess(image_np, landcover_np)

        img_patches, mask_patches = create_patches(image_np, landcover_np, figure.patch_size)

        print(f"Количество патчей: {img_patches.shape[0]}")
        mask_k_nearest, mask_decision_tree, mask_random_forest, mask_naice_bayes, y_pred_full = predict(img_patches,
                                                                                                        mask_patches,
                                                                                                        image_np,
                                                                                                        figure.patch_size)

        mask_orig_rgb = mpl.cm.jet(mask_k_nearest / mask_k_nearest.max())
        mask_orig_rgb = (mask_orig_rgb * 255).astype(np.uint8)
        mask_orig_image = Image.fromarray(mask_orig_rgb)
        mask_orig_image.save('mask_k_nearest.png')

        mask_orig_rgb = mpl.cm.jet(mask_decision_tree / mask_decision_tree.max())
        mask_orig_rgb = (mask_orig_rgb * 255).astype(np.uint8)
        mask_orig_image = Image.fromarray(mask_orig_rgb)
        mask_orig_image.save('mask_decision_tree.png')

        mask_orig_rgb = mpl.cm.jet(mask_random_forest / mask_random_forest.max())
        mask_orig_rgb = (mask_orig_rgb * 255).astype(np.uint8)
        mask_orig_image = Image.fromarray(mask_orig_rgb)
        mask_orig_image.save('mask_random_forest.png')

        mask_orig_rgb = mpl.cm.jet(mask_naice_bayes / mask_naice_bayes.max())
        mask_orig_rgb = (mask_orig_rgb * 255).astype(np.uint8)
        mask_orig_image = Image.fromarray(mask_orig_rgb)
        mask_orig_image.save('mask_naice_bayes.png')

        mask_orig_rgb = mpl.cm.jet(y_pred_full / y_pred_full.max())
        mask_orig_rgb = (mask_orig_rgb * 255).astype(np.uint8)
        mask_orig_image = Image.fromarray(mask_orig_rgb)
        mask_orig_image.save('y_pred_full.png')

        print(f"Изображение сохранено")
        return "Ok"

    except Exception as e:
        if 'Total request size' in str(e) or 'Pixel grid dimensions' in str(e):
            raise HTTPException(status_code=400, detail="Увеличьте scale")
        else:
            raise HTTPException(status_code=400, detail=str(e))


@app.get("/image")
async def get_photo(image:str, key: str):
    print(key)
    return FileResponse(f'{image}.png',
                        media_type="image/png")
