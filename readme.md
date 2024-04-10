# Server Side with ExpressJS

Today we will be building the back and front end for a simple recipes app.

<!-- For a final version of this project see the `local` branch of this repo. -->

<!-- ## Homework

- Add an author to the recipe schema, allow the user to enter it and display it in the ui.
- Prevent the double display when editing a recipe (toast)
- When a new recipe is created, it should appear on top -->

<!-- ## Homework II

- create a database cluster on mongodb.com and use it with your server (with your own connection string)
- deploy your app to Heroku refer to the following instructions: `https://www.mongodb.com/developer/how-to/use-atlas-on-heroku/#std-label-configure-heroku-ip-address-in-atlas`
- add the ability to edit the year to the edit recipe page -->

## Resources

- Getting up and [running](https://expressjs.com/en/starter/installing.html) with ExpressJS

## Reading

- [Client-Server Overview](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview) on MDN

## Docker

Install the Docker [Desktop App](https://www.docker.com/products/docker-desktop)

## NodeJS

An implementation of Chrome's JavaScript engine _outside the browser_.

A simple demo:

Create `server.js` at the top level of today's repo:

```js
var addItems = function (num1, num2) {
  console.log(num1 + num2);
};

addItems(1, 2);
```

In the terminal:

```sh
node server.js
```

Here's the canonical server example:

```js
const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

[418](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418)

[451](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451)

## CommonJS module system

Node uses the CommonJS module system.

`const http = require('http');` is the syntax for importing in node applications. It is different from the ES6 module system we have been using in React, e.g.:

`import Header from './Header'`.

CommonJS uses a `require()` function to fetch dependencies and an `exports` or `module.exports` variable to export. CommonJS is an earlier system and was not intended for browsers where ES6 modules are used instead.

For example: `fetch` is a browser API. If you want to use fetch in node you would have to npm install it and then import or require it using:

`const fetch = require('node-fetch');`

## Scaffolding Our Server

1. Run `$ npm init -y` and edit package.json to specify `"main": "server.js",` as the entry for main
2. Install dependencies: `npm i -S express mongoose`
3. Install developmental dependencies: `npm i -D nodemon`
4. Create an npm script for nodemon in package.json:

```js
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
},
```

## ExpressJS

[Express](https://expressjs.com/) is a very [popular](https://2020.stateofjs.com/en-US/technologies/back-end-frameworks/) server-side or "back-end" framework for building web applications on Node.js. It simplifies the server creation process and uses JavaScript as the server-side language.

Common web-development tasks are not directly supported by Node. Express allows you to

- add specific handling for different HTTP actions (e.g. GET, POST, DELETE),
- separately handle requests at different URL paths ("routes"),
- serve static files, and
- dynamically create the server's response to the browser

Express has an [application generator](https://expressjs.com/en/starter/generator.html) (not unlike create-react-app), but we will not be using it today.

### Express Routes

In `server.js`:

```js
const express = require("express");
const app = express();

// our first route
app.get("/", function (req, res) {
  res.send("Hello from the backend.");
});

const PORT = 3000;

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
```

We can run this using `node server.js` but since we added commands to our package.json file we will use `npm start`.

You should be able to view the [output](http://localhost:3000) at `http://localhost:3000`.

`require()` uses the CommonJS module system to access applications from `node_modules`.

`app.get('/')` is a route. The callback function is an anonymous function that takes incoming (`request`) and outgoing (`response`) parameters. The `res` object has a `send` method that returns plain text for now.

- [ExpressJS 4.x Response reference](https://expressjs.com/en/4x/api.html#res)

Add a second route and test:

```js
// our second route
app.get("/music", function (req, res) {
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
app.get("/music/:type", function (req, res) {
  let type = req.params.type;
  res.send(`
    <h1>Music - ${type.toUpperCase()}</h1>
    <p>Commentary on ${type} music will go here.</p>
    `);
});
```

Now we are using both `req` and `res`.

Route parameters are named URL segments that are used to capture values. The captured values are populated in the `req.params` object, with the name of the route parameter specified in the path as their respective keys.

See also the [ExpressJS Request reference](https://expressjs.com/en/4x/api.html#req)

Test it at `http://localhost:3000/music/jazz`

Again the server needs to be restarted but this time we will use `npm run dev`. Nodemon (installed earlier) will listen for changes to server.js and restart it as needed.

Rollback server.js to:

```js
const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/static/index.html");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
```

Instead of using `res.send` we are using `res.sendFile`. `__dirname` is a special Node global that gives us the current directory.

## MongoDB

Express apps can use [any database supported by Node](https://expressjs.com/en/guide/database-integration.html) including PostgreSQL, MySQL, MongoDB, etc.

MongoDB is a no-sql document-based database. One of the key advantages is that your data is totally unstructured.

With a relational database, you have to define the shape of your data upfront. You'll say something like: this database table has two columns, name which is a string and age which is an integer.

With a document-based database, you just start writing objects to the database and it will accomodate them. Some documents can have some fields and others can other ones.

## Docker

Today we will download a container that runs MongoDB locally. (This will not allow us to deploy the app since the database will only be running locally.)

Don't worry if Docker and containers aren't familiar to you, if you install Docker and follow the commands everything should just work.

1. Install the Docker [Desktop App](https://www.docker.com/products/docker-desktop)
1. Run in a Docker container on localhost:

```sh
$ docker run --name recipes-mongo -dit -p 27017:27017 --rm mongo:4.4.1
$ docker exec -it recipes-mongo mongo
$ show dbs
```

This will run a new MongoDB container at version 4.4.1 and call it recipes-mongo so we can reference it by name. On the second command we run the command mongo inside of the recipes-mongo container. The mongo container (which is the official container put together by MongoDB Inc.) runs MongoDB automatically so we don't need to do anything. We just need to connect inside the container and run our commands from within the container.

At this point you should be dropped into an interactive MongoDB shell.

`show dbs` allows you to see all the existing databases. In order to start using one, you do `$ use <database name>`.

Run `use recipesApp`.

If you run `db` now it'll show you're using the recipes database.

Let's play with the db a bit in the console.

Make a collection and a databse within it. Run:

```sh
> db.recipes.insertOne({name: "Tuna", type: "sandwich", difficuly: "Easy"})
> db.recipes.count()
> db.recipes.findOne()
> db.recipes.findOne({ type: "sandwich" })
> db.recipes.updateOne( {name: "Tuna", type: "sandwich", difficuly: "Easy"}, { $set: { author: "Daniel" } } )
```

## Mongoose

Earlier we installed [Mongoose](https://mongoosejs.com), a schema builder for MongoDB, using npm. It is easier to use than the standard [MongoClient](https://expressjs.com/en/guide/database-integration.html#mongodb).

Mongoose is not a database, just a tool to work with it.

First, import mongoose in server.js:

```js
const mongoose = require("mongoose");
```

We connect to a Mongo DB through the Mongoose's connect method, `mongoose.connect(URL, { options });`, and pass any configuration options in using an object.

Store the database connection string in a variable:

```js
const dataBaseURL = process.env.DB_URL || "mongodb://localhost:27017";
```

To use a different database, simply drop a different connection string into the `dataBaseURL` variable.

Call mongoose's connect method, passing it the URL.

We connect to a Mongo DB through the Mongoose's connect method, `mongoose.connect(URL, { options });`, and pass any configuration options in using an object.

Store the database URL in a variable:

```js
mongoose
  .connect(dataBaseURL, { useNewUrlParser: true })
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log(err));
```

Note that, like `fetch()` Mongoose's connect method returns a promise which we are using to log to the console (the terminal) and show any errors.

### Mongoose Schema

Mongoose uses [schemas](https://mongoosejs.com/docs/guide.html#definition) to define data and provides methods to add, remove, delete and more.

Create an instance of a Mongoose schema, RecipeSchema:

Add to `server.js`:

```js
const RecipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
});

const Recipe = mongoose.model("Recipe", RecipeSchema);
```

Models are defined by passing a Schema instance to mongoose.model. Here we are saving the model to a variable `Recipe`.

Once you have a model you can call methods on it. The actual interaction with the data happens with the Model. That's the object that you can call `.find()`, `.findOne()`, etc on. The documentation for [finding documents](https://mongoosejs.com/docs/api/model.html#model_Model.find) is a good example. There are quite a number of [useful methods](https://mongoosejs.com/docs/api/model.html) on Mongoose models.

Create a route in `server.js` that displays recipes:

```js
app.get("/api/recipes", function (req, res) {
  Recipe.find({}, function (err, results) {
    return res.send(results);
  });
});
```

Note the path: `/api/recipes`. Go to that endpoint in your browser to see the data.

### Import Data

We will create a new endpoint that populates our database with a starter data set using the `model.create()` method.

Pass some data to the database using [`model.create()`](https://mongoosejs.com/docs/api.html#model_Model.create), a shortcut for saving one or more documents to the database:

```js
app.get("/api/import", (req, res) => {
  Recipe.create(
    {
      title: "Lasagna",
      description:
        "Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.",
      image: "lasagna.png",
    },
    {
      title: "Pho-Chicken Noodle Soup",
      description:
        'Pho (pronounced "fuh") is the most popular food in Vietnam, often eaten for breakfast, lunch and dinner. It is made from a special broth that simmers for several hours infused with exotic spices and served over rice noodles with fresh herbs.',
      image: "pho.png",
    },
    {
      title: "Guacamole",
      description:
        "Guacamole is definitely a staple of Mexican cuisine. Even though Guacamole is pretty simple, it can be tough to get the perfect flavor - with this authentic Mexican guacamole recipe, though, you will be an expert in no time.",
      image: "guacamole.png",
    },
    {
      title: "Hamburger",
      description:
        "A Hamburger (often called a burger) is a type of sandwich in the form of  rounded bread sliced in half with its center filled with a patty which is usually ground beef, then topped with vegetables such as lettuce, tomatoes and onions.",
      image: "hamburger.png",
    }
  );
});
```

Now go to the import endpoint (note that the page loads indefinitely) and then return to the `http://localhost:3000/api/recipes` endpoint to see the data.

The page loads indefinitely because the endpoint never actually returns anything to the browser.

In the documentation for `model.create()` they note that you can pass a callback function after the objects, i.e.:

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
      return res.sendStatus(201);
    },
```

Travelling to `http://localhost:3000/api/import` will import the data again but, this time, since we return something to the browser it will not be stuck loading.

### Aside - Status Codes

`sendStatus` communicates with the front end by returning a standard [http status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes). As the backend developer it is up to you to return appropriate status codes.

451 - 'Unavailable For Legal Reasons', is used when resource access is denied for legal reasons, e.g. censorship or government-mandated blocked access. It is a reference to the novel Fahrenheit 451, where books are outlawed.

## Express Static Files

To serve [static files](https://expressjs.com/en/starter/static-files.html) such as images, CSS files, and JavaScript files, we use the `express.static` built-in function in Express.

Add the following to server.js:

```js
app.use(express.static("static"));
```

This works but images and CSS are really the domain of the front end. Move the `css` and `img` folders into `public` and edit the static declaration to read:

```js
app.use(express.static("public"));
```

## Front End

Let's output the data using JavaScript in a simple index page.

In the body tag of `public/index.html`:

```html
<div id="root">
  <h1>Recipes!</h1>
  <div class="recipes"></div>
</div>

<script src="/js/scripts.js"></script>
```

And in the head:

```html
<link rel="stylesheet" href="css/styles.css" />
```

Use the browser's fetch API to call our api endpoint:

```js
fetch(`api/recipes`)
  .then((response) => response.json())
  .then((recipes) => console.log(recipes));
```

Examine the browser's console.

Render some HTML to the DOM:

```js
function getRecipes() {
  document.querySelector(".recipes").innerHTML = ``;
  fetch(`api/recipes`)
    .then((response) => response.json())
    .then((recipes) => renderRecipes(recipes));
}

function renderRecipes(recipes) {
  recipes.forEach((recipe) => {
    let recipeEl = document.createElement("div");
    recipeEl.innerHTML = `
      <img src="img/${recipe.image}" />
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
    `;
    document.querySelector(".recipes").append(recipeEl);
  });
}

getRecipes();
```

## Reorganizing with CommonJS

Before we get any further we are going to use CommonJS to organize our code.

### Controllers

Create a new folder `api` and a file inside `api/recipe.controllers.js`. We'll export each handler and create the functions in this file one by one. They are just empty functions for the moment.

Add the following to `recipe.controllers.js`:

```js
// const Recipe = require("./recipe.model");

exports.findAll = function () {};
exports.findById = function () {};
exports.add = function () {};
exports.update = function () {};
exports.delete = function () {};
```

The CommonJS `exports.` allows the functions to be available for import elsewhere in our application.

Update `server.js` to require our controllers:

```js
const recipeControllers = require("./api/recipe.controllers");
```

Now we can call the functions in `recipe.controllers`.

Add the following to `server.js`:

```js
app.get("/api/recipes", recipeControllers.findAll);
app.get("/api/recipes/:id", recipeControllers.findById);
app.post("/api/recipes", recipeControllers.add);
app.put("/api/recipes/:id", recipeControllers.update);
app.delete("/api/recipes/:id", recipeControllers.delete);
// app.get("/api/import", recipeControllers.import);
app.get("/api/killall", recipeControllers.killall);
```

Each route consists of three parts:

- A specific HTTP Action (`get, put, post, delete`)
- A specific URL path (`/api/recipes/:id`)
- A handler method (`findAll`) that corresponds to the exported function in our recipe controllers file

We've modeled our URL routes off of REST API conventions, and named our handling methods clearly - prefixing them with `api/` in order to differentiate them from any routes we create to serve the front end.

Delete the find route from server.js.

Update findAll's definition in `recipe.controllers.js` to send a json snippet:

```js
exports.findAll = function (req, res) {
  res.send([
    {
      title: "Lasagna",
      description:
        "Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.",
      image: "lasagna.png",
    },
  ]);
};
```

And test the API endpoint.

You should see the recipe in the browser and, at the specified route `/api/recipes'`, you should see the json in the browser.

### Recipe Model

Add a new file `api/recipe.model.js` for our Recipe Model.

Require Mongoose in this file, and create a new Schema object:

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: String,
  description: String,
  image: String,
});

module.exports = mongoose.model("Recipe", RecipeSchema);
```

We require mongoose and create and export an instance of a mongoose Schema to make sure we're getting and setting well-formed data to and from the Mongo collection.

The last line exports the RecipeShema together with Mongoose's built in MongoDb interfacing methods. We'll refer to this Recipe object in other files.

Delete the model in server.js

<!-- and import `recipe.model.js`. Order is important. In `server.js` we must require the model _before_ the controllers.

```js
const recipeModel = require("./api/recipe.model");
const recipeControllers = require("./api/recipe.controllers");
``` -->

Update the `findAll()` function in `recipe.controllers` to query Mongo with the `find()` method.

```js
const Recipe = require("./recipe.model");

exports.findAll = function (req, res) {
  Recipe.find({}, function (err, results) {
    return res.send(results);
  });
};

exports.findById = function () {};
exports.add = function () {};
exports.update = function () {};
exports.delete = function () {};
```

Note that we need to reference the Mongoose schema as we are using it in `Recipe.find`.

`Model.find()` is a [Mongoose query](https://mongoosejs.com/docs/queries.html) that takes an object and an optional callback function. Passing `find({})` with an empty object means we are not filtering and so to return all of it.

Once Mongoose looks up the data and returns a result set, we use `res.send()` to return the raw results.

Check that the server is still running and then visit the API endpoint for all recipes [localhost:3000/api/recipes](localhost:3000/api/recipes). You'll get JSON data back from the database - possibly an empty array `[]`.

## Mongoose Model.create

We will again use the Mongoose method `Model.create` to import data into our application.

Delete the import route in server.js and define it in `recipe.controllers.js`:

```js
exports.import = function (req, res) {
  Recipe.create(
    {
      title: "Lasagna",
      description:
        "Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.",
      image: "lasagna.png",
    },
    {
      title: "Pho-Chicken Noodle Soup",
      description:
        'Pho (pronounced "fuh") is the most popular food in Vietnam, often eaten for breakfast, lunch and dinner. It is made from a special broth that simmers for several hours infused with exotic spices and served over rice noodles with fresh herbs.',
      image: "pho.png",
    },

    {
      title: "Guacamole",
      description:
        "Guacamole is definitely a staple of Mexican cuisine. Even though Guacamole is pretty simple, it can be tough to get the perfect flavor - with this authentic Mexican guacamole recipe, though, you will be an expert in no time.",
      image: "guacamole.png",
    },

    {
      title: "Hamburger",
      description:
        "A Hamburger (often called a burger) is a type of sandwich in the form of  rounded bread sliced in half with its center filled with a patty which is usually ground beef, then topped with vegetables such as lettuce, tomatoes and onions.",
      image: "hamburger.png",
    },
    function (err) {
      if (err) return console.log(err);
      return res.sendStatus(201);
    }
  );
};
```

`Recipe` refers to the mongoose Recipe model we imported. `Model.create()` is a mongoose method

## Mongoose Model.DeleteMany()

Review some of the [documentation](http://mongoosejs.com/docs/queries.html) for Mongoose and create a script to delete all recipes with [deleteMany](http://mongoosejs.com/docs/queries.html).

We called our endpoint 'killall.'

Add the corresponding function to the controllers file:

```js
exports.killall = function (req, res) {
  Recipe.deleteMany({ title: "Lasagna" }, (err) => {
    if (err) return console.log(err);
    return res.sendStatus(202);
  });
};
```

Run the function by visiting the killall endpoint and then returning to the recipes endpoint to examine the results.

In this example we are deleting only those recipes where the title is Lasagna.

Change the filter `{ title: 'Lasagna' }` to `{}` to remove them all and run the functions again.

## Mongoose Model.create

We used `create()` in our import function in order to add multiple documents to our Recipes collection. Our POST handler uses the same method to add a single Recipe to the collection. Once added, the response is the full new Recipe's JSON object.

Edit `recipe-controllers.js`:

```js
exports.add = function (req, res) {
  Recipe.create(req.body, function (err, recipe) {
    if (err) return console.log(err);
    return res.send(recipe);
  });
};
```

Add a form to index.html:

```html
<form id="addForm">
  <input type="text" placeholder="Recipe Title" name="title" value="Lasagna" />
  <input type="text" placeholder="Image" name="image" value="lasagna.png" />
  <textarea type="text" placeholder="Description" name="description">
Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.</textarea
  >
  <button type="submit">Submit</button>
</form>
```

Express has built in decoders that parse incoming requests with urlencoded or json payloads. Add to server.js:

```js
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
```

The HTML form elements have an attribute named enctype, if not specified, its value defaults to "application/x-www-form-urlencoded".

Use promise chaining in scripts.js:

```js
function addRecipe(event) {
  event.preventDefault();

  const { title, image, description } = event.target;

  const recipe = {
    title: title.value,
    image: image.value,
    description: description.value,
  };

  fetch("api/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  })
    .then((response) => response.json())
    .then(getRecipes);
}

const addForm = document.querySelector("#addForm");
addForm.addEventListener("submit", addRecipe);
```

Kill all exiting entries and test the form.

### DEMO: Get via Postman

Modeling an API is a common task and can become quite involved. There is a command line utility called `curl` which you will often find in API documentation.

```sh
$ curl -o example.html www.example.com

$ curl www.example.com

$ curl -i -X POST -H 'Content-Type: application/json' -d '{"title": "Toast", "image": "toast.png", "description":"Tasty!"}' http://localhost:3000/api/recipes
```

Although its good for a quick test, few enjoy using curl to create and examine complex APIs. Many people use a utility such as [Postman](https://www.getpostman.com/).

Test a GET in postman with [http://localhost:3000/api/recipes/](http://localhost:3000/api/recipes/) and then delete all the recipes: [http://localhost:3000/api/killall/](http://localhost:3000/api/killall/)

Create a new Recipe in Postman

1. Set Postman to POST, set the URL in Postman to `http://localhost:3000/api/recipes/`
2. Set Headers to `Content-Type: application/x-www-form-urlencoded`
3. Choose `x-www-form-urlencoded` in `Body`
4. Set the keys and values as per the curl test above
5. Hit `Send`

Refresh `http://localhost:3000/recipes` or use Postman's history to see the new entry at the end.

Save the query in Postman to a new Postman collection.

## Deleting a Recipe

Our next REST endpoint, _delete_, uses [model.deleteOne](https://mongoosejs.com/docs/api/model.html#model_Model.remove). Add this to `recipe.controllers.js`.

```js
exports.delete = function (req, res) {
  let id = req.params.id;
  Recipe.deleteOne({ _id: id }, () => {
    return res.sendStatus(202);
  });
};
```

Check it out with curl (replacing the id at the end of the URL with a _known id_ from the GET (`api/recipes`) endpoint):

```sh
curl -i -X DELETE http://localhost:3000/api/recipes/<id>
```

## Deleting on the Front End

- Add a delete link to the generated output

```js
function renderRecipes(recipes) {
  recipes.forEach((recipe) => {
    let recipeEl = document.createElement("div");
    recipeEl.innerHTML = `
      <img src="img/${recipe.image}" />
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <p>${recipe._id}</p>
      <a class="delete" data-id=${recipe._id} href="#">Delete</a>
    `;
    document.querySelector(".recipes").append(recipeEl);
  });
}
```

Note - the proper use of buttons vs links.

```css
.delete {
  background: unset;
  margin: unset;
  border: none;
  padding: 0;
  color: #007eb6;
  cursor: pointer;
}
```

Note the use of `data-id` above.

Use fetch passing it a second parameter - options:

```js
function deleteRecipe(event) {
  fetch(`api/recipes/${event.target.dataset.id}`, {
    method: "DELETE",
  }).then(location.reload());
}
```

Here are the client side scripts with a bit of restructuring and new funtionality near the bottom to support deletion and importing:

```js
function getRecipes() {
  document.querySelector(".recipes").innerHTML = ``;
  fetch(`api/recipes`)
    .then((response) => response.json())
    .then((recipes) => renderRecipes(recipes));
}

function addRecipe(event) {
  event.preventDefault();
  const { title, image, description } = event.target;
  const recipe = {
    title: title.value,
    image: image.value,
    description: description.value,
  };
  fetch("api/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  })
    .then((response) => response.json())
    .then(getRecipes);
}

function renderRecipes(recipes) {
  recipes.forEach((recipe) => {
    // destructure
    const { _id, title, image, description } = recipe;
    let recipeEl = document.createElement("div");
    recipeEl.innerHTML = `
    <img src="img/${image}" />
    <h3><a href="detail.html?recipe=${_id}">${title}</a></h3>
    <p>${description}</p>
    <button class="delete" data-id=${recipe._id} href="#">Delete</button>
  `;
    return document.querySelector(".recipes").append(recipeEl);
  });
}

function deleteRecipe(event) {
  fetch(`api/recipes/${event.target.dataset.id}`, {
    method: "DELETE",
  }).then(getRecipes());
}

// new
function seed() {
  fetch("api/import").then(getRecipes);
}

function handleClicks(event) {
  if (event.target.matches("[data-id]")) {
    deleteRecipe(event);
  } else if (event.target.matches("#seed")) {
    seed();
  }
}

document.addEventListener("click", handleClicks);

const addForm = document.querySelector("#addForm");
addForm.addEventListener("submit", addRecipe);

getRecipes();
```

Add a button to index.html:

```js
<button id="seed">Load Seed Data</button>
```

## Find by ID

Let's create a detail page for each recipe using findById function.

Start by filling out the findByID function to use Mongoose's `Model.findOne` in `recipe.controllers`:

```js
exports.findById = (req, res) => {
  const id = req.params.id;
  Recipe.findOne({ _id: id }, (err, json) => {
    if (err) return console.log(err);
    return res.send(json);
  });
};
```

Then, add a link to the details page we are about to create.

In the `renderRecipes` function in scripts.js:

```html
<h3><a href="detail.html?recipe=${recipe._id}">${recipe.title}</a></h3>
```

Note that we are including the recipe id (`_id`) in the URL.

## Detail Page

- Save index.html as detail.html
- change the html:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="stylesheet" href="css/styles.css" />
    <title>Recipes!</title>
  </head>
  <body>
    <div id="root">
      <h1>Recipes!</h1>

      <div class="recipe"></div>
    </div>
    <script src="js/details.js"></script>
  </body>
</html>
```

Create `details.js` and within a new function:

```js
function showDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("recipe");

  fetch(`api/recipes/${recipeId}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((recipe) => renderRecipe(recipe));
}

function renderRecipe(recipe) {
  recipeEl = document.createElement("div");
  recipeEl.innerHTML = `
    <img src="img/${recipe.image}" />
    <h3>${recipe.title}</h3>
    <p>${recipe.description}</p>
    <a href="/">Back</a>
    `;
  document.querySelector(".recipe").append(recipeEl);
}

showDetail();
```

Note the use of [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams).

Now we should be able to navigate to the detail page and see the recipe in the console.

## Mongoose Model.findByIdAndUpdate

We will use a form in `detail.html` to update and edit the recipe.

Update `recipe.controllers` to use `findByIdAndUpdate`:

```js
exports.update = function (req, res) {
  console.log(req.body);
  const id = req.params.id;
  Recipe.findByIdAndUpdate(id, req.body, { new: true }, (err, response) => {
    if (err) return console.log(err);
    res.send(response);
  });
};
```

Edit the form in `detail.html`:

```html
<h3>Edit Recipe</h3>
<form id="editForm">
  <input type="text" placeholder="Recipe Title" name="title" />
  <input type="text" placeholder="Image" name="image" />
  <textarea type="text" placeholder="Description" name="description"></textarea>
  <button>Update</button>
</form>
```

Note the button action.

Populate the form fields using data from the recipe:

```js
function renderRecipe(recipe) {
  const { image, title, description } = recipe;
  recipeEl = document.createElement("div");
  recipeEl.innerHTML = `
    <img src="img/${image}" />
    <h3>${title}</h3>
    <p>${description}</p>
    <a href="/">Back</a>
    `;

  editForm.title.value = title;
  editForm.image.value = image;
  editForm.description.value = description;
  document.querySelector(".recipe").append(recipeEl);
}
```

We will test our updating capabilities by creating a function for the form's `updateRecipe` call using `fetch` and an options object.

```js
const updateRecipe = (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("recipe");
  const { title, image, description } = event.target;
  const updatedRecipe = {
    _id: recipeId,
    title: title.value,
    image: image.value,
    description: description.value,
  };
  fetch(`api/recipes/${recipeId}`, {
    method: "PUT",
    body: JSON.stringify(updatedRecipe),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(showDetail);
};

const editForm = document.querySelector("#editForm");
editForm.addEventListener("submit", updateRecipe);
```

Editing the form should now change the entry.

## Adding File Upload

We will add file uploading to our API using the [File Upload](https://www.npmjs.com/package/express-fileupload) npm package for ExpressJS.

Install File Upload:

`npm i express-fileupload`

Require, register and create a route for it in `server.js`:

```js
...
const fileUpload = require('express-fileupload');
...
app.use(fileUpload());
...
app.post('/api/upload', recipeControllers.upload);
```

Here is a working function for the api endpoint. Add it to `recipe.controllers.js`:

```js
exports.upload = function (req, res) {
  console.log(req.files);
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }
  let file = req.files.file;
  file.mv(`./public/img/${req.body.filename}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ file: `public/img/${req.body.filename}` });
    console.log(res.json);
  });
};
```

Looking at the [example project](https://github.com/richardgirges/express-fileupload/tree/master/example) we find a form to use as a starting point.

```html
<form action="/api/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="file" accept="image/png" />
  <input type="text" placeholder="File name" name="filename" />
  <button type="submit">Upload</button>
</form>
```

Note the encType attribute on the form.

Upload an image (reuse one of the images in `/public/img/`) and give it a unique name and create a recipe that uses the new image.

Once successful, set the return value in the corresponding controller's function to `return res.sendStatus(200);`.

## Update the Recipe Model

Add a default `created` value of type Date to `recipe.model`:

```js
const RecipeSchema = new Schema({
  title: String,
  created: {
    type: Date,
    default: Date.now,
  },
  description: String,
  image: String,
});
```

`<p>Created ${recipe.created}<p>`

Test Mongoose by adding new properties to our recipes.

Edit the `import` function to include ingredients and preparation arrays:

```js
exports.import = function (req, res) {
  Recipe.create(
    {
      title: "Lasagna",
      description:
        "Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.",
      image: "lasagna.png",
      ingredients: ["salt", "honey", "sugar", "rice", "walnuts", "lime juice"],
      preparation: [
        { step: "Boil water" },
        { step: "Fry the eggs" },
        { step: "Serve hot" },
      ],
    },
    {
      title: "Pho-Chicken Noodle Soup",
      description:
        'Pho (pronounced "fuh") is the most popular food in Vietnam, often eaten for breakfast, lunch and dinner. It is made from a special broth that simmers for several hours infused with exotic spices and served over rice noodles with fresh herbs.',
      image: "pho.png",
      ingredients: ["salt", "honey", "sugar", "rice", "walnuts", "lime juice"],
      preparation: [
        { step: "Boil water" },
        { step: "Fry the eggs" },
        { step: "Serve hot" },
      ],
    },
    {
      title: "Guacamole",
      description:
        "Guacamole is definitely a staple of Mexican cuisine. Even though Guacamole is pretty simple, it can be tough to get the perfect flavor - with this authentic Mexican guacamole recipe, though, you will be an expert in no time.",
      image: "guacamole.png",
      ingredients: ["salt", "honey", "sugar", "rice", "walnuts", "lime juice"],
      preparation: [
        { step: "Boil water" },
        { step: "Fry the eggs" },
        { step: "Serve hot" },
      ],
    },
    {
      title: "Hamburger",
      description:
        "A Hamburger (often called a burger) is a type of sandwich in the form of  rounded bread sliced in half with its center filled with a patty which is usually ground beef, then topped with vegetables such as lettuce, tomatoes and onions.",
      image: "hamburger.png",
      ingredients: ["salt", "honey", "sugar", "rice", "walnuts", "lime juice"],
      preparation: [
        { step: "Boil water" },
        { step: "Fry the eggs" },
        { step: "Serve hot" },
      ],
    },
    function (err) {
      if (err) return console.log(err);
      return res.sendStatus(202);
    }
  );
};
```

If you delete with the `killall` endpoint and reload the recipes endpoint, it will not include the arrays.

Add new properties to our Recipe schema.

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: String,
  created: {
    type: Date,
    default: Date.now,
  },
  description: String,
  image: String,
  ingredients: Array,
  preparation: Array,
});

module.exports = mongoose.model("Recipe", RecipeSchema);
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

- a default value
- a custom validation function
- indicate a field is required
- a get function that allows you to manipulate the data before it is returned as an object
- a set function that allows you to manipulate the data before it is saved to the database
- create indexes to allow data to be fetched faster

Certain data types allow you to customize how the data is stored and retrieved from the database. A String data type also allows you to specify the following additional options:

- convert it to lowercase
- convert it to uppercase
- trim data prior to saving
- a regular expression that can limit data allowed to be saved during the validation process
- an enum that can define a list of strings that are valid

```js
  const {
    created,
    image,
    title,
    description,
    ingredients,
    preparation,
  } = recipe;
  ...
  recipeEl.innerHTML = `
  <img src="img/${image}" />
  <h3>${title}</h3>
  <p>${description}</p>
  <h4>Ingredients</h4>
  <ul>
    ${ingredients[0]}
  </ul>
  <h4>Preparation</h4>
  <ul>
    ${preparation.map((prep) => `<li>${prep.step}</li>`).join("")}
  </ul>
  <p>Created ${created}<p>
  <a href="/">Back</a>
  `;
```

The Array data type allows you to store JavaScript-like arrays. With an Array data type, you can perform common JavaScript array operations on them, such as push, pop, shift, slice, etc.

## Atlas

Rather than installing a database on our local computer we could use [MongoDB's](https://www.mongodb.com) cloud service Atlas.

1. Create an account and sign in
2. Create a project called NYU
3. Create a cluster naming it `recipes`
4. Create a database user (this is different from the login username and password) with Read/Write access
5. Whitelist access from anywhere (n the 'Network Access' section of the MongoDB UI)
6. Select a connection method (select Connect your Application) and copy the connection string

[Here](https://www.mongodb.com/developer/how-to/use-atlas-on-heroku/#std-label-configure-heroku-ip-address-in-atlas) is a full set of instructions for integrating MongoDB Atlas and Heroku.

## Deployment

We will deploy to [Heroku](https://devcenter.heroku.com/articles/git).

Before deployment we remove sensitive information and set environment variables for our project.

Create a `.env` file in the root:

`.env`:

```sh
NODE_ENV=development
DATABASE=mongodb+srv://daniel:dd2345@recipes-3k4ea.mongodb.net/test?retryWrites=true&w=majority
PORT=3000
```

Be sure to replace the DATABASE with your own url!!!

Install a helper [dotenv](https://www.npmjs.com/package/dotenv):

`$ npm install dotenv`

Require it in `server.js`:

```js
require("dotenv").config();
```

Note: you should use your own database. You should not push the .env file to Github by adding it to `.gitignore`.

Test it in `server.js`. Replace the existing dataBaseURL variable with:

```
const dataBaseURL = process.env.DATABASE;
```

Ensure that `server.js` specifies `process.env`. Replace the lines at the bottom with:

```js
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
```

The server should still be running successfully on port 3000.

Ensure that your package json includes `server.js` as the `main` file:

`"main": "server.js",`

and that you have a node start script defined:

`"start": "node server.js",`

Create a git repo and deploy to Github.

1. Create an account and login to Heroku
2. Create a project
3. Go to the deployment tab and specify with Github repo and branch you are deploying from and enable automatic deploys. Be sure to monitor the build.
4. Push the desired branch to Github

<!-- On Heroku set the production environment variables. -->

## Instructor Notes

In case you get an error message stating that the port is already in use:

`https://stackoverflow.com/questions/4075287/node-express-eaddrinuse-address-already-in-use-kill-server`

Using async/await:

```js
addForm.onsubmit = async (e) => {
  e.preventDefault();

  const { title, image, description } = event.target;

  const recipe = {
    title: title.value,
    image: image.value,
    description: description.value,
  };

  await fetch("api/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  });

  getRecipes();
};
```
