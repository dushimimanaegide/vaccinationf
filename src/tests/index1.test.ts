// import request from "supertest";
import  app from "../index"; 
import supertest from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import { MongoMemoryServer } from "mongodb-memory-server";


dotenv.config();
const request = supertest(app);

beforeAll(async () => {
  const testDbConnection: string = process.env.TESTDB as string;
  mongoose.connect(testDbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Todo API Testing", () => {
  let createdTodoId: string;

  it("should create a new todo and return success", async () => {
    const todoData = { title: "Test Todo", description: "Test Description" };

    const response = await request
      .post("/api/todos/createtodo")
      .send(todoData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Task added correctly");
    expect(response.body).toHaveProperty("data");
    createdTodoId = response.body.data._id;
  });

  it("should find the created todo by ID and return success", async () => {
  const response = await request.get(`/api/todos/findtodoid/${createdTodoId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Task found");
    expect(response.body).toHaveProperty("data");
  });

  it("should delete the created todo by ID and return success", async () => {
    const response = await request.delete(
      `/api/todos/deletetodoid/${createdTodoId}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Task deleted successfully"
    );
    expect(response.body).toHaveProperty("data");
  });

  it("should find all todos and return success", async () => {
    const response = await request.get("/api/todos/findalltodo");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Tasks found");
    expect(response.body).toHaveProperty("data");
  });

  it("should update the created todo and return success", async () => {
    const updatedTodoData = {
      title: "Updated Todo",
      description: "Updated Description",
    };

    const response = await request
      .put(`/api/todos/updatetodo/${createdTodoId}`)
      .send(updatedTodoData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Task updated successfully"
    );
    expect(response.body).toHaveProperty("data");
  });


});
