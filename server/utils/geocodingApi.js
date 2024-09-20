import fetch from "node-fetch";
import HttpError from "./http-error.js";

var requestOptions = {
  method: "GET",
};

async function getCoord(address) {
  const encodedAddress = encodeURIComponent(address);
  const res = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&apiKey=${process.env.production.GEOCODING_API_KEY}`,
    requestOptions
  );
  const data = await res.json();
  const coordinates = data.features[0].geometry.coordinates;
  if (!data || coordinates.length === 0) {
    throw new HttpError(
      "Could not find location for the specified address.",
      422
    );
  }

  return { lat: coordinates[1], lng: coordinates[0] };
}

export default getCoord;
