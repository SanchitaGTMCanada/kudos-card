import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.SMTP_USER,
      subject: "Kudos Card SMTP Test",
      text: "SMTP is working correctly.",
      html: `
        <h2>Kudos Card SMTP Test</h2>
        <p>SMTP is working correctly.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "SMTP test email sent successfully.",
    });
  } catch (error) {
    console.error("SMTP test error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "SMTP test failed.",
      },
      { status: 500 }
    );
  }
}