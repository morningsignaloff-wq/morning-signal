const USERS_KEY = "asp_users";
const SESSION_COOKIE = "asp_session";

interface StoredUser {
  id: string;
  email: string;
  password: string;
}

export interface LocalSession {
  id: string;
  email: string;
}

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function setSessionCookie(userId: string) {
  document.cookie = `${SESSION_COOKIE}=${userId}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

export function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

export function signUp(email: string, password: string): { error?: string } {
  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    return { error: "Un compte existe déjà avec cet email" };
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    email,
    password,
  };

  saveUsers([...users, user]);
  setSessionCookie(user.id);
  return {};
}

export function signIn(email: string, password: string): { error?: string; user?: LocalSession } {
  const user = getUsers().find((u) => u.email === email);

  if (!user || user.password !== password) {
    return { error: "Email ou mot de passe incorrect" };
  }

  setSessionCookie(user.id);
  return { user: { id: user.id, email: user.email } };
}

export function signOut() {
  clearSessionCookie();
}

export function getSession(): LocalSession | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));

  if (!match) return null;

  const userId = match.split("=")[1];
  const user = getUsers().find((u) => u.id === userId);

  if (!user) return null;
  return { id: user.id, email: user.email };
}
