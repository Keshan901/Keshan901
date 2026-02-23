export type Role = "ADMIN" | "EDITOR" | "VIEWER";

export function canManageUsers(role: Role): boolean {
  return role === "ADMIN";
}

export function canManageSettings(role: Role): boolean {
  return role === "ADMIN";
}

export function canManageApis(role: Role): boolean {
  return role === "ADMIN";
}

export function canEditHashtags(role: Role): boolean {
  return role === "ADMIN" || role === "EDITOR";
}
