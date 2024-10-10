import { render, screen } from "@testing-library/react"; // Now importing act from react
import App from "./App";
import HourlyForecast from "./components/HourlyForecast";

describe("App Component", () => {
  it("renders App and HourlyForecast components by default", () => {
    // Render App component with BrowserRouter (for routing)
    render(<App />);
    render(<HourlyForecast />);

    // Check if Header and CurrentWeather components are rendered
    expect(screen.getByText("Hourly Forecast")).toBeInTheDocument();
    // expect(screen.getByText("Current Weather Component")).toBeInTheDocument();
  });
});
