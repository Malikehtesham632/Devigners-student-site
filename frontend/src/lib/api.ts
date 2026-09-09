const API_BASE_URL = 'https://nexus-brand-production.up.railway.app';

export async function signup(name: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Signup failed');
  }

  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  return response.json();
}

export async function getMe(token: string) {
  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Not authenticated');
  }

  return response.json();
}

export type Wallet = {
  id: number;
  user_id: number;
  balance: number;
  currency: string;
  created_at: string;
  updated_at?: string | null;
};

export async function getWallet(token: string): Promise<Wallet> {
  const response = await fetch(`${API_BASE_URL}/wallet`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Unable to load wallet');
  }

  return response.json();
}

export type ChatHistoryItem = { role: string; content: string };

export async function sendChatMessage(message: string, history: ChatHistoryItem[]) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    throw new Error('Chat request failed');
  }

  return response.json();
}

export async function submitContactForm(name: string, email: string, message: string, formType: string) {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message, form_type: formType }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Submission failed');
  }

  return response.json();
}
