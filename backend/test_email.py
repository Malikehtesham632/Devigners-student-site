#!/usr/bin/env python3
"""CLI utility to verify email delivery and credentials for Devigners Learning Institute.

Usage:
  python backend/test_email.py [recipient@example.com]
"""

import sys
import os
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

import notifications

def main():
    print("=" * 60)
    print("Devigners Learning Institute — Email Workflow Tester")
    print("=" * 60)

    config = notifications.get_email_config()
    print(f"SMTP Server:     {config['smtp_server']}:{config['smtp_port']}")
    print(f"Sender Email:    {config['sender_email'] or '(NOT SET)'}")
    print(f"Password Set:    {'YES (hidden)' if config['sender_password'] else 'NO'}")
    print(f"Notify (HR):     {config['notify_email'] or '(NOT SET)'}")
    print("-" * 60)

    if not config["sender_email"] or not config["sender_password"]:
        print("\n[ERROR] Missing SENDER_EMAIL or SENDER_APP_PASSWORD in environment.")
        print("Please configure these in your .env file or Railway environment variables.")
        print("Example:")
        print("  SENDER_EMAIL=your-email@gmail.com")
        print("  SENDER_APP_PASSWORD=your-16-char-app-password")
        print("  NOTIFY_EMAIL=admin-hr@gmail.com")
        sys.exit(1)

    target = sys.argv[1] if len(sys.argv) > 1 else (config["notify_email"] or config["sender_email"])
    print(f"\nSending test admission workflow to test student address: {target}")
    
    result = notifications.send_admissions_notifications(
        name="John Doe (Test Applicant)",
        email=target,
        message="Program of interest: COHORT\nPreferred class format: In-person classes\n\nI want to apply for the full-stack web development program.",
        program="COHORT",
        class_mode="In-person classes"
    )

    print("\nResult:")
    print(f"  Student Confirmation Email: {'SUCCESS' if result['student_email'] else 'FAILED'}")
    print(f"  HR / Admin Notification:    {'SUCCESS' if result['admin_email'] else 'FAILED'}")
    if result["errors"]:
        print("\nErrors reported:")
        for err in result["errors"]:
            print(f"  - {err}")
    else:
        print("\n[OK] Both emails were generated and sent successfully!")

if __name__ == "__main__":
    main()
