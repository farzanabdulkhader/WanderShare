import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

//eslint-disable-next-line
function PlaceList({ places }) {
  return (
    <div className="place-list">
      {/* eslint-disable-next-line */}
      {places.map((place) => (
        <PlaceItem key={place.id} place={place} />
      ))}
    </div>
  );
}

export default PlaceList;
