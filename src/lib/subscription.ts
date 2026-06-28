export function isProUser(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("asp_pro") === "true";
}

export function setProUser(value: boolean) {
  if (typeof window === "undefined") return;
  if (value) {
    localStorage.setItem("asp_pro", "true");
  } else {
    localStorage.removeItem("asp_pro");
  }
}
