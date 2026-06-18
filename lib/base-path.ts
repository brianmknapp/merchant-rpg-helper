export function normalizeBasePath(rawBasePath: string | null | undefined) {
  const trimmed = rawBasePath?.trim() ?? "";

  if (!trimmed || trimmed === "/") {
    return "";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/+$/, "");
}

