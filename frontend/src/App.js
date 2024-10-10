import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Details from "./components/Details";
import CurrentWeather from "./components/CurrentWeather";
import WeatherWrapper from "./components/WeatherWrapper";
import LoginPage from "./components/LoginPage";
import PrivateRoute from "./PrivateRoute";
import MainLayout from "./components/MainLayout";

function App() {
  const [weather, setWeather] = useState(null); // Holds current weather data for background
  const [unit, setUnit] = useState("C");

  return (
    <Router>
      <WeatherWrapper weather={weather}>
        <Routes>
          {/* Public route for Login */}
          <Route exact path="/login" element={<LoginPage />} />

          {/* Private routes that require authentication */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/"
              element={
                <MainLayout unit={unit} setUnit={setUnit}>
                  <CurrentWeather unit={unit} setWeatherBG={setWeather} />
                </MainLayout>
              }
            />
            <Route
              path="/details/:city"
              element={
                <MainLayout unit={unit} setUnit={setUnit}>
                  <Details unit={unit} setWeatherBG={setWeather} />
                </MainLayout>
              }
            />
          </Route>
        </Routes>
      </WeatherWrapper>
    </Router>
  );
}

export default App;
