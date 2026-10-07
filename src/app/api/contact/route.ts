import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getStoredSiteData } from "@/lib/site-content";
import { CONTACT_TOPICS, topicLabel } from "@/lib/contact";

/** Everything below is attacker-controlled and lands in an HTML email. */
const escapeHtml = (v: string) =>
    v
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

/** Header values must be a single line. */
const oneLine = (v: string) => v.replace(/[\r\n]+/g, " ").trim();

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

export async function POST(request: NextRequest) {
    const data = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!data) return fail("Invalid request.");

    // Honeypot: a real visitor never sees this field. Pretend success so bots move on.
    if (str(data.company, 200)) return NextResponse.json({ ok: true });

    const name = oneLine(str(data.name, 100));
    const email = oneLine(str(data.email, 200));
    const phone = oneLine(str(data.phone, 30));
    const message = str(data.message, 5000);
    const topic = CONTACT_TOPICS.some((t) => t.value === data.topic) ? String(data.topic) : "other";

    if (!name) return fail("Please enter your name.");
    if (!EMAIL_RE.test(email)) return fail("Please enter a valid email address.");
    if (message.length < 10) return fail("Please write a slightly longer message.");

    // Editable at /admin/site/contact; the env var stays the fallback.
    const { contact } = await getStoredSiteData();
    const to = contact.email.trim() || process.env.CONTACT_EMAIL;
    const from = process.env.SMTP_USER;
    if (!to || !from) return fail("The contact form isn't configured yet.", 500);

    const rows: [string, string][] = [
        ["Name", name],
        ["Email", email],
        ["Phone", phone || "—"],
        ["Topic", topicLabel(topic)],
    ];

    try {
        await transporter.sendMail({
            // Sent from the site's own mailbox. Putting the visitor's address in From
            // (as before) is spoofing: it fails SPF/DMARC and Gmail drops or spams
            // it. Reply-To keeps "Reply" going straight to the visitor.
            from: `"afifzilani.com" <${from}>`,
            replyTo: { name, address: email },
            to,
            subject: `[ZeroD Farm] ${topicLabel(topic)} — ${name}`,
            text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${message}`,
            html: `
        <div style="font-family:Arial,sans-serif;color:#132119;max-width:600px">
          <h2 style="color:#25603f;margin:0 0 16px">New message from afifzilani.com</h2>
          <table style="border-collapse:collapse;font-size:14px">
            ${rows
                .map(
                    ([k, v]) =>
                        `<tr><td style="color:#4f5c55;padding:4px 16px 4px 0">${k}</td><td>${escapeHtml(v)}</td></tr>`
                )
                .join("")}
          </table>
          <p style="white-space:pre-wrap;font-size:15px;line-height:1.5;margin-top:20px">${escapeHtml(message)}</p>
        </div>
      `,
        });
        return NextResponse.json({ ok: true });
    } catch {
        return fail("Your message couldn't be sent. Please email me directly instead.", 500);
    }
}
