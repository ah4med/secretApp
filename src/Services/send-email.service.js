import nodemailer from "nodemailer";
import { EventEmitter } from "node:events";

// create a function to send email
const sendEmailService = async ({ to, subject, html, attachments = [] }) => { // if not specified, set to an empty array
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", //"smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      //   tls: {
      //     rejectUnauthorized: false,
      //   },
    });
    const info = await transporter.sendMail({
      from: `"no-reply" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
      attachments,
    });
    return info;
  } catch (error) {
    console.log(`Email sending failed`, error);
    return error;
  }
};

export const sendEmailEventEmitter = new EventEmitter();

sendEmailEventEmitter.on("sendEmail", (...args) => {
  const { to, subject, html, attachments } = args[0];
  sendEmailService({ to, subject, html, attachments });
});
