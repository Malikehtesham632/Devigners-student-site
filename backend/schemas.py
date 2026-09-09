from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class ContactFormIn(BaseModel):
    name: str
    email: EmailStr
    message: str
    form_type: str = "contact"


class ContactFormOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    message: str
    form_type: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatHistoryItem(BaseModel):
    role: str
    content: str


class ChatIn(BaseModel):
    message: str
    history: list[ChatHistoryItem] = []


class ChatOut(BaseModel):
    reply: str
