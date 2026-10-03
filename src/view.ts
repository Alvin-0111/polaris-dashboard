import { ItemView, WorkspaceLeaf, Notice, Menu } from "obsidian";
import { pinyin } from "pinyin-pro";
import { Lunar } from "lunar-typescript";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { TALOS_STYLES } from "./styles";

echarts.use([PieChart, TooltipComponent, CanvasRenderer]);
import type PolarisDashboardPlugin from "./main";
import type { PomodoroSession, Habit, CheckinRecords, ReviewRecord, ReviewSession, ReviewConfig } from "./main";

export const VIEW_TYPE_TALOS_DASHBOARD = "polaris-dashboard-view";
export type DataviewApi = any;

// ===== 背景壁纸预设（深色主题沉浸玻璃场景，设置面板可切换）=====
export const WALLPAPER_PRESETS: Record<string, string> = {
	aurora: `url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80&auto=format&fit=crop') center / cover no-repeat, linear-gradient(180deg, #10101a 0%, #14141e 55%, #0a0a12 100%)`,
	sunset: `url('https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&q=80&auto=format&fit=crop') center / cover no-repeat, linear-gradient(180deg, #1a1228 0%, #241a30 55%, #14101c 100%)`,
	ocean: `url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80&auto=format&fit=crop') center / cover no-repeat, linear-gradient(180deg, #0a1420 0%, #101a28 55%, #080d16 100%)`,
	forest: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80&auto=format&fit=crop') center / cover no-repeat, linear-gradient(180deg, #0e1410 0%, #121a14 55%, #080d0a 100%)`,
};
export const WALLPAPER_FALLBACK_DARK = `radial-gradient(ellipse 70% 55% at 15% -8%, rgba(88, 130, 255, 0.55), transparent 62%), radial-gradient(ellipse 60% 45% at 85% 2%, rgba(255, 90, 150, 0.38), transparent 62%), radial-gradient(ellipse 75% 55% at 60% 55%, rgba(150, 95, 255, 0.42), transparent 62%), radial-gradient(ellipse 55% 45% at 92% 100%, rgba(60, 210, 190, 0.35), transparent 62%), linear-gradient(180deg, #14141e 0%, #1a1228 55%, #10101a 100%), var(--bg-primary)`;

export interface WorkTask {
	id: string; title: string; priority: "P0" | "P1" | "P2";
	status: "todo" | "doing" | "done"; progress: number; dueDate: string; overdue: boolean;
	notePath?: string;
	startDate?: string; // 开始日期，格式 MM/DD
	assignee?: string; // 负责人
	completedDate?: string; // 完成日期，格式 YYYY-MM-DD，用于判断是否在今日待办中显示
}

// ===== Lucide 线性图标系统（ISC 许可，2px 描边 / 圆角端点，与参考风格一致）=====
const LUCIDE_BODY: Record<string, string> = {
	chart: `<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>`,
	book: `<path d="M12 5v16"/><path d="M20.001 19A2 2 0 0 0 22 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2 5 5 0 0 1 4-2z"/>`,
	target: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,
	calendar: `<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>`,
	box: `<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>`,
	trash: `<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>`,
	pin: `<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z"/>`,
	user: `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
	timeline: `<path d="M4 12h.01"/><path d="M4 16h.01"/><path d="M4 20h.01"/><path d="M4 4h.01"/><path d="M4 8h.01"/><path d="M9.414 13.414a2 2 0 0 0 1.414.586H19a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-8.172a2 2 0 0 0-1.414.586L8 12z"/><path d="M9.414 21.414a2 2 0 0 0 1.414.586H19a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-8.172a2 2 0 0 0-1.414.586L8 20z"/><path d="M9.414 5.414A2 2 0 0 0 10.828 6H19a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-8.172a2 2 0 0 0-1.414.586L8 4z"/>`,
	kanban: `<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 7v7"/><path d="M12 7v4"/><path d="M16 7v9"/>`,
	chartLine: `<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>`,
	trendingUp: `<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>`,
	layers: `<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>`,
	flame: `<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>`,
	tags: `<path d="M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z"/><path d="M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193"/><circle cx="10.5" cy="6.5" r=".5" fill="currentColor"/>`,
	star: `<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>`,
	clock: `<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>`,
	rocket: `<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/>`,
	refreshCw: `<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>`,
	timer: `<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>`,
	alert: `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>`,
	brain: `<path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/>`,
	search: `<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>`,
	file: `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>`,
	filePlus: `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M9 15h6"/><path d="M12 18v-6"/>`,
	check: `<path d="M20 6 9 17l-5-5"/>`,
	circleCheck: `<circle cx="12" cy="12" r="10"/><path d="m16 9-5.5 5.5L8 12"/>`,
	quote: `<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>`,
	lightbulb: `<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>`,
	pen: `<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>`,
	notebookPen: `<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>`,
	clipboard: `<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>`,
	listTodo: `<path d="M13 5h8"/><path d="M13 12h8"/><path d="M13 19h8"/><path d="m3 17 2 2 4-4"/><rect x="3" y="4" width="6" height="6" rx="1"/>`,
	plus: `<path d="M5 12h14"/><path d="M12 5v14"/>`,
	settings: `<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>`,
	sun: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`,
	moon: `<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>`,
	link: `<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>`,
	layoutTemplate: `<rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="16" y="14" rx="1"/>`,
	zap: `<path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"/>`,
	mic: `<path d="M12 19v3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/>`,
	sparkles: `<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>`,
	folder: `<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>`,
	folderTree: `<path d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"/><path d="M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"/><path d="M3 5a2 2 0 0 0 2 2h3"/><path d="M3 3v13a2 2 0 0 0 2 2h3"/>`,
	activity: `<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>`,
	gauge: `<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>`,
};

const lucideIcon = (name: string, size = 14): string =>
	`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2.5px;flex-shrink:0;pointer-events:none;">${LUCIDE_BODY[name] || ""}</svg>`;

const boardMeta = {
	work: { title: "工作看板", icon: "💼" },
	knowledge: { title: "知识库看板", icon: "📚" },
	review: { title: "复习看板", icon: "🎯" },
	calendar: { title: "日历看板", icon: "📅" },
};

const ganttPhases = [
	{ name: "需求评审", start: 3, end: 12, color: "#22c55e" },
	{ name: "产品设计", start: 5, end: 20, color: "#fbbf24" },
	{ name: "开发实现", start: 10, end: 25, color: "#22c55e" },
	{ name: "测试验证", start: 18, end: 31, color: "#a78bfa" },
];

const kanbanColumns = [
	{ key: "todo", name: "待办", color: "#9ca3af" },
	{ key: "doing", name: "进行中", color: "#60a5fa" },
	{ key: "done", name: "已完成", color: "#22c55e" },
];

const weeklyLearning = [
	{ name: "Lenny's Newsletter", progress: 60 },
	{ name: "计算机组成原理", progress: 35 },
	{ name: "黑客与画家", progress: 100 },
];

// 遗忘阶梯（天）：完成复习后按此间隔再次到期；走完整个阶梯视为「已掌握」
const REVIEW_INTERVALS = [1, 3, 7, 14, 30];
// 复习候选池 = PARA 白名单文件夹
const REVIEW_INCLUDE_FOLDERS = ["01-Projects-项目", "02-Areas-领域", "03-Resources-资源"];
// 以下三项为默认值，可在 ⚙️ 设置面板调整（存 data.json 的 reviewConfig）
const REVIEW_NEW_WINDOW_DAYS = 30;
const REVIEW_QUEUE_LIMIT = 15;
const REVIEW_MINUTES_PER_ITEM = 5;

export class PolarisDashboardView extends ItemView {
	dataviewApi: DataviewApi | null = null;
	plugin: PolarisDashboardPlugin | null = null;

	private currentBoard = "work";
	private ganttMode = "month";
	private kanbanFilter = "all";
	private kanbanSearch = ""; // 看板搜索关键词
	private _searchDebounceTimer: number | undefined = undefined; // 搜索输入防抖定时器（DOM 的 clearTimeout 只接受 number | undefined）
	private heatmapMode = "month"; // month / year
	private outputMode = "month"; // 笔记产出视图：year / month / week

	// 番茄时钟状态
	private pomodoroMode: "focus" | "shortBreak" | "longBreak" = "focus";
	private pomodoroTime = 25 * 60; // 剩余秒数
	private pomodoroRunning = false;
	private pomodoroInterval: any = null;
	private pomodoroSettings = { focus: 25, shortBreak: 5, longBreak: 15 };
	private pomodoroTodayCount = 0;
	private pomodoroTodayFocus = 0; // 今日专注总秒数
	private pomodoroCompletedInCycle = 0; // 当前周期完成的专注数（每4个后长休息）
	private pomodoroSessions: PomodoroSession[] = []; // 所有番茄钟 session 历史
	private currentPomodoroTaskId: string | null = null; // 当前番茄钟关联的任务ID
	private currentPomodoroTaskTitle = "未关联任务"; // 当前番茄钟关联的任务标题
	private showPomodoroHistory = false; // 是否显示番茄钟历史
	private reviewRecords: ReviewRecord[] = []; // 复习记录（持久化 data.json）
	private reviewSessions: ReviewSession[] = []; // 复习会话历史（按天聚合）
	private checkinRecords: CheckinRecords = {}; // 日期 -> 习惯ID -> 是否完成
	private habits: Habit[] = []; // 习惯列表
	private checkinWeekOffset = 0; // 打卡日历查看的周偏移量（0=本周，-1=上周...）
	private selectedCheckinDate = ""; // 打卡日历中选中的日期，用于显示当天详情
	private calExpandCloseHandler: ((e: MouseEvent) => void) | null = null; // 就地展开日历的全局关闭监听器
	private datePickerEl: HTMLElement | null = null; // 任务日期选择浮层（仿飞书多维表格点选）
	private datePickerCloseHandler: ((e: MouseEvent) => void) | null = null; // 日期浮层全局关闭监听器
	private todoExpandCloseHandler: ((e: MouseEvent) => void) | null = null; // 今日待办就地展开的全局关闭监听器
	private todoExpandTaskId: string | null = null; // 当前就地展开的任务 id
	private workTasks: WorkTask[] = []; // 任务数据，从 pluginData 加载，持久化到 data.json
	private theme: "dark" | "light" = "dark";
	private styleEl: HTMLStyleElement | null = null;
	private rootEl: HTMLElement | null = null;
	private currentDetailTaskId: string | null = null;
	private draggedTaskId: string | null = null; // 当前拖拽的任务ID
	private _justDragged = false; // 标记是否刚完成拖拽（避免拖拽后误触发点击）
	private kbRefreshTimer: number | null = null; // 知识库看板刷新防抖计时器
	private _docAborters: AbortController[] = []; // document 级监听器的控制器（onClose 统一 abort）
	private _activeDragFinish: (() => void) | null = null; // 当前拖拽清理函数（面板重建/视图关闭时先取消）

	constructor(leaf: WorkspaceLeaf) { super(leaf); }
	getViewType() { return VIEW_TYPE_TALOS_DASHBOARD; }
	getDisplayText() { return "Polaris Dashboard"; }
	getIcon() { return "layout-dashboard"; }

	async onOpen() {
		try {
			const container = this.containerEl.children[1] as HTMLElement;
		container.empty();
		this.injectStyles();

		// 加载打卡数据
		if (this.plugin?.pluginData?.checkinRecords) {
			this.checkinRecords = JSON.parse(JSON.stringify(this.plugin.pluginData.checkinRecords));
		}
		// 加载习惯列表
		if (this.plugin?.pluginData?.habits) {
			this.habits = JSON.parse(JSON.stringify(this.plugin.pluginData.habits));
		}

		// 加载任务数据（持久化到 data.json）
		if (this.plugin?.pluginData?.workTasks && this.plugin.pluginData.workTasks.length > 0) {
			this.workTasks = JSON.parse(JSON.stringify(this.plugin.pluginData.workTasks));
		}

		// 加载番茄钟 session 历史
		if (this.plugin?.pluginData?.pomodoroSessions) {
			this.pomodoroSessions = JSON.parse(JSON.stringify(this.plugin.pluginData.pomodoroSessions));
			// 计算今日统计
			const today = new Date().toISOString().split("T")[0];
			const todaySessions = this.pomodoroSessions.filter((s) => s.completedAt.startsWith(today) && s.mode === "focus");
			this.pomodoroTodayCount = todaySessions.length;
			this.pomodoroTodayFocus = todaySessions.reduce((sum, s) => sum + s.duration, 0);
		}

		// 加载复习记录与复习会话
		if (this.plugin?.pluginData?.reviewRecords) {
			this.reviewRecords = JSON.parse(JSON.stringify(this.plugin.pluginData.reviewRecords));
		}
		if (this.plugin?.pluginData?.reviewSessions) {
			this.reviewSessions = JSON.parse(JSON.stringify(this.plugin.pluginData.reviewSessions));
		}

		// 加载自定义每日一句文案库（为空时使用内置文案）
		if (this.plugin?.pluginData?.dailyQuotes && this.plugin.pluginData.dailyQuotes.length > 0) {
			this.userQuotes = JSON.parse(JSON.stringify(this.plugin.pluginData.dailyQuotes));
		}
		// 加载自定义纪念日/生日
		if (this.plugin?.pluginData?.milestones) {
			this.userMilestones = JSON.parse(JSON.stringify(this.plugin.pluginData.milestones));
		}
		// 加载每日一签抽签记录（当天锁定）
		if (this.plugin?.pluginData?.dailySignRecord) {
			this.dailySignRecord = JSON.parse(JSON.stringify(this.plugin.pluginData.dailySignRecord));
		}

		// 加载外观设置（主题 / 卡片透明度 / 毛玻璃模糊，持久化不丢）
		if (this.plugin?.pluginData?.theme) {
			this.theme = this.plugin.pluginData.theme;
		}

		// 加载卡片布局（顺序与宽度）
		this.loadCardLayout();

		this.rootEl = container.createDiv({ cls: "polaris-dashboard" });

		this.rootEl.setAttribute("data-theme", this.theme);
		this.rootEl.setAttribute("style", "width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden;");
		// 应用持久化的透明度 / 模糊设置
		const _cfg = this.plugin?.pluginData;
		if (_cfg?.cardOpacity != null) this.rootEl.style.setProperty("--card-opacity", String(_cfg.cardOpacity));
		if (_cfg?.cardBlur != null) this.rootEl.style.setProperty("--card-blur", _cfg.cardBlur + "px");
		this.applyWallpaper();

		this.renderApp();
		// 监听文件增删与链接解析完成：自动刷新知识库看板（删除空笔记/修复断链后统计实时更新）
		this.registerEvent(this.app.vault.on("create", () => this.scheduleKnowledgeRefresh()));
		this.registerEvent(this.app.vault.on("delete", () => this.scheduleKnowledgeRefresh()));
		this.registerEvent(this.app.metadataCache.on("changed", () => this.scheduleKnowledgeRefresh()));
		} catch (e: any) {
			console.error("[Polaris Dashboard] onOpen error:", e);
			// 收窄：仅当主界面尚未渲染时才显示错误，局部异常不导致整页空白
			const errEl = this.containerEl.children[1] as HTMLElement;
			if (errEl && !errEl.querySelector(".polaris-dashboard")) {
				errEl.empty();
				errEl.createDiv({ text: "TALOS_ERROR: " + String((e && (e.stack || e.message)) || e) });
			}
		}
	}

	private injectStyles() {
		if (this.styleEl) return;
		this.styleEl = document.createElement("style");
		this.styleEl.textContent = TALOS_STYLES + `
			/* 隐藏 Obsidian 默认的视图标题栏（包含分屏选项、更多按钮等） */
			.workspace-leaf-content[data-type="polaris-dashboard-view"] .view-header { display:none !important; }
			.workspace-leaf-content[data-type="polaris-dashboard-view"] .view-content { padding:0 !important; overflow:hidden !important; }
			.polaris-dashboard { height:100% !important; display:flex !important; flex-direction:column !important; }
			.polaris-dashboard .polaris-app { flex:1 !important; display:flex !important; min-height:0 !important; height:auto !important; }
			.polaris-dashboard .polaris-sidebar { width:260px !important; flex-shrink:0 !important; overflow-y:auto !important; min-height:0 !important; }
			.polaris-dashboard .polaris-main { flex:1 !important; overflow-y:auto !important; overflow-x:hidden !important; min-width:0 !important; min-height:0 !important; }
			.polaris-dashboard .polaris-detail { width:320px !important; flex-shrink:0 !important; overflow-y:auto !important; min-height:0 !important; }
			.polaris-dashboard .polaris-sidebar,.polaris-dashboard .polaris-main,.polaris-dashboard .polaris-detail { position:relative !important; z-index:1 !important; }
			.polaris-dashboard .quick-icon,.polaris-dashboard .list-item-icon,.polaris-dashboard .recent-icon,.polaris-dashboard .canvas-stat-icon,.polaris-dashboard .logo-icon,.polaris-dashboard .nav-icon,.polaris-dashboard .diary-icon,.polaris-dashboard .empty-icon,.polaris-dashboard .search-icon,.polaris-dashboard .section-title { font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif !important; }
			.polaris-dashboard .polaris-modal-root { position:fixed !important; z-index:9999 !important; }
			.polaris-dashboard .quick-grid .quick-btn,.polaris-dashboard .quick-actions-grid .quick-btn { display:flex !important; flex-direction:column !important; align-items:center !important; justify-content:center !important; min-height:64px !important; padding:8px 6px !important; gap:4px !important; line-height:1.2 !important; }
			.polaris-dashboard .polaris-toast-container { pointer-events:none !important; }
			.polaris-dashboard .polaris-toast-container .toast { pointer-events:auto !important; }
			/* 搜索框样式修复：确保图标和文字不重叠 */
			.polaris-dashboard .search-box { position:relative; display:flex; align-items:center; width:100%; }
			.polaris-dashboard .search-box .search-icon { position:absolute; left:12px; font-size:14px; z-index:2; pointer-events:none; }
			.polaris-dashboard .search-input { width:100%; padding:8px 60px 8px 36px !important; font-size:13px; box-sizing:border-box; }
			.polaris-dashboard .search-kbd { position:absolute; right:10px; font-size:11px; z-index:2; pointer-events:none; color:rgba(255,255,255,0.35); user-select:none; }
			.polaris-dashboard .polaris-note-list-search::placeholder { color:var(--text-muted); opacity:0.75; }
			/* 弹窗笔记列表搜索框：与导航栏搜索框观感统一（细边框/大圆角/同高），深浅色适配 */
			.polaris-dashboard .polaris-note-list-search {
				height:36px !important;
				padding:0 12px 0 36px !important;
				border-radius:12px !important;
				border:1px solid rgba(255,255,255,0.15) !important;
				background:rgba(255,255,255,0.04) !important;
				box-shadow:none !important;
				font-size:13px !important;
				color:var(--text-normal) !important;
			}
			/* 弹窗搜索图标：内嵌输入框左侧，垂直居中后微调 2px 修正 emoji 重心 */
			.polaris-dashboard .search-box .polaris-note-list-search-icon {
				top:50% !important;
				transform:translateY(calc(-50% + 2px)) !important;
			}
			/* 侧栏搜索 emoji 图标：同样垂直居中 + 2px 重心修正 */
			.polaris-dashboard .polaris-sidebar .search-box .search-icon {
				top:50% !important;
				transform:translateY(calc(-50% + 2px)) !important;
			}
			.polaris-dashboard[data-theme="light"] .polaris-note-list-search {
				background:rgba(0,0,0,0.03) !important;
				border-color:rgba(0,0,0,0.12) !important;
			}
			/* 弹窗搜索框 focus：主题色细描边（无发光，需 !important 覆盖基础边框规则） */
			.polaris-dashboard .polaris-note-list-search:focus {
				border-color:var(--focus-border) !important;
				box-shadow:none !important;
				background:rgba(255,255,255,0.06) !important;
				outline:none !important;
			}
			.polaris-dashboard[data-theme="light"] .polaris-note-list-search:focus {
				background:rgba(0,0,0,0.04) !important;
			}
			.polaris-dashboard[data-theme="light"] .polaris-note-list-search::placeholder { color:rgba(0,0,0,0.4) !important; }
			/* ===== 其他输入框统一（笔记筛选 / 每日一句管理 / 纪念日管理）：12px 圆角 / 细边框 / 无内阴影 / focus 柔光 ===== */
			.polaris-dashboard .polaris-subj-filter,
			.polaris-dashboard .polaris-q-input,
			.polaris-dashboard .polaris-m-name,
			.polaris-dashboard .polaris-m-month,
			.polaris-dashboard .polaris-m-day {
				background: rgba(255,255,255,0.04) !important;
				border: 1px solid rgba(255,255,255,0.15) !important;
				border-radius: 12px !important;
				color: var(--text-primary) !important;
				font-size: 13px !important;
				box-shadow: none !important;
				outline: none !important;
				box-sizing: border-box;
				transition: border-color 0.2s ease, box-shadow 0.2s ease;
			}
			.polaris-dashboard .polaris-subj-filter { height: 36px !important; padding: 0 12px !important; }
			.polaris-dashboard .polaris-q-input { height: 36px !important; padding: 0 12px !important; }
			.polaris-dashboard .polaris-m-name { height: 32px !important; padding: 0 8px !important; }
			.polaris-dashboard .polaris-m-month, .polaris-dashboard .polaris-m-day { height: 32px !important; padding: 0 8px !important; }
			.polaris-dashboard .polaris-subj-filter:focus,
			.polaris-dashboard .polaris-q-input:focus,
			.polaris-dashboard .polaris-m-name:focus,
			.polaris-dashboard .polaris-m-month:focus,
			.polaris-dashboard .polaris-m-day:focus {
				border-color: var(--focus-border) !important;
				box-shadow: none !important;
				outline: none !important;
			}
			.polaris-dashboard[data-theme="light"] .polaris-subj-filter,
			.polaris-dashboard[data-theme="light"] .polaris-q-input,
			.polaris-dashboard[data-theme="light"] .polaris-m-name,
			.polaris-dashboard[data-theme="light"] .polaris-m-month,
			.polaris-dashboard[data-theme="light"] .polaris-m-day {
				background: rgba(0,0,0,0.03) !important;
				border-color: rgba(0,0,0,0.12) !important;
			}
			/* 复习看板进度圆环 */
			.polaris-dashboard .review-progress-ring {
				width:120px;height:120px;border-radius:50%;
				border:8px solid rgba(255,255,255,0.1);
				border-top-color:var(--brand-green);
				display:flex;align-items:center;justify-content:center;flex-direction:column;
				flex-shrink:0;
			}
			/* ========== 浅色主题全面修复 ========== */
			.polaris-dashboard[data-theme="light"] { background:#f5f5f0 !important; color:#1a1a1f !important; }
			.polaris-dashboard[data-theme="light"] .polaris-app { background:#f5f5f0 !important; }
			.polaris-dashboard[data-theme="light"] .glass-card,
			.polaris-dashboard[data-theme="light"] .glass-card-static,
			.polaris-dashboard[data-theme="light"] .stat-card,
			.polaris-dashboard[data-theme="light"] .focus-card,
			.polaris-dashboard[data-theme="light"] .kanban-column,
			.polaris-dashboard[data-theme="light"] .detail-section,
			.polaris-dashboard[data-theme="light"] .task-card,
			.polaris-dashboard[data-theme="light"] .quick-btn,
			.polaris-dashboard[data-theme="light"] .icon-btn,
			.polaris-dashboard[data-theme="light"] .modal-box {
				background:rgba(255,255,255,0.9) !important;
				border-color:rgba(0,0,0,0.1) !important;
				color:#1a1a1f !important;
			}
			.polaris-dashboard[data-theme="light"] .search-input,
			.polaris-dashboard[data-theme="light"] .form-input,
			.polaris-dashboard[data-theme="light"] .form-date-field,
			.polaris-dashboard[data-theme="light"] .form-textarea,
			.polaris-dashboard[data-theme="light"] .memo-textarea {
				background:rgba(0,0,0,0.03) !important;
				border-color:rgba(0,0,0,0.12) !important;
				color:#1a1a1f !important;
			}
			/* 浅色 select：拆分 background 为 color+image，保证自定义箭头不被简写清掉 */
			.polaris-dashboard[data-theme="light"] .form-select {
				background-color:rgba(0,0,0,0.03) !important;
				border-color:rgba(0,0,0,0.12) !important;
				color:#1a1a1f !important;
				background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='black' stroke-opacity='0.45' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>") !important;
				background-repeat:no-repeat !important;
				background-position:right 10px center !important;
				background-size:14px !important;
			}
			.polaris-dashboard[data-theme="light"] .search-input::placeholder { color:rgba(0,0,0,0.4) !important; }
			/* 浅色主题 Focus 统一覆盖：同 !important 时 specificity 更高（0,4,0），保证细绿描边必胜于浅色基础边框 */
			.polaris-dashboard[data-theme="light"] .polaris-top-nav .search-area .search-input:focus,
			.polaris-dashboard[data-theme="light"] .search-input:focus,
			.polaris-dashboard[data-theme="light"] .form-input:focus,
			.polaris-dashboard[data-theme="light"] .form-select:focus,
			.polaris-dashboard[data-theme="light"] .form-date-field:focus,
			.polaris-dashboard[data-theme="light"] .form-textarea:focus,
			.polaris-dashboard[data-theme="light"] .memo-textarea:focus,
			.polaris-dashboard[data-theme="light"] .kanban-search-input:focus,
			.polaris-dashboard[data-theme="light"] .polaris-note-list-search:focus,
			.polaris-dashboard[data-theme="light"] .polaris-subj-filter:focus,
			.polaris-dashboard[data-theme="light"] .polaris-q-input:focus,
			.polaris-dashboard[data-theme="light"] .polaris-m-name:focus,
			.polaris-dashboard[data-theme="light"] .polaris-m-month:focus,
			.polaris-dashboard[data-theme="light"] .polaris-m-day:focus {
				border-color: #96b030 !important;
			}
			.polaris-dashboard[data-theme="light"] .search-kbd { background:transparent !important; color:rgba(0,0,0,0.35) !important; border:none !important; }
			.polaris-dashboard[data-theme="dark"] .search-kbd { background:transparent !important; color:rgba(255,255,255,0.35) !important; border:none !important; box-shadow:none !important; }
			.polaris-dashboard[data-theme="light"] .gantt-row-track,
			.polaris-dashboard[data-theme="light"] .progress-track { background:rgba(0,0,0,calc(var(--card-opacity) * 0.107)) !important; }
			/* 浅色主题：甘特任务条底色改为浅灰，与轨道同高可见 */
			.polaris-dashboard[data-theme="light"] .gantt-bar { background:rgba(0,0,0,calc(var(--card-opacity) * 0.133)) !important; box-shadow:0 1px 4px rgba(0,0,0,0.08) !important; }
			.polaris-dashboard[data-theme="light"] .ring-bg { stroke:rgba(0,0,0,calc(var(--card-opacity) * 0.107)) !important; }
			.polaris-dashboard[data-theme="light"] .review-progress-ring {
				border-color:rgba(0,0,0,calc(var(--card-opacity) * 0.107)) !important;
				border-top-color:var(--brand-green) !important;
			}
			.polaris-dashboard[data-theme="light"] .list-item:hover,
			.polaris-dashboard[data-theme="light"] .recent-item:hover,
			.polaris-dashboard[data-theme="light"] .rss-item:hover { background:rgba(0,0,0,0.03) !important; }
			.polaris-dashboard[data-theme="light"] .nav-item { color:#1a1a1f !important; }
			.polaris-dashboard[data-theme="light"] .nav-item:hover { background:rgba(0,0,0,0.04) !important; color:#1a1a1f !important; }
			/* 浅色主题：顶部导航 tab（选中态绿底深字，保证可见） */
			.polaris-dashboard[data-theme="light"] .board-tab { color:#52525b !important; }
			.polaris-dashboard[data-theme="light"] .board-tab:hover { color:#1a1a1f !important; background:rgba(0,0,0,0.05) !important; }
.polaris-dashboard[data-theme="light"] .board-tab.active { background:rgba(200,224,96,calc(var(--card-opacity) * 1.0)) !important; color:#0f0f13 !important; font-weight:600 !important; }
.polaris-dashboard[data-theme="light"] .nav-item.active { background:rgba(200,224,96,calc(var(--card-opacity) * 0.333)) !important; color:#1a1a1f !important; border-left-color:var(--brand-green) !important; }
.polaris-dashboard[data-theme="light"] .btn-primary { background:var(--brand-green) !important; color:#0f0f13 !important; }
			.polaris-dashboard[data-theme="light"] .btn-secondary { background:transparent !important; color:#1a1a1f !important; border-color:rgba(0,0,0,0.25) !important; }
.polaris-dashboard[data-theme="light"] .btn-secondary:hover { background:rgba(0,0,0,calc(var(--card-opacity) * 0.08)) !important; border-color:rgba(200,224,96,0.5) !important; }
.polaris-dashboard[data-theme="light"] .btn-new-card { background:var(--brand-green) !important; color:#0f0f13 !important; }
			.polaris-dashboard[data-theme="light"] .icon-btn { background:rgba(0,0,0,calc(var(--card-opacity) * 0.067)) !important; border-color:rgba(0,0,0,0.12) !important; color:#1a1a1f !important; }
.polaris-dashboard[data-theme="light"] .icon-btn:hover { background:rgba(200,224,96,calc(var(--card-opacity) * 0.133)) !important; border-color:rgba(200,224,96,0.5) !important; }
			.polaris-dashboard[data-theme="light"] .quick-btn { background:rgba(0,0,0,0.04) !important; border-color:rgba(0,0,0,0.08) !important; color:#1a1a1f !important; }
.polaris-dashboard[data-theme="light"] .quick-btn:hover { background:rgba(200,224,96,0.1) !important; border-color:rgba(200,224,96,0.4) !important; }
			.polaris-dashboard[data-theme="light"] .checkin-btn { background:rgba(0,0,0,calc(var(--card-opacity) * 0.08)) !important; color:#1a1a1f !important; border-color:rgba(0,0,0,0.15) !important; }
.polaris-dashboard[data-theme="light"] .checkin-btn.checked { background:rgba(200,224,96,calc(var(--card-opacity) * 1.0)) !important; color:#0f0f13 !important; }
			.polaris-dashboard[data-theme="light"] .filter-tab { background:rgba(0,0,0,calc(var(--card-opacity) * 0.067)) !important; color:#1a1a1f !important; }
.polaris-dashboard[data-theme="light"] .filter-tab.active { background:var(--brand-green) !important; color:#0f0f13 !important; }
			.polaris-dashboard[data-theme="light"] .gantt-view-toggle { background:rgba(0,0,0,calc(var(--card-opacity) * 0.08)) !important; }
			.polaris-dashboard[data-theme="light"] .gantt-view-btn { background:transparent !important; color:#1a1a1f !important; }
.polaris-dashboard[data-theme="light"] .gantt-view-btn.active { background:rgba(200,224,96,calc(var(--card-opacity) * 1.0)) !important; color:#0f0f13 !important; }
			.polaris-dashboard[data-theme="light"] .task-card:hover { border-color:var(--brand-green) !important; }
			/* 浅色主题：恢复任务卡片左侧状态色带（浅色统一边框规则会盖掉它） */
			.polaris-dashboard[data-theme="light"] .task-card.status-todo { border-left:2px solid rgba(156,163,175,0.6) !important; }
			.polaris-dashboard[data-theme="light"] .task-card.status-doing { border-left:2px solid rgba(59,130,246,0.6) !important; }
			.polaris-dashboard[data-theme="light"] .task-card.status-done { border-left:2px solid rgba(34,197,94,0.6) !important; }
			.polaris-dashboard[data-theme="light"] .task-card.status-overdue { border-left:2px solid rgba(239,68,68,0.6) !important; }
			.polaris-dashboard[data-theme="light"] .task-card:hover.status-todo { border-left-color:#9ca3af !important; }
			.polaris-dashboard[data-theme="light"] .task-card:hover.status-doing { border-left-color:#60a5fa !important; }
			.polaris-dashboard[data-theme="light"] .task-card:hover.status-done { border-left-color:#22c55e !important; }
			.polaris-dashboard[data-theme="light"] .task-card:hover.status-overdue { border-left-color:#f87171 !important; }
			.polaris-dashboard[data-theme="light"] .modal-overlay { background:rgba(0,0,0,0.4) !important; }
			.polaris-dashboard[data-theme="light"] .form-label { color:#1a1a1f !important; }
			.polaris-dashboard[data-theme="light"] .gantt-row-label { color:#1a1a1f !important; }
			.polaris-dashboard[data-theme="light"] .gantt-tick { color:rgba(0,0,0,0.5) !important; }
			.polaris-dashboard[data-theme="light"] .kanban-col-header { color:#1a1a1f !important; }
			.polaris-dashboard[data-theme="light"] .kanban-empty { color:rgba(0,0,0,0.4) !important; }
			.polaris-dashboard[data-theme="light"] .detail-empty-state { color:rgba(0,0,0,0.4) !important; }
			.polaris-dashboard[data-theme="light"] .detail-section-title { color:#1a1a1f !important; }
			.polaris-dashboard[data-theme="light"] .detail-info-label { color:rgba(0,0,0,0.5) !important; }
			.polaris-dashboard[data-theme="light"] .detail-info-value { color:#1a1a1f !important; }
			/* 复习任务浅色主题 */
			.polaris-dashboard[data-theme="light"] .review-item { color:#1a1a1f !important; }
			.polaris-dashboard[data-theme="light"] .review-item:hover { background:rgba(0,0,0,0.03) !important; }
			.polaris-dashboard[data-theme="light"] .review-item + .review-item { border-top-color:rgba(0,0,0,0.08) !important; }
			.polaris-dashboard[data-theme="light"] .review-check { border-color:var(--check-border) !important; color:rgba(0,0,0,0.45) !important; background:transparent !important; }
			.polaris-dashboard[data-theme="light"] .review-item.completed .review-check { background:var(--brand-green) !important; border-color:var(--brand-green) !important; color:#0f0f13 !important; }
			/* 复习任务：不熟/跳过按钮（宿主 button 会覆盖成黑字白底，需 !important 压回） */
			.polaris-dashboard[data-theme="light"] .review-wrong { border-color:rgba(217,119,6,0.4) !important; color:#d97706 !important; background:transparent !important; }
			.polaris-dashboard[data-theme="light"] .review-wrong:hover { border-color:#b45309 !important; background:rgba(217,119,6,calc(var(--card-opacity) * 0.16)) !important; color:#b45309 !important; }
			.polaris-dashboard[data-theme="light"] .review-skip { border-color:rgba(0,0,0,0.25) !important; color:#71717a !important; background:transparent !important; }
			.polaris-dashboard[data-theme="light"] .review-skip:hover { border-color:var(--brand-green-dark) !important; color:var(--brand-green-dark) !important; background:rgba(200,224,96,calc(var(--card-opacity) * 0.2)) !important; }
			.polaris-dashboard[data-theme="light"] .review-text { color:#1a1a1f !important; }
			.polaris-dashboard[data-theme="light"] .review-subject { color:rgba(0,0,0,0.5) !important; }
			.polaris-dashboard[data-theme="light"] .review-item.completed .review-text { color:rgba(0,0,0,0.4) !important; }
			/* 知识库图表浅色主题 */
			.polaris-dashboard[data-theme="light"] .knowledge-charts .glass-card-static > div > div[style*="rgba(255,255,255,0.08)"] { background:rgba(0,0,0,0.08) !important; }

			/* ============================================================
			   液态玻璃拟态：强制覆盖按钮底色（解决 Obsidian 原生 button 深色底问题）
			   ============================================================ */
			/* 1. 「新建任务」等头部按钮 */
			.polaris-dashboard .polaris-header-new,
			.polaris-dashboard .polaris-quick-note,
			.polaris-dashboard .polaris-focus-edit,
			.polaris-dashboard .btn-primary {
				background: rgba(255, 255, 255, 0.08) !important;
				backdrop-filter: blur(16px) saturate(1.6) !important;
				-webkit-backdrop-filter: blur(16px) saturate(1.6) !important;
				border: 1px solid rgba(255, 255, 255, 0.18) !important;
				box-shadow:
					inset 0 1px 0 rgba(255, 255, 255, 0.12),
					0 2px 8px rgba(0, 0, 0, 0.08) !important;
				color: #e8e8ec !important;
				font-weight: 600 !important;
			}
			.polaris-dashboard .polaris-header-new:hover,
			.polaris-dashboard .polaris-quick-note:hover,
			.polaris-dashboard .polaris-focus-edit:hover,
			.polaris-dashboard .btn-primary:hover {
				background: rgba(200, 224, 96, 0.16) !important;
				border-color: rgba(200, 224, 96, 0.5) !important;
				box-shadow:
					inset 0 1px 0 rgba(255, 255, 255, 0.18),
					0 4px 16px rgba(200, 224, 96, 0.15) !important;
				color: var(--brand-green) !important;
			}

			/* 1.5 「查看详情」等次级按钮 */
			.polaris-dashboard .polaris-focus-detail {
				background: rgba(255, 255, 255, 0.07) !important;
				backdrop-filter: blur(12px) saturate(1.4) !important;
				-webkit-backdrop-filter: blur(12px) saturate(1.4) !important;
				border: 1px solid rgba(255, 255, 255, 0.15) !important;
				box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
				color: #d0d0d5 !important;
			}
			.polaris-dashboard .polaris-focus-detail:hover {
				background: rgba(255, 255, 255, 0.12) !important;
				border-color: rgba(200, 224, 96, 0.45) !important;
				box-shadow:
					inset 0 1px 0 rgba(255, 255, 255, 0.15),
					0 2px 8px rgba(200, 224, 96, 0.1) !important;
				color: var(--brand-green) !important;
			}

			/* 2. 周/月/季/年切换按钮组 */
			.polaris-dashboard .gantt-view-toggle {
				background: rgba(255, 255, 255, 0.06) !important;
				border: 1px solid rgba(255, 255, 255, 0.1) !important;
				backdrop-filter: blur(14px) saturate(1.4) !important;
				-webkit-backdrop-filter: blur(14px) saturate(1.4) !important;
				box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
			}
			.polaris-dashboard .gantt-view-btn {
				background: transparent !important;
				border: none !important;
				color: var(--text-secondary) !important;
			}
			.polaris-dashboard .gantt-view-btn.active {
				background: rgba(255, 255, 255, 0.12) !important;
				backdrop-filter: blur(10px) !important;
				-webkit-backdrop-filter: blur(10px) !important;
				color: var(--brand-green) !important;
				box-shadow:
					inset 0 1px 0 rgba(255, 255, 255, 0.15),
					0 2px 8px rgba(0, 0, 0, 0.12) !important;
			}

			/* 3. 底部筛选按钮（全部/待办/进行中/已完成/逾期） */
			.polaris-dashboard .filter-tab {
				background: rgba(255, 255, 255, 0.07) !important;
				backdrop-filter: blur(12px) saturate(1.4) !important;
				-webkit-backdrop-filter: blur(12px) saturate(1.4) !important;
				border: 1px solid rgba(255, 255, 255, 0.12) !important;
				box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
				color: #b0b0b5 !important;
			}
			.polaris-dashboard .filter-tab:hover {
				background: rgba(255, 255, 255, 0.13) !important;
				border-color: rgba(255, 255, 255, 0.22) !important;
				box-shadow:
					inset 0 1px 0 rgba(255, 255, 255, 0.12),
					0 2px 8px rgba(0, 0, 0, 0.1) !important;
				color: #f0f0f3 !important;
			}
			.polaris-dashboard .filter-tab.active {
				background: rgba(200, 224, 96, 0.16) !important;
				border-color: rgba(200, 224, 96, 0.5) !important;
				box-shadow:
					inset 0 1px 0 rgba(255, 255, 255, 0.15),
					0 2px 12px rgba(200, 224, 96, 0.15) !important;
				color: var(--brand-green) !important;
			}

			/* 4. 右侧图标按钮（日历、+号等） */
			.polaris-dashboard .icon-btn {
				background: rgba(255, 255, 255, 0.08) !important;
				backdrop-filter: blur(12px) saturate(1.4) !important;
				-webkit-backdrop-filter: blur(12px) saturate(1.4) !important;
				border: 1px solid rgba(255, 255, 255, 0.14) !important;
				box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
				color: var(--text-secondary) !important;
			}
			.polaris-dashboard .icon-btn:hover {
				background: rgba(200, 224, 96, 0.12) !important;
				border-color: rgba(200, 224, 96, 0.45) !important;
				box-shadow:
					inset 0 1px 0 rgba(255, 255, 255, 0.12),
					0 2px 8px rgba(200, 224, 96, 0.12) !important;
				color: var(--brand-green) !important;
			}

			/* 5. 今日打卡 + 添加按钮 */
			.polaris-dashboard .compact-checkin-add {
				background: rgba(200, 224, 96, 0.12) !important;
				backdrop-filter: blur(12px) saturate(1.5) !important;
				-webkit-backdrop-filter: blur(12px) saturate(1.5) !important;
				border: 1px solid rgba(200, 224, 96, 0.35) !important;
				box-shadow:
					inset 0 1px 0 rgba(255, 255, 255, 0.12),
					0 2px 6px rgba(200, 224, 96, 0.1) !important;
				color: var(--brand-green) !important;
			}
			.polaris-dashboard .compact-checkin-add:hover {
				background: rgba(200, 224, 96, 0.25) !important;
				border-color: rgba(200, 224, 96, 0.6) !important;
				box-shadow:
					inset 0 1px 0 rgba(255, 255, 255, 0.18),
					0 4px 12px rgba(200, 224, 96, 0.2) !important;
				color: var(--brand-green) !important;
			}

			/* 6. 统计小卡片：更通透的玻璃感，不要深灰蓝 */
			.polaris-dashboard .stat-card {
				background: rgba(255, 255, 255, 0.05) !important;
				border: 1px solid rgba(255, 255, 255, 0.08) !important;
				box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
			}

			/* 7. 今日焦点大卡片：稍微调亮，减轻厚重感 */
			.polaris-dashboard .focus-card {
				background: rgba(255, 255, 255, 0.04) !important;
				box-shadow:
					inset 0 1px 0 rgba(255, 255, 255, 0.08),
					0 4px 24px rgba(0, 0, 0, 0.12) !important;
			}

			/* 8. 顶部导航栏右侧图标按钮：玻璃质感，去掉灰底 */
			.polaris-dashboard .polaris-top-nav .icon-btn {
				background: rgba(255, 255, 255, 0.08) !important;
				backdrop-filter: blur(12px) saturate(1.4) !important;
				-webkit-backdrop-filter: blur(12px) saturate(1.4) !important;
				border: 1px solid rgba(255, 255, 255, 0.14) !important;
				box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
				color: var(--text-secondary) !important;
			}
			.polaris-dashboard .polaris-top-nav .icon-btn:hover {
				background: rgba(200, 224, 96, 0.12) !important;
				border-color: rgba(200, 224, 96, 0.45) !important;
				box-shadow:
					inset 0 1px 0 rgba(255, 255, 255, 0.12),
					0 2px 8px rgba(200, 224, 96, 0.12) !important;
				color: var(--brand-green) !important;
			}

			/* 10. 查看错题本按钮：玻璃风格 */
			.polaris-dashboard .polaris-mistake-book {
				background: rgba(255, 255, 255, 0.06) !important;
				border: 1px solid rgba(255, 255, 255, 0.12) !important;
				color: var(--text-secondary) !important;
				border-radius: var(--radius-md) !important;
				backdrop-filter: blur(12px) !important;
				-webkit-backdrop-filter: blur(12px) !important;
				transition: all 0.15s ease !important;
			}
			.polaris-dashboard .polaris-mistake-book:hover {
				background: rgba(255, 255, 255, 0.1) !important;
				border-color: rgba(239, 68, 68, 0.3) !important;
				color: var(--danger-red) !important;
			}
		`;
		document.head.appendChild(this.styleEl);
	}

	// ==================== 渲染（新架构：顶部导航 + 主内容 + 今日面板） ====================
	private renderApp() {
		const root = this.rootEl!;
		root.innerHTML = `
			<div class="polaris-app">
				<nav class="polaris-top-nav"></nav>
				<div class="polaris-content">
					<main class="polaris-main"></main>
					<aside class="polaris-detail">
						<div class="polaris-detail-content detail-body"></div>
					</aside>
				</div>
			</div>
			<div class="polaris-drawer-overlay" id="polaris-drawer-overlay"></div>
			<div class="polaris-drawer" id="polaris-drawer"></div>
			<div class="polaris-toast-container" id="polaris-toast-container"></div>
		`;
		this.renderTopNav();
		this.renderBoard();
		this.renderTodayPanel();
		// 绑定抽屉遮罩点击关闭
		const overlay = root.querySelector("#polaris-drawer-overlay") as HTMLElement;
		overlay.onclick = () => this.closeDrawer();
	}

	// 顶部导航栏
	private renderTopNav() {
		const root = this.rootEl!;
		const nav = root.querySelector(".polaris-top-nav") as HTMLElement;
		nav.innerHTML = `
			<div class="logo-area">
				<div class="logo-icon">
					<svg viewBox="0 0 100 100" fill="none">
						<rect x="41" y="8" width="18" height="84" rx="4" fill="#c8e060"/>
						<rect x="41" y="8" width="18" height="84" rx="4" fill="#c8e060" transform="rotate(45 50 50)"/>
						<rect x="41" y="8" width="18" height="84" rx="4" fill="#c8e060" transform="rotate(90 50 50)"/>
						<rect x="41" y="8" width="18" height="84" rx="4" fill="#c8e060" transform="rotate(135 50 50)"/>
					</svg>
				</div>
				<div class="logo-name">Polaris</div>
			</div>
			<div class="board-tabs">
				${(["work","knowledge","review"] as const).map((b) => `
					<button class="board-tab ${this.currentBoard===b?"active":""}" data-board="${b}">
						<span>${boardMeta[b].icon}</span>${boardMeta[b].title}${b==="review"?this.getReviewBadgeHTML():""}
					</button>
				`).join("")}
			</div>
			<div class="search-area">
				<span class="search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>
				<input class="search-input polaris-global-search" type="text" placeholder="搜索笔记、任务、文档...">
				<span class="search-kbd">⌘K</span>
			</div>
			<div class="top-actions">
				<button class="icon-btn polaris-btn-diary" title="今日速记">📝</button>
				<button class="icon-btn polaris-btn-settings" title="设置">⚙️</button>
			</div>
		`;

		// 绑定看板切换
		nav.querySelectorAll(".board-tab").forEach((el) => {
			(el as HTMLElement).onclick = () => {
				const b = (el as HTMLElement).dataset.board;
				if (b && b !== this.currentBoard) {
					this.currentBoard = b;
					this.renderTopNav();
					this.renderBoard();
					this.showToast(`已切换到「${boardMeta[b as keyof typeof boardMeta].title}」`);
				}
			};
		});

		// 绑定快捷操作
		(nav.querySelector(".polaris-btn-diary") as HTMLElement).onclick = () => this.openDiary();
		(nav.querySelector(".polaris-btn-settings") as HTMLElement).onclick = () => this.openSettingsModal();

		// 绑定搜索：输入实时搜索（下拉面板展开在搜索框下方），回车兜底打开 Obsidian 全局搜索
		const searchInput = nav.querySelector(".polaris-global-search") as HTMLInputElement;
		let searchDebounce: number | null = null;
		searchInput.addEventListener("input", () => {
			if (searchDebounce) window.clearTimeout(searchDebounce);
			searchDebounce = window.setTimeout(() => {
				const q = searchInput.value.trim();
				if (q) this.openSearchDropdown(searchInput, q);
				else this.closeSearchDropdown();
			}, 220);
		});
		searchInput.addEventListener("keydown", (e) => {
			if (e.key === "ArrowDown" || e.key === "ArrowUp") {
				// ↑↓ 在结果间移动高亮项（有结果时才拦截，否则保留输入框光标行为）
				if (this.searchItemEls.length) {
					e.preventDefault();
					this.moveSearchActive(e.key === "ArrowDown" ? 1 : -1);
				}
			} else if (e.key === "Enter") {
				const q = searchInput.value.trim();
				// 打开当前高亮项；无高亮时退回第一条
				const target = this.searchItemEls[this.searchActiveIdx] || this.searchItemEls[0];
				if (q && target) {
					this.activateSearchResult(target);
					searchInput.value = "";
					this.closeSearchDropdown();
				} else if (q) {
					this.openGlobalSearch(q);
					searchInput.value = "";
					this.closeSearchDropdown();
				}
			} else if (e.key === "Escape") {
				this.closeSearchDropdown();
				searchInput.blur();
			}
		});
		searchInput.addEventListener("blur", () => {
			setTimeout(() => this.closeSearchDropdown(), 160);
		});
	}

	// 右栏卡片拖拽排序（Pointer Events，与左栏看板一致：按住手柄拖动，松手自动落盘）
	private wireRightPanelDrag() {
		const detail = this.rootEl!.querySelector(".polaris-detail-content") as HTMLElement;
		if (!detail) return;
		detail.querySelectorAll<HTMLElement>(".rp-card").forEach((card) => {
			const grip = card.querySelector(".rp-handle");
			const titleRow = card.querySelector(".detail-section-title, .module-title") as HTMLElement | null;
			if (grip && titleRow) titleRow.prepend(grip);
			if (grip) {
				grip.style.setProperty("touch-action", "none")
				grip.addEventListener("pointerdown", (e: PointerEvent) => {
					e.preventDefault();
					this.startRightPanelDrag(e, card);
				});
			}
		});
	}

	// 右栏卡片指针拖拽（双向：按指针相对最近卡片的位置插前/插后）
	// 拖拽时卡片移入 document.body，CSS 变量（定义在 .polaris-dashboard 作用域）解析失败，
	// 会导致圆角/背景/阴影丢失（右栏卡片变方角）。此处把关键变量快照到卡片内联样式，
	// 整棵子树恢复正常。左右栏拖拽统一调用。
	private snapshotCardVars(card: HTMLElement): void {
		const rootEl = this.rootEl as HTMLElement;
		if (!rootEl) return;
		const cs = getComputedStyle(rootEl);
		const props = [
			"--radius-sm", "--radius-md", "--radius-lg", "--radius-xl", "--radius-2xl", "--radius-full",
			"--card-bg-rgb", "--card-opacity", "--card-blur", "--border-color", "--shadow-card",
			"--brand-green", "--brand-green-dark", "--brand-purple", "--brand-purple-dark",
			"--text-primary", "--text-secondary", "--text-tertiary", "--text-brand",
			"--danger-red", "--priority-p0", "--priority-p1", "--priority-p2", "--info-blue",
			"--space-sm", "--space-md", "--space-lg", "--bg-primary", "--fs-title",
		];
		for (const p of props) {
			const val = cs.getPropertyValue(p).trim();
			if (val) card.style.setProperty(p, val);
		}
	}

	private startRightPanelDrag(e: PointerEvent, card: HTMLElement) {
		const detail = this.rootEl!.querySelector(".polaris-detail-content") as HTMLElement;
		if (!detail) return;
		e.preventDefault();
		// 跟手拖拽：卡片脱离文档流跟随指针，占位符让其他卡片实时让位
		const rect = card.getBoundingClientRect();
		const ph = document.createElement("div");
		ph.className = "rp-drag-placeholder";
		ph.style.setProperty("height", rect.height + "px")
		const offsetX = e.clientX - rect.left;
		const offsetY = e.clientY - rect.top;
		detail.replaceChild(ph, card);
		card.classList.add("dragging");
		this.snapshotCardVars(card);
		card.style.setProperty("position", "fixed")
		card.style.setProperty("left", rect.left + "px")
		card.style.setProperty("top", rect.top + "px")
		card.style.setProperty("width", rect.width + "px")
		card.style.setProperty("height", rect.height + "px")
		card.style.setProperty("margin", "0")
		card.style.setProperty("z-index", "1000")
		card.style.setProperty("pointer-events", "none")
		document.body.appendChild(card);
		const onMove = (ev: PointerEvent) => {
			ev.preventDefault();
			card.style.setProperty("left", (ev.clientX - offsetX) + "px")
			card.style.setProperty("top", (ev.clientY - offsetY) + "px")
			let best: { el: HTMLElement; r: DOMRect; dist: number } | null = null;
			for (const el of Array.from(detail.querySelectorAll<HTMLElement>(".rp-card"))) {
				if (el === card || el === ph) continue;
				const r = el.getBoundingClientRect();
				const dx = ev.clientX - (r.left + r.width / 2);
				const dy = ev.clientY - (r.top + r.height / 2);
				const dist = dx * dx + dy * dy;
				if (!best || dist < best.dist) best = { el, r, dist };
			}
			if (best) {
				const r = best.r;
				// 插入方向：卡外上方→插前、卡外下方→插后、卡内以纵向中线为界（上半→插前、下半→插后）
				let after: boolean;
				if (ev.clientY < r.top) after = false;
				else if (ev.clientY > r.bottom) after = true;
				else after = ev.clientY > r.top + r.height / 2;
				// 占位符实时移动，其他卡片围绕占位符让位
				if (after) detail.insertBefore(ph, best.el.nextSibling);
				else detail.insertBefore(ph, best.el);
			}
		};
		const ac = new AbortController();
		this._docAborters.push(ac);
		const finish = (save: boolean) => {
			ac.abort();
			const ai = this._docAborters.indexOf(ac);
			if (ai >= 0) this._docAborters.splice(ai, 1);
			if (this._activeDragFinish === finish) this._activeDragFinish = null;
			// 视图可能已重建（innerHTML 替换）：占位符不在 DOM 时直接丢弃卡片，不保存
			if (!ph.isConnected) { card.remove(); return; }
			detail.replaceChild(card, ph);
			card.style.setProperty("position", "")
			card.style.setProperty("left", "")
			card.style.setProperty("top", "")
			card.style.setProperty("width", "")
			card.style.setProperty("height", "")
			card.style.setProperty("margin", "")
			card.style.setProperty("z-index", "")
			card.style.setProperty("pointer-events", "")
			card.classList.remove("dragging");
			if (save) {
				const order = Array.from(detail.querySelectorAll<HTMLElement>(".rp-card")).map((c) => (c as HTMLElement).dataset.key || "");
				if (this.plugin) {
					this.plugin.pluginData.rightPanel = this.plugin.pluginData.rightPanel || {};
					this.plugin.pluginData.rightPanel.order = order;
					void this.plugin.savePluginData();
				}
			}
		};
		this._activeDragFinish = finish;
		document.addEventListener("pointermove", onMove, { signal: ac.signal });
		document.addEventListener("pointerup", () => finish(true), { signal: ac.signal });
		document.addEventListener("pointercancel", () => finish(false), { signal: ac.signal });
	}
	// 右侧今日面板（固定显示打卡+待办+学习）
	private renderTodayPanel() {
		// 重建前取消进行中的右栏拖拽（防止卡片引用失效 / 保存错误顺序）
		if (this._activeDragFinish) { const f = this._activeDragFinish; f(); }
		// 重建前清理今日待办就地展开的全局监听（展开块随重建消失，监听不能残留）
		if (this.todoExpandCloseHandler) {
			document.removeEventListener("mousedown", this.todoExpandCloseHandler);
			this.todoExpandCloseHandler = null;
		}
		this.todoExpandTaskId = null;
		const root = this.rootEl!;
		const detail = root.querySelector(".polaris-detail-content") as HTMLElement;
		detail.className = "polaris-detail-content detail-body";
		// 先创建容器（按设置过滤掉用户隐藏的右栏板块）
		const hiddenBlocks: string[] = this.plugin.pluginData.rightPanel?.hidden || [];
		const CARD_STYLE = "padding:8px 12px;border-radius:var(--radius-xl);background:rgba(var(--card-bg-rgb),var(--card-opacity));backdrop-filter:blur(var(--card-blur));-webkit-backdrop-filter:blur(var(--card-blur));border:1px solid var(--border-color);box-shadow:var(--shadow-card);";
		// 板块顺序：用户保存的 order 优先，新板块补在末尾
		const CANONICAL = ["checkin", "pomo", "todos", "quicknote"];
		const savedOrder = (this.plugin.pluginData.rightPanel?.order || []).filter((k) => CANONICAL.includes(k));
		const order = [...savedOrder];
		CANONICAL.forEach((k) => { if (!order.includes(k)) order.push(k); });
		const HANDLE = `<div class="rp-handle" title="按住拖动排序">⠿</div>`;
		const inner: Record<string, string> = {
			checkin: `<div class="polaris-today-checkin"></div>`,
			pomo: `<div class="polaris-pomo-card"></div>`,
			todos: `<div class="polaris-today-todos" style="${CARD_STYLE}"></div>`,
			quicknote: `<div class="polaris-today-quicknote" style="${CARD_STYLE}"></div>`,
		};
		let innerHTML = "";
		order.forEach((k) => {
			if (hiddenBlocks.includes(k)) return;
			innerHTML += `<div class="rp-card" data-key="${k}">${HANDLE}${inner[k]}</div>`;
		});
		detail.innerHTML = innerHTML;
		// 渲染打卡模块（紧凑版，内部已绑定事件）
		const checkinContainer = detail.querySelector(".polaris-today-checkin") as HTMLElement;
		if (checkinContainer) this.renderCheckinCompact(checkinContainer);
		// 日期卡独立：从打卡卡内挪到 detail 顶部（不参与拖拽排序）
		const dateQuoteCard = detail.querySelector(".polaris-date-quote-card") as HTMLElement;
		if (dateQuoteCard) detail.insertBefore(dateQuoteCard, detail.firstChild);
		// 渲染番茄时钟卡片（右侧今日面板，常驻卡片）
		const pomoContainer = detail.querySelector(".polaris-pomo-card") as HTMLElement;
		if (pomoContainer) { pomoContainer.innerHTML = this.renderPomodoro(); this.bindPomodoroEvents(pomoContainer); }
		// 渲染今日待办
		const todosContainer = detail.querySelector(".polaris-today-todos") as HTMLElement;
		if (todosContainer) { todosContainer.innerHTML = this.renderTodayTodosHTML(); this.bindTodayTodosEvents(todosContainer); }
		// 渲染快速记录
		const quicknoteContainer = detail.querySelector(".polaris-today-quicknote") as HTMLElement;
		if (quicknoteContainer) {
			quicknoteContainer.innerHTML = this.renderQuickNoteHTML();
			const quickNoteBtn = quicknoteContainer.querySelector(".polaris-quick-note") as HTMLElement;
			if (quickNoteBtn) quickNoteBtn.onclick = () => this.createQuickNote();
		}
		this.wireRightPanelDrag();
	}

	// 当前是否浅色主题（用于 inline 样式的主题色输出）
	private themeIsLight(): boolean {
		return this.rootEl?.getAttribute("data-theme") === "light";
	}

	// 渲染今日待办 HTML（卡片化：逾期标红+标签、优先级胶囊、meta 拆开）
	private renderTodayTodosHTML(): string {
		const today = new Date().toISOString().split("T")[0];
		const todayTasks = this.workTasks.filter((t) =>
			t.status !== "done" && (!t.completedDate || t.completedDate === today)
		);
		const completedToday = this.workTasks.filter((t) => t.status === "done" && t.completedDate === today);
		let html = `
			<div class="detail-section-title" style="display:flex;align-items:center;margin-bottom:8px;"><span class="rp-strip"></span><span class="rp-title">📝 今日待办</span><span style="font-size:11px;color:var(--text-muted);font-weight:400;margin-left:auto;">${todayTasks.length + completedToday.length} 项</span></div>
		`;
		if (todayTasks.length === 0 && completedToday.length === 0) {
			html += `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px;">暂无待办任务</div>`;
		} else {
			html += `<div class="polaris-todo-list" style="display:flex;flex-direction:column;gap:4px;">`;
			todayTasks.forEach((t) => {
				const isOverdue = this.isTaskOverdue(t);
				const pClass = t.priority.toLowerCase();
				html += `
					<div class="polaris-todo-item" data-task-id="${t.id}" style="display:flex;align-items:center;gap:8px;padding:8px 8px;border-radius:10px;cursor:pointer;transition:background 0.15s;" title="点击展开任务详情">
												<div class="polaris-todo-check" data-task-id="${t.id}" style="width:18px;height:18px;border-radius:50%;border:1px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.05);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;color:transparent;cursor:pointer;transition:all 0.2s;" title="标记完成">✓</div>
						<div style="flex:1;min-width:0;font-size:13px;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.title}</div>
							<div style="display:flex;align-items:center;gap:6px;flex-shrink:0;margin-left:6px;">
								<span class="task-priority ${pClass}" style="margin:0;"><span class="dot"></span>${t.priority}</span>
								<span style="font-size:10px;color:${isOverdue ? "var(--danger-red)" : "var(--text-muted)"};font-weight:${isOverdue ? 600 : 400};font-variant-numeric:tabular-nums;">${t.dueDate || "无日期"}</span>
							</div>
					</div>
				`;
			});
			completedToday.forEach((t) => {
				html += `
					<div class="polaris-todo-item completed" data-task-id="${t.id}" style="display:flex;align-items:center;gap:8px;padding:8px 8px;border-radius:10px;cursor:pointer;opacity:0.55;" title="点击展开任务详情">
												<div class="polaris-todo-check checked" data-task-id="${t.id}" style="width:18px;height:18px;border-radius:50%;background:var(--brand-green);border:2px solid var(--brand-green);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;color:#0f0f13;font-weight:700;cursor:pointer;">✓</div>
						<div style="flex:1;min-width:0;font-size:13px;text-decoration:line-through;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.title}</div>
							<span style="font-size:10px;color:var(--text-muted);flex-shrink:0;margin-left:6px;">已完成</span>
					</div>
				`;
			});
			html += `</div>`;
			html += `<div style="display:flex;gap:6px;margin-top:8px;padding-top:8px;border-top:1px solid var(--divider-line);font-size:10px;color:var(--text-muted);flex-wrap:wrap;align-items:center;">
				<span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#c084fc;"></span>最高优先 P0</span>
				<span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#fbbf24;"></span>高优先 P1</span>
				<span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#9ca3af;"></span>普通 P2</span>
				<span style="opacity:0.4;">·</span>
				<span style="display:flex;align-items:center;gap:4px;"><span style="color:var(--text-muted);">灰色日期</span> = 正常</span>
				<span style="display:flex;align-items:center;gap:4px;"><span style="color:var(--danger-red);font-weight:600;">红色日期</span> = 已逾期</span>
			</div>`;
		}
		return html;
	}

	// 绑定今日待办事件
	private bindTodayTodosEvents(container: HTMLElement) {
		container.querySelectorAll(".polaris-todo-check").forEach((el) => {
			(el as HTMLElement).onclick = (e) => {
				e.stopPropagation();
				const taskId = (el as HTMLElement).dataset.taskId;
				if (taskId) {
					this.toggleTaskComplete(taskId);
					this.renderTodayPanel();
				}
			};
		});
		container.querySelectorAll(".polaris-todo-item").forEach((el) => {
			(el as HTMLElement).onclick = () => {
				const taskId = (el as HTMLElement).dataset.taskId;
				if (taskId) {
					this.toggleTodoExpand(taskId, el as HTMLElement);
				}
			};
		});
	}

	// 今日待办就地展开：点击任务行 → 在卡片内展开任务详情（非右侧抽屉）。
	// 同任务再点收起；点展开区域外也收起。同一时刻只展开一个任务。
	private toggleTodoExpand(taskId: string, anchor: HTMLElement) {
		const section = anchor.closest(".polaris-today-todos") as HTMLElement;
		if (!section) return;

		// 同一任务再点 → 收起
		const existing = section.querySelector(".polaris-todo-expand") as HTMLElement;
		if (existing && existing.dataset.taskId === taskId) {
			this.collapseTodoExpand(section);
			return;
		}
		// 移除其他任务的展开块并恢复其行高亮
		if (existing) {
			const prev = section.querySelector(`.polaris-todo-item[data-task-id="${existing.dataset.taskId}"]`);
			prev?.classList.remove("todo-expanded");
			existing.remove();
		}

		const task = this.workTasks.find((t) => t.id === taskId);
		if (!task) return;

		const block = document.createElement("div");
		block.className = "polaris-todo-expand";
		block.dataset.taskId = taskId;
		const priorityColor = task.priority === "P0" ? "#c084fc" : task.priority === "P1" ? "#fbbf24" : "#9ca3af";
		block.style.setProperty("border-left-color", priorityColor)
		block.innerHTML = this.renderTodoExpandHTML(task);
		anchor.insertAdjacentElement("afterend", block);
		anchor.classList.add("todo-expanded");
		this.todoExpandTaskId = taskId;
		this.bindTodoExpandEvents(block, taskId);

		// 点击展开区域外收起
		if (this.todoExpandCloseHandler) {
			document.removeEventListener("mousedown", this.todoExpandCloseHandler);
			this.todoExpandCloseHandler = null;
		}
		const closeHandler = (e: MouseEvent) => {
			if (!section.contains(e.target as Node)) {
				this.collapseTodoExpand(section);
			}
		};
		this.todoExpandCloseHandler = closeHandler;
		setTimeout(() => document.addEventListener("mousedown", closeHandler), 100);
	}

	// 收起今日待办的就地展开块
	private collapseTodoExpand(section: HTMLElement) {
		section.querySelector(".polaris-todo-expand")?.remove();
		section.querySelector(".polaris-todo-item.todo-expanded")?.classList.remove("todo-expanded");
		this.todoExpandTaskId = null;
		if (this.todoExpandCloseHandler) {
			document.removeEventListener("mousedown", this.todoExpandCloseHandler);
			this.todoExpandCloseHandler = null;
		}
	}

	// 今日待办就地展开块内容（复用任务详情抽屉的组件与 token，紧凑排版）
	private renderTodoExpandHTML(task: any): string {
		return `
			<div style="font-size:10px;color:var(--text-muted);letter-spacing:1px;margin-bottom:6px;">${task.id.toUpperCase()}</div>
			<div style="font-size:15px;font-weight:700;line-height:1.4;margin-bottom:12px;">${task.title}</div>
			<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">
				<span>任务进度</span>
				<span style="color:var(--text-brand);font-weight:700;">${task.progress}%</span>
			</div>
			<div class="progress-track" style="margin-bottom:12px;">
				<div class="progress-fill" style="width:${task.progress}%"></div>
			</div>
			<div class="detail-edit-list" style="margin:8px 0;">
				<div class="detail-edit-row">
					<span class="detail-edit-row-label">📅 开始日期</span>
					<button type="button" class="detail-edit-row-input date-field polaris-expand-start" data-task-id="${task.id}">
						<span class="date-field-value ${task.startDate ? "" : "empty"}">${task.startDate || "选择日期"}</span>
						<span class="date-field-icon">📅</span>
					</button>
				</div>
				<div class="detail-edit-row">
					<span class="detail-edit-row-label">🕐 截止日期</span>
					<button type="button" class="detail-edit-row-input date-field polaris-expand-due" data-task-id="${task.id}">
						<span class="date-field-value ${task.dueDate ? "" : "empty"}">${task.dueDate || "选择日期"}</span>
						<span class="date-field-icon">📅</span>
					</button>
				</div>
				<div class="detail-edit-row">
					<span class="detail-edit-row-label">👤 负责人</span>
					<input class="detail-edit-row-input polaris-expand-assignee" data-task-id="${task.id}" value="${task.assignee || ""}" placeholder="未设置" />
				</div>
			</div>
			<div class="detail-edit-list" style="margin:12px 0;">
				<div class="detail-edit-row">
					<span class="detail-edit-row-label">状态</span>
					<div class="status-segmented">
						<button class="status-seg ${task.status==='todo'?'active':''}" data-status="todo" data-task-id="${task.id}">待办</button>
						<button class="status-seg ${task.status==='doing'?'active':''}" data-status="doing" data-task-id="${task.id}">进行中</button>
						<button class="status-seg ${task.status==='done'?'active':''}" data-status="done" data-task-id="${task.id}">已完成</button>
					</div>
				</div>
				<div class="detail-edit-row">
					<span class="detail-edit-row-label">优先级</span>
					<div class="status-segmented">
						<button class="status-seg ${task.priority==='P0'?'active':''}" data-priority="P0" data-task-id="${task.id}">P0</button>
						<button class="status-seg ${task.priority==='P1'?'active':''}" data-priority="P1" data-task-id="${task.id}">P1</button>
						<button class="status-seg ${task.priority==='P2'?'active':''}" data-priority="P2" data-task-id="${task.id}">P2</button>
					</div>
				</div>
			</div>
			<div class="detail-actions" style="margin-top:12px;">
				<button class="btn-primary polaris-expand-complete" data-task-id="${task.id}">✓ 完成任务</button>
				<button class="btn-secondary polaris-expand-open-note" data-task-id="${task.id}">📝 编辑笔记</button>
			</div>
		`;
	}

	// 绑定今日待办就地展开块的交互（状态/优先级切换、完成任务、打开笔记）
	private bindTodoExpandEvents(block: HTMLElement, taskId: string) {
		// 状态切换：更新后重渲染列表并保持展开
		block.querySelectorAll(".status-seg[data-status]").forEach((el) => {
			(el as HTMLElement).onclick = (e) => {
				e.stopPropagation();
				const status = (el as HTMLElement).dataset.status as any;
				if (status) {
					this.updateTaskStatus(taskId, status);
					this.renderBoard();
					this.renderTodayPanel();
					this.reopenTodoExpand(taskId);
				}
			};
		});
		// 优先级切换：更新后重渲染列表并保持展开
		block.querySelectorAll(".status-seg[data-priority]").forEach((el) => {
			(el as HTMLElement).onclick = (e) => {
				e.stopPropagation();
				const priority = (el as HTMLElement).dataset.priority as any;
				if (priority) {
					this.updateTaskPriority(taskId, priority);
					this.renderBoard();
					this.renderTodayPanel();
					this.reopenTodoExpand(taskId);
				}
			};
		});
		// 完成任务：完成后列表重排，展开块自然收起
		const completeBtn = block.querySelector(".polaris-expand-complete") as HTMLElement;
		if (completeBtn) completeBtn.onclick = (e) => {
			e.stopPropagation();
			this.toggleTaskComplete(taskId);
			this.renderBoard();
			this.renderTodayPanel();
			this.showToast("任务已完成");
		};
		// 打开关联笔记
		const openNoteBtn = block.querySelector(".polaris-expand-open-note") as HTMLElement;
		if (openNoteBtn) openNoteBtn.onclick = (e) => {
			e.stopPropagation();
			const task = this.workTasks.find((t) => t.id === taskId);
			if (task?.notePath) {
				this.openNoteByPath(task.notePath);
			} else {
				this.showToast("该任务未关联笔记");
			}
		};
		// 可编辑字段：开始日期 / 截止日期 / 负责人，修改后保存并保持展开
		const saveExpandField = (key: "startDate" | "dueDate" | "assignee", input: HTMLInputElement) => {
			input.onchange = () => {
				const task = this.workTasks.find((t) => t.id === taskId);
				if (!task) return;
				(task as any)[key] = input.value.trim();
				this.saveWorkTasks();
				this.renderBoard();
				this.renderTodayPanel();
				this.reopenTodoExpand(taskId);
				this.showToast("已保存");
			};
			input.onkeydown = (e) => {
				if (e.key === "Enter") input.blur();
			};
		};
		// 日期字段：点击弹出月历点选（仿飞书多维表格），选择后保存并保持展开
		const bindExpandDate = (key: "startDate" | "dueDate", btn: HTMLButtonElement) => {
			btn.onclick = (e) => {
				e.stopPropagation();
				const task = this.workTasks.find((t) => t.id === taskId);
				if (!task) return;
				this.openDatePicker(btn, (task as any)[key], (mmdd) => {
					const tk = this.workTasks.find((x) => x.id === taskId);
					if (!tk) return;
					(tk as any)[key] = mmdd;
					this.saveWorkTasks();
					this.renderBoard();
					this.renderTodayPanel();
					this.reopenTodoExpand(taskId);
					this.showToast("已保存");
				});
			};
		};
		block.querySelectorAll<HTMLButtonElement>(".polaris-expand-start").forEach((el) => bindExpandDate("startDate", el));
		block.querySelectorAll<HTMLButtonElement>(".polaris-expand-due").forEach((el) => bindExpandDate("dueDate", el));
		// 负责人：文本输入，修改后保存并保持展开
		block.querySelectorAll<HTMLInputElement>(".polaris-expand-assignee").forEach((el) => saveExpandField("assignee", el));
	}

	// 面板重渲染后，重新就地展开指定任务（状态/优先级切换后保持展开）
	private reopenTodoExpand(taskId: string) {
		const container = this.rootEl?.querySelector(".polaris-today-todos") as HTMLElement;
		if (!container) return;
		const item = container.querySelector(`.polaris-todo-item[data-task-id="${taskId}"]`) as HTMLElement | null;
		if (item) this.toggleTodoExpand(taskId, item);
	}

	// 切换任务完成状态
	private toggleTaskComplete(taskId: string) {
		const task = this.workTasks.find((t) => t.id === taskId);
		if (!task) return;
		const today = new Date().toISOString().split("T")[0];
		if (task.status === "done") {
			task.status = "todo";
			task.completedDate = undefined;
			task.progress = 0;
		} else {
			task.status = "done";
			task.completedDate = today;
			task.progress = 100;
		}
		this.saveWorkTasks();
	}

	// 渲染本周学习 HTML（层级：分组标题 + 子项缩进 + 进度条/百分比统一）
	private renderWeeklyLearningHTML(showTitle = true): string {
		let html = showTitle ? `<div class="detail-section-title" style="display:flex;align-items:center;margin-bottom:8px;"><span>📚 本周学习</span></div>` : "";
		// 从 Vault 读取真实的 PARA 文件夹笔记
		const learningNotes = this.getRecentLearningNotes(5);
		if (learningNotes.length === 0) {
			html += `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px;">暂无学习笔记</div>`;
		} else {
			// 按 folder 分组展示层级
			const groups: Record<string, any[]> = {};
			learningNotes.forEach((note: any) => {
				if (!groups[note.folder]) groups[note.folder] = [];
				groups[note.folder].push(note);
			});
			const groupNames = Object.keys(groups);
			const groupColors = ["#c8e060", "#a78bfa", "#60a5fa", "#f59e0b", "#f472b6"];
			groupNames.forEach((g, gi) => {
				const gColor = groupColors[gi % groupColors.length];
				html += `<div style="margin-bottom:8px;">`;
				html += `<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
					<span style="width:3px;height:10px;border-radius:2px;background:${gColor};"></span>
					<span style="font-size:11px;color:var(--text-secondary);font-weight:600;">${g}</span>
				</div>`;
				groups[g].forEach((note: any) => {
					const progress = note.progress || 0;
					html += `
						<div class="polaris-learning-item" data-path="${note.path}" title="点击打开笔记">
							<div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;margin-bottom:6px;">
								<span style="color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${note.name}</span>
								<span style="color:${progress >= 100 ? "var(--text-brand)" : "var(--text-secondary)"};font-weight:600;flex-shrink:0;margin-left:8px;">${progress}%</span>
							</div>
							<div style="height:5px;background:${this.themeIsLight() ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"};border-radius:999px;overflow:hidden;">
								<div style="height:100%;width:${progress}%;background:${progress >= 100 ? "var(--brand-green)" : gColor};border-radius:999px;"></div>
							</div>
						</div>
					`;
				});
				html += `</div>`;
			});
		}
		return html;
	}

	// 获取最近的学习笔记（PARA 文件夹）
	private getRecentLearningNotes(limit: number): any[] {
		try {
			const files = this.app.vault.getFiles();
			const paraFolders = ["01-Projects-项目", "02-Areas-领域", "03-Resources-资源"];
			const learningFiles = files
				.filter((f) => {
					const path = f.path;
					return paraFolders.some((folder) => path.startsWith(folder)) &&
						f.extension === "md" &&
						!/\d{4}-\d{2}-\d{2}/.test(f.basename);
				})
				.sort((a, b) => b.stat.mtime - a.stat.mtime)
				.slice(0, limit);
			return learningFiles.map((f, i) => {
				const folderRaw = f.path.split("/")[0] || "";
				const maxSize = Math.max(...learningFiles.map((x) => x.stat.size), 1);
				const progress = Math.round((f.stat.size / maxSize) * 100);
				// PARA 文件夹形如 01-Projects-项目 → 取中文后缀“项目/领域/资源/归档”，无则回退
				const folderSegs = folderRaw.split("-");
				const folderLabel = folderSegs.length >= 3 ? folderSegs.slice(2).join("-") : (folderSegs[folderSegs.length-1] || folderRaw);
				return {
					name: f.basename.replace(".md", ""),
					path: f.path,
					folder: folderLabel,
					progress: Math.min(progress, 100),
				};
			});
		} catch (e) {
			return [];
		}
	}

	// 打开任务详情抽屉
	private openTaskDrawer(taskId: string) {
		const task = this.workTasks.find((t) => t.id === taskId);
		if (!task) return;
		const drawer = this.rootEl!.querySelector("#polaris-drawer") as HTMLElement;
		const overlay = this.rootEl!.querySelector("#polaris-drawer-overlay") as HTMLElement;
		const priorityColor = task.priority === "P0" ? "#c084fc" : task.priority === "P1" ? "#fbbf24" : "#9ca3af";
		const statusColor = task.status === "done" ? (this.themeIsLight() ? "#a8c040" : "#c8e060") : task.status === "doing" ? "#60a5fa" : "#9ca3af";
		const statusText = task.status === "done" ? "已完成" : task.status === "doing" ? "进行中" : "待办";
		drawer.innerHTML = `
			<div class="polaris-drawer-header">
				<div class="polaris-drawer-title">任务详情</div>
				<button class="polaris-drawer-close" onclick="document.getElementById('polaris-drawer')?.classList.remove('open');document.getElementById('polaris-drawer-overlay')?.classList.remove('open');">✕</button>
			</div>
			<div style="font-size:11px;color:var(--text-muted);letter-spacing:1px;margin-bottom:8px;">${task.id.toUpperCase()}</div>
			<div style="font-size:20px;font-weight:700;line-height:1.4;margin-bottom:16px;">${task.title}</div>
			<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;">
				<span class="badge" style="background:${priorityColor}22;color:${priorityColor};">${task.priority} 优先级</span>
				<span class="badge" style="background:${statusColor}22;color:${statusColor};">${statusText}</span>
			</div>
			<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-secondary);margin-bottom:8px;font-weight:500;">
				<span>任务进度</span>
				<span style="color:var(--text-brand);font-weight:700;">${task.progress}%</span>
			</div>
			<div class="progress-track" style="margin-bottom:20px;">
				<div class="progress-fill" style="width:${task.progress}%"></div>
			</div>
			<div class="detail-grid" style="margin:20px 0;">
				<div class="detail-grid-item">
					<div class="detail-grid-label">截止日期</div>
					<div class="detail-grid-value">${task.dueDate ? `<span style="color:${this.isTaskOverdue(task) ? "var(--danger-red)" : "inherit"};font-weight:${this.isTaskOverdue(task) ? 600 : 400};">${task.dueDate}</span>` : "未设置"}</div>
				</div>
				<div class="detail-grid-item">
					<div class="detail-grid-label">负责人</div>
					<div class="detail-grid-value">${task.assignee || "我"}</div>
				</div>
			</div>
			<div class="detail-edit-list" style="margin:20px 0;">
				<div class="detail-edit-row">
					<span class="detail-edit-row-label">状态</span>
					<div class="status-segmented">
						<button class="status-seg ${task.status==='todo'?'active':''}" data-status="todo" data-task-id="${task.id}">待办</button>
						<button class="status-seg ${task.status==='doing'?'active':''}" data-status="doing" data-task-id="${task.id}">进行中</button>
						<button class="status-seg ${task.status==='done'?'active':''}" data-status="done" data-task-id="${task.id}">已完成</button>
					</div>
				</div>
				<div class="detail-edit-row">
					<span class="detail-edit-row-label">优先级</span>
					<div class="status-segmented">
						<button class="status-seg ${task.priority==='P0'?'active':''}" data-priority="P0" data-task-id="${task.id}">P0</button>
						<button class="status-seg ${task.priority==='P1'?'active':''}" data-priority="P1" data-task-id="${task.id}">P1</button>
						<button class="status-seg ${task.priority==='P2'?'active':''}" data-priority="P2" data-task-id="${task.id}">P2</button>
					</div>
				</div>
			</div>
			<div class="detail-actions" style="margin-top:24px;">
				<button class="btn-primary polaris-drawer-complete" data-task-id="${task.id}">✓ 完成任务</button>
				<button class="btn-secondary polaris-drawer-open-note" data-task-id="${task.id}">📝 编辑笔记</button>
			</div>
		`;
		drawer.classList.add("open");
		overlay.classList.add("open");
		// 绑定状态切换
		drawer.querySelectorAll(".status-seg[data-status]").forEach((el) => {
			(el as HTMLElement).onclick = () => {
				const id = (el as HTMLElement).dataset.taskId;
				const status = (el as HTMLElement).dataset.status as any;
				if (id && status) {
					this.updateTaskStatus(id, status);
					this.openTaskDrawer(id);
					this.renderTodayPanel();
					this.renderBoard();
				}
			};
		});
		// 绑定优先级切换
		drawer.querySelectorAll(".status-seg[data-priority]").forEach((el) => {
			(el as HTMLElement).onclick = () => {
				const id = (el as HTMLElement).dataset.taskId;
				const priority = (el as HTMLElement).dataset.priority as any;
				if (id && priority) {
					this.updateTaskPriority(id, priority);
					this.openTaskDrawer(id);
					this.renderTodayPanel();
					this.renderBoard();
				}
			};
		});
		// 绑定完成按钮
		const completeBtn = drawer.querySelector(".polaris-drawer-complete") as HTMLElement;
		completeBtn.onclick = () => {
			const id = completeBtn.dataset.taskId;
			if (id) {
				this.toggleTaskComplete(id);
				this.closeDrawer();
				this.renderTodayPanel();
				this.renderBoard();
				this.showToast("任务已完成");
			}
		};
		// 绑定打开笔记
		const openNoteBtn = drawer.querySelector(".polaris-drawer-open-note") as HTMLElement;
		openNoteBtn.onclick = () => {
			const id = openNoteBtn.dataset.taskId;
			const task = this.workTasks.find((t) => t.id === id);
			if (task?.notePath) {
				this.openNoteByPath(task.notePath);
			} else {
				this.showToast("该任务未关联笔记");
			}
		};
	}

	// 关闭抽屉
	private closeDrawer() {
		const drawer = this.rootEl?.querySelector("#polaris-drawer");
		const overlay = this.rootEl?.querySelector("#polaris-drawer-overlay");
		drawer?.classList.remove("open");
		overlay?.classList.remove("open");
	}

	// 更新任务状态
	private updateTaskStatus(taskId: string, status: "todo" | "doing" | "done") {
		const task = this.workTasks.find((t) => t.id === taskId);
		if (!task) return;
		task.status = status;
		if (status === "done") {
			task.progress = 100;
			task.completedDate = new Date().toISOString().split("T")[0];
		} else if (status === "todo") {
			task.progress = 0;
			task.completedDate = undefined;
		}
		this.saveWorkTasks();
	}

	// 更新任务优先级
	private updateTaskPriority(taskId: string, priority: "P0" | "P1" | "P2") {
		const task = this.workTasks.find((t) => t.id === taskId);
		if (!task) return;
		task.priority = priority;
		this.saveWorkTasks();
	}

	// 各看板卡片默认顺序
	private readonly DEFAULT_CARD_ORDER: Record<string, string[]> = {
		work: ["stats", "focus", "gantt", "kanban"],
		knowledge: ["stats", "output", "para", "heatmap", "tags", "recent", "starred"],
		review: ["stats", "progress", "subjects", "queue", "trend", "mastery", "learning"],
	};
	// 各卡片默认宽度（12 列网格占列数）
	private readonly DEFAULT_CARD_WIDTH: Record<string, number> = {
		focus: 12, gantt: 12, kanban: 12,
		output: 8, para: 4, heatmap: 12, tags: 12, recent: 6, starred: 6,
		progress: 4, subjects: 8, queue: 8, trend: 4, mastery: 6, learning: 6,
	};
	private cardOrder: Record<string, string[]> = {};
	private cardWidth: Record<string, number> = {};

	private getReviewBadgeHTML(): string {
		const today = new Date();
		const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
		const dueCount = (this.reviewRecords || []).filter((r) => !r.skipped && r.nextDue && r.nextDue <= todayStr).length;
		return dueCount > 0 ? `<span class="review-badge">${dueCount}</span>` : "";
	}

	private loadCardLayout() {
		const lay = this.plugin?.pluginData?.cardLayout as { order?: Record<string, string[]>; width?: Record<string, number> } | undefined;
		if (lay?.order) this.cardOrder = lay.order;
		if (lay?.width) this.cardWidth = lay.width;
	}
	private async saveCardLayout() {
		if (!this.plugin) return;
		this.plugin.pluginData.cardLayout = { order: this.cardOrder, width: this.cardWidth };
		await this.plugin.savePluginData();
	}
	private getCardOrder(board: string): string[] {
		const def = this.DEFAULT_CARD_ORDER[board] || [];
		const saved = this.cardOrder[board];
		if (!saved || saved.length === 0) return [...def];
		const merged = saved.filter((id) => def.includes(id));
		def.forEach((id) => { if (!merged.includes(id)) merged.push(id); });
		return merged;
	}
	private getCardSpan(id: string): number {
		return this.cardWidth[id] || this.DEFAULT_CARD_WIDTH[id] || 12;
	}

	// 统计卡组件（三看板共用；clickId 传入后卡片可点击并带 data-stat-click 标识）
	private statCardHTML(icon: string, color: string, num: string | number, label: string, note: string, danger = false, noteWarn = false, clickId = ""): string {
		const clickAttr = clickId
			? ` data-stat-click="${clickId}" role="button" tabindex="0" title="点击查看${label}明细" style="cursor:pointer;transition:opacity 0.15s;" onmouseenter="this.style.opacity='0.72'" onmouseleave="this.style.opacity='1'"`
			: "";
		return `<div class="stat-card${danger ? " danger" : ""}"${clickAttr}>
			<div class="stat-icon ${color}">${icon}</div>
			<div class="stat-info">
				<div class="stat-num">${num}</div>
				<div class="stat-label">${label}</div>
				${note ? `<div class="stat-note${noteWarn ? " stat-note-warn" : ""}">${note}</div>` : ""}
			</div>
		</div>`;
	}

	// 卡片壳组件（所有主卡片共用：拖拽手柄 + 标题 + 工具区 + 内容区 + 宽度调节手柄）
	private cardShell(opts: { id: string; title: string; icon: string; bodyClass: string; toolsHTML?: string; fixed?: boolean }): string {
		const span = opts.fixed ? 12 : Math.max(1, Math.min(12, Math.round(this.getCardSpan(opts.id))));
		return `<div class="dash-card" data-card-id="${opts.id}" style="--span:${span}">
			<div class="dash-card-head">
				${opts.fixed ? "" : `<span class="dash-card-drag" title="拖拽排序">⠿</span>`}
				<span class="dash-card-title">${opts.icon} ${opts.title}</span>
				${opts.toolsHTML ? `<div class="dash-card-tools">${opts.toolsHTML}</div>` : ""}
			</div>
			<div class="dash-card-body ${opts.bodyClass}"></div>
			${opts.fixed ? "" : `<span class="dash-card-resize" title="拖动调整宽度">⇆</span>`}
		</div>`;
	}

	// 统计行卡片壳（三看板统计行共用，可参与排序，固定全宽）
	private statRowShell(): string {
		return `<div class="dash-card dash-card-stat-row" data-card-id="stats" style="--span:12">
			<div class="dash-card-head"><span class="dash-card-drag" title="拖拽排序">⠿</span><span class="dash-card-title">📊 数据概览</span></div>
			<div class="dash-card-body"></div>
		</div>`;
	}

	// 卡片拖拽排序（Pointer Events，按指针所在卡片的位置插前/插后）
	private startCardDrag(e: PointerEvent, board: string) {
		const handle = e.currentTarget as HTMLElement;
		const card = handle.closest(".dash-card") as HTMLElement;
		if (!card) return;
		e.preventDefault();
		const grid = card.parentElement as HTMLElement;
		// 跟手拖拽：卡片脱离文档流跟随指针，占位符让其他卡片实时让位
		const rect = card.getBoundingClientRect();
		const ph = document.createElement("div");
		ph.className = "dash-card-drag-placeholder";
		ph.style.setProperty("height", rect.height + "px")
		ph.style.setProperty("grid-column", getComputedStyle(card).gridColumn)
		const offsetX = e.clientX - rect.left;
		const offsetY = e.clientY - rect.top;
		grid.replaceChild(ph, card);
		card.classList.add("dragging");
		this.snapshotCardVars(card);
		card.style.setProperty("position", "fixed")
		card.style.setProperty("left", rect.left + "px")
		card.style.setProperty("top", rect.top + "px")
		card.style.setProperty("width", rect.width + "px")
		card.style.setProperty("height", rect.height + "px")
		card.style.setProperty("margin", "0")
		card.style.setProperty("z-index", "1000")
		card.style.setProperty("pointer-events", "none")
		document.body.appendChild(card);
		const onMove = (ev: PointerEvent) => {
			ev.preventDefault();
			card.style.setProperty("left", (ev.clientX - offsetX) + "px")
			card.style.setProperty("top", (ev.clientY - offsetY) + "px")
			let best: { el: HTMLElement; r: DOMRect; dist: number } | null = null;
			for (const el of Array.from(grid.querySelectorAll<HTMLElement>(".dash-card"))) {
				if (el === card || el === ph) continue;
				const r = el.getBoundingClientRect();
				const dx = ev.clientX - (r.left + r.width / 2);
				const dy = ev.clientY - (r.top + r.height / 2);
				const dist = dx * dx + dy * dy;
				if (!best || dist < best.dist) best = { el, r, dist };
			}
			if (best) {
				const r = best.r;
				// 插入方向：卡外上方→插前、卡外下方→插后、卡内以纵向中线为界（上半→插前、下半→插后）
				let after: boolean;
				if (ev.clientY < r.top) after = false;
				else if (ev.clientY > r.bottom) after = true;
				else after = ev.clientY > r.top + r.height / 2;
				// 占位符实时移动，其他卡片围绕占位符让位
				if (after) grid.insertBefore(ph, best.el.nextSibling);
				else grid.insertBefore(ph, best.el);
			}
		};
		const ac = new AbortController();
		this._docAborters.push(ac);
		const finish = (save: boolean) => {
			ac.abort();
			const ai = this._docAborters.indexOf(ac);
			if (ai >= 0) this._docAborters.splice(ai, 1);
			if (this._activeDragFinish === finish) this._activeDragFinish = null;
			if (!ph.isConnected) { card.remove(); return; }
			grid.replaceChild(card, ph);
			card.style.setProperty("position", "")
			card.style.setProperty("left", "")
			card.style.setProperty("top", "")
			card.style.setProperty("width", "")
			card.style.setProperty("height", "")
			card.style.setProperty("margin", "")
			card.style.setProperty("z-index", "")
			card.style.setProperty("pointer-events", "")
			card.classList.remove("dragging");
			if (save) {
				const order = Array.from(grid.querySelectorAll(".dash-card")).map((c) => (c as HTMLElement).dataset.cardId || "");
				this.cardOrder[board] = order;
				void this.saveCardLayout();
			}
		};
		this._activeDragFinish = finish;
		document.addEventListener("pointermove", onMove, { signal: ac.signal });
		document.addEventListener("pointerup", () => finish(true), { signal: ac.signal });
		document.addEventListener("pointercancel", () => finish(false), { signal: ac.signal });
	}

	// 卡片宽度调节（Pointer Events，档位 33/50/66/100%）
	private startCardResize(e: PointerEvent, board: string) {
		const handle = e.currentTarget as HTMLElement;
		const card = handle.closest(".dash-card") as HTMLElement;
		if (!card) return;
		e.preventDefault();
		const startX = e.clientX;
		const startSpan = this.getCardSpan(card.dataset.cardId || "");
		const gridW = (card.parentElement as HTMLElement).getBoundingClientRect().width || 1;
		const tip = document.createElement("div");
		tip.className = "dash-width-tip";
		document.body.appendChild(tip);
		let curSpan = startSpan;
		const onMove = (ev: PointerEvent) => {
			ev.preventDefault();
			const target = Math.max(1, Math.min(12, Math.round(startSpan + ((ev.clientX - startX) / gridW) * 12)));
			const spans = [4, 6, 8, 12];
			curSpan = spans.reduce((best, s) => (Math.abs(s - target) < Math.abs(best - target) ? s : best), 12);
			card.style.setProperty("--span", String(curSpan));
			tip.textContent = `${Math.round((curSpan / 12) * 100)}% 宽`;
			tip.style.setProperty("left", `${ev.clientX + 12}px`)
			tip.style.setProperty("top", `${ev.clientY - 30}px`)
		};
		const ac = new AbortController();
		this._docAborters.push(ac);
		const finish = (save: boolean) => {
			ac.abort();
			const ai = this._docAborters.indexOf(ac);
			if (ai >= 0) this._docAborters.splice(ai, 1);
			if (this._activeDragFinish === finish) this._activeDragFinish = null;
			if (tip.isConnected) tip.remove();
			const id = card.dataset.cardId || "";
			if (save && curSpan !== startSpan) {
				this.cardWidth[id] = curSpan;
				void this.saveCardLayout();
			}
		};
		this._activeDragFinish = finish;
		document.addEventListener("pointermove", onMove, { signal: ac.signal });
		document.addEventListener("pointerup", () => finish(true), { signal: ac.signal });
		document.addEventListener("pointercancel", () => finish(false), { signal: ac.signal });
	}

	private bindCardDragResize(board: string) {
		const main = this.rootEl!.querySelector(".polaris-main") as HTMLElement;
		const grid = main.querySelector(`.dash-grid[data-board="${board}"]`) as HTMLElement;
		if (!grid) return;
		grid.querySelectorAll(".dash-card-drag").forEach((h) => {
			const el = h as HTMLElement;
			el.style.setProperty("touch-action", "none")
			el.addEventListener("pointerdown", (ev) => this.startCardDrag(ev as PointerEvent, board));
		});
		grid.querySelectorAll(".dash-card-resize").forEach((h) => {
			const el = h as HTMLElement;
			el.style.setProperty("touch-action", "none")
			el.addEventListener("pointerdown", (ev) => this.startCardResize(ev as PointerEvent, board));
		});
	}

	private renderBoard() {
		// 切换看板前取消进行中的拖拽（防止卡片引用失效）
		if (this._activeDragFinish) { const f = this._activeDragFinish; f(); }
		const root = this.rootEl!;
		const main = root.querySelector(".polaris-main") as HTMLElement;
		// 日历一级看板已移除（改为日期信息条点击弹出月历）；
		// 此守卫兼容旧版 data.json 中可能残留的 currentBoard="calendar"
		if (this.currentBoard === "calendar") { this.currentBoard = "work"; }
		if (this.currentBoard === "work") { this.renderWorkBoard(main); }
		else if (this.currentBoard === "knowledge") { this.renderKnowledgeBoard(main); }
		else { this.renderReviewBoard(main); }
	}

	private renderWorkBoard(main: HTMLElement) {
		const order = this.getCardOrder("work");
		const shells: Record<string, string> = {
			stats: this.statRowShell(),
			focus: this.cardShell({ id: "focus", title: "今日焦点", icon: "🎯", bodyClass: "polaris-work-focus" }),
			gantt: this.cardShell({ id: "gantt", title: "项目时间线", icon: "📊", bodyClass: "polaris-work-gantt", toolsHTML: this.ganttToolsHTML() }),
			kanban: this.cardShell({ id: "kanban", title: "任务看板", icon: "🗂️", bodyClass: "polaris-work-kanban", toolsHTML: this.kanbanToolsHTML() }),
		};
		main.innerHTML = `
			<div class="board-wrap">
				<div class="canvas-header"><div class="canvas-header-title">💼 工作看板</div><button class="btn-primary polaris-header-new">＋ 新建任务</button></div>
				<div class="dash-grid" data-board="work">
					${order.map((id) => shells[id] || "").join("")}
				</div>
			</div>`;
		this.renderWorkStats(main);
		this.renderFocusCard(main);
		this.renderGantt(main);
		this.renderKanban(main);
		this.bindKanbanToolsEvents(main);
		this.bindCardDragResize("work");
		(main.querySelector(".polaris-header-new") as HTMLElement).onclick = () => this.openNewCardModal();
	}

	// 任务看板工具区（搜索 + 筛选，卡片壳头部右侧）
	private kanbanToolsHTML(): string {
		const filter = this.kanbanFilter;
		return `<div class="kanban-tools" style="display:flex;align-items:center;gap:8px;">
			<div class="kanban-search-wrap ${this.kanbanSearch ? "expanded" : ""}">
				<button class="kanban-search-toggle" title="搜索任务"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></button>
				<div class="kanban-search-box">
					<span class="kanban-search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>
					<input type="text" class="kanban-search-input" placeholder="搜索任务..." value="${this.kanbanSearch}">
					${this.kanbanSearch ? `<span class="kanban-search-clear">✕</span>` : ""}
				</div>
			</div>
			<div class="filter-tabs">
				${[{key:"all",name:"全部"},{key:"todo",name:"待办"},{key:"doing",name:"进行中"},{key:"done",name:"已完成"},{key:"overdue",name:"逾期"}].map((f)=>`<button class="filter-tab ${filter===f.key?"active":""}" data-filter="${f.key}">${f.name}</button>`).join("")}
			</div>
		</div>`;
	}

	// 甘特图周/月/季/年切换按钮（卡片壳工具区）
	private ganttToolsHTML(): string {
		const m = this.ganttMode;
		const btn = (mode: string, label: string) =>
			`<button class="gantt-view-btn ${m === mode ? "active" : ""}" data-mode="${mode}">${label}</button>`;
		return `<div class="gantt-view-toggle">
			${btn("week", "周")}${btn("month", "月")}${btn("quarter", "季")}${btn("year", "年")}
		</div>`;
	}

	private renderKnowledgeBoard(main: HTMLElement) {
		const order = this.getCardOrder("knowledge");
		const shells: Record<string, string> = {
			stats: this.statRowShell(),
			output: this.cardShell({ id: "output", title: "笔记产出", icon: "📈", bodyClass: "polaris-kb-output", toolsHTML: this.outputToolsHTML() }),
			para: this.cardShell({ id: "para", title: "PARA 分布", icon: "🗂️", bodyClass: "polaris-kb-para" }),
			heatmap: this.cardShell({ id: "heatmap", title: "活跃度热力图", icon: "🔥", bodyClass: "polaris-kb-heatmap", toolsHTML: this.heatmapToolsHTML(this.getVaultStats().heatmapData) }),
			tags: this.cardShell({ id: "tags", title: "标签 Top 10", icon: "🏷️", bodyClass: "polaris-kb-tags" }),
			recent: this.cardShell({ id: "recent", title: "最近笔记", icon: "🕐", bodyClass: "polaris-kb-recent" }),
			starred: this.cardShell({ id: "starred", title: "收藏笔记", icon: "⭐", bodyClass: "polaris-kb-starred" }),
		};
		main.innerHTML = `
			<div class="board-wrap">
				<div class="canvas-header"><div class="canvas-header-title">📚 知识库看板</div><button class="btn-primary polaris-header-new">＋ 新建笔记</button></div>
				<div class="dash-grid" data-board="knowledge">
					${order.map((id) => shells[id] || "").join("")}
				</div>
			</div>`;
		// 内容渲染（各卡片 body）与卡片点击事件绑定
		this.renderKnowledgeBoardContent(main);
		this.bindCardDragResize("knowledge");
		(main.querySelector(".polaris-header-new") as HTMLElement).onclick = () => this.createNewNote();

		// 刷新按钮：带旋转动效（仅骨架级绑定，Content 刷新不重建）
		const refreshBtn = main.querySelector(".polaris-star-refresh");
		if (refreshBtn) {
			(refreshBtn as HTMLElement).onclick = () => {
				// 添加旋转动画
				(refreshBtn as HTMLElement).style.setProperty("transform", "rotate(360deg)")
				(refreshBtn as HTMLElement).style.setProperty("transition", "transform 0.5s ease")
				setTimeout(() => {
					this.renderKnowledgeBoard(main);
					this.showToast("已刷新收藏列表");
				}, 300);
			};
		}
	}

	// 知识库看板内容渲染（骨架已建好；文件增删改后调用以更新数据概览等，不重建布局）
	private renderKnowledgeBoardContent(main: HTMLElement) {
		this.renderKnowledgeStats(main);
		(main.querySelector(".polaris-kb-output") as HTMLElement).innerHTML = this.knowledgeOutputHTML();
		(main.querySelector(".polaris-kb-para") as HTMLElement).innerHTML = this.knowledgeParaHTML();
		const heatmapCard = main.querySelector(".polaris-kb-heatmap") as HTMLElement;
		heatmapCard.innerHTML = this.renderHeatmap(this.getVaultStats().heatmapData, heatmapCard ? heatmapCard.offsetWidth : 0);
		(main.querySelector(".polaris-kb-tags") as HTMLElement).innerHTML = this.renderTagCloud(this.getVaultStats().topTags, this.getVaultStats().totalTags);
		(main.querySelector(".polaris-kb-recent") as HTMLElement).innerHTML = this.knowledgeRecentHTML();
		(main.querySelector(".polaris-kb-starred") as HTMLElement).innerHTML = this.knowledgeStarredHTML();
		// 热力图工具区统计（近90天活跃/连续打卡/本月笔记）随文件变化同步
		const heatCard = main.querySelector('.dash-card[data-card-id="heatmap"]') as HTMLElement;
		const heatTools = heatCard?.querySelector(".dash-card-tools") as HTMLElement;
		if (heatTools) heatTools.innerHTML = this.heatmapToolsHTML(this.getVaultStats().heatmapData);

		// 最近笔记：点击打开笔记
		main.querySelectorAll('.dash-card[data-card-id="recent"] .list-item').forEach((el) => {
			(el as HTMLElement).onclick = () => {
				const path = (el as HTMLElement).dataset.path;
				if (path) this.openNoteByPath(path);
			};
		});

		// 收藏笔记：点击文字打开笔记
		main.querySelectorAll(".polaris-star-open").forEach((el) => {
			(el as HTMLElement).onclick = (e) => {
				e.stopPropagation();
				const path = (el as HTMLElement).dataset.path;
				if (path) this.openNoteByPath(path);
			};
		});

		// 收藏笔记：点击 × 取消收藏（带确认对话框）
		main.querySelectorAll(".polaris-star-remove").forEach((el) => {
			(el as HTMLElement).onclick = (e) => {
				e.stopPropagation();
				const path = (el as HTMLElement).dataset.path || "";
				const name = path.split("/").pop()?.replace(".md", "") || path;
				this.confirmRemoveStarred(path, name, main);
			};
			// hover 效果
			(el as HTMLElement).onmouseenter = () => { (el as HTMLElement).style.setProperty("opacity", "1") (el as HTMLElement).style.setProperty("color", "var(--danger-red)") (el as HTMLElement).style.setProperty("background", "rgba(239,68,68,0.1)") };
			(el as HTMLElement).onmouseleave = () => { (el as HTMLElement).style.setProperty("opacity", "0.6") (el as HTMLElement).style.setProperty("color", "var(--text-muted)") (el as HTMLElement).style.setProperty("background", "transparent") };
		});

		// 空状态点击：显示调试信息
		const emptyEl = main.querySelector(".polaris-star-empty");
		if (emptyEl) {
			(emptyEl as HTMLElement).onclick = () => {
				this.debugStarredPlugins();
			};
		}

		// 标签点击：搜索该标签
		main.querySelectorAll(".polaris-tag-item").forEach((el) => {
			(el as HTMLElement).onclick = () => {
				const tag = (el as HTMLElement).dataset.tag || "";
				if (tag) {
					this.openGlobalSearch("#" + tag);
				}
			};
			// hover 效果
			(el as HTMLElement).onmouseenter = () => { (el as HTMLElement).style.setProperty("transform", "scale(1.05)") (el as HTMLElement).style.setProperty("opacity", "1") };
			(el as HTMLElement).onmouseleave = () => { (el as HTMLElement).style.setProperty("transform", "scale(1)") };
		});

		// 查看全部标签：打开 Obsidian 标签面板
		const viewAllTagsBtn = main.querySelector(".polaris-view-all-tags");
		if (viewAllTagsBtn) {
			(viewAllTagsBtn as HTMLElement).onclick = () => {
				this.openAllTagsPanel();
			};
		}

		// 笔记产出视图切换：年/月/周
		main.querySelectorAll(".polaris-output-mode").forEach((el) => {
			(el as HTMLElement).onclick = () => {
				const mode = (el as HTMLElement).dataset.mode || "month";
				this.outputMode = mode;
				this.renderKnowledgeBoard(main);
			};
		});

		// 热力图格子点击：打开当日日志
		main.querySelectorAll(".polaris-heatmap-cell").forEach((el) => {
			(el as HTMLElement).onclick = () => {
				const date = (el as HTMLElement).dataset.date || "";
				if (date) {
					this.renderDayLog(date);
				}
			};
			(el as HTMLElement).onmouseenter = () => { (el as HTMLElement).style.setProperty("transform", "scale(1.2)") (el as HTMLElement).style.setProperty("z-index", "10") };
			(el as HTMLElement).onmouseleave = () => { (el as HTMLElement).style.setProperty("transform", "scale(1)") (el as HTMLElement).style.setProperty("z-index", "1") };
		});

		// 热力图视图切换：年/月/周
		main.querySelectorAll(".polaris-heatmap-mode").forEach((el) => {
			(el as HTMLElement).onclick = () => {
				const mode = (el as HTMLElement).dataset.mode || "year";
				this.heatmapMode = mode;
				this.renderKnowledgeBoard(main);
			};
		});
	}

	// 文件增删改 → 防抖刷新知识库看板（等 metadataCache 解析完成后数字才准确，尤其断链）
	private scheduleKnowledgeRefresh() {
		if (this.kbRefreshTimer) window.clearTimeout(this.kbRefreshTimer);
		this.kbRefreshTimer = window.setTimeout(() => {
			this.kbRefreshTimer = null;
			if (this.currentBoard !== "knowledge") return;
			const main = this.rootEl?.querySelector(".board-wrap") as HTMLElement;
			if (main) this.renderKnowledgeBoardContent(main);
		}, 1000);
	}

	// 知识库统计行（统一 stat-card 组件）
	private renderKnowledgeStats(main: HTMLElement) {
		const stats = this.getVaultStats();
		const el = main.querySelector(".dash-card-stat-row .dash-card-body") as HTMLElement;
		if (!el) return;
		el.className = "dash-card-body polaris-stats-overview";
		const lastMonthly = stats.monthly[stats.monthly.length - 1]?.count || 0;
		const diffText = (() => {
			const m = stats.monthly;
			if (!m || m.length < 2) return "—";
			const diff = (m[m.length - 1]?.count || 0) - (m[m.length - 2]?.count || 0);
			if (diff > 0) return "+" + diff + " 篇";
			if (diff < 0) return String(diff) + " 篇";
			return "持平";
		})();
		const brokenNote = stats.brokenLinks > 0 ? "建议修复" : "状态良好";
		const emptyNote = stats.emptyNotes > 0 ? "待补内容" : "状态良好";
		el.innerHTML =
			this.statCardHTML("📚", "blue", stats.total, "总笔记", `PARA 项目 ${stats.paraCounts.projects} 篇`, false, false, "total") +
			this.statCardHTML("🔗", "red", stats.brokenLinks, "断链", brokenNote, stats.brokenLinks > 0, true, "broken") +
			this.statCardHTML("📄", "purple", stats.emptyNotes, "空笔记", emptyNote, false, stats.emptyNotes > 0, "empty") +
			this.statCardHTML("✨", "green", lastMonthly, "本月新增", `较上月 ${diffText}`, false, false, "monthly");
		// 点击统计卡：弹出对应文档列表（可点击打开，便于修复断链 / 补空笔记 / 查看笔记）
		el.querySelectorAll(".stat-card[data-stat-click]").forEach((card) => {
			(card as HTMLElement).onclick = () => this.openStatNoteList((card as HTMLElement).dataset.statClick || "");
		});
	}

	// 知识库统计卡点击：弹出对应文档列表
	private openStatNoteList(kind: string) {
		const stats = this.getVaultStats();
		if (kind === "total") {
			const items = stats.noteList.slice(0, 100).map((n) => ({ name: n.name, path: n.path, sub: n.folder || "根目录" }));
			this.showNoteListModal(`📚 全部笔记（共 ${stats.total} 篇，展示最近 100 篇）`, items, "暂无笔记");
		} else if (kind === "broken") {
			const items = stats.brokenNoteList.map((b) => ({ name: b.name, path: b.path, sub: `断链 ${b.targets.length} 处` }));
			this.showNoteListModal(`🔗 断链笔记（${stats.brokenNoteList.length} 篇文档 · 共 ${stats.brokenLinks} 处断链）`, items, "没有断链笔记 🎉");
		} else if (kind === "empty") {
			const items = stats.emptyNoteList.map((e) => ({ name: e.name, path: e.path, sub: "空笔记" }));
			this.showNoteListModal(`📄 空笔记（共 ${stats.emptyNotes} 篇）`, items, "没有空笔记 🎉");
		} else if (kind === "monthly") {
			const items = stats.monthlyNotes.map((n) => ({ name: n.name, path: n.path, sub: n.folder || "根目录" }));
			this.showNoteListModal(`✨ 本月新增（共 ${items.length} 篇）`, items, "本月还没有新增笔记");
		}
	}

	// 通用笔记列表弹窗：顶部搜索框实时过滤，可滚动，点击项打开对应笔记
	private showNoteListModal(title: string, items: { name: string; path: string; sub?: string }[], emptyText: string) {
		if (!items.length) {
			this.showToast(emptyText);
			return;
		}
		const renderRows = (list: { name: string; path: string; sub?: string }[]) => {
			return list.map((it) => {
				const enc = encodeURIComponent(it.path);
				return `<div class="polaris-note-list-item" role="button" tabindex="0" data-path="${enc}" style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 12px;border-radius:8px;cursor:pointer;transition:opacity 0.15s;" onmouseenter="this.style.opacity='0.65'" onmouseleave="this.style.opacity='1'">
					<span style="font-size:13px;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${it.name}</span>
					${it.sub ? `<span style="font-size:11px;color:var(--text-muted);flex-shrink:0;">${it.sub}</span>` : ""}
				</div>`;
			}).join("");
		};
		this.showModal(title, `
			<div style="padding:8px 16px 0;">
				<div class="search-box">
					<span class="search-icon polaris-note-list-search-icon">🔍</span>
					<input class="search-input polaris-note-list-search" type="text" placeholder="搜索笔记名称或路径…">
				</div>
			</div>
			<div class="polaris-note-list-container" style="max-height:38vh;overflow:auto;display:flex;flex-direction:column;gap:2px;padding:8px 16px 2px;">${renderRows(items)}</div>
			<div style="border-top:1px solid var(--background-modifier-border);margin:2px 16px 0;"></div>
			<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px 0;">
				<span class="polaris-note-list-count" style="font-size:11px;color:var(--text-muted);"></span>
				<button type="button" class="btn-secondary polaris-modal-cancel">关闭</button>
			</div>`);
		const input = this.rootEl!.querySelector(".polaris-note-list-search") as HTMLInputElement;
		const container = this.rootEl!.querySelector(".polaris-note-list-container") as HTMLElement;
		const count = this.rootEl!.querySelector(".polaris-note-list-count") as HTMLElement;
		const bind = () => {
			this.rootEl!.querySelectorAll(".polaris-note-list-item").forEach((el) => {
				(el as HTMLElement).onclick = () => {
					const enc = (el as HTMLElement).dataset.path || "";
					const path = decodeURIComponent(enc);
					this.closeModal();
					this.openNoteByPath(path);
				};
			});
		};
		const update = () => {
			const kw = (input.value || "").trim().toLowerCase();
			const filtered = kw
				? items.filter((it) => (it.name + " " + (it.path || "") + " " + (it.sub || "")).toLowerCase().includes(kw))
				: items;
			container.innerHTML = filtered.length
				? renderRows(filtered)
				: `<div style="padding:20px 0;text-align:center;font-size:12px;color:var(--text-muted);">未找到匹配的笔记</div>`;
			if (count) count.textContent = `${filtered.length} / ${items.length} 篇`;
			bind();
		};
		if (input) {
			input.addEventListener("input", update);
			input.focus();
		}
		update();
	}

	// 笔记产出视图切换按钮（卡片壳工具区）
	private outputToolsHTML(): string {
		return `<div style="display:flex;gap:4px;background:rgba(255,255,255,0.04);border-radius:var(--radius-md);padding:3px;">
			${["year", "month", "week"].map((m) => {
				const label = m === "year" ? "年" : m === "month" ? "月" : "周";
				const active = this.outputMode === m;
				return `<button class="polaris-output-mode" data-mode="${m}" style="padding:4px 12px;border-radius:var(--radius-sm);font-size:11px;cursor:pointer;transition:all 0.15s;border:none;font-family:inherit;${active ? "background:var(--brand-green);color:#0f0f13;font-weight:600;" : "color:var(--text-muted);background:transparent;"}">${label}</button>`;
			}).join("")}
		</div>`;
	}

	// 笔记产出（柱状图 body）
	private knowledgeOutputHTML(): string {
		const mode = this.outputMode;
		return `<div style="height:200px;display:flex;align-items:flex-end;justify-content:center;gap:${mode === "week" ? "12px" : "16px"};padding:24px 16px 12px;border-bottom:1px solid var(--border-color);">
			${this.getOutputData(mode).map((m: any) => {
				const outputData = this.getOutputData(mode);
				const maxCount = Math.max(...outputData.map((x: any) => x.count), 1);
				const h = Math.max((m.count / maxCount) * 150, 6);
				return `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;flex:1;max-width:${mode === "week" ? "80px" : "60px"};">
					<div style="font-size:12px;color:var(--text-primary);font-weight:700;">${m.count}</div>
					<div style="width:100%;max-width:${mode === "week" ? "60px" : "48px"};height:${h}px;background:linear-gradient(180deg,${this.themeIsLight()?"#c8e060":"var(--brand-green)"} 0%,${this.themeIsLight()?"#a8c040":"var(--brand-green-dark)"} 100%);border-radius:10px 10px 4px 4px;min-height:6px;box-shadow:0 4px 12px rgba(200,224,96,0.25);transition:all 0.2s ease;cursor:pointer;" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 20px rgba(200,224,96,0.35)';" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 12px rgba(200,224,96,0.25)';"></div>
					<div style="font-size:11px;color:var(--text-muted);font-weight:500;">${m.label}</div>
				</div>`;
			}).join("")}
		</div>`;
	}

	// PARA 分布（进度条 body）
	private knowledgeParaHTML(): string {
		const stats = this.getVaultStats();
		const paraTotal = stats.total || 1;
		return `<div style="padding:16px 8px;display:flex;flex-direction:column;gap:12px;">
			${stats.paraFolders.map((p) => {
				const count = stats.paraCounts[p.key] || 0;
				const pct = ((count / paraTotal) * 100).toFixed(1);
				return `<div style="display:flex;flex-direction:column;gap:4px;">
					<div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;">
						<span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${p.color};display:inline-block;"></span>${p.name}</span>
						<span style="color:var(--text-secondary);font-weight:600;">${count} (${pct}%)</span>
					</div>
					<div style="height:8px;background:var(--progress-track);border-radius:4px;overflow:hidden;">
						<div style="height:100%;width:${pct}%;background:${p.color};border-radius:4px;transition:width 0.3s;"></div>
					</div>
				</div>`;
			}).join("")}
			<div style="display:flex;flex-direction:column;gap:4px;">
				<div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;">
					<span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:#6b7280;display:inline-block;"></span>其他（日记/打卡等）</span>
					<span style="color:var(--text-secondary);font-weight:600;">${stats.paraCounts.other} (${((stats.paraCounts.other / paraTotal) * 100).toFixed(1)}%)</span>
				</div>
				<div style="height:8px;background:var(--progress-track);border-radius:4px;overflow:hidden;">
					<div style="height:100%;width:${((stats.paraCounts.other / paraTotal) * 100)}%;background:#6b7280;border-radius:4px;"></div>
				</div>
			</div>
		</div>`;
	}

	// 最近笔记（列表 body）
	private knowledgeRecentHTML(): string {
		const stats = this.getVaultStats();
		return stats.recentFiles.length > 0
			? stats.recentFiles.slice(0, 5).map((f: any, i: number) => `<div class="list-item" data-path="${f.path}" data-idx="${i}"><span class="list-item-icon">📄</span><div class="list-item-info"><div class="list-item-name">${f.name}</div><div class="list-item-time">${f.time} · ${f.folder}</div></div></div>`).join("")
			: '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">暂无笔记</div>';
	}

	// 收藏笔记（列表 body）
	private knowledgeStarredHTML(): string {
		const stats = this.getVaultStats();
		if (stats.starredFiles.length > 0) {
			return stats.starredFiles.map((f: any, i: number) => `<div class="list-item polaris-star-item" data-path="${f.path}" data-idx="${i}" style="display:flex;align-items:center;position:relative;"><span class="list-item-icon">⭐</span><div class="list-item-info polaris-star-open" data-path="${f.path}" style="flex:1;min-width:0;cursor:pointer;"><div class="list-item-name">${f.name}</div><div class="list-item-time">${stats.starSource === "bookmarks" ? "书签" : "星标"}</div></div><span class="polaris-star-remove" data-path="${f.path}" style="cursor:pointer;color:var(--text-muted);padding:4px 8px;border-radius:4px;font-size:18px;opacity:0.6;transition:all 0.2s;flex-shrink:0;margin-left:8px;" title="取消收藏">×</span></div>`).join("");
		}
		return `<div class="polaris-star-empty" style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;line-height:1.6;cursor:pointer;" title="点击查看调试信息">暂无收藏笔记<br><span style="font-size:11px;">右键文件 → 添加到书签/星标<br>检测到：${stats.starSource || "未检测到插件"}（点击查看详情）</span></div>`;
	}

	private renderReviewBoard(main: HTMLElement) {
		const order = this.getCardOrder("review");
		const shells: Record<string, string> = {
			stats: this.statRowShell(),
			progress: this.cardShell({ id: "progress", title: "复习进度总览", icon: "🎯", bodyClass: "polaris-rv-progress" }),
			subjects: this.cardShell({ id: "subjects", title: "知识板块分布", icon: "📚", bodyClass: "polaris-rv-subjects" }),
			queue: this.cardShell({ id: "queue", title: "今日复习任务", icon: "📋", bodyClass: "polaris-rv-queue" }),
			trend: this.cardShell({ id: "trend", title: "近7天复习趋势", icon: "📈", bodyClass: "polaris-rv-trend" }),
			mastery: this.cardShell({ id: "mastery", title: "知识点掌握", icon: "🧠", bodyClass: "polaris-rv-mastery" }),
			learning: this.cardShell({ id: "learning", title: "本周学习", icon: "📖", bodyClass: "polaris-rv-learning" }),
		};
		main.innerHTML = `
			<div class="board-wrap">
				<div class="canvas-header"><div class="canvas-header-title">🎯 复习看板</div><button class="btn-primary polaris-header-new">＋ 新建复习</button></div>
				<div class="dash-grid" data-board="review">
					${order.map((id) => shells[id] || "").join("")}
				</div>
			</div>`;
		// 内容渲染（各卡片 body）
		this.renderReviewStats(main);
		(main.querySelector(".polaris-rv-progress") as HTMLElement).innerHTML = this.reviewProgressHTML();
		this.initReviewRing(main);
		(main.querySelector(".polaris-rv-subjects") as HTMLElement).innerHTML = this.reviewSubjectsHTML();
		this.bindSubjectCollapse(main);
		(main.querySelector(".polaris-rv-queue") as HTMLElement).innerHTML = this.reviewQueueHTML();
		(main.querySelector(".polaris-rv-trend") as HTMLElement).innerHTML = this.reviewTrendHTML();
		this.initReviewTrend(main);
		(main.querySelector(".polaris-rv-mastery") as HTMLElement).innerHTML = this.reviewMasteryHTML();
		const rvLearningEl = main.querySelector(".polaris-rv-learning") as HTMLElement;
		if (rvLearningEl) {
			rvLearningEl.innerHTML = this.renderWeeklyLearningHTML(false);
			rvLearningEl.querySelectorAll(".polaris-learning-item").forEach((el) => {
				(el as HTMLElement).onclick = () => {
					const path = (el as HTMLElement).dataset.path;
					if (path) this.openNoteByPath(path);
				};
			});
		}
		this.bindCardDragResize("review");
		(main.querySelector(".polaris-header-new") as HTMLElement).onclick = () => this.openNewReviewModal();
		// 今日复习任务：勾选完成 / 跳过 / 点击打开笔记
		main.querySelectorAll(".review-item").forEach((el) => {
			const itemEl = el as HTMLElement;
			const path = itemEl.dataset.path || "";
			const check = itemEl.querySelector(".review-check");
			if (check) (check as HTMLElement).onclick = async (ev) => {
				ev.stopPropagation();
				await this.completeReview(path);
				const rec = this.reviewRecords.find((r) => r.path === path);
				const nextDays = rec ? Math.max(0, this.daysBetween(this.fmtDate(new Date()), rec.nextDue)) : 0;
				this.renderReviewBoard(main);
				this.showToast(rec?.status === "mastered" ? "已掌握 🎉 完成全部复习阶梯" : `已复习 ✓ 下次 ${nextDays} 天后到期`);
			};
			const skip = itemEl.querySelector(".review-skip");
			if (skip) (skip as HTMLElement).onclick = async (ev) => {
				ev.stopPropagation();
				await this.skipReview(path);
				this.renderReviewBoard(main);
				this.showToast("已跳过，不再自动推荐");
			};
			const wrong = itemEl.querySelector(".review-wrong");
			if (wrong) (wrong as HTMLElement).onclick = async (ev) => {
				ev.stopPropagation();
				await this.markWrong(path);
				this.renderReviewBoard(main);
				this.showToast("已标记不熟，明天再来复习");
			};
			itemEl.onclick = () => this.openNoteByPath(path);
		});
		// 错题本按钮
		const mistakeBtn = main.querySelector(".polaris-mistake-book") as HTMLElement;
		if (mistakeBtn) mistakeBtn.onclick = () => this.openMistakeBook();

	}

	// ==================== 复习引擎与通用工具（组件化改造时丢失，2026-09-07 恢复重写） ====================

	// 日期工具：Date -> YYYY-MM-DD
	private fmtDate(d: Date): string {
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	}

	// 日期工具：a - b 的天数差（YYYY-MM-DD）
	private daysBetween(a: string, b: string): number {
		const da = new Date(a + "T00:00:00");
		const db = new Date(b + "T00:00:00");
		return Math.round((da.getTime() - db.getTime()) / 86400000);
	}

	// 日期工具：dateStr + n 天
	private addDays(dateStr: string, n: number): string {
		const d = new Date(dateStr + "T00:00:00");
		d.setDate(d.getDate() + n);
		return this.fmtDate(d);
	}

	// 复习配置（带默认值兜底）
	private getReviewConfig(): ReviewConfig {
		const c = this.plugin?.pluginData?.reviewConfig;
		return Object.assign({ newWindowDays: 30, queueLimit: 15, minutesPerItem: 5 }, c || {});
	}

	// 通用层级归属（可复用框架，不写死任何领域名）：
	// 顶层领域 = 资源库下第一层文件夹；二级板块 = 领域下第一层子目录（若有）
	private getReviewTop(file: any): string {
		const parts = (file?.path || "").split("/");
		return parts.length >= 3 ? parts[1] : "未分类";
	}
	private getReviewSub(file: any): string {
		const parts = (file?.path || "").split("/");
		return parts.length >= 4 ? parts[2] : "";
	}
	// 兼容调用：单篇笔记的板块归属 = 顶层领域
	private getReviewSubject(file: any): string {
		return this.getReviewTop(file);
	}

	// 持久化复习数据
	private async persistReviewData(): Promise<void> {
		if (!this.plugin) return;
		this.plugin.pluginData.reviewRecords = this.reviewRecords;
		this.plugin.pluginData.reviewSessions = this.reviewSessions;
		await this.plugin.saveData(this.plugin.pluginData);
	}

	// ===== 复习统计（核心引擎）=====
	// 队列构建：逾期/到期记录优先，其次任务关联新笔记，其次窗口期内新笔记首轮；上限 queueLimit
	// 统计：今日完成、进度、逾期、本周学习天数、累计时长、领域分布、近7天趋势、掌握情况
	private getReviewStats() {
		const cfg = this.getReviewConfig();
		const today = this.fmtDate(new Date());
		const files = this.app.vault.getMarkdownFiles();
		const recordMap: Record<string, ReviewRecord> = {};
		this.reviewRecords.forEach((r) => { recordMap[r.path] = r; });
		const paraFolders = ["01-Projects-项目", "02-Areas-领域", "03-Resources-资源"];

		// 1. 到期/逾期记录
		const overdueList: any[] = [];
		const dueList: any[] = [];
		this.reviewRecords.forEach((r) => {
			if (r.skipped || r.status === "mastered") return;
			if (r.lastReviewed === today) return; // 今天已复习过
			if (!r.nextDue || r.nextDue > today) return;
			const f = files.find((x) => x.path === r.path);
			if (!f) return;
			const overdueDays = this.daysBetween(today, r.nextDue);
			if (overdueDays > 0) overdueList.push({ file: f, record: r, reason: "逾期", overdueDays, weight: 3 });
			else dueList.push({ file: f, record: r, reason: "到期", overdueDays: 0, weight: 2 });
		});

		// 2. 新笔记首轮（PARA 白名单 + 创建于窗口期内 + 任务关联加权）
		const taskPaths = new Set<string>();
		(this.workTasks || []).forEach((t: any) => { if (t.notePath) taskPaths.add(t.notePath); });
		const newWindowMs = cfg.newWindowDays * 86400000;
		const newList: any[] = [];
		files.forEach((f) => {
			if (recordMap[f.path]) return;
			const inPara = paraFolders.some((p) => f.path.startsWith(p + "/"));
			if (!inPara) return;
			const ctime = f.stat?.ctime || 0;
			if (!ctime || (Date.now() - ctime) > newWindowMs) return;
			newList.push({ file: f, record: undefined, reason: taskPaths.has(f.path) ? "任务关联" : "首轮", overdueDays: 0, weight: taskPaths.has(f.path) ? 1 : 0 });
		});

		// 3. 组装队列：权重降序，上限 queueLimit
		const queue = [...overdueList, ...dueList, ...newList]
			.sort((a, b) => (b.weight || 0) - (a.weight || 0))
			.slice(0, cfg.queueLimit);

		// —— 统计 ——
		const doneToday = this.reviewSessions.find((s) => s.date === today)?.count || 0;
		const totalToday = queue.length + doneToday;
		const progress = totalToday > 0 ? Math.round((doneToday / totalToday) * 100) : 0;
		const overdue = overdueList.length;

		// 本周学习天数（周一为起点）
		const weekStart = new Date(today + "T00:00:00");
		weekStart.setDate(weekStart.getDate() - (weekStart.getDay() || 7) + 1);
		const weekStartStr = this.fmtDate(weekStart);
		const weekDays = this.reviewSessions.filter((s) => s.date >= weekStartStr && s.date <= today).length;
		const totalCount = this.reviewSessions.reduce((s, x) => s + x.count, 0);
		const totalHours = Math.round(totalCount * cfg.minutesPerItem / 60 * 10) / 10;

		// 知识板块分布（通用层级）：仅统计资源库（03-Resources-资源）领域；占比 > 50% 且有二级目录的领域自动细分二级板块
		const topMap: Record<string, any> = {};
		files.forEach((f) => {
			if (!f.path.startsWith("03-Resources-资源/")) return;
			const top = this.getReviewTop(f);
			const root = (f.path || "").split("/")[0] || "";
			if (!topMap[top]) topMap[top] = { name: top, root: "", total: 0, due: 0, children: {} };
			topMap[top].root = root;
			topMap[top].total++;
			const rec = recordMap[f.path];
			if (rec && !rec.skipped && rec.status !== "mastered" && rec.nextDue && rec.nextDue <= today) topMap[top].due++;
			const sub = this.getReviewSub(f);
			if (sub) {
				if (!topMap[top].children[sub]) topMap[top].children[sub] = { name: sub, total: 0, due: 0 };
				topMap[top].children[sub].total++;
				if (rec && !rec.skipped && rec.status !== "mastered" && rec.nextDue && rec.nextDue <= today) topMap[top].children[sub].due++;
			}
		});
		let subjectTotal = 0;
		Object.values(topMap).forEach((t: any) => { subjectTotal += t.total; });
		const subjects = Object.values(topMap)
			.map((t: any) => {
				const kids = Object.values(t.children).sort((a: any, b: any) => b.total - a.total);
				const expand = subjectTotal > 0 && t.total / subjectTotal > 0.5 && kids.length > 1;
				return { name: t.name, root: t.root, total: t.total, due: t.due, children: expand ? kids : [] };
			})
			.sort((a: any, b: any) => b.total - a.total);

		// 近7天趋势
		const trend: any[] = [];
		for (let i = 6; i >= 0; i--) {
			const d = new Date(today + "T00:00:00");
			d.setDate(d.getDate() - i);
			const ds = this.fmtDate(d);
			const count = this.reviewSessions.find((s) => s.date === ds)?.count || 0;
			trend.push({ date: ds, label: `${d.getMonth() + 1}/${d.getDate()}`, count, isToday: ds === today });
		}

		// 掌握情况：已掌握 = status mastered；复习中 = 未跳过且未掌握（含新笔记首轮）
		const mastered = this.reviewRecords.filter((r) => r.status === "mastered").length;
		const learning = this.reviewRecords.filter((r) => r.status !== "mastered" && !r.skipped).length + newList.length;
		const masteryRate = (mastered + learning) > 0 ? Math.round((mastered / (mastered + learning)) * 100) : 0;

		return { queue, doneToday, totalToday, progress, overdue, weekDays, totalHours, subjects, subjectTotal, trend, mastered, learning, masteryRate };
	}

	// 完成复习：推进遗忘阶梯 1→3→7→14→30，第5次后视为已掌握
	private async completeReview(path: string): Promise<void> {
		const today = this.fmtDate(new Date());
		let rec = this.reviewRecords.find((r) => r.path === path);
		if (!rec) {
			const f = this.app.vault.getMarkdownFiles().find((x) => x.path === path);
			if (!f) return;
			rec = { path, subject: this.getReviewSubject(f), stage: 1, lastReviewed: today, nextDue: this.addDays(today, 1), times: 1, skipped: false, status: "learning", wrongCount: 0, wrongDates: [] };
			this.reviewRecords.push(rec);
		} else {
			rec.lastReviewed = today;
			rec.times = (rec.times || 0) + 1;
			rec.skipped = false;
			rec.stage = (rec.stage || 0) + 1;
			rec.status = "learning";
			if (rec.stage >= 5) {
				rec.status = "mastered";
				rec.nextDue = "9999-12-31";
			} else {
				const intervals = [1, 3, 7, 14, 30];
				rec.nextDue = this.addDays(today, intervals[Math.min(Math.max(rec.stage - 1, 0), 4)]);
			}
		}
		// 会话记录（按天聚合）
		const sess = this.reviewSessions.find((s) => s.date === today);
		if (sess) sess.count++;
		else this.reviewSessions.push({ date: today, count: 1 });
		await this.persistReviewData();
	}

	// 跳过：不再自动推荐
	private async skipReview(path: string): Promise<void> {
		const today = this.fmtDate(new Date());
		let rec = this.reviewRecords.find((r) => r.path === path);
		if (!rec) {
			const f = this.app.vault.getMarkdownFiles().find((x) => x.path === path);
			if (!f) return;
			rec = { path, subject: this.getReviewSubject(f), stage: 0, lastReviewed: "", nextDue: "9999-12-31", times: 0, skipped: true, status: "new", wrongCount: 0, wrongDates: [] };
			this.reviewRecords.push(rec);
		} else {
			rec.skipped = true;
			rec.nextDue = "9999-12-31";
		}
		await this.persistReviewData();
	}

	// 标记不熟：记入错题本，明天再来复习
	private async markWrong(path: string): Promise<void> {
		const today = this.fmtDate(new Date());
		let rec = this.reviewRecords.find((r) => r.path === path);
		if (!rec) {
			const f = this.app.vault.getMarkdownFiles().find((x) => x.path === path);
			if (!f) return;
			rec = { path, subject: this.getReviewSubject(f), stage: 0, lastReviewed: today, nextDue: this.addDays(today, 1), times: 0, skipped: false, status: "learning", wrongCount: 1, wrongDates: [today] };
			this.reviewRecords.push(rec);
		} else {
			rec.wrongCount = (rec.wrongCount || 0) + 1;
			if (!rec.wrongDates) rec.wrongDates = [];
			rec.wrongDates.push(today);
			rec.lastReviewed = today;
			rec.nextDue = this.addDays(today, 1);
			rec.status = "learning";
		}
		const sess = this.reviewSessions.find((s) => s.date === today);
		if (sess) sess.count++;
		else this.reviewSessions.push({ date: today, count: 1 });
		await this.persistReviewData();
	}

	// 错题本：展示所有记过错的笔记
	private openMistakeBook() {
		const wrongList = this.reviewRecords
			.filter((r) => (r.wrongCount || 0) > 0)
			.sort((a, b) => (b.wrongCount || 0) - (a.wrongCount || 0));
		this.showModal(`📕 错题本`, `
			<div style="max-height:360px;overflow-y:auto;">
				${wrongList.length === 0
					? `<div style="padding:28px 16px;text-align:center;color:var(--text-muted);font-size:13px;">暂无错题 🎉 保持住</div>`
					: wrongList.map((r) => `<div class="polaris-mistake-item" data-path="${r.path}" style="padding:8px 12px;border-bottom:1px solid var(--divider-color);cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px;">
						<span style="font-size:12px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.path.split("/").pop()?.replace(".md", "") || r.path}</span>
						<span style="font-size:11px;color:var(--text-muted);flex-shrink:0;">记错 ${r.wrongCount} 次 · ${r.subject}</span>
					</div>`).join("")}
			</div>
			<div class="form-actions"><button type="button" class="btn-secondary polaris-modal-cancel">关闭</button></div>`);
		const modal = this.rootEl!.querySelector(".polaris-modal-box") as HTMLElement;
		(modal.querySelector(".polaris-modal-cancel") as HTMLElement).onclick = () => this.closeModal();
		modal.querySelectorAll(".polaris-mistake-item").forEach((el) => {
			(el as HTMLElement).onclick = () => { this.closeModal(); this.openNoteByPath((el as HTMLElement).dataset.path || ""); };
		});
	}

	// ===== 打卡工具 =====
	// 当前连续打卡天数（今天未打卡则从昨天起算）
	private getStreak(): number {
		const dates = Object.keys(this.checkinRecords)
			.filter((d) => this.checkinRecords[d] && Object.values(this.checkinRecords[d]).some(Boolean))
			.sort();
		if (dates.length === 0) return 0;
		const set = new Set(dates);
		const today = this.fmtDate(new Date());
		let cursor = new Date(today + "T00:00:00");
		if (!set.has(today)) cursor.setDate(cursor.getDate() - 1);
		let streak = 0;
		while (set.has(this.fmtDate(cursor))) {
			streak++;
			cursor.setDate(cursor.getDate() - 1);
		}
		return streak;
	}

	// 某天是否有打卡记录
	private isChecked(dateStr: string): boolean {
		const rec = this.checkinRecords[dateStr];
		if (!rec) return false;
		return Object.values(rec).some(Boolean);
	}

	// 当天完成的习惯数（多习惯打卡；与 isChecked 同口径，用于热力着色与 tooltip）
	private getDayDoneCount(dateStr: string): number {
		const rec = this.checkinRecords[dateStr];
		if (!rec) return 0;
		return Object.values(rec).filter(Boolean).length;
	}

	// ===== 收藏 =====
	// 取消收藏（支持新版 Bookmarks 与旧版 Starred 插件）
	private confirmRemoveStarred(path: string, name: string, main: HTMLElement) {
		this.showModal("取消收藏", `
			<div style="padding:8px 0 16px;font-size:13px;color:var(--text-secondary);">确定要从收藏中移除「${name}」吗？</div>
			<div class="form-actions"><button type="button" class="btn-secondary polaris-modal-cancel">取消</button><button type="button" class="polaris-modal-confirm btn-danger" style="background:var(--danger-red);color:#fff;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-size:13px;">移除</button></div>`);
		const modal = this.rootEl!.querySelector(".polaris-modal-box") as HTMLElement;
		(modal.querySelector(".polaris-modal-cancel") as HTMLElement).onclick = () => this.closeModal();
		(modal.querySelector(".polaris-modal-confirm") as HTMLElement).onclick = async () => {
			try {
				let removed = false;
				const bm = (this.app as any).internalPlugins?.getPluginById?.("bookmarks");
				if (bm && bm.enabled && bm.instance) {
					const items = bm.instance.items || [];
					const target = items.find((it: any) => it.type === "file" && it.path === path);
					if (target) {
						if (typeof bm.instance.removeItem === "function") { await bm.instance.removeItem(target); removed = true; }
						else if (typeof bm.instance.removeItemById === "function") { await bm.instance.removeItemById(target.id); removed = true; }
					}
				}
				if (!removed) {
					const starred = (this.app as any).internalPlugins?.getPluginById?.("starred");
					if (starred && starred.enabled && starred.instance) {
						const items = starred.instance.items || starred.instance.starred || [];
						const target = items.find((it: any) => it.type === "file" && it.path === path);
						if (target) {
							if (typeof starred.instance.unstar === "function") { await starred.instance.unstar(target); removed = true; }
							else if (typeof starred.instance.removeItem === "function") { await starred.instance.removeItem(target); removed = true; }
						}
					}
				}
				this.showToast(removed ? "已取消收藏" : "未找到对应收藏项");
			} catch (e) {
				this.showToast(`移除失败：${e}`);
			}
			this.closeModal();
			this.renderKnowledgeBoard(main);
		};
	}

	// 收藏调试信息（空状态点击）
	private debugStarredPlugins() {
		const bm = (this.app as any).internalPlugins?.getPluginById?.("bookmarks");
		const starred = (this.app as any).internalPlugins?.getPluginById?.("starred");
		const lines = [
			`Bookmarks 插件：${bm?.enabled ? "已启用" : "未启用/未检测到"}`,
			bm?.enabled ? `  收藏项：${(bm.instance?.items || []).length}` : "",
			`Starred 插件：${starred?.enabled ? "已启用" : "未启用/未检测到"}`,
			starred?.enabled ? `  收藏项：${(starred.instance?.items || starred.instance?.starred || []).length}` : "",
		].filter(Boolean);
		this.showModal("收藏调试信息", `<div style="padding:8px 0 16px;font-size:12px;line-height:1.9;color:var(--text-secondary);white-space:pre-wrap;">${lines.join("\n")}</div><div class="form-actions"><button type="button" class="btn-secondary polaris-modal-cancel">关闭</button></div>`);
		const modal = this.rootEl!.querySelector(".polaris-modal-box") as HTMLElement;
		(modal.querySelector(".polaris-modal-cancel") as HTMLElement).onclick = () => this.closeModal();
	}

	// 复习统计行（统一 stat-card 组件）
	private renderReviewStats(main: HTMLElement) {
		const stats = this.getReviewStats();
		const { doneToday, totalToday, progress, overdue, weekDays, totalHours, queue } = stats;
		const totalItems = this.reviewSessions.reduce((s, x) => s + x.count, 0);
		const el = main.querySelector(".dash-card-stat-row .dash-card-body") as HTMLElement;
		if (!el) return;
		el.className = "dash-card-body polaris-stats-overview";
		el.innerHTML =
			this.statCardHTML("🎤", "green", `${progress}%`, "今日完成率", `${doneToday}/${totalToday} 条`, false, false, "reviewToday") +
			this.statCardHTML("📅", "blue", `${weekDays}天`, "本周学习", "本周有复习记录", false, false, "reviewWeek") +
			this.statCardHTML("⏱️", "purple", `${totalHours}h`, "累计时长", `${totalItems} 条 · 每条估算5分钟`, false, false, "reviewTotal") +
			this.statCardHTML("⏰", "red", overdue, "逾期复习", `${queue.length} 条待复习`, overdue > 0, false, "reviewOverdue");
		el.querySelectorAll(".stat-card[data-stat-click]").forEach((card) => {
			(card as HTMLElement).onclick = () => this.openReviewStat((card as HTMLElement).dataset.statClick || "");
		});
	}

	// 复习统计卡点击：弹出对应明细
	private openReviewStat(kind: string) {
		const stats = this.getReviewStats();
		if (kind === "reviewOverdue") {
			const items = stats.queue
				.filter((x: any) => x.reason === "逾期")
				.map((x: any) => ({ name: x.file.name, path: x.file.path, sub: `逾期 ${x.overdueDays} 天` }));
			this.showNoteListModal(`⏰ 逾期复习（${items.length} 篇）`, items, "没有逾期复习 🎉");
		} else if (kind === "reviewToday") {
			const items = stats.queue.map((x: any) => ({ name: x.file.name, path: x.file.path, sub: x.reason }));
			this.showNoteListModal(`🎯 今日复习队列（待复习 ${items.length} · 已完成 ${stats.doneToday}）`, items, "今日复习队列为空 🎉");
		} else if (kind === "reviewWeek" || kind === "reviewTotal") {
			const today = this.fmtDate(new Date());
			let rows = this.reviewSessions.slice().sort((a: any, b: any) => b.date.localeCompare(a.date));
			let title = "📚 累计复习记录";
			if (kind === "reviewWeek") {
				const weekStart = new Date(today + "T00:00:00");
				weekStart.setDate(weekStart.getDate() - (weekStart.getDay() || 7) + 1);
				const ws = this.fmtDate(weekStart);
				rows = rows.filter((x: any) => x.date >= ws && x.date <= today);
				title = "📅 本周复习记录";
			}
			const totalCount = rows.reduce((sum: number, x: any) => sum + x.count, 0);
			const minutes = this.getReviewConfig().minutesPerItem;
			const totalMin = Math.round(totalCount * minutes);
			const lines = rows.length
				? rows.map((x: any) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 4px;border-bottom:1px solid var(--background-modifier-border);"><span style="font-size:13px;color:var(--text-primary);">${x.date}</span><span style="font-size:12px;color:var(--text-muted);">${x.count} 条</span></div>`).join("")
				: `<div style="padding:20px;text-align:center;font-size:12px;color:var(--text-muted);">暂无复习记录</div>`;
			this.showModal(title, `
				<div style="max-height:40vh;overflow:auto;padding:8px 16px;">${lines}</div>
				<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px 0;font-size:11px;color:var(--text-muted);">
					<span>共 ${totalCount} 条 · 约 ${Math.floor(totalMin / 60)}h${totalMin % 60}m</span>
					<button type="button" class="btn-secondary polaris-modal-cancel">关闭</button>
				</div>`);
			(this.rootEl!.querySelector(".polaris-modal-cancel") as HTMLElement)?.addEventListener("click", () => this.closeModal());
		}
	}

	// 队列原因 → 徽标（复习看板共用）
	private reviewReasonBadge(r: string, overdueDays: number): string {
		switch (r) {
			case "错题": return `<span class="badge badge-red"><span class="dot"></span>错题</span>`;
			case "逾期": return `<span class="badge badge-red"><span class="dot"></span>逾期${overdueDays > 1 ? ` ${overdueDays}天` : ""}</span>`;
			case "到期": return `<span class="badge badge-yellow"><span class="dot"></span>到期</span>`;
			case "首轮": return `<span class="badge badge-blue"><span class="dot"></span>首轮</span>`;
			case "任务关联": return `<span class="badge badge-green"><span class="dot"></span>任务关联</span>`;
			case "习惯加急": return `<span class="badge badge-purple"><span class="dot"></span>习惯加急</span>`;
			default: return "";
		}
	}

	// 复习进度总览（环形图 body，ECharts 渲染）
	private reviewProgressHTML(): string {
		const stats = this.getReviewStats();
		const { queue, doneToday, totalToday, progress, overdue } = stats;
		return `<div style="display:flex;flex:1;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:0 0 28px;min-height:0;">
			<div class="polaris-ring-wrap" style="position:relative;width:min(62%,230px);aspect-ratio:1;flex-shrink:0;">
				<div class="polaris-ring-echart" style="width:100%;height:100%;"></div>
				<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;">
					<span style="font-size:26px;font-weight:700;color:var(--text-brand);">${progress}%</span>
					<span style="font-size:11px;color:var(--text-muted);margin-top:2px;">${doneToday}/${totalToday} 已完成</span>
				</div>
			</div>
			<div style="display:flex;gap:24px;flex-wrap:wrap;justify-content:center;align-items:flex-start;">
				<div style="display:flex;align-items:center;gap:8px;">
					<span style="width:10px;height:10px;border-radius:50%;background:var(--brand-green);flex-shrink:0;"></span>
					<div><span style="font-size:22px;font-weight:700;color:var(--text-brand)">${doneToday}</span><div style="font-size:12px;color:var(--text-secondary)">今日已完成</div></div>
				</div>
				<div style="display:flex;align-items:center;gap:8px;">
					<span style="width:10px;height:10px;border-radius:50%;background:#fbbf24;flex-shrink:0;"></span>
					<div><span style="font-size:22px;font-weight:700;color:#fbbf24">${queue.length}</span><div style="font-size:12px;color:var(--text-secondary)">待复习</div></div>
				</div>
				${overdue > 0 ? `<div style="display:flex;align-items:center;gap:12px;">
					<span style="width:10px;height:10px;border-radius:50%;background:var(--danger-red);flex-shrink:0;"></span>
					<div><span style="font-size:22px;font-weight:700;color:var(--danger-red)">${overdue}</span><div style="font-size:12px;color:var(--text-secondary)">逾期</div></div>
				</div>` : ""}
			</div>
		</div>`;
	}

	// 初始化复习进度环（ECharts 环形分段图：粗环 22px + 断口 4px + 端头圆角 4px）
	private initReviewRing(main: HTMLElement) {
		const el = main.querySelector(".polaris-ring-echart") as HTMLElement | null;
		if (!el) return;
		const stats = this.getReviewStats();
		const { queue, doneToday, totalToday, progress, overdue } = stats;
		const pDone = Math.max(0, Math.min(100, progress));
		const pOver = totalToday > 0 ? Math.max(0, Math.min(overdue, totalToday)) / totalToday * 100 : 0;
		const pRest = Math.max(0, 100 - pDone - pOver);
		const cssVar = (name: string, fb: string) => {
			// 变量定义在根容器（含 [data-theme=light] 覆盖）上，不在 documentElement，
			// 必须从根容器读 computed style，否则回退默认色、浅色/暗色取值不生效。
			const v = this.rootEl ? getComputedStyle(this.rootEl).getPropertyValue(name).trim() : "";
			return v || fb;
		};
		const data: any[] = [];
		if (pDone > 0) data.push({ value: pDone, name: "已完成", itemStyle: { color: cssVar("--brand-green", "#c8e060") } });
		if (pRest > 0) data.push({ value: pRest, name: "待复习", itemStyle: { color: "#fbbf24" } });
		if (pOver > 0) data.push({ value: pOver, name: "逾期", itemStyle: { color: cssVar("--danger-red", "#e5534b") } });
		const existing = echarts.getInstanceByDom(el);
		if (existing) existing.dispose();
		const chart = echarts.init(el);
		chart.setOption({
			backgroundColor: "transparent",
			tooltip: {
				trigger: "item",
				confine: true,
				backgroundColor: "rgba(20,22,26,0.94)",
				borderColor: "rgba(255,255,255,0.12)",
				borderWidth: 1,
				padding: [8, 12],
				textStyle: { color: "#e8e8e8", fontSize: 12 },
				formatter: (p: any) => {
					const v = Number(p.value);
					const cnt = p.name === "已完成" ? `${doneToday} 篇` : p.name === "待复习" ? `${queue.length} 篇` : `${overdue} 篇`;
					return `<div style="font-weight:600;margin-bottom:2px;">${p.marker}${p.name}</div><div style="color:rgba(255,255,255,0.65);">${v.toFixed(0)}% · ${cnt}</div>`;
				}
			},
			series: [{
				type: "pie",
				radius: ["62.6%", "94%"], // 外径 94% 为 hover 放大（1.03）留余量，不再被画布边缘截断
				center: ["50%", "50%"],
				startAngle: 90,
				clockwise: true,
				padAngle: 2,           // 分段之间小间隔
				avoidLabelOverlap: false,
				label: { show: false },
				labelLine: { show: false },
				itemStyle: {
					borderRadius: 4,       // 端头圆角
					borderWidth: 0,        // 无描边
					borderColor: "transparent"
				},
				emphasis: {
					scale: 1.03,           // hover 温和放大（外径 94% × 1.03 ≈ 96.8%，不裁剪）
					itemStyle: { borderWidth: 0, borderColor: "transparent" }
				},
				data
			}]
		});
		const ro = new ResizeObserver(() => { try { chart.resize(); } catch (e) { /* noop */ } });
		ro.observe(el);
		(el as any).__talosRingRO = ro;
		// 环形弹性放大：按卡片可用空间设置环形容器尺寸（飞书式填充，吃掉下方空白）
		const wrap = el.parentElement as HTMLElement | null;
		const holder = wrap ? wrap.parentElement as HTMLElement | null : null;
		if (wrap && holder) {
			// 清理上一版（手写 SVG 方案）可能残留的自绘提示节点
			const staleTip = wrap.querySelector(".pr-tip");
			if (staleTip) staleTip.remove();
			const roHolder = new ResizeObserver(() => {
				try {
					// 预留：指标行约64px + gap 16 + 底部补偿28 + 余量8
					const maxW = Math.max(160, holder.clientWidth - 16);
					const maxH = Math.max(160, holder.clientHeight - 116);
					const size = Math.max(160, Math.min(maxW, maxH, 520));
					wrap.style.setProperty("width", size + "px")
					wrap.style.setProperty("height", size + "px")
					try { chart.resize(); } catch (e) { /* noop */ }
				} catch (e) { /* noop */ }
			});
			roHolder.observe(holder);
			(el as any).__talosRingHolderRO = roHolder;
		}
		chart.on("finished", () => {
			const cur = (el as any).__talosRingChart;
			if (cur && cur !== chart) cur.dispose();
			(el as any).__talosRingChart = chart;
		});
		(el as any).__talosRingChart = chart;
	}

	// 近7天复习趋势柱状图：JS 测量图表区高度，按比例设置柱子像素高度（百分比高度链在弹性布局中不可靠）
	private initReviewTrend(main: HTMLElement) {
		const area = main.querySelector(".polaris-trend-area") as HTMLElement | null;
		if (!area) return;
		const bars = Array.from(area.querySelectorAll<HTMLElement>(".polaris-trend-bar"));
		if (!bars.length) return;
		const apply = () => {
			const H = area.clientHeight;
			if (H <= 0) return;
			bars.forEach((bar) => {
				const pct = parseFloat(bar.dataset.h || "8");
				bar.style.setProperty("height", Math.max(6, Math.round((H * pct) / 100)) + "px")
			});
		};
		apply();
		const ro = new ResizeObserver(() => { try { apply(); } catch (e) { /* noop */ } });
		ro.observe(area);
		(area as any).__talosTrendRO = ro;
	}

	// 知识板块分布（层级+折叠 body）：领域（一级）可点击展开/收起二级板块；大领域默认展开
	private reviewSubjectsHTML(): string {
		const stats = this.getReviewStats();
		const { subjects, subjectTotal } = stats;
		const paraTop = ["01-Projects-项目", "02-Areas-领域", "03-Resources-资源"];
		const cleaned = (subjects || []).filter((s: any) => !paraTop.includes(s.name) && s.name !== "Misc-杂项" && s.name !== "未分类");
		if (!cleaned.length) return `<div style="padding:24px 16px;text-align:center;color:var(--text-muted);font-size:13px;">暂无板块数据</div>`;


		let html = `<div style="padding:16px 0;">`;
		cleaned.forEach((t: any) => {
			const pct = subjectTotal > 0 ? Math.round((t.total / subjectTotal) * 100) : 0;

			const hasKids = t.children.length > 1;
			const arrow = hasKids
				? `<svg class="polaris-subj-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;transition:transform 0.2s ease;transform:rotate(-90deg);"><polyline points="6 9 12 15 18 9"></polyline></svg>`
				: `<span style="display:inline-block;width:12px;flex-shrink:0;"></span>`;
			// 有二级 → 点击折叠；无二级 → 点击下钻笔记列表
			const toggleCls = hasKids ? "polaris-subj-toggle" : "polaris-subj-toggle polaris-subj-open";
			const togglePath = hasKids ? "" : ` data-path="${t.root}/${t.name}"`;
															html += `<div style="margin-bottom:12px;">
				<div class="${toggleCls}" data-subject="${t.name}"${togglePath} style="display:flex;align-items:center;gap:8px;padding:6px 8px;margin:0 -8px;border-radius:8px;cursor:pointer;user-select:none;transition:background 0.15s ease;">
					${arrow}
					<span style="font-size:13px;font-weight:600;color:var(--text-primary);flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.name}</span>
					${t.due > 0 ? `<span style="background:rgba(248,113,113,0.14);color:var(--danger-red);font-size:10px;line-height:1;padding:2px 4px;border-radius:5px;white-space:nowrap;flex-shrink:0;">${t.due}到期</span>` : ""}
					<span style="font-size:11px;color:var(--text-muted);white-space:nowrap;">${t.total}篇</span>
					<span style="font-size:13px;font-weight:700;color:var(--text-primary);white-space:nowrap;font-variant-numeric:tabular-nums;">${pct}%</span>
				</div>
				<div style="height:8px;background:var(--progress-track);border-radius:999px;overflow:hidden;margin:4px 0 0 20px;">
					<div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--brand-green),var(--brand-green-dark));border-radius:999px;transition:width 0.4s ease;"></div>
				</div>
			</div>`;
			if (hasKids) {
				html += `<div class="polaris-subj-children" data-subject="${t.name}" data-open="0" style="padding-left:28px;margin:4px 0 0;display:none;">`;
				t.children.forEach((k: any) => {
					const kpct = subjectTotal > 0 ? Math.round((k.total / subjectTotal) * 100) : 0;
					html += `<div class="polaris-subj-open" data-path="${t.root}/${t.name}/${k.name}" style="display:flex;align-items:center;gap:6px;padding:4px 8px;margin:0 -8px;font-size:12px;border-radius:6px;cursor:pointer;transition:background 0.15s ease;" title="查看该板块笔记">
						<span style="width:6px;height:6px;border-radius:2px;background:rgba(200,224,96,0.4);flex-shrink:0;"></span>
						<span style="color:var(--text-secondary);flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${k.name}</span>
						${k.due > 0 ? `<span style="background:rgba(248,113,113,0.14);color:var(--danger-red);font-size:10px;line-height:1;padding:2px 4px;border-radius:5px;white-space:nowrap;flex-shrink:0;">${k.due}到期</span>` : ""}
						<span style="color:var(--text-muted);white-space:nowrap;">${k.total}篇</span>
						<span style="font-weight:600;color:var(--text-secondary);white-space:nowrap;font-variant-numeric:tabular-nums;">${kpct}%</span>
					</div>
					<div style="height:6px;background:var(--progress-track);border-radius:999px;overflow:hidden;margin:3px 0 8px 12px;">
						<div style="height:100%;width:${kpct}%;background:linear-gradient(90deg,var(--brand-green),var(--brand-green-dark));border-radius:999px;transition:width 0.4s ease;"></div>
					</div>`;
				});
				html += `</div>`;
			}
		});
		html += `</div>`;
		return html;
	}

	// 知识板块分布：领域点击展开/折叠二级板块（通用，无领域名特判）；板块/领域点击下钻笔记列表
	private bindSubjectCollapse(main: HTMLElement) {
		main.querySelectorAll<HTMLElement>(".polaris-subj-toggle").forEach((el) => {
			el.onclick = () => {
				const key = el.dataset.subject || "";
				let group: HTMLElement | null = null;
				// 用 for..of 而非 forEach：闭包内赋值会被 TS 窄化成 never（保留"最后匹配生效"的原语义）
				for (const g of Array.from(main.querySelectorAll<HTMLElement>(".polaris-subj-children"))) {
					if (g.dataset.subject === key) group = g;
				}
				if (!group) return;
				const open = group.dataset.open === "1";
				group.dataset.open = open ? "0" : "1";
				group.style.setProperty("display", open ? "none" : "")
				const arrow = el.querySelector(".polaris-subj-arrow");
				if (arrow) (arrow as HTMLElement).style.setProperty("transform", open ? "rotate(-90deg)" : "rotate(0deg)")
			};
		});
		// 下钻：二级板块行 + 无二级的领域行 → 弹出该板块笔记列表
		main.querySelectorAll<HTMLElement>(".polaris-subj-open").forEach((el) => {
			el.onclick = () => {
				const path = el.dataset.path || "";
				if (path) this.openSubjectFilesModal(path);
			};
		});
	}

	// 板块下钻：列出该文件夹下全部笔记（按最近修改排序）+ 输入即过滤，点击打开
	private openSubjectFilesModal(folderPath: string) {
		const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
		const files = this.app.vault.getMarkdownFiles()
			.filter((f) => f.path.startsWith(folderPath + "/"))
			.sort((a, b) => (b.stat.mtime || 0) - (a.stat.mtime || 0));
		const title = folderPath.split("/").pop() || folderPath;
		const rows = files.length
			? files.map((f, i) => {
					const rel = f.path.slice(folderPath.length + 1);
					const dir = rel.split("/").slice(0, -1).join("/") || "根目录";
					return `<div class="polaris-subj-file" data-idx="${i}" title="${esc(f.path)}" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 8px;border-radius:6px;cursor:pointer;font-size:13px;">
						<span style="color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(f.basename)}</span>
						<span style="color:var(--text-muted);font-size:11px;flex-shrink:0;">${esc(dir)}</span>
					</div>`;
				}).join("")
			: `<div style="padding:24px 16px;text-align:center;color:var(--text-muted);font-size:13px;">该板块暂无笔记</div>`;
		this.showModal(title, `
			<div style="padding:12px 16px 16px;">
				<input class="polaris-subj-filter" type="text" placeholder="筛选笔记…（输入即过滤）" style="width:100%;box-sizing:border-box;">
				<div style="margin:8px 2px 4px;font-size:11px;color:var(--text-muted);">${files.length} 篇 · 按最近修改排序 · 点击打开</div>
				<div class="polaris-subj-file-list" style="max-height:60vh;overflow-y:auto;margin-top:4px;">
					${rows}
				</div>
			</div>`);
		const input = this.rootEl!.querySelector(".polaris-subj-filter") as HTMLInputElement;
		const list = this.rootEl!.querySelector(".polaris-subj-file-list") as HTMLElement;
		if (input && list) {
			input.oninput = () => {
				const q = input.value.trim().toLowerCase();
				list.querySelectorAll<HTMLElement>(".polaris-subj-file").forEach((row) => {
					row.style.setProperty("display", !q || (row.textContent || "").toLowerCase().includes(q) ? "" : "none");
				});
			};
			input.focus();
		}
		this.rootEl!.querySelectorAll<HTMLElement>(".polaris-subj-file").forEach((row) => {
			row.onclick = async () => {
				const idx = parseInt(row.dataset.idx || "-1", 10);
				const file = files[idx];
				if (!file) return;
				this.closeModal();
				await this.app.workspace.getLeaf().openFile(file);
			};
		});
	}

	// 今日复习任务（队列 body）
	private reviewQueueHTML(): string {
		const stats = this.getReviewStats();
		const { queue } = stats;
		if (queue.length === 0) {
			return `<div style="padding:28px 16px;text-align:center;color:var(--text-secondary);font-size:13px;">今天没有到期的复习 🎉 去工作看板推进任务吧</div>`;
		}
		return queue.map((p: any) => {
			const stageText = p.record && p.record.times > 0 ? ` · 已复习 ${p.record.times} 次` : " · 新笔记首轮";
			return `<div class="review-item" data-path="${p.file.path}">
				<button type="button" class="review-check" data-action="done" title="标记为已复习">✓</button>
				<div class="review-info"><div class="review-text">${p.file.basename}</div><div class="review-subject">${p.file ? this.getReviewTop(p.file) : (p.record?.subject || "")}${stageText}</div></div>
				${this.reviewReasonBadge(p.reason, p.overdueDays)}
				<button class="review-wrong" data-action="wrong" title="记不熟，明天再复习">🤔 不熟</button>
				<button class="review-skip" data-action="skip" title="跳过，不再自动推荐">跳过</button>
			</div>`;
		}).join("");
	}

	// 近7天复习趋势（柱状图 body）
	private reviewTrendHTML(): string {
		const stats = this.getReviewStats();
		const { trend, doneToday } = stats;
		const maxTrend = Math.max(...trend.map((t: any) => t.count), 1);
		return `<div style="display:flex;flex:1;flex-direction:column;min-height:0;">
			<div class="polaris-trend-area" style="flex:1;display:flex;align-items:flex-end;justify-content:space-between;padding:12px 8px 8px;gap:4px;min-height:110px;box-sizing:border-box;">
				${trend.map((v: any) => {
					const h = Math.max(8, Math.min(70, (v.count / maxTrend) * 100));
					return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0;height:100%;justify-content:flex-end;">
						<span style="font-size:10px;color:${v.count > 0 ? "var(--text-brand)" : "var(--text-muted)"};font-weight:${v.count > 0 ? "600" : "400"};">${v.count > 0 ? v.count : ""}</span>
						<div class="polaris-trend-bar" data-h="${h.toFixed(1)}" style="width:100%;max-width:24px;background:${v.isToday ? "var(--brand-green)" : v.count > 0 ? "rgba(200,224,96,0.4)" : this.themeIsLight() ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"};border-radius:3px 3px 0 0;transition:height 0.3s ease;flex-shrink:0;"></div>
						<span style="font-size:10px;color:${v.isToday ? "var(--text-brand)" : "var(--text-muted)"};">${v.label}</span>
					</div>`;
				}).join("")}
			</div>
			<div style="text-align:center;font-size:11px;color:var(--text-muted);padding:8px 0 4px;border-top:1px solid var(--divider-color);">近7天共复习 ${trend.reduce((a: any, b: any) => a + b.count, 0)} 条 · 今日 ${doneToday} 条</div>
		</div>`;
	}

	// 知识点掌握（数字 + 错题本按钮 body）
	private reviewMasteryHTML(): string {
		const stats = this.getReviewStats();
		const { mastered, learning, masteryRate } = stats;
		const wrongTotal = this.reviewRecords.filter((r) => (r.wrongCount || 0) > 0).length;
		return `<div style="display:flex;gap:16px;padding:16px 0;">
			<div style="flex:1;text-align:center;">
				<div style="font-size:32px;font-weight:700;color:var(--text-brand);">${mastered}</div>
				<div style="font-size:12px;color:var(--text-muted);margin-top:4px;">已掌握</div>
			</div>
			<div style="width:1px;background:var(--divider-color);"></div>
			<div style="flex:1;text-align:center;">
				<div style="font-size:32px;font-weight:700;color:var(--brand-purple);">${learning}</div>
				<div style="font-size:12px;color:var(--text-muted);margin-top:4px;">复习中</div>
			</div>
			<div style="width:1px;background:var(--divider-color);"></div>
			<div style="flex:1;text-align:center;">
				<div style="font-size:32px;font-weight:700;color:#fbbf24;">${masteryRate}%</div>
				<div style="font-size:12px;color:var(--text-muted);margin-top:4px;">掌握率</div>
			</div>
		</div>
		<div style="font-size:11px;color:var(--text-muted);text-align:center;margin-top:-4px;margin-bottom:12px;">走完 1→3→7→14→30 天五轮阶梯即视为已掌握</div>
		<button class="btn-secondary polaris-mistake-book" style="width:100%;padding:8px;font-size:13px;">📕 查看错题本${wrongTotal > 0 ? ` · <span style="color:var(--danger-red);font-weight:700;">${wrongTotal}</span>` : ""}</button>`;
	}

	// 快速记录（右侧今日面板 body）
	private renderQuickNoteHTML(): string {
		return `<div class="detail-section-title" style="display:flex;align-items:center;margin-bottom:8px;"><span class="rp-strip"></span><span class="rp-title">⚡ 快速记录</span></div>
			<div style="padding:8px 0 4px;text-align:center;">
				<div style="margin-bottom:8px;">💡</div>
				<div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px;">有灵感？快速记下来</div>
				<div style="font-size:11px;color:var(--text-muted);margin-bottom:16px;">点击下方按钮，自动创建笔记到收集箱</div>
				<button class="btn-primary polaris-quick-note" style="padding:6px 16px;font-size:12px;width:100%;">📝 新建快速笔记</button>
			</div>`;
	}

	// 快速记录：直接创建笔记到 Inbox 收集箱
	private async createQuickNote(): Promise<void> {
		try {
			const now = new Date();
			const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
			const fileName = `快速记录-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${timeStr.replace(":", "")}.md`;
			const folderPath = "00-Inbox-收集箱";
			const fullPath = `${folderPath}/${fileName}`;
			const content = `# 快速记录\n\n> 创建时间：${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${timeStr}\n\n<!-- 在这里记录你的灵感 -->\n\n`;
			try { await this.app.vault.createFolder(folderPath); } catch (e) {}
			const file = await this.app.vault.create(fullPath, content);
			await this.app.workspace.getLeaf().openFile(file);
			this.showToast(`已创建快速笔记：${fileName}`);
		} catch (e) {
			this.showToast(`创建失败：${e}`);
		}
	}

	private renderWorkStats(main: HTMLElement) {
		const el = main.querySelector(".dash-card-stat-row .dash-card-body") as HTMLElement;
		if (!el) return;
		el.className = "dash-card-body polaris-stats-overview";
		const doingCount = this.workTasks.filter((t) => t.status === "doing").length;
		const todoCount = this.workTasks.filter((t) => t.status === "todo").length;
		const doneCount = this.workTasks.filter((t) => t.status === "done").length;
		const overdueCount = this.workTasks.filter((t) => this.isTaskOverdue(t)).length;
		const total = this.workTasks.length;
		const activeCount = doingCount + todoCount;
		const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
		const stats = [
			{ key: "todo", icon: "⏳", num: todoCount, label: "待办任务", color: "blue", note: total > 0 ? `占全部任务 ${pct(todoCount)}%` : "" },
			{ key: "doing", icon: "🚀", num: doingCount, label: "进行中任务", color: "green", note: total > 0 ? `占全部任务 ${pct(doingCount)}%` : "" },
			{ key: "done", icon: "✅", num: doneCount, label: "已完成任务", color: "purple", note: total > 0 ? `完成率 ${pct(doneCount)}%` : "" },
			{ key: "overdue", icon: "⚠️", num: overdueCount, label: "逾期任务", color: "red", note: overdueCount > 0 ? "需尽快处理" : "无逾期", warn: true },
		];
		el.innerHTML = stats.map((s) => `
			<div class="stat-card ${s.key === "overdue" && s.num > 0 ? "danger" : ""}" data-stat="${s.key}" title="查看${s.label}">
				<div class="stat-icon ${s.color}">${s.icon}</div>
				<div class="stat-info">
					<div class="stat-num">${s.num}</div>
					<div class="stat-label">${s.label}</div>
					${s.note ? `<div class="stat-note ${s.warn ? "stat-note-warn" : ""}">${s.note}</div>` : ""}
				</div>
			</div>
		`).join("");
		// 点击统计卡：跳转到任务看板并切换对应筛选
		el.querySelectorAll(".stat-card").forEach((card) => {
			(card as HTMLElement).onclick = () => this.jumpToKanbanFilter((card as HTMLElement).dataset.stat || "all");
		});
	}

	/** 从数据概览跳转到任务看板指定筛选（最小滚动：仅在卡片不在视口时滚动） */
	private jumpToKanbanFilter(filter: string) {
		this.kanbanFilter = filter;
		this.renderBoard();
		const card = this.rootEl?.querySelector('.dash-card[data-card-id="kanban"]') as HTMLElement | null;
		if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest" });
	}

	/** 从真实任务中挑选最紧急的一条作为今日焦点：逾期 > 优先级 > 截止日期近 > 进行中优先 */
	private getFocusTask(): WorkTask | null {
		const active = this.workTasks.filter((t) => t.status !== "done");
		if (active.length === 0) return null;
		const priorityWeight: Record<string, number> = { P0: 0, P1: 1, P2: 2 };
		const parseMMDD = (s?: string): number => {
			if (!s) return 9999;
			const parts = s.split("/").map(Number);
			return (parts[0] || 99) * 100 + (parts[1] || 99);
		};
		return [...active].sort((a, b) => {
			if (!!this.isTaskOverdue(a) !== !!this.isTaskOverdue(b)) return this.isTaskOverdue(a) ? -1 : 1;
			const pw = (priorityWeight[a.priority] ?? 2) - (priorityWeight[b.priority] ?? 2);
			if (pw !== 0) return pw;
			const ad = parseMMDD(a.dueDate), bd = parseMMDD(b.dueDate);
			if (ad !== bd) return ad - bd;
			return (a.status === "doing" ? 0 : 1) - (b.status === "doing" ? 0 : 1);
		})[0];
	}

	private renderFocusCard(main: HTMLElement) {
		const el = main.querySelector(".polaris-work-focus") as HTMLElement;
		const task = this.getFocusTask();
		if (!task) {
			el.innerHTML = `
				<div class="glass-card focus-card">
					<div class="focus-title" style="font-size:16px;color:var(--text-secondary);">暂无待办任务</div>
					<div class="focus-meta" style="margin-bottom:0;color:var(--text-muted);">所有任务都已完成，今天可以专注其他事情</div>
				</div>`;
			return;
		}
		const tag = task.priority === "P0" ? '<span class="badge badge-purple"><span class="dot"></span>P0</span>' : task.priority === "P1" ? '<span class="badge badge-yellow"><span class="dot"></span>P1</span>' : '<span class="badge badge-gray"><span class="dot"></span>P2</span>';
		const statusText = task.status === "doing" ? "进行中" : "待开始";
		el.innerHTML = `
			<div class="glass-card focus-card">
				<div class="focus-meta"><div class="focus-tags">${this.isTaskOverdue(task) ? '<span class="badge badge-red"><span class="dot"></span>已逾期</span>' : ""}${tag}</div><span>负责人：${task.assignee || "未分配"}</span> · <span>截止日期：${task.dueDate || "—"}</span></div>
				<div class="focus-title">${task.title}</div>
				<div class="focus-progress-row"><div class="progress-track" style="height:10px"><div class="progress-fill" style="width:${task.progress}%"></div></div><span class="progress-text">${task.progress}%</span></div>
				<div class="focus-actions"><button class="btn-primary polaris-focus-edit">继续编辑</button><button class="polaris-focus-detail">查看详情</button></div>
			</div>`;
		(el.querySelector(".polaris-focus-edit") as HTMLElement).onclick = (e) => {
			e.stopPropagation();
			if (task.notePath) { this.openNoteByPath(task.notePath); }
			else { this.showToast("该任务未关联笔记"); }
		};
		const statusMap: Record<string, string> = { todo: "待开始", doing: "进行中", done: "已完成" };
		const detailData = { id: task.id, title: task.title, priority: task.priority, status: statusMap[task.status], progress: task.progress, dueDate: task.dueDate, assignee: task.assignee || "未分配", notePath: task.notePath };
		(el.querySelector(".polaris-focus-detail") as HTMLElement).onclick = (e) => { e.stopPropagation(); this.showTaskDetail(detailData); };
		(el.querySelector(".focus-card") as HTMLElement).onclick = () => this.showTaskDetail(detailData);
	}

	// ===== 打卡相关辅助方法 =====
	private getTodayStr(): string {
		const d = new Date();
		return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
	}

	private getWeekDates(offset: number = 0): { date: Date; dateStr: string; dayLabel: string; dayNum: string }[] {
		const today = new Date();
		const dayOfWeek = today.getDay(); // 0=周日, 1=周一...
		const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
		const monday = new Date(today);
		monday.setDate(today.getDate() + mondayOffset + offset * 7);
		const labels = ["一", "二", "三", "四", "五", "六", "日"];
		const result = [];
		for (let i = 0; i < 7; i++) {
			const d = new Date(monday);
			d.setDate(monday.getDate() + i);
			const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
			result.push({ date: d, dateStr, dayLabel: labels[i], dayNum: String(d.getDate()) });
		}
		return result;
	}

	// ==================== 多习惯打卡系统 ====================
	private getActiveHabits(): Habit[] {
		return this.habits.filter((h) => !h.archived);
	}
	private isHabitChecked(habitId: string, dateStr: string): boolean {
		return !!(this.checkinRecords[dateStr] && this.checkinRecords[dateStr][habitId]);
	}
	private getHabitStreak(habitId: string): number {
		let streak = 0;
		const today = new Date();
		const todayStr = this.getTodayStr();
		if (this.isHabitChecked(habitId, todayStr)) streak = 1;
		for (let i = 1; i < 365; i++) {
			const d = new Date(today);
			d.setDate(today.getDate() - i);
			const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
			if (this.isHabitChecked(habitId, dateStr)) streak++;
			else break;
		}
		return streak;
	}
	private getTodayCheckinProgress(): { done: number; total: number } {
		const activeHabits = this.getActiveHabits();
		const todayStr = this.getTodayStr();
		const done = activeHabits.filter((h) => this.isHabitChecked(h.id, todayStr)).length;
		return { done, total: activeHabits.length };
	}
	private async toggleHabitCheckin(habitId: string, dateStr: string): Promise<void> {
		if (!this.checkinRecords[dateStr]) this.checkinRecords[dateStr] = {};
		if (this.isHabitChecked(habitId, dateStr)) {
			delete this.checkinRecords[dateStr][habitId];
			if (Object.keys(this.checkinRecords[dateStr]).length === 0) delete this.checkinRecords[dateStr];
		} else {
			this.checkinRecords[dateStr][habitId] = true;
		}
		await this.saveCheckinData();
	}
	private async saveCheckinData(): Promise<void> {
		if (this.plugin?.pluginData) {
			this.plugin.pluginData.checkinRecords = JSON.parse(JSON.stringify(this.checkinRecords));
			this.plugin.pluginData.habits = JSON.parse(JSON.stringify(this.habits));
			await this.plugin.savePluginData();
		}
	}
	private async addHabit(name: string, icon: string, color: string): Promise<void> {
		this.habits.push({ id: "habit-" + Date.now(), name, icon, color, createdAt: this.getTodayStr(), archived: false });
		await this.saveCheckinData();
	}
	private async editHabit(id: string, name: string, icon: string, color: string): Promise<void> {
		const habit = this.habits.find((h) => h.id === id);
		if (habit) { habit.name = name; habit.icon = icon; habit.color = color; await this.saveCheckinData(); }
	}
	private async archiveHabit(id: string): Promise<void> {
		const habit = this.habits.find((h) => h.id === id);
		if (habit) { habit.archived = true; await this.saveCheckinData(); }
	}
	private async unarchiveHabit(id: string): Promise<void> {
		const habit = this.habits.find((h) => h.id === id);
		if (habit) { habit.archived = false; await this.saveCheckinData(); }
	}
	private async deleteHabit(id: string): Promise<void> {
		this.habits = this.habits.filter((h) => h.id !== id);
		for (const dateStr in this.checkinRecords) {
			if (this.checkinRecords[dateStr][id]) {
				delete this.checkinRecords[dateStr][id];
				if (Object.keys(this.checkinRecords[dateStr]).length === 0) delete this.checkinRecords[dateStr];
			}
		}
		await this.saveCheckinData();
	}

	// 渲染打卡卡片（多习惯列表）
	private renderCheckin(main: HTMLElement) {
		const el = main.querySelector(".polaris-work-checkin") as HTMLElement;
		const todayStr = this.getTodayStr();
		const activeHabits = this.getActiveHabits();
		const progress = this.getTodayCheckinProgress();
		const weekDates = this.getWeekDates();
		const todayIndex = weekDates.findIndex((d) => d.dateStr === todayStr);

		el.innerHTML = `
			<div class="module-title" style="display:flex;justify-content:space-between;align-items:center;">
				<span>📅 每日打卡</span>
				<div style="display:flex;gap:8px;">
					<button class="polaris-checkin-add" style="cursor:pointer;background:transparent;border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:3px 8px;font-size:11px;color:var(--text-secondary);">➕ 添加</button>
					<button class="polaris-checkin-manage" style="cursor:pointer;background:transparent;border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:3px 8px;font-size:11px;color:var(--text-secondary);">⚙️ 管理</button>
				</div>
			</div>
			<div class="checkin-top" style="margin-bottom:12px;">
				<div style="font-size:24px;font-weight:700;color:var(--text-brand);">${progress.done}<span style="font-size:14px;color:var(--text-muted);">/${progress.total}</span></div>
				<div><div class="checkin-status-text">今日完成 ${progress.done}/${progress.total}</div><div class="checkin-streak">共 ${activeHabits.length} 个习惯</div></div>
			</div>
			<div class="habit-list" style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">
				${activeHabits.length === 0 ? '<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:12px;">暂无习惯，点击"添加"创建第一个习惯</div>' :
				activeHabits.map((habit) => {
					const checked = this.isHabitChecked(habit.id, todayStr);
					const streak = this.getHabitStreak(habit.id);
					return `<div class="habit-item" data-habit-id="${habit.id}" style="display:flex;align-items:center;gap:8px;padding:8px 8px;border-radius:8px;background:${checked ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)'};cursor:pointer;transition:background 0.15s;">
						<div class="habit-check-circle" data-habit-id="${habit.id}" style="width:22px;height:22px;border-radius:50%;border:2px solid ${checked ? habit.color : 'var(--text-muted)'};background:${checked ? habit.color : 'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
							${checked ? '<span style="color:white;font-size:12px;font-weight:bold;">✓</span>' : ''}
						</div>
						<span style="font-size:16px;">${habit.icon}</span>
						<span style="flex:1;font-size:13px;color:${checked ? 'var(--text-muted)' : 'var(--text-primary)'};text-decoration:${checked ? 'line-through' : 'none'};">${habit.name}</span>
						<span style="font-size:11px;color:var(--text-muted);">🔥${streak}天</span>
					</div>`;
				}).join("")}
			</div>
			<div class="week-calendar">${weekDates.map((d,i)=>{
				const dayDone = activeHabits.filter((h) => this.isHabitChecked(h.id, d.dateStr)).length;
				const dayTotal = activeHabits.length;
				const allDone = dayTotal > 0 && dayDone === dayTotal;
				const someDone = dayDone > 0 && dayDone < dayTotal;
				return `<div class="week-day ${allDone?"checked":""} ${i===todayIndex?"today":""}" style="${someDone ? 'background:rgba(34,197,94,0.2);' : ''}">
					<span>${d.dayLabel}</span>
					<div class="day-cell">${allDone ? "✓" : `${dayDone}/${dayTotal}`}</div>
				</div>`;
			}).join("")}</div>`;

		el.querySelectorAll(".habit-item").forEach((item) => {
			(item as HTMLElement).onclick = async () => {
				const habitId = (item as HTMLElement).dataset.habitId || "";
				await this.toggleHabitCheckin(habitId, todayStr);
				this.renderCheckin(main);
				this.renderWorkStats(main);
			};
		});

		(el.querySelector(".polaris-checkin-add") as HTMLElement).onclick = () => {
			this.showAddHabitModal();
		};

		(el.querySelector(".polaris-checkin-manage") as HTMLElement).onclick = () => {
			this.showHabitManager();
		};
	}

	private renderCheckinCompact(container: HTMLElement) {
		// 面板重建时清理就地展开日历的全局关闭监听器，避免监听泄漏
		if (this.calExpandCloseHandler) {
			document.removeEventListener("mousedown", this.calExpandCloseHandler);
			this.calExpandCloseHandler = null;
		}
		const todayStr = this.getTodayStr();
		const activeHabits = this.getActiveHabits();
		const progress = this.getTodayCheckinProgress();
		const weekDates = this.getWeekDates(this.checkinWeekOffset);
		const todayIndex = weekDates.findIndex((d) => d.dateStr === todayStr);
		const isCurrentWeek = this.checkinWeekOffset === 0;
		const weekRange = `${weekDates[0].date.getMonth()+1}/${weekDates[0].date.getDate()}-${weekDates[6].date.getMonth()+1}/${weekDates[6].date.getDate()}`;
		const selectedDate = this.selectedCheckinDate || "";

		// 今日农历信息
		const now = new Date();
		const lunar = this.solarToLunar(now.getFullYear(), now.getMonth() + 1, now.getDate());
		// 每日一句需传日期字符串（YYYY-MM-DD）才能按日轮换；
		// 此前误传 Date 对象导致 dateStr.length 为 undefined、hash 恒为 0，文案永远停在第一条
		const quote = this.getDailyQuote(todayStr);

		// 计算选中日期的打卡详情
		let selectedDateInfo = null;
		if (selectedDate) {
			const selectedDateObj = new Date(selectedDate + "T00:00:00");
			const dayLabels = ["周日","周一","周二","周三","周四","周五","周六"];
			const selectedDone = activeHabits.filter((h) => this.isHabitChecked(h.id, selectedDate)).length;
			const isToday = selectedDate === todayStr;
			selectedDateInfo = {
				dateStr: selectedDate,
				display: `${selectedDateObj.getMonth()+1}月${selectedDateObj.getDate()}日 ${dayLabels[selectedDateObj.getDay()]}`,
				done: selectedDone,
				total: activeHabits.length,
				isToday
			};
		}

		// 每日一句（自定义优先）转义
		const today = new Date();
		const dayLabels = ["周日","周一","周二","周三","周四","周五","周六"];
		const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
		const safeQuote = { t: esc(quote.t), a: quote.a ? esc(quote.a) : "" };

		// 日期/农历 + 每日一句 合并为整体卡片（纯信息卡：报时 + 激励，不承担日历入口）
		const nextMilestone = this.getNextMilestone();
		const lunarAstro = Lunar.fromDate(new Date());
		const dayYi = lunarAstro.getDayYi();
		const dayJi = lunarAstro.getDayJi();
		const jieQi = lunarAstro.getJieQi();
		const yiText = dayYi.slice(0, 3).join(" ");
		const jiText = dayJi.slice(0, 3).join(" ");
		const lunarExtra = [lunar.festival, jieQi && jieQi !== lunar.festival ? jieQi : ""].filter(Boolean).join(" · ");
		// 日历卡片内容配置（设置中可开关）
		const dc = { ganzhi: false, yiJi: true, dailySign: false, ...(this.plugin?.pluginData?.dateCard || {}) };
		const ganzhiPrefix = dc.ganzhi ? `${lunar.ganzhiYear}${lunar.zodiac}年 ` : "";
		// 每日一签：已抽（当日锁定）显示签文，未抽显示抽签入口
		const signNo = this.dailySignRecord[todayStr];
		const drawnSign = signNo ? this.dailySigns[signNo - 1] : null;
		const dateQuoteHtml = `
			<div class="polaris-date-quote-card" style="padding:12px 12px;border-radius:var(--radius-md);background:rgba(var(--card-bg-rgb),var(--card-opacity));backdrop-filter:blur(var(--card-blur));-webkit-backdrop-filter:blur(var(--card-blur));border:1px solid var(--border-color);box-shadow:var(--shadow-card);">
				<div style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:20px;font-weight:800;color:var(--date-text);letter-spacing:0.5px;line-height:1.2;">${today.getMonth()+1}月${today.getDate()}日<span style="display:inline-block;font-size:11px;font-weight:600;color:var(--tag-green-text);background:var(--tag-green-bg);border-radius:6px;padding:2px 8px;letter-spacing:0;line-height:1.4;">${dayLabels[today.getDay()]}</span></div>
				<div style="font-size:11px;color:var(--text-muted);margin-top:4px;text-align:center;letter-spacing:0.5px;">${ganzhiPrefix}${lunar.lunarMonthName}${lunar.lunarDayName}${lunarExtra ? ` · ${lunarExtra}` : ""}</div>
				${dc.yiJi ? `<div style="display:flex;justify-content:center;align-items:center;gap:8px;margin-top:4px;">
					<span class="badge-green" style="font-size:11px;padding:2px 8px;border-radius:6px;line-height:1.4;">宜 ${yiText}</span>
					<span class="badge-red" style="font-size:11px;padding:2px 8px;border-radius:6px;line-height:1.4;">忌 ${jiText}</span>
				</div>` : ""}
				${dc.dailySign ? (drawnSign ? `<div class="polaris-sign-row" style="margin-top:4px;text-align:center;font-size:11px;color:var(--text-secondary);line-height:1.6;">
					<span style="color:var(--text-muted);">🎋 第${signNo}签</span>
					<span style="font-weight:700;color:var(--date-text);margin-left:6px;">${drawnSign.luck} · ${drawnSign.title}</span>
					<div style="margin-top:1px;">${drawnSign.poem}</div>
					<button type="button" class="polaris-sign-toggle" style="margin-top:3px;cursor:pointer;background:var(--control-bg);border:1px solid var(--border-color);border-radius:6px;padding:2px 8px;font-size:11px;color:var(--text-secondary);">解签</button>
					<div class="polaris-sign-detail" style="display:none;margin-top:4px;color:var(--text-muted);background:rgba(var(--card-bg-rgb),0.5);border-radius:6px;padding:6px 8px;">${drawnSign.jie}</div>
				</div>` : `<div class="polaris-sign-entry" title="点击抽取今日一签" style="margin-top:4px;text-align:center;font-size:11px;color:var(--text-secondary);line-height:1.6;cursor:pointer;padding:4px 0;user-select:none;">🎋 <span style="font-weight:600;">抽今日一签</span></div>`) : ""}
				${nextMilestone ? `<div style="font-size:11px;color:var(--brand-purple);font-weight:600;margin-top:4px;text-align:center;"><span style="margin-right:6px;">🔔</span>${nextMilestone.text}</div>` : ""}
				<div style="height:1px;background:var(--border-color);margin:8px 0 8px;"></div>
				<div class="polaris-quote-click" title="点击管理每日一句" style="font-size:12px;color:var(--text-secondary);font-style:italic;line-height:1.7;text-align:center;cursor:pointer;transition:color 0.15s;">"${safeQuote.t}"</div>
				${safeQuote.a ? `<div style="font-size:11px;color:var(--text-muted);text-align:center;margin-top:4px;">— ${safeQuote.a}</div>` : ""}
			</div>`;

		const checkinHtml = `
			<div class="detail-section polaris-compact-checkin" style="padding:12px;border-radius:var(--radius-md);background:rgba(var(--card-bg-rgb),var(--card-opacity));border:1px solid var(--border-color);box-shadow:var(--shadow-card);">
				<div class="detail-section-title" style="display:flex;align-items:center;margin-bottom:8px;">
					<span class="rp-strip"></span><span class="rp-title">✅ 今日打卡</span>
					<div style="display:flex;align-items:center;gap:6px;margin-left:auto;">
						<button class="compact-calendar-open icon-btn" title="查看完整月历" style="width:26px;height:26px;padding:0;font-size:13px;">📅</button>
						<button class="compact-checkin-add icon-btn" title="添加新习惯" style="width:26px;height:26px;padding:0;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
					</div>
				</div>
				<div class="compact-habit-list" style="display:flex;flex-direction:column;gap:4px;">
					${activeHabits.length === 0 ? '<div style="text-align:center;padding:8px;color:var(--text-muted);font-size:11px;">暂无习惯，点击➕添加</div>' :
					activeHabits.map((habit) => {
						const checked = this.isHabitChecked(habit.id, todayStr);
						const streak = this.getHabitStreak(habit.id);
						return `<div class="compact-habit-item ${checked?'checked':''}" data-habit-id="${habit.id}" title="${checked ? "点击取消打卡" : "点击打卡"}" style="display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:6px;">
							<div class="compact-habit-check" data-habit-id="${habit.id}" style="border-color:${checked ? habit.color : 'var(--check-border)'};background:${checked ? habit.color : 'transparent'};">${checked ? '✓' : ''}</div>
							<span style="font-size:13px;flex-shrink:0;">${habit.icon}</span>
							<span class="compact-habit-name">${habit.name}</span>
							<span class="compact-habit-streak">🔥${streak}</span>
						</div>`;
					}).join("")}
				</div>
				${activeHabits.length === 0 ? '' : `
				<div class="compact-week-calendar">
					${weekDates.map((d,i)=>{
						const isSel = d.dateStr === selectedDate;
						return `<div class="week-day ${i===todayIndex?"today":""} ${isSel?"selected":""}" data-date="${d.dateStr}">
							<span>${d.dayLabel}</span>
							<div class="day-cell">${d.dayNum}</div>
						</div>`;
					}).join("")}
				</div>
				${selectedDate && selectedDate !== todayStr && selectedDateInfo ? `<div style="font-size:10px;color:var(--text-secondary);text-align:center;margin-top:6px;">${selectedDateInfo.display} · 完成 ${selectedDateInfo.done}/${selectedDateInfo.total}（点击取消选中）</div>` : ''}`
				}
			</div>`;

		// 插入「日期+每日一句」合并卡片 + 打卡模块到容器顶部
		container.insertAdjacentHTML("afterbegin", dateQuoteHtml + checkinHtml);

		const checkinSection = container.querySelector(".polaris-compact-checkin") as HTMLElement;

		// 点击语录文本直接进入管理（低频操作收敛，默认不暴露）
		const quoteClick = container.querySelector(".polaris-quote-click") as HTMLElement;
		if (quoteClick) {
			quoteClick.onclick = (e) => {
				e.stopPropagation();
				this.openQuoteManager();
			};
		}

		// 每日一签：解签按钮展开/收起解释
		container.querySelectorAll(".polaris-sign-toggle").forEach((btn) => {
			(btn as HTMLElement).onclick = (e) => {
				e.stopPropagation();
				const detail = (btn as HTMLElement).closest(".polaris-sign-row")?.querySelector(".polaris-sign-detail") as HTMLElement;
				if (detail) {
					const hidden = detail.style.display === "none";
					detail.style.setProperty("display", hidden ? "block" : "none")
					(btn as HTMLElement).textContent = hidden ? "收起" : "解签";
				}
			};
		});

		// 每日一签：点击抽签入口 → 打开抽签弹窗（摇签揭晓 + 解签）→ 关闭后卡片显示结果
		const signEntry = container.querySelector(".polaris-sign-entry") as HTMLElement;
		if (signEntry) {
			signEntry.onclick = async (e) => {
				e.stopPropagation();
				if (this.signDrawing) return;
				this.signDrawing = true;
				const drawn = this.getDailySign(todayStr);
				// 打开独立抽签页：摇签动画 → 揭晓签文 → 解签按钮
				this.openSignModal(drawn);
				// 揭晓后锁定当日（持久化，重开不丢）
				this.dailySignRecord[todayStr] = drawn.no;
				if (this.plugin) {
					this.plugin.pluginData.dailySignRecord = JSON.parse(JSON.stringify(this.dailySignRecord));
					await this.plugin.savePluginData();
				}
				this.signDrawing = false;
				this.refreshRightPanel();
			};
		}

		// 完整月历入口：收敛到打卡标题行的 📅 按钮（全插件唯一入口）；点击后在下方周历位置就地展开，再点收起
		const calOpen = checkinSection.querySelector(".compact-calendar-open") as HTMLElement;
		if (calOpen) {
			calOpen.onclick = (e) => {
				e.stopPropagation();
				this.toggleCalendarExpand(checkinSection, calOpen);
			};
		}

		// 习惯打卡点击
		checkinSection.querySelectorAll(".compact-habit-item").forEach((item) => {
			(item as HTMLElement).onclick = async (e) => {
				e.stopPropagation();
				const habitId = (item as HTMLElement).dataset.habitId || "";
				await this.toggleHabitCheckin(habitId, todayStr);
				this.refreshRightPanel();
				this.renderWorkStats(this.rootEl!.querySelector(".polaris-work-main") as HTMLElement);
			};
		});

		// 紧凑周日历：点击选中/取消日期，查看当天打卡详情
		checkinSection.querySelectorAll(".compact-week-calendar .week-day").forEach((el) => {
			(el as HTMLElement).onclick = (e) => {
				e.stopPropagation();
				const ds = (el as HTMLElement).dataset.date || "";
				this.selectedCheckinDate = (this.selectedCheckinDate === ds) ? "" : ds;
				this.refreshRightPanel();
			};
		});

		// 添加习惯按钮
		(checkinSection.querySelector(".compact-checkin-add") as HTMLElement).onclick = (e) => {
			e.stopPropagation();
			this.showAddHabitModal();
		};
	}

	// 完整月历：就地展开到下方周历位置（非弹窗）。点击 📅 展开/收起，点击展开区域外也收起。
	// 打卡列表保留在月历上方；周历小视图在展开时隐藏、收起时恢复。
	private toggleCalendarExpand(checkinSection: HTMLElement, anchor: HTMLElement) {
		const weekCal = checkinSection.querySelector(".compact-week-calendar") as HTMLElement;
		if (!weekCal) return;

		// 收起：移除展开块，恢复周历小视图；若期间选中日期变化，刷新面板同步小视图高亮
		const existing = checkinSection.querySelector(".polaris-calendar-expand") as HTMLElement;
		if (existing) {
			existing.remove();
			weekCal.style.setProperty("display", "")
			if (this.calExpandCloseHandler) {
				document.removeEventListener("mousedown", this.calExpandCloseHandler);
				this.calExpandCloseHandler = null;
			}
			return;
		}

		const initSel = this.selectedCheckinDate;

		const now = new Date();
		let viewYear = now.getFullYear();
		let viewMonth = now.getMonth();
		// 优先沿用当前选中的打卡日期，否则默认今天
		const selDate = this.selectedCheckinDate || `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
		let selected = new Date(selDate + "T00:00:00");
		if (isNaN(selected.getTime())) selected = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
		const todayStr = fmt(now);

		// 计算有打卡的日期
		const checkedDates = new Set<string>();
		this.habits.forEach((h) => {
			Object.keys(this.checkinRecords || {}).forEach((date) => {
				if (this.checkinRecords[date]?.[h.id]) checkedDates.add(date);
			});
		});
		const activeHabits = this.habits.filter((h) => !h.archived);
		const dayLabels = ["周日","周一","周二","周三","周四","周五","周六"];
		const monthNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
		const dayNames = ["日","一","二","三","四","五","六"];

		const block = document.createElement("div");
		block.className = "polaris-calendar-expand";
		block.setAttribute("style", "margin-top:8px;border-top:1px solid var(--border-color);padding-top:8px;");

		const render = () => {
			const firstDay = new Date(viewYear, viewMonth, 1);
			const lastDay = new Date(viewYear, viewMonth + 1, 0);
			const startWeekday = firstDay.getDay();
			const daysInMonth = lastDay.getDate();
			const selStr = fmt(selected);

			// 月历网格
			let grid = "";
			for (let i = 0; i < startWeekday; i++) grid += `<div></div>`;
			for (let day = 1; day <= daysInMonth; day++) {
				const dateStr = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
				const isToday = dateStr === todayStr;
				const isSel = dateStr === selStr;
				const hasCheckin = checkedDates.has(dateStr);
				const isFuture = new Date(dateStr + "T00:00:00") > now;
				grid += `<div class="cal-day" data-date="${dateStr}" style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:8px;font-size:12px;cursor:${isFuture ? 'default' : 'pointer'};transition:all 0.15s;${isToday ? 'outline:2px solid var(--brand-green);' : ''}${isSel ? 'background:var(--brand-green);color:#1a1a1f;font-weight:700;' : ''}${!isSel && hasCheckin ? 'background:rgba(200,224,96,0.18);color:var(--text-brand);font-weight:600;' : ''}${!isSel && !hasCheckin ? 'color:var(--text-secondary);' : ''}${isFuture ? 'opacity:0.3;' : ''}">${day}</div>`;
			}

			// 选中日打卡明细
			let detailHtml = "";
			if (activeHabits.length === 0) {
				detailHtml = `<div style="text-align:center;padding:12px;color:var(--text-muted);font-size:12px;">暂无习惯</div>`;
			} else {
				detailHtml = activeHabits.map((habit) => {
					const checked = this.isHabitChecked(habit.id, selStr);
					return `<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;background:${checked ? (this.themeIsLight() ? 'rgba(34,197,94,0.10)' : 'rgba(34,197,94,0.08)') : (this.themeIsLight() ? 'rgba(0,0,0,0.045)' : 'rgba(255,255,255,0.03)')};">
						<div style="width:18px;height:18px;border-radius:50%;border:2px solid ${checked ? habit.color : 'var(--text-muted)'};background:${checked ? habit.color : 'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">${checked ? '<span style="color:white;font-size:10px;font-weight:bold;line-height:1;">✓</span>' : ''}</div>
						<span style="font-size:14px;flex-shrink:0;">${habit.icon}</span>
						<span style="flex:1;font-size:13px;color:${checked ? 'var(--text-muted)' : 'var(--text-primary)'};text-decoration:${checked ? 'line-through' : 'none'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${habit.name}</span>
						<span style="font-size:11px;color:${checked ? 'var(--text-brand)' : 'var(--text-muted)'};flex-shrink:0;">${checked ? '已完成' : '未完成'}</span>
					</div>`;
				}).join("");
			}

			block.innerHTML = `
				<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
					<button class="cal-prev" style="cursor:pointer;background:var(--control-bg);border:none;border-radius:6px;padding:4px 8px;font-size:14px;color:var(--text-secondary);">‹</button>
					<span style="font-size:14px;font-weight:600;color:var(--text-primary);">${viewYear}年${monthNames[viewMonth]}</span>
					<button class="cal-next" style="cursor:pointer;background:var(--control-bg);border:none;border-radius:6px;padding:4px 8px;font-size:14px;color:var(--text-secondary);">›</button>
				</div>
				<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:6px;">
					${dayNames.map((d) => `<div style="text-align:center;font-size:11px;color:var(--text-muted);padding:3px 0;">${d}</div>`).join("")}
				</div>
				<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:8px;">${grid}</div>
				<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 2px 6px;border-top:1px solid var(--background-modifier-border);">
					<button class="cal-day-prev" style="cursor:pointer;background:transparent;border:none;color:var(--text-secondary);font-size:13px;padding:2px 8px;border-radius:6px;">‹ 前一天</button>
					<span style="font-size:13px;font-weight:600;color:var(--text-primary);">${selected.getMonth()+1}月${selected.getDate()}日 ${dayLabels[selected.getDay()]}</span>
					<button class="cal-day-next" style="cursor:pointer;background:transparent;border:none;color:var(--text-secondary);font-size:13px;padding:2px 8px;border-radius:6px;">后一天 ›</button>
				</div>
				<div style="display:flex;flex-direction:column;gap:4px;">${detailHtml}</div>`;

			// 绑定：翻月
			const prevBtn = block.querySelector(".cal-prev") as HTMLElement;
			const nextBtn = block.querySelector(".cal-next") as HTMLElement;
			if (prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render(); };
			if (nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render(); };
			// 绑定：日期选中（未来日不可选）
			block.querySelectorAll(".cal-day").forEach((cell) => {
				(cell as HTMLElement).onclick = (e) => {
					e.stopPropagation();
					const dateStr = (cell as HTMLElement).dataset.date || "";
					const cellDate = new Date(dateStr + "T00:00:00");
					if (cellDate > now) return;
					selected = cellDate;
					this.selectedCheckinDate = fmt(selected);
					viewYear = selected.getFullYear();
					viewMonth = selected.getMonth();
					render();
				};
			});
			// 绑定：前一天 / 后一天（跨月自动跟随，后一天不可超过今天）
			const dayPrev = block.querySelector(".cal-day-prev") as HTMLElement;
			const dayNext = block.querySelector(".cal-day-next") as HTMLElement;
			if (dayPrev) dayPrev.onclick = (e) => { e.stopPropagation(); selected = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate() - 1); this.selectedCheckinDate = fmt(selected); viewYear = selected.getFullYear(); viewMonth = selected.getMonth(); render(); };
			if (dayNext) dayNext.onclick = (e) => { e.stopPropagation(); const nd = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate() + 1); if (nd > now) return; selected = nd; this.selectedCheckinDate = fmt(selected); viewYear = selected.getFullYear(); viewMonth = selected.getMonth(); render(); };
		};

		render();

		// 就地展开：隐藏周历小视图，完整月历插到其后面（打卡列表保持在月历上方）
		weekCal.style.setProperty("display", "none")
		weekCal.insertAdjacentElement("afterend", block);

		// 点击展开区域外收起；若期间选中日期变化，刷新面板同步小视图
		const closeHandler = (e: MouseEvent) => {
			if (!checkinSection.contains(e.target as Node)) {
				block.remove();
				weekCal.style.setProperty("display", "")
				document.removeEventListener("mousedown", closeHandler);
				if (this.calExpandCloseHandler === closeHandler) this.calExpandCloseHandler = null;
				if (this.selectedCheckinDate !== initSel) this.refreshRightPanel();
			}
		};
		this.calExpandCloseHandler = closeHandler;
		setTimeout(() => document.addEventListener("mousedown", closeHandler), 100);
	}

	// 任务日期选择浮层：仿飞书多维表格日期字段，点击弹出月历点选，回写 MM/DD
	private openDatePicker(anchor: HTMLElement, current: string | undefined, onSelect: (mmdd: string) => void) {
		this.closeDatePicker();
		const now = new Date();
		const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
		// 解析当前值（MM/DD → 按当年构造，非法则回退今天）
		let sel: Date;
		if (current && /^\d{2}\/\d{2}$/.test(current)) {
			const [mm, dd] = current.split("/").map(Number);
			const d = new Date(now.getFullYear(), mm - 1, dd);
			sel = isNaN(d.getTime()) ? new Date(now.getFullYear(), now.getMonth(), now.getDate()) : d;
		} else {
			sel = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		}
		let viewYear = sel.getFullYear();
		let viewMonth = sel.getMonth();
		const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
		const toMMDD = (d: Date) => `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}`;
		const dayNames = ["日","一","二","三","四","五","六"];
		const monthNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

		const pop = document.createElement("div");
		pop.className = "polaris-date-pop";
		pop.setAttribute("data-theme", this.theme);
		// 内联注入主题变量：浮层挂在 body 下，CSS 变量继承链不可靠，
		// 用内联 style.setProperty 保证浮层及内部元素（‹ › / 今天 / 清除 / 日期格）始终吃到当前主题 token
		{
			const isLight = this.theme === "light";
			pop.style.setProperty("--card-bg-rgb", isLight ? "255, 255, 255" : "28, 28, 34");
			pop.style.setProperty("--border-color", isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.08)");
			pop.style.setProperty("--text-primary", isLight ? "#1a1a1f" : "#f0f0f3");
			pop.style.setProperty("--text-secondary", isLight ? "#52525b" : "#a1a1aa");
			pop.style.setProperty("--text-muted", isLight ? "#71717a" : "#71717a");
			pop.style.setProperty("--control-bg", isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.08)");
			pop.style.setProperty("--text-brand", isLight ? "#1a1a1f" : "#c8e060");
		}
		const rect = anchor.getBoundingClientRect();
		const POP_W = 236, EST_H = 292;
		let left = Math.min(Math.max(8, rect.right - POP_W), window.innerWidth - POP_W - 8);
		let top = rect.bottom + 4;
		if (top + EST_H > window.innerHeight - 8) top = Math.max(8, rect.top - EST_H - 4);
		pop.style.setProperty("left", left + "px")
		pop.style.setProperty("top", top + "px")

		const render = () => {
			const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
			const startWeekday = new Date(viewYear, viewMonth, 1).getDay();
			const selStr = fmt(sel);
			let grid = "";
			for (let i = 0; i < startWeekday; i++) grid += `<div></div>`;
			for (let day = 1; day <= daysInMonth; day++) {
				const dateStr = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
				const cls = dateStr === selStr ? " sel" : dateStr === todayStr ? " today" : "";
				grid += `<div class="polaris-date-cell${cls}" data-date="${dateStr}">${day}</div>`;
			}
			pop.innerHTML = `
				<div class="polaris-date-pop-head">
					<button type="button" class="polaris-date-nav" data-nav="-1">‹</button>
					<span class="polaris-date-pop-title">${viewYear}年${monthNames[viewMonth]}</span>
					<button type="button" class="polaris-date-nav" data-nav="1">›</button>
				</div>
				<div class="polaris-date-pop-week">${dayNames.map((d) => `<span>${d}</span>`).join("")}</div>
				<div class="polaris-date-pop-grid">${grid}</div>
				<div class="polaris-date-pop-foot">
					<button type="button" class="polaris-date-today">今天</button>
					<button type="button" class="polaris-date-clear">清除</button>
				</div>`;
			pop.querySelectorAll(".polaris-date-nav").forEach((el) => {
				(el as HTMLElement).onclick = (e) => {
					e.stopPropagation();
					viewMonth += Number((el as HTMLElement).dataset.nav);
					if (viewMonth < 0) { viewMonth = 11; viewYear--; }
					if (viewMonth > 11) { viewMonth = 0; viewYear++; }
					render();
				};
			});
			pop.querySelectorAll(".polaris-date-cell").forEach((el) => {
				(el as HTMLElement).onclick = (e) => {
					e.stopPropagation();
					const ds = (el as HTMLElement).dataset.date || "";
					sel = new Date(ds + "T00:00:00");
					this.closeDatePicker();
					onSelect(toMMDD(sel));
				};
			});
			const todayBtn = pop.querySelector(".polaris-date-today") as HTMLElement;
			const clearBtn = pop.querySelector(".polaris-date-clear") as HTMLElement;
			if (todayBtn) todayBtn.onclick = (e) => {
				e.stopPropagation();
				this.closeDatePicker();
				onSelect(toMMDD(new Date(now.getFullYear(), now.getMonth(), now.getDate())));
			};
			if (clearBtn) clearBtn.onclick = (e) => {
				e.stopPropagation();
				this.closeDatePicker();
				onSelect("");
			};
		};
		render();
		document.body.appendChild(pop);
		this.datePickerEl = pop;
		const closeHandler = (e: MouseEvent) => {
			const t = e.target as Node;
			if (!pop.contains(t) && t !== anchor && !anchor.contains(t)) this.closeDatePicker();
		};
		this.datePickerCloseHandler = closeHandler;
		setTimeout(() => document.addEventListener("mousedown", closeHandler), 50);
	}

	/** 表单弹窗中的日期字段：按钮式 + 自研日历浮层（与详情区一致） */
	private bindFormDateFields(modal: HTMLElement) {
		modal.querySelectorAll<HTMLButtonElement>(".form-date-field").forEach((btn) => {
			btn.onclick = (e) => {
				e.stopPropagation();
				const id = btn.dataset.target || "";
				const hidden = modal.querySelector("#" + id) as HTMLInputElement | null;
				if (!hidden) return;
				this.openDatePicker(btn, hidden.value || undefined, (mmdd) => {
					hidden.value = mmdd;
					const val = btn.querySelector(".form-date-value") as HTMLElement;
					if (val) { val.textContent = mmdd || "选择日期"; val.classList.toggle("empty", !mmdd); }
				});
			};
		});
	}

	private closeDatePicker() {
		if (this.datePickerEl) { this.datePickerEl.remove(); this.datePickerEl = null; }
		if (this.datePickerCloseHandler) {
			document.removeEventListener("mousedown", this.datePickerCloseHandler);
			this.datePickerCloseHandler = null;
		}
	}

	// 刷新右侧面板（保持当前状态）
	private refreshRightPanel() {
		if (this.currentDetailTaskId) {
			const task = this.workTasks.find((t) => t.id === this.currentDetailTaskId);
			if (task) {
				const statusMap: Record<string,string> = { todo:"待开始", doing:"进行中", done:"已完成" };
				this.showTaskDetail({
					id: task.id, title: task.title, priority: task.priority,
					status: statusMap[task.status], progress: task.progress,
					dueDate: task.dueDate, assignee: task.assignee || "Alvin", notePath: task.notePath
				});
			}
		} else {
			this.resetDetail();
		}
	}

	private showAddHabitModal() {
		const icons = ["💧","🏃","🌙","📖","🧘","✍️","🎯","🥗","😴","🚭","💊","🧹","💰","📱","🎨","🎵","🌱","☕","🚶"];
		const colors = ["#3b82f6","#22c55e","#a855f7","#f59e0b","#ec4899","#ef4444","#14b8a6","#f97316"];
		this.showModal(`➕ 新建习惯`, `
			<form id="polaris-add-habit-form">
				<div class="form-field">
					<label class="form-label">习惯名称 <span class="required">*</span></label>
					<input class="form-input" name="name" type="text" placeholder="如：喝水、跑步、早睡..." required>
				</div>
				<div class="form-field">
					<label class="form-label">选择图标</label>
					<div class="habit-icon-picker" style="display:flex;flex-wrap:wrap;gap:6px;">
						${icons.map((icon, i) => `<button type="button" class="habit-icon-option ${i===0?'selected':''}" data-icon="${icon}" style="width:36px;height:36px;border-radius:8px;border:1px solid ${i===0?'var(--brand-green)':'var(--background-modifier-border)'};background:${i===0?'rgba(200,224,96,0.12)':'transparent'};font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;">${icon}</button>`).join("")}
					</div>
				</div>
				<div class="form-field">
					<label class="form-label">选择颜色</label>
					<div class="habit-color-picker" style="display:flex;gap:8px;">
						${colors.map((color, i) => `<button type="button" class="habit-color-option ${i===0?'selected':''}" data-color="${color}" style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid ${i===0?'white':'transparent'};cursor:pointer;box-shadow:0 0 0 1px var(--background-modifier-border);"></button>`).join("")}
					</div>
				</div>
				<div class="form-actions">
					<button type="button" class="btn-secondary polaris-modal-cancel">取消</button>
					<button type="submit" class="btn-primary">创建</button>
				</div>
			</form>`);
		const modal = this.rootEl!.querySelector(".polaris-modal-box") as HTMLElement;
		let selectedIcon = icons[0];
		let selectedColor = colors[0];
		modal.querySelectorAll(".habit-icon-option").forEach((btn) => {
			(btn as HTMLElement).onclick = () => {
				selectedIcon = (btn as HTMLElement).dataset.icon || icons[0];
				modal.querySelectorAll(".habit-icon-option").forEach((b) => {
					(b as HTMLElement).style.setProperty("border-color", "var(--background-modifier-border)")
					(b as HTMLElement).style.setProperty("background", "transparent")
				});
				(btn as HTMLElement).style.setProperty("border-color", "var(--brand-green)")
				(btn as HTMLElement).style.setProperty("background", "rgba(34,197,94,0.1)")
			};
		});
		modal.querySelectorAll(".habit-color-option").forEach((btn) => {
			(btn as HTMLElement).onclick = () => {
				selectedColor = (btn as HTMLElement).dataset.color || colors[0];
				modal.querySelectorAll(".habit-color-option").forEach((b) => {
					(b as HTMLElement).style.setProperty("border", "3px solid transparent")
				});
				(btn as HTMLElement).style.setProperty("border", "3px solid white")
			};
		});
		(modal.querySelector("#polaris-add-habit-form") as HTMLFormElement).onsubmit = async (e) => {
			e.preventDefault();
			const form = e.target as HTMLFormElement;
			const name = (form.querySelector('[name="name"]') as HTMLInputElement).value.trim();
			if (!name) { this.showToast("习惯名称不能为空"); return; }
			await this.addHabit(name, selectedIcon, selectedColor);
			this.closeModal();
			this.renderBoard();
			this.showToast(`习惯「${name}」创建成功`);
		};
	}

	private showHabitManager() {
		const detail = this.rootEl!.querySelector(".polaris-detail-content") as HTMLElement;
		detail.className = "polaris-detail-content detail-body";
		detail.innerHTML = `
			<div class="detail-section">
				<div class="detail-section-title" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
					<span>⚙️ 习惯管理</span>
					<button class="polaris-history-back" style="cursor:pointer;background:var(--control-bg);border:none;border-radius:6px;padding:3px 8px;font-size:11px;color:var(--text-secondary);">← 返回</button>
				</div>
				${this.buildHabitManagerHTML()}
			</div>`;

		(detail.querySelector(".polaris-history-back") as HTMLElement).onclick = () => this.resetDetail();
		this.bindHabitManagerEvents(detail, () => this.showHabitManager());
	}

	// 习惯管理主体 HTML（进行中 + 已归档 + 添加按钮），右侧栏版与设置弹窗版共用
	private buildHabitManagerHTML(): string {
		const activeHabits = this.getActiveHabits();
		const archivedHabits = this.habits.filter((h) => h.archived);
		return `
			<div style="margin-bottom:16px;">
				<div style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">📋 进行中（${activeHabits.length}个）</div>
				${activeHabits.length === 0 ? '<div style="text-align:center;padding:12px;color:var(--text-muted);font-size:12px;">暂无进行中的习惯</div>' :
				activeHabits.map((habit) => {
					const streak = this.getHabitStreak(habit.id);
					return `<div class="habit-manage-item" data-habit-id="${habit.id}" style="padding:8px;border-radius:8px;background:rgba(255,255,255,0.03);margin-bottom:8px;">
						<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
							<span style="font-size:18px;flex-shrink:0;">${habit.icon}</span>
							<span style="flex:1;font-size:13px;font-weight:600;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${habit.name}</span>
							<span style="font-size:10px;color:var(--text-muted);flex-shrink:0;">🔥${streak}天</span>
						</div>
						<div style="font-size:10px;color:var(--text-muted);margin-bottom:8px;padding-left:24px;">创建于 ${habit.createdAt}</div>
						<div style="display:flex;gap:6px;padding-left:24px;">
							<button class="habit-edit-btn" data-habit-id="${habit.id}" title="编辑习惯的名称、图标、颜色" style="flex:1;padding:4px 4px;border-radius:4px;border:1px solid var(--background-modifier-border);background:transparent;color:var(--text-secondary);font-size:11px;cursor:pointer;white-space:nowrap;">✏️ 编辑</button>
							<button class="habit-archive-btn" data-habit-id="${habit.id}" title="归档：不在今日列表显示，历史记录永久保留，可随时恢复" style="flex:1;padding:4px 4px;border-radius:4px;border:1px solid var(--background-modifier-border);background:transparent;color:var(--text-secondary);font-size:11px;cursor:pointer;white-space:nowrap;">📦 归档</button>
							<button class="habit-delete-btn" data-habit-id="${habit.id}" title="彻底删除：该习惯的所有打卡记录将永久删除，无法恢复" style="flex:1;padding:4px 4px;border-radius:4px;border:1px solid #f87171;background:transparent;color:#f87171;font-size:11px;cursor:pointer;white-space:nowrap;">🗑️ 删除</button>
						</div>
					</div>`;
				}).join("")}
			</div>
			${archivedHabits.length > 0 ? `
			<div style="margin-bottom:16px;">
				<div style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">📦 已归档（${archivedHabits.length}个）</div>
				${archivedHabits.map((habit) => {
					return `<div class="habit-manage-item" data-habit-id="${habit.id}" style="padding:8px;border-radius:8px;background:rgba(255,255,255,0.02);margin-bottom:8px;opacity:0.7;">
						<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
							<span style="font-size:18px;flex-shrink:0;">${habit.icon}</span>
							<span style="flex:1;font-size:13px;font-weight:600;color:var(--text-muted);text-decoration:line-through;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${habit.name}</span>
						</div>
						<div style="font-size:10px;color:var(--text-muted);margin-bottom:8px;padding-left:24px;">创建于 ${habit.createdAt}</div>
						<div style="display:flex;gap:6px;padding-left:24px;">
							<button class="habit-unarchive-btn" data-habit-id="${habit.id}" title="恢复：重新在今日打卡列表中显示" style="flex:1;padding:4px 4px;border-radius:4px;border:1px solid var(--background-modifier-border);background:transparent;color:var(--text-secondary);font-size:11px;cursor:pointer;white-space:nowrap;">↩️ 恢复</button>
							<button class="habit-delete-btn" data-habit-id="${habit.id}" title="彻底删除：该习惯的所有打卡记录将永久删除，无法恢复" style="flex:1;padding:4px 4px;border-radius:4px;border:1px solid #f87171;background:transparent;color:#f87171;font-size:11px;cursor:pointer;white-space:nowrap;">🗑️ 删除</button>
						</div>
					</div>`;
				}).join("")}
			</div>` : ""}
			<button class="polaris-add-habit-btn" style="width:100%;padding:8px;border-radius:8px;border:2px dashed var(--background-modifier-border);background:transparent;color:var(--text-secondary);font-size:13px;cursor:pointer;">➕ 添加新习惯</button>`;
	}

	// 习惯管理事件绑定（detail 版与设置弹窗版共用，refresh 决定操作后如何刷新当前界面）
	private bindHabitManagerEvents(root: HTMLElement, refresh: () => void) {
		(root.querySelector(".polaris-add-habit-btn") as HTMLElement).onclick = () => this.showAddHabitModal();

		root.querySelectorAll(".habit-archive-btn").forEach((btn) => {
			(btn as HTMLElement).onclick = async () => {
				const habitId = (btn as HTMLElement).dataset.habitId || "";
				const habit = this.habits.find((h) => h.id === habitId);
				if (habit) {
					await this.archiveHabit(habitId);
					refresh();
					this.renderBoard();
					this.showToast(`已归档「${habit.name}」，历史记录已保留`);
				}
			};
		});

		root.querySelectorAll(".habit-unarchive-btn").forEach((btn) => {
			(btn as HTMLElement).onclick = async () => {
				const habitId = (btn as HTMLElement).dataset.habitId || "";
				const habit = this.habits.find((h) => h.id === habitId);
				if (habit) {
					await this.unarchiveHabit(habitId);
					refresh();
					this.renderBoard();
					this.showToast(`已恢复「${habit.name}」`);
				}
			};
		});

		root.querySelectorAll(".habit-delete-btn").forEach((btn) => {
			(btn as HTMLElement).onclick = async () => {
				const habitId = (btn as HTMLElement).dataset.habitId || "";
				const habit = this.habits.find((h) => h.id === habitId);
				if (!habit) return;
				if (!confirm(`确定彻底删除「${habit.name}」吗？\n\n该习惯的所有打卡记录将永久删除，无法恢复。\n\n提示：如果只是暂时不想打卡，建议使用「归档」，历史记录会保留。`)) return;
				await this.deleteHabit(habitId);
				refresh();
				this.renderBoard();
				this.showToast(`已删除「${habit.name}」`);
			};
		});

		root.querySelectorAll(".habit-edit-btn").forEach((btn) => {
			(btn as HTMLElement).onclick = () => {
				const habitId = (btn as HTMLElement).dataset.habitId || "";
				const habit = this.habits.find((h) => h.id === habitId);
				if (habit) this.showEditHabitModal(habit, refresh);
			};
		});
	}

	// 习惯管理（设置弹窗版：独立弹窗，不占用右侧详情栏）
	private openHabitManager() {
		this.showModal("🏃 打卡习惯管理", `<div style="max-height:62vh;overflow-y:auto;padding:4px 20px 20px;">${this.buildHabitManagerHTML()}</div>`);
		const modal = document.querySelector(".modal-box.polaris-modal-box") as HTMLElement;
		if (!modal) return;
		this.bindHabitManagerEvents(modal, () => this.openHabitManager());
	}

	private showEditHabitModal(habit: Habit, onSaved?: () => void) {
		const icons = ["💧","🏃","🌙","📖","🧘","✍️","🎯","🥗","😴","🚭","💊","🧹","💰","📱","🎨","🎵","🌱","☕","🚶"];
		const colors = ["#3b82f6","#22c55e","#a855f7","#f59e0b","#ec4899","#ef4444","#14b8a6","#f97316"];
		this.showModal(`✏️ 编辑习惯`, `
			<form id="polaris-edit-habit-form">
				<div class="form-field">
					<label class="form-label">习惯名称 <span class="required">*</span></label>
					<input class="form-input" name="name" type="text" value="${habit.name}" required>
				</div>
				<div class="form-field">
					<label class="form-label">选择图标</label>
					<div class="habit-icon-picker" style="display:flex;flex-wrap:wrap;gap:6px;">
						${icons.map((icon) => `<button type="button" class="habit-icon-option ${icon===habit.icon?'selected':''}" data-icon="${icon}" style="width:36px;height:36px;border-radius:8px;border:1px solid ${icon===habit.icon?'var(--brand-green)':'var(--background-modifier-border)'};background:${icon===habit.icon?'rgba(200,224,96,0.12)':'transparent'};font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;">${icon}</button>`).join("")}
					</div>
				</div>
				<div class="form-field">
					<label class="form-label">选择颜色</label>
					<div class="habit-color-picker" style="display:flex;gap:8px;">
						${colors.map((color) => `<button type="button" class="habit-color-option ${color===habit.color?'selected':''}" data-color="${color}" style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid ${color===habit.color?'white':'transparent'};cursor:pointer;box-shadow:0 0 0 1px var(--background-modifier-border);"></button>`).join("")}
					</div>
				</div>
				<div class="form-actions">
					<button type="button" class="btn-secondary polaris-modal-cancel">取消</button>
					<button type="submit" class="btn-primary">保存</button>
				</div>
			</form>`);
		const modal = this.rootEl!.querySelector(".polaris-modal-box") as HTMLElement;
		let selectedIcon = habit.icon;
		let selectedColor = habit.color;
		modal.querySelectorAll(".habit-icon-option").forEach((btn) => {
			(btn as HTMLElement).onclick = () => {
				selectedIcon = (btn as HTMLElement).dataset.icon || habit.icon;
				modal.querySelectorAll(".habit-icon-option").forEach((b) => {
					(b as HTMLElement).style.setProperty("border-color", "var(--background-modifier-border)")
					(b as HTMLElement).style.setProperty("background", "transparent")
				});
				(btn as HTMLElement).style.setProperty("border-color", "var(--brand-green)")
				(btn as HTMLElement).style.setProperty("background", "rgba(34,197,94,0.1)")
			};
		});
		modal.querySelectorAll(".habit-color-option").forEach((btn) => {
			(btn as HTMLElement).onclick = () => {
				selectedColor = (btn as HTMLElement).dataset.color || habit.color;
				modal.querySelectorAll(".habit-color-option").forEach((b) => {
					(b as HTMLElement).style.setProperty("border", "3px solid transparent")
				});
				(btn as HTMLElement).style.setProperty("border", "3px solid white")
			};
		});
		(modal.querySelector("#polaris-edit-habit-form") as HTMLFormElement).onsubmit = async (e) => {
			e.preventDefault();
			const form = e.target as HTMLFormElement;
			const name = (form.querySelector('[name="name"]') as HTMLInputElement).value.trim();
			if (!name) { this.showToast("习惯名称不能为空"); return; }
			await this.editHabit(habit.id, name, selectedIcon, selectedColor);
			this.closeModal();
			if (onSaved) onSaved(); else this.showHabitManager();
			this.renderBoard();
			this.showToast(`习惯「${name}」已更新`);
		};
	}
	private parseDate(dateStr: string): Date {
		// 解析 "MM/DD" 格式，默认当前年份；非法输入（如"待定"）兜底为今天，避免渲染崩溃
		const parts = dateStr.split("/").map(Number);
		const month = parts[0];
		const day = parts[1];
		const now = new Date();
		if (!month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
			return new Date(now.getFullYear(), now.getMonth(), now.getDate());
		}
		return new Date(now.getFullYear(), month - 1, day);
	}

	// 动态计算任务是否逾期（根据 dueDate）
	private isTaskOverdue(task: WorkTask): boolean {
		if (task.status === "done") return false;
		if (!task.dueDate || task.dueDate === "待定") return false;
		const due = this.parseDate(task.dueDate);
		if (!due) return false;
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return due < today;
	}

	private getTaskStatusColor(task: WorkTask): string {
		if (task.status === "done") return this.themeIsLight() ? "#c8e060" : "#a8c040";
		if (this.isTaskOverdue(task)) return "#f87171";
		if (task.status === "doing") return "#60a5fa";
		return "#9ca3af"; // todo
	}

	private getTaskStatusLabel(task: WorkTask): string {
		if (task.status === "done") return "已完成";
		if (this.isTaskOverdue(task)) return "已逾期";
		if (task.status === "doing") return "进行中";
		return "待开始";
	}

	private renderGantt(main: HTMLElement) {
		const el = main.querySelector(".polaris-work-gantt") as HTMLElement;
		const mode = this.ganttMode;
		const now = new Date();
		const currentYear = now.getFullYear();

		// 计算视图范围（周/月/季/年）
		let rangeStart: Date, rangeEnd: Date;
		if (mode === "week") {
			// 周视图：本周一到周日
			const dayOfWeek = now.getDay();
			const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
			rangeStart = new Date(currentYear, now.getMonth(), now.getDate() + mondayOffset);
			rangeEnd = new Date(rangeStart);
			rangeEnd.setDate(rangeStart.getDate() + 6);
		} else if (mode === "quarter") {
			// 季视图：本季度3个月
			const qStartMonth = Math.floor(now.getMonth() / 3) * 3;
			rangeStart = new Date(currentYear, qStartMonth, 1);
			rangeEnd = new Date(currentYear, qStartMonth + 3, 0);
		} else if (mode === "year") {
			// 年视图：当前年12个月
			rangeStart = new Date(currentYear, 0, 1);
			rangeEnd = new Date(currentYear, 11, 31);
		} else {
			// 月视图：当月
			rangeStart = new Date(currentYear, now.getMonth(), 1);
			rangeEnd = new Date(currentYear, now.getMonth() + 1, 0);
		}

		const totalDays = Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / 86400000) + 1;
		const todayInRange = now >= rangeStart && now <= rangeEnd;

		// 计算位置的辅助函数
		const dayPos = (d: Date) => {
			const offset = Math.ceil((d.getTime() - rangeStart.getTime()) / 86400000);
			return ((offset + 0.5) / totalDays) * 100;
		};
		const barLeft = (d: Date) => {
			const offset = Math.ceil((d.getTime() - rangeStart.getTime()) / 86400000);
			return (offset / totalDays) * 100;
		};
		const barWidth = (start: Date, end: Date) => {
			const startOffset = Math.max(0, Math.ceil((start.getTime() - rangeStart.getTime()) / 86400000));
			const endOffset = Math.min(totalDays - 1, Math.ceil((end.getTime() - rangeStart.getTime()) / 86400000));
			return ((endOffset - startOffset + 1) / totalDays) * 100;
		};
		const fmtMD = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

		// 生成刻度日期（按视图粒度）
		const tickDates: Date[] = [];
		if (mode === "week") {
			for (let i = 0; i < totalDays; i++) {
				const d = new Date(rangeStart);
				d.setDate(rangeStart.getDate() + i);
				tickDates.push(d);
			}
		} else if (mode === "month") {
			for (let i = 1; i <= totalDays; i += 5) tickDates.push(new Date(currentYear, now.getMonth(), i));
			tickDates.push(new Date(rangeEnd));
		} else if (mode === "quarter") {
			for (let i = 0; i < 13; i++) tickDates.push(new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + i * 7));
			tickDates.push(new Date(rangeEnd));
		} else {
			for (let m = 0; m < 12; m++) tickDates.push(new Date(currentYear, m, 1));
		}
		const ticks = tickDates.map((d) => ({
			pos: dayPos(d),
			label: mode === "year" ? `${d.getMonth() + 1}月` : mode === "quarter" ? `${d.getMonth() + 1}/${d.getDate()}` : `${d.getDate()}`
		}));

		// 月份分割线（季/年视图，每月1号，增强跨月识别）
		const monthLines: { pos: number }[] = [];
		if (mode === "quarter" || mode === "year") {
			let d = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + 1, 1);
			while (d <= rangeEnd) {
				if (d > rangeStart) monthLines.push({ pos: barLeft(d) });
				d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
			}
		}

		// 范围标题
		let rangeLabel = "";
		if (mode === "week") rangeLabel = `周视图 ${fmtMD(rangeStart)} ~ ${fmtMD(rangeEnd)}`;
		else if (mode === "month") rangeLabel = `${currentYear}年${now.getMonth() + 1}月`;
		else if (mode === "quarter") rangeLabel = `${currentYear}年 Q${Math.floor(now.getMonth() / 3) + 1}`;
		else rangeLabel = `${currentYear}年`;

		// 过滤在视图范围内有重叠的任务
		const visibleTasks = this.workTasks.filter((t) => {
			const start = t.startDate ? this.parseDate(t.startDate) : this.parseDate(t.dueDate);
			const end = this.parseDate(t.dueDate);
			return end >= rangeStart && start <= rangeEnd;
		});

		el.innerHTML = `
			<div class="gantt-plot">
				${todayInRange ? `<span class="gantt-today-tag" style="left:calc(96px + (100% - 96px) * ${dayPos(now)/100})">今天</span>` : ""}
				${todayInRange ? `<div class="gantt-today-line" style="left:calc(96px + (100% - 96px) * ${dayPos(now)/100})"></div>` : ""}
				${monthLines.map((m) => `<div class="gantt-month-line" style="left:calc(96px + (100% - 96px) * ${m.pos/100})"></div>`).join("")}
				<span class="gantt-range-label">${rangeLabel}</span>
				<div class="gantt-grid">
					<div></div>
					<div class="gantt-scale">${ticks.map((t) => `<span class="gantt-tick" style="left:${t.pos}%">${t.label}</span>`).join("")}</div>
					${visibleTasks.map((t) => {
						const start = t.startDate ? this.parseDate(t.startDate) : this.parseDate(t.dueDate);
						const end = this.parseDate(t.dueDate);
						const color = this.getTaskStatusColor(t);
						const statusLabel = this.getTaskStatusLabel(t);
						const left = barLeft(start);
						const width = barWidth(start, end);
						const progress = t.progress;
						const textColor = progress > 40 ? "white" : "var(--text-secondary)";
						return `<div class="gantt-row-label">${t.title.length > 8 ? t.title.slice(0,8)+"..." : t.title}</div>
						<div class="gantt-row-track">
							<div class="gantt-bar polaris-gantt-task" data-task-id="${t.id}" title="${t.title} | ${statusLabel} | 进度${progress}% | 截止${t.dueDate}（拖动调整日期）" style="left:${left}%;width:${width}%;background:var(--control-bg);border-radius:10px;cursor:grab;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.2);position:relative;user-select:none;touch-action:none;">
								<div class="gantt-bar-progress" style="width:${progress}%;height:100%;background:${color};border-radius:10px;min-width:${progress > 0 ? '8px' : '0'};"></div>
								<span class="gantt-handle gantt-handle-left"></span>
								<span style="position:absolute;left:8px;top:50%;transform:translateY(-50%);font-size:11px;color:var(--text-primary);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 16px);z-index:1;pointer-events:none;">${t.title}</span>
								<span class="gantt-handle gantt-handle-right"></span>
							</div>
						</div>`;
					}).join("")}
					${visibleTasks.length === 0 ? `<div class="gantt-row-label" style="grid-column:1 / -1;text-align:center;padding:20px;color:var(--text-muted);">当前时间范围暂无任务</div>` : ""}
				</div>
			</div>
			<!-- 图例 -->
			<div style="display:flex;gap:16px;margin-top:8px;padding-top:8px;border-top:1px solid var(--divider-line);font-size:10px;color:var(--text-muted);flex-wrap:wrap;">
				<span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:8px;border-radius:2px;background:#9ca3af;"></span>待开始</span>
				<span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:8px;border-radius:2px;background:#60a5fa;"></span>进行中</span>
				<span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:8px;border-radius:2px;background:${this.themeIsLight() ? '#c8e060' : '#a8c040'};"></span>已完成</span>
				<span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:8px;border-radius:2px;background:#f87171;"></span>已逾期</span>
			</div>
			<div style="margin-top:6px;font-size:10px;color:var(--text-muted);opacity:0.8;">↔ 拖动任务条整体平移起止日期 · 拖动条左右边缘可单独调整开始 / 截止</div>`;

		main.querySelectorAll(".gantt-view-btn").forEach((btn) => {
			(btn as HTMLElement).onclick = () => {
				this.ganttMode = (btn as HTMLElement).dataset.mode || "month";
				this.renderBoard();
			};
		});
		el.querySelectorAll(".polaris-gantt-task").forEach((bar) => {
			this.initGanttDrag(bar as HTMLElement, main, rangeStart, rangeEnd, totalDays);
		});
	}

	/** 甘特图拖拽调整起止日期：整条平移（body）/ 左边缘改开始（left）/ 右边缘改截止（right），按天对齐，移动>4px 视为拖拽，否则视为点击打开详情 */
	private initGanttDrag(bar: HTMLElement, main: HTMLElement, rangeStart: Date, rangeEnd: Date, totalDays: number) {
		const taskId = bar.dataset.taskId || "";
		const task = this.workTasks.find((t) => t.id === taskId);
		if (!task) return;
		let dragging = false, moved = false, startX = 0, trackW = 0;
		let mode: "left" | "right" | "body" = "body";
		let origStart: Date, origEnd: Date;
		const fmtMD = (d: Date) => `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
		const clampYear = (d: Date) => {
			const y = new Date().getFullYear();
			if (d.getFullYear() !== y) d = new Date(y, 0, 1);
			return d;
		};
		const applyPreview = (s: Date, e: Date) => {
			// 与 renderGantt 的 barLeft/barWidth 同口径：左=开始日偏移天/totalDays，宽=(结束-开始+1天)/totalDays，避免拖动预览"缩脖子"与松手不一致
			const sDay = Math.max(0, Math.ceil((s.getTime() - rangeStart.getTime()) / 86400000));
			const eDay = Math.max(0, Math.ceil((e.getTime() - rangeStart.getTime()) / 86400000));
			const leftPct = Math.min(100, sDay / totalDays * 100);
			const rightPct = Math.min(100, (eDay + 1) / totalDays * 100);
			const widthPct = Math.max(1, rightPct - leftPct);
			bar.style.setProperty("left", `${leftPct}%`)
			bar.style.setProperty("width", `${Math.min(widthPct, 100)}%`)
		};
		// 拖拽实时日期浮层：跟随鼠标显示当前定位到的日期，松开/取消时移除
		let tipEl: HTMLElement | null = null;
		const removeTip = () => { if (tipEl) { tipEl.remove(); tipEl = null; } };
		const updateTip = (ns: Date, ne: Date, cx: number, cy: number) => {
			if (!tipEl) {
				tipEl = document.createElement("div");
				tipEl.className = "gantt-drag-tip";
				tipEl.setAttribute("style", "position:fixed;z-index:9999;background:rgba(15,15,19,0.95);color:#f0f0f3;font-size:11px;font-weight:600;padding:4px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.14);pointer-events:none;box-shadow:0 4px 12px rgba(0,0,0,0.35);white-space:nowrap;font-family:inherit;");
				document.body.appendChild(tipEl);
			}
			const today0 = new Date(); today0.setHours(0, 0, 0, 0);
			const willOverdue = task.status !== "done" && ne < today0;
			const label = (mode === "body" ? `${fmtMD(ns)} ~ ${fmtMD(ne)}` : mode === "left" ? `开始 ${fmtMD(ns)}` : `截止 ${fmtMD(ne)}`) + (willOverdue ? " ⚠ 将逾期" : "");
			tipEl.textContent = label;
			const tw = tipEl.offsetWidth, th = tipEl.offsetHeight;
			tipEl.style.setProperty("left", `${Math.max(4, Math.min(cx + 14, window.innerWidth - tw - 8))}px`)
			tipEl.style.setProperty("top", `${Math.max(4, cy - th - 14)}px`)
		};
		const computeDates = (dx: number) => {
			const dayDelta = Math.round((dx / trackW) * totalDays);
			let ns = new Date(origStart), ne = new Date(origEnd);
			if (mode === "body") { ns.setDate(ns.getDate() + dayDelta); ne.setDate(ne.getDate() + dayDelta); }
			else if (mode === "left") { ns.setDate(ns.getDate() + dayDelta); if (ns > ne) ns = new Date(ne); }
			else { ne.setDate(ne.getDate() + dayDelta); if (ne < ns) ne = new Date(ns); }
			ns = clampYear(ns); ne = clampYear(ne);
			return { ns, ne, dayDelta };
		};
		bar.addEventListener("pointerdown", (ev) => {
			const rect = bar.getBoundingClientRect();
			const track = bar.closest(".gantt-row-track") as HTMLElement | null;
			if (!track) return;
			trackW = track.getBoundingClientRect().width;
			origStart = task.startDate ? this.parseDate(task.startDate) : this.parseDate(task.dueDate);
			origEnd = this.parseDate(task.dueDate);
			mode = ev.clientX - rect.left < 8 ? "left" : rect.right - ev.clientX < 8 ? "right" : "body";
			startX = ev.clientX; dragging = true; moved = false;
			bar.classList.add("dragging");
			try { bar.setPointerCapture(ev.pointerId); } catch {}
		});
		bar.addEventListener("pointermove", (ev) => {
			if (!dragging || trackW <= 0) return;
			const dx = ev.clientX - startX;
			if (Math.abs(dx) > 4) moved = true;
			const { ns, ne } = computeDates(dx);
			applyPreview(ns, ne);
			updateTip(ns, ne, ev.clientX, ev.clientY);
		});
		bar.addEventListener("pointerup", async (ev) => {
			if (!dragging) return;
			dragging = false;
			bar.classList.remove("dragging");
			removeTip();
			try { bar.releasePointerCapture(ev.pointerId); } catch {}
			if (!moved) {
				const statusMap: Record<string,string> = { todo:"待开始", doing:"进行中", done:"已完成" };
				this.showTaskDetail({ id: task.id, title: task.title, priority: task.priority, status: statusMap[task.status], progress: task.progress, dueDate: task.dueDate, assignee: task.assignee || "Alvin", notePath: task.notePath });
				return;
			}
			const { ns, ne } = computeDates(ev.clientX - startX);
			if (mode === "body") { if (task.startDate) task.startDate = fmtMD(ns); task.dueDate = fmtMD(ne); }
			else if (mode === "left") { task.startDate = fmtMD(ns); }
			else { task.dueDate = fmtMD(ne); }
			this.saveWorkTasks();
			this.showToast(`已更新日期：${fmtMD(ns)} ~ ${fmtMD(ne)}`);
			this.renderBoard();
			this.renderTodayPanel();
			if (this.currentDetailTaskId === task.id) this.refreshRightPanel();
		});
		bar.addEventListener("pointercancel", () => {
			if (!dragging) return;
			dragging = false;
			bar.classList.remove("dragging");
		removeTip();
		});
	}

	private kanbanResultsHTML(): string {
		const filter = this.kanbanFilter;
		const search = this.kanbanSearch.toLowerCase().trim();
		const isOverdueView = filter === "overdue";
		const visibleCols = isOverdueView
			? [{ key: "overdue", name: "逾期任务", color: "#e5484d" }]
			: filter === "all" ? kanbanColumns : kanbanColumns.filter((c) => c.key === filter);
		// 预过滤每列任务（标题/负责人/优先级/ID/拼音）+ 统计匹配总数
		const colTasks = new Map<string, WorkTask[]>();
		let totalMatched = 0;
		for (const col of visibleCols) {
			let tasks = isOverdueView
				? this.workTasks.filter((t) => this.isTaskOverdue(t))
				: this.workTasks.filter((t) => t.status === col.key);
			if (search) {
				tasks = tasks.filter((t) => {
					const hay = [t.title, t.assignee || "", t.priority || "", t.id || ""].join(" ").toLowerCase();
					if (hay.includes(search)) return true;
					// 拼音匹配：全拼（jingpin）+ 首字母（jp）
					const pyFull = pinyin(t.title, { toneType: "none" }).replace(/\s/g, "").toLowerCase();
					const pyFirst = pinyin(t.title, { toneType: "none", pattern: "first" }).replace(/\s/g, "").toLowerCase();
					return pyFull.includes(search) || pyFirst.includes(search);
				});
			}
			colTasks.set(col.key, tasks);
			totalMatched += tasks.length;
		}
		return `<div class="kanban-results-wrap">
			${search ? `<div class="kanban-search-result">${totalMatched > 0 ? `找到 <b>${totalMatched}</b> 条匹配任务` : "未找到相关任务"}</div>` : ""}
			<div class="kanban-columns ${visibleCols.length===1?"single":""}">
				${visibleCols.map((col) => {
					const tasks = colTasks.get(col.key) || [];
					return `<div class="kanban-column" data-status="${col.key}">
						<div class="kanban-col-header"><span class="kanban-col-dot" style="background:${col.color}"></span>${col.name}<span class="kanban-col-count">${tasks.length}</span></div>
						${tasks.length ? tasks.map((t) => this.taskCardHTML(t, this.kanbanSearch.trim())).join("") : `<div class="kanban-empty">${search ? "无匹配任务" : "暂无任务"}</div>`}
					</div>`;
				}).join("")}
			</div>
			${`<div style="display:flex;gap:6px;margin-top:8px;padding-top:8px;border-top:1px solid var(--divider-line);font-size:10px;color:var(--text-muted);flex-wrap:wrap;align-items:center;">
				<span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#c084fc;"></span>最高优先 P0</span>
				<span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#fbbf24;"></span>高优先 P1</span>
				<span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#9ca3af;"></span>普通 P2</span>
				<span style="opacity:0.4;">·</span>
				<span style="display:flex;align-items:center;gap:4px;"><span style="color:var(--text-muted);">灰色日期</span> = 正常</span>
				<span style="display:flex;align-items:center;gap:4px;"><span style="color:var(--danger-red);font-weight:600;">红色日期</span> = 已逾期</span>
			</div>`}
		</div>`;
	}

	private renderKanban(main: HTMLElement) {
		const el = main.querySelector(".polaris-work-kanban") as HTMLElement;
		el.innerHTML = this.kanbanResultsHTML();
		this.bindKanbanResultsEvents(el);
	}

	// 任务看板工具区（搜索 + 筛选，位于卡片壳头部右侧）
	private bindKanbanToolsEvents(main: HTMLElement) {
		const cardEl = main.querySelector('.dash-card[data-card-id="kanban"]') as HTMLElement;
		if (!cardEl) return;
		const tools = cardEl.querySelector(".dash-card-tools") as HTMLElement;
		if (!tools) return;
		const el = main.querySelector(".polaris-work-kanban") as HTMLElement;
		// 筛选标签点击：切换筛选（更新高亮 + 结果区）
		tools.querySelectorAll(".filter-tab").forEach((tab) => {
			(tab as HTMLElement).onclick = () => {
				this.kanbanFilter = (tab as HTMLElement).dataset.filter || "all";
				tools.querySelectorAll(".filter-tab").forEach((t) =>
					(t as HTMLElement).classList.toggle("active", (t as HTMLElement).dataset.filter === this.kanbanFilter));
				const wrap = main.querySelector(".kanban-results-wrap") as HTMLElement;
				if (wrap) {
					wrap.innerHTML = this.kanbanResultsHTML();
					this.bindKanbanResultsEvents(el);
				}
			};
		});
		// 搜索按钮点击：展开搜索框并聚焦
		const searchWrap = tools.querySelector(".kanban-search-wrap") as HTMLElement;
		const searchToggle = tools.querySelector(".kanban-search-toggle");
		if (searchToggle && searchWrap) {
			(searchToggle as HTMLElement).onclick = () => {
				searchWrap.classList.add("expanded");
				const inp = searchWrap.querySelector(".kanban-search-input") as HTMLInputElement;
				if (inp) inp.focus();
			};
		}
		// 搜索框输入事件：实时过滤（组合期间防抖保护候选窗；上屏后立即过滤，双保险）
		const searchInput = tools.querySelector(".kanban-search-input") as HTMLInputElement;
		if (searchInput) {
			const applySearch = () => {
				this.kanbanSearch = searchInput.value;
				const wrap = main.querySelector(".kanban-results-wrap") as HTMLElement;
				if (wrap) {
					wrap.innerHTML = this.kanbanResultsHTML();
					this.bindKanbanResultsEvents(el);
				}
			};
			searchInput.oninput = (e) => {
				const ev = e as InputEvent;
				clearTimeout(this._searchDebounceTimer);
				if (ev.isComposing) {
					// 拼音组合期间：不立即渲染（避免打断候选词窗），停顿后兜底应用
					this._searchDebounceTimer = window.setTimeout(() => applySearch(), 300);
				} else {
					// 非组合（英文输入 / 选词上屏）：立即过滤
					applySearch();
				}
			};
			// 失去焦点且无内容时收起为按钮
			searchInput.onblur = () => {
				if (!this.kanbanSearch) searchWrap.classList.remove("expanded");
			};
			// Esc 清空搜索并收起
			searchInput.onkeydown = (e) => {
				if (e.key === "Escape") {
					this.kanbanSearch = "";
					this.renderBoard();
				}
			};
		}
		// 清除按钮点击事件
		const clearBtn = tools.querySelector(".kanban-search-clear");
		if (clearBtn) {
			(clearBtn as HTMLElement).onclick = () => {
				this.kanbanSearch = "";
				this.renderBoard();
			};
		}
	}

	private bindKanbanResultsEvents(el: HTMLElement) {
		// 卡片点击事件 + 拖拽事件
		el.querySelectorAll(".task-card").forEach((card) => {
			const cardEl = card as HTMLElement;

			// 点击事件
			cardEl.onclick = () => {
				// 如果是拖拽结束后的点击，不触发（拖拽会触发 click，这里用一个标志位）
				if (this.draggedTaskId === cardEl.dataset.taskId && this._justDragged) {
					this._justDragged = false;
					return;
				}
				const task = this.workTasks.find((t) => t.id === cardEl.dataset.taskId);
				if (task) {
					const statusMap: Record<string,string> = { todo:"待开始", doing:"进行中", done:"已完成" };
					this.showTaskDetail({id:task.id,title:task.title,priority:task.priority,status:statusMap[task.status],progress:task.progress,dueDate:task.dueDate,assignee:task.assignee || "Alvin",notePath:task.notePath});
				}
			};

			// 拖拽开始（逾期视图为虚拟列，禁用拖拽，避免把任务改到无效状态）
			if (this.kanbanFilter !== "overdue") {
				cardEl.ondragstart = (e) => {
					this.draggedTaskId = cardEl.dataset.taskId || null;
					this._justDragged = true;
					cardEl.classList.add("dragging");
					if (e.dataTransfer) {
						e.dataTransfer.effectAllowed = "move";
						e.dataTransfer.setData("text/plain", this.draggedTaskId || "");
					}
				};

				// 拖拽结束
				cardEl.ondragend = () => {
					cardEl.classList.remove("dragging");
					// 清理所有列的高亮
					el.querySelectorAll(".kanban-column").forEach((col) => col.classList.remove("drag-over"));
					setTimeout(() => { this.draggedTaskId = null; }, 100);
				};
			}
		});

		// 分段进度条点击：快速调整进度
		el.querySelectorAll(".progress-segmented").forEach((segContainer) => {
			const container = segContainer as HTMLElement;
			const taskId = container.dataset.taskId || "";
			const task = this.workTasks.find((t) => t.id === taskId);
			if (!task) return;

			container.querySelectorAll(".seg").forEach((segEl) => {
				const seg = segEl as HTMLElement;
				seg.onclick = (e) => {
					e.stopPropagation(); // 阻止冒泡，避免触发卡片点击
					const value = parseInt(seg.dataset.value || "0");
					// 如果点击的是第1段（25%）且当前已经是25%，则变回0%（再点一次取消）
					if (value === 25 && task.progress === 25) {
						this.setTaskProgress(taskId, 0);
					} else {
						this.setTaskProgress(taskId, value);
					}
				};
			});
		});

		// 进度数字点击：弹出档位选择器（精确选择备用入口）
		el.querySelectorAll(".polaris-task-progress").forEach((progressEl) => {
			(progressEl as HTMLElement).onclick = (e) => {
				e.stopPropagation(); // 阻止冒泡，避免触发卡片点击
				const taskId = (progressEl as HTMLElement).dataset.taskId || "";
				const task = this.workTasks.find((t) => t.id === taskId);
				if (!task) return;

				const menu = new Menu();
				const progressOptions = [
					{ value: 0, label: "0%（待办）", status: "todo" as const },
					{ value: 25, label: "25%", status: "doing" as const },
					{ value: 50, label: "50%", status: "doing" as const },
					{ value: 75, label: "75%", status: "doing" as const },
					{ value: 100, label: "100%（已完成）", status: "done" as const },
				];

				progressOptions.forEach((opt) => {
					menu.addItem((item) => {
						item.setTitle(opt.label);
						if (task.progress === opt.value) {
							item.setChecked(true); // 当前进度打勾
						}
						item.onClick(() => {
							this.setTaskProgress(taskId, opt.value);
						});
					});
				});

				menu.showAtMouseEvent(e);
			};
		});

		// 列的拖拽事件
		el.querySelectorAll(".kanban-column").forEach((col) => {
			const colEl = col as HTMLElement;

			// 拖拽经过
			colEl.ondragover = (e) => {
				e.preventDefault();
				if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
				colEl.classList.add("drag-over");
			};

			// 拖拽离开
			colEl.ondragleave = (e) => {
				// 只有真正离开列时才移除高亮（避免在子元素间移动时闪烁）
				if (!colEl.contains(e.relatedTarget as Node)) {
					colEl.classList.remove("drag-over");
				}
			};

			// 放置
			colEl.ondrop = (e) => {
				e.preventDefault();
				colEl.classList.remove("drag-over");
				const taskId = this.draggedTaskId || (e.dataTransfer?.getData("text/plain") || "");
				const newStatus = colEl.dataset.status as "todo" | "doing" | "done";
				if (!taskId || !newStatus) return;

				const task = this.workTasks.find((t) => t.id === taskId);
				if (task && task.status !== newStatus) {
					task.status = newStatus;
					// 状态联动进度
					if (newStatus === "done") {
						task.progress = 100;
						task.overdue = false;
						task.completedDate = new Date().toISOString().split("T")[0];
					} else if (newStatus === "doing") {
						if (task.progress === 100) task.progress = 50;
						else if (task.progress === 0) task.progress = 25; // 从待办进入进行中：给最小可见初始进度（分段条最小档）
						task.completedDate = undefined;
					} else {
						task.progress = 0;
						task.completedDate = undefined;
					}
					const statusMap: Record<string,string> = { todo:"待办", doing:"进行中", done:"已完成" };
					this.showToast(`「${task.title}」已移至「${statusMap[newStatus]}」`);
					this.saveWorkTasks(); // 持久化到 data.json
					this.renderBoard(); // 重新渲染整个工作看板（包括统计、甘特图等）
				}
			};
		});
	}

	private highlight(text: string, keyword: string): string {
		if (!keyword) return text;
		const esc = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const re = new RegExp(`(${esc})`, "gi");
		return text.replace(re, `<mark class="search-hit">$1</mark>`);
	}

	private taskCardHTML(t: WorkTask, keyword = "") {
		const pClass = t.priority.toLowerCase();
		const segments = [25, 50, 75, 100]; // 4段：0%=0段亮，25%=1段亮，50%=2段亮，75%=3段亮，100%=4段亮
		return `<div class="task-card status-${t.status}${this.isTaskOverdue(t) ? " status-overdue" : ""}" data-task-id="${t.id}" draggable="true">
			<div class="task-card-top"><span class="task-priority ${pClass}"><span class="dot"></span>${t.priority}</span><span class="task-due ${this.isTaskOverdue(t)?"overdue":""}">${t.dueDate}</span></div>
			<div class="task-title">${this.highlight(t.title, keyword)}</div>
			<div class="task-progress-row">
				<div class="progress-segmented" data-task-id="${t.id}">
					${segments.map((val) => `<div class="seg ${t.progress>=val?"active":""}" data-value="${val}" title="${val}%"></div>`).join("")}
				</div>
				<span class="progress-text polaris-task-progress" data-task-id="${t.id}" title="点击精确选择">${t.progress}%</span>
			</div>
		</div>`;
	}

	// ==================== 任务进度调整 ====================
	private saveWorkTasks() {
		if (this.plugin?.pluginData) {
			this.plugin.pluginData.workTasks = JSON.parse(JSON.stringify(this.workTasks));
			this.plugin.savePluginData();
		}
	}

	private savePomodoroSessions() {
		if (this.plugin?.pluginData) {
			this.plugin.pluginData.pomodoroSessions = JSON.parse(JSON.stringify(this.pomodoroSessions));
			this.plugin.savePluginData();
		}
	}

	private setTaskProgress(taskId: string, progress: number) {
		const task = this.workTasks.find((t) => t.id === taskId);
		if (!task) return;

		task.progress = progress;
		// 状态与进度联动
		if (progress === 0) {
			task.status = "todo";
			task.completedDate = undefined;
		} else if (progress === 100) {
			task.status = "done";
			task.overdue = false;
			task.completedDate = new Date().toISOString().split("T")[0];
		} else {
			task.status = "doing";
			task.completedDate = undefined;
		}
		this.showToast(`「${task.title}」进度已调整为 ${progress}%`);
		this.saveWorkTasks(); // 持久化到 data.json
		this.renderBoard(); // 重新渲染整个工作看板
	}

	// ==================== 详情面板 ====================
	// 返回右侧今日面板：打卡 + 卡片化今日待办 + 本周学习。
	// 统一走新版 renderTodayPanel，修复此前"新版卡片化 / 旧版复习样式"双渲染路径
	// 并存导致的主题切换后结构不稳定问题。
	private resetDetail() {
		this.currentDetailTaskId = null;
		this.renderTodayPanel();
	}

	private showTaskDetail(t: any) {
		this.currentDetailTaskId = t.id;
		const tsk = this.workTasks.find((w) => w.id === t.id);
		const startD = t.startDate || (tsk ? tsk.startDate : undefined);
		const detail = this.rootEl!.querySelector(".polaris-detail-content") as HTMLElement;
		detail.className = "polaris-detail-content detail-body";

		// 状态/优先级选项（分段按钮硬编码在模板中）
		const currentStatusValue = t.status === "已完成" ? "done" : t.status === "进行中" ? "doing" : "todo";

		detail.innerHTML = `
			<div class="detail-section">
				<div class="detail-section-title" style="display:flex;justify-content:space-between;align-items:center;">
					<span>🎯 焦点任务</span>
					<button class="btn-secondary polaris-detail-back" style="padding:3px 8px;font-size:11px;">← 返回今日待办</button>
				</div>
				<div class="detail-task-id">${t.id}</div>
				<div class="detail-task-title">${t.title}</div>
				<div class="detail-progress-label"><span>进度</span><span>${t.progress}%</span></div>
				<div class="progress-track thin"><div class="progress-fill" style="width:${t.progress}%"></div></div>
				<!-- 可编辑字段：与今日待办展开块保持一致（输入字段在上，状态/优先级分段按钮在下） -->
				<div class="detail-edit-list">
					<div class="detail-edit-row">
						<span class="detail-edit-row-label">📅 开始日期</span>
						<button type="button" class="detail-edit-row-input date-field polaris-detail-start" data-task-id="${t.id}">
							<span class="date-field-value ${startD ? "" : "empty"}">${startD || "选择日期"}</span>
							<span class="date-field-icon">📅</span>
						</button>
					</div>
					<div class="detail-edit-row">
						<span class="detail-edit-row-label">🕐 截止日期</span>
						<button type="button" class="detail-edit-row-input date-field polaris-detail-due" data-task-id="${t.id}">
							<span class="date-field-value ${t.dueDate ? "" : "empty"}">${t.dueDate || "选择日期"}</span>
							<span class="date-field-icon">📅</span>
						</button>
					</div>
					<div class="detail-edit-row">
						<span class="detail-edit-row-label">👤 负责人</span>
						<input class="detail-edit-row-input polaris-detail-assignee" data-task-id="${t.id}" value="${t.assignee || ""}" placeholder="未设置" />
					</div>
				</div>
				<div class="detail-edit-list" style="margin:12px 0;">
					<div class="detail-edit-row">
						<span class="detail-edit-row-label">状态</span>
						<div class="status-segmented">
							<button class="status-seg ${currentStatusValue==='todo'?'active':''}" data-status="todo" data-task-id="${t.id}">待办</button>
							<button class="status-seg ${currentStatusValue==='doing'?'active':''}" data-status="doing" data-task-id="${t.id}">进行中</button>
							<button class="status-seg ${currentStatusValue==='done'?'active':''}" data-status="done" data-task-id="${t.id}">已完成</button>
						</div>
					</div>
					<div class="detail-edit-row">
						<span class="detail-edit-row-label">优先级</span>
						<div class="status-segmented">
							<button class="status-seg ${t.priority==='P0'?'active':''}" data-priority="P0" data-task-id="${t.id}">P0</button>
							<button class="status-seg ${t.priority==='P1'?'active':''}" data-priority="P1" data-task-id="${t.id}">P1</button>
							<button class="status-seg ${t.priority==='P2'?'active':''}" data-priority="P2" data-task-id="${t.id}">P2</button>
						</div>
					</div>
				</div>
				<div class="detail-actions">
					<button class="btn-secondary polaris-detail-open-note">📄 打开笔记</button>
					<button class="btn-primary polaris-detail-edit-task">✎ 编辑任务</button>
				</div>
			</div>
			</div>`;


		// 打开笔记按钮
		(detail.querySelector(".polaris-detail-open-note") as HTMLElement).onclick = () => {
			if (t.notePath) {
				this.openNoteByPath(t.notePath);
			} else {
				this.showToast("该任务没有关联的笔记");
			}
		};

		// 编辑任务按钮
		(detail.querySelector(".polaris-detail-edit-task") as HTMLElement).onclick = () => {
			this.openEditTaskModal(t.id);
		};

		// 状态分段控件点击
		detail.querySelectorAll(".status-seg").forEach((seg) => {
			(seg as HTMLElement).onclick = () => {
				const taskId = t.id;
				const newStatus = (seg as HTMLElement).dataset.status as "todo" | "doing" | "done";
				const task = this.workTasks.find((tk) => tk.id === taskId);
				if (task) {
					task.status = newStatus;
					if (newStatus === "done") {
						task.progress = 100;
						task.overdue = false;
						task.completedDate = new Date().toISOString().split("T")[0];
					} else if (newStatus === "doing") {
						if (task.progress === 100) task.progress = 50;
						else if (task.progress === 0) task.progress = 25; // 从待办进入进行中：给最小可见初始进度（分段条最小档）
						task.completedDate = undefined;
					} else {
						task.progress = 0;
						task.completedDate = undefined;
					}
					this.renderBoard();
					const statusMap: Record<string,string> = { todo:"待开始", doing:"进行中", done:"已完成" };
					this.showTaskDetail({id:task.id,title:task.title,priority:task.priority,status:statusMap[task.status],progress:task.progress,dueDate:task.dueDate,assignee:task.assignee,notePath:task.notePath});
					this.showToast(`状态已修改为「${statusMap[newStatus]}」`);
					this.saveWorkTasks(); // 持久化到 data.json
				}
			};
		});

		// 优先级分段按钮点击（与今日待办展开块一致）
		detail.querySelectorAll(".status-seg[data-priority]").forEach((seg) => {
			(seg as HTMLElement).onclick = () => {
				const taskId = t.id;
				const newPriority = (seg as HTMLElement).dataset.priority as "P0" | "P1" | "P2";
				const task = this.workTasks.find((tk) => tk.id === taskId);
				if (task) {
					task.priority = newPriority;
					this.renderBoard();
					const statusMap: Record<string,string> = { todo:"待开始", doing:"进行中", done:"已完成" };
					this.showTaskDetail({id:task.id,title:task.title,priority:task.priority,status:statusMap[task.status],progress:task.progress,dueDate:task.dueDate,startDate:task.startDate,assignee:task.assignee,notePath:task.notePath});
					this.showToast(`优先级已修改为「${newPriority}」`);
					this.saveWorkTasks(); // 持久化到 data.json
				}
			};
		});

		// 返回今日待办：恢复右侧常驻面板
		const backBtn = detail.querySelector(".polaris-detail-back") as HTMLElement;
		if (backBtn) backBtn.onclick = (e) => {
			e.stopPropagation();
			this.currentDetailTaskId = null;
			this.renderTodayPanel();
		};

		// 可编辑字段：开始日期 / 截止时间 / 负责人，修改后保存并保持详情视图
		const saveDetailField = (key: "startDate" | "dueDate" | "assignee", input: HTMLInputElement) => {
			input.onchange = () => {
				const task = this.workTasks.find((w) => w.id === t.id);
				if (!task) return;
				(task as any)[key] = input.value.trim();
				this.saveWorkTasks();
				this.renderBoard();
				this.showToast("已保存");
			};
			input.onkeydown = (e) => {
				if (e.key === "Enter") input.blur();
			};
		};
		// 日期字段：点击弹出月历点选（仿飞书多维表格），选择后保存并保持详情视图
		const statusMapD: Record<string,string> = { todo:"待开始", doing:"进行中", done:"已完成" };
		const bindDetailDate = (key: "startDate" | "dueDate", btn: HTMLButtonElement) => {
			btn.onclick = () => {
				const task = this.workTasks.find((w) => w.id === t.id);
				if (!task) return;
				this.openDatePicker(btn, (task as any)[key], (mmdd) => {
					const tk = this.workTasks.find((x) => x.id === t.id);
					if (!tk) return;
					(tk as any)[key] = mmdd;
					this.saveWorkTasks();
					this.renderBoard();
					this.showToast("已保存");
					this.showTaskDetail({ id: tk.id, title: tk.title, priority: tk.priority, status: statusMapD[tk.status], progress: tk.progress, dueDate: tk.dueDate, startDate: tk.startDate, assignee: tk.assignee, notePath: tk.notePath });
				});
			};
		};
		detail.querySelectorAll<HTMLButtonElement>(".polaris-detail-start").forEach((el) => bindDetailDate("startDate", el));
		detail.querySelectorAll<HTMLButtonElement>(".polaris-detail-due").forEach((el) => bindDetailDate("dueDate", el));
		// 负责人：文本输入，修改后保存并保持详情视图
		detail.querySelectorAll<HTMLInputElement>(".polaris-detail-assignee").forEach((el) => saveDetailField("assignee", el));
	}


	// ==================== 新建复习（手动加入今日队列） ====================
	private openNewReviewModal() {
		const files = this.app.vault.getMarkdownFiles().sort((a, b) => a.path.localeCompare(b.path));
		const recordMap: Record<string, ReviewRecord> = {};
		this.reviewRecords.forEach((r) => { recordMap[r.path] = r; });
		const today = this.fmtDate(new Date());

		this.showModal("＋ 加入今日复习", `
			<div class="form-field">
				<label class="form-label">搜索笔记</label>
				<div class="search-box"><span class="search-icon polaris-note-list-search-icon">🔍</span><input class="search-input polaris-note-list-search polaris-review-search" type="text" placeholder="输入笔记标题或路径关键词..." autocomplete="off"></div>
			</div>
			<div class="polaris-review-list" style="max-height:280px;overflow-y:auto;border:1px solid var(--border-color);border-radius:var(--radius-md);margin-bottom:12px;"></div>
			<div class="polaris-review-selected" style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;min-height:18px;"></div>
			<div class="form-actions"><button type="button" class="btn-secondary polaris-modal-cancel">取消</button><button type="button" class="btn-primary polaris-review-confirm" disabled>加入今日复习</button></div>`);

		const modal = this.rootEl!.querySelector(".polaris-modal-box") as HTMLElement;
		const search = modal.querySelector(".polaris-review-search") as HTMLInputElement;
		const listEl = modal.querySelector(".polaris-review-list") as HTMLElement;
		const selEl = modal.querySelector(".polaris-review-selected") as HTMLElement;
		const confirmBtn = modal.querySelector(".polaris-review-confirm") as HTMLButtonElement;
		(modal.querySelector(".polaris-modal-cancel") as HTMLElement).onclick = () => this.closeModal();

		let selectedPath = "";
		const renderList = (kw: string) => {
			const q = kw.trim().toLowerCase();
			const matched = q === "" ? files.slice(0, 30) : files.filter((f) => f.path.toLowerCase().includes(q)).slice(0, 30);
			if (matched.length === 0) {
				listEl.innerHTML = '<div style="padding:12px;color:var(--text-muted);font-size:12px;">未找到匹配笔记</div>';
				return;
			}
			listEl.innerHTML = matched.map((f) => {
				const r = recordMap[f.path];
				const badge = !r ? '<span style="color:var(--text-brand);font-size:11px;">新笔记</span>'
					: r.skipped ? '<span style="color:var(--text-muted);font-size:11px;">已跳过</span>'
					: r.status === "mastered" ? '<span style="color:var(--text-brand);font-size:11px;">已掌握</span>'
					: '<span style="color:var(--text-secondary);font-size:11px;">下次 ' + (r.nextDue === "9999-12-31" ? "—" : r.nextDue) + '</span>';
				return '<div class="polaris-review-item" data-path="' + f.path + '" style="padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--divider-color);display:flex;justify-content:space-between;gap:8px;align-items:center;">'
					+ '<span style="font-size:12px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + f.path + '</span>'
					+ '<span style="flex-shrink:0;">' + badge + '</span></div>';
			}).join("");
			listEl.querySelectorAll(".polaris-review-item").forEach((el) => {
				const item = el as HTMLElement;
				item.onclick = () => {
					listEl.querySelectorAll(".polaris-review-item").forEach((x) => { (x as HTMLElement).style.setProperty("background", "") });
					item.style.setProperty("background", "rgba(200,224,96,0.12)")
					selectedPath = item.dataset.path || "";
					const f = files.find((x) => x.path === selectedPath);
					const r = recordMap[selectedPath];
					selEl.textContent = !f ? "" : !r ? "新笔记 · 加入后作为「首轮」立即进入今日队列"
						: r.status === "mastered" ? "已掌握 · 加入后将重置为学习中并立即复习"
						: r.skipped ? "已跳过 · 加入后将解除跳过并立即复习"
						: "上次 " + (r.lastReviewed || "—") + " · 下次 " + (r.nextDue === "9999-12-31" ? "—" : r.nextDue) + " · 已复习 " + r.times + " 次";
					confirmBtn.disabled = false;
				};
			});
		};
		search.oninput = () => renderList(search.value);
		renderList("");

		confirmBtn.onclick = async () => {
			if (!selectedPath) return;
			const f = files.find((x) => x.path === selectedPath);
			if (!f) { this.showToast("未找到笔记"); return; }
			let rec = recordMap[selectedPath];
			const subject = this.getReviewSubject(f);
			if (!rec) {
				rec = { path: selectedPath, subject, stage: 0, lastReviewed: "", nextDue: today, times: 0, skipped: false, status: "new", wrongCount: 0, wrongDates: [] };
				this.reviewRecords.push(rec);
			} else {
				rec.subject = subject;
				rec.nextDue = today;     // 立即到期 → 进入今日队列
				rec.lastReviewed = "";   // 今天尚未复习，避免被"今日已复习"跳过
				rec.skipped = false;     // 解除跳过
				if (rec.status === "mastered") { rec.status = "learning"; rec.stage = 0; rec.times = 0; rec.wrongCount = 0; rec.wrongDates = []; }
				rec.wrongCount = rec.wrongCount || 0;
				rec.wrongDates = rec.wrongDates || [];
			}
			await this.persistReviewData();
			this.closeModal();
			this.renderBoard();
			this.showToast("已将「" + f.basename + "」加入今日复习");
		};
	}

	// ==================== 模态框 ====================
	private openNewCardModal() {
		this.showModal("新建任务", `
			<form id="polaris-new-card-form">
				<div class="form-field"><label class="form-label">任务标题 <span class="required">*</span></label><input class="form-input" name="title" type="text" placeholder="输入任务标题..." required></div>
				<div class="form-field"><label class="form-label">描述</label><textarea class="form-textarea" name="description" placeholder="补充描述（可选）..."></textarea></div>
				<div class="form-field"><label class="form-label">优先级</label><div class="status-segmented form-priority-seg" role="group" aria-label="优先级"><button type="button" class="status-seg" data-priority="P0">P0</button><button type="button" class="status-seg active" data-priority="P1">P1</button><button type="button" class="status-seg" data-priority="P2">P2</button></div></div>
				<div class="form-row">
					<div class="form-field"><label class="form-label">开始日期</label><div class="form-date-wrap"><input type="hidden" name="startDate" id="polaris-form-start"><button type="button" class="form-input form-date-field" data-target="polaris-form-start"><span class="form-date-value empty">选择日期</span><span class="form-date-icon">📅</span></button></div></div>
					<div class="form-field"><label class="form-label">截止日期</label><div class="form-date-wrap"><input type="hidden" name="dueDate" id="polaris-form-due"><button type="button" class="form-input form-date-field" data-target="polaris-form-due"><span class="form-date-value empty">选择日期</span><span class="form-date-icon">📅</span></button></div></div>
				</div>
				<div class="form-actions"><button type="button" class="btn-secondary polaris-modal-cancel">取消</button><button type="submit" class="btn-primary">创建</button></div>
			</form>`);
		const modal = this.rootEl!.querySelector(".polaris-modal-box") as HTMLElement;
		(modal.querySelector(".polaris-modal-cancel") as HTMLElement).onclick = () => this.closeModal();
		this.bindFormDateFields(modal);
		// 优先级：平铺分段控件，点击切换选中态
		modal.querySelectorAll(".form-priority-seg .status-seg").forEach((b) => {
			(b as HTMLElement).onclick = () => {
				modal.querySelectorAll(".form-priority-seg .status-seg").forEach((x) => x.classList.remove("active"));
				(b as HTMLElement).classList.add("active");
			};
		});
		(modal.querySelector("#polaris-new-card-form") as HTMLFormElement).onsubmit = (e) => {
			e.preventDefault();
			const form = e.target as HTMLFormElement;
			const fd = new FormData(form);
			const title = (fd.get("title")||"").toString().trim();
			if (!title) { this.showToast("标题不能为空"); return; }
			const priorityBtn = modal.querySelector(".form-priority-seg .status-seg.active") as HTMLElement | null;
			const priority = (priorityBtn?.dataset.priority as "P0"|"P1"|"P2") || "P1";
			const startRaw = fd.get("startDate") as string;
			const dueRaw = fd.get("dueDate") as string;
			const startDate = startRaw || undefined;
			const dueDate = dueRaw ? dueRaw : "待定";
			const maxId = this.workTasks.reduce((m,t)=>Math.max(m,parseInt(t.id.slice(4),10)||0),0);
			this.workTasks.push({id:"WXB-"+String(maxId+1).padStart(3,"0"),title,priority,status:"todo",progress:0,startDate,dueDate,overdue:false});
			this.saveWorkTasks(); // 持久化到 data.json
			this.closeModal();
			this.renderTodayPanel();
			this.renderBoard();
			this.showToast(`任务「${title}」创建成功`);
		};
	}

	private openEditTaskModal(taskId: string) {
		const task = this.workTasks.find((t) => t.id === taskId);
		if (!task) return;

		// 任务日期以 MM/DD 存储（与详情区一致），无需转换为原生 date 格式
		const dueDateValue = task.dueDate && task.dueDate !== "待定" ? task.dueDate : "";
		const startDateValue = task.startDate || "";

		this.showModal("编辑任务", `
			<form id="polaris-edit-task-form">
				<div class="form-field">
					<label class="form-label">任务标题 <span class="required">*</span></label>
					<input class="form-input" name="title" type="text" value="${task.title}" required>
				</div>
				<div class="form-row">
					<div class="form-field">
						<label class="form-label">开始日期</label>
						<div class="form-date-wrap"><input type="hidden" name="startDate" id="polaris-edit-start" value="${startDateValue}"><button type="button" class="form-input form-date-field" data-target="polaris-edit-start"><span class="form-date-value ${startDateValue ? "" : "empty"}">${startDateValue || "选择日期"}</span><span class="form-date-icon">📅</span></button></div>
					</div>
					<div class="form-field">
						<label class="form-label">截止日期</label>
						<div class="form-date-wrap"><input type="hidden" name="dueDate" id="polaris-edit-due" value="${dueDateValue}"><button type="button" class="form-input form-date-field" data-target="polaris-edit-due"><span class="form-date-value ${dueDateValue ? "" : "empty"}">${dueDateValue || "选择日期"}</span><span class="form-date-icon">📅</span></button></div>
					</div>
				</div>
				<div class="form-field">
					<label class="form-label">负责人</label>
					<input class="form-input" name="assignee" type="text" value="${task.assignee||""}" placeholder="输入负责人">
				</div>
				<div class="form-field">
					<label class="form-label">关联笔记路径</label>
					<input class="form-input" name="notePath" type="text" value="${task.notePath||""}" placeholder="如：01-Projects-项目/任务笔记.md">
				</div>
				<div class="form-actions">
					<button type="button" class="btn-secondary polaris-modal-cancel">取消</button>
					<button type="submit" class="btn-primary">保存</button>
					<button type="button" class="btn-danger polaris-delete-task" style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.35);color:#f87171;padding:8px 12px;border-radius:8px;font-size:12px;cursor:pointer;transition:all 0.15s;">🗑️ 删除任务</button>
				</div>
			</form>`);

		const modal = this.rootEl!.querySelector(".polaris-modal-box") as HTMLElement;
		(modal.querySelector(".polaris-modal-cancel") as HTMLElement).onclick = () => this.closeModal();
		this.bindFormDateFields(modal);
		// 删除任务（危险操作，二次确认）
		(modal.querySelector(".polaris-delete-task") as HTMLElement).onclick = () => {
			const ok = confirm(`确定删除任务「${task.title}」？\n\n此操作不可恢复。`);
			if (!ok) return;
			const idx = this.workTasks.findIndex((t) => t.id === task.id);
			if (idx > -1) this.workTasks.splice(idx, 1);
			this.closeModal();
			this.saveWorkTasks();
			this.renderTodayPanel();
			this.renderBoard();
			if (this.currentDetailTaskId === task.id) this.currentDetailTaskId = null;
			this.showToast(`任务「${task.title}」已删除`);
		};
		(modal.querySelector("#polaris-edit-task-form") as HTMLFormElement).onsubmit = (e) => {
			e.preventDefault();
			const form = e.target as HTMLFormElement;
			const fd = new FormData(form);
			const title = (fd.get("title")||"").toString().trim();
			if (!title) { this.showToast("标题不能为空"); return; }

			const dueRaw = fd.get("dueDate") as string;
			const startRaw = fd.get("startDate") as string;
			const assignee = (fd.get("assignee")||"").toString().trim();
			const notePath = (fd.get("notePath")||"").toString().trim();

			// 日期已是 MM/DD 格式（自研日期选择器直接写入），无需再转换
			const formatDate = (dateStr: string): string => {
				if (!dateStr) return "待定";
				return dateStr;
			};

			// 更新任务（状态和优先级在详情页分段控件/下拉框中修改，这里不处理）
			task.title = title;
			task.dueDate = formatDate(dueRaw);
			task.startDate = startRaw ? formatDate(startRaw) : undefined;
			task.assignee = assignee || undefined;
			task.notePath = notePath || undefined;

			this.closeModal();
			this.saveWorkTasks(); // 持久化到 data.json
			this.renderTodayPanel();
			this.renderBoard();
			// 重新渲染详情页，显示更新后的数据
			const statusMap: Record<string,string> = { todo:"待开始", doing:"进行中", done:"已完成" };
			this.showTaskDetail({
				id: task.id,
				title: task.title,
				priority: task.priority,
				status: statusMap[task.status],
				progress: task.progress,
				dueDate: task.dueDate,
				assignee: task.assignee,
				notePath: task.notePath
			});
			this.showToast(`任务「${title}」已更新`);
		};
	}

	private openSettingsModal() {
		this.showModal("仪表盘设置", `
			<div class="setting-section-title">外观</div>
			<div class="setting-row">
				<div class="setting-label-row"><span>卡片透明度</span><span class="setting-value" id="polaris-opacity-value">75%</span></div>
				<div class="tslider" id="polaris-opacity-slider" data-min="0.1" data-max="1" data-step="0.05" data-value="0.75"></div>
			</div>
			<div class="setting-row">
				<div class="setting-label-row"><span>毛玻璃模糊强度</span><span class="setting-value" id="polaris-blur-value">20px</span></div>
				<div class="tslider" id="polaris-blur-slider" data-min="0" data-max="40" data-step="1" data-value="20"></div>
			</div>
			<div class="setting-row" style="flex-direction:column;align-items:stretch;gap:6px;">
				<div class="setting-label-row"><span>背景壁纸</span><span class="setting-value" style="font-size:11px;">深色主题生效</span></div>
				<div class="polaris-wp-grid">
					<button type="button" class="polaris-wp-card" data-wp="none">
						<div class="polaris-wp-thumb polaris-wp-thumb-none"></div>
						<span class="polaris-wp-name">默认</span>
					</button>
					<button type="button" class="polaris-wp-card" data-wp="aurora">
						<div class="polaris-wp-thumb" style="background-image:url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=70&auto=format&fit=crop')"></div>
						<span class="polaris-wp-name">极光</span>
					</button>
					<button type="button" class="polaris-wp-card" data-wp="sunset">
						<div class="polaris-wp-thumb" style="background-image:url('https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&q=70&auto=format&fit=crop')"></div>
						<span class="polaris-wp-name">落日</span>
					</button>
					<button type="button" class="polaris-wp-card" data-wp="ocean">
						<div class="polaris-wp-thumb" style="background-image:url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=70&auto=format&fit=crop')"></div>
						<span class="polaris-wp-name">深海</span>
					</button>
					<button type="button" class="polaris-wp-card" data-wp="forest">
						<div class="polaris-wp-thumb" style="background-image:url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=70&auto=format&fit=crop')"></div>
						<span class="polaris-wp-name">森林</span>
					</button>
					<button type="button" class="polaris-wp-card" data-wp="image">
						<div class="polaris-wp-thumb polaris-wp-thumb-custom" id="polaris-wp-custom-thumb"><img class="polaris-wp-custom-img" id="polaris-wp-custom-img" alt="" /><span class="polaris-wp-plus">＋</span></div>
						<span class="polaris-wp-name">自定义</span>
					</button>
				</div>
				<input type="file" id="polaris-wp-file" accept="image/*" style="display:none;" />
			</div>
			<div class="setting-row theme-switch-row">
				<span>主题模式</span>
				<label class="theme-switch"><input type="checkbox" id="polaris-theme-toggle" ${this.theme==="light"?"checked":""}><span class="switch-slider"></span></label>
			</div>
			<div class="setting-section-title">内容管理</div>
			<div class="setting-row" style="display:flex;justify-content:space-between;align-items:center;">
				<span>📝 每日一句文案</span>
				<button type="button" class="btn-secondary polaris-settings-quote" style="padding:6px 12px;font-size:12px;">管理</button>
			</div>
			<div class="setting-row" style="display:flex;justify-content:space-between;align-items:center;">
				<span>🔔 生日 / 纪念日</span>
				<button type="button" class="btn-secondary polaris-settings-milestone" style="padding:6px 12px;font-size:12px;">管理</button>
			</div>
			<div class="setting-row" style="display:flex;justify-content:space-between;align-items:center;">
				<span>🏃 打卡习惯</span>
				<button type="button" class="btn-secondary polaris-settings-habits" style="padding:6px 12px;font-size:12px;">管理</button>
			</div>
			<div class="setting-section-title">日历卡片</div>
			<div class="setting-hint" style="margin:0 0 6px;">控制右侧栏日期卡显示哪些传统信息</div>
			<div class="setting-row theme-switch-row"><span>干支年与生肖（如“丙午马年”）</span><label class="theme-switch"><input type="checkbox" id="polaris-dc-ganzhi"><span class="switch-slider"></span></label></div>
			<div class="setting-row theme-switch-row"><span>每日宜忌</span><label class="theme-switch"><input type="checkbox" id="polaris-dc-yiji"><span class="switch-slider"></span></label></div>
			<div class="setting-row theme-switch-row"><span>每日一签（抽签式）</span><label class="theme-switch"><input type="checkbox" id="polaris-dc-sign"><span class="switch-slider"></span></label></div>
			<div class="setting-hint" style="margin:2px 0 0;">每日限抽一次，抽后当日固定，次日自动重置</div>
			<div class="setting-section-title">右侧栏板块</div>
			<div class="setting-hint" style="margin:0 0 6px;">控制右侧详情栏显示哪些卡片（关闭后立即生效）</div>
			<div class="setting-row theme-switch-row"><span>✅ 今日打卡</span><label class="theme-switch"><input type="checkbox" id="polaris-rp-checkin" ${!this.plugin.pluginData.rightPanel?.hidden?.includes("checkin")?"checked":""}><span class="switch-slider"></span></label></div>
			<div class="setting-row theme-switch-row"><span>🍅 番茄时钟</span><label class="theme-switch"><input type="checkbox" id="polaris-rp-pomo" ${!this.plugin.pluginData.rightPanel?.hidden?.includes("pomo")?"checked":""}><span class="switch-slider"></span></label></div>
			<div class="setting-row theme-switch-row"><span>📝 今日待办</span><label class="theme-switch"><input type="checkbox" id="polaris-rp-todos" ${!this.plugin.pluginData.rightPanel?.hidden?.includes("todos")?"checked":""}><span class="switch-slider"></span></label></div>
			<div class="setting-row theme-switch-row"><span>⚡ 快速记录</span><label class="theme-switch"><input type="checkbox" id="polaris-rp-quicknote" ${!this.plugin.pluginData.rightPanel?.hidden?.includes("quicknote")?"checked":""}><span class="switch-slider"></span></label></div>
			<div class="setting-section-title">复习引擎参数</div>
			<div class="setting-row">
				<div class="setting-label-row"><span>新笔记自动纳入窗口</span><span class="setting-value" id="polaris-review-window-value">30天</span></div>
				<div class="tslider" id="polaris-review-window" data-min="7" data-max="90" data-step="1" data-value="30"></div>
				<div class="setting-hint">最近 7~90 天内新建的笔记会自动进入复习队列</div>
			</div>
			<div class="setting-row">
				<div class="setting-label-row"><span>每日复习队列上限</span><span class="setting-value" id="polaris-review-limit-value">15条</span></div>
				<div class="tslider" id="polaris-review-limit" data-min="5" data-max="30" data-step="1" data-value="15"></div>
				<div class="setting-hint">每天最多安排多少条笔记进入复习，防止堆积</div>
			</div>
			<div class="setting-row">
				<div class="setting-label-row"><span>单条复习估算时长</span><span class="setting-value" id="polaris-review-minutes-value">5分钟</span></div>
				<div class="tslider" id="polaris-review-minutes" data-min="5" data-max="30" data-step="1" data-value="5"></div>
				<div class="setting-hint">用于估算每日复习总耗时（队列上限 × 单条时长）</div>
			</div>
			<div class="form-actions"><button type="button" class="btn-secondary polaris-modal-cancel">取消</button><button type="button" class="btn-primary polaris-settings-apply">应用</button></div>`);
		const modal = this.rootEl!.querySelector(".polaris-modal-box") as HTMLElement;
		const dashboard = this.rootEl!;
		(modal.querySelector(".polaris-modal-cancel") as HTMLElement).onclick = () => { this.closeModal(); this.applyWallpaper(); };
		// 内容管理入口：先关闭设置，再打开对应管理弹窗
		(modal.querySelector(".polaris-settings-quote") as HTMLElement).onclick = () => {
			this.closeModal();
			this.openQuoteManager();
		};
		(modal.querySelector(".polaris-settings-milestone") as HTMLElement).onclick = () => {
			this.closeModal();
			this.openMilestoneManager();
		};
		(modal.querySelector(".polaris-settings-habits") as HTMLElement).onclick = () => {
			this.closeModal();
			this.openHabitManager();
		};
		(modal.querySelector(".polaris-settings-apply") as HTMLElement).onclick = async () => {
			const w = modal.querySelector("#polaris-review-window") as HTMLInputElement;
			const l = modal.querySelector("#polaris-review-limit") as HTMLInputElement;
			const m = modal.querySelector("#polaris-review-minutes") as HTMLInputElement;
			if (this.plugin && w && l && m) {
				this.plugin.pluginData.reviewConfig = {
					newWindowDays: parseInt(w.value) || 30,
					queueLimit: parseInt(l.value) || 15,
					minutesPerItem: parseInt(m.value) || 5,
				};
				await this.plugin.savePluginData();
			}
			// 保存右侧栏板块显隐
			if (this.plugin) {
				const keys = ["checkin","pomo","todos","quicknote"];
				const hidden: string[] = [];
				keys.forEach((k) => {
					const cb = modal.querySelector("#polaris-rp-" + k) as HTMLInputElement;
					if (cb && !cb.checked) hidden.push(k);
				});
				this.plugin.pluginData.rightPanel = { hidden };
				await this.plugin.savePluginData();
			}
			// 保存日历卡片内容开关
			if (this.plugin) {
				const dcG2 = modal.querySelector("#polaris-dc-ganzhi") as HTMLInputElement;
				const dcY2 = modal.querySelector("#polaris-dc-yiji") as HTMLInputElement;
				const dcS2 = modal.querySelector("#polaris-dc-sign") as HTMLInputElement;
				if (dcG2 && dcY2 && dcS2) {
					this.plugin.pluginData.dateCard = {
						ganzhi: dcG2.checked,
						yiJi: dcY2.checked,
						dailySign: dcS2.checked,
					};
					await this.plugin.savePluginData();
				}
			}
			// 保存壁纸选择
			if (this.plugin) {
				this.plugin.pluginData.wallpaper = { type: wpDraft.type, value: wpDraft.value };
				await this.plugin.savePluginData();
			}
			this.applyWallpaper();
			this.closeModal();
			// 复习参数影响主看板（复习队列/时间等），必须重渲染主看板与右侧面板，否则停留在旧参数渲染
			this.renderBoard();
			this.resetDetail();
			this.showToast("设置已应用（复习参数已保存）");
		};
		const themeToggle = modal.querySelector("#polaris-theme-toggle") as HTMLInputElement;
		this.wireCustomSliders(modal);
		const getS = (id: string) => modal.querySelector("#" + id) as HTMLElement;
		const setS = (id: string, val: number) => { const el = getS(id); if (el) { el.dataset.value = String(val); this.renderCustomSlider(el); } };
		const pd = this.plugin?.pluginData;
		// 壁纸选择（草稿预览，应用时才持久化）
		const wpOpts = modal.querySelectorAll<HTMLElement>(".polaris-wp-card");
		const wpFile = modal.querySelector("#polaris-wp-file") as HTMLInputElement;
		let wpDraft: { type: string; value: string } = { type: "none", value: "" };
		const curWp = pd?.wallpaper;
		if (curWp) {
			wpDraft = { type: curWp.type, value: curWp.value || "" };
			if (wpDraft.type !== "image" && wpDraft.type !== "none" && WALLPAPER_PRESETS[wpDraft.value]) wpDraft.type = "preset";
		}
		const paintWp = () => {
			wpOpts.forEach((b) => {
				const t = b.dataset.wp || "";
				const active = wpDraft.type === "preset" ? t === wpDraft.value : (t === wpDraft.type && (t !== "image" || !!wpDraft.value));
				b.classList.toggle("active", active);
			});
			const customThumb = modal.querySelector("#polaris-wp-custom-thumb") as HTMLElement;
			if (customThumb) {
				const plus = customThumb.querySelector(".polaris-wp-plus") as HTMLElement;
				const customImg = customThumb.querySelector(".polaris-wp-custom-img") as HTMLImageElement;
				if (wpDraft.type === "image" && wpDraft.value) {
					if (customImg) { customImg.src = wpDraft.value; customImg.style.setProperty("display", "block") }
					if (plus) plus.style.setProperty("display", "none")
				} else {
					if (customImg) { customImg.removeAttribute("src"); customImg.style.setProperty("display", "none") }
					if (plus) plus.style.setProperty("display", "")
				}
			}
			if (wpDraft.type === "none") dashboard.style.removeProperty("--wallpaper-bg");
			else if (wpDraft.type === "preset") { const bg = WALLPAPER_PRESETS[wpDraft.value]; if (bg) dashboard.style.setProperty("--wallpaper-bg", bg); }
			else if (wpDraft.value) dashboard.style.setProperty("--wallpaper-bg", `url('${wpDraft.value.replace(/'/g, "\\'")}') center / cover no-repeat, linear-gradient(180deg, #14141e 0%, #1a1228 55%, #10101a 100%)`);
		};
		wpOpts.forEach((b) => {
			b.onclick = () => {
				const t = b.dataset.wp || "";
				if (t === "image") { wpFile?.click(); }
				else if (t === "none") { wpDraft = { type: "none", value: "" }; paintWp(); }
				else if (WALLPAPER_PRESETS[t]) { wpDraft = { type: "preset", value: t }; paintWp(); }
				else { wpDraft = { type: t, value: "" }; paintWp(); }
			};
		});
		if (wpFile) wpFile.onchange = () => {
			const f = wpFile.files && wpFile.files[0];
			if (!f) return;
			const reader = new FileReader();
			reader.onload = () => {
				const raw = String(reader.result || "");
				// 压缩到最长边 1920px / JPEG 质量 0.85，避免超大 base64 导致保存与应用失败
				try {
					const img = new Image();
					img.onload = () => {
						const MAX = 1920;
						let w = img.width, h = img.height;
						if (w > MAX || h > MAX) {
							const scale = MAX / Math.max(w, h);
							w = Math.round(w * scale);
							h = Math.round(h * scale);
						}
						const canvas = document.createElement("canvas");
						canvas.width = w; canvas.height = h;
						const ctx = canvas.getContext("2d");
						if (ctx) {
							ctx.drawImage(img, 0, 0, w, h);
							wpDraft = { type: "image", value: canvas.toDataURL("image/jpeg", 0.85) };
						} else {
							wpDraft = { type: "image", value: raw };
						}
						paintWp();
					};
					img.onerror = () => { wpDraft = { type: "image", value: raw }; paintWp(); };
					img.src = raw;
				} catch {
					wpDraft = { type: "image", value: raw };
					paintWp();
				}
			};
			reader.readAsDataURL(f);
		};
		paintWp();
		if (pd?.cardOpacity != null) {
			setS("polaris-opacity-slider", pd.cardOpacity);
			const v = modal.querySelector("#polaris-opacity-value"); if (v) v.textContent = Math.round(pd.cardOpacity * 100) + "%";
		}
		if (pd?.cardBlur != null) {
			setS("polaris-blur-slider", pd.cardBlur);
			const v = modal.querySelector("#polaris-blur-value"); if (v) v.textContent = pd.cardBlur + "px";
		}
		if (themeToggle && pd?.theme) themeToggle.checked = pd.theme === "light";
		// 回填日历卡片内容开关
		const dc = pd?.dateCard || {};
		const dcG = modal.querySelector("#polaris-dc-ganzhi") as HTMLInputElement;
		const dcY = modal.querySelector("#polaris-dc-yiji") as HTMLInputElement;
		const dcS = modal.querySelector("#polaris-dc-sign") as HTMLInputElement;
		if (dcG) dcG.checked = dc.ganzhi === true;
		if (dcY) dcY.checked = dc.yiJi !== false;
		if (dcS) dcS.checked = dc.dailySign === true;
		// 回填复习参数当前值
		const rw = getS("polaris-review-window"), rl = getS("polaris-review-limit"), rm = getS("polaris-review-minutes");
		const rcfg = this.getReviewConfig();
		setS("polaris-review-window", rcfg.newWindowDays);
		let v = modal.querySelector("#polaris-review-window-value"); if (v) v.textContent = rcfg.newWindowDays + "天";
		setS("polaris-review-limit", rcfg.queueLimit);
		v = modal.querySelector("#polaris-review-limit-value"); if (v) v.textContent = rcfg.queueLimit + "条";
		setS("polaris-review-minutes", rcfg.minutesPerItem);
		v = modal.querySelector("#polaris-review-minutes-value"); if (v) v.textContent = rcfg.minutesPerItem + "分钟";
		rw.addEventListener("input", () => { const el = getS("polaris-review-window-value"); if (el) el.textContent = rw.dataset.value + "天"; });
		rl.addEventListener("input", () => { const el = getS("polaris-review-limit-value"); if (el) el.textContent = rl.dataset.value + "条"; });
		rm.addEventListener("input", () => { const el = getS("polaris-review-minutes-value"); if (el) el.textContent = rm.dataset.value + "分钟"; });
		const opEl = getS("polaris-opacity-slider");
		opEl.addEventListener("input", () => { const val = parseFloat(opEl.dataset.value || "0"); dashboard.style.setProperty("--card-opacity", String(val)); const el = getS("polaris-opacity-value"); if (el) el.textContent = Math.round(val*100)+"%"; });
		opEl.addEventListener("change", async () => { if (this.plugin) { this.plugin.pluginData.cardOpacity = parseFloat(opEl.dataset.value || "0"); await this.plugin.savePluginData(); } });
		const blEl = getS("polaris-blur-slider");
		blEl.addEventListener("input", () => { const val = parseFloat(blEl.dataset.value || "0"); dashboard.style.setProperty("--card-blur", val+"px"); const el = getS("polaris-blur-value"); if (el) el.textContent = val+"px"; });
		blEl.addEventListener("change", async () => { if (this.plugin) { this.plugin.pluginData.cardBlur = parseInt(blEl.dataset.value || "0"); await this.plugin.savePluginData(); } });
		themeToggle.onchange = async () => {
			this.theme = themeToggle.checked ? "light" : "dark";
			dashboard.setAttribute("data-theme", this.theme);
			if (this.plugin) { this.plugin.pluginData.theme = this.theme; await this.plugin.savePluginData(); }
			// 主题切换后按新主题重建主看板与右侧面板：
			// 所有在渲染时采样主题的组件（ECharts 圆环、进度条、柱状图、领域分布等）必须重新渲染，
			// 否则会停留在切换前的主题色/断口色，造成“切完主题界面不一致”的问题。
			this.renderBoard();
			this.renderTodayPanel();
			this.showToast(`已切换为${this.theme === "light" ? "浅色" : "深色"}主题`);
		};
	}

	private renderCustomSlider(el: HTMLElement) {
		const min = parseFloat(el.dataset.min || "0"), max = parseFloat(el.dataset.max || "1");
		const v = parseFloat(el.dataset.value || "0");
		const pct = Math.max(0, Math.min(1, (v - min) / (max - min)));
		const thumb = el.querySelector(".tslider-thumb") as HTMLElement;
		if (thumb) thumb.style.setProperty("left", (pct * 100) + "%")
	}
	private wireCustomSliders(modal: HTMLElement) {
		modal.querySelectorAll<HTMLElement>(".tslider").forEach((el) => {
			if (el.dataset.wired) return;
			el.dataset.wired = "1";
			const track = document.createElement("div"); track.className = "tslider-track";
			const thumb = document.createElement("div"); thumb.className = "tslider-thumb";
			el.appendChild(track); el.appendChild(thumb);
			this.renderCustomSlider(el);
			const fromEvent = (clientX: number) => {
				const min = parseFloat(el.dataset.min || "0"), max = parseFloat(el.dataset.max || "1"), step = parseFloat(el.dataset.step || "1");
				const r = track.getBoundingClientRect();
				let p = (clientX - r.left) / Math.max(1, r.width); p = Math.max(0, Math.min(1, p));
				let v = min + p * (max - min);
				v = Math.round(v / step) * step;
				v = Math.max(min, Math.min(max, v));
				el.dataset.value = String(v);
				this.renderCustomSlider(el);
			};
			let down = false;
			el.addEventListener("pointerdown", (e: PointerEvent) => { down = true; el.setPointerCapture(e.pointerId); fromEvent(e.clientX); el.dispatchEvent(new Event("input")); });
			el.addEventListener("pointermove", (e: PointerEvent) => { if (down) { fromEvent(e.clientX); el.dispatchEvent(new Event("input")); } });
			el.addEventListener("pointerup", () => { if (down) { down = false; el.dispatchEvent(new Event("change")); } });
		});
	}
	private showModal(title: string, contentHTML: string) {
		this.rootEl!.querySelector(".polaris-modal-root")?.remove();
		const modalRoot = this.rootEl!.createDiv({ cls: "polaris-modal-root open" });
		modalRoot.innerHTML = `<div class="modal-overlay polaris-modal-overlay"></div><div class="modal-box polaris-modal-box" role="dialog" aria-modal="true"><div class="modal-header"><div class="modal-title">${title}</div><button class="modal-close" aria-label="关闭">✕</button></div>${contentHTML}</div>`;
		(modalRoot.querySelector(".modal-close") as HTMLElement).onclick = () => this.closeModal();
		(modalRoot.querySelector(".polaris-modal-overlay") as HTMLElement).onclick = () => this.closeModal();
		// 通用取消按钮：弹窗内任意 .polaris-modal-cancel 点击即关闭（各弹窗可再单独覆盖）
		(modalRoot.querySelector(".polaris-modal-cancel") as HTMLElement).onclick = () => this.closeModal();
	}

	// 每日一签抽签页：摇签动画 → 揭晓签文 → 解签按钮（关闭后卡片显示结果）
	private openSignModal(drawn: { no: number; luck: string; title: string; poem: string; jie: string }) {
		this.showModal("🎋 每日一签", `
			<div class="polaris-sign-modal" style="text-align:center;padding:8px 6px;">
				<div class="polaris-sign-shake" style="font-size:56px;line-height:1.2;">🎋</div>
				<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">正在摇签…</div>
			</div>`);
		const box = this.rootEl!.querySelector(".polaris-modal-box") as HTMLElement;
		const body = box.querySelector(".polaris-sign-modal") as HTMLElement;
		if (!body) return;
		setTimeout(() => {
			body.innerHTML = `
				<div style="font-size:22px;font-weight:800;color:var(--date-text);letter-spacing:0.5px;">第${drawn.no}签 · ${drawn.luck}</div>
				<div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin-top:4px;">${drawn.title}</div>
				<div style="font-size:13px;color:var(--text-primary);margin-top:8px;line-height:1.9;">${drawn.poem}</div>
				<button type="button" class="polaris-sign-modal-toggle" style="margin-top:12px;cursor:pointer;background:var(--control-bg);border:1px solid var(--border-color);border-radius:8px;padding:8px 20px;font-size:12px;color:var(--text-secondary);">解签</button>
				<div class="polaris-sign-modal-detail" style="display:none;margin-top:12px;color:var(--text-muted);font-size:12px;line-height:1.9;background:rgba(var(--card-bg-rgb),0.5);border-radius:8px;padding:8px 12px;text-align:left;">${drawn.jie}</div>`;
			const toggle = body.querySelector(".polaris-sign-modal-toggle") as HTMLElement;
			const detail = body.querySelector(".polaris-sign-modal-detail") as HTMLElement;
			if (toggle && detail) {
				toggle.onclick = () => {
					const hidden = detail.style.display === "none";
					detail.style.setProperty("display", hidden ? "block" : "none")
					toggle.textContent = hidden ? "收起解签" : "解签";
				};
			}
		}, 750);
	}

	private closeModal() { this.rootEl!.querySelector(".polaris-modal-root")?.remove(); }

	/** 应用背景壁纸（预设/自定义图片/关闭），仅深色主题生效（浅色保持原浅色渐变以保证可读性） */
	private applyWallpaper() {
		const root = this.rootEl;
		if (!root) return;
		const wp = this.plugin?.pluginData?.wallpaper;
		if (!wp || wp.type === "none" || !wp.value) {
			root.style.removeProperty("--wallpaper-bg");
			return;
		}
		let bg: string;
		if (wp.type === "preset" || WALLPAPER_PRESETS[wp.value]) {
			bg = WALLPAPER_PRESETS[wp.value] || "";
			if (!bg) { root.style.removeProperty("--wallpaper-bg"); return; }
		} else {
			const u = String(wp.value).trim();
			if (!u) { root.style.removeProperty("--wallpaper-bg"); return; }
			bg = `url('${u.replace(/'/g, "\\'")}') center / cover no-repeat, linear-gradient(180deg, #14141e 0%, #1a1228 55%, #10101a 100%)`;
		}
		root.style.setProperty("--wallpaper-bg", bg);
	}


	// ==================== 操作 ====================

	private showToast(message: string) {
		new Notice(message, 3000);
		const container = this.rootEl?.querySelector("#polaris-toast-container") as HTMLElement;
		if (!container) return;
		const toast = document.createElement("div");
		toast.className = "toast";
		toast.textContent = message;
		container.appendChild(toast);
		setTimeout(() => { toast.classList.add("toast-out"); toast.addEventListener("animationend", () => toast.remove(), { once: true }); }, 3000);
	}

	// ==================== 功能闭环（真实操作Obsidian） ====================

	private async openDiary() {
		// 直接打开/创建今天的日记（与 Obsidian 日记核心插件同目录同模板），不依赖命令，保证一定有反应
		try {
			const now = new Date();
			const y = now.getFullYear();
			const m = String(now.getMonth() + 1).padStart(2, "0");
			const d = String(now.getDate()).padStart(2, "0");
			const dateStr = `${y}-${m}-${d}`;
			const path = `10-日记/${dateStr}.md`;
			let file = this.app.vault.getAbstractFileByPath(path);
			if (!file) {
				const tplPath = "99-Templates-模板/tpl-wenxbuddy-diary.md";
				let content = "";
				const tpl = this.app.vault.getAbstractFileByPath(tplPath);
				if (tpl) {
					content = await this.app.vault.read(tpl as any);
					const wd = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"][now.getDay()];
					const hh = String(now.getHours()).padStart(2, "0");
					const mm = String(now.getMinutes()).padStart(2, "0");
					content = content
						.replaceAll("{{date:YYYY-MM-DD dddd}}", `${dateStr} ${wd}`)
						.replaceAll("{{title}}", dateStr)
						.replaceAll("{{date}}", dateStr)
						.replaceAll("{{time}}", `${hh}:${mm}`);
				}
				file = await this.app.vault.create(path, content);
			}
			const leaf = this.app.workspace.getLeaf("tab");
			await leaf.openFile(file as any, { active: true });
			this.app.workspace.setActiveLeaf(leaf, { focus: true });
		} catch (e) {
			this.showToast(`今日速记打开失败：${e}`);
		}
	}

	private async createNewNote() {
		this.showModal("新建笔记", `
			<form id="polaris-new-note-form">
				<div class="form-field"><label class="form-label">笔记标题 <span class="required">*</span></label><input class="form-input" name="title" type="text" placeholder="输入笔记标题..." required autofocus></div>
				<div class="form-field"><label class="form-label">内容（可选）</label><textarea class="form-textarea" name="content" placeholder="输入笔记内容..."></textarea></div>
				<div class="form-actions"><button type="button" class="btn-secondary polaris-modal-cancel">取消</button><button type="submit" class="btn-primary">创建并打开</button></div>
			</form>`);
		const modal = this.rootEl!.querySelector(".polaris-modal-box") as HTMLElement;
		(modal.querySelector(".polaris-modal-cancel") as HTMLElement).onclick = () => this.closeModal();
		(modal.querySelector("#polaris-new-note-form") as HTMLFormElement).onsubmit = async (e) => {
			e.preventDefault();
			const form = e.target as HTMLFormElement;
			const fd = new FormData(form);
			const title = (fd.get("title")||"").toString().trim();
			const content = (fd.get("content")||"").toString();
			if (!title) { this.showToast("标题不能为空"); return; }
			const notePath = `00-Inbox-收集箱/${title}.md`;
			try {
				const existing = this.app.vault.getAbstractFileByPath(notePath);
				if (existing) { this.showToast("该标题已存在，请换一个"); return; }
				await this.app.vault.create(notePath, content || `# ${title}\n\n`);
				this.closeModal();
				await this.app.workspace.openLinkText(notePath, "", true);
				this.showToast(`已创建笔记：${title}`);
			} catch (err) {
				this.showToast(`创建失败：${err}`);
			}
		};
	}

	private async openNoteByPath(path: string) {
		try {
			const file = this.app.vault.getAbstractFileByPath(path);
			if (!file) { this.showToast(`文件不存在：${path}`); return; }
			// 在当前活动标签页打开文件
			const leaf = this.app.workspace.getLeaf(false);
			if (leaf) {
				await leaf.openFile(file as any, { active: true });
				// 切换到编辑模式（源码模式）
				const view = leaf.view as any;
				if (view && view.setState) {
					await view.setState({ state: { mode: "source" }, active: true }, {});
				}
				this.showToast(`已打开：${file.name}`);
			} else {
				await this.app.workspace.openLinkText(path, "", false);
				this.showToast(`已打开：${file.name}`);
			}
		} catch (e) {
			this.showToast(`打开失败：${e}`);
		}
	}

	// 根据视图模式获取笔记产出数据（年=最近12个月，月=最近6个月，周=最近7天）
	private getOutputData(mode: string): { label: string; count: number }[] {
		try {
			const files = this.app.vault.getMarkdownFiles();
			const now = new Date();
			const result: { label: string; count: number }[] = [];

			if (mode === "year") {
				// 最近12个月
				for (let i = 11; i >= 0; i--) {
					const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
					result.push({ label: `${d.getMonth() + 1}月`, count: 0 });
				}
				files.forEach((f) => {
					const ctime = f.stat?.ctime;
					if (ctime) {
						const d = new Date(ctime);
						const idx = result.findIndex((m) => {
							const md = new Date(now.getFullYear(), now.getMonth() - (11 - result.indexOf(m)), 1);
							return d.getFullYear() === md.getFullYear() && d.getMonth() === md.getMonth();
						});
						if (idx >= 0) result[idx].count++;
					}
				});
			} else if (mode === "week") {
				// 最近7天
				const dayLabels = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
				for (let i = 6; i >= 0; i--) {
					const d = new Date(now);
					d.setDate(now.getDate() - i);
					result.push({ label: i === 0 ? "今天" : dayLabels[d.getDay()], count: 0 });
				}
				files.forEach((f) => {
					const ctime = f.stat?.ctime;
					if (ctime) {
						const d = new Date(ctime);
						const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
						if (diffDays >= 0 && diffDays < 7) {
							result[6 - diffDays].count++;
						}
					}
				});
			} else {
				// 月视图：最近6个月（默认）
				for (let i = 5; i >= 0; i--) {
					const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
					result.push({ label: `${d.getMonth() + 1}月`, count: 0 });
				}
				files.forEach((f) => {
					const ctime = f.stat?.ctime;
					if (ctime) {
						const d = new Date(ctime);
						const idx = result.findIndex((m) => {
							const md = new Date(now.getFullYear(), now.getMonth() - (5 - result.indexOf(m)), 1);
							return d.getFullYear() === md.getFullYear() && d.getMonth() === md.getMonth();
						});
						if (idx >= 0) result[idx].count++;
					}
				});
			}
			return result;
		} catch (e) {
			return [{ label: "数据", count: 0 }];
		}
	}

	private getVaultStats() {
		try {
			const files = this.app.vault.getMarkdownFiles();
			const total = files.length;

			// PARA分布统计
			const paraFolders = [
				{ key: "projects", name: "Projects 项目", path: "01-Projects-项目", color: "#22c55e" },
				{ key: "areas", name: "Areas 领域", path: "02-Areas-领域", color: "#60a5fa" },
				{ key: "resources", name: "Resources 资源", path: "03-Resources-资源", color: "#fbbf24" },
				{ key: "archives", name: "Archives 归档", path: "04-Archives-归档", color: "#a78bfa" },
			];
			const paraCounts: Record<string, number> = { projects: 0, areas: 0, resources: 0, archives: 0, other: 0 };
			files.forEach((f) => {
				let matched = false;
				for (const p of paraFolders) {
					if (f.path.startsWith(p.path + "/")) {
						paraCounts[p.key]++;
						matched = true;
						break;
					}
				}
				if (!matched) paraCounts.other++;
			});

			// 月度产出统计（最近6个月）
			const now = new Date();
			const monthly: { label: string; count: number }[] = [];
			const monthlyNotes: { name: string; path: string; folder: string; ctime: number }[] = [];
			for (let i = 5; i >= 0; i--) {
				const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
				const label = `${d.getMonth() + 1}月`;
				monthly.push({ label, count: 0 });
			}
			files.forEach((f) => {
				const ctime = f.stat?.ctime;
				if (ctime) {
					const d = new Date(ctime);
					const idx = monthly.findIndex((m) => {
						const md = new Date(now.getFullYear(), now.getMonth() - (5 - monthly.indexOf(m)), 1);
						return d.getFullYear() === md.getFullYear() && d.getMonth() === md.getMonth();
					});
					if (idx >= 0) monthly[idx].count++;
					// 收集本月新增笔记列表（idx===5 为本月）
					if (idx === 5) {
						monthlyNotes.push({ name: f.basename, path: f.path, folder: f.parent?.name || "", ctime });
					}
				}
			});

			// 断链和空笔记统计（真实解析 wiki 链接）
			let emptyNotes = 0;
			let brokenLinks = 0;
			const emptyNoteList: { name: string; path: string }[] = [];
			const brokenNoteMap = new Map<string, { name: string; path: string; targets: string[] }>();
			files.forEach((f) => {
				if (f.stat && f.stat.size < 50) {
					emptyNotes++;
					emptyNoteList.push({ name: f.basename, path: f.path });
				}
				try {
					const cache = this.app.metadataCache.getFileCache(f);
					const links = cache?.links || [];
					for (const l of links) {
						const target = String(l.link || "").split("#")[0].trim();
						if (!target) continue;
						// 跳过外部链接、邮件、网页地址
						if (/^(https?:|mailto:|www\.)/i.test(target)) continue;
						// 附件/图片等资源也可被链接，统一按目标是否存在判定断链
						const dest = this.app.metadataCache.getFirstLinkpathDest(target, f.path);
						if (!dest) {
							brokenLinks++;
							let rec = brokenNoteMap.get(f.path);
							if (!rec) {
								rec = { name: f.basename, path: f.path, targets: [] };
								brokenNoteMap.set(f.path, rec);
							}
							if (!rec.targets.includes(target)) rec.targets.push(target);
						}
					}
				} catch (e) {
					// 单个文件解析失败不影响整体统计
				}
			});
			const brokenNoteList = Array.from(brokenNoteMap.values());

			// 全部笔记（按修改时间倒序，供"总笔记"弹窗使用）
			const noteList = files
				.map((f) => ({ name: f.basename, path: f.path, folder: f.parent?.name || "", mtime: f.stat?.mtime || 0 }))
				.sort((a, b) => b.mtime - a.mtime);

			// 最近修改的笔记（按修改时间排序，取最近8个）
			const recentFiles = files
				.filter((f) => f.stat && f.stat.mtime)
				.sort((a, b) => (b.stat?.mtime || 0) - (a.stat?.mtime || 0))
				.slice(0, 8)
				.map((f) => {
					const mtime = f.stat?.mtime || 0;
					const diff = Date.now() - mtime;
					let timeStr = "";
					if (diff < 60000) timeStr = "刚刚";
					else if (diff < 3600000) timeStr = Math.floor(diff / 60000) + "分钟前";
					else if (diff < 86400000) timeStr = Math.floor(diff / 3600000) + "小时前";
					else timeStr = Math.floor(diff / 86400000) + "天前";
					return { name: f.basename, path: f.path, time: timeStr, folder: f.parent?.name || "" };
				});

			// 星标/书签笔记（支持旧版 Starred 和新版 Bookmarks 插件）
			let starredFiles: { name: string; path: string }[] = [];
			let starSource = "";
			try {
				// 方法1：尝试新版书签插件（Bookmarks）- Obsidian 1.4+
				const bookmarksPlugin = (this.app as any).internalPlugins?.getPluginById("bookmarks");
				if (bookmarksPlugin && bookmarksPlugin.enabled && bookmarksPlugin.instance) {
					const bmItems = bookmarksPlugin.instance.items || bookmarksPlugin.instance.bookmarks || [];
					// 递归遍历树状结构，提取所有文件类型的书签
					const extractFiles = (items: any[]): {name: string; path: string}[] => {
						const result: {name: string; path: string}[] = [];
						for (const item of items) {
							if (item.type === "file" && item.path) {
								const name = item.title || item.path.split("/").pop()?.replace(".md", "") || item.path;
								result.push({ name, path: item.path });
							}
							if (item.children && Array.isArray(item.children)) {
								result.push(...extractFiles(item.children));
							}
						}
						return result;
					};
					starredFiles = extractFiles(bmItems).slice(0, 8);
					starSource = "bookmarks";
				}

				// 方法2：如果书签插件没有，尝试旧版星标插件（Starred）
				if (starredFiles.length === 0) {
					const starredPlugin = (this.app as any).internalPlugins?.getPluginById("starred");
					if (starredPlugin && starredPlugin.enabled && starredPlugin.instance) {
						const sItems = starredPlugin.instance.items || starredPlugin.instance.starred || [];
						starredFiles = sItems
							.filter((item: any) => item.type === "file" && item.path)
							.slice(0, 8)
							.map((item: any) => {
								const name = item.title || item.path.split("/").pop()?.replace(".md", "") || item.path;
								return { name, path: item.path };
							});
						starSource = "starred";
					}
				}
			} catch (e) {
				// 忽略错误
			}

			// 调试信息：如果检测到插件但没有文件，可能是数据结构不对
			// 可以通过控制台查看：console.log("星标调试", {starSource, count: starredFiles.length});

			// 活跃度热力图（最近52周，按天统计笔记创建/修改数）
			const heatmapData = this.calculateHeatmap(files);
			// 添加连续活跃天数
			heatmapData.streak = this.getStreakDays(files);

			// 标签统计（Top 10）
			const tagCounts: Record<string, number> = {};
			files.forEach((f) => {
				try {
					const cache = this.app.metadataCache.getFileCache(f);
					if (cache) {
						// frontmatter 中的标签
						if (cache.frontmatter && cache.frontmatter.tags) {
							const tags = Array.isArray(cache.frontmatter.tags) ? cache.frontmatter.tags : [cache.frontmatter.tags];
							tags.forEach((tag: string) => {
								const cleanTag = String(tag).startsWith("#") ? String(tag).substring(1) : String(tag);
								if (cleanTag) tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
							});
						}
						// 正文中的标签
						if (cache.tags && Array.isArray(cache.tags)) {
							cache.tags.forEach((tagItem: any) => {
								const cleanTag = String(tagItem.tag).startsWith("#") ? String(tagItem.tag).substring(1) : String(tagItem.tag);
								if (cleanTag) tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
							});
						}
					}
				} catch (e) {
					// 忽略单个文件的解析错误
				}
			});

			// 按数量排序，取Top10
			const topTags = Object.entries(tagCounts)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 10)
				.map(([tag, count]) => ({ tag, count }));

			const totalTags = Object.keys(tagCounts).length;

			return {
				total,
				paraCounts,
				paraFolders,
				monthly,
				monthlyNotes,
				emptyNotes,
				emptyNoteList,
				brokenLinks,
				brokenNoteList,
				noteList,
				recentFiles,
				starredFiles,
				starSource,
				heatmapData,
				topTags,
				totalTags,
			};
		} catch (e) {
			// 兜底分支的类型需与正常分支对齐：paraCounts 标注为 Record<string, number>（否则联合类型无法用字符串索引），
			// heatmapData 补齐 streak 字段
			const emptyParaCounts: Record<string, number> = { projects: 0, areas: 0, resources: 0, archives: 0, other: 0 };
			return {
				total: 0,
				paraCounts: emptyParaCounts,
				paraFolders: [],
				monthly: [],
				monthlyNotes: [],
				emptyNotes: 0,
				emptyNoteList: [],
				brokenLinks: 0,
				brokenNoteList: [],
				noteList: [],
				recentFiles: [],
				starredFiles: [],
				starSource: "",
				heatmapData: { weeks: [], months: [], total: 0, maxDay: 0, streak: 0 },
				topTags: [],
				totalTags: 0,
			};
		}
	}

	// 计算活跃度热力图数据
	private calculateHeatmap(files: any[]) {
		try {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			// 找到最近一个周日（作为热力图的最后一列的开始）
			const lastSunday = new Date(today);
			lastSunday.setDate(today.getDate() - today.getDay());

			// 生成53周（52周 + 当前周），每周7天
			const weeks: { date: string; count: number; level: number }[][] = [];
			const dayMap: Record<string, number> = {};

			// 统计每天的笔记数（创建或修改）
			files.forEach((f) => {
				const ctime = f.stat?.ctime;
				const mtime = f.stat?.mtime;
				// 用创建时间统计（也可以用修改时间，这里用创建时间）
				if (ctime) {
					const d = new Date(ctime);
					const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
					dayMap[key] = (dayMap[key] || 0) + 1;
				}
			});

			// 计算颜色等级（0, 1-3, 4-7, 8-12, 13+）
			const getLevel = (count: number): number => {
				if (count === 0) return 0;
				if (count <= 3) return 1;
				if (count <= 7) return 2;
				if (count <= 12) return 3;
				return 4;
			};

			let totalActivity = 0;
			let maxDay = 0;

			// 从52周前开始，到当前周
			for (let w = 52; w >= 0; w--) {
				const weekStart = new Date(lastSunday);
				weekStart.setDate(lastSunday.getDate() - w * 7);
				const week: { date: string; count: number; level: number }[] = [];
				for (let d = 0; d < 7; d++) {
					const day = new Date(weekStart);
					day.setDate(weekStart.getDate() + d);
					const key = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,"0")}-${String(day.getDate()).padStart(2,"0")}`;
					const count = dayMap[key] || 0;
					if (count > 0) {
						totalActivity += count;
						if (count > maxDay) maxDay = count;
					}
					week.push({ date: key, count, level: getLevel(count) });
				}
				weeks.push(week);
			}

			// 月份标签（每4周显示一个月份）
			const months: { label: string; weekIndex: number }[] = [];
			let lastMonth = -1;
			weeks.forEach((week, i) => {
				const firstDay = new Date(week[0].date);
				const month = firstDay.getMonth();
				if (month !== lastMonth && i % 4 === 0) {
					months.push({ label: `${month + 1}月`, weekIndex: i });
					lastMonth = month;
				}
			});

			// streak 由调用方（getVaultStats）用 getStreakDays 赋真值，此处给默认值以满足类型
			return { weeks, months, total: totalActivity, maxDay, streak: 0 };
		} catch (e) {
			return { weeks: [], months: [], total: 0, maxDay: 0, streak: 0 };
		}
	}

	// 获取某一天的详细活动数据
	private getDayActivityDetail(dateStr: string) {
		try {
			const files = this.app.vault.getMarkdownFiles();
			const targetDate = new Date(dateStr + "T00:00:00");
			const dayStart = targetDate.getTime();
			const dayEnd = dayStart + 86400000;

			const modifiedFiles: any[] = [];
			const createdFiles: any[] = [];
			const hourCounts: number[] = new Array(24).fill(0);

			files.forEach((f) => {
				const ctime = f.stat?.ctime || 0;
				const mtime = f.stat?.mtime || 0;
				const isCreated = ctime >= dayStart && ctime < dayEnd;
				const isModified = mtime >= dayStart && mtime < dayEnd;

				if (isCreated) {
					createdFiles.push({
						name: f.basename,
						path: f.path,
						folder: f.parent?.name || "",
						time: new Date(ctime),
						type: "created",
						size: f.stat?.size || 0,
					});
					const hour = new Date(ctime).getHours();
					hourCounts[hour]++;
				} else if (isModified) {
					modifiedFiles.push({
						name: f.basename,
						path: f.path,
						folder: f.parent?.name || "",
						time: new Date(mtime),
						type: "modified",
						size: f.stat?.size || 0,
					});
					const hour = new Date(mtime).getHours();
					hourCounts[hour]++;
				}
			});

			// 按文件夹分组
			const allFiles = [...createdFiles, ...modifiedFiles];
			const byFolder: Record<string, any[]> = {};
			allFiles.forEach((f) => {
				if (!byFolder[f.folder]) byFolder[f.folder] = [];
				byFolder[f.folder].push(f);
			});

			// 按修改时间排序
			Object.keys(byFolder).forEach((folder) => {
				byFolder[folder].sort((a, b) => b.time.getTime() - a.time.getTime());
			});

			// 最活跃时段
			let maxHour = 0;
			let maxCount = 0;
			hourCounts.forEach((count, hour) => {
				if (count > maxCount) {
					maxCount = count;
					maxHour = hour;
				}
			});
			const period = maxHour < 6 ? "凌晨" : maxHour < 12 ? "上午" : maxHour < 14 ? "中午" : maxHour < 18 ? "下午" : "晚上";
			const mostActivePeriod = `${period} ${String(maxHour).padStart(2,"0")}:00-${String(maxHour+1).padStart(2,"0")}:00`;

			// 连续活跃天数
			const streak = this.getStreakDays(files);

			return {
				date: dateStr,
				weekday: ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"][targetDate.getDay()],
				total: allFiles.length,
				created: createdFiles.length,
				modified: modifiedFiles.length,
				byFolder,
				mostActivePeriod,
				mostActiveCount: maxCount,
				streak,
			};
		} catch (e) {
			return {
				date: dateStr,
				weekday: "",
				total: 0,
				created: 0,
				modified: 0,
				byFolder: {},
				mostActivePeriod: "",
				mostActiveCount: 0,
				streak: 0,
			};
		}
	}

	// 计算连续活跃天数
	private getStreakDays(files: any[]): number {
		try {
			const daySet = new Set<string>();
			files.forEach((f) => {
				const ctime = f.stat?.ctime;
				const mtime = f.stat?.mtime;
				if (ctime) {
					const d = new Date(ctime);
					daySet.add(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`);
				}
				if (mtime) {
					const d = new Date(mtime);
					daySet.add(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`);
				}
			});

			let streak = 0;
			const today = new Date();
			for (let i = 0; i < 365; i++) {
				const d = new Date(today);
				d.setDate(today.getDate() - i);
				const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
				if (daySet.has(key)) {
					streak++;
				} else {
					break;
				}
			}
			return streak;
		} catch (e) {
			return 0;
		}
	}

	// 渲染活跃度热力图HTML（方案A：年视图月份标签居中，月视图整月日历，统一样式）
	// 热力图视图切换 + 连续活跃天数（卡片壳工具区）
	private heatmapToolsHTML(heatmapData: any): string {
		const modeButtons = ["month", "year"].map((m) => {
			const label = m === "year" ? "年" : "月";
			const active = this.heatmapMode === m;
			return `<span class="polaris-heatmap-mode" data-mode="${m}" style="padding:4px 12px;border-radius:var(--radius-sm);font-size:11px;cursor:pointer;transition:all 0.15s;${active ? 'background:var(--brand-green);color:#0f0f13;font-weight:600;' : 'color:var(--text-muted);background:rgba(255,255,255,0.05);'}">${label}</span>`;
		}).join("");
		return `<div style="display:flex;gap:4px;background:rgba(255,255,255,0.04);border-radius:var(--radius-md);padding:3px;">${modeButtons}</div>`;
	}

	private renderHeatmap(heatmapData: any, cardW = 0): string {
		// 格子圆角按宽度分级：33%档(<420px) 3px / 50%档(420-800px) 4px / 宽卡(>=800px) 6px，月年视图统一
		if (!heatmapData || !heatmapData.weeks || heatmapData.weeks.length === 0) {
			return '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">暂无活跃度数据</div>';
		}

		const mode = this.heatmapMode;
		// 统一使用品牌淡黄绿色系；无记录格按主题给浅色底（深色=微亮灰，浅色=浅灰，保证格子都有可见底色）
		const isLight = (document.querySelector(".polaris-dashboard") as HTMLElement)?.getAttribute("data-theme") === "light";
		const colors = isLight
			? ["rgba(0,0,0,0.06)", "rgba(200,224,96,0.2)", "rgba(200,224,96,0.4)", "rgba(200,224,96,0.7)", "#c8e060"]
			: ["rgba(255,255,255,0.06)", "rgba(200,224,96,0.2)", "rgba(200,224,96,0.4)", "rgba(200,224,96,0.7)", "#c8e060"];
		const emptyTextColor = isLight ? "rgba(0,0,0,0.35)" : "rgba(240,240,243,0.35)";
		const dayMap: Record<string, any> = {};
		heatmapData.weeks.forEach((week: any) => { week.forEach((day: any) => { dayMap[day.date] = day; }); });
		const now = new Date();
		const pad = (n: number) => String(n).padStart(2, "0");
		const todayStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
		const weekCN = ["日","一","二","三","四","五","六"];

		// 近 90 天活跃天数
		let active90 = 0;
		for (let i = 0; i < 90; i++) {
			const d = new Date(now);
			d.setDate(now.getDate() - i);
			const key = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
			if ((dayMap[key]?.count || 0) > 0) active90++;
		}
		// 本月 / 上月笔记数
		const monthSum = (offset: number) => {
			const y = now.getFullYear(), m = now.getMonth() + offset;
			const daysIn = new Date(y, m + 1, 0).getDate();
			let sum = 0;
			for (let d = 1; d <= daysIn; d++) sum += dayMap[`${y}-${pad(m+1)}-${pad(d)}`]?.count || 0;
			return sum;
		};
		const thisMonthCount = monthSum(0);
		const lastMonthCount = monthSum(-1);
		const diff = thisMonthCount - lastMonthCount;
		const trendText = diff > 0 ? `较上月 +${diff} 篇` : diff < 0 ? `较上月 ${diff} 篇` : "较上月持平";
		const streak = heatmapData?.streak || 0;

		// 汇总徽标行
		const summaryHTML = `
			<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">
				<span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.05);border:1px solid var(--border-color);border-radius:999px;padding:4px 12px;font-size:12px;color:var(--text-secondary);">近 90 天活跃 <b style="color:var(--text-brand);font-weight:700;">${active90}</b> 天</span>
				<span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.05);border:1px solid var(--border-color);border-radius:999px;padding:4px 12px;font-size:12px;color:var(--text-secondary);">连续打卡 <b style="color:var(--text-brand);font-weight:700;">${streak}</b> 天</span>
				<span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.05);border:1px solid var(--border-color);border-radius:999px;padding:4px 12px;font-size:12px;color:var(--text-secondary);">本月笔记 <b style="color:var(--text-brand);font-weight:700;">${thisMonthCount}</b> 篇</span>
			</div>`;

		const legendHtml = colors.map((c) => `<div style="width:12px;height:12px;border-radius:3px;background:${c};"></div>`).join("");
		let bodyHtml = "";

		if (mode === "month") {
			// 月视图：最近 3 个月并排（自然月历，周一开头，格子带日期数字）
			const monthBlocks: string[] = [];
			for (let i = 2; i >= 0; i--) {
				const y = now.getFullYear(), m = now.getMonth() - i;
				const daysInMonth = new Date(y, m + 1, 0).getDate();
				const startWeekday = (new Date(y, m, 1).getDay() + 6) % 7; // 周一开头
				let h = `<div style="flex:0 0 calc((100% - 36px)/3);min-width:0;">`;
				h += `<div style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:6px;">${m+1}月</div>`;
				h += `<div style="display:flex;gap:3px;margin-bottom:4px;">${["一","二","三","四","五","六","日"].map((w)=>`<span style="flex:1;text-align:center;font-size:9px;color:var(--text-muted);">${w}</span>`).join("")}</div>`;
				h += `<div style="display:flex;flex-wrap:wrap;gap:3px;">`;
				for (let b = 0; b < startWeekday; b++) h += `<div style="flex:0 0 calc((100% - 18px)/7);aspect-ratio:1;"></div>`;
				for (let d = 1; d <= daysInMonth; d++) {
					const dateStr = `${y}-${pad(m+1)}-${pad(d)}`;
					const dayData = dayMap[dateStr];
					const level = dayData ? dayData.level : 0;
					const count = dayData ? dayData.count : 0;
					const isToday = dateStr === todayStr;
					const isFuture = new Date(dateStr) > now;
					const tip = count > 0 ? `笔记 ${count} 篇` : "无活动";
					h += `<div class="polaris-heatmap-cell" data-date="${dateStr}" data-count="${count}" title="${dateStr} 周${weekCN[new Date(y,m,d).getDay()]} · ${tip}" style="flex:0 0 calc((100% - 18px)/7);aspect-ratio:1;border-radius:${cardW < 420 ? 3 : cardW < 800 ? 4 : 6}px;background:${colors[level]||colors[0]};display:flex;align-items:center;justify-content:center;font-size:9px;overflow:hidden;color:${level>=3?"#0f0f13":level>0?"var(--text-primary)":emptyTextColor};font-weight:${level>=3?"600":"400"};cursor:pointer;transition:all 0.15s;${isFuture?"opacity:0.35;":""}${isToday?"outline:1px solid var(--brand-green);outline-offset:-1px;":""}">${cardW >= 300 ? d : ""}</div>`;
				}
				h += `</div></div>`;
				monthBlocks.push(h);
			}
			bodyHtml = `<div style="display:flex;flex-wrap:wrap;gap:16px;">${monthBlocks.join("")}</div>`;
		} else {
			// 年视图：全年 12 个月整体概览（色块 + 月度汇总，hover 看单日详情）
			const year = now.getFullYear();
			const ycols = cardW < 480 ? 3 : 4; // 窄卡 3 列×4 行，宽卡 4 列×3 行
			const yearBlocks: string[] = [];
			for (let m = 1; m <= 12; m++) {
				const daysInMonth = new Date(year, m, 0).getDate();
				const startWeekday = (new Date(year, m - 1, 1).getDay() + 6) % 7;
				let mSum = 0;
				for (let d = 1; d <= daysInMonth; d++) mSum += dayMap[`${year}-${pad(m)}-${pad(d)}`]?.count || 0;
				let h = `<div style="flex:0 1 calc((100% - ${(ycols-1)*14}px)/${ycols});min-width:60px;">`;
				h += `<div style="display:flex;align-items:baseline;justify-content:center;gap:4px;margin-bottom:4px;"><span style="font-size:10px;color:var(--text-secondary);font-weight:600;">${m}月</span>${mSum > 0 ? `<span style="font-size:9px;color:var(--text-muted);">${mSum}篇</span>` : ""}</div>`;
				h += `<div style="display:flex;flex-wrap:wrap;gap:2px;">`;
				for (let b = 0; b < startWeekday; b++) h += `<div style="width:calc((100% - 12px)/7);aspect-ratio:1;"></div>`;
				for (let d = 1; d <= daysInMonth; d++) {
					const dateStr = `${year}-${pad(m)}-${pad(d)}`;
					const dayData = dayMap[dateStr];
					const level = dayData ? dayData.level : 0;
					const count = dayData ? dayData.count : 0;
					const isToday = dateStr === todayStr;
					const tip = count > 0 ? `笔记 ${count} 篇` : "无活动";
					h += `<div class="polaris-heatmap-cell" data-date="${dateStr}" data-count="${count}" title="${dateStr} 周${weekCN[new Date(year,m-1,d).getDay()]} · ${tip}" style="width:calc((100% - 12px)/7);aspect-ratio:1;border-radius:${cardW < 420 ? 3 : cardW < 800 ? 4 : 6}px;background:${colors[level]||colors[0]};cursor:pointer;transition:all 0.15s;${isToday?"outline:1px solid var(--brand-green);outline-offset:-1px;":""}"></div>`;
				}
				h += `</div></div>`;
				yearBlocks.push(h);
			}
			bodyHtml = `<div style="display:flex;flex-wrap:wrap;gap:12px;">${yearBlocks.join("")}</div>`;
		}

		return `
			${summaryHTML}
			${bodyHtml}
			<div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding-top:12px;border-top:1px solid var(--border-color);">
				<span style="font-size:12px;color:var(--text-brand);font-weight:600;">${trendText}</span>
				<div style="display:flex;align-items:center;gap:4px;font-size:10px;color:var(--text-muted);"><span>少</span>${legendHtml}<span>多</span></div>
			</div>
		`;
	}

// 渲染番茄时钟卡片
	private renderPomodoro(): string {
		const modeLabels: Record<string, string> = {
			focus: "专注中",
			shortBreak: "短休息",
			longBreak: "长休息",
		};
		const modeColors: Record<string, string> = {
			focus: "#22c55e",
			shortBreak: "#60a5fa",
			longBreak: "#a78bfa",
		};
		const currentColor = modeColors[this.pomodoroMode];
		const totalTime = this.pomodoroMode === "focus" ? this.pomodoroSettings.focus * 60 :
			this.pomodoroMode === "shortBreak" ? this.pomodoroSettings.shortBreak * 60 :
			this.pomodoroSettings.longBreak * 60;
		const progress = totalTime > 0 ? ((totalTime - this.pomodoroTime) / totalTime) * 100 : 0;
		const minutes = Math.floor(this.pomodoroTime / 60);
		const seconds = this.pomodoroTime % 60;
		const timeStr = `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
		const focusHours = Math.floor(this.pomodoroTodayFocus / 3600);
		const focusMinutes = Math.floor((this.pomodoroTodayFocus % 3600) / 60);

		return `<div class="glass-card-static">
			<div class="detail-section-title" style="display:flex;align-items:center;margin-bottom:8px;">
				<span class="rp-strip"></span><span class="rp-title">🍅 番茄时钟</span>
				<div style="display:flex;gap:8px;align-items:center;margin-left:auto;">
					<span class="polaris-pomo-history" style="cursor:pointer;font-size:12px;color:${this.showPomodoroHistory ? 'var(--text-brand)' : 'var(--text-muted)'};display:flex;align-items:center;" title="历史记录">📊</span>
					<span class="polaris-pomo-settings" style="cursor:pointer;font-size:16px;color:var(--text-muted);display:flex;align-items:center;" title="设置">⚙️</span>
				</div>
			</div>
			<div style="text-align:center;">
				<!-- 关联任务显示 -->
				<div class="polaris-pomo-task" style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:6px;padding:6px 8px;background:rgba(255,255,255,0.05);border-radius:8px;cursor:pointer;font-size:12px;color:var(--text-secondary);">
					<span style="font-size:14px;">📌</span>
					<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${this.currentPomodoroTaskTitle}</span>
					<span style="font-size:10px;color:var(--text-muted);">切换</span>
				</div>
				<div style="position:relative;width:120px;height:120px;margin:0 auto 8px;">
					<svg width="120" height="120" viewBox="0 0 120 120" style="transform:rotate(-90deg);">
						<circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
						<circle cx="60" cy="60" r="52" fill="none" stroke="${currentColor}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${2 * Math.PI * 52}" stroke-dashoffset="${2 * Math.PI * 52 * (1 - progress/100)}" style="transition:stroke-dashoffset 1s linear;"/>
					</svg>
					<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:2px;">
						<span style="font-size:10px;color:${currentColor};font-weight:600;letter-spacing:1px;">${modeLabels[this.pomodoroMode]}</span>
							<span style="font-size:26px;font-weight:700;font-variant-numeric:tabular-nums;">${timeStr}</span>
					</div>
				</div>
				<div style="display:flex;gap:8px;justify-content:center;margin-bottom:8px;">
					<button class="polaris-pomo-toggle">${this.pomodoroRunning ? "暂停" : "开始"}</button>
					<button class="polaris-pomo-reset">重置</button>
					<button class="polaris-pomo-skip">跳过</button>
				</div>
				<div style="display:flex;flex-direction:column;align-items:center;gap:3px;margin-bottom:8px;">
					<div style="display:flex;gap:4px;justify-content:center;">
						${[0,1,2,3].map((i) => `<div style="width:8px;height:8px;border-radius:50%;background:${i < this.pomodoroCompletedInCycle ? currentColor : "rgba(255,255,255,0.15)"};"></div>`).join("")}
					</div>
					<span style="font-size:10px;color:var(--text-muted);">本周期 ${this.pomodoroCompletedInCycle + 1}/4</span>
				</div>
				<div style="display:flex;justify-content:space-around;padding-top:8px;border-top:1px solid var(--divider-line);">
					<div style="text-align:center;">
						<div style="font-size:18px;font-weight:700;color:var(--text-brand);">${this.pomodoroTodayCount}</div>
						<div style="font-size:10px;color:var(--text-muted);">今日番茄</div>
					</div>
					<div style="text-align:center;">
						<div style="font-size:18px;font-weight:700;color:#60a5fa;">${focusHours > 0 ? focusHours + "h" : ""}${focusMinutes}m</div>
						<div style="font-size:10px;color:var(--text-muted);">专注时长</div>
					</div>
				</div>
				<!-- 历史记录列表 -->
				${this.showPomodoroHistory ? this.renderPomodoroHistoryList() : ""}
			</div>
		</div>`;
	}

	private renderPomodoroHistoryList(): string {
		const today = new Date().toISOString().split("T")[0];
		const todaySessions = this.pomodoroSessions
			.filter((s) => s.completedAt.startsWith(today) && s.mode === "focus")
			.sort((a, b) => b.completedAt.localeCompare(a.completedAt));

		if (todaySessions.length === 0) {
			return `<div style="margin-top:12px;padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;font-size:12px;color:var(--text-muted);text-align:center;">今日暂无专注记录</div>`;
		}

		return `<div style="margin-top:12px;text-align:left;max-height:200px;overflow-y:auto;">
			<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;font-weight:600;">今日专注记录（${todaySessions.length}次）</div>
			${todaySessions.map((s) => {
				const time = new Date(s.completedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
				const mins = Math.round(s.duration / 60);
				return `<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;margin-bottom:4px;background:rgba(255,255,255,0.03);">
					<span style="font-size:14px;">🍅</span>
					<div style="flex:1;min-width:0;">
						<div style="font-size:12px;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${s.taskTitle}</div>
						<div style="font-size:10px;color:var(--text-muted);">${time} · ${mins}分钟</div>
					</div>
				</div>`;
			}).join("")}
		</div>`;
	}

	// 番茄时钟：开始/暂停
	private togglePomodoro() {
		if (this.pomodoroRunning) {
			this.pausePomodoro();
		} else {
			this.startPomodoro();
		}
	}

	// 番茄时钟：开始
	private startPomodoro() {
		this.pomodoroRunning = true;
		this.pomodoroInterval = setInterval(() => {
			this.pomodoroTime--;
			if (this.pomodoroTime <= 0) {
				this.completePomodoroPhase();
			}
			this.updatePomodoroDisplay();
		}, 1000);
		this.updatePomodoroDisplay();
	}

	// 番茄时钟：暂停
	private pausePomodoro() {
		this.pomodoroRunning = false;
		if (this.pomodoroInterval) {
			clearInterval(this.pomodoroInterval);
			this.pomodoroInterval = null;
		}
		this.updatePomodoroDisplay();
	}

	// 番茄时钟：重置
	private resetPomodoro() {
		this.pausePomodoro();
		this.pomodoroTime = this.getPomodoroTotalTime();
		this.updatePomodoroDisplay();
	}

	// 番茄时钟：跳过当前阶段
	private skipPomodoro() {
		this.completePomodoroPhase();
	}

	// 获取当前模式的总时长
	private getPomodoroTotalTime(): number {
		if (this.pomodoroMode === "focus") return this.pomodoroSettings.focus * 60;
		if (this.pomodoroMode === "shortBreak") return this.pomodoroSettings.shortBreak * 60;
		return this.pomodoroSettings.longBreak * 60;
	}

	// 完成当前阶段
	private completePomodoroPhase() {
		this.pausePomodoro();
		if (this.pomodoroMode === "focus") {
			const focusDuration = this.pomodoroSettings.focus * 60;
			this.pomodoroTodayCount++;
			this.pomodoroTodayFocus += focusDuration;
			this.pomodoroCompletedInCycle++;
			// 记录 session 并持久化
			const session: PomodoroSession = {
				id: "pomo-" + Date.now(),
				taskId: this.currentPomodoroTaskId || undefined,
				taskTitle: this.currentPomodoroTaskTitle,
				duration: focusDuration,
				completedAt: new Date().toISOString(),
				mode: "focus",
			};
			this.pomodoroSessions.push(session);
			this.savePomodoroSessions();
			// 通知
			this.showPomodoroNotification("专注完成！", "休息一下吧 🍅");
			// 每4个专注后长休息
			if (this.pomodoroCompletedInCycle >= 4) {
				this.pomodoroMode = "longBreak";
				this.pomodoroCompletedInCycle = 0;
			} else {
				this.pomodoroMode = "shortBreak";
			}
		} else {
			this.showPomodoroNotification("休息结束！", "开始专注吧 💪");
			this.pomodoroMode = "focus";
		}
		this.pomodoroTime = this.getPomodoroTotalTime();
		this.updatePomodoroDisplay();
	}

	// 番茄时钟通知
	private showPomodoroNotification(title: string, body: string) {
		try {
			// Obsidian 内置通知
			this.showToast(`${title} ${body}`);
			// 系统通知（如果支持）
			if (typeof Notification !== "undefined" && Notification.permission === "granted") {
				new Notification(title, { body });
			}
		} catch (e) {
			// 忽略通知错误
		}
	}

	// 更新番茄时钟显示
	private updatePomodoroDisplay() {
		// 查找左侧边栏的番茄时钟并更新
		const detailPanel = this.rootEl?.querySelector(".polaris-detail-content");
		if (!detailPanel) return;
		const pomoCard = detailPanel.querySelector(".polaris-pomo-card");
		if (pomoCard) {
			// 重新渲染整个卡片
			const wrapper = document.createElement("div");
			wrapper.innerHTML = this.renderPomodoro();
			const newCard = wrapper.firstElementChild;
			if (newCard) {
				newCard.classList.add("polaris-pomo-card");
				pomoCard.replaceWith(newCard);
				this.bindPomodoroEvents(newCard as HTMLElement);
			}
		}
	}

	// 绑定番茄时钟事件
	private bindPomodoroEvents(container: HTMLElement) {
		const toggleBtn = container.querySelector(".polaris-pomo-toggle");
		if (toggleBtn) (toggleBtn as HTMLElement).onclick = () => this.togglePomodoro();
		const resetBtn = container.querySelector(".polaris-pomo-reset");
		if (resetBtn) (resetBtn as HTMLElement).onclick = () => this.resetPomodoro();
		const skipBtn = container.querySelector(".polaris-pomo-skip");
		if (skipBtn) (skipBtn as HTMLElement).onclick = () => this.skipPomodoro();
		const settingsBtn = container.querySelector(".polaris-pomo-settings");
		if (settingsBtn) (settingsBtn as HTMLElement).onclick = () => this.showPomodoroSettings();
		// 选择关联任务
		const taskBtn = container.querySelector(".polaris-pomo-task");
		if (taskBtn) (taskBtn as HTMLElement).onclick = (e) => this.showPomodoroTaskPicker(e);
		// 切换历史记录显示
		const historyBtn = container.querySelector(".polaris-pomo-history");
		if (historyBtn) (historyBtn as HTMLElement).onclick = () => {
			this.showPomodoroHistory = !this.showPomodoroHistory;
			this.renderTodayPanel();
		};
	}

	// 番茄钟：选择关联任务
	private showPomodoroTaskPicker(e: MouseEvent) {
		const menu = new Menu();
		// 未关联任务选项
		menu.addItem((item) => {
			item.setTitle("🚫 不关联任务");
			if (!this.currentPomodoroTaskId) item.setChecked(true);
			item.onClick(() => {
				this.currentPomodoroTaskId = null;
				this.currentPomodoroTaskTitle = "未关联任务";
				this.renderTodayPanel();
				this.showToast("已取消关联任务");
			});
		});
		menu.addSeparator();
		// 进行中的任务列表
		const doingTasks = this.workTasks.filter((t) => t.status === "doing");
		if (doingTasks.length === 0) {
			menu.addItem((item) => {
				item.setTitle("暂无进行中的任务");
				item.setDisabled(true);
			});
		} else {
			doingTasks.forEach((task) => {
				menu.addItem((item) => {
					item.setTitle(`📌 ${task.title}`);
					if (this.currentPomodoroTaskId === task.id) item.setChecked(true);
					item.onClick(() => {
						this.currentPomodoroTaskId = task.id;
						this.currentPomodoroTaskTitle = task.title;
						this.renderTodayPanel();
						this.showToast(`已关联任务：${task.title}`);
					});
				});
			});
		}
		menu.showAtMouseEvent(e);
	}

	// 番茄时钟设置
	private showPomodoroSettings() {
		const modal = document.createElement("div");
		modal.className = "polaris-modal";
		modal.setAttribute("style", "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;");
		modal.innerHTML = `
			<div class="polaris-modal-box" style="background:var(--background-primary);border-radius:12px;padding:24px;max-width:360px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
				<div style="font-size:18px;font-weight:700;margin-bottom:16px;">🍅 番茄时钟设置</div>
				<div style="margin-bottom:12px;">
					<div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;">专注时长（分钟）</div>
					<div style="display:flex;gap:6px;">
						${[15,25,50].map((m) => `<button class="polaris-pomo-preset" data-value="${m}" data-field="focus" style="flex:1;padding:6px;border-radius:6px;border:1px solid ${this.pomodoroSettings.focus===m?"var(--brand-green)":"var(--background-modifier-border)"};background:${this.pomodoroSettings.focus===m?"var(--brand-green)":"transparent"};color:${this.pomodoroSettings.focus===m?"white":"var(--text-secondary)"};cursor:pointer;font-size:12px;">${m}分钟</button>`).join("")}
					</div>
				</div>
				<div style="margin-bottom:12px;">
					<div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;">短休息（分钟）</div>
					<div style="display:flex;gap:6px;">
						${[3,5,10].map((m) => `<button class="polaris-pomo-preset" data-value="${m}" data-field="shortBreak" style="flex:1;padding:6px;border-radius:6px;border:1px solid ${this.pomodoroSettings.shortBreak===m?"var(--brand-green)":"var(--background-modifier-border)"};background:${this.pomodoroSettings.shortBreak===m?"var(--brand-green)":"transparent"};color:${this.pomodoroSettings.shortBreak===m?"white":"var(--text-secondary)"};cursor:pointer;font-size:12px;">${m}分钟</button>`).join("")}
					</div>
				</div>
				<div style="margin-bottom:16px;">
					<div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;">长休息（分钟）</div>
					<div style="display:flex;gap:6px;">
						${[10,15,20].map((m) => `<button class="polaris-pomo-preset" data-value="${m}" data-field="longBreak" style="flex:1;padding:6px;border-radius:6px;border:1px solid ${this.pomodoroSettings.longBreak===m?"var(--brand-green)":"var(--background-modifier-border)"};background:${this.pomodoroSettings.longBreak===m?"var(--brand-green)":"transparent"};color:${this.pomodoroSettings.longBreak===m?"white":"var(--text-secondary)"};cursor:pointer;font-size:12px;">${m}分钟</button>`).join("")}
					</div>
				</div>
				<div style="display:flex;gap:12px;justify-content:flex-end;">
					<button class="polaris-pomo-close" style="padding:8px 20px;border-radius:8px;border:1px solid var(--background-modifier-border);background:transparent;color:var(--text-secondary);cursor:pointer;font-size:13px;">关闭</button>
				</div>
			</div>`;
		document.body.appendChild(modal);
		const close = () => { modal.remove(); };
		modal.querySelector(".polaris-pomo-close")?.addEventListener("click", close);
		modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
		modal.querySelectorAll(".polaris-pomo-preset").forEach((btn) => {
			(btn as HTMLElement).onclick = () => {
				const field = (btn as HTMLElement).dataset.field as keyof typeof this.pomodoroSettings;
				const value = parseInt((btn as HTMLElement).dataset.value || "25");
				this.pomodoroSettings[field] = value;
				if (this.pomodoroMode === field) {
					this.resetPomodoro();
				}
				close();
				this.showToast(`已设置为 ${value} 分钟`);
				this.updatePomodoroDisplay();
			};
		});
	}

	// 农历数据表（1900-2100年）
	private lunarInfo = [
		0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
		0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
		0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
		0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
		0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
		0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
		0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
		0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
		0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
		0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
		0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
		0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
		0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
		0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
		0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
		0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
		0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
		0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
		0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
		0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
		0x0d520
	];

	// 天干地支
	private heavenlyStems = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
	private earthlyBranches = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
	private zodiacAnimals = ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];
	private lunarMonths = ["正","二","三","四","五","六","七","八","九","十","冬","腊"];
	private lunarDays = ["初一","初二","初三","初四","初五","初六","初七","初八","初九","初十",
		"十一","十二","十三","十四","十五","十六","十七","十八","十九","二十",
		"廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"];

	// 农历节日
	private lunarFestivals: Record<string, string> = {
		"01-01": "春节", "01-15": "元宵节", "02-02": "龙抬头", "05-05": "端午节",
		"07-07": "七夕", "07-15": "中元节", "08-15": "中秋节", "09-09": "重阳节",
		"12-08": "腊八节", "12-23": "小年", "12-30": "除夕"
	};

	// 公历节日
	private solarFestivals: Record<string, string> = {
		"01-01": "元旦", "02-14": "情人节", "03-08": "妇女节", "03-12": "植树节",
		"04-01": "愚人节", "05-01": "劳动节", "05-04": "青年节", "06-01": "儿童节",
		"07-01": "建党节", "08-01": "建军节", "09-10": "教师节", "10-01": "国庆节",
		"12-24": "平安夜", "12-25": "圣诞节"
	};

	// 获取某年农历总天数
	private getLunarYearDays(year: number): number {
		let sum = 348;
		for (let i = 0x8000; i > 0x8; i >>= 1) {
			sum += (this.lunarInfo[year - 1900] & i) ? 1 : 0;
		}
		return sum + this.getLeapDays(year);
	}

	// 获取闰月天数
	private getLeapDays(year: number): number {
		if (this.getLeapMonth(year)) {
			return (this.lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
		}
		return 0;
	}

	// 获取闰月月份（0表示没有闰月）
	private getLeapMonth(year: number): number {
		return this.lunarInfo[year - 1900] & 0xf;
	}

	// 获取农历某月天数
	private getLunarMonthDays(year: number, month: number): number {
		return (this.lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
	}

	// 公历转农历
	private solarToLunar(year: number, month: number, day: number): {
		lunarYear: number; lunarMonth: number; lunarDay: number;
		isLeap: boolean; lunarMonthName: string; lunarDayName: string;
		ganzhiYear: string; zodiac: string; festival: string;
	} {
		const baseDate = new Date(1900, 0, 31);
		const objDate = new Date(year, month - 1, day);
		let offset = Math.floor((objDate.getTime() - baseDate.getTime()) / 86400000);

		let lunarYear = 1900;
		let temp = 0;
		for (; lunarYear < 2101 && offset > 0; lunarYear++) {
			temp = this.getLunarYearDays(lunarYear);
			offset -= temp;
		}
		if (offset < 0) {
			offset += temp;
			lunarYear--;
		}

		const leap = this.getLeapMonth(lunarYear);
		let isLeap = false;
		let lunarMonth = 1;
		for (; lunarMonth < 13 && offset > 0; lunarMonth++) {
			if (leap > 0 && lunarMonth === leap + 1 && !isLeap) {
				--lunarMonth;
				isLeap = true;
				temp = this.getLeapDays(lunarYear);
			} else {
				temp = this.getLunarMonthDays(lunarYear, lunarMonth);
			}
			if (isLeap && lunarMonth === leap + 1) isLeap = false;
			offset -= temp;
		}
		if (offset === 0 && leap > 0 && lunarMonth === leap + 1) {
			if (isLeap) {
				isLeap = false;
			} else {
				isLeap = true;
				--lunarMonth;
			}
		}
		if (offset < 0) {
			offset += temp;
			--lunarMonth;
		}
		const lunarDay = offset + 1;

		// 干支纪年
		const ganzhiYear = this.heavenlyStems[(lunarYear - 4) % 10] + this.earthlyBranches[(lunarYear - 4) % 12];
		const zodiac = this.zodiacAnimals[(lunarYear - 4) % 12];

		// 节日
		const solarKey = `${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
		const lunarKey = `${String(lunarMonth).padStart(2,"0")}-${String(lunarDay).padStart(2,"0")}`;
		let festival = this.solarFestivals[solarKey] || this.lunarFestivals[lunarKey] || "";
		// 除夕特殊处理
		if (lunarMonth === 12 && lunarDay === this.getLunarMonthDays(lunarYear, 12)) {
			festival = "除夕";
		}

		return {
			lunarYear, lunarMonth, lunarDay, isLeap,
			lunarMonthName: (isLeap ? "闰" : "") + this.lunarMonths[lunarMonth - 1] + "月",
			lunarDayName: this.lunarDays[lunarDay - 1],
			ganzhiYear, zodiac, festival
		};
	}

	// 农历月日 → 当年公历日期（反查；不处理闰月）
	private lunarToSolar(year: number, lunarMonth: number, lunarDay: number): Date | null {
		for (let d = new Date(year, 0, 1); d.getFullYear() === year; d.setDate(d.getDate() + 1)) {
			const l = this.solarToLunar(d.getFullYear(), d.getMonth() + 1, d.getDate());
			if (l.lunarMonth === lunarMonth && l.lunarDay === lunarDay && !l.isLeap) {
				return new Date(d);
			}
		}
		return null;
	}

	// 除夕 = 当年腊月最后一天
	private lunarNewYearsEve(year: number): Date | null {
		let last: Date | null = null;
		for (let d = new Date(year, 11, 1); d.getMonth() === 11; d.setDate(d.getDate() + 1)) {
			const l = this.solarToLunar(d.getFullYear(), d.getMonth() + 1, d.getDate());
			if (l.lunarMonth === 12) last = new Date(d);
		}
		return last;
	}

	// 下一个最近的事件（内置节日 + 自定义纪念日），返回文案与天数
	private getNextMilestone(): { text: string } | null {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const year = today.getFullYear();
		type Cand = { name: string; d: Date; prio: number };
		const cands: Cand[] = [];
		const pushSolar = (m: number, d: number, name: string, prio: number) => {
			cands.push({ name, d: new Date(year, m - 1, d), prio });
		};
		const pushLunar = (m: number, d: number, name: string, prio: number) => {
			const dt = this.lunarToSolar(year, m, d);
			if (dt) cands.push({ name, d: dt, prio });
		};
		// 内置公历节日
		for (const [k, name] of Object.entries(this.solarFestivals)) {
			pushSolar(parseInt(k.slice(0, 2)), parseInt(k.slice(3)), name, 2);
		}
		// 内置农历节日（除夕单独处理）
		for (const [k, name] of Object.entries(this.lunarFestivals)) {
			if (k === "12-30") continue;
			pushLunar(parseInt(k.slice(0, 2)), parseInt(k.slice(3)), name, 2);
		}
		const eve = this.lunarNewYearsEve(year);
		if (eve) cands.push({ name: "除夕", d: eve, prio: 2 });
		// 自定义纪念日/生日（优先级更高）
		for (const m of this.userMilestones) {
			if (m.lunar) {
				const dt = this.lunarToSolar(year, m.month, m.day);
				if (dt) cands.push({ name: m.name, d: dt, prio: 1 });
			} else {
				pushSolar(m.month, m.day, m.name, 1);
			}
		}
		// 每个候选取「今天之后的最近一次」（今年已过则取明年）
		let best: { name: string; days: number; prio: number } | null = null;
		for (const c of cands) {
			let d = new Date(c.d);
			d.setHours(0, 0, 0, 0);
			if (d < today) {
				d = new Date(c.d);
				d.setFullYear(year + 1);
				d.setHours(0, 0, 0, 0);
			}
			const days = Math.round((d.getTime() - today.getTime()) / 86400000);
			if (days < 0) continue;
			if (!best || days < best.days || (days === best.days && c.prio < best.prio)) {
				best = { name: c.name, days, prio: c.prio };
			}
		}
		if (!best) return null;
		if (best.days === 0) return { text: `今天是${best.name}` };
		if (best.days === 1) return { text: `明天是${best.name}` };
		return { text: `距${best.name}还有 ${best.days} 天` };
	}

	// 每日一句文案库（自定义优先，为空回退内置）
	private userQuotes: string[] = [];
	// 自定义纪念日/生日（lunar=true 表示农历）
	private userMilestones: { name: string; month: number; day: number; lunar?: boolean }[] = [];
	// 每日一签抽签记录（日期 -> 签号，当天锁定）
	private dailySignRecord: Record<string, number> = {};
	private signDrawing = false;
	private dailyQuotes: { t: string; a?: string }[] = [
		{ t: "山水一程，三生有幸相逢。" },
		{ t: "愿你出走半生，归来仍是少年。" },
		{ t: "星光不问赶路人，时光不负有心人。" },
		{ t: "生活明朗，万物可爱，人间值得，未来可期。" },
		{ t: "你要悄悄拔尖，然后惊艳所有人。" },
		{ t: "愿你眼里有光，心中有爱，脚下有路。" },
		{ t: "所有的努力，都不会被辜负。" },
		{ t: "慢慢来，比较快。" },
		{ t: "做自己的太阳，无需凭借谁的光。" },
		{ t: "愿你成为自己喜欢的样子。" },
		{ t: "不乱于心，不困于情，不畏将来，不念过往。", a: "丰子恺" },
		{ t: "生如逆旅，一苇以航。" },
		{ t: "愿有岁月可回首，且以深情共白头。" },
		{ t: "心之所向，素履以往。" },
		{ t: "你若盛开，蝴蝶自来。" },
		{ t: "以梦为马，不负韶华。" },
		{ t: "愿你遍历山河，觉得人间值得。" },
		{ t: "所有的美好，都值得等待。" },
		{ t: "保持热爱，奔赴山海。" },
		{ t: "愿你所有的快乐，都无需假装。" },
		{ t: "此生尽兴，赤诚善良。" },
		{ t: "愿你走出半生，归来仍是少年。" },
		{ t: "生活不止眼前的苟且，还有诗和远方。", a: "高晓松" },
		{ t: "愿你被这个世界温柔以待。" },
		{ t: "一切都是最好的安排。" },
		{ t: "愿你眼中有星辰，心中有山海。" },
		{ t: "从此山高水长，别来无恙。" },
		{ t: "愿你余生不悔，旧路不归。" },
		{ t: "岁月静好，现世安稳。" },
		{ t: "愿你所有的等待，都能如期而至。" },
		{ t: "设计不是让它看起来好看，而是让它用起来好用。", a: "迪特·拉姆斯（Dieter Rams）" },
		{ t: "少即是多。", a: "密斯·凡·德·罗" },
		{ t: "简单是终极的复杂。", a: "列奥纳多·达·芬奇" },
		{ t: "我并没有失败，我只是发现了一万种行不通的方法。", a: "托马斯·爱迪生" },
		{ t: "种一棵树最好的时间是十年前，其次是现在。", a: "丹比萨·莫约" },
		{ t: "真正的发现之旅不在于寻找新大陆，而在于用新的眼光看世界。", a: "马塞尔·普鲁斯特" },
		{ t: "求知若饥，虚心若愚。", a: "史蒂夫·乔布斯" },
	];

	// 每日一签（传统文化签辞库：轻趣味，正面导向，非占卜建议）
	private dailySigns: { luck: string; title: string; poem: string; jie: string }[] = [
		{ luck: "上上签", title: "春风得意", poem: "春风得意马蹄疾，一日看尽长安花。", jie: "诸事顺遂，宜趁势推进手头计划，别错过眼前的好时机。" },
		{ luck: "上上签", title: "旭日东升", poem: "一轮红日出东方，前程万里照康庄。", jie: "运势上行，新开始皆有助力，放手去做。" },
		{ luck: "上签", title: "竿头日进", poem: "百尺竿头更进一步，精进不怠自成器。", jie: "稳步上升期，持续投入必有回报。" },
		{ luck: "上签", title: "柳暗花明", poem: "山重水复疑无路，柳暗花明又一村。", jie: "转机将至，眼前的困局即将打开新局面。" },
		{ luck: "上签", title: "鸿运当头", poem: "鸿雁高飞传喜讯，顺风顺水正当时。", jie: "贵人助力，事半功倍，宜多与人协作。" },
		{ luck: "上签", title: "功不唐捐", poem: "日拱一卒无有尽，功不唐捐终入海。", jie: "积累正在见效，每一分付出都不会白费。" },
		{ luck: "上签", title: "鹏程万里", poem: "大鹏一日同风起，扶摇直上九万里。", jie: "志向远大者得偿所愿，宜大胆立目标。" },
		{ luck: "上签", title: "如鱼得水", poem: "鱼跃龙门水自开，机逢其时莫徘徊。", jie: "把握当下机遇，果断行动胜于犹豫。" },
		{ luck: "上签", title: "否极泰来", poem: "守得云开见月明，否极泰来运自通。", jie: "低谷将尽，好运渐至，保持信心。" },
		{ luck: "上签", title: "月满西楼", poem: "花好月圆人长久，万事顺意心自宽。", jie: "和顺圆满，宜经营关系、修复旧事。" },
		{ luck: "中签", title: "厚积薄发", poem: "十年磨一剑，霜刃未曾试。", jie: "蓄力阶段，耐心打磨，勿急于求成。" },
		{ luck: "中签", title: "静待花开", poem: "桃李不言自成蹊，静待花开终有时。", jie: "时机未到，耐心守候，戒焦躁。" },
		{ luck: "中签", title: "稳中求进", poem: "欲速则不达，见小利则大事不成。", jie: "循序渐进，稳扎稳打是今天的主线。" },
		{ luck: "中签", title: "曲径通幽", poem: "曲径通幽处，禅房花木深。", jie: "迂回也能到达，不必硬碰硬。" },
		{ luck: "中签", title: "细水长流", poem: "不积跬步无以至千里，细水长流可穿石。", jie: "贵在坚持，把小事做扎实自会成事。" },
		{ luck: "中签", title: "量力而行", poem: "力所不及莫强求，量力而行方长久。", jie: "评估好能力边界，合理安排精力。" },
		{ luck: "中签", title: "韬光养晦", poem: "潜龙在渊待时飞，韬光养晦非无为。", jie: "沉淀期宜学习充电，静待发力时机。" },
		{ luck: "中签", title: "拨云见日", poem: "拨开云雾见青天，守得云开月自圆。", jie: "疑虑渐消，方向渐明，可再确认一次计划。" },
		{ luck: "中签", title: "他山之石", poem: "他山之石，可以攻玉。", jie: "善用外部资源与他人经验，事半功倍。" },
		{ luck: "中签", title: "滴水穿石", poem: "滴水穿石非一日，铁杵成针贵有恒。", jie: "坚持既定方向，量变终将带来质变。" },
		{ luck: "中平签", title: "稍安勿躁", poem: "心急吃不了热豆腐，稍安勿躁待时机。", jie: "当下宜守不宜攻，静下来再决定。" },
		{ luck: "中平签", title: "自省自修", poem: "吾日三省吾身，知己之短补己之短。", jie: "宜复盘调整，与其冒进不如先修正。" },
		{ luck: "中平签", title: "三思后行", poem: "谋定而后动，三思而后行。", jie: "重大决定多权衡，避免冲动行事。" },
		{ luck: "中平签", title: "塞翁失马", poem: "塞翁失马，焉知非福。", jie: "得失难料，用平常心看待今日起伏。" },
		{ luck: "中平签", title: "张弛有度", poem: "张而不弛，文武弗能也。", jie: "劳逸结合，注意节奏与休息的平衡。" },
		{ luck: "中平签", title: "守正出奇", poem: "守正出奇，行稳致远。", jie: "守住本分，再谋创新，稳字当头。" },
		{ luck: "中平签", title: "循序渐进", poem: "不登高山不知天之高，不临深溪不知地之厚。", jie: "脚踏实地，一步一步来，不贪快。" },
		{ luck: "中平签", title: "和而不同", poem: "君子和而不同，求同存异共谋事。", jie: "协作中保持开放，包容分歧才有合力。" },
		{ luck: "中平签", title: "潜龙勿用", poem: "潜龙勿用，阳气潜藏。", jie: "蛰伏蓄势期，低调积累，不宜张扬。" },
		{ luck: "中平签", title: "退一步想", poem: "退一步海阔天空，让三分心平气和。", jie: "遇争执宜退让，转圜余地更大。" },
	];

	// 获取每日一签（按日期稳定轮换）
	private getDailySign(dateStr: string): { no: number; luck: string; title: string; poem: string; jie: string } {
		let hash = 0;
		for (let i = 0; i < dateStr.length; i++) {
			hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
			hash |= 0;
		}
		const sign = this.dailySigns[Math.abs(hash) % this.dailySigns.length];
		return { no: (Math.abs(hash) % this.dailySigns.length) + 1, ...sign };
	}

	// 获取每日一句（根据日期随机但稳定）
	private getDailyQuote(dateStr: string): { t: string; a?: string } {
		let hash = 0;
		for (let i = 0; i < dateStr.length; i++) {
			hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
			hash |= 0;
		}
		if (this.userQuotes.length > 0) {
			const q = this.userQuotes[Math.abs(hash) % this.userQuotes.length];
			return { t: q };
		}
		const index = Math.abs(hash) % this.dailyQuotes.length;
		return this.dailyQuotes[index];
	}

	// 保存自定义文案库到 data.json
	private async saveQuotes() {
		if (!this.plugin) return;
		this.plugin.pluginData.dailyQuotes = JSON.parse(JSON.stringify(this.userQuotes));
		await this.plugin.savePluginData();
	}

	// 每日一句文案库管理弹窗
	private openQuoteManager() {
		const usingCustom = this.userQuotes.length > 0;
		const rows = this.userQuotes.map((q) => `
			<div style="display:flex;gap:8px;margin-bottom:8px;align-items:center;">
				<input class="polaris-q-input" value="${q.replace(/"/g, "&quot;")}" style="flex:1;"/>
				<button class="polaris-q-del" style="background:rgba(239,68,68,0.15);border:none;border-radius:6px;padding:6px 8px;color:#f87171;font-size:12px;cursor:pointer;">删除</button>
			</div>`).join("");
		const content = `
			<div style="padding:4px 24px 20px;">
				<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${usingCustom ? `当前使用自定义文案库（${this.userQuotes.length} 条），按日期稳定轮换` : "当前使用内置文案（部分含出处署名）；添加自定义文案后自动切换"}</div>
				<div id="polaris-q-list" style="max-height:46vh;overflow-y:auto;">${rows}</div>
				<button class="polaris-q-add" style="width:100%;margin-top:8px;padding:8px;background:rgba(34,197,94,0.1);border:1px dashed rgba(34,197,94,0.4);border-radius:8px;color:#22c55e;font-size:13px;cursor:pointer;">＋ 添加一条</button>
				<div style="display:flex;gap:8px;margin-top:12px;">
					<button class="polaris-q-save btn-primary" style="flex:1;">保存</button>
					<button class="polaris-q-reset" style="flex:1;background:transparent;border:1px solid rgba(255,255,255,0.15);border-radius:12px;color:var(--text-secondary);font-size:13px;cursor:pointer;padding:8px 0;">重置为内置</button>
				</div>
			</div>`;
		this.showModal(`✎ 每日一句管理`, content);
		const modal = document.querySelector(".modal-box.polaris-modal-box") as HTMLElement;
		if (!modal) return;
		const bindDel = () => {
			modal.querySelectorAll(".polaris-q-del").forEach((el) => {
				(el as HTMLElement).onclick = () => {
					const row = (el as HTMLElement).closest("div");
					if (row && row.parentElement === modal.querySelector("#polaris-q-list")) row.remove();
				};
			});
		};
		bindDel();
		(modal.querySelector(".polaris-q-add") as HTMLElement).onclick = () => {
			const list = modal.querySelector("#polaris-q-list") as HTMLElement;
			if (!list) return;
			list.insertAdjacentHTML("beforeend", `
				<div style="display:flex;gap:8px;margin-bottom:8px;align-items:center;">
					<input class="polaris-q-input" style="flex:1;"/>
					<button class="polaris-q-del" style="background:rgba(239,68,68,0.15);border:none;border-radius:6px;padding:6px 8px;color:#f87171;font-size:12px;cursor:pointer;">删除</button>
				</div>`);
			bindDel();
			const last = list.lastElementChild?.querySelector("input");
			if (last) (last as HTMLInputElement).focus();
		};
		(modal.querySelector(".polaris-q-save") as HTMLElement).onclick = async () => {
			const inputs = Array.from(modal.querySelectorAll("#polaris-q-list .polaris-q-input")) as HTMLInputElement[];
			this.userQuotes = inputs.map((i) => i.value.trim()).filter((v) => v.length > 0);
			await this.saveQuotes();
			this.closeModal();
			this.refreshRightPanel();
			this.showToast(`文案库已保存：${this.userQuotes.length} 条${this.userQuotes.length === 0 ? "（将使用内置文案）" : ""}`);
		};
		(modal.querySelector(".polaris-q-reset") as HTMLElement).onclick = async () => {
			this.userQuotes = [];
			await this.saveQuotes();
			this.closeModal();
			this.refreshRightPanel();
			this.showToast("已重置为内置文案库");
		};
	}

	// 保存自定义纪念日到 data.json
	private async saveMilestones() {
		if (!this.plugin) return;
		this.plugin.pluginData.milestones = JSON.parse(JSON.stringify(this.userMilestones));
		await this.plugin.savePluginData();
	}

	// 生日/纪念日管理弹窗
	private openMilestoneManager() {
		const rows = this.userMilestones.map((m) => `
			<div data-idx="${m.name.replace(/"/g, "&quot;")}-${m.month}-${m.day}-${m.lunar ? 1 : 0}" style="display:flex;gap:6px;margin-bottom:8px;align-items:center;flex-wrap:wrap;">
				<input class="polaris-m-name" value="${m.name.replace(/"/g, "&quot;")}" placeholder="名称（如：妈妈生日）" style="width:118px;"/>
				<input class="polaris-m-month" type="number" min="1" max="12" value="${m.month}" placeholder="月" style="width:52px;"/>
				<span style="font-size:12px;color:var(--text-muted);">月</span>
				<input class="polaris-m-day" type="number" min="1" max="31" value="${m.day}" placeholder="日" style="width:52px;"/>
				<span style="font-size:12px;color:var(--text-muted);">日</span>
				<label style="display:flex;align-items:center;gap:3px;font-size:11px;color:var(--text-muted);cursor:pointer;margin-left:2px;">
					<input class="polaris-m-lunar" type="checkbox" ${m.lunar ? "checked" : ""}/>农历
				</label>
				<button class="polaris-m-del" style="background:rgba(239,68,68,0.15);border:none;border-radius:6px;padding:6px 8px;color:#f87171;font-size:12px;cursor:pointer;">删除</button>
			</div>`).join("");
		const content = `
			<div style="padding:4px 24px 20px;">
				<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">记录生日、纪念日等日期，右侧卡片会显示「距××还有 N 天」；勾选「农历」则按农历日期计算（如农历生日）。</div>
				<div id="polaris-m-list" style="max-height:42vh;overflow-y:auto;">${rows}</div>
				<button class="polaris-m-add" style="width:100%;margin-top:8px;padding:8px;background:rgba(34,197,94,0.1);border:1px dashed rgba(34,197,94,0.4);border-radius:8px;color:#22c55e;font-size:13px;cursor:pointer;">＋ 添加一个</button>
				<div style="display:flex;gap:8px;margin-top:12px;">
					<button class="polaris-m-save btn-primary" style="flex:1;">保存</button>
				</div>
			</div>`;
		this.showModal(`🔔 生日/纪念日管理`, content);
		const modal = document.querySelector(".modal-box.polaris-modal-box") as HTMLElement;
		if (!modal) return;
		const bindDel = () => {
			modal.querySelectorAll(".polaris-m-del").forEach((el) => {
				(el as HTMLElement).onclick = () => {
					const row = (el as HTMLElement).closest("div[data-idx]");
					if (row && row.parentElement === modal.querySelector("#polaris-m-list")) row.remove();
				};
			});
		};
		bindDel();
		(modal.querySelector(".polaris-m-add") as HTMLElement).onclick = () => {
			const list = modal.querySelector("#polaris-m-list") as HTMLElement;
			if (!list) return;
			list.insertAdjacentHTML("beforeend", `
				<div data-idx="new" style="display:flex;gap:6px;margin-bottom:8px;align-items:center;flex-wrap:wrap;">
					<input class="polaris-m-name" placeholder="名称（如：妈妈生日）" style="width:118px;"/>
					<input class="polaris-m-month" type="number" min="1" max="12" placeholder="月" style="width:52px;"/>
					<span style="font-size:12px;color:var(--text-muted);">月</span>
					<input class="polaris-m-day" type="number" min="1" max="31" placeholder="日" style="width:52px;"/>
					<span style="font-size:12px;color:var(--text-muted);">日</span>
					<label style="display:flex;align-items:center;gap:3px;font-size:11px;color:var(--text-muted);cursor:pointer;margin-left:2px;">
						<input class="polaris-m-lunar" type="checkbox"/>农历
					</label>
					<button class="polaris-m-del" style="background:rgba(239,68,68,0.15);border:none;border-radius:6px;padding:6px 8px;color:#f87171;font-size:12px;cursor:pointer;">删除</button>
				</div>`);
			bindDel();
			const last = list.lastElementChild?.querySelector("input");
			if (last) (last as HTMLInputElement).focus();
		};
		(modal.querySelector(".polaris-m-save") as HTMLElement).onclick = async () => {
			const list = modal.querySelector("#polaris-m-list") as HTMLElement;
			const result: { name: string; month: number; day: number; lunar?: boolean }[] = [];
			list.querySelectorAll("div[data-idx]").forEach((row) => {
				const name = (row.querySelector(".polaris-m-name") as HTMLInputElement).value.trim();
				const month = parseInt((row.querySelector(".polaris-m-month") as HTMLInputElement).value, 10);
				const day = parseInt((row.querySelector(".polaris-m-day") as HTMLInputElement).value, 10);
				const lunar = (row.querySelector(".polaris-m-lunar") as HTMLInputElement).checked;
				if (name && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
					result.push({ name, month, day, lunar: lunar || undefined });
				}
			});
			this.userMilestones = result;
			await this.saveMilestones();
			this.closeModal();
			this.refreshRightPanel();
			this.showToast(`纪念日已保存：${this.userMilestones.length} 条`);
		};
	}
	private renderTagCloud(topTags: any[], totalTags: number): string {
		if (!topTags || topTags.length === 0) {
			return '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;">暂无标签数据</div>';
		}
		const maxCount = topTags[0].count;
		const colors = ["#22c55e", "#3b82f6", "#eab308", "#a855f7", "#ef4444", "#06b6d4", "#f97316", "#ec4899", "#84cc16", "#8b5cf6"];
		const tagsHtml = topTags.map((item, i) => {
			const size = 12 + (item.count / maxCount) * 10; // 12px-22px
			const color = colors[i % colors.length];
			const opacity = 0.6 + (item.count / maxCount) * 0.4;
			return `<span class="polaris-tag-item" data-tag="${item.tag}" style="display:inline-block;padding:4px 12px;margin:4px;border-radius:16px;background:${color}15;color:${color};font-size:${size}px;font-weight:600;cursor:pointer;transition:all 0.2s;opacity:${opacity};" title="${item.tag}：${item.count} 篇笔记">#${item.tag} <span style="font-size:10px;opacity:0.7;">${item.count}</span></span>`;
		}).join("");

		return `<div style="display:flex;justify-content:flex-end;margin-bottom:4px;"><span class="polaris-view-all-tags" style="font-size:11px;color:var(--text-brand);cursor:pointer;font-weight:normal;">查看全部 ${totalTags} 个标签 →</span></div><div style="padding:8px 0;display:flex;flex-wrap:wrap;align-items:center;">${tagsHtml}</div>`;
	}

	// 打开 Obsidian 全部标签面板

	// 渲染当日日志（右侧详情面板）
	private renderDayLog(dateStr: string) {
		const detail = this.rootEl!.querySelector(".polaris-detail-content") as HTMLElement;
		detail.className = "polaris-detail-content detail-body";
		const activity = this.getDayActivityDetail(dateStr);

		// 按文件夹分组的文档列表
		const foldersHtml = Object.keys(activity.byFolder).length > 0
			? Object.keys(activity.byFolder).sort().map((folder) => {
					const files = activity.byFolder[folder];
					const filesHtml = files.map((f: any) => {
						const timeStr = `${String(f.time.getHours()).padStart(2,"0")}:${String(f.time.getMinutes()).padStart(2,"0")}`;
						const typeIcon = f.type === "created" ? "🆕" : "✏️";
						const typeText = f.type === "created" ? "新增" : "修改";
						return `<div class="polaris-daylog-file" data-path="${f.path}" style="display:flex;align-items:center;gap:8px;padding:8px;border-radius:6px;cursor:pointer;transition:background 0.15s;">
							<span style="font-size:14px;">${typeIcon}</span>
							<div style="flex:1;min-width:0;">
								<div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.name}</div>
								<div style="font-size:10px;color:var(--text-muted);">${timeStr} · ${typeText} · ${(f.size/1024).toFixed(1)}KB</div>
							</div>
						</div>`;
					}).join("");
					return `<div style="margin-bottom:12px;">
						<div style="font-size:11px;color:var(--text-muted);font-weight:600;margin-bottom:4px;padding:0 4px;">📁 ${folder} (${files.length})</div>
						<div>${filesHtml}</div>
					</div>`;
				}).join("")
			: '<div style="text-align:center;padding:28px;color:var(--text-muted);font-size:13px;">这一天没有修改任何笔记</div>';

		detail.innerHTML = `
			<div class="detail-section">
				<div class="detail-section-title" style="display:flex;justify-content:space-between;align-items:center;">
					<span>📅 当日日志</span>
					<span class="polaris-daylog-close" style="cursor:pointer;font-size:18px;color:var(--text-muted);padding:0 4px;">×</span>
				</div>
				<div style="background:linear-gradient(135deg,rgba(34,197,94,0.1),rgba(59,130,246,0.1));border-radius:10px;padding:16px;margin-bottom:12px;">
					<div style="font-size:18px;font-weight:700;margin-bottom:4px;">${activity.date} ${activity.weekday}</div>
					<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">
						<div style="text-align:center;"><div style="font-size:20px;font-weight:700;color:var(--text-brand);">${activity.total}</div><div style="font-size:10px;color:var(--text-muted);">总活跃度</div></div>
						<div style="text-align:center;"><div style="font-size:20px;font-weight:700;color:#60a5fa;">${activity.created}</div><div style="font-size:10px;color:var(--text-muted);">新增笔记</div></div>
						<div style="text-align:center;"><div style="font-size:20px;font-weight:700;color:#fbbf24;">${activity.modified}</div><div style="font-size:10px;color:var(--text-muted);">修改笔记</div></div>
						<div style="text-align:center;"><div style="font-size:20px;font-weight:700;color:#a78bfa;">${activity.streak}</div><div style="font-size:10px;color:var(--text-muted);">连续活跃(天)</div></div>
					</div>
					${activity.mostActivePeriod ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.1);font-size:11px;color:var(--text-secondary);text-align:center;">⏰ 最活跃时段：${activity.mostActivePeriod}（${activity.mostActiveCount} 篇）</div>` : ""}
				</div>
				<div style="max-height:400px;overflow-y:auto;">${foldersHtml}</div>
				<div style="margin-top:12px;display:flex;gap:8px;">
					<button class="polaris-daylog-report btn-primary" style="flex:1;padding:12px;font-size:14px;">📝 生成日报</button>
				</div>
			</div>`;

		// 关闭按钮
		(detail.querySelector(".polaris-daylog-close") as HTMLElement).onclick = () => {
			this.resetDetail();
		};

		// 文件点击打开
		detail.querySelectorAll(".polaris-daylog-file").forEach((el) => {
			(el as HTMLElement).onclick = () => {
				const path = (el as HTMLElement).dataset.path || "";
				if (path) this.openNoteByPath(path);
			};
			(el as HTMLElement).onmouseenter = () => { (el as HTMLElement).style.setProperty("background", "rgba(255,255,255,0.05)") };
			(el as HTMLElement).onmouseleave = () => { (el as HTMLElement).style.setProperty("background", "transparent") };
		});

		// 生成日报按钮
		(detail.querySelector(".polaris-daylog-report") as HTMLElement).onclick = () => {
			this.generateDailyReport(dateStr);
		};
	}

	// 生成日报
	private async generateDailyReport(dateStr: string) {
		try {
			const activity = this.getDayActivityDetail(dateStr);
			const dateObj = new Date(dateStr + "T00:00:00");
			const weekday = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"][dateObj.getDay()];

			// 按文件夹分组的文档列表
			const foldersContent = Object.keys(activity.byFolder).length > 0
				? Object.keys(activity.byFolder).sort().map((folder) => {
						const files = activity.byFolder[folder];
						const filesList = files.map((f: any) => {
							const timeStr = `${String(f.time.getHours()).padStart(2,"0")}:${String(f.time.getMinutes()).padStart(2,"0")}`;
							const typeText = f.type === "created" ? "🆕新增" : "✏️修改";
							return `- [[${f.name}]]（${timeStr} ${typeText}）`;
						}).join("\n");
						return `### ${folder}\n${filesList}`;
					}).join("\n\n")
				: "（今天没有修改任何笔记）";

			const content = `# ${dateStr} ${weekday}\n\n## 📊 今日概览\n- 总活跃度：${activity.total} 篇（新增 ${activity.created} 篇，修改 ${activity.modified} 篇）\n${activity.mostActivePeriod ? `- 最活跃时段：${activity.mostActivePeriod}（${activity.mostActiveCount} 篇）\n` : ""}- 连续活跃：第 ${activity.streak} 天\n\n## 📁 今日修改的文档\n\n${foldersContent}\n\n## 💡 今日心得\n（在这里写今天的感悟、收获、待办...）\n\n## 📋 明日计划\n- [ ] \n`;

			const diaryPath = `10-日记/${dateStr}.md`;
			const existing = this.app.vault.getAbstractFileByPath(diaryPath);

			if (existing) {
				// 追加内容
				const currentContent = await this.app.vault.read(existing as any);
				const newContent = currentContent + "\n\n---\n\n" + content;
				await this.app.vault.modify(existing as any, newContent);
				this.showToast(`日报已追加到：${dateStr}.md`);
			} else {
				// 创建新文件
				await this.app.vault.create(diaryPath, content);
				this.showToast(`日报已生成：${dateStr}.md`);
			}

			// 打开生成的日报
			this.openNoteByPath(diaryPath);
		} catch (e) {
			this.showToast(`生成日报失败：${e}`);
		}
	}
	private openAllTagsPanel() {
		try {
			// 尝试在右侧边栏打开标签视图
			const leaf = this.app.workspace.getRightLeaf(false);
			if (leaf) {
				leaf.setViewState({ type: "tag", active: true } as any);
				this.showToast("已打开标签面板（右侧边栏）");
				return;
			}
			// 回退：打开全局搜索
			this.openGlobalSearch("");
			this.showToast("已打开搜索面板");
		} catch (e) {
			this.showToast(`打开标签面板失败：${e}`);
		}
	}
	/** 搜索下拉面板元素 */
	private searchDropEl: HTMLElement | null = null;
	/** 下拉中全部可点击项（供键盘 ↑↓ 导航） */
	private searchItemEls: HTMLElement[] = [];
	/** 当前高亮项索引（-1 = 无高亮） */
	private searchActiveIdx = -1;

	/** 关闭搜索下拉 */
	private closeSearchDropdown() {
		if (this.searchDropEl) {
			this.searchDropEl.remove();
			this.searchDropEl = null;
		}
		this.searchItemEls = [];
		this.searchActiveIdx = -1;
		this.rootEl?.querySelector(".search-area.tsd-open")?.classList.remove("tsd-open");
	}

	/** 键盘导航：移动当前高亮项（delta = +1 下一项 / -1 上一项，首尾循环） */
	private moveSearchActive(delta: number) {
		const items = this.searchItemEls;
		if (!items.length) return;
		let i = this.searchActiveIdx + delta;
		if (i < 0) i = items.length - 1;
		if (i >= items.length) i = 0;
		this.setSearchActive(i);
	}

	/** 设置当前高亮项（与鼠标 hover 共用同一状态，键盘与鼠标不会互相打架） */
	private setSearchActive(idx: number) {
		const items = this.searchItemEls;
		if (!items.length) return;
		this.searchActiveIdx = Math.max(0, Math.min(idx, items.length - 1));
		items.forEach((el, i) => el.classList.toggle("tsd-active", i === this.searchActiveIdx));
		// 滚动只发生在列表区内部：用 scrollIntoView 会连带把整个仪表盘滚走
		const el = items[this.searchActiveIdx];
		const body = this.searchDropEl?.querySelector(".tsd-body") as HTMLElement | null;
		if (!body) return;
		const top = el.offsetTop - body.offsetTop;
		const bottom = top + el.offsetHeight;
		if (top < body.scrollTop) body.scrollTop = top;
		else if (bottom > body.scrollTop + body.clientHeight) body.scrollTop = bottom - body.clientHeight;
	}

	/** 顶部搜索实时下拉：匹配笔记 / 任务 / 复习，展开在搜索框下方（不依赖侧边栏） */
	private openSearchDropdown(anchor: HTMLInputElement, query: string) {
		this.closeSearchDropdown();
		const q = query.trim().toLowerCase();
		if (!q) return;
		const LIMIT = 6; // 每组最多展示条数，超出走底部「查看全部」入口
		const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

		// ---- 笔记：相关度打分（标题命中 > 路径命中；附属/资源类笔记降权但保留，不直接过滤）----
		const ASSET_RE = /(^|[-_/ ])assets?([-_/ ]|$)|附件|素材|attachments?|images?$/i;
		const scoreNote = (basename: string, path: string) => {
			const b = basename.toLowerCase();
			let s = 0;
			if (b === q) s += 1000;                       // 标题完全等同
			else if (b.startsWith(q)) s += 600;           // 标题前缀命中
			else if (b.includes(q)) s += 420 + (b.indexOf(q) < 12 ? 80 : 0); // 越靠前越相关
			if (path.toLowerCase().includes(q)) s += 120; // 仅路径命中，相关度最低
			if (basename.length > 40) s -= 30;            // 超长文件名略降权（可读性差）
			if (ASSET_RE.test(basename) || ASSET_RE.test(path)) s -= 500; // 附属笔记降权
			return s;
		};
		let notesAll: { path: string; basename: string }[] = [];
		try {
			notesAll = this.app.vault.getMarkdownFiles()
				.map((f) => ({ path: f.path, basename: f.basename, s: scoreNote(f.basename, f.path) }))
				.filter((f) => f.basename.toLowerCase().includes(q) || f.path.toLowerCase().includes(q))
				.sort((a, b) => b.s - a.s || a.basename.length - b.basename.length)
				.map(({ path, basename }) => ({ path, basename }));
		} catch { /* 扫描失败则无笔记结果 */ }
		// ---- 任务 / 复习（先取全量用于计数，再截断展示）----
		const tasksAll = this.workTasks.filter((t) => (t.title || "").toLowerCase().includes(q));
		const reviewsAll = this.reviewRecords.filter((r) => (r.path || "").toLowerCase().includes(q) || (r.subject || "").toLowerCase().includes(q));

		const notes = notesAll.slice(0, LIMIT);
		const tasks = tasksAll.slice(0, LIMIT);
		const reviews = reviewsAll.slice(0, LIMIT);
		const totalAll = notesAll.length + tasksAll.length + reviewsAll.length;
		const shown = notes.length + tasks.length + reviews.length;

		const pop = document.createElement("div");
		pop.className = "polaris-search-drop";
		pop.setAttribute("data-theme", this.theme);
		let html = "";
		const statusName: Record<string, string> = { todo: "待开始", doing: "进行中", done: "已完成" };
		// 副行目录：显示笔记所在的【完整】文件夹路径，不做任何省略（用户要求看全位置）
		const dirOf = (p: string) => {
			const parts = p.split("/").filter(Boolean);
			if (parts.length <= 1) return "";
			return parts.slice(0, -1).join("/");
		};
		// 标题过长时做「窗口截断」：保证匹配词落在可视窗口内，
		// 避免简单截尾把关键词截掉（这正是长文件名搜不到重点的原因）
		const clip = (text: string, max: number) => {
			if (text.length <= max) return text;
			const idx = text.toLowerCase().indexOf(q);
			if (idx < 0) return "…" + text.slice(-(max - 1));
			const start = Math.max(0, Math.min(idx - 10, text.length - max));
			const end = Math.min(text.length, start + max);
			return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
		};
		// 匹配词高亮：直接复用看板搜索已有的 .search-hit，两处高亮语言天然一致
		const hl = (text: string, max: number) => {
			const t = clip(text, max);
			const idx = t.toLowerCase().indexOf(q);
			if (idx < 0) return esc(t);
			return esc(t.slice(0, idx)) + `<span class="search-hit">` + esc(t.slice(idx, idx + q.length)) + `</span>` + esc(t.slice(idx + q.length));
		};
		// 条目 = 两行制：第一行标题（高亮匹配词）+ 第二行完整文件夹路径（不省略）。
		// 用 div[role=button] 而非 <button>：Obsidian 主题普遍给 button 强制高度与底色，
		// 会把行内容压出溢出、与下一行重叠（这是"看着像挂在下一行标题上"的根因）。
		const item = (type: string, title: string, sub: string, extra: string) =>
			`<div class="tsd-item" role="button" tabindex="-1" data-type="${type}" ${extra}><span class="tsd-item-title">${title}</span>${sub ? `<span class="tsd-item-sub">${sub}</span>` : ""}</div>`;
		// 分组标题：名称 + 计数。截断时显示「已显示/总数」，
		// 避免"只列了 6 条却标 1339"的误导（旧版计数含义不明，是截图里的困惑点之一）
		const titleRow = (icon: string, name: string, shown: number, total: number) =>
			`<div class="tsd-group-title"><span class="tsd-gt-icon">${icon}</span><span class="tsd-gt-name">${name}</span><span class="tsd-gt-count">${total > shown ? `${shown}/${total}` : `${total}`}</span></div>`;
		if (notes.length) {
			html += `<div class="tsd-group">${titleRow("📄", "笔记", notes.length, notesAll.length)}`;
			html += notes.map((n) => {
				const sub = dirOf(n.path); // 完整文件夹路径，逐条展示
				return item("note", hl(n.basename, 52), esc(sub), `data-path="${esc(n.path)}" title="${esc(n.path)}"`);
			}).join("");
			html += `</div>`;
		}
		if (tasks.length) {
			html += `<div class="tsd-group">${titleRow("📋", "任务", tasks.length, tasksAll.length)}`;
			html += tasks.map((t) => item("task", hl(t.title || "", 52), esc(`${statusName[t.status] || t.status} · ${t.priority || ""} · ${t.dueDate || "无截止"}`), `data-id="${t.id}" title="${esc(t.title || "")}"`)).join("");
			html += `</div>`;
		}
		if (reviews.length) {
			html += `<div class="tsd-group">${titleRow("📚", "复习", reviews.length, reviewsAll.length)}`;
			html += reviews.map((r) => {
				const sub = dirOf(r.path); // 完整文件夹路径，逐条展示
				const name = r.subject || r.path.split("/").pop() || "";
				return item("review", hl(name, 52), esc(sub), `data-path="${esc(r.path)}" title="${esc(name)}"`);
			}).join("");
			html += `</div>`;
		}
		// 列表区（内部滚动）+ 固定底部结果栏（规范 §8.2：底部区域始终可见）
		if (!totalAll) {
			html = `<div class="tsd-body"><div class="tsd-empty"><span class="tsd-empty-icon">🔍</span>未找到与「${esc(query)}」相关的内容</div></div>`;
		} else {
			let foot = `<span class="tsd-foot-count">显示 <b>${shown}</b> · 共 <b>${totalAll}</b> 条</span><span class="tsd-foot-actions">`;
			if (totalAll > shown) foot += `<button type="button" class="tsd-seeall" data-q="${esc(query)}">查看全部 ${totalAll} 条</button>`;
			foot += `<button type="button" class="tsd-close">关闭</button></span>`;
			html = `<div class="tsd-body">${html}</div><div class="tsd-foot">${foot}</div>`;
		}
		pop.innerHTML = html;
		this.searchItemEls = Array.from(pop.querySelectorAll(".tsd-item")) as HTMLElement[];
		this.searchItemEls.forEach((el, i) => {
			el.addEventListener("mousedown", (e) => e.preventDefault());
			el.addEventListener("mouseenter", () => this.setSearchActive(i));
			el.onclick = () => this.activateSearchResult(el);
		});
		const closeBtn = pop.querySelector(".tsd-close") as HTMLElement | null;
		if (closeBtn) {
			closeBtn.addEventListener("mousedown", (e) => e.preventDefault());
			closeBtn.onclick = () => { this.closeSearchDropdown(); anchor.value = ""; };
		}
		const seeAll = pop.querySelector(".tsd-seeall") as HTMLElement | null;
		if (seeAll) {
			seeAll.addEventListener("mousedown", (e) => e.preventDefault());
			seeAll.onclick = () => { this.closeSearchDropdown(); this.openGlobalSearch(seeAll.dataset.q || query); };
		}
		const area = anchor.closest(".search-area") as HTMLElement | null;
		if (area) {
			area.classList.add("tsd-open");
			area.appendChild(pop);
		}
		this.searchDropEl = pop;
		if (this.searchItemEls.length) this.setSearchActive(0);
	}

	/** 跳转到搜索结果 */
	private activateSearchResult(el: HTMLElement) {
		const type = el.dataset.type;
		const path = el.dataset.path || "";
		const id = el.dataset.id || "";
		this.closeSearchDropdown();
		if (type === "note") {
			this.app.workspace.openLinkText(path, "");
			this.showToast("已打开笔记");
		} else if (type === "task") {
			const task = this.workTasks.find((t) => t.id === id);
			if (!task) return;
			if (this.currentBoard !== "work") { this.currentBoard = "work"; this.renderTopNav(); this.renderBoard(); }
			this.showTaskDetail({ id: task.id, title: task.title, priority: task.priority, status: task.status === "todo" ? "待开始" : task.status === "doing" ? "进行中" : "已完成", progress: task.progress, dueDate: task.dueDate, startDate: task.startDate, assignee: task.assignee, notePath: task.notePath });
			this.showToast("已定位任务");
		} else if (type === "review") {
			if (this.currentBoard !== "review") { this.currentBoard = "review"; this.renderTopNav(); this.renderBoard(); }
			this.app.workspace.openLinkText(path, "");
			this.showToast("已定位复习笔记");
		}
	}

	private openGlobalSearch(query: string) {
		try {
			// 先打开全局搜索面板（commands 是 Obsidian 未文档化的运行时 API，官方类型定义未暴露，用 as any 规避）
			(this.app as any).commands.executeCommandById("global-search:open");
			// 延迟设置搜索关键词（等面板打开后）
			setTimeout(() => {
				const searchLeaves = this.app.workspace.getLeavesOfType("search");
				if (searchLeaves.length > 0) {
					const view = searchLeaves[0].view as any;
					if (view && view.setQuery) {
						view.setQuery(query);
					}
				}
			}, 100);
			this.showToast(query ? `搜索：${query}` : "已打开全局搜索");
		} catch (e) {
			this.showToast(`打开搜索失败：${e}`);
		}
	}

	/** 从模板新建笔记 */
	private async createFromTemplate() {
		try {
			// 读取模板文件夹中的所有模板
			const tplFolder = this.app.vault.getAbstractFileByPath("99-Templates-模板");
			if (!tplFolder || !(tplFolder as any).children) {
				this.showToast("模板文件夹不存在");
				return;
			}
			const templates = (tplFolder as any).children
				.filter((f: any) => f.extension === "md")
				.map((f: any) => ({ name: f.basename, path: f.path }));

			if (templates.length === 0) {
				this.showToast("模板文件夹中没有模板");
				return;
			}

			// 弹出模板选择模态框
			this.showModal("从模板新建", `
				<div style="display:flex;flex-direction:column;gap:8px;">
					${templates.map((t: any, i: number) => `
						<button class="tpl-select-btn" data-idx="${i}" style="display:flex;align-items:center;gap:8px;padding:12px 12px;background:rgba(255,255,255,0.05);border:1px solid var(--border-color);border-radius:8px;cursor:pointer;color:var(--text-primary);font-size:14px;text-align:left;transition:all 0.15s;">
							<span style="font-size:18px;">📄</span>
							<span>${t.name}</span>
						</button>
					`).join("")}
				</div>
			`);

			const modal = this.rootEl!.querySelector(".polaris-modal-box") as HTMLElement;
			modal.querySelectorAll(".tpl-select-btn").forEach((btn) => {
				(btn as HTMLElement).onclick = async () => {
					const idx = parseInt((btn as HTMLElement).dataset.idx || "0");
					const tpl = templates[idx];
					this.closeModal();
					// 读取模板内容
					const tplContent = await this.app.vault.read(this.app.vault.getAbstractFileByPath(tpl.path) as any);
					// 替换Templater语法
					const today = new Date();
					const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
					const weekDays = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
					let content = tplContent
						.replace(/<% tp\.file\.title %>/g, dateStr)
						.replace(/<% tp\.date\.now\("([^"]+)"\) %>/g, (_, fmt) => {
							if (fmt === "YYYY-MM-DD") return dateStr;
							if (fmt === "YYYY-MM-DD dddd") return `${dateStr} ${weekDays[today.getDay()]}`;
							return dateStr;
						});
					// 弹出输入标题的模态框
					this.showModal("新建笔记", `
						<form id="polaris-tpl-note-form">
							<div class="form-field"><label class="form-label">笔记标题 <span class="required">*</span></label><input class="form-input" name="title" type="text" placeholder="输入笔记标题..." value="${tpl.name.replace(/^tpl-/, "")}" required autofocus></div>
							<div class="form-actions"><button type="button" class="btn-secondary polaris-modal-cancel">取消</button><button type="submit" class="btn-primary">创建并打开</button></div>
						</form>
					`);
					const modal2 = this.rootEl!.querySelector(".polaris-modal-box") as HTMLElement;
					(modal2.querySelector(".polaris-modal-cancel") as HTMLElement).onclick = () => this.closeModal();
					(modal2.querySelector("#polaris-tpl-note-form") as HTMLFormElement).onsubmit = async (e) => {
						e.preventDefault();
						const form = e.target as HTMLFormElement;
						const title = (new FormData(form).get("title") || "").toString().trim();
						if (!title) { this.showToast("标题不能为空"); return; }
						const notePath = `00-Inbox-收集箱/${title}.md`;
						try {
							const existing = this.app.vault.getAbstractFileByPath(notePath);
							if (existing) { this.showToast("该标题已存在"); return; }
							await this.app.vault.create(notePath, content);
							this.closeModal();
							await this.app.workspace.openLinkText(notePath, "", true);
							this.showToast(`已从模板「${tpl.name}」创建：${title}`);
						} catch (err) {
							this.showToast(`创建失败：${err}`);
						}
					};
				};
			});
		} catch (e) {
			this.showToast(`从模板新建失败：${e}`);
		}
	}

	async onClose() {
		// 取消进行中的拖拽（如有）
		if (this._activeDragFinish) { const f = this._activeDragFinish; f(); }
		// 移除 document 级 mousedown 监听（就地展开/浮层：视图关闭后残留会干扰下次打开）
		if (this.todoExpandCloseHandler) { document.removeEventListener("mousedown", this.todoExpandCloseHandler); this.todoExpandCloseHandler = null; }
		if (this.calExpandCloseHandler) { document.removeEventListener("mousedown", this.calExpandCloseHandler); this.calExpandCloseHandler = null; }
		if (this.datePickerCloseHandler) { document.removeEventListener("mousedown", this.datePickerCloseHandler); this.datePickerCloseHandler = null; }
		// abort 全部 document 级指针监听（右栏/看板拖拽、宽度调节）
		for (const ac of this._docAborters) ac.abort();
		this._docAborters = [];
		// 停止定时器（番茄计时 / 知识库刷新防抖 / 搜索防抖）
		if (this.pomodoroInterval) { window.clearInterval(this.pomodoroInterval); this.pomodoroInterval = null; }
		if (this.kbRefreshTimer) { window.clearTimeout(this.kbRefreshTimer); this.kbRefreshTimer = null; }
		if (this._searchDebounceTimer !== undefined) { window.clearTimeout(this._searchDebounceTimer); this._searchDebounceTimer = undefined; }
		if (this.styleEl) { this.styleEl.remove(); this.styleEl = null; }
		this.rootEl = null;
		this.containerEl.empty();
	}
}
