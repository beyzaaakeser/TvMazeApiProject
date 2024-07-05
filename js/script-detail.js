const baseUrl = "https://api.tvmaze.com";

const castContainer = document.getElementById("carousel");
const slideContainer = document.querySelector(".slide-container")

const url = new URL(document.URL);
const searchParams = url.searchParams;
const showId = searchParams.get("id");

const getShowDetails = (showId, cb) => {
    const url = `${baseUrl}/shows/${showId}`;
    fetch(url)
        .then((resp) => resp.json())
        .then((data) => cb(data));
};

getShowDetails(showId, (show) => {

    let genre = show.genres.join(', - ');

    if (genre == null || genre === '') {
        genre = "Surprise 😊";
    }
    const title = document.getElementById("title");
    const image = document.getElementById("image");
    const explanation = document.getElementById("explanation");
    const genres = document.getElementById("genres");
    const language = document.getElementById("language");
    const country = document.getElementById("country");
    const rating = document.getElementById("rating");

    title.innerHTML = show.name.toUpperCase();
    explanation.innerHTML = show.summary;
    image.setAttribute("src", show.image?.original);
    genres.innerHTML = genre;
    language.innerHTML = show.language;
    country.innerHTML = show.network?.country.name;
    rating.innerHTML = show.rating?.average;

    title.style.backgroundImage = `url(${show.image.original})`;
    title.style.backgroundSize = "cover"; // Arka plan resmini kapsayacak şekilde ayarlar
    title.style.backgroundPosition = "center"; // Arka plan resmini ortalar
    title.style.backgroundRepeat = "no-repeat"; // Arka plan resminin tekrar etmesini engeller
});


const getShowCast = (showId, cb) => {
    const url = `${baseUrl}/shows/${showId}/cast`;
    fetch(url)
        .then((resp) => resp.json())
        .then((data) => cb(data));
}


getShowCast(showId, (show) => {

    console.log(show)
    if(show.length === 0){
        slideContainer.classList.add("d-none")
    }

    let movieImage = "img/noimage.png";

    show.forEach(cast => {

        if (cast.character?.image?.medium) {
            movieImage = cast.character?.image?.medium;
        }

        castContainer.innerHTML += `  
                <li class="card" id="card">
                <div class="img"><img src="${movieImage}"" alt="img" draggable="false"></div>
                <h2>${cast.character?.name}</h2>     
                </li>   
        `
    });
    const wrapper = document.querySelector(".wrapper");
    const carousel = document.querySelector(".carousel");
    const firstCardWidth = carousel.querySelector(".card").offsetWidth;
    const arrowBtns = document.querySelectorAll(".wrapper i");
    const carouselChildrens = [...carousel.children];

    let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carousel at once
    let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
    carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
        carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
    });

// Insert copies of the first few cards to end of carousel for infinite scrolling
    carouselChildrens.slice(0, cardPerView).forEach(card => {
        carousel.insertAdjacentHTML("beforeend", card.outerHTML);
    });

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
    arrowBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
        });
    });

    const dragStart = (e) => {
        isDragging = true;
        carousel.classList.add("dragging");
        // Records the initial cursor and scroll position of the carousel
        startX = e.pageX;
        startScrollLeft = carousel.scrollLeft;
    }

    const dragging = (e) => {
        if(!isDragging) return; // if isDragging is false return from here
        // Updates the scroll position of the carousel based on the cursor movement
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
    }

    const dragStop = () => {
        isDragging = false;
        carousel.classList.remove("dragging");
    }

    const infiniteScroll = () => {
        // If the carousel is at the beginning, scroll to the end
        if(carousel.scrollLeft === 0) {
            carousel.classList.add("no-transition");
            carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
            carousel.classList.remove("no-transition");
        }
        // If the carousel is at the end, scroll to the beginning
        else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
            carousel.classList.add("no-transition");
            carousel.scrollLeft = carousel.offsetWidth;
            carousel.classList.remove("no-transition");
        }

        // Clear existing timeout & start autoplay if mouse is not hovering over carousel
        clearTimeout(timeoutId);
        if(!wrapper.matches(":hover")) autoPlay();
    }

    const autoPlay = () => {
        if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
        // Autoplay the carousel after every 2500 ms
        timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
    }
    autoPlay();

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    carousel.addEventListener("scroll", infiniteScroll);
    wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
    wrapper.addEventListener("mouseleave", autoPlay);
})


