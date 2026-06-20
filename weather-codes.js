export const WEATHER_MAPPING = {
  // Clear / cloudy
  0: {
    text: "Clear Sky",
    iconClass: "fa-sun",
    iconColor: "#ffcb05",
  },
  1: {
    text: "Mainly Clear",
    iconClass: "fa-cloud-sun",
    iconColor: "#ffffff",
    sunColor: "#ffcb05",
  },
  2: {
    text: "Partly Cloudy",
    iconClass: "fa-cloud-sun",
    iconColor: "#ffffff",
    sunColor: "#ffcb05",
  },
  3: {
    text: "Overcast",
    iconClass: "fa-cloud",
    iconColor: "#ffffff",
  },

  // Fog
  45: {
    text: "Fog",
    iconClass: "fa-smog",
    iconColor: "#dbeafe",
  },
  48: {
    text: "Depositing Rime Fog",
    iconClass: "fa-smog",
    iconColor: "#dbeafe",
  },

  // Drizzle
  51: {
    text: "Light Drizzle",
    iconClass: "fa-cloud-rain",
    iconColor: "#38bdf8",
  },
  53: {
    text: "Moderate Drizzle",
    iconClass: "fa-cloud-rain",
    iconColor: "#38bdf8",
  },
  55: {
    text: "Dense Drizzle",
    iconClass: "fa-cloud-rain",
    iconColor: "#0ea5e9",
  },
  56: {
    text: "Light Freezing Drizzle",
    iconClass: "fa-cloud-rain",
    iconColor: "#7dd3fc",
  },
  57: {
    text: "Dense Freezing Drizzle",
    iconClass: "fa-cloud-rain",
    iconColor: "#38bdf8",
  },

  // Rain
  61: {
    text: "Slight Rain",
    iconClass: "fa-cloud-rain",
    iconColor: "#38bdf8",
  },
  63: {
    text: "Moderate Rain",
    iconClass: "fa-cloud-showers-heavy",
    iconColor: "#38bdf8",
  },
  65: {
    text: "Heavy Rain",
    iconClass: "fa-cloud-showers-heavy",
    iconColor: "#0ea5e9",
  },
  66: {
    text: "Light Freezing Rain",
    iconClass: "fa-cloud-rain",
    iconColor: "#7dd3fc",
  },
  67: {
    text: "Heavy Freezing Rain",
    iconClass: "fa-cloud-showers-heavy",
    iconColor: "#38bdf8",
  },

  // Snow
  71: {
    text: "Slight Snow",
    iconClass: "fa-snowflake",
    iconColor: "#ffffff",
  },
  73: {
    text: "Moderate Snow",
    iconClass: "fa-snowflake",
    iconColor: "#ffffff",
  },
  75: {
    text: "Heavy Snow",
    iconClass: "fa-snowflake",
    iconColor: "#dbeafe",
  },
  77: {
    text: "Snow Grains",
    iconClass: "fa-snowflake",
    iconColor: "#dbeafe",
  },

  // Rain showers
  80: {
    text: "Slight Rain Showers",
    iconClass: "fa-cloud-showers-heavy",
    iconColor: "#38bdf8",
  },
  81: {
    text: "Moderate Rain Showers",
    iconClass: "fa-cloud-showers-heavy",
    iconColor: "#38bdf8",
  },
  82: {
    text: "Violent Rain Showers",
    iconClass: "fa-cloud-showers-heavy",
    iconColor: "#0ea5e9",
  },

  // Snow showers
  85: {
    text: "Slight Snow Showers",
    iconClass: "fa-snowflake",
    iconColor: "#ffffff",
  },
  86: {
    text: "Heavy Snow Showers",
    iconClass: "fa-snowflake",
    iconColor: "#dbeafe",
  },

  // Thunderstorms
  95: {
    text: "Thunderstorm",
    iconClass: "fa-cloud-bolt",
    iconColor: "#ffffff",
    boltColor: "#ffcb05",
  },
  96: {
    text: "Thunderstorm With Hail",
    iconClass: "fa-cloud-bolt",
    iconColor: "#ffffff",
    boltColor: "#ffcb05",
  },
  99: {
    text: "Heavy Thunderstorm With Hail",
    iconClass: "fa-cloud-bolt",
    iconColor: "#ffffff",
    boltColor: "#ffcb05",
  },
};