# II - Server Side with ExpressJS
- [II - Server Side with ExpressJS](#II---Server-Side-with-ExpressJS)
  - [Homework](#Homework)
  - [Reading](#Reading)
  - [NODE](#NODE)
  - [Scaffolding Our Server](#Scaffolding-Our-Server)
  - [Express](#Express)
    - [DEMO: Routes and Schemas](#DEMO-Routes-and-Schemas)
  - [Receiving Data from a Request](#Receiving-Data-from-a-Request)
  - [Using CommonJS](#Using-CommonJS)
    - [Controllers](#Controllers)
    - [Define Data Models (Mongoose)](#Define-Data-Models-Mongoose)
    - [Using Mongoose Methods and Schema](#Using-Mongoose-Methods-and-Schema)
    - [Importing Data](#Importing-Data)
    - [Facilitate Testing](#Facilitate-Testing)
    - [Introducing Postman](#Introducing-Postman)
    - [Test the Model](#Test-the-Model)
    - [Find By id](#Find-By-id)
    - [Add a Recipe](#Add-a-Recipe)
    - [Create a new Recipe in Postman](#Create-a-new-Recipe-in-Postman)
    - [Delete](#Delete)
  - [Front End](#Front-End)
  - [Notes](#Notes)


## Homework
 
Build out an HTML page that displays the recipe data when you click on a link. Add a form that calls the api to create a new recipe.

## Reading

* Watch [Express JS Crash Course](https://youtu.be/L72fhGm1tfE)

## NODE

An implementation of Chrome's JavaScript engine _outside the browser_.

Demo:

`script.js`:

```js
var addItems = function (num1, num2) {
  console.log( num1 + num2 )
}

addItems(1,2)
```

In the terminal:

```sh
node script.js 
```

## Scaffolding Our Server

1. Run `$ npm init -y`
2. Setup tooling and dependencies `npm i -S express mongoose body-parser`
3. Setup tooling and developmental dependencies `npm i -D nodemon`
4. Create an npm script for nodemon 

```js
"scripts": {
  "start": "node serve.js",
  "dev": "nodemon server.js"
},
```

## Express 

[Express](https://expressjs.com/) is a server-side or "back-end" framework for building web applications on Node.js. It simplifies the server creation process and uses JavaScript as the server-side language. It is not comparable to React which is a front-end framework.

Common web-development tasks are not directly supported by Node. Express allows you to add specific handling for different HTTP verbs (e.g. GET, POST, DELETE, etc.), separately handle requests at different URL paths ("routes"), serve static files, and use templates to dynamically create the response.

Create `server.js` for express at the top level of the folder:

```js
const express = require('express');
const app = express();

// our first route
app.get('/', function(req, res) {
  res.send('Ahoy there');
});

app.listen(3001);
console.log('Server running at http://localhost:3001/');
```

Run the app using `npm start` and view the [output](http://localhost:3001)

`require()` uses the CommonJS modular system to access applications from `node_modules`.

`app.get('/')` is the primary route for the front end. The URL is the root of the site, the callback handler is an anonymous function, and the response is plain text for now.

[Body Parser](https://www.npmjs.com/package/body-parser) parses and places incoming requests in a `req.body` property so our handlers can use them.

Add a second route and test:

```js
// our second route
app.get('/music', function(req, res) { 
  res.send(`
    <h1>music</h1>
    <p>Commentary on music will go here.</p>
    `);
});
```

Edit the second route to include a request variable and test in the browser:

```js
// our second route
app.get('/music/:type', function(req, res) {
  let type = req.params.type;
  res.send(`
    <h1>Music - ${type.toUpperCase()}</h1>
    <p>Commentary on ${type} music will go here.</p>
    `);
});
```

### DEMO: Routes and Schemas

Here is a simple ExpressJS application using the Mongoose driver. Let's break it down.

```js
// requires
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// variables
const app = express();
const Schema = mongoose.Schema;
const mongoUri = 'mongodb://devereld:dd2345@ds163630.mlab.com:63630/recipes-dmz';

const PORT = process.env.PORT || 3001

// schema
const RecipeSchema = new Schema({
  name: String,
  ingredients: Array
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

// middleware
app.use(bodyParser.json());

// routes
app.get('/', function(req, res) {
  res.send('Ahoy there');
});

app.get('/api/recipes', function(req, res){
  Recipe.find({}, function(err, results) {
    return res.send(results);
  });
});

// initialization
mongoose.connect(mongoUri, { useNewUrlParser: true });

app.listen(PORT, () => console.log('Server running on port ${PORT}'); );

```

Express apps can use any database supported by Node including PostgreSQL, MySQL, MongoDB, etc. Since we want to use Mongo, we installed Mongoose, a driver for MongoDB, using npm.

Note: this is not the MongoDB database, just the driver needed to work with it. 

We connect to a Mongo DB through the Mongoose's connect method, `mongoose.connect(mongoUri, { useNewUrlParser: true });`, and pass any configuration options in using an object.

Note the Schema `RecipeSchema`. In Mongoose a [Schema](https://mongoosejs.com/docs/guide.html#schemas) maps to a MongoDB collection and defines the shape of the documents in that collection. Here, we've got a schema with two properties, `name` which will be a string and `ingredients` which will be an array.

<!-- NEW -->

Currently we have the following in our `server.js` file:

```js
const express = require('express');
const app = express();

// our first route
app.get('/', function(req, res) {
  res.send('Ahoy there');
});

app.listen(3001);
console.log('Server running at http://localhost:3001/');
```

## Receiving Data from a Request

```js
const bodyParser = require('body-parser');
```

```js
app.use(bodyParser.urlencoded({ extended: true }));
```

```js
app.get('/', (req, res) => {
  console.log(__dirname)
  res.sendFile(__dirname + '/app/index.html');
});
```

```js
app.post('/entries', (req, res) => {
  console.log(req.body); 
  res.redirect('/'); 
});
```

Connect to a database:

```js
const mongoose = require('mongoose');
```

```js
const mongoUri = 'mongodb://devereld:dd2345@ds015730.mlab.com:15730/recipes-dd';

mongoose
  .connect(mongoUri, { useNewUrlParser: true })
  .then(() => console.log('MongoDb connected'))
  .catch(err => console.log(err));
```

Create a Mongoose Schema:

```js
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: String,
  title: String,
  date: String,
  description: String,
  image: String,
});

const Recipe = mongoose.model('Recipe', RecipeSchema);
```

Create a route that displays recipes:

```js
app.get('/api/recipes', function(req, res) {
  Recipe.find({}, function(err, results) {
    return res.send(results);
  });
});
```

or

```js
app.get('/api/recipes', (req, res) => {
  Recipe.find({}, results => res.send(results));
});
```



```js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipes = require('./api/recipe.controllers');

const RecipeSchema = new Schema({
  name: String,
  title: String,
  date: String,
  description: String,
  image: String,
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

// this line always appears before any routes
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Ahoy there');
});

app.get('/api/recipes', function(req, res) {
  Recipe.find({}, function(err, results) {
    return res.send(results);
  });
});

app.get('/api/import', recipes.import);

const mongoUri = 'mongodb://devereld:dd2345@ds015730.mlab.com:15730/recipes-dd';
mongoose.connect(mongoUri, { useNewUrlParser: true });

app.listen(3001);
console.log('Server running at http://localhost:3001/');
```
<!-- NEW -->

## Using CommonJS

We are going to use CommonJS components to organize our code.

### Controllers

Create a new folder `api` and a file inside called `recipe.controllers.js`. We'll export each handler and create the functions in this file one by one. They are just empty functions for the moment.

Add the following to `recipe.controllers.js`:

```js
exports.findAll = function() {};
exports.findById = function() {};
exports.add = function() {};
exports.update = function() {};
exports.delete = function() {};
```

Note the use of `exports`. This makes the function available for import elsewhere in a our application.

Update `server.js` to require our controllers (the .js file extension can be omitted):

```js
const recipes = require('./api/recipe.controllers');
```

Now we can call the functions in `recipe.controllers`.

Add the following to `server.js`:

```js
app.get('/api/recipes', recipes.findAll);
app.get('/api/recipes/:id', recipes.findById);
app.post('/api/recipes', recipes.add);
app.put('/api/recipes/:id', recipes.update);
app.delete('/api/recipes/:id', recipes.delete);
```

Each route consists of three parts:

* A specific HTTP Action (`get, put, post, delete`)
* A specific URL path (`/api/recipes/:id` etc.)
* A handler method (`findAll`)

The most common elements of a [REST application](http://www.restapitutorial.com/lessons/httpmethods.html) are accounted for here.

We've modeled our URL routes off of REST API conventions, and named our handling methods clearly - prefixing them with `api/` in order to differentiate them from any routes we create to serve the front end.

Note the `recipes.function` notation. We're using our imported recipes controller file and have placed all our request event handling methods inside the it.

<!-- ### Check if its working

Update findAll's definition in `recipe.controllers.js` to send a json snippet:

```js
exports.findAll = function(req, res) {
  res.send([
    {
      name: 'recipe1309',
      title: 'Lasagna',
      date: '2013-09-01',
      description:
        'Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.',
      image: 'lasagna.png'
    }
  ]);
};
```

3: Navigate to the specified route in `app.get('/api/recipes', recipes.findAll);`:

`localhost:3001/api/recipes`

You should see the json in the bowser. -->

### Define Data Models (Mongoose)

Rather than using the MongoClient as we did previously ( e.g. `const mongo = require('mongoDB').MongoClient;`), we will use [Mongoose](http://mongoosejs.com) to model application data and connect to our database. Here's the [quickstart guide](http://mongoosejs.com/docs/).

Mongoose is built upon the MongoDB driver we used previously so everything we are doing here would work with the original driver. However, Mongoose allows us to model our data - declare that the data be of a certain type, validate the data, and build queries.

Since we are in a Node app we will continue to use CommonJS modules. 

Add a new file `recipe.model.js` to `api` for our Recipe Model.

Require Mongoose in this file, and create a new Schema object:

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: String,
  title: String,
  date: String,
  description: String,
  image: String
});

module.exports = mongoose.model('Recipe', RecipeSchema);
```

We require mongoose and create and export an instance of a mongoose Schema.

The schema makes sure we're getting and setting well-formed data to and from the Mongo collection. Our schema has five String properties which define a Recipe object.

The last line exports the RecipeShema together with Mongoose's built in MongoDb interfacing methods. We'll refer to this Recipe object in other files.

### Using Mongoose Methods and Schema

1: Update `server.js` with these lines (in their appropriate locations):

```js
const mongoose = require('mongoose');

const mongoUri = 'mongodb://devereld:dd2345@ds015730.mlab.com:15730/recipes-dd';

mongoose.connect(mongoUri);
```

To use a different database, simply drop a different connection string into the `mongoUri` variable.

If we want to wrap our Express app startup inside the MongoDB connection it would look like:

```js
mongoose.connect(mongoUri, { useNewUrlParser: true }, () => {
  app.listen(3001);
  console.log('Server running at http://localhost:3001/');
});
```

2: Add a reference to our model `const recipeModels = require('./api/recipe.model');`:

```js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const recipes = require('./api/recipe.controllers');
const recipeModels = require('./api/recipe.model');

const app = express();
const mongoUri = 'mongodb://devereld:dd2345@ds015730.mlab.com:15730/recipes-dd';

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Ahoy there');
});

app.get('/api/recipes', recipes.findAll);
app.get('/api/recipes/:id', recipes.findById);
app.post('/api/recipes', recipes.add);
app.put('/api/recipes/:id', recipes.update);
app.delete('/api/recipes/:id', recipes.delete);

mongoose.connect(mongoUri, { useNewUrlParser: true }, () => {
  app.listen(3001);
  console.log('Server running at http://localhost:3001/');
});
```

3: Update `api/recipe.controllers.js` to require Mongoose, so we can create an instance of our Recipe model to work with.

Add to the top of that file:

```js
const mongoose = require('mongoose');
const Recipe = mongoose.model('Recipe');
```

Error! Order is important. Change the require order in `server.js` to require the model _before_ the controllers.

```js
const recipeModels = require('./api/recipe.model');
const recipes = require('./api/recipe.controllers');
```

4: Update the `findAll()` function in `recipe.controllers` to query Mongo with the `find()` method.

```js
const mongoose = require('mongoose');
const Recipe = mongoose.model('Recipe');

exports.findAll = function(req, res) {
  Recipe.find({}, function(err, results) {
    return res.send(results);
  });
};
exports.findById = function() {};
exports.add = function() {};
exports.update = function() {};
exports.delete = function() {};
```

`Model.find()` is a [Mongoose query](https://mongoosejs.com/docs/queries.html) that takes an object and an optional callback function. Passing `find({})` with an empty object means we are not filtering and so to return all of it.

Once Mongoose looks up the data and returns a result set, we use `res.send()` to return the raw results.

Check that the server is still running and then visit the API endpoint for all recipes [localhost:3001/api/recipes](localhost:3001/api/recipes). You'll get JSON data back from the database - possibly an empty array `[]`.

### Importing Data

1: Add a new api route - `app.get('/api/import', recipes.import);` - to our list in `server.js`:

```js
app.get('/api/recipes', recipes.findAll);
app.get('/api/recipes/:id', recipes.findById);
app.post('/api/recipes', recipes.add);
app.put('/api/recipes/:id', recipes.update);
app.delete('/api/recipes/:id', recipes.delete);
app.get('/api/import', recipes.import);
```

2: define the import method in our controllers file - `recipe.controllers.js`:

```js
exports.import = function(req, res) {
  Recipe.create(
    {
      name: 'recipe1309',
      title: 'Lasagna',
      date: '2013-09-01',
      description:
        'Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.',
      image: 'lasagna.png'
    },
    {
      name: 'recipe1404',
      title: 'Pho-Chicken Noodle Soup',
      date: '2014-04-15',
      description:
        'Pho (pronounced "fuh") is the most popular food in Vietnam, often eaten for breakfast, lunch and dinner. It is made from a special broth that simmers for several hours infused with exotic spices and served over rice noodles with fresh herbs.',
      image: 'pho.png'
    },

    {
      name: 'recipe1210',
      title: 'Guacamole',
      date: '2016-10-01',
      description:
        'Guacamole is definitely a staple of Mexican cuisine. Even though Guacamole is pretty simple, it can be tough to get the perfect flavor - with this authentic Mexican guacamole recipe, though, you will be an expert in no time.',
      image: 'guacamole.png'
    },

    {
      name: 'recipe1810',
      title: 'Hamburger',
      date: '2012-10-20',
      description:
        'A Hamburger (often called a burger) is a type of sandwich in the form of  rounded bread sliced in half with its center filled with a patty which is usually ground beef, then topped with vegetables such as lettuce, tomatoes and onions.',
      image: 'hamburger.png'
    },
    function(err) {
      if (err) return console.log(err);
      return res.sendStatus(202);
    }
  );
};
```

`Recipe` refers to the mongoose Recipe model we imported. `Model.create()` is a mongoose method

In Mongoose, there is Model.create and Collection.insert - the latter isn't strictly part of Mongoose, but of the underlying MongoDB driver.

This import method adds four items from the JSON to a recipes collection. The Recipe model is referenced here to call its create method. `Model.create()` takes one or more documents in JSON form, and a callback to run on completion. If an error occurs, Terminal will return the error and the request will timeout in the browser. On success, the 202 "Accepted" HTTP status code is returned to the browser.

Visit this new endpoint to import data:

[localhost:3001/api/import/](localhost:3001/api/import/)

Now visit the [http://localhost:3001/api/recipes](http://localhost:3001/api/recipes) endpoint to view the new recipes data. You'll see an array of JSON objects, each in the defined schema, with an additional generated unique private `_id`.

### Facilitate Testing 

Review some of the [documentation](http://mongoosejs.com/docs/queries.html) for Mongoose and create a script to delete all recipes with [deleteMany](http://mongoosejs.com/docs/queries.html).

We will call our endpoint 'killall.'

Add `app.get('/api/killall', recipes.killall);` to `server.js`:

```js
app.get('/api/recipes', recipes.findAll);
app.get('/api/recipes/:id', recipes.findById);
app.post('/api/recipes', recipes.add);
app.put('/api/recipes/:id', recipes.update);
app.delete('/api/recipes/:id', recipes.delete);
app.get('/api/import', recipes.import);
app.get('/api/killall', recipes.killall);
```

Add the corresponding function to the controllers file:

```js
exports.killall = function(req, res) {
  Recipe.deleteMany({ title: 'Lasagna' }, (err) => {
    if (err) return console.log(err);
    return res.sendStatus(202);
  })
};
```

Run the function by visiting the killall endpoint and then returning to the recipes endpoint to examine the results.

In this example we are deleting only those recipes where the title is Lasagna. 

Change the filter `{ title: 'Lasagna' }` to `{}` to remove them all and run the function again.

### Introducing Postman

Since modeling endpoints is a common task and few enjoy using curl (more on curl in a moment), most people use a utility such as [Postman](https://www.getpostman.com/).

Download and install it [here](https://www.getpostman.com/). (You need not create an account to use it.)

Test a GET in postman with [http://localhost:3001/api/recipes/](http://localhost:3001/api/recipes/) and then delete all the recipes: [http://localhost:3001/api/killall/](http://localhost:3001/api/killall/)


### Test the Model

Try removing date from `recipe.model`:

```js
const RecipeSchema = new Schema({
  name: String,
  title: String,
  description: String,
  image: String
});
```

Run import again. The date property will be missing from the imported items.

Add it back to the schema, this time using a default `created` value of type Date:

```js
const RecipeSchema = new Schema({
  name: String,
  title: String,
  created: { 
    type: Date,
    default: Date.now
  },
  description: String,
  image: String
});
```

Test Mongoose by adding new properties to our recipes.

Edit the `import` function to include ingredients and preparation arrays:

```js
exports.import = function(req, res) {
  Recipe.create(
    {
      "title": "Lasagna",
      "description": "Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.",
      "image": "lasagna.png",
      "ingredients": [
        "salt", "honey", "sugar", "rice", "walnuts", "lime juice"
      ],
      "preparation": [
        {"step": "Boil water"}, {"step": "Fry the eggs"}, {"step": "Serve hot"}
      ]
    },
    {
      "title": "Pho-Chicken Noodle Soup",
      "description": "Pho (pronounced \"fuh\") is the most popular food in Vietnam, often eaten for breakfast, lunch and dinner. It is made from a special broth that simmers for several hours infused with exotic spices and served over rice noodles with fresh herbs.",
      "image": "pho.png",
      "ingredients": [
        "salt", "honey", "sugar", "rice", "walnuts", "lime juice"
      ],
      "preparation": [
        {"step": "Boil water"}, {"step": "Fry the eggs"}, {"step": "Serve hot"}
      ]
    },
    {
      "title": "Guacamole",
      "description": "Guacamole is definitely a staple of Mexican cuisine. Even though Guacamole is pretty simple, it can be tough to get the perfect flavor - with this authentic Mexican guacamole recipe, though, you will be an expert in no time.",
      "image": "guacamole.png",
      "ingredients": [
        "salt", "honey", "sugar", "rice", "walnuts", "lime juice"
      ],
      "preparation": [
        {"step": "Boil water"}, {"step": "Fry the eggs"}, {"step": "Serve hot"}
      ]
    },
    {
      "title": "Hamburger",
      "description": "A Hamburger (often called a burger) is a type of sandwich in the form of  rounded bread sliced in half with its center filled with a patty which is usually ground beef, then topped with vegetables such as lettuce, tomatoes and onions.",
      "image": "hamburger.png",
      "ingredients": [
        "salt", "honey", "sugar", "rice", "walnuts", "lime juice"
      ],
      "preparation": [
        {"step": "Boil water"}, {"step": "Fry the eggs"}, {"step": "Serve hot"}
      ]
    },
    function(err) {
      if (err) return console.log(err);
      return res.sendStatus(202);
    }
  );
};
```

If you delete with `killall` and reload the sample data, it will not include the arrays.

Add new properties to our Recipe schema.

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: String,
  created: { 
    type: Date,
    default: Date.now
  },
  description: String,
  image: String,
  ingredients: Array,
  preparation: Array
});

module.exports = mongoose.model('Recipe', RecipeSchema);
```

Kill and reimport the data using Postman. The data may be in a different order than in the schema. 

There are eight data types supported by Mongoose:

1. String
2. Number
3. Date
4. Buffer
5. Boolean
6. Mixed
7. ObjectId
8. Array

Each data type allows you to specify:

* a default value
* a custom validation function
* indicate a field is required
* a get function that allows you to manipulate the data before it is returned as an object
* a set function that allows you to manipulate the data before it is saved to the database
* create indexes to allow data to be fetched faster

Certain data types allow you to customize how the data is stored and retrieved from the database. A String data type also allows you to specify the following additional options:

* convert it to lowercase
* convert it to uppercase
* trim data prior to saving
* a regular expression that can limit data allowed to be saved during the validation process
* an enum that can define a list of strings that are valid

The Number and Date properties both support specifying a minimum and maximum value that is allowed for that field.

Most of the eight allowed data types should be quite familiar to you. However, there are several exceptions that may jump out to you, such as Buffer, Mixed, ObjectId, and Array.

The Buffer data type allows you to save binary data. A common example of binary data would be an image or an encoded file, such as a PDF document.

The Mixed data type turns the property into an "anything goes" field. This field resembles how many developers may use MongoDB because there is no defined structure. Be wary of using this data type as it loses many of the great features that Mongoose provides, such as data validation and detecting entity changes to automatically know to update the property when saving.

The ObjectId data type commonly specifies a link to another document in your database. For example, if you had a collection of books and authors, the book document might contain an ObjectId property that refers to the specific author of the document.

The Array data type allows you to store JavaScript-like arrays. With an Array data type, you can perform common JavaScript array operations on them, such as push, pop, shift, slice, etc.

### Find By id

Recall our route for getting an entry by id: `app.get('/recipes/:id', recipes.findById)`.

Add the handler method to `recipe.controllers.js`:

```js
exports.findById = function(req, res) {
  const id = req.params.id;
  Recipe.findOne({ _id: id }, (err, result) => {
    return res.send(result);
  });
};
```

This route's path uses a parameter pattern for id `/recipes/:id` which we can refer to in `req` to look up and return just one document.

At your findAll endpoint `http://localhost:3001/api/recipes`, copy one of the ids, paste it in at the end of the current url in the browser and refresh. You'll get a single JSON object for that one recipe's document.

e.g. `http://localhost:3001/api/recipes/< id goes here >`

### Add a Recipe

We used `create()` for our import function inn order to add multiple documents to our Recipes Mongo collection. Our POST handler uses the same method to add a single Recipe to the collection. Once added, the response is the full new Recipe's JSON object.

Edit `recipe-controllers.js`:

```js
exports.add = function(req, res) {
  Recipe.create(req.body, function(err, recipe) {
    if (err) return console.log(err);
    return res.send(recipe);
  });
};
```

In a new terminal tab - use cURL to POST to the add endpoint with the full Recipe JSON as the request body (making sure to check the URL port and path).

```sh
curl -i -X POST -H 'Content-Type: application/json' -d '{"title": "Toast", "image": "toast.png", "description":"Tasty!"}' http://localhost:3001/api/recipes
```

### Create a new Recipe in Postman

1. Set Postman to POST, set the URL in Postman to `http://localhost:3001/api/recipes/`
1. Choose `raw` in `Body` and set the text type to `JSON(application/json)`
1. Set Body to `{"title": "Toast", "image": "toast.jpg", "description":"Postman? Tasty!"}`
1. Hit `Send`

Refresh `http://localhost:3001/recipes` or use Postman's history to see the new entry at the end.

Save your query in Postman to a new Postman collection.

### Delete

Our next REST endpoint, delete, reuses what we've done above. Add this to `recipe.controllers.js`.

```js
exports.delete = function(req, res) {
  let id = req.params.id;
  Recipe.remove({ _id: id }, (result) => {
    return res.send(result);
  });
};
```

Check it out with curl (replacing the id at the end of the URL with a known id from you `api/recipes` endpoint):

```sh
curl -i -X DELETE http://localhost:3001/api/recipes/5be48fb63746760366a67484
```

Or by a Delete action in Postman.

1. Set the action to Delete
2. Append an id from the recipes endpoint to the /api/recipes endpoint
3. Hit Send (e.g.: `http://localhost:3001/api/recipes/58c39048b3ddce0348706837`)

It probably doesn't make much sense to send the results back from a delete function (since there are no results) so change it to use an [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_Success).

```js
exports.delete = function(req, res) {
  let id = req.params.id;
  Recipe.remove({ _id: id }, (result) => {
    return res.sendStatus(451);
  });
};
```

451 - 'Unavailable For Legal Reasons', is used when resource access is denied for legal reasons, e.g. censorship or government-mandated blocked access. It is a reference to the novel Fahrenheit 451, where books are outlawed.

FWIW - [this](https://www.ietf.org/rfc/rfc2324.txt) was considered funny in 1999.

## Front End

Create an `app` folder and add `index.html`:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>START</title>
</head>

<body>
  <a href="#">See Recipes</a>
  <div id="app"></div>
  
  <script>
    
    var elem = document.querySelector('#app');
    var link = document.querySelector('a');
    
    function fetchRecipes(callback) {
      console.log(callback)
      fetch('http://localhost:3001/api/recipes')
      .then( res => res.json() )
      .then( data => callback(data) )
    }
    
    fetchRecipes( (content) => {
      console.log(content)
    })
    
  </script>
</body>

</html>
```

Edit the route to serve the page:

```js
app.get('/', function(req, res) {
  res.sendFile( __dirname + '/app/index.html');
});
```

Instead of XMLHTTPRequest we will use the new(-ish, the newer `async/await` api is also applicable here) fetch API. 

`fetch` returns a promise.

```js
function fetchRecipes(callback) {
  const data = fetch('http://localhost:3001/api/recipes')
  console.log(data)
}
```

A `then` function (like a callback), will only run when the data comes back.

```js
function fetchRecipes(callback) {
  const dataPromise = fetch('http://localhost:3001/api/recipes')
  dataPromise.then(data => {
    console.log(data)
  })
}
```

The data can be just about anything but we know we are looking for json so we need to convert it to json:

```js
function fetchRecipes(callback) {
  const dataPromise = fetch('http://localhost:3001/api/recipes')
  dataPromise.then(data => {
    console.log(data.json())
  })
}
```

.then fires when the promise comes back, we convert the response to json and use .then to access it:

```js
function fetchRecipes(callback) {
  const dataPromise = fetch('http://localhost:3001/api/recipes')
  dataPromise
  .then(data => data.json()
  .then(data => console.log(data)))
}
```

.catch allows us to work with the error. Use https:

```js
function fetchRecipes(callback) {
  const dataPromise = fetch('https://localhost:3001/api/recipes')
  dataPromise
  .then(data => data.json()
  .then(data => console.log(data)))
  .catch( (err) => { console.error(err)})
}
```

You can pass the url and callback in separately:

```js
function fetchRecipes(url, callback) {
  fetch(url)
  .then( res => res.json() )
  .then( data => callback(data) )
  .catch( (err) => { console.error(err)})
}

fetchRecipes( 'http://localhost:3001/api/recipes', (content) => {
  console.log(content)
})
```

And use an eventListener to get the data:

```js
var elem = document.querySelector('#app');
var link = document.querySelector('a');

link.addEventListener('click', getEm)

function fetchRecipes(url, callback) {
  fetch(url)
  .then( res => res.json() )
  .then( data => callback(data) )
  .catch( (err) => { console.error(err)})
}

function getEm(){
  fetchRecipes( 'http://localhost:3001/api/recipes', (content) => {
    console.log(content)
  })
}
```

<!-- 
var elem = document.querySelector('#app');
var link = document.querySelector('a');

link.addEventListener('click', getEm)

function fetchRecipes(url, callback) {
  fetch(url)
  .then( res => res.json() )
  .then( data => callback(data) )
  .catch( (err) => { console.error(err)})
}

function getEm(){
  fetchRecipes( 'http://localhost:3001/api/recipes', (recipes) => {
    console.log(recipes);
    const markup = `
    <ul>
      ${recipes.map(
        recipe => `<li>${recipe.title}</li>`
        ).join('')}
      </ul>
      `
      elem.innerHTML = markup;
    })
  } 
  -->
			



<!-- While we are here let's add these lines to `server.js` together with the other `app.use` middleware:

```js
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next()
})
```

Comment them out, we'll need them later. -->

## Notes

<!-- https://code.tutsplus.com/articles/an-introduction-to-mongoose-for-mongodb-and-nodejs--cms-29527 -->