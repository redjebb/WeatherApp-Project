// Справочник за weather кодовете на Open-Meteo
export const WEATHER_MAPPING = {
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