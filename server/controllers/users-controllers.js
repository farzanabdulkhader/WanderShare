import HttpError from "../utils/http-error.js";
import { validationResult } from "express-validator";
import User from "../models/usersModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import getDataUrl from "../bufferGenerator.js";

// GET ALL USERS
const getUsers = async (req, res, next) => {
  let users;
  try {
    // Fetch all users from the database, excluding the password field
    users = await User.find({}, "-password");
  } catch (error) {
    return next(
      new HttpError("Fetching users failed, please try again later.", 500)
    );
  }
  // Convert Mongoose documents to plain JavaScript objects and send as response
  res.status(200).json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

// SIGNUP  ---------------------------------------------------------------------
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    // Check if a user with the given email already exists
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.error("Error finding existing user:", err);
    return next(new HttpError("Signup failed, please try again later.", 500));
  }

  // If user already exists, return an error
  if (existingUser) {
    return next(
      new HttpError("Email already exists, please log in instead.", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Could not create user. Please try again"));
  }

  let image;
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileBuffer = getDataUrl(file);
    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);

    image = {
      url: cloud.secure_url,
      id: cloud.public_id,
    };
  } catch (err) {
    console.log(err);
  }

  // Create a new User object using the Mongoose model
  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image,
    places: [], // Initialize with an empty array of places
  });

  try {
    // Save the new user to the database
    await createdUser.save();
  } catch (err) {
    console.error("Error saving new user:", err);
    return next(new HttpError("Signup failed, please try again.", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.production.JWT_KEY,
      { expiresIn: "1hr" }
    );
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  // Convert Mongoose document to plain JavaScript object and send as response
  res.status(201).json({
    user: {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
    },
    token: token,
  });
};

// LOGIN ------------------------------------------------------------------------
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    // Find the user by email
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.error("Error finding existing user:", err);
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  // Check if user exists and password matches
  if (!existingUser) {
    return next(new HttpError("User does not Exist.", 403));
  }

  let validPassword = false;
  try {
    validPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 403)
    );
  }

  if (!validPassword) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 403)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.production.JWT_KEY,
      { expiresIn: "1hr" }
    );
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  res.status(200).json({
    user: {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
    },
    token: token,
  });
};

export { getUsers, login, signup };
