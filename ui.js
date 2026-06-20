// 1. Импортираме справочника за кодовете от модула за времето
import { WEATHER_MAPPING } from "./weather-codes.js";

// 2. Експортираме обекта с DOM елементите, за да може app.js да ги чете и контролира
export const ui = {
    form: document.getElementById("search-form"),
    input: document.getElementById("city-input"),
    unitToggle: document.getElementById("unit-toggle"),
    historyContainer: document.getElementById("history-container"),
    clearHistoryBtn: document.getElementById("clear-history-btn"),
    forecastContainer: document.getElementById("forecast-container"),
    hourlyContainer: document.getElementById("hourly-container"),

    sunrise: document.getElementById("sunrise"),
    sunset: document.getElementById("sunset"),
    feelsLike: document.getElementById("feels-like"),

    weatherCard: document.getElementById("weather-info"),
    location: document.getElementById("location"),
    temperature: document.getElementById("temperature"),
    unitDisplay: document.getElementById("unit-display"),
    icon: document.getElementById("weather-icon"),
    description: document.getElementById("description"),

    humidity: document.getElementById("humidity"),
    windSpeed: document.getElementById("wind-speed"),

    uvIndex: document.getElementById("uv-index"),
airQuality: document.getElementById("air-quality"),
airQualityTooltip: document.getElementById("air-quality-tooltip"),

    error: document.getElementById("error-message"),
    loading: document.getElementById("loading-spinner")
};

function formatDayName(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short"
    });
}

