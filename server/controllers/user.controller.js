import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    let { displayName, password, passwordCheck, email, photoURL } = req.body;
    if (!password || !email || !passwordCheck)
      return res.status(400).json({ message: "email and password must fill in" });
    if (password.length < 5) return res.status(400).json({ message: "password length can't least than 5" });
    if (password !== passwordCheck) return res.status(400).json({ message: "password different password confirm" });
    const existingUser = await User.findOne({ email: email });
    if (existingUser) return res.status(400).json({ message: "this email already exists" });
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    if (!displayName) displayName = email;
    if (!photoURL) {
      const newUser = new User({
        displayName,
        email,
        password: passwordHash,
      });
      const saveUser = await newUser.save();
      res.status(200).json(saveUser);
    } else {
      const newUser = new User({
        displayName,
        email,
        photoURL,
        password: passwordHash,
      });
      const saveUser = await newUser.save();
      res.status(200).json(saveUser);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "must fill in email and password to login" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "user not exist may be email or password incorrect" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: " email or password incorrect" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      token: token,
      user: {
        displayName: user.displayName,
        photoURL: user.photoURL,
        _id: user._id,
        favorites: user.favorites,
        watched: user.watched,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const loginGoogleUser = async (req, res) => {
  try {
    const { email, imageUrl, name, googleId } = req.body;
    const existing = await User.findOne({ id: googleId });
    let newUser;
    if (!existing) {
      newUser = new User({
        id: googleId,
        email: `Email Google:${email}`,
        photoURL: imageUrl,
        displayName: name,
        password: googleId,
      });
      await newUser.save();
    } else {
      newUser = await User.findByIdAndUpdate(existing._id, { displayName: name, photoURL: imageUrl }, { new: true });
    }
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.status(200).json({
      token,
      user: {
        displayName: newUser.displayName,
        photoURL: newUser.photoURL,
        _id: newUser._id,
        favorites: newUser.favorites,
        watched: newUser.watched,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const isValidToken = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(400).send(false);
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) return res.status(400).send(false);
    const user = await User.findById(verify.id);
    if (!user) return res.status(400).send(false);
    res.status(200).json(true);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(400).json({ message: "No user  be deleted." });
    res.status(200).json({ displayName: deletedUser.displayName, email: deletedUser.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUser = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    res.status(200).json({
      displayName: user.displayName,
      photoURL: user.photoURL,
      _id: user._id,
      favorites: user.favorites,
      watched: user.watched,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const addFavorite = async (req, res) => {
  const idFilm = req.body;
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ error: "user not found by id" });
    const newUser = await User.findByIdAndUpdate(
      id,
      { favorites: [...user.favorites, parseInt(idFilm.id)] },
      { new: true }
    );
    res.status(200).json({
      displayName: newUser.displayName,
      photoURL: newUser.photoURL,
      _id: newUser._id,
      favorites: newUser.favorites,
      watched: newUser.watched,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const removeFavorite = async (req, res) => {
  const idFilm = req.body;
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ error: "user not found by id" });
    const newUser = await User.findByIdAndUpdate(
      id,
      {
        favorites: user.favorites.filter((film) => film !== parseInt(idFilm.id)),
      },
      { new: true }
    );
    res.status(200).json({
      displayName: newUser.displayName,
      photoURL: newUser.photoURL,
      _id: newUser._id,
      favorites: newUser.favorites,
      watched: newUser.watched,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const addWatched = async (req, res) => {
  const idFilm = req.body;
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ error: "user not found by id" });
    const newUser = await User.findByIdAndUpdate(
      id,
      { watched: [...user.watched, parseInt(idFilm.id)] },
      { new: true }
    );
    res.status(200).json({
      displayName: newUser.displayName,
      photoURL: newUser.photoURL,
      _id: newUser._id,
      favorites: newUser.favorites,
      watched: newUser.watched,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFavorites = async (req, res) => {
  const id = req.params.id;
  try {
    const resultCombine = await User.aggregate([
      {
        $lookup: {
          from: "films",
          localField: "favorites",
          foreignField: "createdAt",
          as: "fav",
        },
      },
    ]);

    const fav = resultCombine.find((user) => user._id.toString() === id)?.fav;
    res.status(200).json(fav);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getWatched = async (req, res) => {
  const id = req.params.id;
  try {
    const resultCombine = await User.aggregate([
      {
        $lookup: {
          from: "films",
          localField: "watched",
          foreignField: "createdAt",
          as: "wat",
        },
      },
    ]);
    console.log(resultCombine.find((user) => user._id.toString() === id));
    const wat = resultCombine.find((user) => user._id.toString() === id)?.wat;
    console.log(wat);
    res.status(200).json(wat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
