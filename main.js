"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => TalosDashboardPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// src/view.ts
var import_obsidian = require("obsidian");
var VIEW_TYPE_TALOS_DASHBOARD = "talos\u2011dashboard\u2011view";
var TaskDetailModal = class extends import_obsidian.Modal {
  constructor(app, task) {
    super(app);
    this.task = task;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h3", { text: this.task.title });
    contentEl.createEl("p", { text: `\u72B6\u6001\uFF1A${this.task.status}` });
    contentEl.createEl("p", { text: `\u65F6\u95F4\uFF1A${this.task.startTime} ~ ${this.task.endTime}` });
    contentEl.createEl("p", { text: `\u8DEF\u5F84\uFF1A${this.task.filePath}` });
  }
  onClose() {
    this.contentEl.empty();
  }
};
var TalosDashboardView = class extends import_obsidian.ItemView {
  constructor(leaf, app) {
    super(leaf);
    this.app = app;
    this.dataviewApi = null;
    this.taskList = [];
    this.filterStatus = "all";
    this.timerInterval = null;
    this.timerSeconds = 0;
    this.timerRunning = false;
    // 甘特拖拽状态
    this.dragging = false;
    this.dragTaskId = null;
  }
  getViewType() {
    return VIEW_TYPE_TALOS_DASHBOARD;
  }
  getDisplayText() {
    return "Talos Dashboard";
  }
  getIcon() {
    return "layout\u2011dashboard";
  }
  async onOpen() {
    this.contentEl.empty();
    await this.loadDataview();
    await this.fetchTasks();
    this.renderDashboard();
  }
  async loadDataview() {
    const dvPlugin = this.app.plugins.plugins["dataview"];
    if (dvPlugin) {
      this.dataviewApi = dvPlugin.api;
    }
  }
  async fetchTasks() {
    this.taskList = [];
    if (!this.dataviewApi)
      return;
    try {
      const pages = this.dataviewApi.pages("#task");
      for (const page of pages.values) {
        this.taskList.push({
          id: page.file.path,
          title: page.file.name,
          status: page.status || "todo",
          startTime: page.start || "",
          endTime: page.deadline || "",
          filePath: page.file.path,
          tags: page.tags ?? []
        });
      }
    } catch (err) {
      console.error("\u8BFB\u53D6Dataview\u4EFB\u52A1\u5931\u8D25", err);
    }
  }
  renderDashboard() {
    this.contentEl.empty();
    const root = this.contentEl.createDiv("talos\u2011dash\u2011root");
    root.style.cssText = `
			padding:24px;
			display:flex;
			flex\u2011direction:column;
			gap:24px;
			box\u2011sizing:border\u2011box;
		`;
    const header = root.createDiv();
    header.style.cssText = `display:flex;justify\u2011content:space\u2011between;align\u2011items:center;flex\u2011wrap:wrap;gap:12px`;
    header.createEl("h2", { text: "Talos \u4EFB\u52A1\u4EEA\u8868\u76D8" });
    const filterWrap = header.createDiv();
    const select = filterWrap.createEl("select");
    ["all", "todo", "in\u2011progress", "done"].forEach((v) => {
      const opt = select.createEl("option", { text: v });
      opt.value = v;
    });
    select.value = this.filterStatus;
    select.onchange = async () => {
      this.filterStatus = select.value;
      this.renderDashboard();
    };
    const timerCard = root.createDiv();
    timerCard.style.cssText = `
			border:1px solid var(--background\u2011modifier\u2011border);
			border\u2011radius:16px;
			padding:20px;
			backdrop\u2011filter:blur(12px);
		`;
    timerCard.createEl("h4", { text: "\u23F1 \u4E13\u6CE8\u8BA1\u65F6\u5668" });
    const timerDom = timerCard.createEl("div");
    timerDom.style.fontSize = "36px";
    timerDom.style.margin = "12px 0";
    timerDom.textContent = this.formatTime(this.timerSeconds);
    const btnRow = timerCard.createDiv();
    btnRow.style.display = "flex";
    btnRow.style.gap = "10px";
    const btnStart = btnRow.createEl("button", { text: "\u5F00\u59CB" });
    const btnPause = btnRow.createEl("button", { text: "\u6682\u505C" });
    const btnReset = btnRow.createEl("button", { text: "\u91CD\u7F6E" });
    btnStart.onclick = () => this.startTimer(timerDom);
    btnPause.onclick = () => this.pauseTimer();
    btnReset.onclick = () => this.resetTimer(timerDom);
    const ganttCard = root.createDiv();
    ganttCard.style.cssText = `
			border:1px solid var(--background\u2011modifier\u2011border);
			border\u2011radius:16px;
			padding:20px;
			overflow\u2011x:auto;
		`;
    ganttCard.createEl("h4", { text: "\u{1F4CA} \u4EFB\u52A1\u7518\u7279\u56FE\uFF08\u53EF\u62D6\u62FD\uFF09" });
    const ganttContainer = ganttCard.createDiv("talos\u2011gantt\u2011container");
    ganttContainer.style.minHeight = "260px";
    this.renderGantt(ganttContainer);
    const taskCard = root.createDiv();
    taskCard.style.cssText = `
			border:1px solid var(--background\u2011modifier\u2011border);
			border\u2011radius:16px;
			padding:20px;
		`;
    taskCard.createEl("h4", { text: "\u{1F4CB} \u4EFB\u52A1\u5217\u8868" });
    const listWrap = taskCard.createDiv();
    let showTasks = this.filterStatus === "all" ? this.taskList : this.taskList.filter((t) => t.status === this.filterStatus);
    if (showTasks.length === 0) {
      listWrap.createEl("p", { text: "\u6682\u65E0\u5339\u914D\u4EFB\u52A1" });
    } else {
      for (const t of showTasks) {
        const item = listWrap.createDiv();
        item.style.cssText = `padding:10px 0;border\u2011bottom:1px solid var(--background\u2011modifier\u2011border);cursor:pointer`;
        item.createEl("div", { text: `[${t.status}] ${t.title}` });
        item.createEl("small", { text: `${t.startTime} ~ ${t.endTime}` });
        item.onclick = () => {
          new TaskDetailModal(this.app, t).open();
        };
      }
    }
  }
  renderGantt(container) {
    container.empty();
    let showTasks = this.filterStatus === "all" ? this.taskList : this.taskList.filter((t) => t.status === this.filterStatus);
    if (showTasks.length === 0) {
      container.createEl("p", { text: "\u65E0\u7518\u7279\u4EFB\u52A1" });
      return;
    }
    for (const task of showTasks) {
      const row = container.createDiv();
      row.style.cssText = `display:flex;align\u2011items:center;margin:8px 0;min\u2011height:32px`;
      const label = row.createEl("span", { text: task.title });
      label.style.width = "240px";
      label.style.flexShrink = "0";
      const barWrap = row.createDiv();
      barWrap.style.cssText = `flex:1;height:26px;position:relative;margin\u2011left:12px`;
      const bar = barWrap.createDiv();
      bar.style.cssText = `
				position:absolute;
				top:0;
				height:26px;
				background:var(--interactive\u2011accent);
				opacity:0.75;
				border\u2011radius:6px;
				min\u2011width:40px;
			`;
      bar.style.left = "0%";
      bar.style.width = "35%";
      bar.title = `${task.startTime} ${task.endTime}`;
      const handleLeft = bar.createDiv();
      handleLeft.style.cssText = `
				position:absolute;
				width:8px;height:100%;
				left:-4px;top:0;
				cursor:w\u2011resize;background:rgba(255,255,255,0.3);
			`;
      const handleRight = bar.createDiv();
      handleRight.style.cssText = `
				position:absolute;
				width:8px;height:100%;
				right:-4px;top:0;
				cursor:e\u2011resize;background:rgba(255,255,255,0.3);
			`;
      handleLeft.onmousedown = (evt) => {
        evt.stopPropagation();
        this.dragging = true;
        this.dragTaskId = task.id;
      };
      handleRight.onmousedown = (evt) => {
        evt.stopPropagation();
        this.dragging = true;
        this.dragTaskId = task.id;
      };
    }
    container.onmouseup = () => {
      if (this.dragging) {
        this.dragging = false;
        this.dragTaskId = null;
      }
    };
  }
  // 计时器工具
  startTimer(el) {
    if (this.timerRunning)
      return;
    this.timerRunning = true;
    this.timerInterval = window.setInterval(() => {
      this.timerSeconds += 1;
      el.textContent = this.formatTime(this.timerSeconds);
    }, 1e3);
  }
  pauseTimer() {
    this.timerRunning = false;
    if (this.timerInterval)
      clearInterval(this.timerInterval);
  }
  resetTimer(el) {
    this.pauseTimer();
    this.timerSeconds = 0;
    el.textContent = this.formatTime(0);
  }
  formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  async onClose() {
    if (this.timerInterval)
      clearInterval(this.timerInterval);
    this.contentEl.empty();
  }
};

