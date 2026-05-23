import * as fsp from "fs/promises";
import * as path from "path";
import { Notice, Plugin, WorkspaceLeaf } from "obsidian";
import { externalizeLargeMessages, prepareRawMessage, readRawText, writeRawText } from "./core/raw-message-store";
import { clearLegacyChatWorkspaceDefaults, ensureKnowledgeBaseSession, getActiveApiProvider, normalizeSettingsData, providerConnectionLabel, type ChatMessage, type XiaoyuanSettings, type ResourceManagementTab } from "./settings/settings";
import { XiaoyuanAgentSettingTab } from "./settings/settings-tab";
import { confirmModal, requestUserInputModal } from "./ui/modals";
import { XiaoyuanView, VIEW_TYPE_XIAOYUAN } from "./ui/xiaoyuan-view";
import { OpenCodeBackend } from "./core/opencode-backend";
import { EditorActionController } from "./editor-actions/controller";
import { AGENTS_RULES_FILE, DEFAULT_KNOWLEDGE_BASE_RULES_FILE } from "./knowledge-base/constants";
import {
  collectKnowledgeBaseStorageStats,
  compactOldKnowledgeBaseProcessHistory,
  exportKnowledgeBaseHistory,
  migrateKnowledgeBaseHistory,
  persistAndCompactKnowledgeBaseHistory,
  readKnowledgeBaseHistoryDay,
  readKnowledgeBaseHistoryIndex,
  rebuildKnowledgeBaseHistoryIndex,
  type KnowledgeBaseHistoryIndex,
  type KnowledgeBaseStorageStats
} from "./knowledge-base/history-store";
import { KnowledgeBaseManager } from "./knowledge-base/manager";
import { isLintOnlyKnowledgeBaseReport, readKnowledgeBaseReportExcerpt } from "./knowledge-base/report";
import { ReviewManager } from "./review/manager";
import { ReviewPreviewView, VIEW_TYPE_REVIEW_PREVIEW } from "./review/preview-view";
import { isReviewHtmlPath } from "./review/schedule";
import type { AgentModelInfo, AgentProfileInfo } from "./agent/types";
import type { SkillSpec, McpServerStatus, RateLimitSnapshot } from "./types/app-server";

export interface OpenCodeStatusSnapshot {
  connected: boolean;
  accountLabel: string;
  serverUrl: string;
  models: AgentModelInfo[];
  agents: AgentProfileInfo[];
  skills: SkillSpec[];
  mcpServers: McpServerStatus[];
  rateLimits?: RateLimitSnapshot | null;
  rateLimitsByLimitId?: Record<string, RateLimitSnapshot | undefined> | null;
  errors: string[];
}

export default class XiaoyuanPlugin extends Plugin {
  settings!: XiaoyuanSettings;
  lastStatus: OpenCodeStatusSnapshot | null = null;
  openCode: any = null;
  private view: XiaoyuanView | null = null;
  private reviewPreviewView: ReviewPreviewView | null = null;
  private editorActions: EditorActionController | null = null;
  private knowledgeBase: KnowledgeBaseManager | null = null;
  private review: ReviewManager | null = null;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private saveQueue: Promise<void> = Promise.resolve();
  private rawWrites = new Set<Promise<void>>();

