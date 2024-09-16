import placesRoutes from "./routes/places-routes.js";
import usersRoutes from "./routes/users-routes.js";
import bodyParser from "body-parser";
import HttpError from "./utils/http-error.js";
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import fs from "fs";

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "*", // Fallback to allow all origins if not set
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

if (!process.env.FRONTEND_URL) {
  console.warn(
    "Warning: FRONTEND_URL is not defined, defaulting to allow all origins."
  );
}

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(
  "/uploads/user-images",
  express.static(path.join("uploads", "user-images"))
);

app.use(
  "/uploads/place-images",
  express.static(path.join("uploads", "place-images"))
);

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
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });
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
