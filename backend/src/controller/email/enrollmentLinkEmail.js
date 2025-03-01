const emailService = require("../../services/emailService");

const requestLink = async (req, res) => {
  const { userEmail } = req.body;

  const responseBody = {
    title: "Enrollment Request",
    intro: "We are glad for your interest!",
    action: {
      instructions:
        "To begin the enrollment process on our platform, please click the button below:",
      button: {
        color: "#02755D",
        text: "Enroll Now",
        link: `http://localhost:3000/inrolare?userEmail=${userEmail}`,
      },
    },
  };

  try {
    // Use the common email service to send the email
    await emailService.sendEmail(
      userEmail,
      "Enrollment Request",
      responseBody
    );

    return res.status(201).json({
      msg: "You should receive an email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = requestLink;
