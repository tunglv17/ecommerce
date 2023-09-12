import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { Response } from "express";

type PayloadT = {
  name: string;
  link: string;
};
const sendEmail = (
  email: string,
  subject: string,
  payload: PayloadT,
  template: any,
  res: Response
) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: "levantung2k01@gmail.com",
        pass: "drzyienyvxnhsmtd", // naturally, replace both with your real credentials or an application-specific password
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: "levantung2k01@gmail.com",
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };
    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        return res.status(400).json({
          error: error,
        });
      } else {
        return res.status(200).json({
          success: "Success",
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      error: error
    });
  }
};

export { sendEmail };
