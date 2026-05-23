import { App, FuzzySuggestModal, Notice, PluginSettingTab, Setting, setIcon, TFile, type FuzzyMatch } from "obsidian";
import type XiaoyuanPlugin from "../main";
import { OpenCodeBackend } from "../core/opencode-backend";
import { detectOpenCodeCommand, type Provider } from "../core/opencode-models";
import type { AgentModelInfo, AgentProfileInfo } from "../agent/types";
import {
  errorsFromWorkspaceResourceCache,
  loadedTabsFromWorkspaceResourceCache,
  mergeWorkspaceResourceSnapshot,
  snapshotFromWorkspaceResourceCache,
  updateWorkspaceResourceCache,
  type WorkspaceResourceKind
} from "../core/workspace-resources";
import { filterWorkspaceResourceRows, type WorkspaceResourceSearchRow } from "../core/workspace-resource-filter";
import {
  DEFAULT_SETTINGS,
  ensureModelChoices,
  getActiveApiProvider,
  getApiProviderModels,
  getKnowledgeBaseRulesFileChoices,
  newId,
  openCodeAgentChoiceLabel,
  openCodeAgentChoiceValue,
  openCodeAgentModeLabel,
  openCodeModelCapabilityLabel,
  openCodeModelChoiceLabel,
  openCodeModelChoiceValue,
  parseOpenCodeAgentChoiceValue,
  parseOpenCodeModelChoiceValue,
  providerModelLabel,
  providerConnectionLabel,
  removeApiProvider,
  normalizeReviewOutputDir,
  normalizeSettingsLanguage,
  resourceEnabled,
  validateApiProvider,
  type ApiProviderConfig,
  type AgentBackendMode,
  type EditorActionQualityMode,
  type EditorAiActionConfig,
  type EditorAiStyleConfig,
  type KnowledgeBaseBackendMode,
  type ReviewReportKind,
  type ResourceManagementTab,
  type SettingsLanguage,
  type SettingsTab
} from "./settings";
import type { PluginInfo, SkillSpec, McpServerStatus, PermissionMode, RateLimitSnapshot, ReasoningEffort, ServiceTierChoice, UiMode, WorkspaceResourceSnapshot } from "../types/app-server";
import type { OpenCodeStatusSnapshot } from "../main";
import { AGENTS_RULES_FILE, MEMORY_LITE_URL, DEFAULT_KNOWLEDGE_BASE_RULES_FILE } from "../knowledge-base/constants";
import { repairKnowledgeBaseRulesFile } from "../knowledge-base/rules-repair";
import { confirmModal } from "../ui/modals";
import { SETTINGS_LANGUAGE_OPTIONS, settingsCopy, type SettingsCopy } from "./i18n";

export class XiaoyuanAgentSettingTab extends PluginSettingTab {
  private resourceSnapshot: WorkspaceResourceSnapshot | null = null;
  private resourceLoadingTab: ResourceManagementTab | null = null;
  private resourceLoaded: Record<ResourceManagementTab, boolean> = { plugins: false, mcp: false, skills: false };
  private resourceLoadErrors: Partial<Record<ResourceManagementTab, string>> = {};
  private resourceSearchQuery: Record<ResourceManagementTab, string> = { plugins: "", mcp: "", skills: "" };
  private openCodeModelChoices: AgentModelInfo[] = [];
  private openCodeProviders: Provider[] = [];
  private openCodeModelsLoaded = false;
  private openCodeModelsLoading = false;
  private openCodeModelsError = "";
  private openCodeAgentChoices: AgentProfileInfo[] = [];
  private openCodeAgentsLoaded = false;
  private openCodeAgentsLoading = false;
  private openCodeAgentsError = "";
  private openCodeAutoRefreshScheduled = false;
  private openCodeDetectStatus = "";
  private collapsedProviders: Record<string, boolean> = {};

  constructor(private readonly plugin: XiaoyuanPlugin) {
    super(plugin.app, plugin);
    this.resourceSnapshot = snapshotFromWorkspaceResourceCache(this.plugin.settings.workspaceResourceCache);
    this.resourceLoaded = loadedTabsFromWorkspaceResourceCache(this.plugin.settings.workspaceResourceCache);
    this.resourceLoadErrors = errorsFromWorkspaceResourceCache(this.plugin.settings.workspaceResourceCache);
    this.collapsedProviders = Object.fromEntries(
      plugin.settings.apiProviders.map(p => [p.id, true])
    );
  }

  private get copy(): SettingsCopy {
    return settingsCopy(this.plugin.settings.settingsLanguage);
  }

  display(): void {
    const { containerEl } = this;
    const copy = this.copy;
    containerEl.empty();
    this.openCodeAutoRefreshScheduled = false;
    
    const mode = this.plugin.settings.assistantMode;
    
    // Mode selector - 智能助理模式选择
    this.decorateSetting(new Setting(containerEl)
      .setName(copy.mode.title)
      .setDesc(mode === "auto" ? copy.mode.autoDesc : (mode === "opencode" ? copy.mode.opencodeDesc : copy.mode.customApiDesc))
      .addDropdown(dropdown => {
        dropdown
          .addOption("auto", copy.mode.auto)
          .addOption("opencode", copy.mode.opencode)
          .addOption("custom-api", copy.mode.customApi)
          .setValue(this.plugin.settings.assistantMode)
          .onChange(async (value: any) => {
            this.plugin.settings.assistantMode = value;
            await this.plugin.saveSettings();
            this.display();
          });
      }), "bot");

    const status = this.plugin.lastStatus;
    const statusBox = containerEl.createDiv({ cls: "xy-settings-status" });
    
    const activeProvider = getActiveApiProvider(this.plugin.settings);
    if (mode === "opencode") {
      this.addStatusRow(statusBox, "activity", copy.status.connectionStatus, status?.connected ? copy.common.connected : copy.common.disconnected);
      this.addStatusRow(statusBox, "terminal-square", copy.status.opencode, detectOpenCodePath(this.plugin.settings.opencode.cliPath, copy));
      this.addStatusRow(statusBox, "box", copy.status.currentModel, this.plugin.settings.opencode.modelId || this.plugin.settings.defaultModel || copy.common.unknown);
    } else if (mode === "custom-api") {
      const apiConnected = activeProvider && activeProvider.baseUrl && activeProvider.apiKey;
      this.addStatusRow(statusBox, "activity", copy.status.connectionStatus, apiConnected ? copy.common.connected : copy.common.disconnected);
      this.addStatusRow(statusBox, "key-round", copy.status.connection, providerConnectionLabel(this.plugin.settings, this.plugin.settings.settingsLanguage));
      if (activeProvider) {
        this.addStatusRow(statusBox, "box", copy.status.currentModel, activeProvider.model || copy.common.unknown);
      }
    } else {
      this.addStatusRow(statusBox, "activity", copy.status.connectionStatus, status?.connected ? copy.common.connected : copy.common.disconnected);
      this.addStatusRow(statusBox, "terminal-square", copy.status.opencode, detectOpenCodePath(this.plugin.settings.opencode.cliPath, copy));
      if (status?.connected) {
        this.addStatusRow(statusBox, "box", copy.status.currentModel, this.plugin.settings.opencode.modelId || this.plugin.settings.defaultModel || copy.common.unknown);
      } else if (activeProvider) {
        this.addStatusRow(statusBox, "key-round", copy.status.connection, providerConnectionLabel(this.plugin.settings, this.plugin.settings.settingsLanguage));
        this.addStatusRow(statusBox, "box", copy.status.currentModel, activeProvider.model || copy.common.unknown);
      }
    }
    
    // 通用状态行
    this.addStatusRow(statusBox, "waypoints", copy.status.proxy, this.plugin.settings.proxyEnabled ? this.plugin.settings.proxyUrl : copy.common.disabled);
    this.addStatusRow(statusBox, "blocks", copy.status.chatMcp, this.plugin.settings.mcpEnabled ? copy.common.enabled : copy.common.disabled);
    this.addStatusRow(statusBox, "sparkles", copy.status.skillsCount, `${status?.skills.length ?? 0}`);
    this.addStatusRow(statusBox, "blocks", copy.status.mcpCount, `${status?.mcpServers.length ?? 0}`);
    this.addStatusRow(statusBox, "package-check", copy.status.pluginDir, pluginInstallDir(this.plugin));
    this.addStatusErrors(statusBox, status?.errors ?? []);
    this.addStatusActions(statusBox);

    this.renderTopTabs(containerEl);
    if (this.plugin.settings.settingsTab === "providers") {
      this.renderApiProviderManager(containerEl);
      return;
    }
    if (this.plugin.settings.settingsTab === "resources") {
      this.renderWorkspaceResourceManager(containerEl);
      return;
    }
    if (this.plugin.settings.settingsTab === "editorActions") {
      this.renderEditorActionSettings(containerEl);
      return;
    }
    if (this.plugin.settings.settingsTab === "knowledgeBase") {
      this.renderKnowledgeBaseSettings(containerEl);
      return;
    }
    if (this.plugin.settings.settingsTab === "review") {
      this.renderReviewSettings(containerEl);
      return;
    }

    this.renderGeneralSettings(containerEl, status, activeProvider);
  }

