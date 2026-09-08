import os
import requests

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent"

BUSINESS_CONTEXT = (
    "You are a helpful assistant embedded on the Nexus website, a business platform "
    "that helps teams automate workflows, unify data, and scale faster. "
    "Answer visitor questions about Nexus in a friendly, concise way, under 4 sentences. "
    "If you do not know something specific about pricing or features, suggest they use the contact form."
)


def get_ai_reply(user_message, conversation_history):
    if not GEMINI_API_KEY:
        return "Our chat assistant is not fully set up yet. Please use the contact form and we will get back to you."

    contents = []
    for item in conversation_history:
        role = "model" if item["role"] == "assistant" else "user"
        contents.append({"role": role, "parts": [{"text": item["content"]}]})
    contents.append({"role": "user", "parts": [{"text": user_message}]})

    payload = {
        "system_instruction": {"parts": [{"text": BUSINESS_CONTEXT}]},
        "contents": contents,
    }

    response = requests.post(
        f"{GEMINI_URL}?key={GEMINI_API_KEY}",
        json=payload,
        timeout=30,
    )
    data = response.json()

    if "candidates" not in data:
        print(f"Gemini API error (status {response.status_code}): {data}")
        return "Sorry, something went wrong. Please try again in a moment."

    return data["candidates"][0]["content"]["parts"][0]["text"]