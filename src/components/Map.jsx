import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent } from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CityContexts";
import ReactCountryFlag from "react-country-flag";
import { useGeolocation } from "../hooks/UseGeoLocaition";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {isLoading:isLoadingPosition ,position:geoLocaitionPosition, getPosition}= useGeolocation()
  const [mapLat,mapLng] = useUrlPosition()
  
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(function(){
    if(geoLocaitionPosition)setMapPosition([geoLocaitionPosition.lat,geoLocaitionPosition.lng])
  },[geoLocaitionPosition])

  return (
    <div className={styles.mapContainer} >
      {!geoLocaitionPosition && <Button type ="position" onClick={getPosition}>{isLoadingPosition?"Loading":"Use your position"}</Button>}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.mapContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>
                {" "}
                <ReactCountryFlag
                  countryCode={city.emoji}
                  svg
                  style={{
                    width: "1em",
                    height: "1em",
                  }}
                  title={city.country}
                />
              </span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter
          position={mapPosition}
          setMapPosition={setMapPosition}
        />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function DetectClick() {

  const navigate = useNavigate();

  useMapEvent({
    

    click : (e)=>{
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)},

  });
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);

  return null;
}

export default Map;
