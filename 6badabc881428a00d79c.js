const searchBar = document.getElementById("searchBar");
const searchBtn = document.getElementById("searchBtn");
const locationTextDisplay = document.getElementById("location");
const temperatureTextDisplay = document.getElementById("temperature");
const temperatureContainer = document.getElementById("temperatureContainer");
const description = document.getElementById("description");
const forecast = document.getElementById("forecast");
const background = document.getElementById("background");
const resultsContainer = document.getElementById("resultsContainer");
const header = document.querySelector("header");
const mainContainer = document.getElementById("mainContainer");

let locationInput = "";
let temperatureUnit = 1; // 1 for Fahrenheit, 0 for Celsius
let unit = "Fahrenheit";
let lastFetchedTemperature = null; // Stores the last fetched temperature in Fahrenheit

import "./style.css";

import sunnyImage from "./assets/sunny.png";
import slightlyCloudyImage from "./assets/slightlycloudy.png";
import cloudyImage from "./assets/cloudy.png";
import rainyImage from "./assets/rainy.png";

async function getWeather(locationInput) {
  try {
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationInput}?key=XVAXY2LJBEMKGP79PD92B9B26`;
    let response = await fetch(url, { mode: "cors" });
    let weatherResults = await response.json();

    console.log(weatherResults); // Log result for debugging

    if (lastFetchedTemperature == null) {
      createButtons();
    }

    lastFetchedTemperature = weatherResults.currentConditions.temp;

    let temperature = getTemperature(lastFetchedTemperature);

    updateDisplay(weatherResults, temperature);
    changeBackground(weatherResults);
  } catch (err) {
    alert(`Please enter a valid location`);
  }
}

// Function to display the weather data
function updateDisplay(weatherResults, temperature) {
  locationTextDisplay.textContent = weatherResults.resolvedAddress;
  description.textContent = `It is ${weatherResults.currentConditions.conditions} with ${weatherResults.currentConditions.precipprob}% chance of rain.`;
  forecast.textContent = weatherResults.description;
  temperatureTextDisplay.textContent = `${temperature.toFixed(1)}° ${unit}`;
}

function createButtons() {
  const fahrenheitBtn = document.createElement("button");
  fahrenheitBtn.setAttribute("id", "fahrenheitBtn");
  temperatureContainer.appendChild(fahrenheitBtn);
  fahrenheitBtn.textContent = "F";
  fahrenheitBtn.onclick = () => updateTemperatureUnit(1);

  const celsiusBtn = document.createElement("button");
  celsiusBtn.setAttribute("id", "celsiusBtn");
  temperatureContainer.appendChild(celsiusBtn);
  celsiusBtn.textContent = "C";
  celsiusBtn.onclick = () => updateTemperatureUnit(0);

  fahrenheitBtn.style.backgroundColor = "#61a4bd";
  fahrenheitBtn.style.color = "white";
  celsiusBtn.style.backgroundColor = "transparent";
  celsiusBtn.style.color = "black";
}

// Event listener for the search button
searchBtn.addEventListener("click", () => {
  mainContainer.classList.add("bounce");

  locationInput = searchBar.value;
  getWeather(locationInput);

  setTimeout(() => {
    mainContainer.classList.remove("bounce");
  }, 500);
});

// Function to convert temperature based on the selected unit
function getTemperature(tempInFahrenheit) {
  return temperatureUnit === 1
    ? tempInFahrenheit
    : ((tempInFahrenheit - 32) * 5) / 9;
}

// Unified function to update temperature unit and display
function updateTemperatureUnit(unitType) {
  if (lastFetchedTemperature !== null) {
    temperatureUnit = unitType;
    unit = unitType === 1 ? "Fahrenheit" : "Celsius";

    // Get buttons by their IDs
    const fahrenheitBtn = document.getElementById("fahrenheitBtn");
    const celsiusBtn = document.getElementById("celsiusBtn");

    // Update button styles
    if (unitType === 1) {
      fahrenheitBtn.style.backgroundColor = "#61a4bd";
      fahrenheitBtn.style.color = "white";
      celsiusBtn.style.backgroundColor = "transparent";
      celsiusBtn.style.color = "black";
    } else {
      celsiusBtn.style.backgroundColor = "#61a4bd";
      celsiusBtn.style.color = "white";
      fahrenheitBtn.style.backgroundColor = "transparent";
      fahrenheitBtn.style.color = "black";
    }

    let temperature = getTemperature(lastFetchedTemperature);
    temperatureTextDisplay.textContent = `${temperature.toFixed(1)}° ${unit}`;
  }
}

// Change background based on weather
function changeBackground(weatherResults) {
  background.style.opacity = 0.5;
  setTimeout(() => {
    if (weatherResults.currentConditions.cloudcover < 25) {
      background.src = sunnyImage;
      header.style.backgroundColor = "#ffba00";
    } else if (weatherResults.currentConditions.cloudcover < 50) {
      background.src = slightlyCloudyImage;
      header.style.backgroundColor = "#b5d8e5";
    } else if (weatherResults.currentConditions.cloudcover < 75) {
      background.src = cloudyImage;
      header.style.backgroundColor = "#175268";
    } else {
      background.src = rainyImage;
      header.style.backgroundColor = "black";
    }
    background.style.opacity = 1;
  }, 500);
}

background.src = sunnyImage;
