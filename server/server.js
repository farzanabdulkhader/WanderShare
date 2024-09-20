import placesRoutes from "./routes/places-routes.js";
import usersRoutes from "./routes/users-routes.js";
import HttpError from "./utils/http-error.js";
import bodyParser from "body-parser";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();
// app.use(cors());

const corsOptions = {
  origin: process.env.FRONTEND_URL || "*", // Fallback to allow all origins if not set
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

if (!process.env.FRONTEND_URL) {
  console.warn(
    "Warning: FRONTEND_URL is not defined, defaulting to allow all origins."
  );
}

app.use(cors(corsOptions));

app.use(bodyParser.json());

// Define routes
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// Handle unknown routes
app.use((req, res, next) => {
  const error = new HttpError("Requested route not found", 404);
  next(error);
});

// Global error handler
app.use((error, req, res, next) => {
  // Cloudinary cleanup
  if (req.file && req.file.cloudinaryPublicId) {
    cloudinary.v2.uploader.destroy(
      req.file.cloudinaryPublicId,
      (err, result) => {
        if (err) {
          console.error("Error deleting file from Cloudinary:", err);
        } else {
          console.log("Cloudinary image deleted:", result);
        }
      }
    );
  }

  if (res.headersSent) {
    return next(error);
  }
  // Ensure the status code is valid
  const statusCode =
    error.code && Number.isInteger(error.code) ? error.code : 500;
  res.status(statusCode).json({
    message: error.message || "An unknown error occurred",
  });
});

// Connect to the database and start the server
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.x6zhruo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    )
  )
  .catch((err) => console.log("Database connection error:", err.message));
