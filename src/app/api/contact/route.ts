import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactFormState = {
    name: string;
    email: string;
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
    const { name, email, message } = data;

    try {
        await transporter.sendMail({
            from: `${name} <${email}>`,
            to: process.env.CONTACT_EMAIL,
            subject: `[afif.dev] New message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
        <div style="font-family:monospace;background:#0d0d0d;color:#e2e8f0;padding:24px;border-radius:4px;max-width:600px">
          <div style="color:#4ade80;font-size:14px;margin-bottom:16px">afif@dev:contact$ cat message.txt</div>
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <tr><td style="color:#94a3b8;padding:4px 12px 4px 0;width:80px">name</td><td style="color:#e2e8f0">${name}</td></tr>
            <tr><td style="color:#94a3b8;padding:4px 12px 4px 0">email</td><td><a href="mailto:${email}" style="color:#4ade80">${email}</a></td></tr>
            <tr><td style="color:#94a3b8;padding:4px 12px 4px 0;vertical-align:top">message</td><td style="color:#e2e8f0;white-space:pre-wrap">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td></tr>
          </table>
          <div style="margin-top:24px;font-size:11px;color:#475569">Sent via afif.dev contact terminal</div>
        </div>
      `,
        });
        return NextResponse.json({ status: "success", ok: true }, { status: 200 });
    } catch {
        return NextResponse.json({ status: "error", ok: false }, { status: 500 });
    }
}
