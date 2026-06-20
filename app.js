// ==========================================================================
// MODULE IMPORTS
// ==========================================================================

// API functions used for weather, location, air quality, and city suggestions.
import {
  getWeatherData,
  getCityNameFromCoords,
  getWeatherByCity,
  getAirQualityData,
  getCitySuggestions,
} from "./api.js";

// UI references and rendering function.
import { ui, updateUI } from "./ui.js";

// ==========================================================================
// APPLICATION STATE
// ==========================================================================

// Stores the last loaded weather data so the UI can be re-rendered without refetching.
let lastWeatherData = null;

// Stores the last displayed city name.
let lastCityName = null;

// Stores the last loaded air quality data so unit toggling keeps UV/AQI visible.
let lastAirQualityData = null;

// Tracks the active temperature unit.
// true = Celsius, false = Fahrenheit.
let isCelsius = true;

// Stores the city search history loaded from localStorage.
let searchHistory = [];

// Stores the debounce timer used for city search suggestions.
let suggestionsTimeout = null;

// ==========================================================================
// EVENT LISTENERS
// ==========================================================================

// Handles form submission and prevents the browser from refreshing the page.
ui.form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSearch();
});

// Clears search history from memory, localStorage, and the UI.
ui.clearHistoryBtn.addEventListener("click", () => {
  searchHistory = [];
  localStorage.removeItem("weatherSearchHistory");
  renderHistoryUI();
});

// Toggles between Celsius and Fahrenheit without making a new API request.
ui.unitToggle.addEventListener("click", () => {
  isCelsius = !isCelsius;
  ui.unitToggle.textContent = isCelsius ? "°F" : "°C";

  if (lastWeatherData && lastCityName) {
    updateUI(lastWeatherData, lastCityName, isCelsius, lastAirQualityData);
  }
});

// Fetches city suggestions while the user types.
// A short debounce prevents sending a request on every single keystroke.
ui.input.addEventListener("input", () => {
  clearTimeout(suggestionsTimeout);

  const query = ui.input.value.trim();

  if (query.length < 2) {
    clearSuggestions();
    return;
  }

  suggestionsTimeout = setTimeout(async () => {
    const suggestions = await getCitySuggestions(query);
    renderSuggestions(suggestions);
  }, 300);
});

// ==========================================================================
// SEARCH SUGGESTIONS
// ==========================================================================

/**
 * Clears the suggestions list from the UI.
 */
function clearSuggestions() {
  ui.suggestionsContainer.classList.add("hidden");
  ui.suggestionsContainer.innerHTML = "";
}

/**
 * Renders clickable city suggestion buttons.
 *
 * @param {Array<object>} suggestions - Suggested city objects returned by the API.
 */
function renderSuggestions(suggestions) {
  ui.suggestionsContainer.innerHTML = "";

  if (suggestions.length === 0) {
    ui.suggestionsContainer.classList.add("hidden");
    return;
  }

  suggestions.forEach((city) => {
    const btn = document.createElement("button");

    btn.type = "button";
    btn.className = "suggestion-btn";
    btn.textContent = `${city.name}, ${city.country}`;

    btn.addEventListener("click", () => {
      ui.input.value = "";
      clearSuggestions();
      handleSearch(city.name);
    });

    ui.suggestionsContainer.appendChild(btn);
  });

  ui.suggestionsContainer.classList.remove("hidden");
}

// ==========================================================================
// MAIN SEARCH FLOW
// ==========================================================================

/**
 * Handles searching for a city and updating the whole weather dashboard.
 *
 * The function can be triggered by:
 * - the search form
 * - a history button
 * - a city suggestion
 * - fallback logic
 *
 * @param {string|null} forcedCityName - Optional city name passed programmatically.
 */
async function handleSearch(forcedCityName = null) {
  const cityName = forcedCityName
    ? forcedCityName.trim()
    : ui.input.value.trim();

  if (!cityName) {
    showInputError();
    return;
  }

  if (!forcedCityName) {
    ui.input.value = "";
  }

  try {
    showLoadingState();

    const result = await getWeatherByCity(cityName);

    const coords = result.coords;
    const weatherData = result.weatherData;
    const airQualityData = await getAirQualityData(coords.lat, coords.lon);

    lastWeatherData = weatherData;
    lastCityName = coords.name;
    lastAirQualityData = airQualityData;

    updateUI(weatherData, coords.name, isCelsius, airQualityData);
    saveCityToHistory(coords.name);

    showWeatherState();
  } catch (error) {
    console.error(error);
    showSearchError();
  }
}

// ==========================================================================
// UI STATE HELPERS
// ==========================================================================

/**
 * Shows an error when the user submits an empty search field.
 */