  private renderGeneralSettings(containerEl: HTMLElement, status: OpenCodeStatusSnapshot | null, activeProvider: ApiProviderConfig | null): void {
    const copy = this.copy;
    this.decorateSetting(new Setting(containerEl).setName(copy.general.settingsLanguage).setDesc(copy.general.settingsLanguageDesc).addDropdown((dropdown) => {
      for (const language of SETTINGS_LANGUAGE_OPTIONS) dropdown.addOption(language, copy.general.languageOptions[language]);
      dropdown.setValue(this.plugin.settings.settingsLanguage);
      dropdown.onChange(async (value) => {
        this.plugin.settings.settingsLanguage = normalizeSettingsLanguageForUi(value);
        await this.plugin.saveSettings(true);
        this.display();
      });
    }), "languages");

    

    this.decorateSetting(new Setting(containerEl).setName(copy.general.proxyEnabled).setDesc(copy.general.proxyEnabledDesc).addToggle((toggle) =>
      toggle.setValue(this.plugin.settings.proxyEnabled).onChange(async (value) => {
        this.plugin.settings.proxyEnabled = value;
        await this.plugin.saveSettings();
      })
    ), "waypoints");

    this.decorateSetting(
      new Setting(containerEl)
        .setName(copy.general.proxyUrl)
        .setDesc(copy.general.proxyUrlDesc)
        .addText((text) =>
          text.setPlaceholder("http://127.0.0.1:7890").setValue(this.plugin.settings.proxyUrl).onChange(async (value) => {
            this.plugin.settings.proxyUrl = value.trim();
            await this.plugin.saveSettings();
          })
        ),
      "route"
    );

    this.decorateSetting(new Setting(containerEl).setName(copy.general.mcpEnabled).setDesc(copy.general.mcpEnabledDesc).addToggle((toggle) =>
      toggle.setValue(this.plugin.settings.mcpEnabled).onChange(async (value) => {
        this.plugin.settings.mcpEnabled = value;
        await this.plugin.saveSettings();
      })
    ), "blocks");

    const settingsMode = this.plugin.settings.assistantMode;
    const currentModel = settingsMode === "opencode" || (settingsMode === "auto" && status?.connected)
      ? (this.plugin.settings.opencode.modelId || this.plugin.settings.defaultModel || copy.common.unknown)
      : (activeProvider?.model || copy.common.unknown);
    this.decorateSetting(
      new Setting(containerEl)
      .setName(copy.general.defaultModel)
      .setDesc(copy.general.defaultModelDesc)
      .addText((text) => text.setValue(currentModel).setDisabled(true)),
      "box"
    );

    this.decorateSetting(new Setting(containerEl).setName(copy.general.defaultReasoning).addDropdown((dropdown) => {
      const options: ReasoningEffort[] = ["low", "medium", "high", "xhigh"];
      for (const option of options) dropdown.addOption(option, option);
      dropdown.setValue(this.plugin.settings.defaultReasoning);
      dropdown.onChange(async (value) => {
        this.plugin.settings.defaultReasoning = value as ReasoningEffort;
        await this.plugin.saveSettings();
        this.plugin.applyComposerDefaultsToView();
      });
    }), "brain");

    this.decorateSetting(new Setting(containerEl).setName(copy.general.defaultSpeed).addDropdown((dropdown) => {
      const options = copy.general.serviceTierOptions;
      for (const [value, label] of Object.entries(options)) dropdown.addOption(value, label);
      dropdown.setValue(this.plugin.settings.defaultServiceTier);
      dropdown.onChange(async (value) => {
        this.plugin.settings.defaultServiceTier = value as ServiceTierChoice;
        await this.plugin.saveSettings();
        this.plugin.applyComposerDefaultsToView();
      });
    }), "gauge");

    this.decorateSetting(new Setting(containerEl).setName(copy.general.defaultPermission).addDropdown((dropdown) => {
      const options = copy.general.permissionOptions;
      for (const [value, label] of Object.entries(options)) dropdown.addOption(value, label);
      dropdown.setValue(this.plugin.settings.defaultPermission);
      dropdown.onChange(async (value) => {
        this.plugin.settings.defaultPermission = value as PermissionMode;
        await this.plugin.saveSettings();
        this.plugin.applyComposerDefaultsToView();
      });
    }), "shield-check");

    this.decorateSetting(new Setting(containerEl).setName(copy.general.defaultMode).addDropdown((dropdown) => {
      const options = copy.general.modeOptions;
      for (const [value, label] of Object.entries(options)) dropdown.addOption(value, label);
      dropdown.setValue(this.plugin.settings.defaultMode);
      dropdown.onChange(async (value) => {
        this.plugin.settings.defaultMode = value as UiMode;
        await this.plugin.saveSettings();
        this.plugin.applyComposerDefaultsToView();
      });
    }), "route");

    this.decorateSetting(new Setting(containerEl).setName(copy.general.autoOpen).addToggle((toggle) =>
      toggle.setValue(this.plugin.settings.autoOpen).onChange(async (value) => {
        this.plugin.settings.autoOpen = value;
        await this.plugin.saveSettings();
      })
    ), "panel-right-open");

    this.decorateSetting(new Setting(containerEl).setName(copy.general.showContext).addToggle((toggle) =>
      toggle.setValue(this.plugin.settings.showContext).onChange(async (value) => {
        this.plugin.settings.showContext = value;
        await this.plugin.saveSettings();
      })
    ), "pie-chart");

    }

  private renderKnowledgeBaseSettings(container: HTMLElement): void {
    const copy = this.copy;
    const settings = this.plugin.settings.knowledgeBase;
    const wrapper = container.createDiv({ cls: "xy-api-provider-manager xy-knowledge-settings" });
    const header = wrapper.createDiv({ cls: "xy-resource-manager-header" });
    const title = header.createDiv({ cls: "xy-resource-manager-title" });
    const icon = title.createSpan({ cls: "xy-setting-icon" });
    setIcon(icon, "library");
    title.createSpan({ text: copy.knowledge.title });

    wrapper.createDiv({
      cls: "xy-resource-warning",
      text: copy.knowledge.safety
    });

    const summary = wrapper.createDiv({ cls: "xy-api-provider-row" });
    summary.createDiv({ cls: "xy-editor-actions-heading", text: copy.knowledge.statusHeading });
    summary.createDiv({ cls: "xy-resource-note", text: copy.knowledge.recentStatus(knowledgeStatusLabel(settings.lastRunStatus, copy), settings.lastRunAt ? new Date(settings.lastRunAt).toLocaleString() : "") });
    summary.createDiv({ cls: "xy-resource-note", text: copy.knowledge.initialization(knowledgeInitStatusLabel(settings.initialization.status, copy), settings.initialization.rulesFilePath) });
    summary.createDiv({ cls: "xy-resource-note", text: copy.knowledge.guide(settings.useCustomRulesFile ? settings.rulesFilePath : AGENTS_RULES_FILE, settings.useCustomRulesFile) });
    if (settings.lastReportPath) summary.createDiv({ cls: "xy-resource-note", text: copy.knowledge.recentReport(settings.lastReportPath) });
    if (settings.lastError) summary.createDiv({ cls: "xy-resource-error", text: settings.lastError });

    const actions = summary.createDiv({ cls: "xy-api-provider-actions" });
    const openChannel = actions.createEl("button", { cls: "xy-resource-tab", text: copy.knowledge.openChannel, attr: { type: "button" } });
    openChannel.onclick = async () => {
      await this.plugin.activateKnowledgeBaseChannel();
      this.display();
    };
    const initChannel = actions.createEl("button", { cls: "xy-resource-tab", text: copy.knowledge.initChannel, attr: { type: "button" } });
    initChannel.onclick = async () => {
      await this.plugin.activateKnowledgeBaseChannel();
      this.plugin.getXiaoyuanView()?.fillKnowledgeBaseCommand("/init ");
      this.display();
    };

    this.addKnowledgeBaseCommandGuide(wrapper);
    this.addKnowledgeBaseStoragePanel(wrapper);

    this.decorateSetting(new Setting(wrapper).setName(copy.knowledge.enabled).setDesc(copy.knowledge.enabledDesc).addToggle((toggle) =>
      toggle.setValue(settings.enabled).onChange(async (value) => {
        settings.enabled = value;
        await this.plugin.saveSettings();
        this.display();
      })
    ), "toggle-right");

    

    this.decorateSetting(new Setting(wrapper).setName(copy.knowledge.customRules).setDesc(copy.knowledge.customRulesDesc(DEFAULT_KNOWLEDGE_BASE_RULES_FILE, AGENTS_RULES_FILE)).addToggle((toggle) =>
      toggle.setValue(settings.useCustomRulesFile).onChange(async (value) => {
        settings.useCustomRulesFile = value;
        if (value && (!settings.rulesFilePath || settings.rulesFilePath === AGENTS_RULES_FILE)) settings.rulesFilePath = DEFAULT_KNOWLEDGE_BASE_RULES_FILE;
        await this.plugin.saveSettings();
        this.display();
      })
    ), "file-cog");
    this.addKnowledgeBaseRulesFilePicker(wrapper);
    this.addKnowledgeBaseMemoryRecommendation(wrapper);

    this.decorateSetting(new Setting(wrapper).setName(copy.knowledge.dailyMaintenance).setDesc(copy.knowledge.dailyMaintenanceDesc).addToggle((toggle) =>
      toggle.setValue(settings.scheduleEnabled).onChange(async (value) => {
        settings.scheduleEnabled = value;
        await this.plugin.saveSettings();
      })
    ), "calendar-clock");
    this.addProviderText(wrapper, copy.knowledge.scheduleTime, settings.scheduleTime, "09:00", async (value) => {
      settings.scheduleTime = /^([01]\d|2[0-3]):[0-5]\d$/.test(value.trim()) ? value.trim() : settings.scheduleTime;
      await this.plugin.saveSettings();
      this.display();
    });
    this.decorateSetting(new Setting(wrapper).setName(copy.knowledge.catchUp).setDesc(copy.knowledge.catchUpDesc).addToggle((toggle) =>
      toggle.setValue(settings.catchUpOnStartup).onChange(async (value) => {
        settings.catchUpOnStartup = value;
        await this.plugin.saveSettings();
      })
    ), "history");

    wrapper.createDiv({
      cls: "xy-resource-note",
      text: copy.knowledge.channelNote
    });
  }

  private addKnowledgeBaseCommandGuide(container: HTMLElement): void {
    const copy = this.copy;
    const section = container.createDiv({ cls: "xy-api-provider-row xy-kb-command-guide" });
    section.createDiv({ cls: "xy-editor-actions-heading", text: copy.knowledge.commandHeading });
    for (const item of copy.knowledge.commandGuide) {
      const row = section.createDiv({ cls: "xy-kb-command-row" });
      row.createEl("code", { text: item.command });
      row.createSpan({ text: item.description });
    }
  }

  private addKnowledgeBaseStoragePanel(container: HTMLElement): void {
    const copy = this.copy;
    const section = container.createDiv({ cls: "xy-api-provider-row xy-kb-storage-panel" });
    section.createDiv({ cls: "xy-editor-actions-heading", text: copy.knowledge.storageHeading });
    const statsEl = section.createDiv({ cls: "xy-resource-note", text: copy.knowledge.storageLoading });
    void this.plugin.getKnowledgeBaseStorageStats()
      .then((stats) => {
        statsEl.setText(copy.knowledge.storageStats(
          formatStorageBytes(stats.dataJsonBytes),
          formatStorageBytes(stats.historyBytes),
          formatStorageBytes(stats.rawBytes),
          stats.messageCount,
          stats.dayCount
        ));
      })
      .catch((error) => {
        statsEl.setText(copy.common.readFailed(error instanceof Error ? error.message : String(error)));
      });
    const actions = section.createDiv({ cls: "xy-api-provider-actions" });
    const rebuild = actions.createEl("button", { cls: "xy-resource-tab", text: copy.knowledge.rebuildHistory, attr: { type: "button" } });
    rebuild.onclick = async () => {
      rebuild.disabled = true;
      await this.plugin.rebuildKnowledgeBaseHistoryIndex();
      new Notice(copy.knowledge.historyRebuilt);
      this.display();
    };
    const exportButton = actions.createEl("button", { cls: "xy-resource-tab", text: copy.knowledge.exportHistory, attr: { type: "button" } });
    exportButton.onclick = async () => {
      exportButton.disabled = true;
      const exported = await this.plugin.exportKnowledgeBaseHistory();
      new Notice(copy.knowledge.historyExported(exported));
      this.display();
    };
    const compact = actions.createEl("button", { cls: "xy-resource-tab", text: copy.knowledge.compactHistory, attr: { type: "button" } });
    compact.onclick = async () => {
      const accepted = await confirmModal(this.app, copy.knowledge.compactHistory, "只压缩旧日期的过程记录，不删除用户与助手正文。", "压缩", "取消");
      if (!accepted) return;
      compact.disabled = true;
      const count = await this.plugin.compactOldKnowledgeBaseProcessHistory();
      new Notice(copy.knowledge.historyCompacted(count));
      this.display();
    };
  }

