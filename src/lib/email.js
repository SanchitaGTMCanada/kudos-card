import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Send Kudos email to recipient
 */
export async function sendKudosRecipientEmail({
  recipient,
  sender,
  category,
  message,
}) {
  if (!recipient?.email) {
    throw new Error("Recipient email is missing.");
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: recipient.email,

    subject: `🎉 You received a Kudos from ${sender.name}`,

    html: `
      <!DOCTYPE html>
      <html>
        <body style="
          margin:0;
          padding:40px 20px;
          background:#f7f8fc;
          font-family:Arial,Helvetica,sans-serif;
          color:#18212f;
        ">

          <div style="
            max-width:600px;
            margin:0 auto;
            background:#ffffff;
            border:1px solid #e8eaf0;
            border-radius:20px;
            overflow:hidden;
          ">

            <div style="
              padding:28px 32px;
              background:#5b3cc4;
              color:#ffffff;
            ">
              <h1 style="
                margin:0;
                font-size:24px;
              ">
                You received a Kudos! 🎉
              </h1>
            </div>

            <div style="padding:32px;">

              <p style="font-size:16px;">
                Hi ${escapeHtml(recipient.name)},
              </p>

              <p style="
                font-size:15px;
                line-height:1.7;
                color:#596273;
              ">
                <strong>${escapeHtml(sender.name)}</strong>
                recognized you for
                <strong>${escapeHtml(category.name)}</strong>.
              </p>

              <div style="
                margin:24px 0;
                padding:22px;
                background:#f7f5ff;
                border-left:4px solid #5b3cc4;
                border-radius:12px;
              ">

                <p style="
                  margin:0;
                  font-size:15px;
                  line-height:1.7;
                  color:#303a48;
                ">
                  "${escapeHtml(message)}"
                </p>

              </div>

              <p style="
                font-size:15px;
                line-height:1.7;
                color:#596273;
              ">
                Keep up the great work!
              </p>

              <p style="
                margin-top:30px;
                color:#9ba3b0;
                font-size:12px;
              ">
                Kudos Card · Celebrate people
              </p>

            </div>

          </div>

        </body>
      </html>
    `,
  });
}

/**
 * Send Kudos notification email to HR
 */
export async function sendKudosHrEmail({
  sender,
  recipient,
  category,
  message,
}) {
  if (!process.env.HR_EMAIL) {
    throw new Error("HR_EMAIL is not configured.");
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.HR_EMAIL,

    subject: `New Kudos — ${sender.name} → ${recipient.name}`,

    html: `
      <!DOCTYPE html>
      <html>
        <body style="
          margin:0;
          padding:40px 20px;
          background:#f7f8fc;
          font-family:Arial,Helvetica,sans-serif;
          color:#18212f;
        ">

          <div style="
            max-width:650px;
            margin:0 auto;
            background:#ffffff;
            border:1px solid #e8eaf0;
            border-radius:20px;
            overflow:hidden;
          ">

            <div style="
              padding:28px 32px;
              background:#5b3cc4;
              color:#ffffff;
            ">

              <h1 style="
                margin:0;
                font-size:24px;
              ">
                New Employee Recognition 🎉
              </h1>

              <p style="
                margin:8px 0 0;
                color:#ddd4ff;
                font-size:14px;
              ">
                A new Kudos has been sent through Kudos Card.
              </p>

            </div>

            <div style="padding:32px;">

              <table style="
                width:100%;
                border-collapse:collapse;
                font-size:14px;
              ">

                <tr>
                  <td style="
                    padding:12px 0;
                    font-weight:bold;
                    width:130px;
                    border-bottom:1px solid #eef0f4;
                  ">
                    From
                  </td>

                  <td style="
                    padding:12px 0;
                    border-bottom:1px solid #eef0f4;
                  ">
                    ${escapeHtml(sender.name)}
                    (${escapeHtml(sender.employeeId)})
                  </td>
                </tr>

                <tr>
                  <td style="
                    padding:12px 0;
                    font-weight:bold;
                    border-bottom:1px solid #eef0f4;
                  ">
                    To
                  </td>

                  <td style="
                    padding:12px 0;
                    border-bottom:1px solid #eef0f4;
                  ">
                    ${escapeHtml(recipient.name)}
                    (${escapeHtml(recipient.employeeId)})
                  </td>
                </tr>

                <tr>
                  <td style="
                    padding:12px 0;
                    font-weight:bold;
                    border-bottom:1px solid #eef0f4;
                  ">
                    Category
                  </td>

                  <td style="
                    padding:12px 0;
                    border-bottom:1px solid #eef0f4;
                  ">
                    ${escapeHtml(category.name)}
                  </td>
                </tr>

              </table>

              <div style="
                margin-top:24px;
                padding:20px;
                background:#f7f8fc;
                border-radius:12px;
              ">

                <p style="
                  margin:0 0 8px;
                  font-size:12px;
                  font-weight:bold;
                  color:#8a92a2;
                  text-transform:uppercase;
                  letter-spacing:1px;
                ">
                  Message
                </p>

                <p style="
                  margin:0;
                  font-size:15px;
                  line-height:1.7;
                  color:#303a48;
                ">
                  ${escapeHtml(message)}
                </p>

              </div>

              <p style="
                margin-top:30px;
                color:#9ba3b0;
                font-size:12px;
              ">
                Kudos Card · Employee Recognition Platform
              </p>

            </div>

          </div>

        </body>
      </html>
    `,
  });
}

/**
 * Escape user-generated values before putting them into HTML.
 */
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}