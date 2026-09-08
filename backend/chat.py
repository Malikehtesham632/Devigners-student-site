import os
import requests

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODEL = "nvidia/nemotron-3.5-lightning:free"

BUSINESS_CONTEXT = (
    "You are a helpful assistant embedded on the Nexus website, a business platform "
    "that helps teams automate workflows, unify data, and scale faster. "
    "Answer visitor questions about Nexus in a friendly, concise way, under 4 sentences. "
    "If you do not know something specific about pricing or features, suggest they use the contact form."
)


def get_ai_reply(user_message, conversation_history):
    if not OPENROUTER_API_KEY:
        return "Our chat assistant is not fully set up yet. Please use the contact form and we will get back to you."

    messages = [{"role": "system", "content": BUSINESS_CONTEXT}]
    messages += conversation_history
    messages.append({"role": "user", "content": user_message})

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": messages,
        "max_tokens": 300,
    }

    response = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=30)
    data = response.json()

    if "choices" not in data:
        print(f"OpenRouter API error (status {response.status_code}): {data}")
        return "Sorry, something went wrong. Please try again in a moment."

    return data["choices"][0]["message"]["content"]