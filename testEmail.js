const nodemailer = require("nodemailer");

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "infhajoe@gmail.com",
      pass: "ilkhujgdwsbaxscb",
    },
  });

  try {
    console.log("Attempting to verify connection...");
    await transporter.verify();
    console.log("Connection verified successfully!");
  } catch (error) {
    console.error("Verification failed:");
    console.error(error);
  }
}

testEmail();
