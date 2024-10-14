import React from "react";

import { getCurrentWeatherBgImage } from "../services/weatherService";

function WeatherWrapper({ weather, children }) {
  return (
    <div className="weather-app">
      <div
        className="background-image"
        style={{
          backgroundImage: `url(${getCurrentWeatherBgImage(weather)})`,
        }}
      ></div>
      {children}
    </div>
  );
}

export default WeatherWrapper;
