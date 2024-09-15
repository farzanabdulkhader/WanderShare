import express from "express";
import { check } from "express-validator";
import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/places-controllers.js";
import { placeImageUpload } from "../middlewares/file-upload.js";
import checkAuth from "../middlewares/check-auth.js";

const router = express.Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

router.use(checkAuth);

router.post(
  "/",
  placeImageUpload.single("image"),
  [
    // Validation checks for the request body
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);

router.delete("/:pid", deletePlace);

export default router;
