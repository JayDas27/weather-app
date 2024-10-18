import React, { useEffect, useState } from "react";
import "./FiveDayForecast.css";
import {
  getForecast,
  daysOfWeek,
  getForecastByCity,
} from "../services/weatherService";
import { useParams } from "react-router-dom";

const FiveDayForecast = ({ unit }) => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const { city } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response;

        if (city) {
          response = await getForecastByCity(city, 5);
        } else {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              response = await getForecast(latitude, longitude, 5);
              setForecast(response.data.forecast.forecastday);
            },
            () => {
              setLoading(false);
            }
          );
          return; // Exit early since we're handling the async call in the callback
        }

        const { forecastday } = response.data.forecast;
        setForecast(forecastday);
      } catch (error) {
        console.error("Failed to fetch forecast:", error);
        // Handle error state if required
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city]);

  if (loading) return <div className="loading-text">Loading...</div>;

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
