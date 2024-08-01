const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const singup = async (req, res, next) => {
  const { name, email, password } = req.body;
  let exist;
  try {
    exist = await User.findOne({ email });
  } catch (error) {
    console.log("Error", error);
  }
  if (exist) {
    return res.status(400).json({ message: "User already exist, instead loggin" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    await user.save();

    console.log("user signUp successfully");
    res.status(200).json({ message: "User signUp successfully", user });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let exist;
  try {
    exist = await User.findOne({ email: email });
  } catch (error) {
    console.log("Error", error);
  }
  if (!exist) {
    return res.status(400).json({ message: "user doesn't exist" });
  }
  const isCorrectPassword = bcrypt.compareSync(password, exist.password);
  if (!isCorrectPassword) {
    return res.status(400).json({ message: "Incorrect password" });
  }
  const token = jwt.sign({ id: exist._id }, process.env.SECRET_KEY, {
    expiresIn: "1h"
  });
  res.cookie(String(exist._id), token, {
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60),
    httpOnly: true,
    sameSite: 'lax'
  });

  return res.status(200).json({ message: "Successfully logged in", user: exist, token });
}

const verifytoken = async (req, res, next) => {
  const cookies = req.headers.cookie;

  if (!cookies) {
    return res.status(401).json({ message: "Unauthorized - No cookies found" });
  }

  const token = cookies.split("=")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token found" });
  }

  jwt.verify(String(token), process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid token" });
    }
    req.id = user.id;
    next();
  });
}


const getUser = async (req, res, next) => {
  const userId = req.id;
  let user;
  try {
    user = await User.findById(userId, '-password');
  } catch (error) {
    console.log("Error occurred while finding user ", error);
  }
  if (!user) {
    return res.status(400).json({ message: "User doesn't exist" });
  }
  return res.status(200).json({ user });
}

exports.signup = singup;
exports.login = login;
exports.verifytoken = verifytoken;
exports.getUser = getUser;
