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
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nexus Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nexus-brand-frontened.vercel.app",
        "https://nexus-brand-oall.vercel.app",
        "https://nexus-brand-git-master-devigners1.vercel.app",
        "https://nexus-brand-o2zhzb7kd-devigners1.vercel.app",
    ],
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

    try:
        notifications.send_contact_notification(
            form_data.name, form_data.email, form_data.message, form_data.form_type
        )
    except Exception as error:
        print(f"Failed to send email notification: {error}")

    return submission


@app.post("/chat", response_model=schemas.ChatOut)
def chat_with_ai(chat_data: schemas.ChatIn):
    history = [{"role": item.role, "content": item.content} for item in chat_data.history]
    reply = chat.get_ai_reply(chat_data.message, history)
    return {"reply": reply}


@app.get("/")
def root():
    return {"status": "Nexus backend is running"}