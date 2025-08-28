const userModel = require("../models/userModel");

const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this resource" });
    }
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    if (req.user.role !== "Admin" && req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this resource" });
    }
    const { id } = req.params;
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user.Id,
      email: user.Email,
      fullName: user.FullName,
      role: user.Role,
      phoneNumber: user.PhoneNumber,
      dateOfBirth: user.DateOfBirth,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userModel.createUser(req.body);
    res.status(201).json({ message: "User created successfully", user });
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

const updateUser = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to update users" });
    }

    const { id } = req.params;
    const updatedUser = await userModel.updateUser(id, req.body);
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error.originalError && error.originalError.message) {
      const errorMessage = error.originalError.message;

      if (errorMessage.includes("User not found")) {
        return res.status(404).json({ message: errorMessage });
      }
      if (
        errorMessage.includes("Date of Birth") ||
        errorMessage.includes("Invalid Role")
      ) {
        return res.status(400).json({ message: errorMessage });
      }
    }

    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete users" });
    }

    const { id } = req.params;
    const deletedUser = await userModel.deleteUser(id);
    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    if (error.originalError && error.originalError.message) {
      const errorMessage = error.originalError.message;

      if (errorMessage.includes("User not found")) {
        return res.status(404).json({ message: errorMessage });
      }
    }

    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
