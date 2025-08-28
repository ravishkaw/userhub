const { poolPromise } = require("../config/db");
const { mapArrayToCamelCase } = require("../utils/caseMapper");

const getAllRoles = async () => {
  const pool = await poolPromise;
  const roles = await pool.request().execute("sp_GetAllRoles");
  return mapArrayToCamelCase(roles.recordset);
};

module.exports = { getAllRoles };
