// URL за търсене на координати по име на град
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

// URL за взимане на метеорологични данни
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Запазва последната температура в Целзий
// Използва се при превключване между °C и °F
let currentTempCelsius = null;

// Запазва последната скорост на вятъра в km/h
let currentWindKmH = null;

// Следи коя мерна единица е активна
// true = Целзий, false = Фаренхайт
let isCelsius = true;

// Всички DOM елементи са събрани в един обект
// Така кодът е по-подреден и лесен за поддръжка
const ui = {
    input: document.getElementById("city-input"),
    searchBtn: document.getElementById("search-btn"),
    unitToggle: document.getElementById("unit-toggle"),

    weatherCard: document.getElementById("weather-info"),
    location: document.getElementById("location"),
    temperature: document.getElementById("temperature"),
    unitDisplay: document.getElementById("unit-display"),
    icon: document.getElementById("weather-icon"),
    description: document.getElementById("description"),

    humidity: document.getElementById("humidity"),
    windSpeed: document.getElementById("wind-speed"),

    error: document.getElementById("error-message"),
    loading: document.getElementById("loading-spinner")
};

// Търсене при натискане на бутона
ui.searchBtn.addEventListener("click", handleSearch);

// Търсене при натискане на Enter
ui.input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleSearch();
});

// Превключване между °C и °F
ui.unitToggle.addEventListener("click", () => {

    // Обръща текущото състояние
    isCelsius = !isCelsius;

    // Променя текста на бутона
    ui.unitToggle.textContent = isCelsius ? "°F" : "°C";

    // Ако вече има заредени данни
    if (currentTempCelsius !== null) {

        // Температурата се преобразува без нова API заявка
        const displayTemp = isCelsius
            ? currentTempCelsius
            : (currentTempCelsius * 9 / 5) + 32;

        ui.temperature.textContent = Math.round(displayTemp);

        // Показва правилната мерна единица
        ui.unitDisplay.textContent = isCelsius ? "°C" : "°F";

        // Преобразуване на скоростта на вятъра
        const displayWind = isCelsius
            ? currentWindKmH
            : currentWindKmH * 0.621371;

        const windUnit = isCelsius ? "km/h" : "mph";

        ui.windSpeed.textContent =
            `${Math.round(displayWind)} ${windUnit}`;
    }
});

/**
 * Стартира търсене на времето за въведения град
 */
async function handleSearch() {

    const cityName = ui.input.value.trim();

    // Ако няма въведен град, прекратяваме функцията
    if (!cityName) {
        return;
    }

    try {

        // Скриваме старите съобщения и показваме зареждане
        ui.error.classList.add("hidden");
        ui.weatherCard.classList.add("hidden");
        ui.loading.classList.remove("hidden");

        // Намиране на координатите на града
        const coords = await getCoordinates(cityName);

        // Изтегляне на времето по координати
        const weatherData = await getWeatherData(
            coords.lat,
            coords.lon
        );

        // Показване на данните в интерфейса
        updateUI(weatherData, coords.name);

        ui.loading.classList.add("hidden");
        ui.weatherCard.classList.remove("hidden");

    } catch (error) {

        // При грешка показваме съобщение
        ui.loading.classList.add("hidden");

        ui.error.classList.remove("hidden");
        ui.weatherCard.classList.add("hidden");
    }
}

/**
 * Взима координатите на град чрез Open-Meteo Geocoding API
 * @param {string} city
 * @returns {Promise<object>}
 */
async function getCoordinates(city) {

    const url =
        `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en`;

    const response = await fetch(url);

    const data = await response.json();

    // Ако градът не е намерен
    if (!data.results || data.results.length === 0) {
        throw new Error("City not found");
    }

    return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
        name: data.results[0].name
    };
}

/**
 * Взима текущото време по координати
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<object>}
 */
async function getWeatherData(lat, lon) {

    const url =
        `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;

    const response = await fetch(url);

    return await response.json();
}

// Справочник за weather кодовете на Open-Meteo
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

/**
 * Показва получените метеорологични данни в страницата
 * @param {object} data
 * @param {string} cityName
 */
function updateUI(data, cityName) {

    const current = data.current;

    // Показване на името на града
    ui.location.textContent = cityName;

    // Запазване на оригиналните стойности
    currentTempCelsius = current.temperature_2m;
    currentWindKmH = current.wind_speed_10m;

    let displayTemp = currentTempCelsius;
    let displayWind = currentWindKmH;
    let tempUnit = "°C";
    let windUnit = "km/h";

    // Ако е избран Фаренхайт
    if (!isCelsius) {

        displayTemp =
            (currentTempCelsius * 9 / 5) + 32;

        displayWind =
            currentWindKmH * 0.621371;

        tempUnit = "°F";
        windUnit = "mph";
    }

    // Обновяване на данните в DOM
    ui.temperature.textContent = Math.round(displayTemp);
    ui.unitDisplay.textContent = tempUnit;
    ui.humidity.textContent =
        `${current.relative_humidity_2m}%`;

    ui.windSpeed.textContent =
        `${Math.round(displayWind)} ${windUnit}`;

    // Търсене на описание според weather кода
    const match =
        WEATHER_MAPPING[current.weather_code] || {
            text: "Unknown",
            iconClass: "fa-question"
        };

    ui.description.textContent = match.text;

    ui.icon.className =
        `fa-solid fa-5x ${match.iconClass}`;

    // Изчистване на полето за търсене
    ui.input.value = "";
}