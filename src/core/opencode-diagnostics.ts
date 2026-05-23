export interface OpenCodeErrorDiagnostic {
  kind: string;
  text: string;
  title?: string;
}

export function diagnoseOpenCodeError(error: unknown, options?: { language?: string; model?: string; providerLabel?: string; proxyEnabled?: boolean; proxyUrl?: string }): OpenCodeErrorDiagnostic {
  const message = error instanceof Error ? error.message : String(error);
  let kind = "unknown";
  if (/timeout/i.test(message)) kind = "timeout";
  else if (/ENOENT|not found/i.test(message)) kind = "missing-cli";
  else if (/app-server/i.test(message)) kind = "app-server";
  return { kind, text: message };
}
