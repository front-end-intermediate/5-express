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
  const {
    created,
    image,
    title,
    description,
    ingredients,
    preparation,
  } = recipe;

  document.querySelector(".recipe").innerHTML = ``;
  recipeEl = document.createElement("div");
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

  editForm.title.value = title;
  editForm.image.value = image;
  editForm.description.value = description;
  document.querySelector(".recipe").append(recipeEl);
}

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

showDetail();
