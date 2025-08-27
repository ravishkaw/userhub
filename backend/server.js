const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const { poolPromise } = require("./config/db");
const protect = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", protect, userRoutes);

const startServer = async () => {
  try {
    await poolPromise;
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error(
      "Failed to start server due to database connection error:",
      err
    );
    process.exit(1);
  }
};

startServer();
