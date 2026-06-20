# Weather App

A modern, responsive weather application built with Vanilla JavaScript.

The application allows users to search for weather by city name, use their current location, view hourly and 5-day forecasts, check UV index and air quality, receive weather alerts, and manage their search history.

---

## Features

* Search weather by city name
* Supports city searches written in different alphabets, including Cyrillic
* Browser geolocation for local weather
* Current weather overview
* Celsius / Fahrenheit unit toggle
* Feels-like temperature
* Humidity and wind speed
* UV index with color-coded severity levels
* Air Quality Index with explanation tooltip
* Sunrise and sunset times
* Hourly forecast
* 5-day forecast
* Colored minimum and maximum temperatures
* Weather alerts for severe conditions
* Search suggestions while typing
* Search history saved in `localStorage`
* Clear history button
* In-memory weather cache for faster repeated searches
* Fully responsive layout for mobile, tablet, laptop, and desktop
* Custom layered weather icons

---

## Technologies Used

* HTML5
* CSS3
* Vanilla JavaScript
* ES Modules
* LocalStorage
* Browser Geolocation API
* Font Awesome
* Open-Meteo Forecast API
* Open-Meteo Air Quality API
* OpenStreetMap Nominatim API
* BigDataCloud Reverse Geocoding API

---

## Project Structure

```text
weather-app/
├── index.html
├── style.css
├── app.js
├── api.js
├── ui.js
├── weather-codes.js
└── README.md
```

---

## File Overview

### `index.html`

Contains the main application structure:

* Search form
* Temperature unit toggle button
* Search suggestions container
* Search history section
* Clear history button
* Loading and error messages
* Weather alert section
* Current weather section
* Weather details cards
* Hourly forecast section
* 5-day forecast section

### `style.css`

Contains all visual styling for the application:

* Responsive layout
* Glassmorphism card design
* Mobile, tablet, and desktop media queries
* Search input and button styling
* Weather detail cards
* Forecast cards
* Tooltip styling
* Custom weather icon styling
* Weather alert styling
* Temperature color styling

### `app.js`

Controls the main application logic:

* Handles search form submission
* Handles Celsius / Fahrenheit switching
* Requests browser geolocation
* Loads weather and air quality data
* Manages loading and error states
* Manages search history
* Saves search history to `localStorage`
* Clears search history
* Handles city search suggestions
* Controls in-memory application state

### `api.js`

Handles all API requests:

* City search and coordinates
* Current weather data
* Hourly forecast data
* Daily forecast data
* Sunrise and sunset data
* Air quality data
* UV index data
* Reverse geocoding
* City suggestions
* In-memory weather caching

### `ui.js`

Handles all weather interface rendering:

* Current weather values
* Temperature unit conversion
* Weather descriptions
* Weather icons
* Hourly forecast cards
* Daily forecast cards
* UV index labels and colors
* Air quality labels, colors, and tooltip text
* Weather alert messages

### `weather-codes.js`

Contains weather code mappings used by the application.

Each weather code is mapped to:

* Weather description
* Font Awesome icon class
* Icon color

---

## APIs Used

### Open-Meteo Forecast API

Used for:

* Current temperature
* Feels-like temperature
* Humidity
* Wind speed
* Weather conditions
* Hourly forecast
* Daily forecast
* Sunrise
* Sunset

### Open-Meteo Air Quality API

Used for:

* UV index
* European Air Quality Index

### OpenStreetMap Nominatim API

Used for city searching and converting city names into coordinates.

This API allows the application to support city searches written in different alphabets, including Cyrillic.

### BigDataCloud Reverse Geocoding API

Used when the user allows browser geolocation.

The browser provides latitude and longitude coordinates, and this API converts them into a readable city name.

---

## How to Run Locally

1. Download or clone the repository.

```bash
git clone YOUR_REPOSITORY_URL
```

2. Open the project folder in Visual Studio Code.

3. Install the **Live Server** extension.

4. Open `index.html` using Live Server.

```text
Right click index.html → Open with Live Server
```

Because the application uses JavaScript ES Modules, it is recommended to run the project with Live Server instead of opening `index.html` directly from the file system.

---

## How the Application Works

1. The user enters a city name or allows browser geolocation.
2. The application gets the coordinates of the selected location.
3. Weather data is requested from the Open-Meteo Forecast API.
4. Air quality data is requested from the Open-Meteo Air Quality API.
5. The UI module renders current weather, forecasts, UV index, AQI, and alerts.
6. The searched city is saved in `localStorage`.
7. If the same city is searched again within 10 minutes, cached weather data is used.

---

## Search History

The application stores the latest searched cities in `localStorage`.

* The newest search appears first.
* Duplicate cities are removed.
* Only the latest five cities are saved.
* The user can remove all saved cities using the **Clear History** button.

---

## In-Memory Cache

The application uses an in-memory cache inside `api.js`.

When a city is searched again within 10 minutes, the application returns cached weather data instead of sending a new weather request.

Benefits:

* Faster repeated searches
* Fewer API requests
* Reduced network usage
* Better user experience

The cache is automatically cleared when the page is refreshed or closed.

---

## Weather Alerts

The application displays alerts for selected weather and health conditions.

Examples include:

* Thunderstorms
* Heavy rain
* Heavy snow
* Very poor air quality
* High UV index

---

## Responsive Design

The interface is optimized for:

* Mobile phones
* Tablets
* Laptops
* Desktop screens

The project uses:

* Flexible widths
* CSS Grid
* Flexbox
* Media queries
* Responsive typography
* Compact forecast cards

---

## Example Searches

Try searching for the following cities:

```text
Sofia
София
London
Paris
Tokyo
New York
Berlin
```

---

## Future Improvements

Possible future features:

* Favorite cities
* Light and dark theme toggle
* Weather charts
* Temperature trend chart
* Air quality chart
* Dynamic background based on weather conditions
* Offline mode
* Progressive Web App support
* Multi-language interface
* Weather notifications

---

## Author
Created by Redjeb T. as a JavaScript weather application project.
