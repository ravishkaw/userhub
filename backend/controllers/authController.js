const bcrypt = require("bcryptjs");

const { sql, poolPromise } = require("../config/db");

const userModel = require("../models/userModel");

const generateToken = require("../utils/generateToken");
const { mapDbRowToCamelCase } = require("../utils/caseMapper");

const register = async (req, res) => {
  try {
    const user = await userModel.createUser(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    if (error.originalError) {
      return res.status(400).json({
        message:
          error?.originalError?.message || "An unexpected error occurred",
      });
    }
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const pool = await poolPromise;
    const user = await pool
      .request()
      .input("Email", sql.NVarChar, email)
      .execute("sp_LoginUser");

    if (!user.recordset.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userData = mapDbRowToCamelCase(user.recordset[0]);
    const { id, email: userEmail, role, passwordHash, fullName } = userData;

    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id, email: userEmail, role });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id, email: userEmail, role, fullName },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .execute("sp_GetUserById");

    if (!result.recordset.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = mapDbRowToCamelCase(result.recordset[0]);
    res.status(200).json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

module.exports = { register, login, getMe };
