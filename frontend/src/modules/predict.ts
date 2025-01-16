import { fastFetch } from "./fastapi";

export interface Coordinates {
  LatLng: { lat: number; lng: number };
}

export interface Figure {
  polygon: Coordinates[][];
  scale: string;
  patch_size: string;
}

export async function getPredict(data: Figure) {
  try {
    console.log(data);
    const requestObject = new Request(
      process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL + `/api/map/predict` : `/api/map/predict`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    return await fastFetch<any>(requestObject);
  } catch (error) {
    console.error("getPredict error", error.extra);
    throw error;
  }
}
