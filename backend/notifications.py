import os
import smtplib
from datetime import datetime
from email.message import EmailMessage
from pathlib import Path
from typing import Optional

# Attempt to load .env from the current working directory, project root, or backend directory
try:
    from dotenv import load_dotenv

    backend_dir = Path(__file__).resolve().parent
    project_root = backend_dir.parent
    if (project_root / ".env").exists():
        load_dotenv(project_root / ".env")
    elif (backend_dir / ".env").exists():
        load_dotenv(backend_dir / ".env")
    else:
        load_dotenv()
except ImportError:
    pass


def get_email_config() -> dict:
    """Dynamically get email configuration from environment variables."""
    return {
        "notify_email": os.getenv("NOTIFY_EMAIL", "").strip(),
        "sender_email": os.getenv("SENDER_EMAIL", "").strip(),
        "sender_password": os.getenv("SENDER_APP_PASSWORD", "").strip(),
        "smtp_server": os.getenv("SMTP_SERVER", "smtp.gmail.com").strip(),
        "smtp_port": int(os.getenv("SMTP_PORT", "587")),
    }


def _send_email(message: EmailMessage, config: Optional[dict] = None) -> None:
    if config is None:
        config = get_email_config()

    sender_email = config["sender_email"]
    sender_password = config["sender_password"]
    smtp_server = config["smtp_server"]
    smtp_port = config["smtp_port"]

    if not sender_email or not sender_password:
        raise RuntimeError("SENDER_EMAIL and SENDER_APP_PASSWORD are required for email delivery")

    with smtplib.SMTP(smtp_server, smtp_port, timeout=20) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(message)


def _build_student_confirmation(
    name: str,
    email: str,
    message: str,
    program: str = "",
    class_mode: str = "",
    config: Optional[dict] = None,
) -> EmailMessage:
    if config is None:
        config = get_email_config()

    sender = config["sender_email"]
    notify_email = config["notify_email"] or sender
    date_str = datetime.now().strftime("%B %d, %Y at %I:%M %p")

    # Parse details if not provided directly
    if not program or not class_mode:
        for line in message.splitlines():
            if line.lower().startswith("program of interest:"):
                program = line.split(":", 1)[1].strip()
            elif line.lower().startswith("preferred class format:"):
                class_mode = line.split(":", 1)[1].strip()

    display_program = program if program else "CUBE / COHORT"
    display_mode = class_mode if class_mode else "Standard"

    email_msg = EmailMessage()
    email_msg["From"] = f"Devigners Learning Institute <{sender}>"
    email_msg["To"] = email
    email_msg["Reply-To"] = notify_email
    email_msg["Subject"] = "Devigners Learning Institute — Your Admission Form Has Been Submitted"

    # Plain text fallback
    plain_text = (
        f"Hi {name},\n\n"
        "Thank you for submitting your admission form to Devigners Learning Institute!\n\n"
        "Your application has been received and logged in our system. "
        "Our HR and Admissions team will review your information and contact you directly "
        "via email or phone with your class schedule, orientation details, and the next steps.\n\n"
        "--------------------------------------------------\n"
        "SUBMISSION SUMMARY:\n"
        f"• Student Name: {name}\n"
        f"• Email: {email}\n"
        f"• Program of Interest: {display_program}\n"
        f"• Preferred Class Format: {display_mode}\n"
        f"• Submitted On: {date_str}\n"
        "--------------------------------------------------\n\n"
        "There is no need to submit this form again. If you have any urgent questions, "
        f"feel free to reply directly to this email or contact us at hello@devigners.net.\n\n"
        "Warm regards,\n"
        "Admissions & HR Team\n"
        "Devigners Learning Institute\n"
        "https://devigners.net\n"
    )
    email_msg.set_content(plain_text)

    # Rich HTML version
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admission Form Received</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; padding:30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:580px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.06); border:1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color:#dc2626; padding:32px 30px; text-align:center;">
              <p style="margin:0 0 6px 0; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:2px; color:#fee2e2;">Devigners Learning Institute</p>
              <h1 style="margin:0; font-size:24px; font-weight:900; color:#ffffff; line-height:1.2;">Admission Application Received</h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:32px 30px 20px 30px;">
              <p style="font-size:16px; line-height:1.6; color:#0f172a; margin:0 0 16px 0;">
                Hi <strong>{name}</strong>,
              </p>
              <p style="font-size:15px; line-height:1.6; color:#334155; margin:0 0 20px 0;">
                Thank you for applying to <strong>Devigners Learning Institute</strong>. We are delighted that you chose us to advance your journey into tech and computer science!
              </p>
              
              <!-- Highlight Box -->
              <div style="background-color:#fef2f2; border-left:4px solid #dc2626; padding:16px 18px; border-radius:8px; margin:0 0 24px 0;">
                <p style="margin:0 0 6px 0; font-size:14px; font-weight:700; color:#991b1b;">
                  ✓ Form Successfully Submitted
                </p>
                <p style="margin:0; font-size:13.5px; line-height:1.5; color:#7f1d1d;">
                  Our <strong>HR and admissions team</strong> is currently reviewing your details. We will contact you via email or phone regarding the next steps, admission confirmation, and class schedule.
                </p>
              </div>

              <!-- Summary Card -->
              <h3 style="font-size:14px; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:#64748b; margin:0 0 12px 0;">
                Submission Details
              </h3>
              <table width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin:0 0 24px 0;">
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:13.5px; color:#64748b; width:35%;">Applicant Name:</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:600; color:#0f172a;">{name}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:13.5px; color:#64748b;">Registered Email:</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:600; color:#0f172a;">{email}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:13.5px; color:#64748b;">Selected Program:</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:700; color:#dc2626;">
                    {display_program}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:13.5px; color:#64748b;">Class Format:</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:600; color:#0f172a;">{display_mode}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; font-size:13.5px; color:#64748b;">Date Received:</td>
                  <td style="padding:12px 16px; font-size:13.5px; color:#475569;">{date_str}</td>
                </tr>
              </table>

              <p style="font-size:13.5px; line-height:1.6; color:#64748b; margin:0 0 16px 0;">
                <strong>Note:</strong> You do not need to submit this form again. If you have questions before our HR team reaches out, simply reply directly to this email or write to <a href="mailto:hello@devigners.net" style="color:#dc2626; text-decoration:none; font-weight:600;">hello@devigners.net</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f1f5f9; padding:20px 30px; text-align:center; border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 4px 0; font-size:12.5px; font-weight:700; color:#334155;">Devigners Learning Institute</p>
              <p style="margin:0; font-size:11.5px; color:#64748b;">CUBE (Computer Fundamentals) &amp; COHORT (Full-Stack Development)</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""
    email_msg.add_alternative(html_content, subtype="html")
    return email_msg


