import express, { Router } from "express";
import { findAllUsers } from "../controllers/findusers";
import { deleteUserById } from "../controllers/deleteuser";
import { createUser } from "../controllers/creatuser";
import { login } from "../authentication/login";
import { verifyingToken } from "../utils/token";

const userRouter: Router = express.Router();

userRouter.post("/post", createUser);
userRouter.post("/login", login);
userRouter.use(verifyingToken);
userRouter.get("/gets",findAllUsers);
userRouter.delete("/delete/:userId",deleteUserById);

export default userRouter;
