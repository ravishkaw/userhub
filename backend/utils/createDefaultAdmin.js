const bcrypt = require("bcryptjs");
const { sql, poolPromise } = require("../config/db");

const createDefaultAdmin = async () => {
  try {
    const pool = await poolPromise;

    const existingAdmin = await pool
      .request()
      .input("Email", sql.NVarChar, "admin@userhub.com")
      .execute("sp_LoginUser");
      
    if (existingAdmin.recordset.length > 0) {
      console.log("Default admin user already exists");
      return;
    }

    const adminRole = await pool
      .request()
      .input("RoleName", sql.NVarChar, "Admin")
      .query("SELECT RoleId FROM Roles WHERE RoleName = @RoleName");

    if (adminRole.recordset.length === 0) {
      throw new Error("Admin role not found in database");
    }

    const adminRoleId = adminRole.recordset[0].RoleId;

    const hashedPassword = await bcrypt.hash("Admin123@", 12);

    const result = await pool
      .request()
      .input("FullName", sql.NVarChar, "System Administrator")
      .input("Email", sql.NVarChar, "admin@userhub.com")
      .input("PasswordHash", sql.NVarChar, hashedPassword)
      .input("PhoneNumber", sql.NVarChar, "+1234567890")
      .input("DateOfBirth", sql.Date, "1990-01-01")
      .input("RoleId", sql.Int, adminRoleId)
      .execute("sp_RegisterUser");

    console.log("✅ Default admin user created successfully");
    console.log("📧 Email: admin@userhub.com");
    console.log("🔑 Password: admin123");

    return result.recordset[0];
  } catch (error) {
    console.error("❌ Error creating default admin user:", error.message);
    throw error;
  }
};

module.exports = { createDefaultAdmin };
