
const API_KEY = "efb112024b66ce0358bede0b0dec7776";
const BASE_URL = "https://api.themoviedb.org/3"

const movieContainer = document.getElementById("movieContainer");

let currentPage = 1;
let movies =[];

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

    movieCard.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
    <div class="movie-info">
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.vote_average}</p>
    </div>
      `;
    
    movieContainer.appendChild(movieCard)
  }
);
}

getMovies(currentPage)

const loadMoreBtn = document.getElementById("loadMore");

loadMoreBtn.addEventListener("click", ()=>{
  currentPage++;
  getMovies(currentPage)
})

// getMovies(1)
// getMovies(2)
// getMovies(3)