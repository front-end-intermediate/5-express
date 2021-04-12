const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: String,
  description: String,
  image: String,
});

module.exports = mongoose.model("Recipe", RecipeSchema);
