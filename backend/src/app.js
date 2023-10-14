import "dotenv/config";
import logger from "morgan";
import express from "express";
import mongoose from "mongoose";
import createError from "http-errors";
import cookieParser from "cookie-parser";

import databaseConfig from "../config/database.config.js";
import v1Router from "./api/v1/routes/index.route.js";

const app = express();

mongoose.set("strictQuery", false);
const env = process.env.NODE_ENV || "development";
const dbConfig = databaseConfig[env];

try {
    await mongoose.connect(dbConfig.url, dbConfig.options);
    console.log("Connected to MongoDB");
} catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
}

app.use(logger(process.env.MORGAN_LOG_FORMAT));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1", v1Router);

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.json({ error: err.message });
});

export default app;
