import express from "express";
const app = express();
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import recipeModel from "./api/recipe.model.js";
import {
  findAll,
  findById,
  add,
  update,
  del,
  seed,
  killall,
  upload,
} from "./api/recipe.controllers.js";

const dataBaseURL = process.env.DB_URL || "mongodb://localhost:27017";

mongoose
  .connect(dataBaseURL, { useNewUrlParser: true })
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log(err));

app.use(express.static("public"));
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/static/index.html");
});

app.get("/api/recipes", findAll);
app.get("/api/recipes/:id", findById);
app.post("/api/recipes", add);
app.put("/api/recipes/:id", update);
app.delete("/api/recipes/:id", del);
app.get("/api/import", seed);
app.get("/api/killall", killall);
app.post("/api/upload", upload);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
