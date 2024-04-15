const Recipe = require("./recipe.model");

exports.findAll = function (req, res) {
  Recipe.find({}).then((data) => res.send(data));
};

exports.findById = (req, res) => {
  const id = req.params.id;
  Recipe.findByIdAndUpdate(id, req.body, { new: true }).then((data) =>
    res.send(data)
  );
};

exports.add = function (req, res) {
  Recipe.create(req.body).then((data) => res.send(data));
};

exports.update = function (req, res) {
  console.log(req.body);
  const id = req.params.id;
  Recipe.findByIdAndUpdate(id, req.body, { new: true }).then((data) =>
    res.send(data)
  );
};

exports.delete = function (req, res) {
  let id = req.params.id;
  Recipe.deleteOne({ _id: id }).then(res.sendStatus(202));
};

exports.upload = function (req, res) {
  console.log(req.files);
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }
  let file = req.files.file;
  file.mv(`./static/img/${req.body.filename}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ file: `static/img/${req.body.filename}` });
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
  ).then(res.sendStatus(202));
};

exports.killall = function (req, res) {
  Recipe.deleteMany({}).then(res.sendStatus(202));
};