  private renderReviewSettings(container: HTMLElement): void {
    const copy = this.copy;
    const settings = this.plugin.settings.review;
    const wrapper = container.createDiv({ cls: "xy-api-provider-manager xy-review-settings" });
    const header = wrapper.createDiv({ cls: "xy-resource-manager-header" });
    const title = header.createDiv({ cls: "xy-resource-manager-title" });
    const icon = title.createSpan({ cls: "xy-setting-icon" });
    setIcon(icon, "bar-chart-3");
    title.createSpan({ text: copy.review.title });

    const summary = wrapper.createDiv({ cls: "xy-api-provider-row" });
    summary.createDiv({ cls: "xy-editor-actions-heading", text: copy.review.generateHeading });
    const actions = summary.createDiv({ cls: "xy-api-provider-actions" });
    this.addReviewAction(actions, copy.review.generateAgent, "agent-chat");
    this.addReviewAction(actions, copy.review.generateKnowledge, "knowledge-base");

    const paths = wrapper.createDiv({ cls: "xy-api-provider-row" });
    paths.createDiv({ cls: "xy-editor-actions-heading", text: copy.review.pathsHeading });
    this.addProviderText(paths, copy.review.outputDir, settings.outputDir, DEFAULT_SETTINGS.review.outputDir, async (value) => {
      settings.outputDir = normalizeReviewOutputDir(value, DEFAULT_SETTINGS.review.outputDir);
      await this.plugin.saveSettings();
      this.display();
    });
    this.addReviewPath(paths, copy.review.knowledgeMarkdown, settings.reports.knowledgeBase.lastMarkdownPath);
    this.addReviewPath(paths, copy.review.knowledgeHtml, settings.reports.knowledgeBase.lastHtmlPath);
    this.addReviewPath(paths, copy.review.agentMarkdown, settings.reports.agentChat.lastMarkdownPath);
    this.addReviewPath(paths, copy.review.agentHtml, settings.reports.agentChat.lastHtmlPath);

    const reviewOptions = wrapper.createDiv({ cls: "xy-api-provider-row" });
    reviewOptions.createDiv({ cls: "xy-editor-actions-heading", text: copy.review.settingsHeading });
    this.addReviewRangeMode(reviewOptions);
    this.addReviewOpenAfterRun(reviewOptions);
  }

  private addReviewPath(container: HTMLElement, label: string, value: string): void {
    if (!value) return;
    container.createDiv({ cls: "xy-resource-note", text: `${label}：${value}` });
  }

  private addReviewAction(container: HTMLElement, label: string, kind: ReviewReportKind): void {
    const copy = this.copy;
    const button = container.createEl("button", { cls: "xy-resource-tab", text: label, attr: { type: "button" } });
    button.onclick = async () => {
      const reportLabel = copy.review.reportLabels[kind];
      const accepted = await confirmModal(
        this.app,
        copy.review.confirmTitle(label),
        copy.review.confirmBody(reportLabel, this.plugin.settings.review.outputDir),
        copy.review.generate,
        copy.review.cancel
      );
      if (!accepted) return;
      button.disabled = true;
      await this.plugin.getReviewManager()?.runReview(kind);
      this.display();
    };
  }

  private addReviewRangeMode(container: HTMLElement): void {
    const copy = this.copy;
    const settings = this.plugin.settings.review;
    this.decorateSetting(new Setting(container).setName(copy.review.rangeMode).addDropdown((dropdown) => {
      dropdown
        .addOption("previous-week", copy.review.rangeOptions["previous-week"])
        .addOption("current-week", copy.review.rangeOptions["current-week"])
        .setValue(settings.rangeMode)
        .onChange(async (value) => {
          settings.rangeMode = value === "current-week" ? "current-week" : "previous-week";
          await this.plugin.saveSettings();
        });
    }), "calendar-days");
  }

  private addReviewOpenAfterRun(container: HTMLElement): void {
    const copy = this.copy;
    const settings = this.plugin.settings.review;
    this.decorateSetting(new Setting(container).setName(copy.review.openHtmlAfterRun).addToggle((toggle) =>
      toggle.setValue(settings.openHtmlAfterRun).onChange(async (value) => {
        settings.openHtmlAfterRun = value;
        await this.plugin.saveSettings();
      })
    ), "panel-right-open");
  }



  private addStatusActions(container: HTMLElement): void {
    const copy = this.copy;
    const actions = container.createDiv({ cls: "xy-settings-status-actions" });
    const refresh = actions.createEl("button", {
      cls: "xy-resource-refresh",
      attr: { type: "button", title: copy.status.refreshTitle }
    });
    const icon = refresh.createSpan({ cls: "xy-resource-refresh-icon" });
    setIcon(icon, "refresh-cw");
    const label = refresh.createSpan({ text: copy.status.refreshLogin });
    refresh.onclick = async () => {
      refresh.disabled = true;
      label.setText(copy.status.refreshing);
      const status = await this.plugin.ensureOpenCodeConnected(true);
      if (status.connected) {
        await this.refreshOpenCodeRuntimeOptions();
        new Notice(copy.status.refreshSuccess(status.accountLabel));
      } else {
        new Notice(copy.status.refreshFailed(status.errors[0] ?? copy.common.unknown));
      }
      this.display();
    };
  }

  private addStatusErrors(container: HTMLElement, errors: string[]): void {
    if (!errors.length) return;
    const copy = this.copy;
    for (const error of errors.slice(0, 3)) {
      const card = container.createDiv({ cls: "xy-settings-status-error" });
      const title = card.createDiv({ cls: "xy-settings-status-error-title" });
      const icon = title.createSpan({ cls: "xy-settings-status-icon" });
      setIcon(icon, "triangle-alert");
      title.createSpan({ text: copy.status.diagnostics });
      card.createEl("pre", { cls: "xy-settings-status-error-body", text: error });
    }
  }

  private renderTopTabs(container: HTMLElement): void {
    const copy = this.copy;
    const tabs = container.createDiv({ cls: "xy-settings-tabs" });
    for (const tab of SETTINGS_TABS) {
      const button = tabs.createEl("button", {
        cls: `xy-settings-tab ${this.plugin.settings.settingsTab === tab.id ? "is-active" : ""}`,
        attr: { type: "button" }
      });
      const icon = button.createSpan({ cls: "xy-settings-tab-icon" });
      setIcon(icon, tab.icon);
      button.createSpan({ text: copy.tabs[tab.id] });
      button.onclick = async () => {
        this.plugin.settings.settingsTab = tab.id;
        await this.plugin.saveSettings();
        this.display();
      };
    }
  }

  private renderApiProviderManager(container: HTMLElement): void {
    const copy = this.copy;
    const wrapper = container.createDiv({ cls: "xy-api-provider-manager" });

    const opencode = this.plugin.settings.opencode;
    const openCodePathPlaceholder = detectOpenCodeCommand(opencode.cliPath) || copy.knowledge.opencodePathPlaceholder;
    const openCodeSection = wrapper.createDiv({ cls: "xy-editor-actions-section" });
    const openCodeHeader = openCodeSection.createDiv({ cls: "xy-resource-manager-header" });
    const openCodeTitle = openCodeHeader.createDiv({ cls: "xy-resource-manager-title" });
    const openCodeIcon = openCodeTitle.createSpan({ cls: "xy-setting-icon" });
    setIcon(openCodeIcon, "terminal-square");
    openCodeTitle.createSpan({ text: copy.providers.opencodeMode });
    
    this.addProviderText(openCodeSection, copy.knowledge.opencodePath, opencode.cliPath, openCodePathPlaceholder, async (value) => {
      opencode.cliPath = value.trim();
      await this.plugin.saveSettings();
      this.display();
    });
    this.decorateSetting(new Setting(openCodeSection).setName(copy.knowledge.autoStartServer).addToggle((toggle) =>
      toggle.setValue(opencode.autoStart).onChange(async (value) => {
        opencode.autoStart = value;
        await this.plugin.saveSettings();
      })
    ), "power");
    const openCodeActions = openCodeSection.createDiv({ cls: "xy-api-provider-actions" });
    if (this.openCodeDetectStatus) {
      const cls = this.openCodeDetectStatus.startsWith("检测成功") || this.openCodeDetectStatus.startsWith("Detection:")
        ? "xy-opencode-detect-success"
        : "xy-opencode-detect-fail";
      openCodeActions.createDiv({ cls, text: this.openCodeDetectStatus });
    }
    const testOpenCode = openCodeActions.createEl("button", { cls: "xy-resource-tab", text: copy.knowledge.testConnection, attr: { type: "button" } });
    testOpenCode.onclick = async () => {
      await this.refreshOpenCodeRuntimeOptions();
      this.display();
    };
    if (!this.openCodeModelsLoaded && !this.openCodeModelsLoading && !this.openCodeAutoRefreshScheduled) {
      this.openCodeAutoRefreshScheduled = true;
      queueMicrotask(() => void this.refreshOpenCodeRuntimeOptions());
    }
    this.addProviderText(openCodeSection, copy.opencode.host, opencode.hostname, "127.0.0.1", async (value) => {
      opencode.hostname = value.trim() || "127.0.0.1";
      await this.plugin.saveSettings();
    });
    this.addProviderText(openCodeSection, copy.opencode.port, String(opencode.port), "4096", async (value) => {
      opencode.port = parseClampedInteger(value, 4096, 1024, 65535);
      await this.plugin.saveSettings();
      this.display();
    });
    this.addOpenCodeModelPicker(openCodeSection);
    this.addProviderText(openCodeSection, copy.opencode.providerId, opencode.providerId, "anthropic", async (value) => {
      opencode.providerId = value.trim();
      await this.plugin.saveSettings();
    });
    this.addProviderText(openCodeSection, copy.opencode.modelId, opencode.modelId, "claude-sonnet-4-20250514", async (value) => {
      opencode.modelId = value.trim();
      await this.plugin.saveSettings();
    });
    this.addOpenCodeAgentPicker(openCodeSection);
    openCodeSection.createDiv({
      cls: "xy-resource-note",
      text: copy.knowledge.modelCapabilities(opencode.textEnabled, opencode.imageEnabled, opencode.pdfEnabled)
    });
    if (opencode.lastError) openCodeSection.createDiv({ cls: "xy-resource-error", text: opencode.lastError });
    if (this.openCodeModelsError) openCodeSection.createDiv({ cls: "xy-resource-error", text: this.openCodeModelsError });
    if (this.openCodeAgentsError) openCodeSection.createDiv({ cls: "xy-resource-error", text: this.openCodeAgentsError });

    const customApiSection = wrapper.createDiv({ cls: "xy-editor-actions-section" });
    const customApiHeader = customApiSection.createDiv({ cls: "xy-resource-manager-header" });
    const customApiTitle = customApiHeader.createDiv({ cls: "xy-resource-manager-title" });
    const customApiIcon = customApiTitle.createSpan({ cls: "xy-setting-icon" });
    setIcon(customApiIcon, "key-round");
    customApiTitle.createSpan({ text: copy.providers.customApiMode });

    const add = customApiHeader.createEl("button", {
      cls: "xy-resource-refresh",
      text: copy.providers.add,
      attr: { type: "button", title: copy.providers.addTitle }
    });
    add.onclick = async () => {
      const defaultProviderModel = this.plugin.settings.defaultModel
        || this.plugin.lastStatus?.models[0]?.modelId
        || "gpt-5.4";
      const provider: ApiProviderConfig = {
        id: newId("provider").replace(/[^A-Za-z0-9_-]/g, "_"),
        name: copy.providers.defaultName,
        baseUrl: "https://api.openai.com/v1",
        model: defaultProviderModel,
        models: [defaultProviderModel],
        apiKey: ""
      };
      this.plugin.settings.apiProviders.push(provider);
      this.plugin.settings.activeApiProviderId = provider.id;
      await this.plugin.saveSettings(true);
      this.display();
    };

    customApiSection.createDiv({
      cls: "xy-resource-warning",
      text: copy.providers.warningKey
    });
    customApiSection.createDiv({
      cls: "xy-resource-warning",
      text: copy.providers.warningApi
    });

    const modeRow = customApiSection.createDiv({ cls: "xy-api-provider-mode" });
    modeRow.createDiv({
      cls: "xy-resource-summary",
      text: copy.common.current(providerConnectionLabel(this.plugin.settings, this.plugin.settings.settingsLanguage))
    });

    if (!this.plugin.settings.apiProviders.length) {
      customApiSection.createDiv({ cls: "xy-resource-empty", text: copy.providers.empty });
      return;
    }

    const body = customApiSection.createDiv({ cls: "xy-api-provider-list" });
    for (const provider of this.plugin.settings.apiProviders) {
      this.renderApiProviderRow(body, provider);
    }
  }

