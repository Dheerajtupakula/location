"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useGeolocated } from "react-geolocated";
import Link from "next/link";

const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
});

export default function LiveMap() {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 5000,
      maximumAge: 0,
    });

  const [tracking, setTracking] = useState(false);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let watchId;
    if (tracking) {
      if (isGeolocationEnabled && coords) {
        const newLocation = { lat: coords.latitude, lon: coords.longitude };
        setData([newLocation]);
        setShow(true);
      }

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setData([newLocation]);
        },
        (error) => console.error(error),
        {
          enableHighAccuracy: true,
          timeout: 3000,
          maximumAge: 0,
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [tracking, isGeolocationEnabled, coords]);

  const handleStartTracking = () => {
    setTracking(true);
  };
  useEffect(() => {
    setData(data);
  }, data);

  return (
    <main style={{ height: "100vh", width: "100%" }}>
      <button onClick={handleStartTracking} className=" m-10">
        Start
      </button>
      <Link href={"/"}>back</Link>
      {data.length > 0 && show && (
        <div>
          <MapComponent data={data} />
        </div>
      )}
    </main>
  );
}
