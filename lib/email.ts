import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendWelcomeEmail(
  to: string,
  name: string,
  schoolName: string,
  schoolId: string
) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email environment variables not set");
  }

  await transporter.sendMail({
    from: `"Primus" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to Primus 🎉",
    text: `Hello ${name},

Your Primus admin account has been created successfully.

School Name: ${schoolName}
School ID: ${schoolId}

You can now log in and start managing your school.

If you did not create this account, please ignore this email.

— Primus Team`,
  });
}
