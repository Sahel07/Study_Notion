const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    // Create transporter
   const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  logger: true,   // 👈 add this
  debug: true,    // 👈 add this
});

    // Send email
    const info = await transporter.sendMail({
      from: process.env.MAIL_USER, // ✅ Must match your authenticated email
      to: email,
      subject: title,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #1e88e5;">${title}</h2>
          <p>${body}</p>
          <p>If you did not request this, please ignore this email.</p>
          <br/>
          <p style="color: gray;">— StudyNotion Team</p>
        </div>
      `,
    });

    console.log("✅ Mail sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

module.exports = mailSender;
