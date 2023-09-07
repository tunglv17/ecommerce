import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../types/user";

type UsersT = {
  user: User;
};

const getUserFromToken = (token: string) => {
  const { user }: UsersT | any = jwt.verify(token, "bezkoder-secret-key");
  return user;
};

export { getUserFromToken };
