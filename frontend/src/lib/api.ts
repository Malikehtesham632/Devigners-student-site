const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://nexus-brand-production.up.railway.app').replace(/\/$/, '');

async function parseResponse(response: Response, fallback: string) {
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json().catch(() => null) : null;
  if (!response.ok) throw new Error(data?.detail || fallback);
  if (data === null) throw new Error(fallback);
  return data;
}

export async function signup(name: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return parseResponse(response, 'Unable to create your account. Please try again.');
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return parseResponse(response, 'Unable to sign in. Please check your details.');
}

export async function getMe(token: string) {
  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseResponse(response, 'Your session has expired.');
}

export type ChatHistoryItem = { role: 'user' | 'assistant'; content: string };

export async function sendChatMessage(message: string, history: ChatHistoryItem[]) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  return parseResponse(response, 'Chat is temporarily unavailable.');
}

export async function submitContactForm(name: string, email: string, message: string, formType = 'contact') {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message, form_type: formType }),
  });
  return parseResponse(response, 'We could not send your message. Please try again.');
}
