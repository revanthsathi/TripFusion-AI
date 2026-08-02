const verifyEmailTemplate = (name, otp) => {
    return `
        <div style="font-family: Arial, sans-serif; padding:20px;">
            <h2>✈ Welcome to TripFusion AI</h2>

            <p>Hello <b>${name}</b>,</p>

            <p>Your verification code is:</p>

            <h1 style="letter-spacing:6px;">
                ${otp}
            </h1>

            <p>
                This OTP is valid for 5 minutes.
            </p>

            <hr>

            <small>
                If you didn't create this account,
                please ignore this email.
            </small>
        </div>
    `;
};

module.exports = verifyEmailTemplate;