// src/settings.ts
var import_obsidian2 = require("obsidian");
var TalosSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Talos-Dashboard \u8BBE\u7F6E" });
    new import_obsidian2.Setting(containerEl).setName("\u6570\u636E\u6E90").setDesc("mock:\u6A21\u62DF\u6570\u636E;dataview:\u8BFB\u53D6Vault Tasks/Review\u6587\u4EF6\u5939\u7B14\u8BB0").addDropdown((drop) => drop.addOption("mock", "Mock\u6A21\u62DF\u6570\u636E").addOption("dataview", "Dataview\u771F\u5B9EVault\u6570\u636E").setValue(this.plugin.settings.dataSource).onChange(async (val) => {
      this.plugin.settings.dataSource = val;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName("\u5361\u7247\u900F\u660E\u5EA6").addSlider((s) => s.setLimits(0.2, 1, 0.05).setValue(this.plugin.settings.cardOpacity).onChange(async (v) => {
      this.plugin.settings.cardOpacity = v;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName("\u5361\u7247\u6A21\u7CCA px").addSlider((s) => s.setLimits(0, 32, 1).setValue(this.plugin.settings.cardBlur).onChange(async (v) => {
      this.plugin.settings.cardBlur = v;
      await this.plugin.saveSettings();
    }));
  }
};

// src/main.ts
var DEFAULT_SETTINGS = {
  dataSource: "mock",
  cardOpacity: 0.7,
  cardBlur: 16
};
var TalosDashboardPlugin = class extends import_obsidian3.Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new TalosSettingTab(this.app, this));
    this.registerView(VIEW_TYPE_TALOS_DASHBOARD, (leaf) => new TalosDashboardView(leaf, this));
    this.addRibbonIcon("layout-dashboard", "\u6253\u5F00Talos-Dashboard\u4EEA\u8868\u76D8", () => {
      this.activateView();
    });
    this.addCommand({
      id: "open-talos-dashboard",
      name: "\u6253\u5F00Talos-Dashboard\u4EEA\u8868\u76D8",
      callback: () => {
        this.activateView();
      }
    });
  }
  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_TALOS_DASHBOARD)[0];
    if (!leaf)
      leaf = workspace.getRightLeaf(false);
    await leaf.setViewState({ type: VIEW_TYPE_TALOS_DASHBOARD, active: true });
    workspace.revealLeaf(leaf);
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
