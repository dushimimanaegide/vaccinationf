import { Request, Response } from "express";
import TodoTask from "../models/taskmodel";

export const deleteById = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.deleteId;

    // Check if the task with the specified ID exists
    const todo = await TodoTask.findById(id);

    if (!todo) {
      return res.status(404).json({
        message: "Task not found",
        data: null,
      });
    }

    // Delete the task with the specified ID
    const deletedTodo = await TodoTask.findByIdAndDelete(id);

    // Check if the deletion was successful
    if (deletedTodo) {
      return res.status(200).json({
        message: "Task deleted successfully",
        data: deletedTodo,
      });
    } else {
      return res.status(500).json({
        message: "Failed to delete task",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      data: null,
    });
  }
};
