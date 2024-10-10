import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getForecast,
  formatTime,
  getForecastByCity,
} from "../services/weatherService";
import "./HourlyForecast.css";

const HourlyForecast = ({ unit }) => {
  const [forecast, setForecast] = useState(null);
  const { city } = useParams(); // Get the city name from the route parameter

  const formatData = (response) => {
    // Get current hour
    const currentHour = new Date().getHours() + 1;

    // Filter the next 8 hours forecast
    const next8HoursForecast = response.data.forecast.forecastday[0].hour.slice(
      currentHour,
      currentHour + 8
    );

    setForecast(next8HoursForecast);
  };

  useEffect(() => {
    if (city) {
      getForecastByCity(city, 1).then((response) => {
        formatData(response);
      });
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        getForecast(latitude, longitude, 1).then((response) => {
          formatData(response);
        });
      });
    }
  }, [city]);

  if (!forecast) return <div className="loading-text">Loading...</div>;

  return (
    <div className="hourly-forecast-container">
      <h2>Hourly Forecast</h2>
      <ul className="hourly-forecast-list">
        {forecast.map((hour, index) => (
          <li key={index} className={`${index}` === "0" ? "active" : ""}>
            <p>{formatTime(hour.time)}</p>
            <img
              src={hour.condition.icon}
              tooltip={hour.condition.text}
              alt="Weather Icon"
            />
            <p>
              {unit === "C" ? Math.round(hour.temp_c) : Math.round(hour.temp_f)}
              °{/* {unit} */}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HourlyForecast;
