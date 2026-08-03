const resetPasswordTemplate = (name, otp) => {

    return `
        <div style="font-family:Arial,sans-serif;padding:30px;background:#f8fafc">

            <div style="max-width:600px;margin:auto;background:#ffffff;padding:30px;border-radius:10px">

                <h2 style="color:#2563eb;">
                    TripFusion AI
                </h2>

                <h3>Hello ${name},</h3>

                <p>
                    We received a request to reset your password.
                </p>

                <p>
                    Use the OTP below to reset your password.
                </p>

                <div
                    style="
                        margin:30px 0;
                        padding:20px;
                        background:#eff6ff;
                        text-align:center;
                        font-size:32px;
                        font-weight:bold;
                        letter-spacing:8px;
                        color:#2563eb;
                        border-radius:10px;
                    "
                >
                    ${otp}
                </div>

                <p>
                    This OTP is valid for <strong>15 minutes</strong>.
                </p>

                <p>
                    If you didn't request this password reset,
                    please ignore this email.
                </p>

                <hr>

                <p style="font-size:12px;color:#888;">
                    © TripFusion AI
                </p>

            </div>

        </div>
    `;

};

module.exports = resetPasswordTemplate;