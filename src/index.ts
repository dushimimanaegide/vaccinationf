import  mongoose from "mongoose";
import bodyParser from "body-parser";
import mainrouter from "./routes/index";
import express from "express";
import dotenv from 'dotenv';
import  cors  from "cors";

dotenv.config();
const app = express();
const port = 5000;

app.use(
  cors({
    credentials: true,
  })
)

app.use(bodyParser.json());
app.use("/todo", mainrouter);


const db: string = process.env.dbConnection as string;

mongoose
  .connect(db)
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch((error: any) => {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  });


export default app;