  private renderEditorActionSettings(container: HTMLElement): void {
    const copy = this.copy;
    const settings = this.plugin.settings.editorActions;

    this.decorateSetting(
      new Setting(container)
        .setName(copy.writing.requestMode)
        .setDesc(copy.writing.requestModeDesc),
      "terminal"
    );

    this.decorateSetting(new Setting(container).setName(copy.writing.enabled).setDesc(copy.writing.enabledDesc).addToggle((toggle) =>
      toggle.setValue(settings.enabled).onChange(async (value) => {
        settings.enabled = value;
        await this.plugin.saveSettings();
        this.display();
      })
    ), "toggle-right");

    this.decorateSetting(new Setting(container).setName(copy.writing.statusSlot).setDesc(copy.writing.statusSlotDesc).addToggle((toggle) =>
      toggle.setValue(settings.statusSlotEnabled).onChange(async (value) => {
        settings.statusSlotEnabled = value;
        await this.plugin.saveSettings();
      })
    ), "activity");

    this.decorateSetting(new Setting(container).setName(copy.writing.contextPanel).setDesc(copy.writing.contextPanelDesc).addToggle((toggle) =>
      toggle.setValue(settings.showContextPanel).onChange(async (value) => {
        settings.showContextPanel = value;
        await this.plugin.saveSettings();
      })
    ), "file-search");

    this.decorateSetting(new Setting(container).setName(copy.writing.quality).setDesc(copy.writing.qualityDesc).addDropdown((dropdown) => {
      for (const mode of EDITOR_ACTION_QUALITY_MODES) dropdown.addOption(mode.id, copy.writing.qualityModes[mode.id].label);
      dropdown.setValue(settings.qualityMode);
      dropdown.onChange(async (value) => {
        settings.qualityMode = normalizeEditorActionQualityModeForUi(value);
        await this.plugin.saveSettings();
        this.display();
      });
    }), "gauge");

    this.decorateSetting(new Setting(container).setName(copy.writing.style).addDropdown((dropdown) => {
      for (const style of settings.styles) dropdown.addOption(style.id, style.label || style.id);
      dropdown.setValue(settings.defaultStyleId);
      dropdown.onChange(async (value) => {
        settings.defaultStyleId = value;
        await this.plugin.saveSettings();
      });
    }), "palette");

    this.addEditorActionNumber(container, copy.writing.maxSelectedChars, settings.maxSelectedChars, 200, 20000, async (value) => {
      settings.maxSelectedChars = value;
      await this.plugin.saveSettings();
    });
    this.addEditorActionNumber(container, copy.writing.timeoutSeconds, Math.round(settings.timeoutMs / 1000), 10, 300, async (value) => {
      settings.timeoutMs = value * 1000;
      await this.plugin.saveSettings();
    });

    this.renderEditorActionModeConfigs(container);

    this.decorateSetting(new Setting(container).setName(copy.writing.cache).setDesc(copy.writing.cacheDesc(Object.keys(settings.articleUnderstandingCache).length)).addButton((button) =>
      button.setButtonText(copy.common.clear).setIcon("trash-2").onClick(async () => {
        settings.articleUnderstandingCache = {};
        await this.plugin.saveSettings();
        this.display();
      })
    ), "database");

    this.renderEditorActionList(container, settings.actions);
    this.renderEditorStyleList(container, settings.styles);
  }

  private renderEditorActionList(container: HTMLElement, actions: EditorAiActionConfig[]): void {
    const copy = this.copy;
    const section = container.createDiv({ cls: "xy-editor-actions-section" });
    section.createDiv({ cls: "xy-editor-actions-heading", text: copy.writing.actionsHeading });
    for (const action of actions) {
      const row = section.createDiv({ cls: "xy-api-provider-row xy-editor-action-row" });
      const head = row.createDiv({ cls: "xy-api-provider-head" });
      const title = head.createDiv({ cls: "xy-api-provider-title" });
      const icon = title.createSpan({ cls: "xy-resource-row-icon" });
      setIcon(icon, editorActionIcon(action.id));
      title.createSpan({ text: action.label || action.id });
      title.createSpan({ cls: "xy-resource-row-meta", text: action.enabled ? copy.writing.enabledMeta : copy.writing.disabledMeta });
      const toggleWrap = head.createDiv({ cls: "xy-api-provider-actions" });
      new Setting(toggleWrap).addToggle((toggle) =>
        toggle.setValue(action.enabled).onChange(async (value) => {
          action.enabled = value;
          await this.plugin.saveSettings();
          this.display();
        })
      );
      this.addProviderText(row, copy.writing.name, action.label, copy.writing.actionNamePlaceholder, async (value) => {
        action.label = value.trim() || action.id;
        await this.plugin.saveSettings();
        this.display();
      });
      this.addProviderTextArea(row, copy.writing.promptTemplate, action.promptTemplate, copy.writing.promptPlaceholder, async (value) => {
        action.promptTemplate = value.trim();
        await this.plugin.saveSettings();
      });
    }
  }

  private renderEditorActionModeConfigs(container: HTMLElement): void {
    const copy = this.copy;
    const settings = this.plugin.settings.editorActions;
    const section = container.createDiv({ cls: "xy-editor-actions-section" });
    section.createDiv({ cls: "xy-editor-actions-heading", text: copy.writing.qualityModesHeading });
    const rawModels = (this.plugin.lastStatus?.models ?? []).map((m) => ({ id: m.modelId, model: m.modelId, displayName: m.displayName }));
    const modelChoices = ensureModelChoices(rawModels, "gpt-5.4-mini", "gpt-5.4", "gpt-5.5", DEFAULT_SETTINGS.defaultModel);
    for (const mode of EDITOR_ACTION_QUALITY_MODES) {
      const config = settings.modeConfigs[mode.id];
      const row = section.createDiv({ cls: "xy-api-provider-row xy-editor-mode-row" });
      const head = row.createDiv({ cls: "xy-api-provider-head" });
      const title = head.createDiv({ cls: "xy-api-provider-title" });
      const icon = title.createSpan({ cls: "xy-resource-row-icon" });
      setIcon(icon, mode.icon);
      title.createSpan({ text: copy.writing.qualityModes[mode.id].label });
      title.createSpan({ cls: "xy-resource-row-meta", text: copy.writing.qualityModes[mode.id].desc });

      this.decorateSetting(new Setting(row).setName(copy.writing.model).addDropdown((dropdown) => {
        for (const model of ensureModelChoices(modelChoices, config.model)) dropdown.addOption(model.model, model.displayName || model.model);
        dropdown.setValue(config.model);
        dropdown.onChange(async (value) => {
          config.model = value;
          await this.plugin.saveSettings();
        });
      }), "box");
      this.addEditorActionNumber(row, copy.writing.contextBefore, config.contextCharsBefore, 0, 10000, async (value) => {
        config.contextCharsBefore = value;
        if (mode.id === "fast") settings.contextCharsBefore = value;
        await this.plugin.saveSettings();
      });
      this.addEditorActionNumber(row, copy.writing.contextAfter, config.contextCharsAfter, 0, 10000, async (value) => {
        config.contextCharsAfter = value;
        if (mode.id === "fast") settings.contextCharsAfter = value;
        await this.plugin.saveSettings();
      });
    }
  }

