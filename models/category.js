/** @format */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      min: 3,
      max: 160,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    icon:{
      type:String
    },
    parent:
    {
        type: String,
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);