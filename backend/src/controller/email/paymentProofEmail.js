const emailService = require("../../services/emailService");

const paymentProof = async (req, res) => {
  const { userEmail, generatedPdf } = req.body;

  const responseBody = {
    title: "Payment proof",
    intro: `You have an attached payment proof from ${new Date()}.`,
    outro: `Thank you for choosing our platform!`,
    attachments: [
      {
        filename: "fileName.pdf",
        contentType: "application/pdf",
        content: generatedPdf.toString("base64"),
      },
    ],
  };

  try {
      // Use the common email service to send the email
      await emailService.sendEmail( userEmail, "Payment Proof", responseBody );
  
      return res.status(201).json({
        msg: "You should receive an email",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
};

module.exports = paymentProof;