  private renderEditorStyleList(container: HTMLElement, styles: EditorAiStyleConfig[]): void {
    const copy = this.copy;
    const section = container.createDiv({ cls: "xy-editor-actions-section" });
    const header = section.createDiv({ cls: "xy-resource-manager-header" });
    header.createDiv({ cls: "xy-editor-actions-heading", text: copy.writing.stylesHeading });
    const add = header.createEl("button", {
      cls: "xy-resource-refresh",
      text: copy.writing.addStyle,
      attr: { type: "button" }
    });
    add.onclick = async () => {
      const id = `style_${Date.now()}`;
      styles.push({ id, label: copy.writing.defaultStyleLabel, instruction: copy.writing.defaultStyleInstruction });
      this.plugin.settings.editorActions.defaultStyleId = id;
      await this.plugin.saveSettings(true);
      this.display();
    };

    for (const style of styles) {
      const row = section.createDiv({ cls: "xy-api-provider-row xy-editor-style-row" });
      const head = row.createDiv({ cls: "xy-api-provider-head" });
      const title = head.createDiv({ cls: "xy-api-provider-title" });
      const icon = title.createSpan({ cls: "xy-resource-row-icon" });
      setIcon(icon, "palette");
      title.createSpan({ text: style.label || style.id });
      title.createSpan({ cls: "xy-resource-row-meta", text: style.id });
      const actions = head.createDiv({ cls: "xy-api-provider-actions" });
      if (!DEFAULT_SETTINGS.editorActions.styles.some((item) => item.id === style.id)) {
        const remove = actions.createEl("button", { cls: "xy-resource-tab", text: copy.common.delete, attr: { type: "button" } });
        remove.onclick = async () => {
          this.plugin.settings.editorActions.styles = styles.filter((item) => item.id !== style.id);
          if (this.plugin.settings.editorActions.defaultStyleId === style.id) this.plugin.settings.editorActions.defaultStyleId = "clear";
          await this.plugin.saveSettings(true);
          this.display();
        };
      }
      this.addProviderText(row, copy.writing.name, style.label, copy.writing.styleNamePlaceholder, async (value) => {
        style.label = value.trim() || style.id;
        await this.plugin.saveSettings();
        this.display();
      });
      this.addProviderTextArea(row, copy.writing.styleInstruction, style.instruction, copy.writing.styleInstructionPlaceholder, async (value) => {
        style.instruction = value.trim();
        await this.plugin.saveSettings();
      });
    }
  }

  private renderApiProviderRow(container: HTMLElement, provider: ApiProviderConfig): void {
    const copy = this.copy;
    const activeProvider = getActiveApiProvider(this.plugin.settings);
    const isCollapsed = this.collapsedProviders[provider.id] !== false;
    const row = container.createDiv({
      cls: `xy-api-provider-row ${activeProvider?.id === provider.id && this.plugin.settings.providerMode === "custom-api" ? "is-active" : ""}`
    });
    
    const head = row.createDiv({ cls: "xy-api-provider-head" });
    
    const toggleBtn = head.createEl("button", { cls: "xy-api-provider-toggle", attr: { type: "button" } });
    setIcon(toggleBtn, isCollapsed ? "chevron-right" : "chevron-down");
    toggleBtn.onclick = () => {
      this.collapsedProviders[provider.id] = !isCollapsed;
      this.display();
    };
    
    const title = head.createDiv({ cls: "xy-api-provider-title" });
    title.createSpan({ text: provider.name || copy.providers.unnamed });
    title.createSpan({ cls: "xy-resource-row-meta", text: providerModelLabel(provider, this.plugin.settings.settingsLanguage) });
    title.prepend(toggleBtn);

    const actions = head.createDiv({ cls: "xy-api-provider-actions" });
    const enable = actions.createEl("button", {
      cls: "xy-resource-tab",
      text: activeProvider?.id === provider.id && this.plugin.settings.providerMode === "custom-api" ? copy.providers.active : copy.providers.enableReconnect,
      attr: { type: "button" }
    });
    enable.onclick = async () => {
      const errors = validateApiProvider(provider, this.plugin.settings.settingsLanguage);
      if (errors.length) {
        new Notice(copy.common.enableFailed(errors));
        return;
      }
      this.plugin.settings.providerMode = "custom-api";
      this.plugin.settings.activeApiProviderId = provider.id;
      await this.plugin.saveSettings(true);
      await this.plugin.ensureOpenCodeConnected(true);
      this.display();
    };

    const remove = actions.createEl("button", {
      cls: "xy-resource-tab",
      text: copy.common.delete,
      attr: { type: "button" }
    });
    remove.onclick = async () => {
      if (!window.confirm(copy.providers.deleteConfirm(provider.name))) return;
      const wasActive = this.plugin.settings.providerMode === "custom-api" && this.plugin.settings.activeApiProviderId === provider.id;
      removeApiProvider(this.plugin.settings, provider.id);
      await this.plugin.saveSettings(true);
      if (wasActive) await this.plugin.ensureOpenCodeConnected(true);
      this.display();
    };

    const content = row.createDiv({ cls: "xy-api-provider-content" });
    if (isCollapsed) content.style.display = "none";

    this.addProviderText(content, copy.providers.name, provider.name, copy.providers.namePlaceholder, async (value) => {
      provider.name = value.trim();
      await this.plugin.saveSettings();
      this.display();
    });
    this.addProviderText(content, copy.providers.baseUrl, provider.baseUrl, "https://api.openai.com/v1", async (value) => {
      provider.baseUrl = value.trim();
      await this.plugin.saveSettings();
    });
    content.createDiv({ cls: "xy-resource-note", text: copy.providers.responseApiRequirement });
    this.addProviderTextArea(content, copy.providers.models, getApiProviderModels(provider).join("\n"), "gpt-5.4\ngpt-5.5", async (value) => {
      const models = parseModelList(value);
      provider.models = models;
      provider.model = models[0] ?? "";
      await this.plugin.saveSettings();
      this.display();
    });
    this.addProviderText(content, copy.providers.apiKey, provider.apiKey, "sk-...", async (value) => {
      provider.apiKey = value.trim();
      await this.plugin.saveSettings();
    }, "password");
    this.addProviderTextArea(content, copy.providers.queryParams, formatQueryParams(provider.queryParams), "api-version=2026-04-28", async (value) => {
      provider.queryParams = parseQueryParams(value);
      if (!Object.keys(provider.queryParams).length) delete provider.queryParams;
      await this.plugin.saveSettings();
    });

    const errors = validateApiProvider(provider, this.plugin.settings.settingsLanguage);
    if (errors.length) content.createDiv({ cls: "xy-resource-error", text: copy.common.missing(errors) });
    if (activeProvider?.id === provider.id && this.plugin.settings.providerMode === "custom-api") {
      content.createDiv({ cls: "xy-resource-note", text: copy.providers.configChanged });
    }
  }

  private addProviderText(
    container: HTMLElement,
    label: string,
    value: string,
    placeholder: string,
    onChange: (value: string) => Promise<void>,
    type: "text" | "password" = "text"
  ): void {
    const field = container.createDiv({ cls: "xy-api-provider-field" });
    field.createDiv({ cls: "xy-api-provider-label", text: label });
    const input = field.createEl("input", {
      cls: "xy-api-provider-input",
      attr: { type, placeholder, value }
    }) as HTMLInputElement;
    input.onchange = () => void onChange(input.value);
  }

  private addOpenCodeModelPicker(container: HTMLElement): void {
    const copy = this.copy;
    const opencode = this.plugin.settings.opencode;
    const field = container.createDiv({ cls: "xy-api-provider-field xy-opencode-model-field" });
    field.createDiv({ cls: "xy-api-provider-label", text: copy.opencode.model });
    const controls = field.createDiv({ cls: "xy-opencode-model-picker xy-opencode-model-custom" });

    const selectedModel = this.openCodeModelChoices.find((model) => model.providerId === opencode.providerId && model.modelId === opencode.modelId);

    if (!this.openCodeModelsLoaded || !this.openCodeModelChoices.length) {
      controls.createDiv({
        cls: "xy-resource-note xy-opencode-model-empty",
        text: this.openCodeModelsLoading ? copy.opencode.modelLoading : copy.opencode.refreshModelHint
      });
      return;
    }

    const input = controls.createDiv({
      cls: "xy-api-provider-input" + (selectedModel ? "" : " xy-opencode-model-placeholder"),
      text: selectedModel?.displayName || copy.opencode.chooseModel,
      attr: { "aria-label": copy.opencode.chooseModel, title: copy.opencode.chooseModel }
    });

    input.onclick = () => {
      const existing = document.querySelector(".xy-composer-popover");
      if (existing) { existing.remove(); return; }

      const popover = createDiv({ cls: "xy-composer-popover" });
      document.body.appendChild(popover);
      popover.style.position = "fixed";

      const close = () => { popover.remove(); };

      // ── Provider-grouped model list (no header, directly the list) ──
      const modelSection = popover.createDiv({ cls: "xy-composer-section" });
      modelSection.createDiv({ cls: "xy-composer-section-label", text: copy.opencode.model });

      const sorted = [...this.openCodeProviders].filter((p) => (p as any).configured !== false);
      const BUILTIN_PREFIXES = ["opencode", "open-code", "xai", "local", "builtin"];
      const builtin: typeof sorted = [];
      const external: typeof sorted = [];
      for (const p of sorted) {
        (BUILTIN_PREFIXES.some((pre) => p.id.toLowerCase().startsWith(pre) || p.name.toLowerCase().startsWith(pre)) ? builtin : external).push(p);
      }
      external.sort((a, b) => a.name.localeCompare(b.name));
      const ordered = [...builtin, ...external];
      const list = popover.createDiv({ cls: "xy-composer-section" });

      for (const provider of ordered) {
        const providerModels = this.openCodeModelChoices.filter(model => model.providerId === provider.id);
        if (!providerModels.length) continue;

        const providerRow = list.createDiv({ cls: "xy-opencode-provider-row" });
        const providerHeader = providerRow.createDiv({ cls: "xy-opencode-provider-header" });
        providerHeader.createSpan({ cls: "xy-opencode-provider-name", text: provider.name || provider.id });

        const modelList = providerRow.createDiv({ cls: "xy-opencode-model-list" });
        modelList.style.display = "none";
        providerHeader.onclick = (e) => {
          e.stopPropagation();
          modelList.style.display = modelList.style.display === "none" ? "" : "none";
        };

        for (const model of providerModels) {
          const modelRow = modelList.createDiv({ cls: "xy-opencode-model-row" });
          modelRow.createSpan({ text: model.displayName.split(" · ").slice(1).join(" · ") || model.modelId });
          modelRow.onclick = async (e) => {
            e.stopPropagation();
            this.applyOpenCodeModelChoice(model);
            await this.plugin.saveSettings(true);
            close();
            this.display();
          };
          if (selectedModel && model.providerId === selectedModel.providerId && model.modelId === selectedModel.modelId) {
            modelRow.addClass("xy-opencode-model-active");
          }
        }
      }

      // ── Center popover ──
      const rect = popover.getBoundingClientRect();
      popover.style.left = `${Math.max(8, (window.innerWidth - rect.width) / 2)}px`;
      popover.style.top = `${Math.max(8, (window.innerHeight - rect.height) / 2)}px`;

      const closeHandler = (e: MouseEvent) => {
        if (!popover.contains(e.target as Node)) { close(); document.removeEventListener("mousedown", closeHandler, true); }
      };
      document.addEventListener("mousedown", closeHandler, true);
      popover.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
      setTimeout(() => popover.focus());
    };
  }

