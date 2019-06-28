const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.static('static'));

const RecipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

// Note recipes? = the database we will use on Atlas
const dev_db_url =
  'mongodb+srv://daniel:dd2345@recipes-3k4ea.mongodb.net/recipes?retryWrites=true&w=majority';

var mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose
  .connect(mongoDB, { useNewUrlParser: true })
  .then(() => console.log('MongoDb connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  console.log(__dirname);
  res.sendFile(__dirname + '/app/index.html');
});

app.get('/api/recipes', (req, res) => {
  Recipe.find({}, function(err, results) {
    return res.send(results);
  });
});

app.get('/api/import', (req, res) => {
  Recipe.create(
    {
      title: 'Lasagna',
      description:
        'Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.',
      image: 'lasagna.png',
    },
    {
      title: 'Pho-Chicken Noodle Soup',
      description:
        'Pho (pronounced "fuh") is the most popular food in Vietnam, often eaten for breakfast, lunch and dinner. It is made from a special broth that simmers for several hours infused with exotic spices and served over rice noodles with fresh herbs.',
      image: 'pho.png',
    },
    {
      title: 'Guacamole',
      description:
        'Guacamole is definitely a staple of Mexican cuisine. Even though Guacamole is pretty simple, it can be tough to get the perfect flavor - with this authentic Mexican guacamole recipe, though, you will be an expert in no time.',
      image: 'guacamole.png',
    },
    {
      title: 'Hamburger',
      description:
        'A Hamburger (often called a burger) is a type of sandwich in the form of  rounded bread sliced in half with its center filled with a patty which is usually ground beef, then topped with vegetables such as lettuce, tomatoes and onions.',
      image: 'hamburger.png',
    },
    function(err) {
      if (err) return console.log(err);
      return res.sendStatus(202);
    },
  );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running at ${PORT}`));
