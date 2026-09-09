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


def send_admissions_notifications(name: str, email: str, message: str) -> None:
    """Send both the student's confirmation and the institute's new-lead notification."""
    if not NOTIFY_EMAIL:
        raise RuntimeError("NOTIFY_EMAIL is required for admissions notifications")

    student_message = EmailMessage()
    student_message["From"] = SENDER_EMAIL
    student_message["To"] = email
    student_message["Reply-To"] = NOTIFY_EMAIL
    student_message["Subject"] = "We received your Devigners request"
    student_message.set_content(
        f"Hi {name},\n\n"
        "Thank you for your interest in Devigners. We have received your admissions request.\n\n"
        f"{message}\n\n"
        "Our team will review your request and contact you as early as possible.\n\n"
        "Regards,\n"
        "Devigners Team\n"
        "IT Learning Institute\n"
    )

    admin_message = EmailMessage()
    admin_message["From"] = SENDER_EMAIL
    admin_message["To"] = NOTIFY_EMAIL
    admin_message["Reply-To"] = email
    admin_message["Subject"] = f"New Devigners admissions request — {name}"
    admin_message.set_content(
        "A new admissions request was submitted on the Devigners website.\n\n"
        f"Student name: {name}\n"
        f"Student email: {email}\n\n"
        f"Request details:\n{message}\n"
    )

    _send_email(student_message)
    _send_email(admin_message)


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
