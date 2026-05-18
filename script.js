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