  private addOpenCodeAgentPicker(container: HTMLElement): void {
    const copy = this.copy;
    const opencode = this.plugin.settings.opencode;
    const currentValue = opencode.agent?.trim() || "build";
    const field = container.createDiv({ cls: "xy-api-provider-field xy-opencode-agent-field" });
    field.createDiv({ cls: "xy-api-provider-label", text: copy.opencode.agent });
    const controls = field.createDiv({ cls: "xy-opencode-model-picker" });
    const values = new Set(this.openCodeAgentChoices.map((agent) => openCodeAgentChoiceValue(agent)));

    if (this.openCodeAgentsLoaded && this.openCodeAgentChoices.length) {
      const select = controls.createEl("select", {
        cls: "xy-api-provider-input xy-opencode-model-select",
        attr: { "aria-label": copy.opencode.chooseAgent, title: copy.opencode.chooseAgent }
      }) as HTMLSelectElement;
      if (!values.has(currentValue)) {
        select.createEl("option", { text: copy.opencode.currentAgentMissing(currentValue), value: currentValue });
      }
      for (const agent of this.openCodeAgentChoices) {
        select.createEl("option", { text: openCodeAgentChoiceLabel(agent, this.plugin.settings.settingsLanguage), value: openCodeAgentChoiceValue(agent) });
      }
      select.value = currentValue;
      select.onchange = async () => {
        const selectedName = parseOpenCodeAgentChoiceValue(select.value);
        if (!selectedName) return;
        const selected = this.openCodeAgentChoices.find((agent) => agent.name === selectedName);
        opencode.agent = selected?.name ?? selectedName;
        await this.plugin.saveSettings(true);
        this.display();
      };
    } else {
      const input = controls.createEl("input", {
        cls: "xy-api-provider-input xy-opencode-model-select",
        attr: {
          type: "text",
          placeholder: "build",
          value: currentValue,
          "aria-label": copy.opencode.manualAgent
        }
      }) as HTMLInputElement;
      input.onchange = async () => {
        opencode.agent = input.value.trim() || "build";
        await this.plugin.saveSettings(true);
        this.display();
      };
    }

    const selectedAgent = this.openCodeAgentChoices.find((agent) => agent.name === currentValue);
    field.createDiv({
      cls: "xy-resource-note xy-opencode-model-note",
      text: selectedAgent
        ? copy.opencode.selectedAgent(selectedAgent.name, openCodeAgentModeLabel(selectedAgent, this.plugin.settings.settingsLanguage), selectedAgent.description ?? "")
        : this.openCodeAgentsLoaded
          ? copy.opencode.agentMissing(currentValue)
          : copy.opencode.agentHint
    });
  }

  private async refreshOpenCodeRuntimeOptions(options: { models?: boolean; agents?: boolean } = { models: true, agents: true }): Promise<void> {
    const copy = this.copy;
    const shouldLoadModels = options.models !== false;
    const shouldLoadAgents = options.agents !== false;
    if ((shouldLoadModels && this.openCodeModelsLoading) || (shouldLoadAgents && this.openCodeAgentsLoading)) return;
    const backend = new OpenCodeBackend({
      ...this.plugin.settings.opencode,
      vaultPath: this.plugin.getVaultPath()
    });
    if (shouldLoadModels) {
      this.openCodeModelsLoading = true;
      this.openCodeModelsError = "";
    }
    if (shouldLoadAgents) {
      this.openCodeAgentsLoading = true;
      this.openCodeAgentsError = "";
    }
    this.display();
    try {
      await backend.connect();
      const opencode = this.plugin.settings.opencode;
      if (shouldLoadModels) {
        const [models, providers] = await Promise.all([
          backend.listModels(),
          backend.listProviders()
        ]);
        this.openCodeModelChoices = models;
        this.openCodeProviders = providers;
        this.openCodeModelsLoaded = true;
        const current = models.find((model) => model.providerId === opencode.providerId && model.modelId === opencode.modelId);
        if (current) this.applyOpenCodeModelChoice(current);
      }
      if (shouldLoadAgents) {
        const agents = await backend.listAgents();
        this.openCodeAgentChoices = agents;
        this.openCodeAgentsLoaded = true;
        const current = agents.find((agent) => agent.name === opencode.agent);
        if (current) opencode.agent = current.name;
        if (!opencode.agent && agents[0]) opencode.agent = agents[0].name;
      }
      opencode.lastConnectedAt = Date.now();
      opencode.lastError = "";
      await this.plugin.saveSettings(true);
      await this.plugin.ensureOpenCodeConnected(true, { silent: true });
      if (shouldLoadModels) {
        this.openCodeDetectStatus = copy.opencode.detectSuccess(this.openCodeModelChoices.length, shouldLoadAgents ? this.openCodeAgentChoices.length : 0);
      } else if (shouldLoadAgents) {
        this.openCodeDetectStatus = copy.opencode.detectSuccess(0, this.openCodeAgentChoices.length);
      }
      const notices: string[] = [];
      if (shouldLoadModels) notices.push(copy.opencode.modelsCount(this.openCodeModelChoices.length));
      if (shouldLoadAgents) notices.push(copy.opencode.agentsCount(this.openCodeAgentChoices.length));
      new Notice(copy.opencode.readSuccess(notices));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.openCodeDetectStatus = copy.opencode.detectFailed;
      if (shouldLoadModels) this.openCodeModelsError = message;
      if (shouldLoadAgents) this.openCodeAgentsError = message;
      this.plugin.settings.opencode.lastError = message;
      await this.plugin.saveSettings(true);
      new Notice(copy.opencode.readFailed(message));
    } finally {
      await backend.disconnect().catch(() => undefined);
      if (shouldLoadModels) this.openCodeModelsLoading = false;
      if (shouldLoadAgents) this.openCodeAgentsLoading = false;
      this.display();
    }
  }

  private applyOpenCodeModelChoice(model: AgentModelInfo): void {
    const opencode = this.plugin.settings.opencode;
    opencode.providerId = model.providerId;
    opencode.modelId = model.modelId;
    opencode.textEnabled = model.inputModalities.includes("text");
    opencode.imageEnabled = model.inputModalities.includes("image");
    opencode.pdfEnabled = model.inputModalities.includes("pdf");
    this.plugin.settings.defaultModel = model.modelId;
  }

  private addKnowledgeBaseRulesFilePicker(container: HTMLElement): void {
    const copy = this.copy;
    const settings = this.plugin.settings.knowledgeBase;
    const currentPath = settings.useCustomRulesFile ? settings.rulesFilePath : AGENTS_RULES_FILE;
    const field = container.createDiv({ cls: "xy-api-provider-field" });
    field.createDiv({ cls: "xy-api-provider-label", text: copy.knowledge.rulesFile });
    const picker = field.createDiv({ cls: "xy-rules-file-picker" });
    const valueButton = picker.createEl("button", {
      cls: "xy-rules-file-value",
      attr: { type: "button", title: copy.knowledge.chooseRulesTitle }
    });
    const valueIcon = valueButton.createSpan({ cls: "xy-rules-file-icon" });
    setIcon(valueIcon, "file-cog");
    valueButton.createSpan({ text: currentPath });
    valueButton.onclick = () => this.openKnowledgeBaseRulesFilePicker();

    const chooseButton = picker.createEl("button", {
      cls: "xy-resource-tab",
      text: copy.knowledge.chooseFile,
      attr: { type: "button" }
    });
    chooseButton.onclick = () => this.openKnowledgeBaseRulesFilePicker();

    const resetButton = picker.createEl("button", {
      cls: "xy-resource-tab",
      text: copy.knowledge.useRulesFile(DEFAULT_KNOWLEDGE_BASE_RULES_FILE),
      attr: { type: "button" }
    });
    resetButton.disabled = settings.useCustomRulesFile && currentPath === DEFAULT_KNOWLEDGE_BASE_RULES_FILE;
    resetButton.onclick = async () => {
      settings.useCustomRulesFile = true;
      settings.rulesFilePath = DEFAULT_KNOWLEDGE_BASE_RULES_FILE;
      await this.plugin.saveSettings();
      this.display();
    };

    const repairButton = picker.createEl("button", {
      cls: "xy-resource-tab",
      text: copy.knowledge.repairRules,
      attr: { type: "button", title: copy.knowledge.repairRulesTitle }
    });
    repairButton.onclick = () => void this.repairKnowledgeBaseRulesFile();

    field.createDiv({
      cls: "xy-resource-note xy-rules-file-note",
      text: settings.useCustomRulesFile
        ? copy.knowledge.rulesFileNoteCustom(settings.rulesFilePath || DEFAULT_KNOWLEDGE_BASE_RULES_FILE, AGENTS_RULES_FILE)
        : copy.knowledge.rulesFileNoteLegacy(AGENTS_RULES_FILE, DEFAULT_KNOWLEDGE_BASE_RULES_FILE)
    });
  }

  private addKnowledgeBaseMemoryRecommendation(container: HTMLElement): void {
    const copy = this.copy;
    const section = container.createDiv({ cls: "xy-editor-actions-section" });
    section.createDiv({ cls: "xy-editor-actions-heading", text: copy.knowledge.memoryHeading });
    section.createDiv({
      cls: "xy-resource-note",
      text: copy.knowledge.memoryNote1
    });
    section.createDiv({
      cls: "xy-resource-note",
      text: copy.knowledge.memoryNote2
    });
    const actions = section.createDiv({ cls: "xy-api-provider-actions" });
    const openMemorySkill = actions.createEl("button", {
      cls: "xy-resource-tab",
      text: copy.knowledge.openMemorySkill,
      attr: { type: "button", title: MEMORY_LITE_URL }
    });
    openMemorySkill.onclick = () => window.open(MEMORY_LITE_URL);
  }

  private async repairKnowledgeBaseRulesFile(): Promise<void> {
    const copy = this.copy;
    const settings = this.plugin.settings.knowledgeBase;
    try {
      const result = await repairKnowledgeBaseRulesFile(this.plugin.getVaultPath(), settings);
      if (settings.useCustomRulesFile) settings.rulesFilePath = result.rulesFilePath;
      else settings.rulesFilePath = AGENTS_RULES_FILE;
      await this.plugin.saveSettings();
      this.plugin.getXiaoyuanView()?.refreshKnowledgeBaseDashboard();
      const detail = result.status === "patched" && result.missingRules.length
        ? copy.knowledge.repairPatchedDetail(result.missingRules.length)
        : "";
      new Notice(`${copy.knowledge.repairSummary(result.status, result.rulesFilePath)}${detail}`);
      this.display();
    } catch (error) {
      new Notice(copy.knowledge.repairFailed(error instanceof Error ? error.message : String(error)));
    }
  }

