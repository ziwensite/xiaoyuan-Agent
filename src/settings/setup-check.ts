import type { CodexForObsidianSettings, SetupSettings } from "./settings";
import type { CodexStatusSnapshot } from "../types/app-server";

export type SetupCheckStatus = "ok" | "warning" | "blocking";
export type SetupRequirementId = "opencode-cli" | "opencode-server" | "opencode-models" | "opencode-agent";
export type SetupActionKind = "copy-command" | "open-url";

export interface SetupPlatform {
  os: string;
  openCodeCommand: string | null;
}

export interface SetupAction {
  kind: SetupActionKind;
  label: string;
  value: string;
}

export interface SetupRequirement {
  id: SetupRequirementId;
  status: SetupCheckStatus;
  title: string;
  message: string;
  actions: SetupAction[];
}

export interface SetupCheckResult {
  status: SetupCheckStatus;
  canStart: boolean;
  blockingCount: number;
  warningCount: number;
  requirements: SetupRequirement[];
}

export const OPENCODE_DOCS_URL = "https://opencode.ai/docs";

export function buildSetupCheck(
  settings: CodexForObsidianSettings,
  lastStatus: CodexStatusSnapshot | null,
  platform: SetupPlatform
): SetupCheckResult {
  const requirements: SetupRequirement[] = [];
  const openCodeInstalled = Boolean(platform.openCodeCommand);

  requirements.push({
    id: "opencode-cli",
    status: openCodeInstalled ? "ok" : "blocking",
    title: openCodeInstalled ? "OpenCode 已安装" : "缺少 OpenCode",
    message: openCodeInstalled
      ? `已检测到：${platform.openCodeCommand}`
      : "小元 助理需要本机 OpenCode runtime。",
    actions: openCodeInstalled ? [] : openCodeInstallActions(platform.os)
  });

  const serverReady = openCodeInstalled && settings.opencode.lastConnectedAt > 0 && !settings.opencode.lastError;
  requirements.push({
    id: "opencode-server",
    status: serverReady ? "ok" : "blocking",
    title: serverReady ? "OpenCode server 可用" : "OpenCode server 未验证",
    message: serverReady
      ? `最近连接：${formatSetupTime(settings.opencode.lastConnectedAt)}`
      : settings.opencode.lastError || "点击重新检测后，插件会尝试连接或启动 opencode serve。",
    actions: openCodeInstalled ? [{ kind: "open-url", label: "OpenCode 文档", value: OPENCODE_DOCS_URL }] : []
  });

  const modelReady = serverReady && Boolean(settings.opencode.providerId && settings.opencode.modelId);
  requirements.push({
    id: "opencode-models",
    status: modelReady ? "ok" : "blocking",
    title: modelReady ? "OpenCode 模型已选择" : "OpenCode 模型未读取",
    message: modelReady
      ? `${settings.opencode.providerId}/${settings.opencode.modelId}`
      : "重新检测会读取 OpenCode 模型列表；读取成功后选择可用模型。",
    actions: []
  });

  requirements.push({
    id: "opencode-agent",
    status: serverReady && settings.opencode.agent.trim() ? "ok" : "warning",
    title: serverReady && settings.opencode.agent.trim() ? "OpenCode Agent 已选择" : "OpenCode Agent 未确认",
    message: serverReady && settings.opencode.agent.trim()
      ? settings.opencode.agent
      : "未确认 Agent 时默认使用 build；建议重新检测后从列表选择。",
    actions: []
  });

  const blockingCount = requirements.filter((item) => item.status === "blocking").length;
  const warningCount = requirements.filter((item) => item.status === "warning").length;
  return {
    status: blockingCount ? "blocking" : warningCount ? "warning" : "ok",
    canStart: blockingCount === 0,
    blockingCount,
    warningCount,
    requirements
  };
}

export function completeSetupState(setup: SetupSettings, completedAt: number, version = ""): SetupSettings {
  return {
    ...setup,
    completedAt,
    lastCheckedAt: setup.lastCheckedAt || completedAt,
    dismissedVersion: version
  };
}

function openCodeInstallActions(os: string): SetupAction[] {
  if (os === "win32") {
    return [
      { kind: "copy-command", label: "复制 npm 命令", value: "npm install -g opencode-ai" },
      { kind: "open-url", label: "打开 OpenCode 文档", value: OPENCODE_DOCS_URL }
    ];
  }
  if (os === "darwin") {
    return [
      { kind: "copy-command", label: "复制 npm 命令", value: "npm install -g opencode-ai" },
      { kind: "copy-command", label: "复制安装脚本", value: "curl -fsSL https://opencode.ai/install | bash" },
      { kind: "copy-command", label: "复制 Homebrew 命令", value: "brew install anomalyco/tap/opencode" },
      { kind: "open-url", label: "打开 OpenCode 文档", value: OPENCODE_DOCS_URL }
    ];
  }
  return [
    { kind: "copy-command", label: "复制 npm 命令", value: "npm install -g opencode-ai" },
    { kind: "copy-command", label: "复制安装脚本", value: "curl -fsSL https://opencode.ai/install | bash" },
    { kind: "open-url", label: "打开 OpenCode 文档", value: OPENCODE_DOCS_URL }
  ];
}

function formatSetupTime(value: number): string {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}
