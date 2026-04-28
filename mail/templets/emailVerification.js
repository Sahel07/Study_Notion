const otpTemplate = (otp) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>OTP Verification Email</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
            .message {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #6a1b9a;
            }
            .body {
                font-size: 16px;
                margin-bottom: 20px;
                color: #444;
            }
            .highlight {
                font-size: 28px;
                font-weight: bold;
                color: #000;
                margin: 20px 0;
            }
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 30px;
            }
            a {
                color: #1a73e8;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <a href="http://studynotion-edtech-project.vercel.app">
                <img class="logo" src="http://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo">
            </a>
            <div class="message">OTP Verification Email</div>
            <div class="body">
                <p>Dear User,</p>
                <p>
                    Thank you for registering with <strong>StudyNotion</strong>. To complete your registration, 
                    please use the following OTP (One-Time Password) to verify your account:
                </p>
                <div class="highlight">${otp}</div>
                <p>
                    This OTP is valid for <strong>5 minutes</strong>. If you did not request this verification,
                    please disregard this email.
                </p>
                <p>
                    Once your account is verified, you will have access to our platform and its features.
                </p>
            </div>
            <div class="support">
                If you have any questions or need assistance, please contact us at 
                <a href="mailto:info@studynotion.com">info@studynotion.com</a>.
            </div>
        </div>
    </body>
    
    </html>`;
};

module.exports = otpTemplate;