  async onload(): Promise<void> {
    await this.loadSettings();

    this.registerView(VIEW_TYPE_XIAOYUAN, (leaf: WorkspaceLeaf) => {
      this.view = new XiaoyuanView(leaf, this);
      return this.view;
    });
    this.registerView(VIEW_TYPE_REVIEW_PREVIEW, (leaf: WorkspaceLeaf) => {
      this.reviewPreviewView = new ReviewPreviewView(leaf, this);
      return this.reviewPreviewView;
    });

    this.addRibbonIcon("bot", "打开 小元 侧栏", () => {
      void this.activateView();
    });

    this.addCommand({
      id: "open-xiaoyuan-sidebar",
      name: "打开 小元 侧栏",
      callback: () => void this.activateView()
    });

    this.addCommand({
      id: "new-xiaoyuan-chat",
      name: "新建 小元 会话",
      callback: async () => {
        await this.activateView();
        new Notice("已打开 小元，可点击 + 新建会话");
      }
    });

    this.addCommand({
      id: "editor-action-rewrite",
      name: "改写选中文字",
      editorCallback: (editor, view) => void this.editorActions?.runEditorActionById(editor, view, "rewrite")
    });

    this.addCommand({
      id: "editor-action-expand",
      name: "扩写选中文字",
      editorCallback: (editor, view) => void this.editorActions?.runEditorActionById(editor, view, "expand")
    });

    this.addCommand({
      id: "editor-action-continue",
      name: "续写选中文字",
      editorCallback: (editor, view) => void this.editorActions?.runEditorActionById(editor, view, "continue")
    });

    this.addCommand({
      id: "editor-action-translate",
      name: "翻译选中文字为英文",
      editorCallback: (editor, view) => void this.editorActions?.runEditorActionById(editor, view, "translate")
    });

    this.addSettingTab(new XiaoyuanAgentSettingTab(this));
    this.editorActions = new EditorActionController(this);
    this.editorActions.register();
    this.knowledgeBase = new KnowledgeBaseManager(this);
    this.knowledgeBase.register();
    this.review = new ReviewManager(this);
    this.review.register();

    if (this.settings.autoOpen) {
      this.app.workspace.onLayoutReady(() => void this.activateView());
    }
    if (this.settings.editorActions.enabled) {
      this.app.workspace.onLayoutReady(() => {
        window.setTimeout(() => void this.ensureOpenCodeConnected(false, { silent: true }), 800);
      });
    }
  }

