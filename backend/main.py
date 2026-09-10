import json
import os
import urllib.error
import urllib.request
from pathlib import Path
from typing import Optional

from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

# Load environment variables from .env if present
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

import auth
import chat
from database import engine, get_db
import models
import notifications
import schemas

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Devigners Learning Institute API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://devigners.net",
        "https://www.devigners.net",
        "https://nexus-brand-frontened.vercel.app",
        "https://nexus-brand-oall.vercel.app",
        "https://nexus-brand-git-master-devigners1.vercel.app",
        "https://nexus-brand-o2zhzb7kd-devigners1.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https://[a-zA-Z0-9-]+\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = auth.decode_access_token(token)
        email = payload.get("sub")
        if email is None:
            raise credentials_error
    except JWTError:
        raise credentials_error

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_error
    return user


@app.post("/signup", response_model=schemas.UserOut)
def signup(user_data: schemas.UserSignup, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=auth.hash_password(user_data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login", response_model=schemas.Token)
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not auth.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = auth.create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


def _send_to_google_sheet(name: str, email: str, program: str, class_mode: str, message: str) -> None:
    webhook_url = os.getenv("GOOGLE_SHEETS_WEBHOOK_URL", "").strip()
    webhook_secret = os.getenv("GOOGLE_SHEETS_WEBHOOK_SECRET", "").strip()
    notify_email = os.getenv("NOTIFY_EMAIL", "").strip()

    if not webhook_url or not webhook_secret:
        raise RuntimeError("Google Sheets integration is not configured")
    if not notify_email:
        raise RuntimeError("NOTIFY_EMAIL is required for admissions notifications")

    payload = json.dumps({
        "secret": webhook_secret,
        "name": name,
        "email": email,
        "program": program,
        "class_mode": class_mode,
        "message": message,
        "notify_email": notify_email,
    }).encode("utf-8")
    request = urllib.request.Request(
        webhook_url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            body = response.read().decode("utf-8")
            if response.status < 200 or response.status >= 300:
                raise RuntimeError(f"Google Sheets returned HTTP {response.status}")
            result = json.loads(body) if body else {}
            if result.get("ok") is not True:
                raise RuntimeError(result.get("error", "Google Sheets rejected the submission"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as error:
        raise RuntimeError(f"Google Sheets request failed: {error}") from error


def _parse_admission_details(message: str) -> tuple[str, str]:
    program = ""
    class_mode = ""
    for line in message.splitlines():
        if line.lower().startswith("program of interest:"):
            program = line.split(":", 1)[1].strip()
        elif line.lower().startswith("preferred class format:"):
            class_mode = line.split(":", 1)[1].strip()
    return program, class_mode


def _process_admission_submission(name: str, email: str, message: str) -> None:
    """Run the complete admissions workflow: Send student confirmation email,

    send HR alert email, and append to Google Sheets if configured.
    """
    program, class_mode = _parse_admission_details(message)

    # 1. Send direct email notifications (Student confirmation + HR notification)
    try:
        status_report = notifications.send_admissions_notifications(
            name=name,
            email=email,
            message=message,
            program=program,
            class_mode=class_mode,
        )
        print(f"[Admissions Workflow] Email dispatch status for {email}: {status_report}")
    except Exception as error:
        print(f"[Admissions Workflow] Error dispatching emails for {email}: {error}")

    # 2. Append to Google Sheets if webhook is configured
    try:
        _send_to_google_sheet(name, email, program, class_mode, message)
        print(f"[Admissions Workflow] Saved to Google Sheet: {email}")
    except Exception as error:
        print(f"[Admissions Workflow] Google Sheets notice: {error}")


@app.post("/contact", response_model=schemas.ContactFormOut)
def submit_contact_form(
    form_data: schemas.ContactFormIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    submission = models.ContactSubmission(
        name=form_data.name,
        email=form_data.email,
        message=form_data.message,
        form_type=form_data.form_type,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    if form_data.form_type == "admissions":
        background_tasks.add_task(
            _process_admission_submission,
            form_data.name,
            form_data.email,
            form_data.message,
        )
    else:
        try:
            notifications.send_contact_notification(
                form_data.name, form_data.email, form_data.message, form_data.form_type
            )
        except Exception as error:
            print(f"[Contact] Failed to send email notification: {error}")

    return submission


@app.post("/chat", response_model=schemas.ChatOut)
async def chat_with_ai(chat_data: schemas.ChatIn):
    history = [{"role": item.role, "content": item.content} for item in chat_data.history]
    reply = await chat.get_ai_reply(chat_data.message, history)
    return {"reply": reply}


@app.get("/health")
def health_check():
    config = notifications.get_email_config()
    sheets_url = os.getenv("GOOGLE_SHEETS_WEBHOOK_URL", "").strip()
    sheets_secret = os.getenv("GOOGLE_SHEETS_WEBHOOK_SECRET", "").strip()

    return {
        "status": "healthy",
        "email_service": {
            "configured": bool(config["sender_email"] and config["sender_password"]),
            "sender_email": config["sender_email"] if config["sender_email"] else "not set",
            "notify_email": config["notify_email"] if config["notify_email"] else "not set",
            "smtp_server": config["smtp_server"],
            "smtp_port": config["smtp_port"],
        },
        "google_sheets": {
            "configured": bool(sheets_url and sheets_secret),
        },
    }


@app.post("/test-email")
def test_email(email_to: Optional[str] = None):
    """Diagnostic endpoint to send a test admission workflow email."""
    config = notifications.get_email_config()
    target = email_to or config["notify_email"] or config["sender_email"]
    if not target:
        raise HTTPException(
            status_code=400,
            detail="No recipient specified and neither NOTIFY_EMAIL nor SENDER_EMAIL is set.",
        )

    result = notifications.send_admissions_notifications(
        name="Test Student",
        email=target,
        message="Program of interest: CUBE\nPreferred class format: Online classes\n\nThis is a test submission from /test-email.",
        program="CUBE",
        class_mode="Online classes",
    )

    return {
        "status": "Test execution finished",
        "recipient": target,
        "results": result,
    }


@app.get("/")
def root():
    return {"status": "Devigners backend is running"}
