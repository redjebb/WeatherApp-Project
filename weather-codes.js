// Справочник за weather кодовете на Open-Meteo
export const WEATHER_MAPPING = {
    0: { text: "Clear Sky", iconClass: "fa-sun", iconColor: "#ffcb05" },
    1: { text: "Mainly Clear", iconClass: "fa-cloud-sun", iconColor: "#ffcb05" },
    2: { text: "Partly Cloudy", iconClass: "fa-cloud-sun", iconColor: "#ffcb05" },

    3: { text: "Overcast", iconClass: "fa-cloud", iconColor: "#e2e8f0" },
    45: { text: "Fog", iconClass: "fa-smog", iconColor: "#e2e8f0" },
    48: { text: "Depositing Rime Fog", iconClass: "fa-smog", iconColor: "#e2e8f0" },
    
    51: { text: "Light Drizzle", iconClass: "fa-cloud-rain", iconColor: "#00d2ff" },
    53: { text: "Moderate Drizzle", iconClass: "fa-cloud-rain", iconColor: "#00d2ff" },
    55: { text: "Dense Drizzle", iconClass: "fa-cloud-rain", iconColor: "#00d2ff" },
    61: { text: "Slight Rain", iconClass: "fa-cloud-showers-heavy", iconColor: "#00d2ff" },
    63: { text: "Moderate Rain", iconClass: "fa-cloud-showers-heavy", iconColor: "#00d2ff" },
    65: { text: "Heavy Rain", iconClass: "fa-cloud-showers-heavy", iconColor: "#00d2ff" },
    95: { text: "Thunderstorm", iconClass: "fa-bolt", iconColor: "#00d2ff" },
    
    71: { text: "Slight Snow", iconClass: "fa-snowflake", iconColor: "#ffffff" },
    73: { text: "Moderate Snow", iconClass: "fa-snowflake", iconColor: "#ffffff" },
    75: { text: "Heavy Snow", iconClass: "fa-snowflake", iconColor: "#ffffff" }
};