  async onunload(): Promise<void> {
    this.editorActions?.cancelActiveCandidate("canceled", false);
    this.knowledgeBase?.unload();
    this.review?.unload();
    await this.saveSettings(true);
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_XIAOYUAN);
  }

  async activateView(): Promise<void> {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_XIAOYUAN);
    let leaf = leaves[0];
    if (!leaf) {
      const rightLeaf = this.app.workspace.getRightLeaf(false);
      if (!rightLeaf) throw new Error("无法创建 小元 右侧栏");
      leaf = rightLeaf;
      await leaf.setViewState({ type: VIEW_TYPE_XIAOYUAN, active: true });
    }
    await this.app.workspace.revealLeaf(leaf);
    this.view?.focusInput();
  }

  async activateKnowledgeBaseChannel(): Promise<void> {
    const session = ensureKnowledgeBaseSession(this.settings, this.getVaultPath());
    this.settings.activeSessionId = session.id;
    await this.saveSettings(true);
    await this.activateView();
    this.view?.refreshActiveSession();
  }

  applyComposerDefaultsToView(): void {
    this.view?.applySavedComposerDefaults();
  }

  getXiaoyuanView(): XiaoyuanView | null {
    return this.view;
  }

  async openWorkspaceResourceSettings(tab: ResourceManagementTab = "plugins"): Promise<void> {
    this.settings.settingsTab = "resources";
    this.settings.resourceManagementTab = tab;
    await this.saveSettings(true);
    const setting = (this.app as any).setting;
    if (!setting?.open || !setting?.openTabById) {
      new Notice("无法打开插件设置页");
      return;
    }
    setting.open();
    setting.openTabById(this.manifest.id);
  }

  async ensureOpenCodeConnected(force = false, options: { silent?: boolean } = {}): Promise<OpenCodeStatusSnapshot> {
    if (this.lastStatus?.connected && !force) return this.lastStatus;

    // 根据模式设置初始账户标签
    let initialAccountLabel: string;
    if (this.settings.assistantMode === "custom-api") {
      const activeProvider = getActiveApiProvider(this.settings);
      if (activeProvider) {
        initialAccountLabel = this.settings.settingsLanguage === "en" 
          ? `Custom API: ${activeProvider.name}` 
          : `自定义 API：${activeProvider.name}`;
      } else {
        initialAccountLabel = this.settings.settingsLanguage === "en" ? "No API provider" : "未配置 API";
      }
    } else {
      initialAccountLabel = this.settings.settingsLanguage === "en" ? "Disconnected" : "未连接";
    }

    this.lastStatus = {
      connected: false,
      accountLabel: initialAccountLabel,
      serverUrl: "",
      models: [],
      agents: [],
      skills: [],
      mcpServers: [],
      errors: []
    };

    const backend = new OpenCodeBackend({
      ...this.settings.opencode,
      vaultPath: this.getVaultPath()
    });

    try {
      await backend.connect();
      const [models, agents] = await Promise.all([
        backend.listModels(),
        backend.listAgents()
      ]);
      const info = backend.getConnectionInfo();
      
      // 根据模式设置正确的账户标签
      let successAccountLabel: string;
      if (this.settings.assistantMode === "custom-api") {
        const activeProvider = getActiveApiProvider(this.settings);
        if (activeProvider) {
          successAccountLabel = this.settings.settingsLanguage === "en" 
            ? `Custom API: ${activeProvider.name}` 
            : `自定义 API：${activeProvider.name}`;
        } else {
          successAccountLabel = this.settings.settingsLanguage === "en" ? "No API provider" : "未配置 API";
        }
      } else if (this.settings.assistantMode === "hybrid") {
        const activeProvider = getActiveApiProvider(this.settings);
        const openCodeLabel = this.settings.settingsLanguage === "en" ? "OpenCode" : "OpenCode";
        if (activeProvider) {
          const apiLabel = this.settings.settingsLanguage === "en" 
            ? `Custom API: ${activeProvider.name}` 
            : `自定义 API：${activeProvider.name}`;
          successAccountLabel = this.settings.settingsLanguage === "en" 
            ? `${apiLabel} + ${openCodeLabel}` 
            : `${apiLabel} + ${openCodeLabel}`;
        } else {
          successAccountLabel = openCodeLabel;
        }
      } else { // opencode mode
        successAccountLabel = this.settings.settingsLanguage === "en" ? "OpenCode" : "OpenCode";
      }

      this.lastStatus = {
        connected: true,
        accountLabel: successAccountLabel,
        serverUrl: info.serverUrl,
        models,
        agents,
        skills: [],
        mcpServers: [],
        errors: []
      };
      this.settings.opencode.lastConnectedAt = Date.now();
      this.settings.opencode.lastError = "";
      await this.saveSettings(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.lastStatus.errors = [message];
      this.settings.opencode.lastError = message;
      await this.saveSettings(true);
      if (!options.silent) {
        new Notice(this.settings.settingsLanguage === "en" ? `OpenCode connection failed: ${message}` : `OpenCode 连接失败：${message}`);
      }
    } finally {
      await backend.disconnect();
    }

    return this.lastStatus;
  }

  getVaultPath(): string {
    const adapter = this.app.vault.adapter as any;
    return adapter.basePath || adapter.path || "";
  }

  getPluginDataDirName(): string {
    const dir = (this.manifest as any).dir;
    return typeof dir === "string" && dir.trim() ? dir : this.manifest.id;
  }

  async loadSettings(): Promise<void> {
    const data = (await this.loadData()) ?? {};
    const previousVersion = typeof data?.settingsVersion === "number" ? data.settingsVersion : 0;
    const normalized = normalizeSettingsData(data);
    this.settings = normalized.settings;
    const sessionCountBefore = this.settings.sessions.length;
    const knowledgeSessionBefore = this.settings.knowledgeBase.sessionId;
    const knowledgeRulesMigrated = await this.applyKnowledgeBaseRulesFileDefault(data);
    ensureKnowledgeBaseSession(this.settings, this.getVaultPath());
    const legacyChatWorkspacesCleared = clearLegacyChatWorkspaceDefaults(this.settings, this.getVaultPath(), previousVersion);
    const knowledgeStatusRecovered = await this.recoverKnowledgeBaseLintStatus();
    let rawMigrated = 0;
    let historyMigrated = false;
    try {
      rawMigrated = await externalizeLargeMessages(this.getVaultPath(), this.settings, this.getPluginDataDirName());
    } catch (error) {
      console.error("OpenCode raw message migration failed", error);
    }
    try {
      historyMigrated = (await migrateKnowledgeBaseHistory(this.getVaultPath(), this.getPluginDataDirName(), this.settings)).changed;
    } catch (error) {
      console.error("OpenCode knowledge history migration failed", error);
    }
    const knowledgeSessionChanged = sessionCountBefore !== this.settings.sessions.length || knowledgeSessionBefore !== this.settings.knowledgeBase.sessionId;
    if (normalized.changed || rawMigrated > 0 || historyMigrated || legacyChatWorkspacesCleared > 0 || knowledgeSessionChanged || knowledgeStatusRecovered || knowledgeRulesMigrated) await this.saveSettings(true);
  }

  private async applyKnowledgeBaseRulesFileDefault(data: any): Promise<boolean> {
    const rawSettings = data?.knowledgeBase;
    const hasExplicitRules = rawSettings
      && (typeof rawSettings.useCustomRulesFile === "boolean" || typeof rawSettings.rulesFilePath === "string");
    if (hasExplicitRules) return false;

    const vaultPath = this.getVaultPath();
    const agentsPath = path.join(vaultPath, AGENTS_RULES_FILE);
    const llmWikiPath = path.join(vaultPath, DEFAULT_KNOWLEDGE_BASE_RULES_FILE);
    const [agents, llmWiki] = await Promise.all([
      fsp.readFile(agentsPath, "utf8").catch(() => ""),
      fsp.readFile(llmWikiPath, "utf8").catch(() => "")
    ]);
    if (!agents || !llmWiki) return false;
    const agentsLooksLikeMemorySkill = /opencode-memory|OPENCODE-MEMORY|项目级上下文管理/.test(agents);
    const llmWikiLooksLikeKnowledgeRules = /知识库|Raw Sources|Ingest|Lint|Wiki/.test(llmWiki);
    if (!agentsLooksLikeMemorySkill || !llmWikiLooksLikeKnowledgeRules) return false;

    this.settings.knowledgeBase.useCustomRulesFile = true;
    this.settings.knowledgeBase.rulesFilePath = DEFAULT_KNOWLEDGE_BASE_RULES_FILE;
    return true;
  }

  async saveSettings(force = false): Promise<void> {
    if (force) {
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
        this.saveTimer = null;
      }
      await this.flushSettingsSave();
      return;
    }
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      void this.flushSettingsSave();
    }, 750);
  }

  async externalizeMessageText(message: ChatMessage, fullText: string): Promise<void> {
    const write = prepareRawMessage(message, fullText);
    if (!write) return;
    let tracked: Promise<void>;
    tracked = writeRawText(this.getVaultPath(), write.rawRef, write.text, this.getPluginDataDirName())
      .catch((error) => {
        console.error("OpenCode raw message write failed", error);
        if (message.rawRef === write.rawRef) {
          message.text = fullText;
          delete message.previewText;
          delete message.rawRef;
          delete message.rawSize;
          delete message.rawLines;
          delete message.rawTruncatedForPreview;
        }
      })
      .finally(() => this.rawWrites.delete(tracked));
    this.rawWrites.add(tracked);
    await tracked;
  }

  async readRawMessageText(rawRef: string): Promise<string> {
    return readRawText(this.getVaultPath(), rawRef, this.getPluginDataDirName());
  }

  async readKnowledgeBaseHistoryIndex(): Promise<KnowledgeBaseHistoryIndex> {
    return readKnowledgeBaseHistoryIndex(this.getVaultPath(), this.getPluginDataDirName());
  }

  async readKnowledgeBaseHistoryDay(sessionId: string, date: string): Promise<ChatMessage[]> {
    return readKnowledgeBaseHistoryDay(this.getVaultPath(), this.getPluginDataDirName(), sessionId, date);
  }

  async rebuildKnowledgeBaseHistoryIndex(): Promise<KnowledgeBaseHistoryIndex> {
    return rebuildKnowledgeBaseHistoryIndex(this.getVaultPath(), this.getPluginDataDirName());
  }

  async getKnowledgeBaseStorageStats(): Promise<KnowledgeBaseStorageStats> {
    return collectKnowledgeBaseStorageStats(this.getVaultPath(), this.getPluginDataDirName());
  }

  async exportKnowledgeBaseHistory(): Promise<string> {
    return exportKnowledgeBaseHistory(this.getVaultPath(), this.getPluginDataDirName());
  }

  async compactOldKnowledgeBaseProcessHistory(): Promise<number> {
    return compactOldKnowledgeBaseProcessHistory(this.getVaultPath(), this.getPluginDataDirName());
  }

  getKnowledgeBaseManager(): KnowledgeBaseManager | null {
    return this.knowledgeBase;
  }

  getReviewManager(): ReviewManager | null {
    return this.review;
  }

  async openReviewHtmlPreview(relativePath: string): Promise<void> {
    const normalized = relativePath.replace(/\\/g, "/");
    if (!isReviewHtmlPath(normalized, this.settings.review.outputDir)) {
      new Notice("只能打开 小元 生成的复盘 HTML");
      return;
    }
    let leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_REVIEW_PREVIEW)[0];
    if (!leaf) {
      const rightLeaf = this.app.workspace.getRightLeaf(false);
      if (!rightLeaf) throw new Error("无法创建复盘预览页");
      leaf = rightLeaf;
      await leaf.setViewState({ type: VIEW_TYPE_REVIEW_PREVIEW, active: true });
    }
    await this.app.workspace.revealLeaf(leaf);
    await this.reviewPreviewView?.openHtml(normalized);
  }

  private async recoverKnowledgeBaseLintStatus(): Promise<boolean> {
    const settings = this.settings.knowledgeBase;
    if (settings.lastRunStatus !== "failed" || !settings.lastReportPath) return false;
    const report = await readKnowledgeBaseReportExcerpt(this.getVaultPath(), settings.lastReportPath, 2000);
    if (!report || !isLintOnlyKnowledgeBaseReport(report)) return false;
    settings.lastRunStatus = "success";
    settings.lastError = "";
    settings.lastSummary = `体检报告已生成。上次 OpenCode 返回失败状态，但 lint-only 报告文件存在，已恢复为成功。\n\n${report}`.slice(0, 1000);
    return true;
  }

  private handleOpenCodeNotification(notification: any): void {
    this.view?.handleOpenCodeNotification(notification);
  }

  async ensureSkillsLoaded(): Promise<void> {
    // Skills are loaded as part of ensureOpenCodeConnected
    if (!this.lastStatus) await this.ensureOpenCodeConnected();
  }

  private async flushSettingsSave(): Promise<void> {
    const run = this.saveQueue.then(async () => {
      await this.flushRawWrites();
      await this.flushKnowledgeBaseHistory();
      await this.saveData(this.settings);
    });
    this.saveQueue = run.catch(() => undefined);
    await run;
  }

  private async flushRawWrites(): Promise<void> {
    const pending = Array.from(this.rawWrites);
    if (pending.length) await Promise.allSettled(pending);
  }

  private async flushKnowledgeBaseHistory(): Promise<void> {
    try {
      await persistAndCompactKnowledgeBaseHistory(this.getVaultPath(), this.getPluginDataDirName(), this.settings);
    } catch (error) {
      console.error("OpenCode knowledge history save failed", error);
    }
  }
}
