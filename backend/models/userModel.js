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
  const { fullName, email, password, phoneNumber, dateOfBirth, roleId } =
    userData;

  const hashedPassword = await bcrypt.hash(password, 12);

  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("FullName", sql.NVarChar, fullName)
    .input("Email", sql.NVarChar, email)
    .input("PasswordHash", sql.NVarChar, hashedPassword)
    .input("PhoneNumber", sql.NVarChar, phoneNumber)
    .input("DateOfBirth", sql.Date, dateOfBirth)
    .input("RoleId", sql.Int, roleId)
    .execute("sp_RegisterUser");

  return result.recordset[0];
};

const updateUser = async (id, userData) => {
  const { phoneNumber, dateOfBirth, roleId } = userData;

  const pool = await poolPromise;

  const result = await pool
    .request()
    .input("UserId", sql.Int, id)
    .input("PhoneNumber", sql.NVarChar, phoneNumber || null)
    .input("DateOfBirth", sql.Date, dateOfBirth || null)
    .input("RoleId", sql.Int, roleId || null)
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
