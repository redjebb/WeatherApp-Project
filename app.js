// 1. Импортираме нужните функции от мрежовия слой (api.js)
import {
  getWeatherData,
  getCityNameFromCoords,
  getWeatherByCity,
} from "./api.js";

// 2. Импортираме UI обекта и рендериращата функция от визуалния слой (ui.js)
import { ui, updateUI } from "./ui.js";

// ==========================================================================
// ГЛОБАЛНО СЪСТОЯНИЕ НА ПРИЛОЖЕНИЕТО (STATE)
// ==========================================================================
let currentTempCelsius = null;
let currentWindKmH = null;
let lastWeatherData = null;
let lastCityName = null;
let isCelsius = true;
let searchHistory = [];

// ==========================================================================
// СЛУШАТЕЛИ НА СЪБИТИЯ (EVENT LISTENERS)
// ==========================================================================

// Слушател за изпращане на формата
ui.form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSearch();
});

// Слушател за превключване между °C и °F
ui.unitToggle.addEventListener("click", () => {
  isCelsius = !isCelsius;
  ui.unitToggle.textContent = isCelsius ? "°F" : "°C";

  if (lastWeatherData && lastCityName) {
    updateUI(lastWeatherData, lastCityName, isCelsius);
  }
});

// ==========================================================================
// ОСНОВНА УПРАВЛЯВАЩА ЛОГИКА
// ==========================================================================

/**
 * Основен контролер, който координира търсенето на град
 * @param {string|null} forcedCityName
 */
async function handleSearch(forcedCityName = null) {
  const cityName = forcedCityName
    ? forcedCityName.trim()
    : ui.input.value.trim();

  if (!cityName) return;

  if (!forcedCityName) {
    ui.input.value = "";
  }

  try {
    ui.error.classList.add("hidden");
    ui.weatherCard.classList.add("hidden");
    ui.forecastContainer.classList.add("hidden");
    ui.loading.classList.remove("hidden");

    const result = await getWeatherByCity(cityName);

    const coords = result.coords;
    const weatherData = result.weatherData;

    lastWeatherData = weatherData;
    lastCityName = coords.name;

    currentTempCelsius = weatherData.current.temperature_2m;
    currentWindKmH = weatherData.current.wind_speed_10m;

    updateUI(weatherData, coords.name, isCelsius);
    saveCityToHistory(coords.name);

    ui.loading.classList.add("hidden");
    ui.weatherCard.classList.remove("hidden");
    ui.forecastContainer.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    ui.loading.classList.add("hidden");
    ui.error.classList.remove("hidden");
    ui.weatherCard.classList.add("hidden");
    ui.forecastContainer.classList.add("hidden");
  }
}

// ==========================================================================
// ЛОКАЛНА ИСТОРИЯ (LOCALSTORAGE)
// ==========================================================================

function initHistory() {
  const storedHistory = localStorage.getItem("weatherSearchHistory");
  searchHistory = storedHistory ? JSON.parse(storedHistory) : [];
  renderHistoryUI();
}

function renderHistoryUI() {
  ui.historyContainer.innerHTML = "";

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

/**
 * Опитва да вземе текущата локация на потребителя чрез браузъра
 */
function requestUserLocation() {
  // Проверяваме дали браузърът изобщо поддържа геолокация
  if (!navigator.geolocation) {
    // Ако не поддържа, зареждаме Париж като резервен вариант (fallback)
    handleSearch("Paris");
    return;
  }

  // Сменяме текста при зареждане, за да знае потребителят какво се случва
  ui.loading.textContent = "Requesting your location access...";
  ui.loading.classList.remove("hidden");

  navigator.geolocation.getCurrentPosition(
    // АКО ПОТРЕБИТЕЛЯТ ПОЗВОЛИ
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        ui.loading.textContent = "Fetching local conditions...";

        const [fetchedCityName, weatherData] = await Promise.all([
          getCityNameFromCoords(lat, lon),
          getWeatherData(lat, lon),
        ]);

        // 3. Записваме в глобалното състояние
        lastWeatherData = weatherData;
        lastCityName = fetchedCityName;
        currentTempCelsius = weatherData.current.temperature_2m;
        currentWindKmH = weatherData.current.wind_speed_10m;

        updateUI(weatherData, fetchedCityName, isCelsius);
        saveCityToHistory(fetchedCityName);

        ui.loading.classList.add("hidden");
        ui.weatherCard.classList.remove("hidden");
        ui.forecastContainer.classList.remove("hidden");
      } catch (error) {
        console.error("Error loading weather for coordinates:", error);
        handleSearch("Paris");
      }
    },
    // АКО ПОТРЕБИТЕЛЯТ ОТКАЖЕ
    (error) => {
      console.warn(
        "Location access denied by user. Falling back to default city.",
      );
      // Понеже е отказал, просто зареждаме града по подразбиране
      handleSearch("Paris");
    },
  );
}

// Стартиране на първоначалното зареждане
initHistory();

// Задействаме геолокацията веднага след като историята се зареди в паметта
requestUserLocation();