def _build_admin_notification(
    name: str,
    email: str,
    message: str,
    program: str = "",
    class_mode: str = "",
    config: Optional[dict] = None,
) -> EmailMessage:
    if config is None:
        config = get_email_config()

    sender = config["sender_email"]
    notify_email = config["notify_email"]
    date_str = datetime.now().strftime("%B %d, %Y at %I:%M %p")

    if not program or not class_mode:
        for line in message.splitlines():
            if line.lower().startswith("program of interest:"):
                program = line.split(":", 1)[1].strip()
            elif line.lower().startswith("preferred class format:"):
                class_mode = line.split(":", 1)[1].strip()

    display_program = program if program else "Admissions"
    display_mode = class_mode if class_mode else "Standard"

    email_msg = EmailMessage()
    email_msg["From"] = f"Devigners Admissions Alert <{sender}>"
    email_msg["To"] = notify_email
    email_msg["Reply-To"] = email
    email_msg["Subject"] = f"New Admission Application: {name} ({display_program})"

    # Plain text fallback
    plain_text = (
        "NEW STUDENT ADMISSION APPLICATION RECEIVED\n"
        "==================================================\n\n"
        f"Student Name:           {name}\n"
        f"Student Email:          {email}\n"
        f"Program of Interest:    {display_program}\n"
        f"Preferred Class Format: {display_mode}\n"
        f"Submitted At:           {date_str}\n\n"
        "Application Message:\n"
        f"{message}\n\n"
        "==================================================\n"
        f"Action: Reply directly to this email to contact {name} at {email}.\n"
    )
    email_msg.set_content(plain_text)

    # Rich HTML version for HR / Admin
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Admission Application</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9; padding:30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:580px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.06); border:1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color:#0f172a; padding:24px 30px; border-bottom:4px solid #dc2626;">
              <p style="margin:0 0 4px 0; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:2px; color:#ef4444;">HR &amp; Admissions Alert</p>
              <h1 style="margin:0; font-size:22px; font-weight:800; color:#ffffff;">New Admission Application</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:28px 30px;">
              <p style="font-size:15px; color:#334155; margin:0 0 20px 0;">
                A new student has submitted an admissions form on the <strong>Devigners Learning Institute</strong> website:
              </p>

              <!-- Student Profile Card -->
              <table width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin:0 0 24px 0;">
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:13px; color:#64748b; width:35%;">Applicant Name:</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:700; color:#0f172a;">{name}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:13px; color:#64748b;">Email Address:</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:600; color:#0284c7;">
                    <a href="mailto:{email}" style="color:#0284c7; text-decoration:none;">{email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:13px; color:#64748b;">Program:</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:800; color:#dc2626;">{display_program}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:13px; color:#64748b;">Format:</td>
                  <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:600; color:#334155;">{display_mode}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px; font-size:13px; color:#64748b;">Submitted At:</td>
                  <td style="padding:12px 16px; font-size:13.5px; color:#475569;">{date_str}</td>
                </tr>
              </table>

              <!-- Full Message / Notes -->
              <div style="background-color:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:16px; margin:0 0 24px 0;">
                <p style="margin:0 0 8px 0; font-size:12px; font-weight:700; text-transform:uppercase; color:#64748b;">Raw Form Details</p>
                <pre style="margin:0; font-family:Consolas, Monaco, monospace; font-size:13px; color:#1e293b; white-space:pre-wrap; word-break:break-word;">{message}</pre>
              </div>

              <!-- Action button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 10px auto;">
                <tr>
                  <td align="center" style="border-radius:10px; background-color:#dc2626;">
                    <a href="mailto:{email}?subject=Regarding%20your%20Devigners%20Admission%20Application" style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:10px;">
                      Reply to Student ({email})
                    </a>
                  </td>
                </tr>
              </table>
              <p style="text-align:center; font-size:12px; color:#94a3b8; margin:8px 0 0 0;">Or simply click Reply in your email client.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""
    email_msg.add_alternative(html_content, subtype="html")
    return email_msg


def send_admissions_notifications(
    name: str,
    email: str,
    message: str,
    program: str = "",
    class_mode: str = "",
) -> dict:
    """Send confirmation to the student and alert to HR/admin.

    Returns a status dict: {"student_email": bool, "admin_email": bool, "errors": list}
    """
    config = get_email_config()
    sender_email = config["sender_email"]
    sender_password = config["sender_password"]
    notify_email = config["notify_email"]

    status = {
        "student_email": False,
        "admin_email": False,
        "errors": [],
    }

    if not sender_email or not sender_password:
        err = "Email notification skipped: SENDER_EMAIL or SENDER_APP_PASSWORD not set"
        print(f"[Notifications] {err}")
        status["errors"].append(err)
        return status

    # 1. Send Student Confirmation Email
    try:
        student_msg = _build_student_confirmation(
            name=name,
            email=email,
            message=message,
            program=program,
            class_mode=class_mode,
            config=config,
        )
        _send_email(student_msg, config)
        status["student_email"] = True
        print(f"[Notifications] ✓ Confirmation email successfully sent to student: {email}")
    except Exception as error:
        err_msg = f"Failed to send confirmation email to student ({email}): {error}"
        print(f"[Notifications] ✗ {err_msg}")
        status["errors"].append(err_msg)

    # 2. Send HR / Admin Notification Email
    if notify_email:
        try:
            admin_msg = _build_admin_notification(
                name=name,
                email=email,
                message=message,
                program=program,
                class_mode=class_mode,
                config=config,
            )
            _send_email(admin_msg, config)
            status["admin_email"] = True
            print(f"[Notifications] ✓ Admission alert sent to HR/Admin: {notify_email}")
        except Exception as error:
            err_msg = f"Failed to send admission alert to HR/Admin ({notify_email}): {error}"
            print(f"[Notifications] ✗ {err_msg}")
            status["errors"].append(err_msg)
    else:
        err_msg = "HR alert skipped: NOTIFY_EMAIL is not set"
        print(f"[Notifications] ! {err_msg}")
        status["errors"].append(err_msg)

    return status


def send_contact_notification(name: str, email: str, message: str, form_type: str = "contact") -> dict:
    """Send alert to HR/Admin for general contact/demo requests."""
    config = get_email_config()
    sender_email = config["sender_email"]
    sender_password = config["sender_password"]
    notify_email = config["notify_email"]

    status = {"admin_email": False, "errors": []}

    if not sender_email or not sender_password or not notify_email:
        err = "Contact notification skipped: Email environment variables not configured"
        print(f"[Notifications] {err}")
        status["errors"].append(err)
        return status

    try:
        email_message = EmailMessage()
        email_message["From"] = f"Devigners Contact Form <{sender_email}>"
        email_message["To"] = notify_email
        email_message["Reply-To"] = email
        email_message["Subject"] = f"New {form_type} message from {name}"
        email_message.set_content(
            f"You received a new {form_type} form submission on Devigners.\n\n"
            f"Name: {name}\n"
            f"Email: {email}\n\n"
            f"Message:\n{message}\n"
        )
        _send_email(email_message, config)
        status["admin_email"] = True
        print(f"[Notifications] ✓ Contact notification sent to HR: {notify_email}")
    except Exception as error:
        err = f"Failed to send contact notification: {error}"
        print(f"[Notifications] ✗ {err}")
        status["errors"].append(err)

    return status
