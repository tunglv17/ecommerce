import { Express } from "express";
import categoriesRouter from "./categories";
import filesRouter from "./files";
import productsRouter from "./products";
import authRouter from "./authenticate";
import cartRouter from "./cart";

const routerApp = (app: Express) => {
  app.use("/api", categoriesRouter);
  app.use("/api", filesRouter);
  app.use("/api", productsRouter);
  app.use("/api", authRouter);
  app.use("/api", cartRouter);
};

export default routerApp;
