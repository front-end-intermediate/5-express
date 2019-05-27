// your scripts go here

const navItems = [
  {
    label: 'LOGO',
    link: '#'
  },
  {
    label: 'Travel',
    link: '#travel'
  },
  {
    label: 'Fashion',
    link: '#fashion'
  },
  {
    label: 'Food',
    link: '#food'
  }
];

const nav = document.getElementById('main');

const markup = `
<ul>
${navItems.map( 
  navItem => `<li><a href="${navItem.link}">${navItem.label}</a></li>` ).join('')}
  </ul>
`;
  
  nav.innerHTML = markup;
  
  let topOfNav = nav.offsetTop;
  window.addEventListener('scroll', fixNav);
  
  function fixNav() {
    if(window.scrollY >= topOfNav) {
      document.body.style.paddingTop = nav.offsetHeight + 'px';
      document.body.classList.add('fixed-nav');
    } else {
      document.body.classList.remove('fixed-nav');
      document.body.style.paddingTop = 0;
    }
  }
  
  const logo = nav.querySelector('#main ul li');
  logo.classList.add('logo');
  logo.innerHTML = '<a href="#"><img src="img/logo.svg" /></a>';
  
  var elem = document.querySelector('.site-wrap');
  const nytapi = 'd7d88f32a04d4c6aab4e46735441d0ee';
  const limit = 10;
  var categories = ['food', 'fashion', 'travel'];
  var log = console.log;
  
  function requestStories(section) {
    var url = 'https://api.nytimes.com/svc/topstories/v2/' + section + '.json?api-key=' + nytapi;
    var request = new XMLHttpRequest();
    // Setup our listener to process request state changes
    request.onreadystatechange = function () {
      // Only run if the request is complete
      if (request.readyState !== 4) return;
      // Process the response
      if (request.status >= 200 && request.status < 300) {
        // If successful
        renderStories(request, section); // NEW
      }
    };
    request.open('GET', url, true);
    request.send();
  }
  
  function renderStories(stories, title) {
    
    var sectionHead = document.createElement('div');
    sectionHead.id = title;
    sectionHead.innerHTML = `<h3 class="section-head">${title}</h3>`;
    elem.prepend(sectionHead)    
    
    stories = JSON.parse(stories.responseText).results.slice(0, limit);
    log(stories)
    stories.forEach(function (story) {
      var storyEl = document.createElement('div');
      storyEl.className = 'entry';
      storyEl.innerHTML = `
      <img src="${story.multimedia[0].url}" />
      <div>
      <h3><a target="_blank" href="${story.short_url}">${story.title}</a></h3>
      <p>${sanitizeHTML(story.abstract)}</p>
      </div>
      `;
      sectionHead.append(storyEl); 
    });
  }
  
  function getArticles() {
    categories.forEach(function(category, index){
      requestStories(category)
    })
  }
  
  var sanitizeHTML = function (str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  };
  
  getArticles();