
const GUID_REGEX = /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/;
export function stripBraces(id: string): string {
  return id.trim().replace(/^{|}$/g, "");
}

export function isGuid(id: string): boolean {
  return GUID_REGEX.test(id);
}

export function normalizeGuid(id: string): string {
  const stripped = stripBraces(id);
  if (!isGuid(stripped)) {
    throw new Error(`Invalid GUID format: "${id}". Expected 8-4-4-4-12 hex pattern.`);
  }
  return stripped.toLowerCase();
}

