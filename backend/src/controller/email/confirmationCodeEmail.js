const emailService = require("../../services/emailService");

const confirmationCode = async (req, res) => {
  const { userEmail, generatedCode } = req.body;

  const responseBody = {
    title: "Your Confirmation Code",
    intro: "Enter the confirmation code below on the registration page.",
    outro: `Code: ${generatedCode}`,
  };

  try {
        // Use the common email service to send the email
        await emailService.sendEmail( userEmail, "Your Confirmation Code", responseBody );
    
        return res.status(201).json({
          msg: "You should receive an email",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = confirmationCode;
