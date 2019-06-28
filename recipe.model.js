const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: String,
  title: String,
  date: String,
  description: String,
  image: String,
});

module.exports = mongoose.model('Recipe', RecipeSchema);
