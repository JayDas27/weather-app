import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { searchCityWeather } from "../services/weatherService";
import "../App.css";
import HourlyForecast from "./HourlyForecast";
import FiveDayForecast from "./FiveDayForecast";

const Details = ({ unit, setWeatherBG }) => {
  const { city } = useParams(); // Get the city name from the route parameter
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    searchCityWeather(city)
      .then((response) => {
        setError("");
        setWeather(response.data);
        setWeatherBG(response.data.current.condition.text);
      })
      .catch(() => {
        setError("City not found or API request failed.");
      });
  }, [city, setWeatherBG]); // Fetch weather data whenever the city changes

  if (error) return <p className="error-message details-error">{error}</p>;

  if (!weather) return <div className="loading-text">Loading...</div>;

  return (
    <div>
      <div className="inner-container">
        <div className="weather-display">
          <h1>
            {unit === "C"
              ? Math.round(weather.current.temp_c)
              : Math.round(weather.current.temp_f)}
            °{/* {unit} */}
          </h1>

          <div className="weather-info">
            <img src={weather.current.condition.icon} alt="Weather Icon" />
            <div></div>
            <p className="location-name">{weather.location.name}</p>
            <p className="weather-condition">
              {weather.current.condition.text}
            </p>
          </div>

          <HourlyForecast unit={unit} />
        </div>
        <div className="five-day-forecast">
          <FiveDayForecast unit={unit} />
        </div>
      </div>
    </div>
  );
};

export default Details;
