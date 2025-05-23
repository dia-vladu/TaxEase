import { createTransport } from "nodemailer";
import Mailgen from "mailgen";
import dotenv from "dotenv";
dotenv.config();

const { EMAIL, PASSWORD } = process.env;

const sendEmail = async ( userEmail, subject, responseBody ) => {
  // Configure the transporter (for Gmail in this case)
  const config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };

  const transporter = createTransport(config);

  // Initialize Mailgen with basic product info
  const MailGenerator = new Mailgen({
    theme: "salted",
    product: {
      name: "TaxEase",
      link: "http://localhost:3000/",
    },
  });

  // Generate the email content using the passed responseBody
  const response = { body: responseBody };

  const mail = MailGenerator.generate(response);

  // Prepare the email message
  const message = {
    from: EMAIL,
    to: userEmail,
    subject: subject,
    html: mail,
    attachments: responseBody.attachments || [], // Add attachments, if any
  };

  try {
    // Send the email
    await transporter.sendMail(message);
  } catch (error) {
    throw new Error("Email sending failed: " + error.message);
  }
};

export default { sendEmail };
