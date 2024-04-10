import recipeModel from "./recipeModel.js";

export const findAll = function (req, res) {
  recipeModel.find({}).then((data) => res.send(data));
};
export const findById = function () {};
export const add = function () {};
export const update = function () {};
export const deleteRecipe = function () {};

// exports.findAll = function (req, res) {
//     Recipe.find({}, function (err, results) {
//       return res.send(results);
//     });
//   };
