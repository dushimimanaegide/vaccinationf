import { Request, Response } from "express";
import TodoTask from "../models/taskmodel";

export const creatingtodo = async (req: Request, res: Response) => {
  try {
    const created = await TodoTask.create(req.body);

    if (created) {
      return res.status(200).json({
        message: "Task added correctly",
        data: created,
      });
    } else {
      return res.status(500).json({
        message: "Failed to add task",
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