  private openKnowledgeBaseRulesFilePicker(): void {
    const copy = this.copy;
    const filesByPath = new Map(this.app.vault.getMarkdownFiles().map((file) => [file.path, file]));
    const files = getKnowledgeBaseRulesFileChoices(Array.from(filesByPath.keys()))
      .map((filePath) => filesByPath.get(filePath))
      .filter((file): file is TFile => file instanceof TFile);
    if (!files.length) {
      new Notice(copy.knowledge.noMarkdownFiles);
      return;
    }
    new KnowledgeBaseRulesFileSuggestModal(this.app, files, async (file) => {
      const settings = this.plugin.settings.knowledgeBase;
      settings.useCustomRulesFile = true;
      settings.rulesFilePath = sanitizeRelativeSettingsPath(file.path);
      await this.plugin.saveSettings();
      new Notice(copy.knowledge.selectedRulesFile(settings.rulesFilePath));
      this.display();
    }, copy).open();
  }

  private addProviderTextArea(
    container: HTMLElement,
    label: string,
    value: string,
    placeholder: string,
    onChange: (value: string) => Promise<void>
  ): void {
    const field = container.createDiv({ cls: "xy-api-provider-field" });
    field.createDiv({ cls: "xy-api-provider-label", text: label });
    const input = field.createEl("textarea", {
      cls: "xy-api-provider-textarea",
      attr: { placeholder }
    }) as HTMLTextAreaElement;
    input.value = value;
    input.onchange = () => void onChange(input.value);
  }

  private addEditorActionNumber(container: HTMLElement, label: string, value: number, min: number, max: number, onChange: (value: number) => Promise<void>): void {
    this.decorateSetting(
      new Setting(container)
        .setName(label)
        .addText((text) => {
          text.inputEl.type = "number";
          text.inputEl.min = String(min);
          text.inputEl.max = String(max);
          text.setValue(String(value)).onChange(async (raw) => {
            const next = parseClampedInteger(raw, value, min, max);
            await onChange(next);
          });
        }),
      "sliders-horizontal"
    );
  }

  private renderWorkspaceResourceManager(container: HTMLElement): void {
    const copy = this.copy;
    const wrapper = container.createDiv({ cls: "xy-resource-manager" });
    const header = wrapper.createDiv({ cls: "xy-resource-manager-header" });
    const title = header.createDiv({ cls: "xy-resource-manager-title" });
    const icon = title.createSpan({ cls: "xy-setting-icon" });
    setIcon(icon, "blocks");
    title.createSpan({ text: copy.resources.title });

    wrapper.createDiv({
      cls: "xy-resource-note",
      text: copy.resources.note
    });

    const tabs = wrapper.createDiv({ cls: "xy-resource-tabs" });
    for (const tab of RESOURCE_TABS) {
      const button = tabs.createEl("button", {
        cls: `xy-resource-tab ${this.plugin.settings.resourceManagementTab === tab.id ? "is-active" : ""}`,
        attr: { type: "button" }
      });
      const tabIcon = button.createSpan({ cls: "xy-resource-tab-icon" });
      setIcon(tabIcon, tab.icon);
      button.createSpan({ text: copy.resources.tabs[tab.id] });
      button.onclick = async () => {
        this.plugin.settings.resourceManagementTab = tab.id;
        await this.plugin.saveSettings();
        this.display();
      };
    }
    const refresh = tabs.createEl("button", {
      cls: "xy-resource-refresh",
      attr: { type: "button", title: copy.resources.refreshTitle }
    });
    const refreshIcon = refresh.createSpan({ cls: "xy-resource-refresh-icon" });
    setIcon(refreshIcon, "refresh-cw");
    refresh.createSpan({ text: this.resourceLoadingTab === this.plugin.settings.resourceManagementTab ? copy.common.loading : copy.common.refresh });
    refresh.disabled = this.resourceLoadingTab === this.plugin.settings.resourceManagementTab;
    refresh.onclick = () => void this.loadWorkspaceResources(true, this.plugin.settings.resourceManagementTab);

    const activeTab = this.plugin.settings.resourceManagementTab;
    this.renderResourceSearch(wrapper, activeTab);

    const body = wrapper.createDiv({ cls: "xy-resource-body" });
    const activeMeta = RESOURCE_TABS.find((tab) => tab.id === activeTab);
    const isLoading = this.resourceLoadingTab === activeTab;
    const loadError = this.resourceLoadErrors[activeTab] ?? "";
    if (isLoading) {
      body.createDiv({ cls: "xy-resource-empty", text: copy.resources.loadingTab(activeMeta ? copy.resources.tabs[activeMeta.id] : copy.tabs.resources) });
    }
    if (loadError) {
      body.createDiv({ cls: "xy-resource-error", text: copy.common.readFailed(loadError) });
    }
    if (!this.resourceLoaded[activeTab] && !isLoading && !loadError) {
      body.createDiv({ cls: "xy-resource-empty", text: copy.resources.notLoaded });
    }
    if (this.resourceSnapshot && (this.resourceLoaded[activeTab] || isLoading)) this.renderActiveResourceTab(body, this.resourceSnapshot);
    if (!this.resourceLoaded[activeTab] && !isLoading && !loadError) void this.loadWorkspaceResources(false, activeTab);
  }

  private renderResourceSearch(container: HTMLElement, tab: ResourceManagementTab): void {
    const copy = this.copy;
    const searchWrap = container.createDiv({ cls: "xy-resource-search" });
    const icon = searchWrap.createSpan({ cls: "xy-resource-search-icon" });
    setIcon(icon, "search");
    const input = searchWrap.createEl("input", {
      cls: "xy-resource-search-input",
      attr: {
        type: "search",
        placeholder: copy.resources.searchPlaceholder(copy.resources.tabs[tab]),
        "aria-label": copy.resources.searchAria
      }
    }) as HTMLInputElement;
    input.value = this.resourceSearchQuery[tab];
    input.oninput = () => {
      this.resourceSearchQuery[tab] = input.value;
      this.display();
      window.requestAnimationFrame(() => {
        const next = this.containerEl.querySelector<HTMLInputElement>(".xy-resource-search-input");
        next?.focus();
        next?.setSelectionRange(next.value.length, next.value.length);
      });
    };
    if (input.value) {
      const clear = searchWrap.createEl("button", {
        cls: "xy-resource-search-clear",
        attr: { type: "button", title: copy.resources.clearSearch, "aria-label": copy.resources.clearSearch }
      });
      setIcon(clear, "x");
      clear.onclick = () => {
        this.resourceSearchQuery[tab] = "";
        this.display();
      };
    }
  }

  private renderActiveResourceTab(container: HTMLElement, snapshot: WorkspaceResourceSnapshot): void {
    if (this.plugin.settings.resourceManagementTab === "plugins") {
      this.renderPluginResources(container, snapshot.plugins, snapshot.errors.plugins);
      return;
    }
    if (this.plugin.settings.resourceManagementTab === "mcp") {
      this.renderMcpResources(container, snapshot.mcpServers, snapshot.errors.mcp);
      return;
    }
    this.renderSkillResources(container, snapshot.skills, snapshot.errors.skills);
  }

  private renderPluginResources(container: HTMLElement, plugins: PluginInfo[], error?: string): void {
    const copy = this.copy;
    const rows = plugins.map((plugin) => ({
      key: plugin.id,
      kind: "plugins" as const,
      name: plugin.displayName || plugin.name || plugin.id,
      meta: [plugin.category, plugin.marketplace, plugin.installed ? copy.resources.installed : copy.resources.notInstalled].filter(Boolean).join(" · "),
      desc: plugin.description || plugin.id,
      enabled: resourceEnabled(this.plugin.settings.workspaceResources.plugins, plugin.id, plugin.enabled !== false)
    }));
    const query = this.resourceSearchQuery.plugins;
    const filtered = filterWorkspaceResourceRows(rows, query);
    this.renderResourceSummary(container, plugins.length, rows.filter((row) => row.enabled).length, error, filtered.length, query);
    if (!plugins.length) {
      container.createDiv({ cls: "xy-resource-empty", text: copy.resources.noPlugins });
      return;
    }
    if (!filtered.length) {
      container.createDiv({ cls: "xy-resource-empty", text: copy.resources.noPluginMatches });
      return;
    }
    for (const row of filtered) this.renderResourceRow(container, row);
  }

  private renderMcpResources(container: HTMLElement, servers: McpServerStatus[], error?: string): void {
    const copy = this.copy;
    const rows = servers.map((server) => ({
      key: server.name,
      kind: "mcpServers" as const,
      name: server.name,
      meta: `${copy.resources.toolsCount(Object.keys(server.tools ?? {}).length)} · ${server.authStatus ?? "unknown"}`,
      desc: copy.resources.mcpDesc,
      enabled: resourceEnabled(this.plugin.settings.workspaceResources.mcpServers, server.name, true)
    }));
    const query = this.resourceSearchQuery.mcp;
    const filtered = filterWorkspaceResourceRows(rows, query);
    this.renderResourceSummary(container, servers.length, rows.filter((row) => row.enabled).length, error, filtered.length, query);
    if (!this.plugin.settings.mcpEnabled && servers.length) {
      container.createDiv({ cls: "xy-resource-warning", text: copy.resources.mcpDisabledWarning });
    }
    if (!servers.length) {
      container.createDiv({ cls: "xy-resource-empty", text: copy.resources.noMcp });
      return;
    }
    if (!filtered.length) {
      container.createDiv({ cls: "xy-resource-empty", text: copy.resources.noMcpMatches });
      return;
    }
    for (const row of filtered) this.renderResourceRow(container, row);
  }

  private renderSkillResources(container: HTMLElement, skills: SkillSpec[], error?: string): void {
    const copy = this.copy;
    const rows = skills.map((skill) => ({
      key: skill.path || skill.name,
      kind: "skills" as const,
      name: `/${skill.name}`,
      meta: [skill.scope, skill.path].filter(Boolean).join(" · "),
      desc: skill.description || copy.resources.noDesc,
      enabled: resourceEnabled(this.plugin.settings.workspaceResources.skills, skill.path || skill.name, skill.enabled !== false)
    }));
    const query = this.resourceSearchQuery.skills;
    const filtered = filterWorkspaceResourceRows(rows, query);
    this.renderResourceSummary(container, skills.length, rows.filter((row) => row.enabled).length, error, filtered.length, query);
    if (!skills.length) {
      container.createDiv({ cls: "xy-resource-empty", text: copy.resources.noSkills });
      return;
    }
    if (!filtered.length) {
      container.createDiv({ cls: "xy-resource-empty", text: copy.resources.noSkillMatches });
      return;
    }
    for (const row of filtered) this.renderResourceRow(container, row);
  }

