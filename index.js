/** @format */

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const blogRoutes = require("./routes/category");

//app
const app = express();

//db
mongoose
  .connect(process.env.DATABASE_CLOUD, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(cors());

//routes middleware
app.use("/api", blogRoutes);

//use this to show the image you have in node js server to client (react js)
app.use("/uploads", express.static("uploads"));




//port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});