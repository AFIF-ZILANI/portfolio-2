import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactFormState = {
    name: string;
    email: string;
    subject?: string;
    message: string;
};

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function POST(request: NextRequest) {
    const data: ContactFormState = await request.json();
    const { name, email, subject = "No subject", message } = data;

    try {
        await transporter.sendMail({
            from: `${name} <${email}>`,
            to: process.env.CONTACT_EMAIL,
            subject: `[Contact] ${subject}`,
            html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e2e2; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #2d3748;">New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #3182ce;">${email}</a></p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr style="border: none; border-top: 1px solid #e2e2e2; margin: 20px 0;">
      <p style="white-space: pre-line;">${message}</p>
      <footer style="margin-top: 30px; font-size: 12px; color: #718096;">
        This message was sent from your portfolio contact form.
      </footer>
    </div>
  `,
        });
        return NextResponse.json({ status: "success" }, { status: 200 });
    } catch {
        return NextResponse.json({ status: "error" }, { status: 500 });
    }
}
