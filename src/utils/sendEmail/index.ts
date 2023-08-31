import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { Response } from "express";

type PayloadT = {
  name: string;
  link: string;
};
const sendEmail = async (
  email: string,
  subject: string,
  payload: PayloadT,
  template: any,
  res: Response
) => {
  try {
    console.log("email", email);
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      // host: "http://localhost:3030",
      port: 465,
      auth: {
        user: "tunglv@reactplus.com",
        pass: "17122001tT", // naturally, replace both with your real credentials or an application-specific password
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: "tunglv@reactplus.com",
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };
    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log("error", error);
        return error;
      } else {
        return res.status(200).json({
          success: "Success",
        });
      }
    });
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

export { sendEmail };
