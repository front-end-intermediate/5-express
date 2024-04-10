// const mongoose = require("mongoose");
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: String,
  description: String,
  image: String,
});

export default mongoose.model("Recipe", RecipeSchema);
