const emailService = require("../../services/emailService");

const createAccount = async (req, res) => {
  const { userEmail } = req.body;

  const responseBody = {
    title: "Your account has been successfully created!",
    intro: "Welcome to our platform!",
    action: {
      instructions: "Log into your account by clicking the button below:",
      button: {
        color: "#02755D",
        text: "Log in",
        link: "http://localhost:3000/login",
      },
    },
  };

  try {
    // Use the common email service to send the email
    await emailService.sendEmail( userEmail, "Create TaxEase Account", responseBody );

    return res.status(201).json({
      msg: "You should receive an email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = createAccount;