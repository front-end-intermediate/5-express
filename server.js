import {
  findAll,
  findById,
  add,
  update,
  deleteRecipe,
  importRecipes,
  killall,
} from "./api/recipeControllers.js";

import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const dataBaseURL = process.env.DB_URL || "mongodb://localhost:27017";

mongoose
  .connect(dataBaseURL, {})
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log(err));

app.use(express.static("public"));
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/static/index.html");
});

app.get("/api/recipes", findAll);
app.get("/api/recipes/:id", findById);
app.post("/api/recipes", add);
app.put("/api/recipes/:id", update);
app.delete("/api/recipes/:id", deleteRecipe);
app.get("/api/import", importRecipes);
app.get("/api/killall", killall);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
