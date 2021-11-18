import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: String,
  created: {
    type: Date,
    default: Date.now,
  },
  description: String,
  image: String,
});

// const recipeModel = mongoose.model("Recipe", RecipeSchema);

export default mongoose.model("Recipe", RecipeSchema);
