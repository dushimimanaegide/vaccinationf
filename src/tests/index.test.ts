import supertest from "supertest";
import app from "../index";
import dotenv from "dotenv";
import mongoose from "mongoose";



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

describe("API Tests", () => {
  it("GET / should return a welcome message", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Welcome  I am testing again");
  });


  it("POST /todoapi/createtodo should create a new todo", async () => {
    const todoData = {
      title: "Test Todo",
      description: "Test Todo content",
      dueDate: "2024-12-31",
    };

    const response = await request.post("/todoapi/createtodo").send(todoData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("data");
  });

  it("POST /api/users/signup should create a new user", async () => {
    const userData = {
      email: "sbGmail.com.com",
      password: "123",
    };

    const response = await request.post("/api/users/signup").send(userData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("message");
  });
  it("POST /todoapi/createtodo should create a new todo", async () => {
    const todoData = {
      title: "Test Todo",
      description: "Test Todo content",
      dueDate: "2024-12-31",
    }
      const response = await request.post("/todoapi/createtodo").send(todoData);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "Todo created successfully"
      );
      expect(response.body).toHaveProperty("data.title", todoData.title);
      expect(response.body).toHaveProperty(
        "data.description",
        todoData.description
      );
  })
    ;
  
  

});


describe("creatingtodo API endpoint", () => {
  beforeAll(async () => {
    // Connect to the test database
    const testDbConnection: string = process.env.TESTDB as string;
    await mongoose.connect(testDbConnection, {
      useNewUrlParser: true, // This line is fine
      useUnifiedTopology: true,
    } as any);
  });

  afterAll(async () => {
    // Disconnect from the test database after all tests
    await mongoose.disconnect();
  });

  it("should create a new todo", async () => {
    const todoData = {
      title: "Test Todo",
      description: "Test Todo content",
      dueDate: "2024-12-31",
    };

    const response = await request.post("/todoapi/createtodo").send(todoData);

    // Check response status and structure
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Task added correctly");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data.title).toBe(todoData.title);
    expect(response.body.data.description).toBe(todoData.description);
    expect(response.body.data.dueDate).toBe(todoData.dueDate);
  });

  it("should handle failure to create a todo", async () => {
    // Assuming some condition that leads to a failure in creating the todo
    const todoData = {
      title: "Test Todo",
      description: "Test Todo content",
      dueDate: "2024-12-31",
    };

    // Mock a failure scenario (e.g., by modifying the TodoTask model)
    jest.spyOn(mongoose.Model, "create").mockImplementationOnce(() => {
      throw new Error("Some error occurred");
    });

    const response = await request.post("/todoapi/createtodo").send(todoData);

    // Check response status and structure
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Failed to add task");
    expect(response.body).toHaveProperty("data", null);
    expect(response.body).toHaveProperty("theErrorIs");
  });
});

describe("deleteById API endpoint", () => {
  let testTodoId: string;

  beforeAll(async () => {
    // Connect to the test database
    const testDbConnection: string = process.env.TESTDB as string;
    await mongoose.connect(testDbConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);

    // Create a test todo to be used in the tests
    const todoData = {
      title: "Test Todo",
      description: "Test Todo content",
      dueDate: "2024-12-31",
    };

    const response = await request.post("/todoapi/createtodo").send(todoData);
    testTodoId = response.body.data._id;
  });

  afterAll(async () => {
    // Disconnect from the test database after all tests
    await mongoose.disconnect();
  });

  it("should delete a todo by ID", async () => {
    const response = await request.delete(`/todoapi/delete/${testTodoId}`);

    // Check response status and structure
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Task deleted successfully");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("_id", testTodoId);
  });

  it("should handle not finding a todo by ID", async () => {
    // Assuming some non-existing ID
    const nonExistingId = "nonexistentid";

    const response = await request.delete(`/todoapi/delete/${nonExistingId}`);

    // Check response status and structure
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Task not found");
    expect(response.body).toHaveProperty("data", null);
  });

  it("should handle failure to delete a todo by ID", async () => {
    // Mock a failure scenario (e.g., by modifying the TodoTask model)
    jest.spyOn(mongoose.Model, "findByIdAndDelete").mockImplementationOnce(() => {
      throw new Error("Some error occurred");
    });

    const response = await request.delete(`/todoapi/delete/${testTodoId}`);

    // Check response status and structure
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Failed to delete task");
    expect(response.body).toHaveProperty("data", null);
  });
});

