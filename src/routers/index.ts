import { Express } from "express";
import categoriesRouter from "./categories";
import filesRouter from "./files";
import productsRouter from "./products";
import authRouter from "./authenticate";

const routerApp = (app: Express) => {
  app.use("/api", categoriesRouter);
  app.use("/api", filesRouter);
  app.use("/api", productsRouter);
  app.use("/api", authRouter);
};

export default routerApp;
