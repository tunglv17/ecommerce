import jwt, { JwtPayload } from "jsonwebtoken";
import { UserT } from "../types/user";

type UsersT = {
  user: UserT;
};

const getUserFromToken = (token: string) => {
  const { user }: UsersT | any = jwt.verify(token, "bezkoder-secret-key");
  return user;
};

export { getUserFromToken };
