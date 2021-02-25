import express from "express";
import {
  registerUser,
  loginUser,
  isValidToken,
  deleteUser,
  getUser,
  getFavorites,
  getWatched,
  addFavorite,
  addWatched,
  removeFavorite,
  loginGoogleUser,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";

const route = express.Router();

route.post("/api/users/register", registerUser);
route.post("/api/users/login", loginUser);
route.post("/api/users/isValidToken", isValidToken);
route.delete("/api/users/:id", deleteUser);
route.get("/api/users", auth, getUser);
route.post("/api/users/loginGoogle", loginGoogleUser);
route.get("/api/users/fav/:id", getFavorites);
route.get("/api/users/wat/:id", getWatched);
route.patch("/api/users/addfav/:id", addFavorite);
route.patch("/api/users/addwat/:id", addWatched);
route.patch("/api/users/removefav/:id", removeFavorite);

export default route;
