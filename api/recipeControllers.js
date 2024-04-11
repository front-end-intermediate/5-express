import recipeModel from "./recipeModel.js";

export const findAll = function (req, res) {
  recipeModel.find({}).then((data) => res.send(data));
};

export const findById = function () {};

export const add = function (req, res) {
  recipeModel.create(req.body).then((data) => res.send(data));
};

export const update = function () {};

export const deleteRecipe = function (req, res) {
  let id = req.params.id;
  recipeModel.deleteOne({ _id: id }).then(res.sendStatus(202));
};

export const killall = function (req, res) {
  recipeModel.deleteMany({}).then(res.sendStatus(202));
};

export const importRecipes = function (req, res) {
  recipeModel
    .create(
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
    )
    .then(res.sendStatus(201));
};
