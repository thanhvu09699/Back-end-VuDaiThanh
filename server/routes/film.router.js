import express from "express";
import { createFilm, getFilms, getSingleFilm, updateFilm, deleteFilm } from "../controllers/film.controller.js";

const route = express.Router();

route.post("/api/films", createFilm);
route.get("/api/films", getFilms);
route.get("/api/films/:id", getSingleFilm);
route.patch("/api/films/:id", updateFilm);
route.delete("/api/films/:id", deleteFilm);

export default route;
