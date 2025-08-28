const roleModel = require("../models/roleModel");

const getAllRoles = async (req, res) => {
  try {
    const roles = await roleModel.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllRoles };
