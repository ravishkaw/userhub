const bcrypt = require("bcryptjs");

const userModel = require("../models/userModel");
const generateToken = require("../utils/generateToken");

const { sql, poolPromise } = require("../config/db");

const register = async (req, res) => {
  try {
    const user = await userModel.createUser(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const pool = await poolPromise;
    const user = await pool
      .request()
      .input("Email", sql.NVarChar, email)
      .input("PasswordHash", sql.NVarChar, hashedPassword)
      .execute("sp_LoginUser");

    console.log(user);

    if (!user.recordset.length) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.recordset[0]);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.recordset[0].id,
        email: user.recordset[0].email,
        role: user.recordset[0].role,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

module.exports = { register, login };
