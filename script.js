const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const ui = {
    input: document.getElementById("city-input"),
    searchBtn: document.getElementById("search-btn"),

    weatherCard: document.getElementById("weather-info"),
    location: document.getElementById("location"),
    temperature: document.getElementById("temperature"),
    icon: document.getElementById("weather-icon"),
    description: document.getElementById("description"),

    humidity: document.getElementById("humidity"),
    windSpeed: document.getElementById("wind-speed"),

    error: document.getElementById("error-message"),
    loading: document.getElementById("loading-spinner")
};

ui.searchBtn.addEventListener("click", handleSearch);

ui.input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

async function handleSearch() {
    const cityName = ui.input.value.trim();

    if (!cityName) {
        return;
    }

    try {
        ui.error.classList.add("hidden");
ui.weatherCard.classList.add("hidden");
ui.loading.classList.remove("hidden");

        const coords = await getCoordinates(cityName);

        const weatherData = await getWeatherData(coords.lat, coords.lon);

        updateUI(weatherData, coords.name);

        ui.loading.classList.add("hidden");
        ui.weatherCard.classList.remove("hidden");
    } catch (error) {

       ui.loading.classList.add("hidden");

        ui.error.classList.remove("hidden");
ui.weatherCard.classList.add("hidden");
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

const WEATHER_MAPPING = {
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

function updateUI(data, cityName) {
    const current = data.current;

   ui.location.textContent = cityName;

    ui.temperature.textContent = Math.round(current.temperature_2m);

    ui.humidity.textContent = `${current.relative_humidity_2m}%`;

    ui.windSpeed.textContent = `${current.wind_speed_10m} km/h`;

const match = WEATHER_MAPPING[current.weather_code] || {
    text: "Unknown",
    iconClass: "fa-question"
};

    ui.description.textContent = match.text;

    ui.icon.className = `fa-solid fa-5x ${match.iconClass}`;

    ui.input.value = "";
}