require("dotenv").config();

const sendEmail = require("./services/emailService");

(async () => {
    try {
        await sendEmail({
            to: "revanthsathi@gmail.com",
            subject: "TripFusion AI Test",
            html: "<h2>🎉 Resend is working!</h2>"
        });

        console.log("Email Sent Successfully");
    } catch (error) {
        console.error(error);
    }
})();