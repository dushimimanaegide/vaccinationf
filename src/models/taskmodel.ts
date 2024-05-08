import mongoose, { Document, Model, Schema } from "mongoose";

interface TodoTaskAttributes {
  title: string;
  description: string;
  dueDate: string;
}

interface TodoTaskDocument extends Document, TodoTaskAttributes {}

const todoSchema: Schema<TodoTaskDocument> = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
});

const TodoTask: Model<TodoTaskDocument> = mongoose.model<TodoTaskDocument>(
  "todo",
  todoSchema
);

export default TodoTask;
