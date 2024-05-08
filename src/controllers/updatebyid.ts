import { Request, Response } from "express";
import TodoTask from "../models/taskmodel";

export const updatethetask = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.updateId;

    // Check if the task with the specified ID exists
    const todo = await TodoTask.findById(id);
    if (!todo) {
      return res.status(404).json({
        message: "Task not found",
        data: null,
      });
    }

    // Attempt to update the task with the specified ID
    const updated = await TodoTask.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // Check if the update was successful
    if (updated) {
      return res.status(200).json({
        message: "Task updated successfully",
        data: updated,
      });
    } else {
      return res.status(500).json({
        message: "Failed to update task",
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
