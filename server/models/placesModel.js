import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { url: String, id: String },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User", // References the User model
  },
});

const Place = mongoose.model("Place", placeSchema);
export default Place;
