const baseUrl = "https://api.tvmaze.com";

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

    let genre = show.genres.join(",  ");

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
