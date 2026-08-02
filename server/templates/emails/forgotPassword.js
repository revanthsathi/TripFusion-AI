const forgotPasswordTemplate = (name, otp) => {
    return `
        <div style="font-family: Arial, sans-serif; padding:20px;">
            <h2>🔒 Password Reset</h2>

            <p>Hello <b>${name}</b>,</p>

            <p>Your password reset OTP is:</p>

            <h1 style="letter-spacing:6px;">
                ${otp}
            </h1>

            <p>
                Valid for 5 minutes.
            </p>

            <hr>

            <small>
                Ignore this email if you didn't request it.
            </small>
        </div>
    `;
};

module.exports = forgotPasswordTemplate;