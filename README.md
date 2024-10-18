# Weather Forecasting Application

## Description

This is a weather forecasting application that provides users with real-time weather updates based on their location. The application features a user-friendly interface powered by React.js, a robust backend developed with Node.js, and utilizes MongoDB to manage data efficiently.

## Features

- Real-time weather data fetching
- Search by location
- User-friendly interface
- Historical weather data storage
- Responsive design for mobile and desktop

## Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js
- **Database:** MongoDB
- **APIs:** [weatherapi](https://www.weatherapi.com/my/)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- npm

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/JayDas27/weather-app.git
   ```

2. Navigate into the project directory:

   ```bash
   cd weather-app
   ```

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

5. Set up your MongoDB database. Update the connection string "DATABASE_URL" [backend/.env](backend/.env)
6. Start the backend server:

   ```bash
   npm run devStart
   ```

7. Start the frontend application:

   ```bash
   npm start
   ```

8. Run test case for backend application:

   ```bash
   cd backend
   npx jest
   ```

9. Usage

- Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access the application.
- Enter a location in the search bar to get the current weather forecast.
