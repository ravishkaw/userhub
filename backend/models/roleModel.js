const { poolPromise } = require("../config/db");

const getAllRoles = async () => {
  const pool = await poolPromise;
  const roles = await pool.request().execute("sp_GetAllRoles");
  return roles.recordset;
};

module.exports = { getAllRoles };
