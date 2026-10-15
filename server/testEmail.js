import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "infhajoe@gmail.com",
    pass: "ilkhujgdwsbaxscb",
  },
});

async function main() {
  try {
    let info = await transporter.sendMail({
      from: '"conNECt Platform" <infhajoe@gmail.com>', // sender address
      to: "24205052@nec.edu.in", // list of receivers
      subject: "Test Email from Script", // Subject line
      text: "This is a test email.", // plain text body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

main();
