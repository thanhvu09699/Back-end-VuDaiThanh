import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  displayName: String,
  id: { type: String, default: 0 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  photoURL: String,
  role: { type: String, default: "normal" },
  favorites: { type: [Number], default: [] },
  watched: { type: [Number], default: [] },
});

export default mongoose.model("users", userSchema);
