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
      });
    });
  };
};

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
