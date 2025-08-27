const bcrypt = require("bcryptjs");
const { sql, poolPromise } = require("../config/db");

const getAllUsers = async () => {
  const pool = await poolPromise;
  const result = await pool.request().execute("sp_GetAllUsers");

  return result.recordset;
};

const getUserById = async (id) => {
  const pool = await poolPromise;
  const user = await pool
    .request()
    .input("UserId", sql.Int, id)
    .execute("sp_GetUserById");

  return user.recordset[0];
};

const createUser = async (userData) => {
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
};

const updateUser = async (id, userData) => {
  const { PhoneNumber, DateOfBirth, RoleId } = userData;

  const pool = await poolPromise;

  const result = await pool
    .request()
    .input("UserId", sql.Int, id)
    .input("PhoneNumber", sql.NVarChar, PhoneNumber || null)
    .input("DateOfBirth", sql.Date, DateOfBirth || null)
    .input("RoleId", sql.Int, RoleId || null)
    .execute("sp_UpdateUser");

  return result.recordset[0];
};

const deleteUser = async (id) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input("UserId", sql.Int, id)
    .execute("sp_DeleteUser");

  return result.recordset[0];
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
