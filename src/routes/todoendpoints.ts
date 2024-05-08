import express, { Router } from "express";
import { findAll } from "../controllers/find";
import { findtaskById } from "../controllers/findbyid";
import { updatethetask } from "../controllers/updatebyid";
import { deleteById } from "../controllers/deletebyid";
import { creatingtodo } from "../controllers/creating";
import { verifyingToken } from "../utils/token";

const todoRouter: Router = express.Router();
todoRouter.get("/get/:findId", findtaskById);
todoRouter.get("/gets", findAll);
todoRouter.use(verifyingToken);
todoRouter.post("/post", creatingtodo);
todoRouter.patch("/update/:updateId", updatethetask);
todoRouter.delete("/delete/:deleteId", deleteById);

export default todoRouter;

