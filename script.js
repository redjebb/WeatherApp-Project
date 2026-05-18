const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");

const weatherIconElement = document.getElementById("weather-icon");
const descriptionElement = document.getElementById("description");

const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");

const errorMessageElement = document.getElementById("error-message");
const weatherInfoElement = document.getElementById("weather-info");

searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

async function handleSearch() {
    const cityName = cityInput.value.trim();

    if (!cityName) {
        return;
    }

    try {
        const coords = await getCoordinates(cityName);

        console.log(coords);

        errorMessageElement.classList.add("hidden");
        weatherInfoElement.classList.remove("hidden");
    } catch (error) {
        console.error(error);

        errorMessageElement.classList.remove("hidden");
        weatherInfoElement.classList.add("hidden");
    }
}

async function getCoordinates(city) {
    const url = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en`;

    const response = await fetch(url);

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found");
    }

    return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
        name: data.results[0].name
    };
}