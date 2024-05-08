import { Request, Response } from "express";
import TodoTask from "../models/taskmodel";

export const findAll = async (req: Request, res: Response) => {
  try {
    const arrayOfTodo = await TodoTask.find();

    if (arrayOfTodo.length > 0) {
      // Tasks found
      return res.status(200).json({
        message: "Tasks found",
        data: arrayOfTodo,
      });
    } else {
      // No tasks found
      return res.status(404).json({
        message: "No tasks found",
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
