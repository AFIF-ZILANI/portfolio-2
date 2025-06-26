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
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        });
        return NextResponse.json({ status: "success" }, { status: 200 });
    } catch {
        return NextResponse.json({ status: "error" }, { status: 500 });
    }
}
