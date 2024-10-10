import React, { useEffect, useState } from "react";

import "./FiveDayForecast.css";
import {
  getForecast,
  daysOfWeek,
  getForecastByCity,
} from "../services/weatherService";
import { useParams } from "react-router-dom";

const FiveDayForecast = ({ unit }) => {
  const [forecast, setForecast] = useState(null);
  const { city } = useParams(); // Get the city name from the route parameter

  useEffect(() => {
    if (city) {
      getForecastByCity(city, 5).then((response) => {
        setForecast(response.data.forecast.forecastday);
      });
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        getForecast(latitude, longitude, 5).then((response) => {
          setForecast(response.data.forecast.forecastday);
        });
      });
    }
  }, [city]);

  if (!forecast) return <div className="loading-text">Loading...</div>;

  return (
    <div className="forecast-container">
      <h2 className="forecast-title">5-Day Forecast</h2>
      <ul className="forecast-list">
        {forecast.map((day, index) => (
          <li key={index}>
            <p>{daysOfWeek[new Date(day.date).getDay()]}</p>
            <img
              className="weather-icon"
              src={day.day.condition.icon}
              alt="Weather Icon"
            />

            <div className="temp-container">
              <span className="temp-high">
                {unit === "C"
                  ? Math.round(day.day.maxtemp_c)
                  : Math.round(day.day.maxtemp_f)}
                °{/* {unit} */}
              </span>
              <span className="temp-low">
                {unit === "C"
                  ? Math.round(day.day.mintemp_c)
                  : Math.round(day.day.mintemp_f)}
                °{/* {unit} */}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FiveDayForecast;
