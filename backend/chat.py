import os

import httpx

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent"

BUSINESS_CONTEXT = (
    "You are a helpful assistant embedded on the Devigners Learning Institute website. "
    "Devigners is an IT learning institute with two core programs: CUBE, for students "
    "who are new to computers and need fundamentals, and COHORT, an advanced full-stack "
    "development program for students who already have solid computer knowledge. "
    "Answer questions about Devigners, CUBE, COHORT, admissions, and learning in a friendly, "
    "concise way, under 4 sentences. Do not invent fees, schedules, certificates, or guarantees. "
    "If the visitor asks for information you do not know, suggest the admissions contact form."
)

# Avoid sending an unnecessarily large conversation on every request.
MAX_HISTORY_ITEMS = 8


async def get_ai_reply(user_message: str, conversation_history: list[dict]) -> str:
    if not GEMINI_API_KEY:
        return "Our chat assistant is not fully set up yet. Please use the contact form and we will get back to you."

    recent_history = conversation_history[-MAX_HISTORY_ITEMS:]
    contents = []
    for item in recent_history:
        role = "model" if item["role"] == "assistant" else "user"
        contents.append({"role": role, "parts": [{"text": item["content"]}]})
    contents.append({"role": "user", "parts": [{"text": user_message}]})

    payload = {
        "system_instruction": {"parts": [{"text": BUSINESS_CONTEXT}]},
        "contents": contents,
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                f"{GEMINI_URL}?key={GEMINI_API_KEY}",
                json=payload,
            )
    except httpx.RequestError as error:
        print(f"Gemini API request failed: {error}")
        return "Sorry, our chat assistant is temporarily unavailable. Please try again shortly."

    try:
        data = response.json()
    except ValueError:
        print(
            f"Gemini API returned non-JSON (status {response.status_code}): "
            f"{response.text[:300]}"
        )
        return "Sorry, something went wrong. Please try again in a moment."

    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError):
        print(f"Gemini API unexpected response shape (status {response.status_code}): {data}")
        return "Sorry, I couldn't generate a response to that. Could you try rephrasing your question?"
