const bcrypt = require("bcryptjs");
const { sql, poolPromise } = require("../config/db");

const getAllUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query("SELECT * FROM vw_UsersWithRoles");
    console.log(result);

    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = (await poolPromise)
      .request()
      .input("UserId", sql.Int, id)
      .execute("sp_GetUserById");

    if (!user.recordset.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.recordset);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

const createUser = async (userData) => {
  try {
    const { FullName, Email, Password, PhoneNumber, DateOfBirth, RoleId } =
      userData;

    const hashedPassword = await bcrypt.hash(Password, 12);

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("FullName", sql.NVarChar, FullName)
      .input("Email", sql.NVarChar, Email)
      .input("PasswordHash", sql.NVarChar, hashedPassword)
      .input("PhoneNumber", sql.NVarChar, PhoneNumber)
      .input("DateOfBirth", sql.Date, DateOfBirth)
      .input("RoleId", sql.Int, RoleId)
      .execute("sp_RegisterUser");

    return result.recordset[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
