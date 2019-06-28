const express = require('express');
const mongoose = require('mongoose');

const app = express();

const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: String,
  title: String,
  date: String,
  description: String,
  image: String,
});
const Recipe = mongoose.model('Recipe', RecipeSchema);

const dataBaseURL =
  'mongodb+srv://daniel:dd2345@recipes-3k4ea.mongodb.net/test?retryWrites=true&w=majority';

mongoose
  .connect(dataBaseURL, { useNewUrlParser: true })
  .then(() => console.log('MongoDb connected'))
  .catch(err => console.log(err));

// our first route
app.get('/', (req, res) => {
  console.log(__dirname);
  res.sendFile(__dirname + '/other/index.html');
});

app.get('/api/import', (req, res) => {
  Recipe.create(
    {
      name: 'recipe1309',
      title: 'Lasagna',
      date: '2013-09-01',
      description:
        'Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.',
      image: 'lasagna.png',
    },
    {
      name: 'recipe1404',
      title: 'Pho-Chicken Noodle Soup',
      date: '2014-04-15',
      description:
        'Pho (pronounced "fuh") is the most popular food in Vietnam, often eaten for breakfast, lunch and dinner. It is made from a special broth that simmers for several hours infused with exotic spices and served over rice noodles with fresh herbs.',
      image: 'pho.png',
    },

    {
      name: 'recipe1210',
      title: 'Guacamole',
      date: '2016-10-01',
      description:
        'Guacamole is definitely a staple of Mexican cuisine. Even though Guacamole is pretty simple, it can be tough to get the perfect flavor - with this authentic Mexican guacamole recipe, though, you will be an expert in no time.',
      image: 'guacamole.png',
    },

    {
      name: 'recipe1810',
      title: 'Hamburger',
      date: '2012-10-20',
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
