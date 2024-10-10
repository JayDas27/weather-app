import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchCities, searchCitySuggestions } from "../services/weatherService";
import "../App.css";
import "./Header.css";

const Header = ({ unit, setUnit }) => {
  const [city, setCity] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  // const [error, setError] = useState("");

  const navigate = useNavigate();
  // const location = useLocation();

  useEffect(() => {
    // Load recent searches from localStorage on component mount
    const storedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);

    // if (storedSearches.length) {
    //   setRecentSearches(storedSearches);
    // } else {
    //   fetchCities()
    //     .then((response) => {
    //       if (response.status === 200) {
    //         console.log(response.data);
    //         // localStorage.setItem("recentSearches", response.data);
    //         // setRecentSearches(response.data);
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err.message);
    //       handleLogout();
    //     });
    // }

    // if (!location.pathname.split("/details/")[1]) {
    //   setCity("");
    // }
  }, []);

  const handleInputClick = () => {
    setDropdownVisible(true);
  };

  const handleSearch = (selectedCity) => {
    setDropdownVisible(false);
    setCity("");

    // Store successful search to recent searches
    let updatedSearches = [selectedCity, ...recentSearches];
    updatedSearches = [...new Set(updatedSearches)]; // Remove duplicates
    if (updatedSearches.length > 10)
      updatedSearches = updatedSearches.slice(0, 10); // Keep only last 10

    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    setRecentSearches(updatedSearches);

    // Navigate to details page with the selected city
    navigate(`/details/${selectedCity}`);
  };

  // Debounce function to delay API call
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Handle city input change
  const handleCityChange = (e) => {
    const query = e.target.value;
    setCity(query);
    debouncedFetchSuggestions(query);
  };

  // Fetch city suggestions from API
  const fetchSuggestions = (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    searchCitySuggestions(query)
      .then((response) => {
        setSuggestions(response.data);
        setDropdownVisible(true);

        if (response.data.length > 0) {
          // Filter cities based on the input
          const filtered = response.data.filter((city) =>
            city.toLowerCase().includes(query.toLowerCase())
          );
          setSuggestions(filtered);
          setDropdownVisible(true);
          // setError("");
        } else {
          setSuggestions([]);
          setDropdownVisible(false);
          // setError("Failed to fetch city suggestions.");
        }
      })
      .catch(() => {
        // setError("Failed to fetch city suggestions.");
      });
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

  const handleUnitToggle = () => {
    setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(`/login`);
  };

  return (
    <header className="header">
      <div className="city-search-container">
        <input
          type="text"
          className="city-input"
          value={city}
          onChange={handleCityChange}
          onClick={() => handleInputClick()}
          placeholder="Type a city name..."
        />

        {/* {error && <p className="error-message">{error}</p>} */}

        {dropdownVisible && suggestions.length > 0 && (
          <>
            <ul className="city-dropdown">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="city-item"
                  onClick={() => handleSearch(suggestion.name)}
                >
                  {suggestion.name}, {suggestion.region}, {suggestion.country}
                </li>
              ))}

              <div className="recent-searches">
                <h3>Recent Searches</h3>
                <ul>
                  {recentSearches.map((search, index) => (
                    <li
                      className="city-item"
                      key={index}
                      onClick={() => handleSearch(search)}
                    >
                      {search}
                    </li>
                  ))}
                </ul>
              </div>
            </ul>
          </>
        )}
      </div>

      <div className="button-container">
        <div className="unit-toggle">
          <label className="toggle-label">°C</label>
          <div className="toggle-switch" onClick={handleUnitToggle}>
            <div
              className={`toggle-circle ${unit === "F" ? "right" : "left"}`}
            ></div>
          </div>
          <label className="toggle-label">°F</label>
        </div>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
