import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { Response } from "express";

type PayloadT = {
  link?: string;
  name?: string;
};
type dataSendEmail = {
  type: string;
  email: string;
  payload: PayloadT;
  res: Response;
};
const sendEmail = ({ type, email, payload, res }: dataSendEmail) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "tungshopman@gmail.com",
        pass: "cvwxivxuxnlisdoi", // naturally, replace both with your real credentials or an application-specific password
      },
    });

    const template = () => {
      switch (type) {
        case "forgotPassword":
          return "./template/resetPassword.handlebars";
        case "resetPassword":
          return "./template/verifyResetPassword.handlebars";
        default:
          return "";
      }
    };

    const source = fs.readFileSync(path.join(__dirname, template()), "utf8");
    const compiledTemplate = handlebars.compile(source);

    const optionSendMail = () => {
      switch (type) {
        case "forgotPassword":
          return {
            from: "tungshopman@gmail.com",
            to: email,
            subject: "Password Reset Request",
            html: compiledTemplate(payload),
          };
        case "resetPassword":
          return {
            from: "tungshopman@gmail.com",
            to: email,
            subject: "Password Reset Successfully",
            html: compiledTemplate(payload),
          };
        default:
          return {
            from: "tungshopman@gmail.com",
            to: "",
          };
      }
    };
    // Send email
    transporter.sendMail(optionSendMail(), (error) => {
      if (error) {
        return res.status(400).json({
          error: error,
        });
      } else {
        return res.status(200).json({
          message: "Success !",
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

export { sendEmail };
