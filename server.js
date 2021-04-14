const express = require("express");
const mongoose = require("mongoose");

const recipeModel = require("./api/recipe.model");
const recipeControllers = require("./api/recipe.controllers");

const app = express();

const dataBaseURL = process.env.DB_URL || "mongodb://localhost:27017";

mongoose
  .connect(dataBaseURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log(err));

app.use(express.static("static"));
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/static/index.html");
});

app.get("/api/recipes", recipeControllers.findAll);
// app.get("/api/recipes/:id", recipeControllers.findById);
app.post("/api/recipes", recipeControllers.add);
// app.put("/api/recipes/:id", recipeControllers.update);
app.delete("/api/recipes/:id", recipeControllers.delete);
app.get("/api/import", recipeControllers.import);
app.get("/api/killall", recipeControllers.killall);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
