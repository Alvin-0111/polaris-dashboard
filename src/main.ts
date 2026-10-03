import { Plugin, WorkspaceLeaf } from "obsidian";
import { PolarisDashboardView, VIEW_TYPE_TALOS_DASHBOARD, WorkTask } from "./view";

export interface PomodoroSession {
	id: string;
	taskId?: string; // 关联的任务ID
	taskTitle: string; // 任务标题（冗余存储，避免任务删除后历史丢失）
	duration: number; // 专注时长（秒）
	completedAt: string; // 完成时间（ISO字符串）
	mode: "focus" | "shortBreak" | "longBreak";
}

export interface Habit {
	id: string;
	name: string; // 习惯名称
	icon: string; // 图标 emoji
	color: string; // 习惯颜色
	createdAt: string; // 创建时间
	archived: boolean; // 是否归档
}

// 打卡记录：日期 -> 习惯ID -> 是否完成
// 例如：{ "2026-09-06": { "habit-1": true, "habit-2": false } }
export type CheckinRecords = Record<string, Record<string, boolean>>;

// 复习记录：一条对应一篇候选笔记（存 data.json，不写回笔记 frontmatter）
export interface ReviewRecord {
	path: string;          // 笔记路径（唯一标识）
	subject: string;       // 学科（笔记的直接父文件夹名）
	stage: number;         // 已完成的遗忘阶梯阶段数（0 = 尚未完成过首轮）
	lastReviewed: string;  // 上次复习日期 YYYY-MM-DD
	nextDue: string;       // 下次到期日期 YYYY-MM-DD
	times: number;         // 累计复习次数
	skipped: boolean;      // 用户跳过（不再自动推荐）
	status: "new" | "learning" | "mastered";
	wrongCount: number;    // 累计记错次数（点「不熟」+1）
	wrongDates: string[];  // 记错日期记录（错题本展示用）
}

// 复习会话：按天聚合的复习动作记录（用于近7天趋势/本周学习/累计时长）
export interface ReviewSession {
	date: string;  // YYYY-MM-DD
	count: number; // 当天完成的复习条数
}

// 复习引擎可配置参数（设置面板可调）
export interface ReviewConfig {
	newWindowDays: number;   // 新笔记自动纳入复习的窗口天数（默认30）
	queueLimit: number;      // 今日复习队列上限（默认15）
	minutesPerItem: number;  // 单条复习估算时长（分钟，默认5）
}

// 卡片布局：用户自定义的卡片顺序与宽度（拖拽调序/调宽后落盘）
// order: 看板标识 -> 卡片 ID 顺序数组；width: 卡片 ID -> 栅格跨度（4/6/8/12）
export interface CardLayout {
	order?: Record<string, string[]>;
	width?: Record<string, number>;
}

export interface PolarisPluginData {
	checkinRecords: CheckinRecords;
	habits: Habit[];
	workTasks: WorkTask[];
	pomodoroSessions: PomodoroSession[];
	reviewRecords: ReviewRecord[];
	reviewSessions: ReviewSession[];
	reviewConfig: ReviewConfig;
	dailyQuotes?: string[];
	// 自定义纪念日/生日（lunar=true 表示农历日期）
	milestones?: { name: string; month: number; day: number; lunar?: boolean }[];
	cardLayout?: CardLayout;
	// 外观设置（持久化，重启不丢）
	theme?: "dark" | "light";
	cardOpacity?: number;   // 卡片透明度 0.1~1
	cardBlur?: number;      // 毛玻璃模糊强度 px 0~40
	// 背景壁纸（深色主题生效）：type = preset(预设) | image(自定义图片) | none(关闭)
	wallpaper?: { type: string; value: string };
	// 右侧栏日历卡片内容配置（哪些信息块显示）
	dateCard?: { ganzhi?: boolean; yiJi?: boolean; dailySign?: boolean };
	// 每日一签抽签记录（日期 -> 签号，当天锁定）
	dailySignRecord?: Record<string, number>;
	// 右侧栏板块显隐：被隐藏的板块 key（checkin/pomo/todos/learning）
	rightPanel?: { hidden?: string[]; order?: string[] };
}

const DEFAULT_WORK_TASKS: WorkTask[] = [
	{ id: "WXB-002", title: "竞品分析报告", priority: "P1", status: "doing", progress: 65, dueDate: "09/10", overdue: false, notePath: "01-Projects-项目/竞品分析报告.md", startDate: "08/25", assignee: "Alvin" },
	{ id: "WXB-005", title: "API 接口文档编写", priority: "P0", status: "doing", progress: 40, dueDate: "09/15", overdue: false, notePath: "03-Resources-资源/API 接口文档.md", startDate: "09/01", assignee: "Alvin" },
	{ id: "WXB-008", title: "面试题库整理", priority: "P2", status: "doing", progress: 30, dueDate: "09/20", overdue: false, notePath: "01-Projects-项目/面试题库整理.md", startDate: "09/05", assignee: "Alvin" },
	{ id: "WXB-003", title: "数据面板需求梳理", priority: "P1", status: "todo", progress: 0, dueDate: "09/25", overdue: false, notePath: "01-Projects-项目/数据面板需求梳理.md", startDate: "09/18", assignee: "Alvin" },
	{ id: "WXB-004", title: "竞品功能对比表", priority: "P0", status: "todo", progress: 0, dueDate: "09/12", overdue: false, notePath: "01-Projects-项目/竞品功能对比表.md", startDate: "09/08", assignee: "Alvin" },
	{ id: "WXB-007", title: "周报模板更新", priority: "P2", status: "todo", progress: 0, dueDate: "09/30", overdue: false, notePath: "99-Templates-模板/周报模板.md", startDate: "09/28", assignee: "Alvin" },
	{ id: "WXB-001", title: "需求评审会议", priority: "P1", status: "done", progress: 100, dueDate: "08/12", overdue: false, notePath: "01-Projects-项目/需求评审会议.md", startDate: "08/05", assignee: "Alvin" },
	{ id: "WXB-006", title: "原型设计定稿", priority: "P0", status: "done", progress: 100, dueDate: "08/18", overdue: false, notePath: "01-Projects-项目/原型设计定稿.md", startDate: "08/10", assignee: "Alvin" },
];

