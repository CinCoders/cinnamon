export type KeycloakPayload = {
  realm_access?: { roles?: string[] };
  email?: string;
  name?: string;
  preferred_username?: string;
};

export function jwtDecode(token: string): KeycloakPayload {
  // sem Buffer pra rodar no browser
  const base64 = token.split(".")[1];
  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
  return JSON.parse(json) as KeycloakPayload;
};
