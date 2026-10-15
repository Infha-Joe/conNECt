import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify(function(error, success) {
  if (error) {
    console.error("SMTP Error:", error);
    process.exit(1);
  } else {
    console.log("Server is ready to take our messages");
    process.exit(0);
  }
});