function formatTime(timeString) {
    return new Date(timeString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getUVLabel(uvIndex) {
    if (uvIndex < 3) return "Low";
    if (uvIndex < 6) return "Moderate";
    if (uvIndex < 8) return "High";
    if (uvIndex < 11) return "Very High";
    return "Extreme";
}

function getAQILabel(aqi) {
    if (aqi <= 20) return "Good";
    if (aqi <= 40) return "Fair";
    if (aqi <= 60) return "Moderate";
    if (aqi <= 80) return "Poor";
    if (aqi <= 100) return "Very Poor";
    return "Extremely Poor";
}

function getUVColor(uvIndex) {
    if (uvIndex < 3) return "#22c55e";
    if (uvIndex < 6) return "#facc15";
    if (uvIndex < 8) return "#f97316";
    if (uvIndex < 11) return "#ef4444";
    return "#a855f7";
}

function getAQIColor(aqi) {
    if (aqi <= 20) return "#22c55e";
    if (aqi <= 40) return "#84cc16";
    if (aqi <= 60) return "#facc15";
    if (aqi <= 80) return "#f97316";
    if (aqi <= 100) return "#ef4444";
    return "#a855f7";
}

function getAQIDescription(aqi) {
    if (aqi <= 20) return "Good: Air quality is very clean and safe for outdoor activities.";
    if (aqi <= 40) return "Fair: Air quality is acceptable for most people.";
    if (aqi <= 60) return "Moderate: Sensitive people may feel mild discomfort.";
    if (aqi <= 80) return "Poor: People with breathing problems should reduce outdoor activity.";
    if (aqi <= 100) return "Very Poor: Outdoor activity should be limited.";
    return "Extremely Poor: Avoid outdoor activity if possible.";
}

function getWeatherIconHTML(match, size = "small") {
    if (match.iconClass === "fa-cloud-sun") {
        return `
            <span class="weather-icon-combo ${size}">
                <i class="fa-solid fa-sun"></i>
                <i class="fa-solid fa-cloud"></i>
            </span>
        `;
    }

    if (match.iconClass === "fa-bolt" || match.iconClass === "fa-cloud-bolt") {
    return `
        <span class="weather-icon-thunder ${size}">
            <i class="fa-solid fa-cloud thunder-cloud"></i>
            <i class="fa-solid fa-bolt thunder-bolt"></i>
            <i class="fa-solid fa-droplet thunder-drop drop-1"></i>
            <i class="fa-solid fa-droplet thunder-drop drop-2"></i>
            <i class="fa-solid fa-droplet thunder-drop drop-3"></i>
        </span>
    `;
}
    return `
        <i class="fa-solid ${match.iconClass} weather-icon-single ${size}"
           style="color: ${match.iconColor}">
        </i>
    `;
}

/**
 * Показва получените метеорологични данни в страницата
 * @param {object} data - Необработените данни от API-то
 * @param {string} cityName - Истинското име на града от геокодирането
 * @param {boolean} isCelsius - Текущото състояние на мерната единица (идва от състоянието в app.js)
 * @param {object} airQualityData - Данни за качество на въздуха
 */
export function updateUI(data, cityName, isCelsius, airQualityData = null) {
    const current = data.current;

    // Показване на името на града
    ui.location.textContent = cityName;

    // Изчисляване на локалните променливи за показване
    let displayTemp = current.temperature_2m;
    let displayWind = current.wind_speed_10m;
    let tempUnit = "°C";
    let windUnit = "km/h";

    // Ако в момента е избран Фаренхайт, пресмятаме стойностите за екрана
    if (!isCelsius) {
        displayTemp = (current.temperature_2m * 9 / 5) + 32;
        displayWind = current.wind_speed_10m * 0.621371;
        tempUnit = "°F";
        windUnit = "mph";
    }

    // Обновяване на данните в DOM
    ui.temperature.textContent = Math.round(displayTemp);
    ui.unitDisplay.textContent = tempUnit;
    ui.humidity.textContent = `${current.relative_humidity_2m}%`;
    ui.windSpeed.textContent = `${Math.round(displayWind)} ${windUnit}`;
    ui.sunrise.textContent = formatTime(data.daily.sunrise[0]);
ui.sunset.textContent = formatTime(data.daily.sunset[0]);

let feelsLikeTemp = current.apparent_temperature;

if (!isCelsius) {
    feelsLikeTemp = (feelsLikeTemp * 9 / 5) + 32;
}

ui.feelsLike.innerHTML = `Feels like <strong>${Math.round(feelsLikeTemp)}${tempUnit}</strong>`;

    if (airQualityData && airQualityData.current) {
    const currentAir = airQualityData.current;

    const uvValue = currentAir.uv_index;
    const aqiValue = currentAir.european_aqi;

    ui.uvIndex.textContent =
        `${Math.round(uvValue)} (${getUVLabel(uvValue)})`;

    ui.airQuality.textContent =
        `${aqiValue} (${getAQILabel(aqiValue)})`;

    ui.uvIndex.style.color = getUVColor(uvValue);
    ui.airQuality.style.color = getAQIColor(aqiValue);

    ui.airQualityTooltip.textContent = getAQIDescription(aqiValue);
} else {
    ui.uvIndex.textContent = "--";
    ui.airQuality.textContent = "--";

    ui.uvIndex.style.color = "";
    ui.airQuality.style.color = "";

    ui.airQualityTooltip.textContent =
        "Air quality shows how polluted the air is. Lower values mean cleaner air.";
}

    // Търсене на описание и икона според weather кода от импортирания справочник
    const match = WEATHER_MAPPING[current.weather_code] || {
        text: "Unknown",
        iconClass: "fa-question",
        iconColor: "#ffffff"
    };

    ui.description.textContent = match.text;
    ui.icon.innerHTML = getWeatherIconHTML(match, "main");

    renderForecast(data.daily, isCelsius);
    renderHourlyForecast(data.hourly, isCelsius);
}

function renderForecast(dailyData, isCelsius) {
    ui.forecastContainer.innerHTML = "";

    for (let index = 1; index <= 5; index++) {
        const dayName = formatDayName(dailyData.time[index]);

        let maxTemp = dailyData.temperature_2m_max[index];
        let minTemp = dailyData.temperature_2m_min[index];

        if (!isCelsius) {
            maxTemp = (maxTemp * 9 / 5) + 32;
            minTemp = (minTemp * 9 / 5) + 32;
        }

        const weatherCode = dailyData.weather_code[index];

        const match = WEATHER_MAPPING[weatherCode] || {
            text: "Unknown",
            iconClass: "fa-question",
            iconColor: "#ffffff"
        };

        const card = document.createElement("div");
        card.className = "forecast-card";

        card.innerHTML = `
    <span>${dayName}</span>
    ${getWeatherIconHTML(match, "small")}
    <span>${match.text}</span>
    <span>
    <span class="temp-min">${Math.round(minTemp)}°</span>
    /
    <span class="temp-max">${Math.round(maxTemp)}°</span>
</span>
`;


        ui.forecastContainer.appendChild(card);
    }
}

function formatHour(timeString) {
    return new Date(timeString).toLocaleTimeString("bg-BG", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function renderHourlyForecast(hourlyData, isCelsius) {
    ui.hourlyContainer.innerHTML = "";

    const now = new Date();

    const futureHours = hourlyData.time
        .map((time, index) => {
            return {
                time,
                temperature: hourlyData.temperature_2m[index],
                weatherCode: hourlyData.weather_code[index]
            };
        })
        .filter((hourData) => new Date(hourData.time) > now)
        .slice(0, 8);

    futureHours.forEach((hourData) => {
        let displayTemp = hourData.temperature;

        if (!isCelsius) {
            displayTemp = (displayTemp * 9 / 5) + 32;
        }

        const match = WEATHER_MAPPING[hourData.weatherCode] || {
            text: "Unknown",
            iconClass: "fa-question",
            iconColor: "#ffffff"
        };

        const card = document.createElement("div");
        card.className = "hourly-card";

        card.innerHTML = `
            <span>${formatHour(hourData.time)}</span>
            ${getWeatherIconHTML(match, "small")}
            <span>${Math.round(displayTemp)}°</span>
        `;


        ui.hourlyContainer.appendChild(card);
    });
}