export function normalizeBasePath(rawBasePath: string | null | undefined) {
  const stripped = rawBasePath?.trim().replace(/^\/+|\/+$/g, "") ?? "";

  if (!stripped) {
    return "";
  }

  return `/${stripped}`;
}
