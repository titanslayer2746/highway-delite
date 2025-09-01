const express = require("express");
const connectDB = require("./config/db");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();
// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json()); // Middleware to parse JSON

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitilized: true,
    cookie: { secure: false },
  })
);

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
