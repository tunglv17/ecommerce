import { NextFunction, Response, Request } from "express";
import User from "../../models/user";
import Token from "../../models/token";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { isEmpty, omit } from "lodash";
import { sendEmail } from "../../utils/sendEmail";

const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = "http://localhost:3030";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const limit: any = req.query.$limit || "";
  const sort: any = req.query.$sort || "";
  try {
    const data = await User.find().limit(limit).sort(sort);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { fullName, email, password, role } = req.body;
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({
      error: "Field is required",
    });
  }
  try {
    const checkEmailUser = await User.findOne({ email: email });
    if (checkEmailUser) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }
    const user = new User({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    const newUser = await user.save();
    res.status(200).json({
      user: newUser,
      message: "User was registered successfully!",
    });
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, strategy, accessToken } = req.body;

  try {
    if (strategy === "jwt") {
      const { user }: any = jwt.verify(accessToken, "bezkoder-secret-key");
      res.status(200).json({
        user: user,
        accessToken: accessToken,
      });
    } else {
      const user = await User.findOne({ email: email });
      if (isEmpty(user)) {
        return res.status(400).json({
          error: "User does not exist",
        });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).json({
          message: "Incorrect password!",
        });
      }
      const responseUser = omit(user, ["password"]);
      const token = jwt.sign({ user: responseUser }, "bezkoder-secret-key", {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

      res.status(200).json({
        user: responseUser,
        accessToken: token,
      });
    }
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const user: any = await User.findOne({ email: email });
    if (isEmpty(user)) {
      return res.status(400).json({
        error: "User already exists",
      });
    }
    console.log("!");

    const token = await Token.findOne({ userId: user._id });
    if (token) {
      await token.deleteOne();
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    await new Token({
      userId: user._id,
      token: resetToken,
      createdAt: Date.now(),
    }).save();

    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

    console.log("resetToken", resetToken);

    sendEmail(
      email,
      "Password Reset Request",
      {
        name: user.name,
        link: link,
      },
      "../../utils/sendEmail/template/resetPassword.handlebars",
      res
    );
    res.status(200).json({
      message: "Successfully!",
    });
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

export { getAll, signup, authenticate, resetPassword };
