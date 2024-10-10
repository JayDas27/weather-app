import axios from "axios";

import sunny from "../asset/sunny.jpg";
import cloudy from "../asset/cloudy.jpg";
import rainy from "../asset/rainy.jpg";
import winter from "../asset/winter.jpg";
import thunderstorm from "../asset/thunderstorm.jpg";

const API_KEY = "9a40df9b58e54be78ae64239240710";
const BASE_URL = "http://localhost:3200";
const WEATHER_DATA_BASE_URL = "http://api.weatherapi.com/v1";
const userInfo = JSON.parse(localStorage.getItem("userInfo"));

export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Include JWT token in API request headers
const config = {
  headers: {
    Authorization: `Bearer ${userInfo.token}`,
  },
};

export const userLogin = async (payload) => {
  return axios.post(`${BASE_URL}/member/login`, payload);
};

export const getCurrentWeather = async (lat, lon) => {
  return axios.get(
    `${WEATHER_DATA_BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}`,
    config
  );
};

export const getForecast = async (lat, lon, days) => {
  return axios.get(
    `${WEATHER_DATA_BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=${days}`
  );
};

export const getForecastByCity = async (city, days) => {
  return axios.get(
    `${WEATHER_DATA_BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${days}`
  );
};

export const searchCityWeather = async (city) => {
  return axios.get(
    `${WEATHER_DATA_BASE_URL}/current.json?key=${API_KEY}&q=${city}`
  );
};

// Function to search for city suggestions
export const searchCitySuggestions = async (query) => {
  return axios.get(
    `${WEATHER_DATA_BASE_URL}/search.json?key=${API_KEY}&q=${query}`
  );
};

export const fetchCities = async () => {
  return axios.get(`${BASE_URL}/city/getRecentSearchedCity`, config);
};

export const postRecentCities = async (payload) => {
  return axios.post(`${BASE_URL}/city/saveRecentSearchedCity`, payload, config);
};

export const formatTime = (timeString) => {
  const date = new Date(timeString);
  return date
    .toLocaleTimeString([], { hour: "numeric", hour12: true })
    .toLowerCase();
};

// Get the background image based on the current weather condition
export const getCurrentWeatherBgImage = (response) => {
  const value = response?.toLowerCase();

  if (value.includes("sunny")) {
    return sunny;
  } else if (value.includes("cloudy")) {
    return cloudy;
  } else if (
    value.includes("rain") ||
    value.includes("drizzle") ||
    value.includes("mist")
  ) {
    return rainy;
  } else if (value.includes("snow")) {
    return winter;
  } else if (value.includes("thunderstorm")) {
    return thunderstorm;
  } else {
    return cloudy;
  }
};