  private renderResourceSummary(container: HTMLElement, total: number, enabled: number, error?: string, visible = total, query = ""): void {
    const copy = this.copy;
    const searching = Boolean(query.trim());
    container.createDiv({ cls: "xy-resource-summary", text: copy.resources.summary(enabled, total, visible, searching) });
    if (error) container.createDiv({ cls: "xy-resource-error", text: copy.common.partialReadFailed(error) });
  }

  private renderResourceRow(
    container: HTMLElement,
    item: WorkspaceResourceSearchRow & {
      kind: "plugins" | "mcpServers" | "skills";
      enabled: boolean;
    }
  ): void {
    const copy = this.copy;
    const row = container.createDiv({ cls: `xy-resource-row ${item.enabled ? "is-enabled" : "is-disabled"}` });
    const icon = row.createSpan({ cls: "xy-resource-row-icon" });
    setIcon(icon, item.kind === "skills" ? "sparkles" : item.kind === "mcpServers" ? "blocks" : "package");
    const content = row.createDiv({ cls: "xy-resource-row-content" });
    content.createDiv({ cls: "xy-resource-row-name", text: item.name, attr: { title: item.name } });
    if (item.meta) content.createDiv({ cls: "xy-resource-row-meta", text: item.meta, attr: { title: item.meta } });
    if (item.desc) content.createDiv({ cls: "xy-resource-row-desc", text: item.desc, attr: { title: item.desc } });
    const toggle = row.createEl("input", {
      cls: "xy-resource-toggle",
      attr: { type: "checkbox", "aria-label": copy.resources.toggleAria(item.name) }
    }) as HTMLInputElement;
    toggle.checked = item.enabled;
    toggle.onchange = async () => {
      this.plugin.settings.workspaceResources[item.kind][item.key] = toggle.checked;
      await this.plugin.saveSettings(true);
      this.display();
    };
  }

  private async loadWorkspaceResources(force = false, tab: ResourceManagementTab = this.plugin.settings.resourceManagementTab): Promise<void> {
    if (this.resourceLoadingTab === tab) return;
    if (this.resourceLoaded[tab] && !force) return;
    this.resourceLoadingTab = tab;
    delete this.resourceLoadErrors[tab];
    this.display();
    try {
      const status = await this.plugin.ensureOpenCodeConnected();
      if (!status.connected) throw new Error(this.copy.resources.disconnectedLabel);
      const result = await this.loadResourceTab(tab);
      this.resourceSnapshot = mergeWorkspaceResourceSnapshot(this.resourceSnapshot, result.kind, result.data, result.error);
      this.resourceLoaded[tab] = true;
      this.plugin.settings.workspaceResourceCache = updateWorkspaceResourceCache(
        this.plugin.settings.workspaceResourceCache,
        result.kind,
        result.data,
        result.error
      );
      if (this.plugin.lastStatus) {
        if (tab === "skills") this.plugin.lastStatus.skills = this.resourceSnapshot.skills;
        if (tab === "mcp") this.plugin.lastStatus.mcpServers = this.resourceSnapshot.mcpServers;
      }
      await this.plugin.saveSettings(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.resourceLoadErrors[tab] = message;
      const kind = resourceKindForTab(tab);
      this.resourceSnapshot = mergeWorkspaceResourceSnapshot(this.resourceSnapshot, kind, [], message);
      this.resourceLoaded[tab] = true;
      this.plugin.settings.workspaceResourceCache = updateWorkspaceResourceCache(this.plugin.settings.workspaceResourceCache, kind, [], message);
      await this.plugin.saveSettings(true);
    } finally {
      this.resourceLoadingTab = null;
      this.display();
    }
  }

  private async loadResourceTab(tab: ResourceManagementTab): Promise<{ kind: WorkspaceResourceKind; data: PluginInfo[] | SkillSpec[] | McpServerStatus[]; error: string | null }> {
    try {
      if (tab === "plugins") {
        return { kind: "plugins", data: [], error: null };
      }
      if (tab === "mcp") {
        return { kind: "mcp", data: [], error: null };
      }
      return { kind: "skills", data: [], error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (tab === "plugins") return { kind: "plugins", data: [], error: message };
      if (tab === "mcp") return { kind: "mcp", data: [], error: message };
      return { kind: "skills", data: [], error: message };
    }
  }

  private addStatusRow(container: HTMLElement, iconName: string, label: string, value: string): void {
    const row = container.createDiv({ cls: "xy-settings-status-row" });
    const icon = row.createSpan({ cls: "xy-settings-status-icon" });
    setIcon(icon, iconName);
    row.createSpan({ cls: "xy-settings-status-label", text: label });
    row.createSpan({ cls: "xy-settings-status-value", text: value });
  }

  private decorateSetting(setting: Setting, iconName: string): Setting {
    const nameEl = (setting as any).nameEl as HTMLElement | undefined;
    if (!nameEl) return setting;
    const settingEl = (setting as any).settingEl as HTMLElement | undefined;
    settingEl?.addClass("xy-setting-with-icon");
    nameEl.addClass("xy-setting-name-with-icon");
    const icon = document.createElement("span");
    icon.addClass("xy-setting-icon");
    setIcon(icon, iconName);
    nameEl.prepend(icon);
    return setting;
  }
}

const RESOURCE_TABS: Array<{ id: ResourceManagementTab; icon: string }> = [
  { id: "plugins", icon: "package" },
  { id: "mcp", icon: "blocks" },
  { id: "skills", icon: "sparkles" }
];

const SETTINGS_TABS: Array<{ id: SettingsTab; icon: string }> = [
  { id: "general", icon: "settings" },
  { id: "providers", icon: "key-round" },
  { id: "resources", icon: "blocks" },
  { id: "editorActions", icon: "wand-sparkles" },
  { id: "knowledgeBase", icon: "library" },
  { id: "review", icon: "bar-chart-3" }
];

const EDITOR_ACTION_QUALITY_MODES: Array<{ id: EditorActionQualityMode; icon: string }> = [
  { id: "fast", icon: "zap" },
  { id: "quality", icon: "file-search" },
  { id: "strict", icon: "shield-check" }
];

function normalizeEditorActionQualityModeForUi(value: string): EditorActionQualityMode {
  return value === "fast" || value === "quality" || value === "strict" ? value : "quality";
}

function editorActionIcon(actionId: string): string {
  if (actionId === "expand") return "text";
  if (actionId === "continue") return "forward";
  if (actionId === "translate") return "languages";
  return "sparkles";
}

function resourceKindForTab(tab: ResourceManagementTab): WorkspaceResourceKind {
  return tab === "mcp" ? "mcp" : tab === "skills" ? "skills" : "plugins";
}



function detectOpenCodePath(customPath: string, copy: SettingsCopy = settingsCopy("zh-CN")): string {
  const found = detectOpenCodeCommand(customPath);
  return found ? copy.common.detected(found) : copy.common.notDetectedManual;
}



function agentBackendLabel(value: AgentBackendMode, copy: SettingsCopy = settingsCopy("zh-CN")): string {
  return copy.backendLabels[value] ?? "OpenCode API";
}

function normalizeSettingsLanguageForUi(value: string): SettingsLanguage {
  return normalizeSettingsLanguage(value);
}

class KnowledgeBaseRulesFileSuggestModal extends FuzzySuggestModal<TFile> {
  constructor(app: App, private readonly files: TFile[], private readonly onChoose: (file: TFile) => Promise<void>, copy: SettingsCopy) {
    super(app);
    this.setPlaceholder(copy.knowledge.filePickerPlaceholder);
    this.emptyStateText = copy.knowledge.filePickerEmpty;
    this.limit = 40;
  }

  getItems(): TFile[] {
    return this.files;
  }

  getItemText(file: TFile): string {
    return file.path;
  }

  renderSuggestion(item: FuzzyMatch<TFile>, el: HTMLElement): void {
    const path = item.item.path;
    const name = path.split("/").pop() ?? path;
    el.createDiv({ cls: "suggestion-title", text: name });
    el.createDiv({ cls: "suggestion-note", text: path });
  }

  onChooseItem(file: TFile, _evt: MouseEvent | KeyboardEvent): void {
    void this.onChoose(file);
  }
}

function normalizeAgentBackendForUi(value: string): AgentBackendMode {
  return "opencode";
}

function normalizeKnowledgeBackendForUi(value: string): KnowledgeBaseBackendMode {
  return "opencode";
}

function knowledgeStatusLabel(value: string, copy: SettingsCopy = settingsCopy("zh-CN")): string {
  return copy.knowledge.statusLabels[value as keyof typeof copy.knowledge.statusLabels] ?? copy.knowledge.statusLabels.idle;
}

function knowledgeInitStatusLabel(value: string, copy: SettingsCopy = settingsCopy("zh-CN")): string {
  return copy.knowledge.initStatusLabels[value as keyof typeof copy.knowledge.initStatusLabels] ?? copy.knowledge.initStatusLabels["not-started"];
}

function pluginInstallDir(plugin: XiaoyuanPlugin): string {
  const dir = (plugin.manifest as any).dir;
  return dir ? `${dir}/` : ".obsidian/plugins/xiaoyuan/";
}

function formatStorageBytes(value: number): string {
  if (value < 1024) return `${value}B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)}KB`;
  return `${(value / 1024 / 1024).toFixed(1)}MB`;
}

function formatQueryParams(params?: Record<string, string>): string {
  return Object.entries(params ?? {})
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
}

function parseQueryParams(value: string): Record<string, string> {
  const params: Record<string, string> = {};
  for (const line of value.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;
    const key = trimmed.slice(0, separator).trim();
    const paramValue = trimmed.slice(separator + 1).trim();
    if (/^[A-Za-z0-9_-]+$/.test(key) && paramValue) params[key] = paramValue;
  }
  return params;
}

function sanitizeRelativeSettingsPath(value: string): string {
  const clean = value.replace(/\\/g, "/").replace(/^\/+/, "").split("/").filter((part) => part && part !== "." && part !== "..").join("/");
  return clean || DEFAULT_KNOWLEDGE_BASE_RULES_FILE;
}

function parseModelList(value: string): string[] {
  const seen = new Set<string>();
  const models: string[] = [];
  for (const line of value.split(/\r?\n/)) {
    const model = line.trim();
    if (!model || seen.has(model)) continue;
    seen.add(model);
    models.push(model);
  }
  return models;
}

function parseClampedInteger(value: string, fallback: number, min: number, max: number): number {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}
