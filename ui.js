// ==========================================================================
// MODULE IMPORTS
// ==========================================================================

// Weather code mapping used to convert API weather codes into labels and icons.
import { WEATHER_MAPPING } from "./weather-codes.js";

// ==========================================================================
// DOM REFERENCES
// ==========================================================================

// Centralized references to all HTML elements used by the application.
// Exported so app.js can control visibility and user interactions.
export const ui = {
    // Search controls
    form: document.getElementById("search-form"),
    input: document.getElementById("city-input"),
    unitToggle: document.getElementById("unit-toggle"),
    suggestionsContainer: document.getElementById("suggestions-container"),

    // Search history controls
    historyContainer: document.getElementById("history-container"),
    clearHistoryBtn: document.getElementById("clear-history-btn"),

    // Main weather content
    weatherCard: document.getElementById("weather-info"),
    location: document.getElementById("location"),
    temperature: document.getElementById("temperature"),
    unitDisplay: document.getElementById("unit-display"),
    icon: document.getElementById("weather-icon"),
    description: document.getElementById("description"),
    feelsLike: document.getElementById("feels-like"),

    // Current weather detail cards
    humidity: document.getElementById("humidity"),
    windSpeed: document.getElementById("wind-speed"),
    uvIndex: document.getElementById("uv-index"),
    sunrise: document.getElementById("sunrise"),
    sunset: document.getElementById("sunset"),
    airQuality: document.getElementById("air-quality"),
    airQualityTooltip: document.getElementById("air-quality-tooltip"),

    // Forecast containers
    hourlyContainer: document.getElementById("hourly-container"),
    forecastContainer: document.getElementById("forecast-container"),

    // Status and alert elements
    weatherAlert: document.getElementById("weather-alert"),
    error: document.getElementById("error-message"),
    loading: document.getElementById("loading-spinner")
};

// ==========================================================================
// DATE AND TIME FORMATTERS
// ==========================================================================

/**
 * Formats an ISO date string as a short English weekday name.
 *
 * @param {string} dateString - ISO date string returned by the weather API.
 * @returns {string} Short weekday name, for example "Mon".
 */
function formatDayName(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short"
    });
}

/**
 * Formats an ISO date-time string as a readable local time.
 *
 * @param {string} timeString - ISO date-time string returned by the weather API.
 * @returns {string} Formatted time, for example "09:30 AM".
 */
