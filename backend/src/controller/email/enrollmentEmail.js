const emailService = require("../../services/emailService");

const enrollment = async (req, res) => {

    const { userEmail } = req.body;

    const responseBody = {
        title: 'Enrollment was successful!',
        intro: 'Welcome to our platform! We are excited to collaborate with you.'
    };

    try {
        // Use the common email service to send the email
        await emailService.sendEmail( userEmail, "Successful Enrollment", responseBody );
    
        return res.status(201).json({
          msg: "You should receive an email",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = enrollment;