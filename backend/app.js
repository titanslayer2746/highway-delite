const express = require("express");
const connectDB = require("./config/db");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration to allow localhost:5173
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json()); // Middleware to parse JSON

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
