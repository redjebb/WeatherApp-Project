// URL за търсене на координати по име на град
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

// URL за взимане на метеорологични данни
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const weatherCache = {};
const CACHE_TTL = 10 * 60 * 1000;

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
    const url =
        `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=6&timezone=auto`;

    const response = await fetch(url);

    return await response.json();
}

/**
 * Взима името на град по зададени географски координати (Reverse Geocoding)
 * @param {number} lat 
 * @param {number} lon 
 * @returns {Promise<string>} Име на града
 */
export async function getCityNameFromCoords(lat, lon) {
    // Използваме Open-Meteo Geocoding API, но този път търсим по координати
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`;
    
    const reverseUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    
    const response = await fetch(reverseUrl);
    const data = await response.json();
    
    // Връщаме името на града (напр. "Sofia") или квартала/региона като резервен вариант
    return data.city || data.locality || "Your Location";
}

export async function getWeatherByCity(city) {
    const cacheKey = city.toLowerCase().trim();
    const cachedEntry = weatherCache[cacheKey];
    const now = Date.now();

    if (cachedEntry) {
        const age = now - cachedEntry.timestamp;

        if (age < CACHE_TTL) {
            console.log(`[Cache Hit] ${city}`);
            return cachedEntry.data;
        }

        delete weatherCache[cacheKey];
    }

    const coords = await getCoordinates(city);
    const weatherData = await getWeatherData(coords.lat, coords.lon);

    const result = {
        coords,
        weatherData
    };

    weatherCache[cacheKey] = {
        data: result,
        timestamp: now
    };

    return result;
}