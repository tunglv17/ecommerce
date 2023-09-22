import { NextFunction, Response, Request } from "express";
import User from "../../models/user";
import Token from "../../models/token";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { isEmpty, omit } from "lodash";
import { sendEmail } from "../../utils/sendEmail";
import { tokenT } from "../../types/token";
import { UserT } from "../../types/user";

const JWTSecret = process.env.JWT_SECRET as string;
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
      return res.status(200).json({
        user: user,
        accessToken: accessToken,
      });
    }
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
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const user: UserT | null = await User.findOne({ email: email });

    if (isEmpty(user)) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const token = await Token.findOne({ userId: user._id });
    if (token) {
      await token.deleteOne();
    }

    const resetToken = jwt.sign(
      { tokenResetPass: crypto.randomBytes(32).toString("hex") },
      "bezkoder-secret-key",
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      }
    );

    await new Token({
      userId: user._id,
      token: resetToken,
      createdAt: Date.now(),
    }).save();

    const link = `${clientURL}/reset-password?token=${resetToken}&id=${user._id}`;
    const dataSendMail = {
      type: "forgotPassword",
      email: email,
      payload: {
        link: link,
      },
      res: res,
    };

    sendEmail(dataSendMail);
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
  const { accessToken, userId, password } = req.body;
  const token: tokenT | null = await Token.findOne({ userId: userId });
  if (!token) {
    return res.status(400).json({
      error: "Invalid user",
    });
  }
  bcrypt.compare(accessToken, token.token, (err) => {
    if (err) {
      return res.status(400).json({
        error: "Invalid token",
      });
    }
    jwt.verify(accessToken, "bezkoder-secret-key", (err: any) => {
      if (err) {
        return res.status(401).json({
          message: "Unauthorized!",
        });
      }
    });
  });

  try {
    await User.updateOne(
      { _id: userId },
      { $set: { password: bcrypt.hashSync(password, 8) } },
      { new: true }
    );
    const user: UserT | null = await User.findById({ _id: userId });
    if (!user) {
      return res.status(401).json({
        message: "User not found!",
      });
    }
    res.status(200).json({
      message: "Reset password success !",
    });
    const dataSendMail = {
      type: "resetPassword",
      email: user.email,
      payload: {
        name: user?.fullName,
      },
      res: res,
    };
    sendEmail(dataSendMail);
    await Token.deleteOne({ _id: token._id });
  } catch (error) {
    res.status(500).json(error);
    next();
  }
};

export { getAll, signup, authenticate, forgotPassword, resetPassword };
