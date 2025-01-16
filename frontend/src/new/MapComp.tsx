import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { MapContainer, TileLayer, useMap, ImageOverlay } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import { getPredict, Coordinates } from "@/modules/predict";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Controller, useForm } from "react-hook-form";
import { Image } from "@nextui-org/image";

interface Props {
  coords: Coordinates[][];
  setCoords: (coords: Coordinates[][]) => void;
}

function DrawPolygon(props: Props) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: true,
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (event) {
      const layer = event.layer;
      drawnItems.addLayer(layer);
      props.setCoords(layer.getLatLngs());
    });
  }, [map]);

  return null;
}

function MapComp() {
  const [polygon, setPolygon] = useState<Coordinates[][]>();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
  const [image, setImage] = useState(false);
  const [allModels, setAllModels] = useState(false);
  const [bounds, setBounds] = useState();
  const [imageKey, setImageKey] = useState(Date.now());

  const { control, handleSubmit } = useForm({
    defaultValues: {
      scale: "",
      patch_size: "",
    },
  });

  const onButton = () => {
    if (allModels) {
      setAllModels(false);
    } else {
      setAllModels(true);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage("");
    setImage(false);
    const { scale, patch_size } = data;
    setIsLoading(true); // Включаем индикатор загрузки
    try {
      const result = await getPredict({ polygon, scale, patch_size });
      setErrorMessage(""); // Очистить ошибки, если запрос успешен
      setImage(true);
      console.log("Пришоу");
    } catch (err) {
      // console.log(err)
      setErrorMessage(err.extra.detail); // Установить сообщение об ошибке
    } finally {
      setBounds([[Math.min(...polygon[0].map(coord => coord.lat)), Math.min(...polygon[0].map(coord => coord.lng))],[Math.max(...polygon[0].map(coord => coord.lat)), Math.max(...polygon[0].map(coord => coord.lng))]])
      console.log(bounds)
      setImageKey(Date.now());
      setIsLoading(false); // Выключаем индикатор загрузки
    }
  });

  return (
    <>
      <MapContainer center={[55.8, 37.7]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <DrawPolygon coords={polygon} setCoords={setPolygon} />
        {image && (
          <ImageOverlay
            url={`/api/map/image?image=mask_random_forest&key=${imageKey}`}
            bounds={bounds}
          />
        )}
      </MapContainer>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-3">
          <Controller
            name="scale"
            control={control}
            rules={{ required: "Укажите метры на пиксель" }}
            render={({ field, fieldState }) => (
              <Input {...field} label="Скейл" isInvalid={fieldState.invalid} errorMessage={fieldState.error?.message} />
            )}
          />
          <Controller
            name="patch_size"
            control={control}
            rules={{ required: "Размер патча" }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Размер патча"
                isInvalid={fieldState.invalid}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
          {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
        </div>
        <Button type="submit" color="primary">
          Кнопка
        </Button>
      </form>
      <Button onClick={() => onButton()} color="primary">
        Отобразить результаты всех моделей!
      </Button>
      {isLoading && (
        <div className="flex justify-center gap-4">
          <Spinner size="lg" />
        </div>
      )}
      {image && !allModels && <Image src={`/api/map/image?image=y_pred_full&key=${imageKey}`} />}
      {image && allModels && (
        <div className="flex flex-col">
          <Image src={`/api/map/image?image=mask_k_nearest&key=${imageKey}`} />
          <Image src={`/api/map/image?image=mask_decision_tree&key=${imageKey}`} />
          <Image src={`/api/map/image?image=mask_random_forest&key=${imageKey}`} />
          <Image src={`/api/map/image?image=mask_naice_bayes&key=${imageKey}`} />
        </div>
      )}
    </>
  );
}

export default MapComp;
