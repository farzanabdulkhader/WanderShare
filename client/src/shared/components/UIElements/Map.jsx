import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";

function Map({ location, address }) {
  const position = [location.lat, location.lng];

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true} id="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>{address}</Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map;
