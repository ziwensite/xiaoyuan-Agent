export interface OpenCodeLaunchConfig {
  args: string[];
  env: Record<string, string>;
}

export function buildOpenCodeLaunchConfig(config: {
  proxyEnabled?: boolean;
  proxyUrl?: string;
  providerMode?: string;
  activeApiProvider?: { id: string; name: string; baseUrl: string; model: string; models: string[]; apiKey: string; queryParams?: Record<string, string> };
}): OpenCodeLaunchConfig {
  const provider = config.activeApiProvider;
  const envKey = provider ? `OBSIDIAN_OPENCODE_API_KEY_${(provider.id ?? "").toUpperCase()}` : "";
  const args = ["app-server", "--listen", "stdio://"];
  if (provider) {
    args.push(`model_provider="${provider.id}"`);
    args.push(`model="${provider.model}"`);
    args.push(`model_providers.${provider.id}.base_url="${provider.baseUrl}"`);
    args.push(`model_providers.${provider.id}.wire_api="responses"`);
    args.push(`model_providers.${provider.id}.env_key="${envKey}"`);
    if (provider.queryParams) {
      for (const [key, value] of Object.entries(provider.queryParams)) {
        args.push(`model_providers.${provider.id}.query_params.${key}="${value}"`);
      }
    }
  }
  return { args, env: { [envKey]: provider?.apiKey ?? "" } };
}

export function resolveOpenCodeCommand(path: string, options?: { home?: string; envPath?: string; platform?: string; appData?: string; exists?: (candidate: string) => boolean }): string {
  if (path) {
    const resolved = path.replace(/^~/, options?.home || "");
    if (options?.exists?.(resolved)) return resolved;
    throw new Error("找不到 OpenCode CLI");
  }
  const candidates: string[] = [];
  if (options?.platform === "win32" && options?.appData) {
    candidates.push(`${options.appData}\\npm\\opencode.cmd`);
  }
  if (options?.home) {
    candidates.push(`${options.home}/bin/opencode`);
    candidates.push(`${options.home}/.npm-packages/bin/opencode`);
    candidates.push(`${options.home}/.local/bin/opencode`);
  }
  if (options?.envPath) {
    for (const dir of options.envPath.split(":").concat(options.envPath.split(";"))) {
      if (dir.trim()) candidates.push(`${dir.trim()}/opencode`);
    }
  }
  candidates.push("/Applications/OpenCode.app/Contents/Resources/opencode");
  candidates.push("/usr/local/bin/opencode");
  for (const candidate of candidates) {
    if (options?.exists?.(candidate)) return candidate;
  }
  throw new Error("找不到 OpenCode CLI");
}
