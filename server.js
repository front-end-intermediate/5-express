const express = require('express');
const mongoose = require('mongoose');
const recipes = require('./recipe.controllers');

const app = express();

const Schema = mongoose.Schema;

const recipeModels = require('./recipe.model');
const Recipe = mongoose.model('Recipe', RecipeSchema);

const dataBaseURL =
  'mongodb+srv://daniel:dd2345@recipes-3k4ea.mongodb.net/test?retryWrites=true&w=majority';

mongoose
  .connect(dataBaseURL, { useNewUrlParser: true })
  .then(() => console.log('MongoDb connected'))
  .catch(err => console.log(err));

app.get('/api/recipes', recipes.findAll);
app.get('/api/recipes/:id', recipes.findById);
app.post('/api/recipes', recipes.add);
app.put('/api/recipes/:id', recipes.update);
app.delete('/api/recipes/:id', recipes.delete);
app.get('/api/import', recipes.import);

// our first route
app.get('/', (req, res) => {
  console.log(__dirname);
  res.sendFile(__dirname + '/other/index.html');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running at ${PORT}`));
