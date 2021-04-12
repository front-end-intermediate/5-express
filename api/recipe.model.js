const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: String,
  created: {
    type: Date,
    default: Date.now,
  },
  description: String,
  image: String,
  ingredients: Array,
  preparation: Array,
});

module.exports = mongoose.model("Recipe", RecipeSchema);
