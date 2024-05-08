// test for passwordHashing function
import supertest from "supertest";
import app from "../index";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { MongoMemoryServer } from "mongodb-memory-server";
import { passwordHashing } from "../utils/passencodingAnddecoding";

// let mongoServer: MongoMemoryServer;
// let testTodoId: string;

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

describe("passwordHashing function", () => {
  it("should hash the password successfully", async () => {
    const password = "testPassword";
    const hashedPassword = await passwordHashing(password);
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword.length).toBeGreaterThan(0);
  });

  it("should throw an error when hashing fails", async () => {
    const password = "testPassword";
    // Mocking bcrypt.hash to simulate an error
    jest
      .spyOn(bcrypt, "hash")
      .mockRejectedValue(new Error("Hashing failed") as never);

    await expect(passwordHashing(password)).rejects.toThrow(
      "Password hashing failed"
    );
  });
});

// test for passComparer function
import { passComparer } from "../utils/passencodingAnddecoding";

describe("passComparer function", () => {
  it("should compare passwords successfully", async () => {
    const password = "testPassword";
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await passComparer(password, hashedPassword);
    expect(result).toBe(true);
  });

  it("should return false for mismatched passwords", async () => {
    const password = "testPassword";
    const hashedPassword = await bcrypt.hash("wrongPassword", 10);

    const result = await passComparer(password, hashedPassword);
    expect(result).toBe(false);
  });

  it("should throw an error when comparing fails", async () => {
    const password = "testPassword";
    const hashedPassword = await bcrypt.hash(password, 10);
    // Mocking bcrypt.compare to simulate an error
    jest.spyOn(bcrypt, "compare");
    jest
      .spyOn(bcrypt, "compare")
      .mockRejectedValue(new Error("Comparison failed") as never);

    await expect(passComparer(password, hashedPassword)).rejects.toThrow(
      "Password comparison failed"
    );
  });
});

// test for generatingToken and verifyingtoken functions
import { generatingToken, verifyingtoken } from "../utils/token";
import { any } from "joi";

describe("Token functions", () => {
  it("should generate a token successfully", () => {
    const payload = { userId: "12345", userEmail: "test@example.com" };
    const token = generatingToken(payload);
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(0);
  });

  it("should verify a valid token successfully", async () => {
    const payload = { userId: "12345", userEmail: "test@example.com" };
    const token = jwt.sign(payload, "mysecret", { expiresIn: "30s" });

    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const res = { status: jest.fn(), json: jest.fn() };
    const next = jest.fn();

    await verifyingtoken(req as any, res as any, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(payload);
  });

  it("should handle invalid token and return 401", async () => {
    const req = { headers: { authorization: "Bearer invalidToken" } };
    const res = { status: jest.fn(), json: jest.fn() };
    const next = jest.fn();

    await verifyingtoken(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle missing token and return 401", async () => {
    const req = { headers: {} };
    const res = { status: jest.fn(), json: jest.fn() };
    const next = jest.fn();

    await verifyingtoken(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle token verification failure and return 401", async () => {
    const req = { headers: { authorization: "Bearer invalidToken" } };
    const res = { status: jest.fn(), json: jest.fn() };
    const next = jest.fn();

    // Mocking jwt.verify to simulate an error
    jest
      .spyOn(jwt, "verify")
      .mockImplementationOnce((token, secret, callback) => {
        new Error("Token verification failed"), null;
      });

    await verifyingtoken(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });
});