function showInputError() {
  ui.error.textContent = "Please enter a city name.";
  ui.error.classList.remove("hidden");

  ui.weatherCard.classList.add("hidden");
  ui.weatherAlert.classList.add("hidden");
  ui.forecastContainer.classList.add("hidden");
  ui.hourlyContainer.classList.add("hidden");
}

/**
 * Shows the loading spinner and hides old weather results.
 */
function showLoadingState() {
  ui.error.classList.add("hidden");
  ui.weatherCard.classList.add("hidden");
  ui.weatherAlert.classList.add("hidden");
  ui.forecastContainer.classList.add("hidden");
  ui.hourlyContainer.classList.add("hidden");

  clearSuggestions();

  ui.loading.textContent = "Fetching local conditions...";
  ui.loading.classList.remove("hidden");
}

/**
 * Shows the fully rendered weather dashboard after successful data loading.
 */
function showWeatherState() {
  ui.loading.classList.add("hidden");
  ui.weatherCard.classList.remove("hidden");
  ui.forecastContainer.classList.remove("hidden");
  ui.hourlyContainer.classList.remove("hidden");
}

/**
 * Shows a city search error and hides old results.
 */
function showSearchError() {
  ui.loading.classList.add("hidden");

  ui.error.textContent = "City not found. Please try again.";
  ui.error.classList.remove("hidden");

  ui.weatherCard.classList.add("hidden");
  ui.weatherAlert.classList.add("hidden");
  ui.forecastContainer.classList.add("hidden");
  ui.hourlyContainer.classList.add("hidden");
}

// ==========================================================================
// SEARCH HISTORY
// ==========================================================================

/**
 * Loads the saved search history from localStorage.
 */
function initHistory() {
  const storedHistory = localStorage.getItem("weatherSearchHistory");
  searchHistory = storedHistory ? JSON.parse(storedHistory) : [];
  renderHistoryUI();
}

/**
 * Renders the search history buttons and controls the clear-history button.
 */
function renderHistoryUI() {
  ui.historyContainer.innerHTML = "";

  if (searchHistory.length === 0) {
    ui.clearHistoryBtn.classList.add("hidden");
    return;
  }

  ui.clearHistoryBtn.classList.remove("hidden");

  searchHistory.forEach((city) => {
    const btn = document.createElement("button");

    btn.textContent = city;
    btn.className = "history-btn";
    btn.type = "button";

    btn.addEventListener("click", () => {
      handleSearch(city);
    });

    ui.historyContainer.appendChild(btn);
  });
}

/**
 * Saves a city to search history without duplicates.
 *
 * The newest city is moved to the front of the list.
 * Only the latest five cities are kept.
 *
 * @param {string} cityName - City name to save.
 */
function saveCityToHistory(cityName) {
  const existingIndex = searchHistory.findIndex(
    (city) => city.toLowerCase() === cityName.toLowerCase(),
  );

  if (existingIndex !== -1) {
    searchHistory.splice(existingIndex, 1);
  }

  searchHistory.unshift(cityName);

  if (searchHistory.length > 5) {
    searchHistory.pop();
  }

  localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
  renderHistoryUI();
}

// ==========================================================================
// GEOLOCATION
// ==========================================================================

/**
 * Requests the user's current browser location and loads local weather.
 *
 * If geolocation is unavailable or denied, the app falls back to Paris.
 */
function requestUserLocation() {
  if (!navigator.geolocation) {
    handleSearch("Paris");
    return;
  }

  ui.weatherCard.classList.add("hidden");
  ui.weatherAlert.classList.add("hidden");
  ui.forecastContainer.classList.add("hidden");
  ui.hourlyContainer.classList.add("hidden");

  ui.loading.textContent = "Requesting your location access...";
  ui.loading.classList.remove("hidden");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        ui.loading.textContent = "Fetching local conditions...";

        const [fetchedCityName, weatherData, airQualityData] =
          await Promise.all([
            getCityNameFromCoords(lat, lon),
            getWeatherData(lat, lon),
            getAirQualityData(lat, lon),
          ]);

        lastWeatherData = weatherData;
        lastCityName = fetchedCityName;
        lastAirQualityData = airQualityData;

        updateUI(weatherData, fetchedCityName, isCelsius, airQualityData);
        saveCityToHistory(fetchedCityName);

        showWeatherState();
      } catch (error) {
        console.error("Error loading weather for coordinates:", error);
        handleSearch("Paris");
      }
    },
    () => {
      console.warn("Location access denied by user. Falling back to default city.");
      handleSearch("Paris");
    },
  );
}

// ==========================================================================
// APPLICATION STARTUP
// ==========================================================================

// Load saved search history first.
initHistory();

// Then request the user's location and load local weather.
requestUserLocation();