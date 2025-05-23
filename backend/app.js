require("dotenv").config({ path: "backend/config/config.env" });
const express = require("express");
const path = require("path");
const User = require("./models/User");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
const errorMiddleware = require("./middlewares/error");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const userRoute = require("./routes/userRoute");
app.use("/api", userRoute);

const instructorRoute = require("./routes/instructorRoute");
app.use("/api", instructorRoute);

const courseRoute = require("./routes/courseRoute");
app.use("/api", courseRoute);

app.use(errorMiddleware);

module.exports = app;
