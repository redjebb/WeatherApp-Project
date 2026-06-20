// ==========================================================================
// API ENDPOINTS
// ==========================================================================

// Open-Meteo Geocoding API endpoint.
// Currently used for city search suggestions.
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

// Open-Meteo Forecast API endpoint.
// Used for current weather, hourly forecast, daily forecast, sunrise, and sunset.
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Open-Meteo Air Quality API endpoint.
// Used for UV index and European AQI values.
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

// ==========================================================================
// IN-MEMORY CACHE
// ==========================================================================

// Stores weather results while the page is open.
// This cache is cleared automatically when the page is refreshed or closed.
const weatherCache = {};

// Cache lifetime: 10 minutes in milliseconds.
const CACHE_TTL = 10 * 60 * 1000;

// ==========================================================================
// LOCATION FETCHING
// ==========================================================================

/**
 * Fetches coordinates for a city name.
 *
 * This function uses OpenStreetMap Nominatim instead of Open-Meteo Geocoding
 * because Nominatim supports city names written in different alphabets,
 * including Cyrillic.
 *
 * @param {string} city - The city name entered by the user.
 * @returns {Promise<object>} Object containing latitude, longitude, and display name.
 * @throws {Error} If the city cannot be found.
 */
export async function getCoordinates(city) {
    const url =
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=jsonv2&limit=1`;

    const response = await fetch(url);
    const data = await response.json();

    // Nominatim returns an empty array when no matching city is found.
    if (!data.length) {
        throw new Error("City not found");
    }

    return {
        lat: Number(data[0].lat),
        lon: Number(data[0].lon),
        name: data[0].name || city
    };
}

/**
 * Fetches a city name from geographic coordinates.
 *
 * This is used when the app loads weather by browser geolocation.
 * The browser gives latitude and longitude, so this function converts
 * those coordinates into a readable city/locality name.
 *
 * @param {number} lat - Latitude from the browser geolocation API.
 * @param {number} lon - Longitude from the browser geolocation API.
 * @returns {Promise<string>} City name, locality name, or a fallback label.
 */
export async function getCityNameFromCoords(lat, lon) {
    const reverseUrl =
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

    const response = await fetch(reverseUrl);
    const data = await response.json();

    // Prefer city, then locality, and finally a generic fallback label.
    return data.city || data.locality || "Your Location";
}

// ==========================================================================
// WEATHER FETCHING
// ==========================================================================

/**
 * Fetches complete weather data for a pair of coordinates.
 *
 * The request includes:
 * - current weather data
 * - feels-like temperature
 * - hourly forecast
 * - 5-day forecast data
 * - sunrise and sunset times
 *
 * @param {number} lat - Latitude of the selected city/location.
 * @param {number} lon - Longitude of the selected city/location.
 * @returns {Promise<object>} Raw weather data returned by Open-Meteo.
 */
export async function getWeatherData(lat, lon) {
    const url =
        `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m,weather_code&forecast_days=6&timezone=auto`;

    const response = await fetch(url);

    return await response.json();
}

/**
 * Fetches weather by city name with in-memory caching.
 *
 * This function combines:
 * 1. city name -> coordinates
 * 2. coordinates -> weather data
 *
 * If the same city is requested again within 10 minutes,
 * the cached result is returned instead of making new API calls.
 *
 * @param {string} city - City name entered by the user.
 * @returns {Promise<object>} Object containing coordinates and weather data.
 */
export async function getWeatherByCity(city) {
    const cacheKey = city.toLowerCase().trim();
    const cachedEntry = weatherCache[cacheKey];
    const now = Date.now();

    // Return cached data if it exists and is still fresh.
    if (cachedEntry) {
        const age = now - cachedEntry.timestamp;

        if (age < CACHE_TTL) {
            console.log(`[Cache Hit] ${city}`);
            return cachedEntry.data;
        }

        // Remove expired cache entries before making a new request.
        delete weatherCache[cacheKey];
    }

    const coords = await getCoordinates(city);
    const weatherData = await getWeatherData(coords.lat, coords.lon);

    const result = {
        coords,
        weatherData
    };

    // Store the final combined result for future searches.
    weatherCache[cacheKey] = {
        data: result,
        timestamp: now
    };

    return result;
}

// ==========================================================================
// SEARCH SUGGESTIONS
// ==========================================================================

/**
 * Fetches city search suggestions.
 *
 * This function is used while the user types in the search field.
 * It returns a small list of possible cities that match the query.
 *
 * @param {string} query - Current text from the search input.
 * @returns {Promise<Array<object>>} List of suggested cities.
 */
export async function getCitySuggestions(query) {
    if (!query.trim()) {
        return [];
    }

    const url =
        `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results) {
        return [];
    }

    return data.results.map((city) => {
        return {
            name: city.name,
            country: city.country,
            lat: city.latitude,
            lon: city.longitude
        };
    });
}

// ==========================================================================
// AIR QUALITY FETCHING
// ==========================================================================

/**
 * Fetches air quality and UV data for a pair of coordinates.
 *
 * The returned data is used for:
 * - UV index display
 * - Air quality display
 * - health-related weather alerts
 *
 * @param {number} lat - Latitude of the selected city/location.
 * @param {number} lon - Longitude of the selected city/location.
 * @returns {Promise<object>} Raw air quality data returned by Open-Meteo.
 */
export async function getAirQualityData(lat, lon) {
    const url =
        `${AIR_QUALITY_URL}?latitude=${lat}&longitude=${lon}&current=european_aqi,uv_index&timezone=auto`;

    const response = await fetch(url);

    return await response.json();
}