describe("findAll API endpoint", () => {
  beforeAll(async () => {
    // Connect to the test database
    const testDbConnection: string = process.env.TESTDB as string;
    await mongoose.connect(testDbConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }as any);
  });

  afterAll(async () => {
    // Disconnect from the test database after all tests
    await mongoose.disconnect();
  });

  it("should find all tasks", async () => {
    // Assuming there are some tasks in the database
    const response = await request.get("/todoapi/findall");

    // Check response status and structure
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Tasks found");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should handle case where no tasks are found", async () => {
    // Assuming the database is empty
    // Clear existing tasks
    await mongoose.connection.db.dropCollection("todotasks");

    const response = await request.get("/todoapi/findall");

    // Check response status and structure
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "No tasks found");
    expect(response.body).toHaveProperty("data", null);
  });

  it("should handle failure to find tasks", async () => {
    // Mock a failure scenario (e.g., by modifying the TodoTask model)
    jest.spyOn(mongoose.Model, "find").mockImplementationOnce(() => {
      throw new Error("Some error occurred");
    });

    const response = await request.get("/todoapi/findall");

    // Check response status and structure
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
    expect(response.body).toHaveProperty("data", null);
  });
});

describe("findtaskById API endpoint", () => {
  let testTodoId: string;

  beforeAll(async () => {
    // Connect to the test database
    const testDbConnection: string = process.env.TESTDB as string;
    await mongoose.connect(testDbConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }as any);

    // Create a test todo to be used in the tests
    const todoData = {
      title: "Test Todo",
      description: "Test Todo content",
      dueDate: "2024-12-31",
    };

    const response = await request.post("/todoapi/createtodo").send(todoData);
    testTodoId = response.body.data._id;
  });

  afterAll(async () => {
    // Disconnect from the test database after all tests
    await mongoose.disconnect();
  });

  it("should find a task by ID", async () => {
    const response = await request.get(`/todoapi/find/${testTodoId}`);

    // Check response status and structure
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Task found");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("_id", testTodoId);
  });

  it("should handle case where task is not found by ID", async () => {
    // Assuming some non-existing ID
    const nonExistingId = "nonexistentid";

    const response = await request.get(`/todoapi/find/${nonExistingId}`);

    // Check response status and structure
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Task not found");
    expect(response.body).toHaveProperty("data", null);
  });

  it("should handle failure to find a task by ID", async () => {
    // Mock a failure scenario (e.g., by modifying the TodoTask model)
    jest.spyOn(mongoose.Model, "findById").mockImplementationOnce(() => {
      throw new Error("Some error occurred");
    });

    const response = await request.get(`/todoapi/find/${testTodoId}`);

    // Check response status and structure
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
    expect(response.body).toHaveProperty("data", null);
  });
});

describe("updatethetask API endpoint", () => {
  let testTodoId: string;

  beforeAll(async () => {
    // Connect to the test database
    const testDbConnection: string = process.env.TESTDB as string;
    await mongoose.connect(testDbConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }as any);

    // Create a test todo to be used in the tests
    const todoData = {
      title: "Test Todo",
      description: "Test Todo content",
      dueDate: "2024-12-31",
    };

    const response = await request.post("/todoapi/createtodo").send(todoData);
    testTodoId = response.body.data._id;
  });

  afterAll(async () => {
    // Disconnect from the test database after all tests
    await mongoose.disconnect();
  });

  it("should update a task by ID", async () => {
    const updatedData = {
      title: "Updated Todo",
      description: "Updated Todo content",
      dueDate: "2025-01-31",
    };

    const response = await request
      .put(`/todoapi/update/${testTodoId}`)
      .send(updatedData);

    // Check response status and structure
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Task updated successfully"
    );
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("_id", testTodoId);
    expect(response.body.data.title).toBe(updatedData.title);
    expect(response.body.data.description).toBe(updatedData.description);
    expect(response.body.data.dueDate).toBe(updatedData.dueDate);
  });

  it("should handle case where task is not found for update", async () => {
    // Assuming some non-existing ID
    const nonExistingId = "nonexistentid";

    const response = await request
      .put(`/todoapi/update/${nonExistingId}`)
      .send({ title: "Updated Todo" });

    // Check response status and structure
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Task not found");
    expect(response.body).toHaveProperty("data", null);
  });

  it("should handle failure to update a task by ID", async () => {
    // Mock a failure scenario (e.g., by modifying the TodoTask model)
    jest
      .spyOn(mongoose.Model, "findByIdAndUpdate")
      .mockImplementationOnce(() => {
        throw new Error("Some error occurred");
      });

    const response = await request
      .put(`/todoapi/update/${testTodoId}`)
      .send({ title: "Updated Todo" });

    // Check response status and structure
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Failed to update task");
    expect(response.body).toHaveProperty("data", null);
  });
});