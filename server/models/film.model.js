import mongoose from "mongoose";

const filmSchema = mongoose.Schema({
  title: String,
  category: String,
  country: String,
  description: String,
  directors: String,
  episode: String,
  evaluate: { type: Number, default: 10 },
  image: { type: String, required: true },
  isMultiEp: String,
  stars: String,
  upComing: String,
  url: { type: String, required: true },
  createdAt: { type: Number, default: new Date().getTime() },
});

export default mongoose.model("films", filmSchema);
