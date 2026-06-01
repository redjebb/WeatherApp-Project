// URL за търсене на координати по име на град
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

// URL за взимане на метеорологични данни
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Взима координатите на град чрез Open-Meteo Geocoding API
 * @param {string} city
 * @returns {Promise<object>}
 */
export async function getCoordinates(city) {
    const url = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en`;
    const response = await fetch(url);
    const data = await response.json();

    // Ако градът не е намерен, хвърляме грешка, която ще бъде уловена в handleSearch
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
export async function getWeatherData(lat, lon) {
    const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const response = await fetch(url);
    return await response.json();
}