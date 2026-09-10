import os
import smtplib
from email.message import EmailMessage

NOTIFY_EMAIL = os.getenv("NOTIFY_EMAIL", "")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "")
SENDER_APP_PASSWORD = os.getenv("SENDER_APP_PASSWORD", "")

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))


def _send_email(message: EmailMessage) -> None:
    if not SENDER_EMAIL or not SENDER_APP_PASSWORD:
        raise RuntimeError("SENDER_EMAIL and SENDER_APP_PASSWORD are required for email delivery")

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=20) as server:
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_APP_PASSWORD)
        server.send_message(message)


def _build_student_confirmation(name: str, email: str, message: str) -> EmailMessage:
    email_message = EmailMessage()
    email_message["From"] = SENDER_EMAIL
    email_message["To"] = email
    email_message["Reply-To"] = NOTIFY_EMAIL
    email_message["Subject"] = "Your Devigners admission form has been received"
    email_message.set_content(
        f"Hi {name},\n\n"
        "Thank you for submitting your admission form to Devigners Learning Institute.\n\n"
        "Your form has been successfully submitted and received by our team. "
        "Our HR/admissions team will review your information and contact you regarding the next steps.\n\n"
        "Submission details:\n"
        f"{message}\n\n"
        "Please keep this email for your records. There is no need to submit the form again.\n\n"
        "Regards,\n"
        "Devigners Team\n"
        "Devigners Learning Institute\n"
    )
    return email_message


def _build_admin_notification(name: str, email: str, message: str) -> EmailMessage:
    email_message = EmailMessage()
    email_message["From"] = SENDER_EMAIL
    email_message["To"] = NOTIFY_EMAIL
    email_message["Reply-To"] = email
    email_message["Subject"] = f"New admission form — {name}"
    email_message.set_content(
        "A new admission form has been submitted on the Devigners website.\n\n"
        f"Student name: {name}\n"
        f"Student email: {email}\n\n"
        "Form details:\n"
        f"{message}\n\n"
        "Please review the submission and contact the student if follow-up is required.\n"
    )
    return email_message


def send_admissions_notifications(name: str, email: str, message: str) -> None:
    """Send confirmation to the student and a new-submission alert to HR/admin."""
    if not NOTIFY_EMAIL:
        raise RuntimeError("NOTIFY_EMAIL is required for admissions notifications")
    if not SENDER_EMAIL or not SENDER_APP_PASSWORD:
        raise RuntimeError("SENDER_EMAIL and SENDER_APP_PASSWORD are required for email delivery")

    # Send each message independently so one failed recipient does not prevent
    # the other notification from being attempted.
    try:
        _send_email(_build_student_confirmation(name, email, message))
        print(f"Admission confirmation email sent to {email}")
    except Exception as error:
        print(f"Failed to send student confirmation to {email}: {error}")

    try:
        _send_email(_build_admin_notification(name, email, message))
        print(f"Admission notification sent to HR: {NOTIFY_EMAIL}")
    except Exception as error:
        print(f"Failed to send HR admission notification: {error}")


def send_contact_notification(name, email, message, form_type):
    """Keep the existing contact notification behavior for the regular contact form."""
    if not SENDER_EMAIL or not SENDER_APP_PASSWORD or not NOTIFY_EMAIL:
        print("Email notification skipped: SMTP environment variables not set")
        return

    email_message = EmailMessage()
    email_message["From"] = SENDER_EMAIL
    email_message["To"] = NOTIFY_EMAIL
    email_message["Reply-To"] = email
    email_message["Subject"] = f"New {form_type} submission from {name}"
    email_message.set_content(
        f"You received a new {form_type} form submission.\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Message:\n{message}"
    )

    _send_email(email_message)
