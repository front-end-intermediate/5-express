# Server Side with ExpressJS
- [Server Side with ExpressJS](#Server-Side-with-ExpressJS)
  - [Homework](#Homework)
  - [Reading](#Reading)
  - [NODE](#NODE)
  - [Scaffolding Our Server](#Scaffolding-Our-Server)
  - [Express](#Express)
  - [Create a Database](#Create-a-Database)
  - [Connect to the Database](#Connect-to-the-Database)
  - [Create a Mongoose Schema](#Create-a-Mongoose-Schema)
  - [Import Data](#Import-Data)
    - [Aside - Status Codes](#Aside---Status-Codes)
  - [Front End](#Front-End)
  - [Static Files](#Static-Files)
  - [Using CommonJS](#Using-CommonJS)
    - [Controllers](#Controllers)
    - [Recipe Model](#Recipe-Model)
  - [Importing with Mongoose Model.create](#Importing-with-Mongoose-Modelcreate)
  - [Model.DeleteMany()](#ModelDeleteMany)
  - [Add a Recipe: Model.create](#Add-a-Recipe-Modelcreate)
  - [Delete: Model.remove](#Delete-Modelremove)
  - [Delete on the Front End](#Delete-on-the-Front-End)
  - [Find by ID](#Find-by-ID)
  - [Detail Page](#Detail-Page)
  - [Update/Edit: Model.findByIdAndUpdate](#UpdateEdit-ModelfindByIdAndUpdate)
  - [Notes](#Notes)
    - [Find By id](#Find-By-id)
    - [Create a new Recipe in Postman](#Create-a-new-Recipe-in-Postman)


Today we will be building the back and front end for a simple recipes app.

## Homework
Midterm assignment.

## Reading
* Technology stack [overview](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview)
* Watch [Express JS Crash Course](https://youtu.be/L72fhGm1tfE)
* The MDN [Server Side Tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)

## NODE

An implementation of Chrome's JavaScript engine _outside the browser_.

A simple demo:

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

Here's the canonical example:

```js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

Note:

`const http = require('http');` is the syntax for importing in node applications. It is different from the ES6 module system we have been using in React, e.g. `import Header from './Header'`. Node uses the CommonJS module system. 

CommonJS uses a `require()` function to fetch dependencies and an `exports` variable to export module contents. CommonJS was not really designed for browsers were ES6 modules are used instead.

## Scaffolding Our Server

1. Run `$ npm init -y` and edit package.json to specify `"main": "server.js",` as the entry for main
2. Setup tooling and dependencies `npm i -S express mongoose`
3. Setup tooling and developmental dependencies `npm i -D nodemon`
4. Create an npm script for nodemon in package.json:

```js
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
},
```

## Express 

[Express](https://expressjs.com/) is a server-side or "back-end" framework for building web applications on Node.js. It simplifies the server creation process and uses JavaScript as the server-side language. 

Common web-development tasks are not directly supported by Node. Express allows you to add specific handling for different HTTP verbs (e.g. GET, POST, DELETE, etc.), separately handle requests at different URL paths ("routes"), serve static files, and use templates to dynamically create the server's response to the browser.

Express was an [application generator](https://expressjs.com/en/starter/generator.html) not unlike create-react-app, but we will not be using that today.

Demo of the Express application generator:

```sh
npx express-generator --view=pug --css=sass expressGenerator
cd expressGenerator
npm install
DEBUG=myapp:* npm start
```

Create `server.js` for express at the top level of the folder:

```js
const express = require('express');
const app = express();

// our first route
app.get('/', function(req, res) {
  res.send('Hello from the backend.');
});

const PORT = 3000;

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));

```

We can run this using `node server.js` but since we added commands to our package.json file we will use `npm start`. 

You should be able to view the [output](http://localhost:3000) at `http://localhost:3000`.

`require()` uses the CommonJS module system to access applications from `node_modules`.

`app.get('/')` is a route. The URL '/' is the root of the site. The callback function is an anonymous function that takes incoming (`req`) and outgoing (`res`) parameters. The `res` object has a `send` method that returns plain text for now.

* [ExpressJS 4.x Response reference](https://expressjs.com/en/4x/api.html#res)

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

[Test](http://localhost:3000/music) it at `http://localhost:3000/music`

It didn't work. We need to restart the server with Control-c and `npm run start`.

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

Now we are using both `req` and `res`.

* [ExpressJS 4.x Request reference](https://expressjs.com/en/4x/api.html#req)

Test it at `http://localhost:3000/music/jazz`

Again the server needs to be restarted but this time we will use `npm run dev`. Nodemon (installed earlier) will listen for changes to server.js and restart it as needed.

Test Nodemon by adding a new route:

```js
// our third route
app.get('/test', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
  console.log(__dirname);
});
```

And go to the `test` endpoint in the browser.

Instead of using `res.send` we are using `res.sendFile`. `__dirname` is a special Node global that gives us the current directory.

Rollback server.js to:

```js
const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = 3000;

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
```

## Create a Database

Express apps can use [any database supported by Node](https://expressjs.com/en/guide/database-integration.html) including PostgreSQL, MySQL, MongoDB, etc. 

Rather than installing a database on our local computer we will be using [MongoDB's](https://www.mongodb.com) cloud service Atlas for our database.

1. Create an account and sign in
2. Create a project called NYU
3. Create a cluster naming it `recipes`
4. Create a database user (this is different from the login username and password) with Read/Write access
5. Whitelist access from anywhere
6. Select a connection method (select Connect your Application) and copy the connection string

<!-- mongodb+srv://daniel:dd2345@recipes-1c9td.mongodb.net/test?retryWrites=true&w=majority -->
<!-- mongodb+srv://daniel:dd2345@recipes-3k4ea.mongodb.net/test?retryWrites=true&w=majority -->

## Connect to the Database

There are a variety of ways to connect to the database from Express applications. Since we want to use Mongo, we installed [Mongoose](https://mongoosejs.com), a driver for MongoDB, using npm. It is easier to use than the standard [MongoClient](https://expressjs.com/en/guide/database-integration.html#mongodb) and works with models or schemas.

Note: Mongoose is not the MongoDB database, just the driver needed to work with it. 

First, import mongoose in server.js:

```js
const mongoose = require('mongoose');
```

We connect to a Mongo DB through the Mongoose's connect method, `mongoose.connect(URL, { options });`, and pass any configuration options in using an object.

Store the database URL in a variable:

```js
const dataBaseURL =
  'mongodb+srv://daniel:dd2345@recipes-3k4ea.mongodb.net/test?retryWrites=true&w=majority';
```

Call mongoose's connect method, passing it the URL. 

We connect to a Mongo DB through the Mongoose's connect method, `mongoose.connect(URL, { options });`, and pass any configuration options in using an object.

Store the database URL in a variable:

```js
mongoose
  .connect(dataBaseURL, { useNewUrlParser: true })
  .then(() => console.log('MongoDb connected'))
  .catch(err => console.log(err));
```

Note that, like `fetch()` the connect method returns a promise which we are using to log to the console (the terminal here) and show any errors.


## Create a Mongoose Schema

Mongoose uses [schemas](https://mongoosejs.com/docs/guide.html#definition) to define your data and provides methods to add, remove, delete and etc.

Create an instance of a Mongoose schema, RecipeSchema:

Add to `server.js`: 
```js
const RecipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
});

const Recipe = mongoose.model('Recipe', RecipeSchema);
```

Models are defined by passing a Schema instance to mongoose.model. Here we are saving the model to a variable `Recipe`.

Once you have a model you can call methods on it. The actual interaction with the data happens with the Model. That's the object that you can call `.find()`, `.findOne()`, etc on. The documentation for [finding documents](https://mongoosejs.com/docs/api/model.html#model_Model.find) is a good example. There are quite a number of [useful methods](https://mongoosejs.com/docs/api/model.html) on Mongoose models.

Create a route in `server.js` that displays recipes:

```js
app.get('/api/recipes', function(req, res) {
  Recipe.find({}, function(err, results) {
    return res.send(results);
  });
});
```

Note the path: `/api/recipes`. Go to that endpoint in your browser to see the array.

## Import Data

We will create a new endpoint that populates our database with a starter data set using the `model.create()` method.

```js
app.get('/api/import', (req, res) => {
  Recipe.create(

  )
});
```

Pass some data to the database using [`model.create()`](https://mongoosejs.com/docs/api.html#model_Model.create), a shortcut for saving one or more documents to the database:

```js
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
  );
});
```

Now go to the import endpoint (note that the page loads indefinitely) and then return to the `http://localhost:3000/api/recipes` endpoint to see the data.

The page loads indefinitely because the endpoint never actually returns anything to the browser.

In the documentation for `model.create()` they note that you can pass a callback function after the objects:

```js
Candy.create({ type: 'jelly bean' }, { type: 'snickers' }, function (err, jellybean, snickers) {
  if (err) // ...
});
```

Let's return an HTTP status:

```js
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
```

Travelling to `http://localhost:3000/api/import` will import the data again but, this time, since we return something to the browser it will not be stuck on loading. 

### Aside - Status Codes

`sendStatus` communicates with the front end by returning a standard [http status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes). As the backend developer it is up to you to return appropriate status codes.

451 - 'Unavailable For Legal Reasons', is used when resource access is denied for legal reasons, e.g. censorship or government-mandated blocked access. It is a reference to the novel Fahrenheit 451, where books are outlawed.

## Front End

Let's conclude this section by outputting the data in a simple index page.

In the body tag of `public/index.html`:

```html
<div id="root">
  <h1>Recipes!</h1>
</div>

<script>

</script>
```

And in the head:

```html
<link rel="stylesheet" href="css/styles.css" />
```

Use the browser's fetch API to call our api endpoint:

```html
<script>
fetch(`api/recipes`)
  .then(response => response.json())
  .then(recipes => console.log(recipes));
</script>
```

Examine the browser's console.

Render some HTML to the DOM:

```js
fetch(`api/recipes`)
  .then(response => response.json())
  .then(recipes => renderStories(recipes));

const renderStories = recipes => {
  console.log(recipes);
  recipes.forEach(recipe => {
    recipeEl = document.createElement('div');
    recipeEl.innerHTML = `
      <img src="img/${recipe.image}" />
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
    `;
    document.querySelector('#root').append(recipeEl);
  });
};

```

Note that neither the CSS nor the images are working.

## Static Files

To serve [static files](https://expressjs.com/en/starter/static-files.html) such as images, CSS files, and JavaScript files, use the `express.static` built-in function in Express.

Add the following to server.js:

```js
app.use(express.static('static'))
```

This works but images and CSS are really the domain of the front end. Move the `css` and `img` folders into `public` and edit the static declaration to read:

```js
app.use(express.static('public'))
```

## Using CommonJS

Before we get any further we are going to use CommonJS to organize our code.

### Controllers

Create a new folder `api` and a file inside called `recipe.controllers.js`. We'll export each handler and create the functions in this file one by one. They are just empty functions for the moment.

Add the following to `recipe.controllers.js`:

```js
const mongoose = require('mongoose');
const Recipe = mongoose.model('Recipe');

exports.findAll = function() {};
exports.findById = function() {};
exports.add = function() {};
exports.update = function() {};
exports.delete = function() {};
```

The CommonJS `exports` makes the function available for import elsewhere in our application.

Update `server.js` to require our controllers:

```js
const recipeControllers = require('./api/recipe.controllers');
```

Now we can call the functions in `recipe.controllers`.

Add the following to `server.js`:

```js
app.get('/api/recipes', recipeControllers.findAll);
app.get('/api/recipes/:id', recipeControllers.findById);
app.post('/api/recipes', recipeControllers.add);
app.put('/api/recipes/:id', recipeControllers.update);
app.delete('/api/recipes/:id', recipeControllers.delete);
```

Each route consists of three parts:

* A specific HTTP Action (`get, put, post, delete`)
* A specific URL path (`/api/recipes/:id`)
* A handler method (`findAll`) that corresponds to the exported function in our recipe controllers file

We've modeled our URL routes off of REST API conventions, and named our handling methods clearly - prefixing them with `api/` in order to differentiate them from any routes we create to serve the front end.

Delete the find route from server.js.

Update findAll's definition in `recipe.controllers.js` to send a json snippet:

```js
exports.findAll = function(req, res) {
  res.send([
    {
      title: 'Lasagna',
      description:
        'Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.',
      image: 'lasagna.png'
    }
  ]);
};
```

You should see the recipe in the browser and, at the specified route `/api/recipes'`, you should see the json in the browser.

### Recipe Model

Add a new file `recipe.model.js` to `api` for our Recipe Model.

Require Mongoose in this file, and create a new Schema object:

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: String,
  description: String,
  image: String,
});

module.exports = mongoose.model('Recipe', RecipeSchema);

```

We require mongoose and create and export an instance of a mongoose Schema to make sure we're getting and setting well-formed data to and from the Mongo collection. 

The last line exports the RecipeShema together with Mongoose's built in MongoDb interfacing methods. We'll refer to this Recipe object in other files.

<!-- ### Using Mongoose Methods and Schema -->

<!-- 1: Update `server.js` with these lines (in their appropriate locations):

```js
const mongoose = require('mongoose');

const mongoUri = 'mongodb://devereld:dd2345@ds015730.mlab.com:15730/recipes-dd';

mongoose.connect(mongoUri);
``` -->

<!-- To use a different database, simply drop a different connection string into the `mongoUri` variable.

If we want to wrap our Express app startup inside the MongoDB connection it would look like:

```js
mongoose.connect(mongoUri, { useNewUrlParser: true }, () => {
  app.listen(3001);
  console.log('Server running at http://localhost:3001/');
});
``` -->

<!-- 2: Add a reference to our model `const recipeModel = require('./api/recipe.model');`:

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
``` -->

<!-- 3: Update `api/recipe.controllers.js` to require Mongoose, so we can create an instance of our Recipe model to work with.

Add to the top of that file:

```js
const mongoose = require('mongoose');
const Recipe = mongoose.model('Recipe');

exports.findAll = function() {};
exports.findById = function() {};
exports.add = function() {};
exports.update = function() {};
exports.delete = function() {};

``` -->

Delete the model in server.js and import recipe.model.js. Order is important. In `server.js` we must require the model _before_ the controllers.

```js
const recipeModel = require('./api/recipe.model');
const recipes = require('./api/recipe.controllers');
```

Delete the `findAll()` function in `server.js` and update the `findAll()` function in `recipe.controllers` to query Mongo with the `find()` method.

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

Refactor to use arrow functions if desired:

```js
exports.findAll = (req, res) => {
  Recipe.find({}, (err, json) => {
    if (err) return console.log(err);
    res.send(json);
  });
};
```

`Model.find()` is a [Mongoose query](https://mongoosejs.com/docs/queries.html) that takes an object and an optional callback function. Passing `find({})` with an empty object means we are not filtering and so to return all of it.

Once Mongoose looks up the data and returns a result set, we use `res.send()` to return the raw results.

Check that the server is still running and then visit the API endpoint for all recipes [localhost:3000/api/recipes](localhost:3000/api/recipes). You'll get JSON data back from the database - possibly an empty array `[]`.

## Importing with Mongoose Model.create

Add a new api route - `app.get('/api/import', recipeControllers.import);` - to our list in `server.js`:

```js
app.get('/api/recipes', recipeControllers.findAll);
app.get('/api/recipes/:id', recipeControllers.findById);
app.post('/api/recipes', recipeControllers.add);
app.put('/api/recipes/:id', recipeControllers.update);
app.delete('/api/recipes/:id', recipeControllers.delete);
app.get('/api/import', recipeControllers.import);
```

Delete the import route in server.js and define it in `recipe.controllers.js`:

```js
exports.import = function(req, res) {
  Recipe.create(
    {
      title: 'Lasagna',
      description:
        'Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.',
      image: 'lasagna.png'
    },
    {
      title: 'Pho-Chicken Noodle Soup',
      description:
        'Pho (pronounced "fuh") is the most popular food in Vietnam, often eaten for breakfast, lunch and dinner. It is made from a special broth that simmers for several hours infused with exotic spices and served over rice noodles with fresh herbs.',
      image: 'pho.png'
    },

    {
      title: 'Guacamole',
      description:
        'Guacamole is definitely a staple of Mexican cuisine. Even though Guacamole is pretty simple, it can be tough to get the perfect flavor - with this authentic Mexican guacamole recipe, though, you will be an expert in no time.',
      image: 'guacamole.png'
    },

    {
      title: 'Hamburger',
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

<!-- In Mongoose, there is Model.create and Collection.insert - the latter isn't strictly part of Mongoose, but of the underlying MongoDB driver. -->

<!-- This import method adds four items from the JSON to a recipes collection. The Recipe model is referenced here to call its create method. `Model.create()` takes one or more documents in JSON form, and a callback to run on completion. If an error occurs, Terminal will return the error and the request will timeout in the browser. On success, the 202 "Accepted" HTTP status code is returned to the browser. -->

<!-- Visit this new endpoint to import data:

[localhost:3001/api/import/](localhost:3001/api/import/) -->

<!-- Now visit the [http://localhost:3001/api/recipes](http://localhost:3001/api/recipes) endpoint to view the new recipes data. You'll see an array of JSON objects, each in the defined schema, with an additional generated unique private `_id`. -->

## Model.DeleteMany() 

Review some of the [documentation](http://mongoosejs.com/docs/queries.html) for Mongoose and create a script to delete all recipes with [deleteMany](http://mongoosejs.com/docs/queries.html).

We will call our endpoint 'killall.'

Add `app.get('/api/killall', recipeControllers.killall);` to `server.js`:

```js
app.get('/api/recipes', recipeControllers.findAll);
app.get('/api/recipes/:id', recipeControllers.findById);
app.post('/api/recipes', recipeControllers.add);
app.put('/api/recipes/:id', recipeControllers.update);
app.delete('/api/recipes/:id', recipeControllers.delete);
app.get('/api/import', recipeControllers.import);
app.get('/api/killall', recipeControllers.killall);
```

Add the corresponding function to the controllers file:

```js
exports.killall = function(req, res) {
  Recipe.deleteMany( { title: 'Lasagna' }, (err) => {
    if (err) return console.log(err);
    return res.sendStatus(202);
  })
};
```

Run the function by visiting the killall endpoint and then returning to the recipes endpoint to examine the results.

In this example we are deleting only those recipes where the title is Lasagna. 

Change the filter `{ title: 'Lasagna' }` to `{}` to remove them all and run the functions again.

## Add a Recipe: Model.create

We used `create()` in our import function in order to add multiple documents to our Recipes  collection. Our POST handler uses the same method to add a single Recipe to the collection. Once added, the response is the full new Recipe's JSON object.

Edit `recipe-controllers.js`:

```js
exports.add = function(req, res) {
  Recipe.create(req.body, function(err, recipe) {
    if (err) return console.log(err);
    return res.send(recipe);
  });
};
```

Add a form to index.html:

```html
<form action="/api/recipes" method="POST">
  <input type="text" placeholder="Recipe Title" name="title">
  <input type="text" placeholder="Image" name="image">
  <textarea type="text" placeholder="Description" name="description"></textarea>
  <button type="submit">Submit</button>
</form>
```

Note the action and method attributes.

Add supporting CSS:

```css
input, textarea {
  font-size: 1rem;
  display: block;
  margin: 1rem;
  width: 90%;
  padding: 0.5rem;
}
button {
  color: #fff;
  font-size: 1rem;
  padding: 0.5rem;
  margin: 0 1rem;
  background: #007eb6;
}
```

If we try to run the form now we get a new empty recipe. 

We need to unpack the data on the server side. [body-parser](https://github.com/expressjs/body-parser) parses the incoming request body (req.body)

Install `body-parser`:

```sh
npm i body-parser
```

Require it in server.js:

```js
const bodyParser = require('body-parser');
```

Add to server.js with options:

```js
app.use(bodyParser.urlencoded({ extended: true }));
```

Test the form using the information from Pho.

## Delete: Model.remove

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

Forms only support GET and POST and are inappropriate for deleting.

Add a Delete link to the script:

`<a class="del" data-id=${recipe._id} href="#">Delete</a>`

Note the use of data attributes here.

## Delete on the Front End

Run a single link first:

```js
const deleteBtns = document.querySelector('.del');
  console.log(deleteBtns.dataset.id);
  deleteBtns.addEventListener('click', e => {
    fetch(`api/recipes/${deleteBtns.dataset.id}`, {
      method: 'DELETE'
    });
    e.preventDefault();
  });
```

Note the method option passed to fetch.

Note the use of `dataset`.

`(node:31390) DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.`

Make sure this code is inside the renderStories function.

```js
fetch(`api/recipes`)
  .then(response => response.json())
  .then(recipes => renderStories(recipes));

const renderStories = recipes => {
  console.log(recipes);
  recipes.forEach(recipe => {
    recipeEl = document.createElement('div');
    recipeEl.innerHTML = `
      <img src="img/${recipe.image}" />
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <a class="del" data-id=${recipe._id} href="api/recipe/${
      recipe._id
    }">Delete</a>
    `;
    document.querySelector('#root').append(recipeEl);
  });
  const deleteBtns = document.querySelector('.del');
  console.log(deleteBtns.dataset.id);
  deleteBtns.addEventListener('click', e => {
    fetch(`api/recipes/${deleteBtns.dataset.id}`, {
      method: 'DELETE'
    });
    e.preventDefault();
    location.reload();
  });
};
```

Note the use of `dataset` here.

Note the `location.reload();`

Instead on one button, many:

```js
const deleteBtns = document.querySelectorAll('.del');
console.log(deleteBtns);
const delBtns = Array.from(deleteBtns);
console.log(delBtns);
delBtns.forEach(btn => {
 btn.addEventListener('click', e => {
   fetch(`api/recipes/${btn.dataset.id}`, {
     method: 'DELETE'
   });
   e.preventDefault();
   location.reload();
 });
});
```

## Find by ID

Let's create a detail page for each recipe using findById function:

` <h3><a href="api/recipes/${recipe._id}">${recipe.title}</a></h3>`

`<h3><a href="detail.html?recipe=${recipe._id}">${recipe.title}</a></h3>`

## Detail Page

Fence the JavaScript for the homepage:

```html
 <script src="js/scripts.js"></script>
 <script>
   homepage();
 </script>
 ```

 ```js
 const homepage = () => {
  fetch(`api/recipes`)
    .then(response => response.json())
    .then(recipes => renderStories(recipes));

  const renderStories = recipes => {
    console.log(recipes);
    recipes.forEach(recipe => {
      recipeEl = document.createElement('div');
      recipeEl.innerHTML = `
         <img src="img/${recipe.image}" />
         <h3><a href="detail.html?recipe=${recipe._id}">${recipe.title}</a></h3>
         <p>${recipe.description}</p>
         <a class="del" data-id=${recipe._id} href="#0">Delete</a>
         `;
      document.querySelector('#root').append(recipeEl);
    });

    const deleteBtns = document.querySelectorAll('.del');
    console.log(deleteBtns);
    const delBtns = Array.from(deleteBtns);
    console.log(delBtns);
    delBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        fetch(`api/recipes/${btn.dataset.id}`, {
          method: 'DELETE'
        });
        e.preventDefault();
        location.reload();
      });
    });
  };
};
```

Save index.html as detail.html.

Start by filling out the findByID function to use Mongoose's `Model.findOne`:

```js
exports.findById = (req, res) => {
  const id = req.params.id;
  Recipe.findOne({ _id: id }, (err, json) => {
    if (err) return console.log(err);
    return res.send(json);
  });
};
```

And create a new function for the detail page:

```js
const detail = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('recipe');
  console.log(recipeId);
  fetch(`api/recipes/${recipeId}`)
    .then(response => response.json())
    .then(recipe => console.log(recipe));
};

```

Note the use of [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams).

Render a single recipe to the page:

```js
const detail = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('recipe');
  console.log(recipeId);
  fetch(`api/recipes/${recipeId}`)
    .then(response => response.json())
    .then(recipe => renderStory(recipe));

  const renderStory = recipe => {
    console.log(recipe);
    recipeEl = document.createElement('div');
    recipeEl.innerHTML = `
      <img src="img/${recipe.image}" />
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <a href="/">Back</a>
      `;
    document.querySelector('#root').append(recipeEl);
  };
};
```

## Update/Edit: Model.findByIdAndUpdate

Update recipe.controllers:

```js
exports.update = (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  Recipe.findByIdAndUpdate(id, req.body, { new: true }, (err, response) => {
    if (err) return console.log(err);
    res.send(response);
  });
};
```

We will use `findByIdAndUpdate`

New form:

```html
<h3>Edit Recipe</h3>
<form>
   <input type="text" placeholder="Recipe Title" name="title" />
   <input type="text" placeholder="Image" name="image" />
   <textarea
     type="text"
     placeholder="Description"
     name="description"
   ></textarea>
   <button onclick="updateRecipe()">Update</button>
</form>
```

Note the button action. 

Populate the form fields using data from the recipe:

```js
const detail = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('recipe');
  console.log(recipeId);
  fetch(`api/recipes/${recipeId}`)
    .then(response => response.json())
    .then(recipe => renderStory(recipe));

  const renderStory = recipe => {
    recipeEl = document.createElement('div');
    recipeEl.innerHTML = `
      <img src="img/${recipe.image}" />
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <a href="/">Back</a>
      `;
    document.querySelector('#root').append(recipeEl);

    const editForm = document.querySelector('form');
    editForm.title.value = recipe.title;
    editForm.image.value = recipe.image;
    editForm.description.value = recipe.description;
    // console.log(editForm.description);
  };
};
```

server.js

```js
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
```

Test using Fetch with static content and an options object.

Be sure to replace the hard coded id (`api/recipes/5d222a54334b1112c44a6066`) with the one in the browser location bar:

```js
const updateRecipe = () => {
  const updatedRecipe = {
    title: 'New Title',
    image: 'lasagna.png',
    description: 'Not too long.',
  };
  const options = {
    method: 'PUT',
    body: JSON.stringify(updatedRecipe),
    headers: { 'Content-Type': 'application/json' },
  };
  console.log(options.body);
  fetch(`api/recipes/5d222a54334b1112c44a6066`, options).then(response =>
    console.log('response'),
  );
  event.preventDefault();
};
```

Edit the script to harvest the form values as the updated recipe:

```js
const updateRecipe = () => {
  const editForm = document.querySelector('form');
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('recipe');
  const updatedRecipe = {
    title: editForm.title.value,
    image: editForm.image.value,
    description: editForm.description.value,
  };
  const options = {
    method: 'PUT',
    body: JSON.stringify(updatedRecipe),
    headers: { 'Content-Type': 'application/json' },
  };
  console.log(options.body);
  fetch(`api/recipes/${recipeId}`, options)
    .then(response => console.log(response))
    .then(() => location.reload()),
    event.preventDefault();
};
```

## Notes

```js
var xhr = new XMLHttpRequest();
xhr.open('DELETE', 'api/recipes/5d2211f8e71dff0bc9230abe');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onload = () => {
  if (xhr.status === 200) {
    location.reload(true);
    console.log(xhr.responseText);
  } else {
    console.log(xhr.status, xhr.responseText);
  }
};
xhr.send();
```

<!-- ## Introducing Postman

Since modeling endpoints is a common task and few enjoy using curl (more on curl in a moment), most people use a utility such as [Postman](https://www.getpostman.com/).

Download and install it [here](https://www.getpostman.com/). (You need not create an account to use it.)

Test a GET in postman with [http://localhost:3001/api/recipes/](http://localhost:3001/api/recipes/) and then delete all the recipes: [http://localhost:3001/api/killall/](http://localhost:3001/api/killall/) -->


<!-- ### Test the Model

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
exports.findById = (req, res) => {
  const id = req.params.id;
  Recipe.findOne({ _id: id }, (err, json) => {
    if (err) return console.log(err);
    return res.send(json);
  });
};
```

This route's path uses a parameter pattern for id `/recipes/:id` which we can refer to in `req` to look up and return just one document.

At your findAll endpoint `http://localhost:3001/api/recipes`, copy one of the ids, paste it in at the end of the current url in the browser and refresh. You'll get a single JSON object for that one recipe's document.

e.g. `http://localhost:3001/api/recipes/< id goes here >`




 -->




 <!-- In a new terminal tab - use cURL to POST to the add endpoint with the full Recipe JSON as the request body (making sure to check the URL port and path).

```sh
curl -i -X POST -H 'Content-Type: application/json' -d '{"title": "Toast", "image": "toast.png", "description":"Tasty!"}' http://localhost:3001/api/recipes
```

### Create a new Recipe in Postman

1. Set Postman to POST, set the URL in Postman to `http://localhost:3001/api/recipes/`
2. Choose `raw` in `Body` and set the text type to `JSON(application/json)`
3. Set Body to `{"title": "Toast", "image": "toast.jpg", "description":"Postman? Tasty!"}`
4. Hit `Send`

Refresh `http://localhost:3001/recipes` or use Postman's history to see the new entry at the end.

Save your query in Postman to a new Postman collection. -->