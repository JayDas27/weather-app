const request = require("supertest");
const app = require("../server"); // Ensure this exports your Express app
const { connectDB, disconnectDB } = require("../utils/db"); // Import your DB connection functions
const jwt = require("jsonwebtoken");

// Mocking a user token
const token = jwt.sign(
  {
    id: "6706c39b27d677a0bb0c762f",
    username: "jaydas@deloitte.com",
    role: "admin",
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

// Set up the database connection before all tests
beforeAll(async () => {
  await connectDB();
});

// Mocking the authenticateToken middleware function
jest.mock("../utils/authenticateToken", () => {
  const jwt = require("jsonwebtoken");

  return (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is passed in the header
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  };
});

describe("POST /member/login", () => {
  it("responds with a JWT token when valid credentials are provided", async () => {
    const response = await request(app)
      .post("/member/login")
      .send({ username: "jaydas@deloitte.com", password: "123456" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Authorized");
    expect(response.body.data).toHaveProperty("token");
  });

  it("responds with an error message when invalid credentials are provided", async () => {
    const response = await request(app)
      .post("/member/login")
      .send({ username: "invaliduser", password: "invalidpassword" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Access denied. Invalid username or password. Please check and try again."
    );
  });
});

describe("POST /member/register", () => {
  it("should return 400 if validation fails", async () => {
    const response = await request(app)
      .post("/member/register")
      .set("Authorization", `Bearer ${token}`)
      .send({}); // Sending empty payload to cause validation error

    expect(response.status).toBe(400);
  });

  it("should return 200 if username already exists", async () => {
    await connectDB();

    const response = await request(app)
      .post("/member/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "jaydas@deloitte.com",
        password: "newPwd",
        role: "user",
        createdBy: "6706c39b27d677a0bb0c762f",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Duplicate username");
  });

  it("should return 200 if user is created by admin", async () => {
    await connectDB();

    const creator = {
      id: "6706c39b27d677a0bb0c762f",
      username: "jaydas@deloitte.com",
      password: "newPwd",
      role: "admin",
    };

    const timestamp = Date.now(); // Get current timestamp
    const newUserName = `${timestamp}@deloitte.com`; // Construct email

    const response = await request(app)
      .post("/member/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: newUserName,
        password: "newPwd",
        role: "user",
        createdBy: creator.id,
      });

    expect(creator.role).toBe("admin");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("New user created successfully");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.username).toBe(newUserName);
    expect(response.body.data.role).toBe("user");
  });

  it("should return 400 if user is not created by admin", async () => {
    await connectDB();

    const creator = {
      id: "6706c8b88a85d0a0eb16f6d8",
      username: "jaydas@gmail.com",
      password: "newPwd",
      role: "user",
    };

    const response = await request(app)
      .post("/member/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "test@deloitte.com",
        password: "newPwd",
        role: "user",
        createdBy: creator.id,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "You don't have admin permission to create user."
    );
  });
});

describe("GET /city/getRecentSearchedCity", () => {
  it("should return a list of recently searched cities", async () => {
    const res = await request(app)
      .get("/city/getRecentSearchedCity")
      .set("Authorization", `Bearer ${token}`); // Sending the token in the header
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("POST /city/saveRecentSearchedCity", () => {
  it("should return search results for a city", async () => {
    const res = await request(app)
      .post("/city/saveRecentSearchedCity")
      .set("Authorization", `Bearer ${token}`)
      .send({ cityName: "New York", date: new Date() });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
  });
});

describe("Error Handling", () => {
  it("should return 404 for an unknown route", async () => {
    const res = await request(app).get("/unknown");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Can't find /unknown on the server!");
  });
});

afterAll(async () => {
  await disconnectDB();
});
