
const API_KEY = "efb112024b66ce0358bede0b0dec7776";
const BASE_URL = "https://api.themoviedb.org/3"

const movieContainer = document.getElementById("movieContainer");

const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  14: "Fantasy",
  27: "Horror",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller"
};

let currentPage = 1;
let movies =[];
// for favorites
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
// for watchlist
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
const watchlistItems = document.getElementById("watchlistItems");


// adding to watchlist and displaying it function
function renderWatchlist(){
  watchlistItems.innerHTML ="";

  watchlist.forEach(movie=>{
    const li = document.createElement("li");
    // li.textContent = movie.title;
    li.innerHTML =`
    ${movie.title}
    <button class="remove-btn" data-id="${movie.id}">✖</button>
    `;

    watchlistItems.appendChild(li);
  })
  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  addRemoveListerners()
}

// creating a fucntion for removing from watchlist

function addRemoveListerners(){
  const removeBtns = document.querySelectorAll(".remove-btn");

  removeBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
      const id = Number(btn.dataset.id);

      watchlist = watchlist.filter(movie => movie.id !== id);

      renderWatchlist();
      displayMovies(movies);
    })
  })
}
//clear all logic of watchlist
document.getElementById("clearWatchlist")
.addEventListener("click",()=>{
  watchlist =[];
  renderWatchlist();
  displayMovies(movies);
})

async function getMovies(page = 1) {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  const data = await response.json();

  movies = [...movies, ...data.results]
  displayMovies(movies);
  // displayMovies(data.results);
}


function displayMovies(movies){
  movieContainer.innerHTML="";

  movies.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const genres = movie.genre_ids
    .slice(0, 2)
    .map(id => genreMap[id])
    .join(", ");

    movieCard.innerHTML = `
    <div class="movie-poster">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
      <span class="heart" data-id="${movie.id}">♡</span>
    </div>

    <div class="movie-info">
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.vote_average} | ${genres}</p>
      <button class="watchlist-btn" data-id="${movie.id}" data-title="${movie.title}">
        Add to Watchlist
      </button>
    </div>

    <div class="movie-overview">
      <h3>${movie.title}</h3>
      ${movie.overview || "No description available."}
    </div> 
      `;
    
    movieContainer.appendChild(movieCard)



    // adding "favorite" heart
    const heart = movieCard.querySelector(".heart");

    if (favorites.includes(movie.id)){
      heart.classList.add("active");
    }
    // 31 march i added stopPropagation in both heart and watchlist even listener, so that when button is clickd , card dont flip.
    heart.addEventListener("click", (e)=>{
      e.stopPropagation();

      heart.classList.toggle("active");

      if (favorites.includes(movie.id)){
        favorites = favorites.filter(id => id !== movie.id);
      } else {
        favorites.push(movie.id)
      }

      localStorage.setItem("favorites",JSON.stringify(favorites));
    })
    // watchlist button js
    const watchBtn = movieCard.querySelector(".watchlist-btn");

    // check if already added
    if (watchlist.some(item =>item.id === movie.id)){
      watchBtn.textContent = "✓ Added";
      watchBtn.classList.add("added");
    }

    watchBtn.addEventListener("click",(e)=>{
      e.stopPropagation();

      const exists = watchlist.some(item=>item.id === movie.id);

      if (exists){
        // remove
        watchlist = watchlist.filter(item => item.id !== movie.id);
        watchBtn.textContent = "Add to Watchlist";
        watchBtn.classList.remove("added");
      } else{
        const movieData = {
        id: movie.id,
        title: movie.title
      };

        watchlist.push(movieData);
        // renderWatchlist();

        // watchBtn.textContent = "✓ Added";
        watchBtn.textContent = "Remove";
        watchBtn.classList.add("added");
      }
      renderWatchlist();
    });

    // flip card feature. showing context of movie. 31 march.
    const overview = movieCard.querySelector(".movie-overview");
    const poster = movieCard.querySelector(".movie-poster");
    const info = movieCard.querySelector(".movie-info");

    movieCard.addEventListener("click", () => {

    const isHidden = overview.style.display === "block";

    overview.style.display = isHidden ? "none" : "block";
    poster.style.display = isHidden ? "block" : "none";
    info.style.display = isHidden ? "block" : "none";

    });
  });
}



// calling above functions to display movies
getMovies(currentPage)

const loadMoreBtn = document.getElementById("loadMore");

loadMoreBtn.addEventListener("click", ()=>{
  currentPage++;
  getMovies(currentPage)
})

// getMovies(1)
// getMovies(2)
// getMovies(3)

//calling watchlist display fucntion
renderWatchlist();




// adding js for random movie suggestion
const randomBtn = document.getElementById("randomMovie");

randomBtn.addEventListener("click",()=>{
  if (watchlist.length === 0){
    alert("Watchlist is empty :(");
    return
  }

const randomIndex = Math.floor(Math.random() * watchlist.length);

const randomMovie = watchlist[randomIndex];

alert(`🎬 Tonight's Movie: ${randomMovie.title}`)
})



// watchlist toggle 
const watchlistToggle = document.getElementById("watchlistToggle");
const watchlistPanel = document.getElementById("watchlist");
const hideWatchlist = document.getElementById("hideWatchlist");

watchlistToggle.addEventListener("click", ()=>{
  watchlistPanel.classList.add("open");
});

hideWatchlist.addEventListener("click", ()=>{
  watchlistPanel.classList.remove("open");
});
