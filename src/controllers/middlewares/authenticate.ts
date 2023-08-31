import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.slice(7) as string;
  jwt.verify(accessToken, "bezkoder-secret-key", (err) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized!",
      });
    }
    next();
  });
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.slice(7) as string;
  const { user }: any = jwt.verify(accessToken, "bezkoder-secret-key");
  if (user.role !== "ADMIN") {
    return res.status(401).json({
      message: "Require Admin Role!!",
    });
  }
  next();
};

export { verifyToken, isAdmin };
