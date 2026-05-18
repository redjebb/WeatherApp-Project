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

const loadingElement = document.getElementById("loading-spinner");

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
        errorMessageElement.classList.add("hidden");
        weatherInfoElement.classList.add("hidden");
        loadingElement.classList.remove("hidden");

        const coords = await getCoordinates(cityName);

        const weatherData = await getWeatherData(coords.lat, coords.lon);

        updateUI(weatherData, coords.name);

        loadingElement.classList.add("hidden");
        weatherInfoElement.classList.remove("hidden");
    } catch (error) {
        console.error(error);

        loadingElement.classList.add("hidden");

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

async function getWeatherData(lat, lon) {
    const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;

    const response = await fetch(url);

    const data = await response.json();

    return data;
}

function updateUI(data, cityName) {
    const current = data.current;

    locationElement.textContent = cityName;

    temperatureElement.textContent = Math.round(current.temperature_2m);

    humidityElement.textContent = `${current.relative_humidity_2m}%`;

    windSpeedElement.textContent = `${current.wind_speed_10m} km/h`;

    const weatherMapping = {
        0: { text: "Clear Sky", iconClass: "fa-sun" },
        1: { text: "Mainly Clear", iconClass: "fa-cloud-sun" },
        2: { text: "Partly Cloudy", iconClass: "fa-cloud-sun" },
        3: { text: "Overcast", iconClass: "fa-cloud" },
        45: { text: "Fog", iconClass: "fa-smog" },
        48: { text: "Depositing Rime Fog", iconClass: "fa-smog" },
        51: { text: "Light Drizzle", iconClass: "fa-cloud-rain" },
        53: { text: "Moderate Drizzle", iconClass: "fa-cloud-rain" },
        55: { text: "Dense Drizzle", iconClass: "fa-cloud-rain" },
        61: { text: "Slight Rain", iconClass: "fa-cloud-showers-heavy" },
        63: { text: "Moderate Rain", iconClass: "fa-cloud-showers-heavy" },
        65: { text: "Heavy Rain", iconClass: "fa-cloud-showers-heavy" },
        71: { text: "Slight Snow", iconClass: "fa-snowflake" },
        73: { text: "Moderate Snow", iconClass: "fa-snowflake" },
        75: { text: "Heavy Snow", iconClass: "fa-snowflake" },
        95: { text: "Thunderstorm", iconClass: "fa-bolt" }
    };

    const match = weatherMapping[current.weather_code] || {
        text: "Unknown",
        iconClass: "fa-question"
    };

    descriptionElement.textContent = match.text;

    weatherIconElement.className = `fa-solid fa-5x ${match.iconClass}`;

    cityInput.value = "";
}