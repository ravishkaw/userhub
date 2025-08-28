const bcrypt = require("bcryptjs");

const userModel = require("../models/userModel");
const generateToken = require("../utils/generateToken");

const { sql, poolPromise } = require("../config/db");

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

    const { Id, Email, Role, PasswordHash, FullName } = user.recordset[0];

    const isPasswordValid = await bcrypt.compare(password, PasswordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: Id,
      email: Email,
      role: Role,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: Id,
        email: Email,
        role: Role,
        fullName: FullName,
      },
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
      .input("Id", sql.Int, userId)
      .execute("sp_GetUserById");

    if (!result.recordset.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.recordset[0];
    res.status(200).json({
      user: {
        id: user.Id,
        email: user.Email,
        fullName: user.FullName,
        role: user.Role,
        phoneNumber: user.PhoneNumber,
        dateOfBirth: user.DateOfBirth,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

module.exports = { register, login, getMe };