function formatTime(timeString) {
    return new Date(timeString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

/**
 * Formats an ISO date-time string as a short English hour label.
 *
 * @param {string} timeString - ISO date-time string returned by the weather API.
 * @returns {string} Formatted hour, for example "03:00 PM".
 */
function formatHour(timeString) {
    return new Date(timeString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

// ==========================================================================
// AIR QUALITY AND UV HELPERS
// ==========================================================================

/**
 * Converts a UV index number into a readable health category.
 *
 * @param {number} uvIndex - UV index value returned by the air quality API.
 * @returns {string} UV category label.
 */
function getUVLabel(uvIndex) {
    if (uvIndex < 3) return "Low";
    if (uvIndex < 6) return "Moderate";
    if (uvIndex < 8) return "High";
    if (uvIndex < 11) return "Very High";
    return "Extreme";
}

/**
 * Converts a European AQI value into a readable air quality category.
 *
 * @param {number} aqi - European AQI value returned by the air quality API.
 * @returns {string} Air quality category label.
 */
function getAQILabel(aqi) {
    if (aqi <= 20) return "Good";
    if (aqi <= 40) return "Fair";
    if (aqi <= 60) return "Moderate";
    if (aqi <= 80) return "Poor";
    if (aqi <= 100) return "Very Poor";
    return "Extremely Poor";
}

/**
 * Returns a color based on UV intensity.
 *
 * @param {number} uvIndex - UV index value returned by the air quality API.
 * @returns {string} CSS color value.
 */
function getUVColor(uvIndex) {
    if (uvIndex < 3) return "#22c55e";
    if (uvIndex < 6) return "#facc15";
    if (uvIndex < 8) return "#f97316";
    if (uvIndex < 11) return "#ef4444";
    return "#a855f7";
}

/**
 * Returns a color based on air quality severity.
 *
 * @param {number} aqi - European AQI value returned by the air quality API.
 * @returns {string} CSS color value.
 */
function getAQIColor(aqi) {
    if (aqi <= 20) return "#22c55e";
    if (aqi <= 40) return "#84cc16";
    if (aqi <= 60) return "#facc15";
    if (aqi <= 80) return "#f97316";
    if (aqi <= 100) return "#ef4444";
    return "#a855f7";
}

/**
 * Returns a detailed explanation for the current air quality category.
 *
 * @param {number} aqi - European AQI value returned by the air quality API.
 * @returns {string} User-friendly air quality explanation.
 */
function getAQIDescription(aqi) {
    if (aqi <= 20) {
        return "Good: Air quality is very clean and safe for outdoor activities.";
    }

    if (aqi <= 40) {
        return "Fair: Air quality is acceptable for most people.";
    }

    if (aqi <= 60) {
        return "Moderate: Sensitive people may feel mild discomfort.";
    }

    if (aqi <= 80) {
        return "Poor: People with breathing problems should reduce outdoor activity.";
    }

    if (aqi <= 100) {
        return "Very Poor: Outdoor activity should be limited.";
    }

    return "Extremely Poor: Avoid outdoor activity if possible.";
}

// ==========================================================================
// WEATHER ICON RENDERING
// ==========================================================================

/**
 * Creates HTML for a weather icon based on the mapped weather condition.
 *
 * Some weather conditions use a single Font Awesome icon.
 * Partly cloudy and thunderstorm conditions use layered icons for a richer design.
 *
 * @param {object} match - Weather mapping object containing icon and color data.
 * @param {string} size - Icon size modifier, usually "main" or "small".
 * @returns {string} HTML string for the weather icon.
 */
function getWeatherIconHTML(match, size = "small") {
    // Render a layered sun and cloud icon for partly cloudy conditions.
    if (match.iconClass === "fa-cloud-sun") {
        return `
            <span class="weather-icon-combo ${size}">
                <i class="fa-solid fa-sun"></i>
                <i class="fa-solid fa-cloud"></i>
            </span>
        `;
    }

    // Render a layered cloud, lightning bolt, and rain drops for thunderstorms.
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

    // Render a regular single weather icon for all other conditions.
    return `
        <i class="fa-solid ${match.iconClass} weather-icon-single ${size}"
           style="color: ${match.iconColor}">
        </i>
    `;
}

// ==========================================================================
// WEATHER ALERTS
// ==========================================================================

/**
 * Creates a warning message for severe weather, dangerous UV, or poor air quality.
 *
 * @param {object} current - Current weather data returned by the forecast API.
 * @param {object|null} airQualityData - Air quality data returned by the air quality API.
 * @returns {string|null} Alert message or null when no alert is needed.
 */
function getWeatherAlert(current, airQualityData) {
    const code = current.weather_code;

    if (code === 95 || code === 96 || code === 99) {
        return "⚠ Thunderstorm expected. Be careful outdoors.";
    }

    if (code === 65 || code === 82) {
        return "⚠ Heavy rain expected. Avoid unnecessary travel.";
    }

    if (code === 75 || code === 86) {
        return "⚠ Heavy snow expected. Roads may be slippery.";
    }

    if (airQualityData && airQualityData.current) {
        const aqi = airQualityData.current.european_aqi;
        const uv = airQualityData.current.uv_index;

        if (aqi > 100) {
            return "⚠ Air quality is extremely poor. Avoid outdoor activity.";
        }

        if (uv >= 8) {
            return "⚠ UV index is high. Use sunscreen and avoid direct sun.";
        }
    }

    return null;
}

// ==========================================================================
// MAIN UI RENDERING
// ==========================================================================

/**
 * Updates all weather interface elements with the latest API data.
 *
 * @param {object} data - Weather data returned by the forecast API.
 * @param {string} cityName - Display name of the selected city.
 * @param {boolean} isCelsius - Current temperature unit state.
 * @param {object|null} airQualityData - Air quality data for UV and AQI values.
 */
export function updateUI(data, cityName, isCelsius, airQualityData = null) {
    const current = data.current;

    // Set the selected city name.
    ui.location.textContent = cityName;

    // Prepare values for Celsius by default.
    let displayTemp = current.temperature_2m;
    let displayWind = current.wind_speed_10m;
    let feelsLikeTemp = current.apparent_temperature;
    let tempUnit = "°C";
    let windUnit = "km/h";

    // Convert temperature and wind values when Fahrenheit is selected.
    if (!isCelsius) {
        displayTemp = (displayTemp * 9 / 5) + 32;
        feelsLikeTemp = (feelsLikeTemp * 9 / 5) + 32;
        displayWind = displayWind * 0.621371;
        tempUnit = "°F";
        windUnit = "mph";
    }

    // Render the main current weather values.
    ui.temperature.textContent = Math.round(displayTemp);
    ui.unitDisplay.textContent = tempUnit;
    ui.humidity.textContent = `${current.relative_humidity_2m}%`;
    ui.windSpeed.textContent = `${Math.round(displayWind)} ${windUnit}`;
    ui.sunrise.textContent = formatTime(data.daily.sunrise[0]);
    ui.sunset.textContent = formatTime(data.daily.sunset[0]);

    // Render the feels-like temperature with a bold numeric value.
    ui.feelsLike.innerHTML =
        `Feels like <strong>${Math.round(feelsLikeTemp)}${tempUnit}</strong>`;

    // Render UV and AQI values when air quality data is available.
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
        // Reset air quality fields if the request fails or returns no data.
        ui.uvIndex.textContent = "--";
        ui.airQuality.textContent = "--";
        ui.uvIndex.style.color = "";
        ui.airQuality.style.color = "";
        ui.airQualityTooltip.textContent =
            "Air quality shows how polluted the air is. Lower values mean cleaner air.";
    }

    // Find the visual mapping for the current weather code.
    const match = WEATHER_MAPPING[current.weather_code] || {
        text: "Unknown",
        iconClass: "fa-question",
        iconColor: "#ffffff"
    };

    // Render the weather description and main icon.
    ui.description.textContent = match.text;
    ui.icon.innerHTML = getWeatherIconHTML(match, "main");

    // Show or hide the severe weather and health alert message.
    const alertMessage = getWeatherAlert(current, airQualityData);

    if (alertMessage) {
        ui.weatherAlert.textContent = alertMessage;
        ui.weatherAlert.classList.remove("hidden");
    } else {
        ui.weatherAlert.textContent = "";
        ui.weatherAlert.classList.add("hidden");
    }

    // Render both forecast sections.
    renderForecast(data.daily, isCelsius);
    renderHourlyForecast(data.hourly, isCelsius);
}

// ==========================================================================
// DAILY FORECAST RENDERING
// ==========================================================================

/**
 * Renders the next five days of forecast data.
 *
 * Index 0 represents today, so the loop starts from index 1.
 *
 * @param {object} dailyData - Daily forecast data returned by the weather API.
 * @param {boolean} isCelsius - Current temperature unit state.
 */
function renderForecast(dailyData, isCelsius) {
    ui.forecastContainer.innerHTML = "";

    for (let index = 1; index <= 5; index++) {
        const dayName = formatDayName(dailyData.time[index]);

        let maxTemp = dailyData.temperature_2m_max[index];
        let minTemp = dailyData.temperature_2m_min[index];

        // Convert daily temperatures when Fahrenheit is selected.
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

// ==========================================================================
// HOURLY FORECAST RENDERING
// ==========================================================================

/**
 * Renders the next eight future hourly forecast entries.
 *
 * @param {object} hourlyData - Hourly forecast data returned by the weather API.
 * @param {boolean} isCelsius - Current temperature unit state.
 */
function renderHourlyForecast(hourlyData, isCelsius) {
    ui.hourlyContainer.innerHTML = "";

    const now = new Date();

    // Create a smaller array containing only future hours.
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

        // Convert hourly temperatures when Fahrenheit is selected.
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