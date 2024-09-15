import { validationResult } from "express-validator";
import HttpError from "../utils/http-error.js";
import getCoord from "../utils/geocodingApi.js";
import mongoose from "mongoose";
import Place from "../models/placesModel.js";
import User from "../models/usersModel.js";
import fs from "fs";

// GET PLACE BY ID ------------------------------------------------------------------
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong. Couldn't find a place.", 500)
    );
  }

  if (!place) {
    return next(new HttpError("Couldn't find a place for the given ID.", 404));
  }

  // Convert Mongoose document to plain JavaScript object and send as response
  res.json({ place: place.toObject({ getters: true }) });
};

// GET PLACES BY USER ID ----------------------------------------------------------------
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithPlaces;
  try {
    // Find user by ID and populate their places
    // Populate is used to replace the user’s place references with actual place documents
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    return next(
      new HttpError("Fetching places failed. Please try again later.", 500)
    );
  }

  if (!userWithPlaces) {
    return next(new HttpError("Couldn't find user with the given ID.", 404));
  }
  // Map over the user's places, convert each to a plain JavaScript object, and send as response

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

// CREATE PLACE -------------------------------------------------------------
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed. Please check your data.", 422);
  }

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoord(address); // Get coordinates from the address
  } catch (err) {
    return next(new HttpError("Address not found.", 422));
  }

  // Create a new Place object using the Mongoose model
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    return next(new HttpError("Creating place failed. Please try again.", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find user for the provided ID.", 404));
  }

  try {
    // Start a session and transaction to ensure both the place and user updates are saved atomically
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess }); // Save the place within the transaction
    user.places.push(createdPlace); // Add the new place to the user's places array
    await user.save({ session: sess }); // Save the updated user document within the transaction
    await sess.commitTransaction(); // Commit the transaction
  } catch (err) {
    return next(new HttpError("Creating place failed. Please try again.", 500));
  }

  res.status(201).json({ place: createdPlace });
};

// UPDATE PLACE ------------------------------------------------------------------------
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed. Please check your data.", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid; // Extract place ID from request parameters

  let place;
  try {
    place = await Place.findById(placeId); // Find the place by its ID
  } catch (err) {
    return next(
      new HttpError("Something went wrong. Could not find place.", 500)
    );
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError("You are not allowed to edit this place", 401));
  }
  // Update the place with new data
  place.title = title;
  place.description = description;

  try {
    await place.save(); // Save the updated place
  } catch (err) {
    return next(new HttpError("Couldn't update place.", 500));
  }

  // Convert Mongoose document to plain JavaScript object and send as response
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// DELETE PLACE -------------------------------------------------------------
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid; // Extract place ID from request parameters

  let place;
  try {
    // Find the place by its ID and populate the creator field
    // Populate is used to access the full creator object rather than just the ID
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(
      new HttpError("Something went wrong. Could not find place.", 500)
    );
  }

  if (!place) {
    return next(
      new HttpError("Couldn't find place for the requested ID.", 404)
    );
  }

  if (place.creator.id !== req.userData.userId) {
    return next(new HttpError("You are not allowed to delete this place", 401));
  }

  const imagePath = place.image;

  try {
    // Start a session and transaction to ensure both the place deletion and user update are saved atomically
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess }); // Delete the place within the transaction
    place.creator.places.pull(place); // Remove the place reference from the user's places array
    await place.creator.save({ session: sess }); // Save the updated user document within the transaction
    await sess.commitTransaction(); // Commit the transaction
  } catch (err) {
    return next(
      new HttpError("Something went wrong. Could not delete place.", 500)
    );
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Place deleted successfully." });
};

export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
