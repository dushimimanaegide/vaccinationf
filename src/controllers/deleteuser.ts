import { Request, Response } from "express";
import UserModel from "../models/modelsiginup";

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.userId;

    // Check if the user with the specified ID exists
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    // Delete the user with the specified ID
    const deletedUser = await UserModel.findByIdAndDelete(id);

    // Check if the deletion was successful
    if (deletedUser) {
      return res.status(200).json({
        message: "User deleted successfully",
        data: deletedUser,
      });
    } else {
      return res.status(500).json({
        message: "Failed to delete user",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      data: null,
      theErrorIs: error,
    });
  }
};
