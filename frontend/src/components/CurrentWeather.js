import React, { useEffect, useState } from "react";

import { getCurrentWeather } from "../services/weatherService";
import FiveDayForecast from "./FiveDayForecast";
import HourlyForecast from "./HourlyForecast";

import "./CurrentWeather.css";

const CurrentWeather = ({ unit, setWeatherBG }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      getCurrentWeather(latitude, longitude).then((response) => {
        setWeather(response.data);
        setWeatherBG(response.data.current.condition.text);
      });
    });
  }, [setWeatherBG]);

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

export default CurrentWeather;
