import { Request, Response } from "express";
import TodoTask from "../models/taskmodel";

export const findtaskById = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.findId;
    const todo = await TodoTask.findById(id);

    if (todo) {
      return res.status(200).json({
        message: "Task found",
        data: todo,
      });
    } else {
      return res.status(404).json({
        message: "Task not found",
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
