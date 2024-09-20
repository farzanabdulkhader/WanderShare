import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { url: String, id: String },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);
export default User;
