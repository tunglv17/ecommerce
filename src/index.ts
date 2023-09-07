import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import dbConnect from "./db";
import routerApp from "./routers";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(cors());
app.use(cors({ credentials: true }));

routerApp(app);

dbConnect();

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello from the TypeScript world!</h1>");
});

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