const DEFAULT_HABITS: Habit[] = [
	{ id: "habit-1", name: "喝水", icon: "💧", color: "#3b82f6", createdAt: "2026-08-01", archived: false },
	{ id: "habit-2", name: "健身", icon: "🏃", color: "#22c55e", createdAt: "2026-08-15", archived: false },
	{ id: "habit-3", name: "早睡", icon: "🌙", color: "#a855f7", createdAt: "2026-09-01", archived: false },
	{ id: "habit-4", name: "阅读", icon: "📖", color: "#f59e0b", createdAt: "2026-08-20", archived: false },
	{ id: "habit-5", name: "冥想", icon: "🧘", color: "#ec4899", createdAt: "2026-09-05", archived: false },
];

const DEFAULT_DATA: PolarisPluginData = {
	checkinRecords: {},
	habits: DEFAULT_HABITS,
	workTasks: DEFAULT_WORK_TASKS,
	pomodoroSessions: [],
	reviewRecords: [],
	reviewSessions: [],
	reviewConfig: { newWindowDays: 30, queueLimit: 15, minutesPerItem: 5 },
	dailyQuotes: [],
	milestones: [],
	theme: "dark",
	cardOpacity: 0.75,
	cardBlur: 20,
	dateCard: { ganzhi: false, yiJi: true, dailySign: false },
	dailySignRecord: {},
	rightPanel: { order: [], hidden: [] },
};

/** 递归深合并：用户数据优先，缺失字段回退默认值（防止旧 data.json 缺字段导致渲染异常） */
function deepMerge(base: any, override: any): any {
	if (override == null) return base;
	if (Array.isArray(base) || Array.isArray(override)) return override;
	if (typeof base === "object" && typeof override === "object") {
		const out: any = { ...base };
		for (const k of Object.keys(override)) {
			out[k] = deepMerge(base[k], override[k]);
		}
		return out;
	}
	return override;
}

export default class PolarisDashboardPlugin extends Plugin {
	dataviewApi: any = null;
	pluginData: PolarisPluginData = DEFAULT_DATA;

	async onload() {
		// 加载插件数据
		this.pluginData = deepMerge(DEFAULT_DATA, await this.loadData());

		// 兼容旧数据：boolean 类型的打卡记录转成数字强度（true -> 3 中等强度）
		if (this.pluginData.checkinRecords) {
			const records = this.pluginData.checkinRecords as Record<string, any>;
			// 检查是否是旧格式（值是 number 或 boolean，而不是对象）
			const isOldFormat = Object.values(records).some((v) => typeof v === "number" || typeof v === "boolean");
			if (isOldFormat) {
				// 创建一个默认习惯来迁移旧数据
				const migratedHabit: Habit = {
					id: "habit-legacy",
					name: "每日打卡",
					icon: "✅",
					color: "#22c55e",
					createdAt: new Date().toISOString().split("T")[0],
					archived: false,
				};
				const newRecords: CheckinRecords = {};
				for (const date in records) {
					const val = records[date];
					const checked = typeof val === "boolean" ? val : (typeof val === "number" ? val > 0 : false);
					if (checked) {
						newRecords[date] = { "habit-legacy": true };
					}
				}
				this.pluginData.checkinRecords = newRecords;
				this.pluginData.habits = [migratedHabit, ...(this.pluginData.habits || [])];
			}
		}

		// 检测并获取 Dataview 插件 API
		// @ts-ignore
		const dvPlugin = this.app.plugins.plugins["dataview"];
		if (dvPlugin) {
			// @ts-ignore
			this.dataviewApi = dvPlugin.api;
		} else {
			// 未检测到 Dataview，插件使用演示数据（视图内已做提示）
		}

		// 注册视图
		this.registerView(
			VIEW_TYPE_TALOS_DASHBOARD,
			(leaf: WorkspaceLeaf) => {
				const view = new PolarisDashboardView(leaf);
				view.dataviewApi = this.dataviewApi;
				view.plugin = this;
				return view;
			}
		);

		// 左侧 Ribbon 图标（使用 Lucide 有效图标名）
		const ribbonIcon = this.addRibbonIcon("layout-dashboard", "Polaris Dashboard", () => {
			this.activateView();
		});
		ribbonIcon.addClass("polaris-ribbon-icon");

		// 命令面板入口
		this.addCommand({
			id: "open-polaris-dashboard",
			name: "打开 Polaris Dashboard",
			callback: () => {
				this.activateView();
			},
		});
	}

	async savePluginData() {
		await this.saveData(this.pluginData);
	}

	async activateView() {
		const { workspace } = this.app;
		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_TALOS_DASHBOARD);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getLeaf(false);
			await leaf.setViewState({ type: VIEW_TYPE_TALOS_DASHBOARD, active: true });
		}
		workspace.revealLeaf(leaf);
	}

	onunload() {
		// Obsidian 会自动清理本插件的视图；此处不 detach，
		// 避免用户移动过位置的叶子在插件重载时被重置。
	}
}
