import Film from "../models/film.model.js";

export const createFilm = async (req, res) => {
  const data = req.body;
  try {
    const newFilm = new Film({ ...data, createdAt: new Date().getTime() });
    await newFilm.save();
    res.status(200).json(newFilm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getFilms = async (req, res) => {
  try {
    const films = await Film.find();
    res.status(200).json(films);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteFilm = async (req, res) => {
  const id = req.params.id;
  try {
    const film = await Film.findByIdAndDelete(id);
    res.status(200).json(film);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateFilm = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const newFilm = await Film.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json(newFilm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSingleFilm = async (req, res) => {
  const id = req.params.id;
  try {
    const film = await Film.findById(id);
    if (!film) return res.status(404).json({ message: "Film not found by id" });
    res.status(200).json(film);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
