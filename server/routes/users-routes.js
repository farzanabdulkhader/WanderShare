import express from "express";
import { getUsers, login, signup } from "../controllers/users-controllers.js";
import { check } from "express-validator";
import { userImageUpload } from "../middlewares/file-upload.js";

const router = express.Router();

router.get("/", getUsers);

router.post("/login", login);

router.post(
  "/signup",
  userImageUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5 }),
  ],
  signup
);

export default router;
