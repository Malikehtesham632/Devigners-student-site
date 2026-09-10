from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError

import models
import schemas
import auth
import notifications
import chat
import os
import urllib.error
import urllib.request
import json
from database import engine, get_db

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


def _send_to_google_sheet(name: str, email: str, program: str, class_mode: str) -> None:
    webhook_url = os.getenv("GOOGLE_SHEETS_WEBHOOK_URL", "").strip()
    webhook_secret = os.getenv("GOOGLE_SHEETS_WEBHOOK_SECRET", "").strip()
    if not webhook_url or not webhook_secret:
        raise RuntimeError("Google Sheets integration is not configured")

    payload = json.dumps({
        "secret": webhook_secret,
        "name": name,
        "email": email,
        "program": program,
        "class_mode": class_mode,
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


@app.post("/contact", response_model=schemas.ContactFormOut)
def submit_contact_form(form_data: schemas.ContactFormIn, db: Session = Depends(get_db)):
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
        program, class_mode = _parse_admission_details(form_data.message)
        try:
            _send_to_google_sheet(form_data.name, form_data.email, program, class_mode)
            notifications.send_admissions_notifications(
                form_data.name, form_data.email, form_data.message
            )
        except Exception as error:
            print(f"Admissions delivery failed: {error}")
            raise HTTPException(
                status_code=502,
                detail=(
                    "Your request was saved, but we could not complete the admissions notification. "
                    "Please try submitting again or contact Devigners directly."
                ),
            ) from error
    else:
        try:
            notifications.send_contact_notification(
                form_data.name, form_data.email, form_data.message, form_data.form_type
            )
        except Exception as error:
            print(f"Failed to send email notification: {error}")

    return submission


@app.post("/chat", response_model=schemas.ChatOut)
async def chat_with_ai(chat_data: schemas.ChatIn):
    history = [{"role": item.role, "content": item.content} for item in chat_data.history]
    reply = await chat.get_ai_reply(chat_data.message, history)
    return {"reply": reply}


@app.get("/")
def root():
    return {"status": "Devigners backend is running"}
