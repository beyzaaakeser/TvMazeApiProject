import {searchShows} from "./tvmaze-api.js";

const container = document.getElementById("cont");
const txtSearch = document.getElementById("txtSearch");

const baseUrl = "https://api.tvmaze.com";

let timeoutSearch = null;

document.getElementById("txtSearch").addEventListener("input", (e) => {
    const query = e.target.value;

    if (query) {
        if (timeoutSearch) clearTimeout(timeoutSearch);

        timeoutSearch = setTimeout(() => {
            searchShows(query, (shows) => {
                createMovies1(shows);
                txtSearch.value = "";
            });

        }, 500);

    } else {
        container.innerHTML = "";
        getPrograms();
    }
});

const getPrograms = async () => {
    const url = `${baseUrl}/shows?page=1`;

    try {
        const response = await fetch(url).then();
        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Fetch error: ", error);
        return null;
    }
};

container.addEventListener('click', (e) => {
    const selectedCard = e.target.closest(".card");
    const showId = selectedCard.dataset.show;
    location.href = `details.html?id=${showId}`;
})

getPrograms()
    .then((data) => {
        createMovies(data);
    })
    .catch((error) => {
        console.error("Error in fetchData:", error);
    });

const createMovies = (shows) => {
    container.innerHTML = "";
    shows.forEach((item) => {
        const movieCard = createMovieCard(item);
        container.insertAdjacentHTML("afterbegin", movieCard);
    });
};

const createMovieCard = (item) => {

    const {id, image, name, genres} = item;

    let movieImage = "img/noimage.png";
    if (image) {
        movieImage = image?.medium;
    }

    return `
      <div class="movie mb-4" id="movie">
        <div class="card " style="cursor: pointer" data-show="${id}">
          <img src="${movieImage}" class="card-img-top" alt="${name}" />
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">
              "${genres}"
            </p>
          </div>
        </div>
      </div>`;
};

const createMovies1 = (shows) => {
    container.innerHTML = "";
    shows.forEach((item) => {
        const movieCard = createMovieCard1(item);
        container.insertAdjacentHTML("afterbegin", movieCard);
    });
};

const createMovieCard1 = (item) => {
    const {id, image, name, genres} = item.show;
    let movieImage = "img/noimage.png";
    if (image) {
        movieImage = image?.medium;
    }

    return `
      <div class="movie">
        <div class="card " style="cursor: pointer" data-show="${id}">
          <img src="${movieImage}" class="card-img-top" alt="${name}" />
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">
              "${genres}"
            </p>
          </div>
        </div>
      </div>`;
};

window.addEventListener('scroll', function () {
    const arrowElement = document.querySelector('.arrow');
    if (window.scrollY > 0) {
        arrowElement.classList.remove('d-none');
    } else {
        arrowElement.classList.add('d-none');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const banner = document.querySelector('.banner');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 0) {
            banner.classList.add('fixed');
        } else {
            banner.classList.remove('fixed');
        }
    });
});
