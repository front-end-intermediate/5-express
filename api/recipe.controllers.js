const Recipe = require("./recipe.model");

exports.findAll = function (req, res) {
  Recipe.find({}, function (err, results) {
    return res.send(results);
  });
};

exports.findById = (req, res) => {
  const id = req.params.id;
  Recipe.findOne({ _id: id }, (err, json) => {
    if (err) return console.log(err);
    return res.send(json);
  });
};

exports.add = function (req, res) {
  Recipe.create(req.body, function (err, recipe) {
    if (err) return console.log(err);
    return res.send(recipe);
  });
};

exports.update = function (req, res) {
  console.log(req.body);
  const id = req.params.id;
  Recipe.findByIdAndUpdate(id, req.body, { new: true }, (err, response) => {
    if (err) return console.log(err);
    res.send(response);
  });
};

exports.delete = function (req, res) {
  let id = req.params.id;
  Recipe.deleteOne({ _id: id }, () => {
    return res.sendStatus(202);
  });
};

exports.killall = function (req, res) {
  Recipe.deleteMany({}, (err) => {
    if (err) return console.log(err);
    return res.sendStatus(202);
  });
};

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
