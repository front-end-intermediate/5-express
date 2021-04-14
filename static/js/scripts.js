function getRecipes() {
  document.querySelector(".recipes").innerHTML = ``;
  fetch(`api/recipes`)
    .then((response) => response.json())
    .then((recipes) => renderRecipes(recipes));
}

function renderRecipes(recipes) {
  recipes.forEach((recipe) => {
    recipeEl = document.createElement("div");
    recipeEl.innerHTML = `
      <img src="img/${recipe.image}" />
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <p>${recipe._id}</p>
      <button class="delete" data-id=${recipe._id}>Delete</button>
    `;
    document.querySelector(".recipes").append(recipeEl);
  });
}

function addRecipe(event) {
  event.preventDefault();
  // console.log("  ", event.target.title.value);
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

function deleteRecipe(event) {
  fetch(`api/recipes/${event.target.dataset.id}`, {
    method: "DELETE",
  }).then(getRecipes);
}

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
