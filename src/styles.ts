// Polaris Dashboard 完整样式（参考 CRM Dashboard 设计风格优化）
export const TALOS_STYLES = `/* ============================================================
   Polaris-Dashboard 设计 Token（参考 CRM Dashboard 风格）
   ============================================================ */
.talos-dashboard {
  /* ---- 色彩（参考图：淡黄绿主色 + 淡紫辅助色） ---- */
  --bg-primary: #0f0f13;              /* 带蓝灰相的深色背景，不是纯黑 */
  --bg-glow: rgba(200, 224, 96, 0.05); /* 微弱黄绿色径向光晕 */
  --brand-green: #c8e060;             /* 品牌主色：淡黄绿色（参考图主色） */
  --brand-green-dark: #a8c040;        /* 主色深色变体（hover/active） */
  --focus-border: rgba(168, 192, 64, 0.7); /* 输入框 Focus 描边：暗色=深档绿 70% 透明（无发光） */
  --text-brand: var(--brand-green);   /* 品牌色文字：暗色=品牌绿（暗底对比度足够） */
  --brand-purple: #a78bfa;            /* 辅助色：淡紫色（参考图信息卡色） */
  --brand-purple-dark: #8b6fe0;       /* 辅助色深色变体 */
  --danger-red: #f87171;              /* 逾期红：警示/错误（更柔和） */
  --priority-p0: #c084fc;             /* P0 紫（更柔和） */
  --priority-p1: #fbbf24;             /* P1 黄（更柔和） */
  --priority-p2: #9ca3af;             /* P2 灰 */
  --info-blue: #60a5fa;               /* 信息蓝（更柔和） */

  /* 卡片底色拆分为 RGB + 透明度，便于「仪表盘设置」实时调节 */
  --card-bg-rgb: 28, 28, 34;
  --card-opacity: 0.75;
  --card-blur: 20px;
  --border-color: rgba(255, 255, 255, 0.08);
  --divider-color: rgba(255, 255, 255, 0.04);
  --progress-track: rgba(255, 255, 255, 0.08);  /* 进度条轨道底色（暗色） */
  --control-bg: rgba(255, 255, 255, 0.08);      /* 小按钮/图例底色（暗色） */
  --divider-line: rgba(255, 255, 255, 0.08);    /* 内联分隔线（暗色） */
  --input-bg: rgba(255, 255, 255, 0.06);        /* 输入框底色（暗色） */
  --input-border: rgba(255, 255, 255, 0.12);    /* 输入框边框（暗色） */
  --check-border: rgba(255, 255, 255, 0.28);    /* 未完成勾选圈边框（暗色：柔和可见） */
  --tag-green-bg: var(--brand-green);            /* 绿色标签底色（暗浅共用：实色品牌绿） */
  --tag-green-text: #0f0f13;                     /* 绿色标签深字（暗浅共用） */
  --date-text: var(--brand-green);               /* 日期大字（暗色：品牌绿，暗底对比足够） */

  --text-primary: #f0f0f3;            /* 不是纯白，带一点蓝灰 */
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;

  /* ---- 阴影（三层柔和弥散：轮廓 + 氛围 + 远层光晕，高级柔光感） ---- */
  --shadow-card:
    0 1px 2px rgba(0, 0, 0, 0.2),
    0 8px 24px -6px rgba(0, 0, 0, 0.3),
    0 24px 48px -20px rgba(0, 0, 0, 0.4);
  --shadow-glow-green:
    0 0 20px rgba(200, 224, 96, 0.25),
    0 4px 12px rgba(200, 224, 96, 0.15);

  /* ---- 间距系统 ---- */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 20px;
  --space-2xl: 24px;
  --space-3xl: 32px;

  /* ---- 圆角系统（参考图大圆角风格：4个角色值） ---- */
  --radius-sm: 8px;      /* 小标签、小按钮 */
  --radius-md: 12px;     /* 输入框、常规按钮 */
  --radius-lg: 16px;     /* 常规卡片 */
  --radius-xl: 20px;     /* 大卡片、弹窗 */
  --radius-2xl: 28px;    /* 大壳、区块容器 */
  --radius-full: 999px;  /* 胶囊、圆形 */

  /* ---- 字号层级（参考图清晰字阶，增加断崖） ---- */
  --fs-hero: 28px;       /* 大标题 700 */
  --fs-title: 20px;      /* 标题 600 */
  --fs-subtitle: 16px;   /* 副标题 600 */
  --fs-body: 14px;       /* 正文 400 */
  --fs-caption: 12px;    /* 辅助 400 */
  --fs-micro: 11px;      /* 微标签 400 */
  --fs-stat: 32px;       /* 统计大数字 700 */
}

/* 浅色主题（参考图浅色模式） */
.talos-dashboard[data-theme="light"] {
  --bg-primary: #f5f5f0;              /* 米白色背景，带暖相 */
  --bg-glow: rgba(200, 224, 96, 0.08);
  --brand-green: #c8e060;             /* 主色：与暗色一致（按钮/填充/边框/图标），保持整体色彩体系不变 */
  --focus-border: #96b030;            /* 输入框 Focus 描边：浅色=更深档绿实色（浅底上清晰，无发光） */
  --text-brand: #1a1a1f;      /* 品牌色文字：浅色回落文字主色（浅底绿字对比度不足，用中性深色保证可读与统一，绿色只用于图形元素） */
  --card-bg-rgb: 255, 255, 255;
  --card-opacity: 0.85;
  --border-color: rgba(0, 0, 0, 0.06);
  --divider-color: rgba(0, 0, 0, 0.04);
  --progress-track: rgba(0, 0, 0, 0.08);        /* 进度条轨道底色（浅色：深灰透明，保证可见） */
  --control-bg: rgba(0, 0, 0, 0.06);            /* 小按钮/图例底色（浅色） */
  --divider-line: rgba(0, 0, 0, 0.08);          /* 内联分隔线（浅色） */
  --input-bg: rgba(0, 0, 0, 0.04);              /* 输入框底色（浅色） */
  --input-border: rgba(0, 0, 0, 0.12);          /* 输入框边框（浅色） */
  --check-border: rgba(0, 0, 0, 0.28);          /* 未完成勾选圈边框（浅色：柔和不突出） */
  --date-text: var(--brand-green-dark);         /* 日期大字（浅色：主色深档，浅底上可读且有绿色感） */
  --text-primary: #1a1a1f;
  --text-secondary: #52525b;
  --text-muted: #71717a;
  --shadow-card:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 8px 24px -6px rgba(0, 0, 0, 0.06),
    0 24px 48px -20px rgba(0, 0, 0, 0.08);
}

/* 浅色专属：装饰色块 alpha 加深，避免与米白背景融合（暗色 0.15 在暗底可见，浅色需提高） */
.talos-dashboard[data-theme="light"] .talos-stats-overview .stat-icon.green { background: rgba(200,224,96,calc(var(--card-opacity) * 0.373)) !important; }
.talos-dashboard[data-theme="light"] .talos-stats-overview .stat-icon.blue { background: rgba(96,165,250,calc(var(--card-opacity) * 0.333)) !important; }
.talos-dashboard[data-theme="light"] .talos-stats-overview .stat-icon.purple { background: rgba(167,139,250,calc(var(--card-opacity) * 0.333)) !important; }
.talos-dashboard[data-theme="light"] .talos-stats-overview .stat-icon.red { background: rgba(248,113,113,calc(var(--card-opacity) * 0.333)) !important; }
.talos-dashboard[data-theme="light"] .talos-stats-overview .stat-icon.neutral { background: rgba(161,161,170,calc(var(--card-opacity) * 0.293)) !important; }
.talos-dashboard[data-theme="light"] .canvas-stat-icon { background: rgba(200,224,96,calc(var(--card-opacity) * 0.373)) !important; }
.talos-dashboard[data-theme="light"] .canvas-stat-icon.blue { background: rgba(96,165,250,calc(var(--card-opacity) * 0.333)) !important; }
.talos-dashboard[data-theme="light"] .canvas-stat-icon.purple { background: rgba(167,139,250,calc(var(--card-opacity) * 0.333)) !important; }
.talos-dashboard[data-theme="light"] .canvas-stat-icon.red { background: rgba(248,113,113,calc(var(--card-opacity) * 0.333)) !important; }
.talos-dashboard[data-theme="light"] .focus-badge { background: rgba(200,224,96,calc(var(--card-opacity) * 0.333)) !important; }
.talos-dashboard[data-theme="light"] .talos-stats-overview .stat-card { border-color: rgba(0,0,0,0.12) !important; }
.talos-dashboard[data-theme="light"] .canvas-stat-card { border-color: rgba(0,0,0,0.12) !important; }
.talos-dashboard[data-theme="light"] .habit-icon-option:not(.selected) { border-color: rgba(0,0,0,0.15) !important; }

/* 浅色专属：badge 文字回落深色（绿/黄浅底对比不足，图形色保持品牌色） */
.talos-dashboard[data-theme="light"] .badge-green { color:#a8c040 !important; background: rgba(200,224,96,calc(var(--card-opacity) * 0.373)) !important; }
.talos-dashboard[data-theme="light"] .badge-yellow { color:#1a1a1f !important; background: rgba(251,191,36,calc(var(--card-opacity) * 0.373)) !important; }

/* ============================================================
   全局基础
   ============================================================ */
.talos-dashboard * { margin: 0; padding: 0; box-sizing: border-box; }
.talos-dashboard { height: 100%; }

.talos-dashboard .talos-app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  background: var(--wallpaper-bg, var(--bg-primary));
  color: var(--text-primary);
  font-size: var(--fs-body);
  overflow: auto;
  transition: background 0.3s ease, color 0.3s ease;
}

/* 浅色主题：米白底 */
.talos-dashboard[data-theme="light"] .talos-app {
  background: var(--bg-primary);
}

/* 自定义滚动条 */
.talos-dashboard ::-webkit-scrollbar { width: 6px; height: 6px; }
.talos-dashboard ::-webkit-scrollbar-track { background: transparent; }
.talos-dashboard ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
}
.talos-dashboard ::-webkit-scrollbar-thumb:hover { background: rgba(200, 224, 96, 0.3); }
.talos-dashboard[data-theme="light"] ::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}
.talos-dashboard[data-theme="light"] ::-webkit-scrollbar-thumb:hover {
  background: rgba(200, 224, 96, 0.4);
}

/* ============================================================
   新架构：顶部导航栏 + 中间主内容区 + 右侧今日面板
   ============================================================ */
.talos-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  z-index: 1;
}

/* 顶部导航栏 */
.talos-top-nav {
  height: 56px;
  flex-shrink: 0;
  background: rgba(var(--card-bg-rgb), 0.85);
  backdrop-filter: blur(var(--card-blur));
  -webkit-backdrop-filter: blur(var(--card-blur));
  border-bottom: 1px solid var(--divider-color);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 16px;
  position: relative;
  z-index: 100;
}

/* Logo 区 */
.talos-top-nav .logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.talos-top-nav .logo-icon {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.talos-top-nav .logo-icon svg { width: 100%; height: 100%; }
.talos-top-nav .logo-name {
  font-size: var(--fs-title);
  font-weight: 700;
}

/* 左侧 Ribbon 图标（缩小 Polaris 插件图标） */
.talos-ribbon-icon svg {
  width: 14px;
  height: 14px;
}

/* 看板导航 Tab */
.talos-top-nav .board-tabs {
  display: flex;
  gap: 2px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  padding: 3px;
  flex-shrink: 0;
}
.talos-top-nav .board-tab {
  position: relative;
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  font-size: var(--fs-caption);
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  background: transparent;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 5px;
}
.talos-top-nav .board-tab:hover { color: var(--text-primary); background: rgba(255, 255, 255, 0.04); }
.talos-top-nav .board-tab.active {
  background: #cfe36a;
  color: #0f0f13;
  font-weight: 600;
}

/* 全局搜索 */
.talos-top-nav .search-area {
  flex: 1;
  min-width: 200px;
  max-width: 600px;
  margin: 0 20px;
  position: relative;
}
/* 展开时：输入框与下拉连体（谷歌式）。search-area 自身不撑高，
   下拉绝对定位悬浮在输入框正下方，页面布局不被推挤 */
.talos-top-nav .search-area.tsd-open .search-input,
.talos-top-nav .search-area.tsd-open .search-input:focus {
  background: rgba(var(--card-bg-rgb), 0.98) !important;
  border: 1px solid rgba(200, 224, 96, 0.7) !important;
  border-bottom: none !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  box-shadow: none !important;
}
.talos-top-nav .search-area.tsd-open .search-kbd { display: none; }

.talos-top-nav .search-area .search-input {
  width: 100%;
  height: 36px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-md);
  padding: 0 14px 0 36px;
  color: var(--text-primary);
  font-size: 13px;
  outline: none;
  box-shadow: none;
  transition: all 0.2s ease;
  font-family: inherit;
}
.talos-top-nav .search-area .search-input::placeholder { color: var(--text-muted); opacity: 0.75; }
.talos-top-nav .search-area .search-input:focus {
  border-color: var(--focus-border) !important;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: none !important;
  outline: none;
}
.talos-top-nav .search-area .search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  pointer-events: none;
}
.talos-top-nav .search-area .search-kbd {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  pointer-events: none;
  user-select: none;
}

/* 顶部右侧操作区 */
.talos-top-nav .top-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: auto;
}
.talos-top-nav .quick-btn {
  padding: 8px 16px;
  background: var(--brand-green);
  color: #0f0f13;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--fs-body);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 6px;
}
.talos-top-nav .quick-btn:hover {
  background: var(--brand-green-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(200, 224, 96, 0.3);
}
.talos-top-nav .icon-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
  font-size: 16px;
}
.talos-top-nav .icon-btn:hover {
  border-color: rgba(200, 224, 96, 0.4);
  background: rgba(200, 224, 96, 0.08);
  color: var(--brand-green);
}

/* 主内容区（中间 + 右侧） */
.talos-content {
  display: flex;
  flex: 1;
  min-height: 0;
}

/* 中间主内容区 */
.talos-main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: var(--space-lg) var(--space-xl);
  transition: opacity 0.2s ease;
}

/* 右侧今日面板（固定） */
.talos-detail {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: var(--space-md) var(--space-lg);
  border-left: 1px solid var(--divider-color);
  overflow-y: auto;
  background: rgba(var(--card-bg-rgb), 0.2);
}

/* 数据概览（工作看板顶部） */
.talos-stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: var(--space-md);
  margin-bottom: 0;
}
.talos-stats-overview .stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  background: rgba(var(--card-bg-rgb), var(--card-opacity));
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  transition: all 0.2s ease;
  cursor: pointer;
}
.talos-stats-overview .stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}
.talos-stats-overview .stat-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.talos-stats-overview .stat-icon.green { background: rgba(200,224,96,calc(var(--card-opacity) * 0.2)); color: var(--brand-green); }
.talos-stats-overview .stat-icon.blue { background: rgba(96,165,250,calc(var(--card-opacity) * 0.2)); color: var(--info-blue); }
.talos-stats-overview .stat-icon.purple { background: rgba(167,139,250,calc(var(--card-opacity) * 0.2)); color: var(--brand-purple); }
.talos-stats-overview .stat-icon.red { background: rgba(248,113,113,calc(var(--card-opacity) * 0.2)); color: var(--danger-red); }
.talos-stats-overview .stat-icon.neutral { background: rgba(161,161,170,calc(var(--card-opacity) * 0.2)); color: #a1a1aa; }
.talos-stats-overview .stat-info { flex: 1; min-width: 0; }
.talos-stats-overview .stat-num {
  font-size: var(--fs-stat);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 2px;
}
.talos-stats-overview .stat-label {
  font-size: var(--fs-caption);
  color: var(--text-secondary);
}
.talos-stats-overview .stat-note {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}
.talos-stats-overview .stat-note-warn {
  color: var(--danger-red);
  font-weight: 600;
}

/* 任务详情抽屉 */
.talos-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 200;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}
.talos-drawer-overlay.open { opacity: 1; visibility: visible; }
.talos-drawer {
  position: fixed;
  top: 0;
  right: -420px;
  width: 420px;
  max-width: 90vw;
  height: 100vh;
  background: rgba(var(--card-bg-rgb), 0.98);
  backdrop-filter: blur(24px);
  border-left: 1px solid var(--border-color);
  z-index: 201;
  transition: right 0.3s ease;
  overflow-y: auto;
  padding: var(--space-xl);
  box-shadow: -6px 0 20px -6px rgba(0,0,0,0.3);
}
.talos-drawer.open { right: 0; }
.talos-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
}
.talos-drawer-title { font-size: var(--fs-title); font-weight: 700; }
.talos-drawer-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.06);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 16px;
  transition: all 0.15s ease;
}
.talos-drawer-close:hover { background: rgba(248,113,113,0.15); color: var(--danger-red); }

/* ============================================================
   玻璃卡片基类（参考图柔和卡片风格）
   ============================================================ */
.glass-card {
  position: relative;
  background: rgba(var(--card-bg-rgb), var(--card-opacity));
  backdrop-filter: blur(var(--card-blur));
  -webkit-backdrop-filter: blur(var(--card-blur));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.glass-card:hover {
  box-shadow: var(--shadow-card);
  transform: translateY(-2px);
  border-color: rgba(200, 224, 96, 0.35);
}

/* 知识板块分布：下钻行 hover */
.talos-subj-open { transition: background 0.15s ease; }
.talos-subj-toggle:hover { background: var(--control-bg); }
.talos-subj-open:hover { background: var(--control-bg); }
.talos-subj-file { transition: background 0.15s ease; }
.talos-subj-file:hover { background: rgba(255, 255, 255, 0.06); }
.talos-subj-file-list::-webkit-scrollbar { width: 6px; }
.talos-subj-file-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.12); border-radius: 3px; }

/* 无 hover 效果的静态玻璃卡片 */
.glass-card-static {
  position: relative;
  background: rgba(var(--card-bg-rgb), var(--card-opacity));
  backdrop-filter: blur(var(--card-blur));
  -webkit-backdrop-filter: blur(var(--card-blur));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}



/* ============================================================
   交互动效
   ============================================================ */

/* 看板切换 fade 过渡 */
@keyframes boardFadeOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}
@keyframes boardFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.board-fade-in { animation: boardFadeIn 0.25s ease both; }

/* 弹窗动画 */
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes overlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* 拖拽状态 */
.dragging {
  opacity: 0.8;
  transform: rotate(2deg) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  cursor: grabbing;
  z-index: 50;
}
/* 跟手拖拽：拖动中禁止过渡，避免卡片闪动/拖影 */
.dash-card.dragging { transition: none; }
/* 跟手拖拽：拖拽占位符（其他卡片围绕占位符让位） */
.dash-card-drag-placeholder,
.rp-drag-placeholder {
  background: rgba(200, 224, 96, 0.12);
  border: 2px dashed rgba(200, 224, 96, 0.5);
  border-radius: var(--radius-lg);
  box-sizing: border-box;
}
.drop-zone-active {
  background: rgba(200, 224, 96, 0.08);
  border: 2px dashed rgba(200, 224, 96, 0.5);
}

/* ============================================================
   右侧详情面板 · 默认空状态
   ============================================================ */
.detail-empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  text-align: center;
}
.detail-empty-state .empty-icon {
  font-size: 48px;
  filter: grayscale(1) brightness(0.7);
  margin-bottom: var(--space-md);
}
.detail-empty-state p {
  font-size: var(--fs-body);
  color: var(--text-muted);
  line-height: 1.6;
}

/* ---- 全局搜索框 ---- */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}
.search-box .search-icon {
  position: absolute;
  left: 12px;
  font-size: 14px;
  pointer-events: none;
  color: var(--text-muted);
}
.search-input {
  width: 100%;
  height: 36px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-md);
  padding: 0 56px 0 36px;
  color: var(--text-primary);
  font-size: 13px;
  outline: none;
  box-shadow: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.search-input::placeholder { color: var(--text-muted); opacity: 0.75; }
.search-input:focus {
  border-color: var(--focus-border) !important;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: none !important;
  outline: none;
}
.search-kbd {
  position: absolute;
  right: 10px;
  font-size: var(--fs-micro);
  color: rgba(255, 255, 255, 0.35);
  pointer-events: none;
  user-select: none;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

/* ---- 分区小标题 ---- */
.section-title {
  font-size: var(--fs-caption);
  color: var(--text-muted);
  padding: 0 var(--space-xs);
  letter-spacing: 0.5px;
  font-weight: 600;
  text-transform: uppercase;
}

/* ---- 数据概览小卡片 ---- */
.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
}
.stat-card {
  display: flex;
  align-items: stretch;
  gap: var(--space-sm);
  background: rgba(var(--card-bg-rgb), var(--card-opacity));
  backdrop-filter: blur(var(--card-blur));
  -webkit-backdrop-filter: blur(var(--card-blur));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 12px;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.stat-card:hover {
  border-color: rgba(200, 224, 96, 0.4);
  transform: translateY(-1px);
}
.stat-bar {
  width: 4px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}
.stat-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}
.stat-num {
  font-size: var(--fs-stat);
  font-weight: 700;
  line-height: 1.1;
}
.stat-label {
  font-size: var(--fs-caption);
  color: var(--text-secondary);
  margin-top: 2px;
  white-space: nowrap;
}

/* ---- 看板导航 ---- */
.icon-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  font-size: 16px;
  background: rgba(255, 255, 255, calc(var(--card-opacity) * 0.053));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}
.icon-btn:hover {
  border-color: rgba(200, 224, 96, 0.5);
  background: rgba(200, 224, 96, 0.08);
  color: var(--brand-green);
}

/* 今日打卡 · 添加新习惯按钮：品牌绿描边 + 实底 hover，暗色下清晰可辨 */
.compact-checkin-add {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(200, 224, 96, 0.35);
  border-radius: var(--radius-md);
  background: rgba(200, 224, 96, 0.08);
  color: var(--brand-green);
  cursor: pointer;
  transition: all 0.2s ease;
}
.compact-checkin-add:hover {
  background: var(--brand-green);
  border-color: var(--brand-green);
  color: #0f0f13;
}
.talos-dashboard[data-theme="light"] .compact-checkin-add {
  border-color: rgba(0, 0, 0, 0.15);
  background: rgba(0, 0, 0, 0.06);
  color: var(--text-brand);
}
.talos-dashboard[data-theme="light"] .compact-checkin-add:hover {
  background: var(--brand-green);
  border-color: var(--brand-green);
  color: #0f0f13;
}

/* ============================================================
   中间画布 · 工作看板组件
   ============================================================ */
.board-wrap { display: flex; flex-direction: column; gap: 0; }

/* ---- 通用模块元素 ---- */
.module-title {
  font-size: var(--fs-title);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}
.progress-track {
  flex: 1;
  height: 8px;
  background: var(--progress-track);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.progress-track.thin { height: 6px; }
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--brand-green), var(--brand-green-dark));
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}
.progress-text {
  font-size: var(--fs-caption);
  color: var(--text-secondary);
  min-width: 36px;
  text-align: right;
  font-weight: 600;
}
.progress-text.talos-task-progress {
  cursor: pointer;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  transition: background 0.15s, color 0.15s;
}
.progress-text.talos-task-progress:hover {
  background: rgba(200, 224, 96, 0.15);
  color: var(--brand-green);
}

/* 分段式进度条 */
.progress-segmented {
  display: flex;
  gap: 4px;
  flex: 1;
  align-items: center;
}
.progress-segmented .seg {
  flex: 1;
  height: 8px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, calc(var(--card-opacity) * 0.107));
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}
.progress-segmented .seg.active {
  background: linear-gradient(90deg, var(--brand-green), var(--brand-green-dark));
}
.progress-segmented .seg:hover {
  transform: scaleY(1.4);
}
.progress-segmented:hover .seg {
  background: rgba(200, 224, 96, 0.25);
}
.progress-segmented:hover .seg.active {
  background: linear-gradient(90deg, var(--brand-green), var(--brand-green-dark));
}
.progress-segmented .seg:hover ~ .seg {
  background: rgba(255, 255, 255, 0.08);
}
.talos-dashboard[data-theme="light"] .progress-segmented .seg {
  background: rgba(0, 0, 0, calc(var(--card-opacity) * 0.08));
}
/* 浅色主题：激活段与暗色保持同款品牌绿渐变（#c8e060 浅绿主色 → #a8c040 深一档），不引入规范外色值 */
.talos-dashboard[data-theme="light"] .progress-segmented .seg.active {
  background: linear-gradient(90deg, #c8e060, #a8c040);
}
.talos-dashboard[data-theme="light"] .progress-fill {
  background: linear-gradient(90deg, #c8e060, #a8c040);
}
.talos-dashboard[data-theme="light"] .progress-segmented:hover .seg {
  background: rgba(168, 192, 64, 0.3);
}
.talos-dashboard[data-theme="light"] .progress-segmented .seg:hover ~ .seg {
  background: rgba(0, 0, 0, 0.06);
}

/* 设置弹窗：背景壁纸缩略图卡片（苹果式预览） */
.talos-wp-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.talos-wp-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  width: auto;
}
.talos-wp-thumb {
  position: relative;
  width: 100%;
  height: 84px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  border: 1.5px solid var(--border-color);
  box-sizing: border-box;
  transition: box-shadow 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}
.talos-wp-card:hover .talos-wp-thumb {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
  transform: scale(1.03);
}
.talos-wp-thumb-custom {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border-style: dashed;
}
.talos-wp-thumb-custom .talos-wp-plus {
  font-size: 20px;
  color: var(--text-secondary);
  line-height: 1;
}
.talos-wp-thumb-none {
  background: rgba(255, 255, 255, 0.06);
}
.talos-wp-name {
  font-size: 12px;
  color: var(--text-secondary);
}
.talos-wp-card.active .talos-wp-thumb {
  border-color: var(--brand-green);
  box-shadow: 0 0 0 2px rgba(200, 224, 96, 0.35);
}
.talos-wp-card.active .talos-wp-name {
  color: var(--brand-green);
  font-weight: 600;
}
.talos-wp-card.active .talos-wp-thumb::after {
  content: "✓";
  position: absolute;
  top: -6px;
  right: -6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--brand-green);
  color: #1a1a1a;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
.talos-dashboard[data-theme="light"] .talos-wp-card.active .talos-wp-thumb {
  border-color: #9cb836;
  box-shadow: 0 0 0 2px rgba(150, 176, 48, 0.35);
}
.talos-dashboard[data-theme="light"] .talos-wp-card.active .talos-wp-name {
  color: #5a6c1a;
}
.talos-dashboard[data-theme="light"] .talos-wp-card.active .talos-wp-thumb::after {
  background: #9cb836;
  color: #fff;
}

/* ---- 徽章（参考图胶囊形标签：底浅字深） ---- */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-caption);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  font-weight: 600;
}
.badge .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.badge-green  { background: rgba(200,224,96,calc(var(--card-opacity) * 0.24));  color: var(--brand-green); }
.badge-green .dot  { background: var(--brand-green); }
.badge-yellow { background: rgba(251,191,36,calc(var(--card-opacity) * 0.24));  color: var(--priority-p1); }
.badge-yellow .dot { background: var(--priority-p1); }
.badge-gray   { background: rgba(156,163,175,calc(var(--card-opacity) * 0.24)); color: var(--text-secondary); }
.badge-gray .dot   { background: var(--text-secondary); }
.badge-red    { background: rgba(248,113,113,calc(var(--card-opacity) * 0.24));  color: var(--danger-red); }
.badge-red .dot    { background: var(--danger-red); }
.badge-purple { background: rgba(192,132,252,calc(var(--card-opacity) * 0.24)); color: var(--priority-p0); }
.badge-purple .dot { background: var(--priority-p0); }
.badge-blue   { background: rgba(96,165,250,calc(var(--card-opacity) * 0.24));  color: var(--info-blue); }
.badge-blue .dot   { background: var(--info-blue); }

/* ---- 主/次按钮 ---- */
.btn-primary {
  background: var(--brand-green);
  color: #0f0f13;
  border: none;
  padding: 10px 20px;
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: var(--fs-body);
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: var(--brand-green-dark);
  color: #0f0f13;
  transform: translateY(-1px);
}
.btn-primary:active {
  background: #96b030;
  color: #0f0f13;
  transform: translateY(0);
}

/* 看板头部"新建"按钮：玻璃化半透明绿，与整体透明描边按钮统一 */
.talos-header-new,
.talos-quick-note,
.talos-focus-edit {
  background: rgba(200, 224, 96, calc(var(--card-opacity) * 0.187));
  color: var(--brand-green);
  border: 1px solid rgba(200, 224, 96, 0.35);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 6px 14px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}
.talos-header-new:hover,
.talos-quick-note:hover,
.talos-focus-edit:hover {
  background: rgba(200, 224, 96, calc(var(--card-opacity) * 0.32));
  border-color: rgba(200, 224, 96, 0.6);
  color: var(--brand-green);
  transform: translateY(-1px);
}
/* 焦点卡"查看详情"：与"继续编辑"同尺寸，次级描边 */
.talos-focus-detail {
  background: rgba(255,255,255,0.04);
  color: var(--text-secondary);
  border: 1px solid rgba(255,255,255,0.14);
  padding: 6px 14px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}
.talos-focus-detail:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(200,224,96,0.5);
  color: var(--brand-green);
}
.talos-header-new:active,
.talos-quick-note:active,
.talos-focus-edit:active {
  background: rgba(200, 224, 96, calc(var(--card-opacity) * 0.4));
  transform: translateY(0);
}
.talos-dashboard[data-theme="light"] .talos-header-new,
.talos-dashboard[data-theme="light"] .talos-quick-note,
.talos-dashboard[data-theme="light"] .talos-focus-edit {
  background: rgba(168, 192, 64, calc(var(--card-opacity) * 0.213));
  color: #5a6c1a;
  border-color: rgba(150, 176, 48, 0.45);
}
.talos-dashboard[data-theme="light"] .talos-header-new:hover,
.talos-dashboard[data-theme="light"] .talos-quick-note:hover,
.talos-dashboard[data-theme="light"] .talos-focus-edit:hover {
  background: rgba(168, 192, 64, calc(var(--card-opacity) * 0.32));
  border-color: rgba(150, 176, 48, 0.7);
}
.talos-dashboard[data-theme="light"] .talos-header-new:active,
.talos-dashboard[data-theme="light"] .talos-quick-note:active,
.talos-dashboard[data-theme="light"] .talos-focus-edit:active {
  background: rgba(168, 192, 64, calc(var(--card-opacity) * 0.427));
}
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: var(--radius-lg);
  font-size: var(--fs-body);
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}
.btn-secondary:hover {
  background: rgba(255,255,255,calc(var(--card-opacity) * 0.133));
  border-color: rgba(200,224,96,0.9);
  color: var(--brand-green);
  transform: none;
  box-shadow: none;
}
.btn-secondary:active {
  background: rgba(200,224,96,0.15);
  border-color: var(--brand-green);
  color: var(--brand-green);
  transform: none;
  box-shadow: none;
}
.talos-dashboard[data-theme="light"] .btn-secondary {
  border-color: rgba(0, 0, 0, 0.16);
  color: #374151;
}
.talos-dashboard[data-theme="light"] .btn-secondary:hover {
  background: rgba(0,0,0,0.06);
  border-color: rgba(168,192,64,0.9);
  color: #7a8c1a;
}
.talos-dashboard[data-theme="light"] .btn-secondary:active {
  background: rgba(168,192,64,0.15);
  border-color: #a8c040;
  color: #7a8c1a;
}

/* ---- 模块1：4 统计指标 ---- */
.canvas-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
}
.canvas-stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  cursor: pointer;
  padding: var(--space-lg);
  background: rgba(var(--card-bg-rgb), var(--card-opacity));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  transition: all 0.2s ease;
}
.canvas-stat-card:hover {
  border-color: rgba(200, 224, 96, 0.4);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}
.canvas-stat-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  background: rgba(200,224,96,0.12);
}
.canvas-stat-icon.green { background: rgba(200,224,96,calc(var(--card-opacity) * 0.2)); color: var(--brand-green); }
.canvas-stat-icon.blue { background: rgba(96,165,250,calc(var(--card-opacity) * 0.2)); color: var(--info-blue); }
.canvas-stat-icon.purple { background: rgba(167,139,250,calc(var(--card-opacity) * 0.2)); color: var(--brand-purple); }
.canvas-stat-icon.red { background: rgba(248,113,113,calc(var(--card-opacity) * 0.2)); color: var(--danger-red); }
.canvas-stat-info { flex: 1; min-width: 0; }
.canvas-stat-num { font-size: var(--fs-stat); font-weight: 700; line-height: 1.1; margin-bottom: 2px; }
.canvas-stat-label { font-size: var(--fs-caption); color: var(--text-secondary); }
.canvas-stat-note { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.canvas-stat-card.danger .canvas-stat-num,
.canvas-stat-card.danger .canvas-stat-icon { color: var(--danger-red); }

/* ---- 模块2：今日焦点大卡片 ---- */
.focus-card { padding: var(--space-xl); cursor: pointer; }
.focus-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(200,224,96,calc(var(--card-opacity) * 0.2));
  color: var(--text-brand);
  font-size: var(--fs-caption);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  margin-bottom: var(--space-md);
  font-weight: 600;
}
.focus-title {
  font-size: var(--fs-hero);
  font-weight: 700;
  margin-bottom: var(--space-lg);
  line-height: 1.3;
}
.focus-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: auto;
  flex-shrink: 0;
}
.focus-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
  font-size: var(--fs-caption);
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
}
.focus-progress-row { display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-lg); }
.focus-actions { display: flex; gap: var(--space-md); }

/* ---- 中部两列布局 ---- */
.mid-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: var(--space-lg);
  align-items: stretch;
}
.mid-right { display: flex; flex-direction: column; gap: var(--space-lg); }

/* ---- 模块3：最近任务列表 ---- */
.list-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.15s ease;
}
.list-item + .list-item { border-top: 1px solid var(--divider-color); }
.list-item:hover { background: rgba(255, 255, 255, 0.03); }
.list-item-icon { font-size: 16px; flex-shrink: 0; }
.list-item-info { flex: 1; min-width: 0; }
.list-item-name {
  font-size: var(--fs-body);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list-item-time { font-size: var(--fs-micro); color: var(--text-muted); margin-top: 2px; }

/* ---- 模块4：快捷操作 4 宫格 ---- */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
}

/* ---- 模块5：每日打卡 + 本周日历 ---- */
.checkin-card { display: flex; flex-direction: column; }
.checkin-top { display: flex; align-items: center; gap: var(--space-lg); margin-bottom: var(--space-lg); }
.checkin-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  background: transparent;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.checkin-btn:hover { border-color: rgba(200,224,96,0.6); color: var(--brand-green); }
.checkin-btn.checked {
  background: rgba(200, 224, 96, calc(var(--card-opacity) * 1.2));
  border: 2px solid var(--brand-green);
  color: #0f0f13;
  box-shadow: var(--shadow-glow-green);
}
.checkin-status-text { font-size: var(--fs-body); font-weight: 700; margin-bottom: 4px; }
.checkin-streak { font-size: var(--fs-caption); color: var(--text-secondary); }
.checkin-streak b { color: var(--text-brand); font-size: 18px; }
.week-calendar { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.week-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: var(--fs-micro);
  color: var(--text-muted);
}
.week-day .day-cell {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  font-size: var(--fs-caption);
  color: var(--text-secondary);
  transition: all 0.2s ease;
  cursor: pointer;
}
.week-day .day-cell:hover {
  border-color: rgba(200,224,96,0.5);
  background: rgba(200,224,96,0.08);
}
.week-day.checked .day-cell {
  background: rgba(200,224,96,0.2);
  border-color: rgba(200,224,96,0.5);
  color: var(--text-brand);
  font-weight: 600;
}
.week-day.today .day-cell {
  box-shadow: 0 0 0 2px rgba(200,224,96,0.3);
  border-color: var(--brand-green);
  color: var(--text-brand);
  font-weight: 700;
}
.week-day.selected .day-cell {
  background: var(--brand-green);
  border-color: var(--brand-green);
  color: #0f0f13;
  font-weight: 700;
}

/* ---- 右侧栏紧凑打卡 ---- */
.compact-habit-item { transition: background 0.15s ease; }
.compact-habit-item:hover { background: rgba(255, 255, 255, 0.05); }
.compact-habit-item.checked { background: rgba(34, 197, 94, 0.08); }
.talos-dashboard[data-theme="light"] .compact-habit-item:hover { background: rgba(0, 0, 0, 0.05); }
.compact-habit-check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--check-border);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #fff;
  font-weight: 700;
  line-height: 1;
  transition: all 0.2s ease;
}
.compact-habit-name {
  flex: 1;
  font-size: 12px;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;
}
.compact-habit-item.checked .compact-habit-name { color: var(--text-muted); text-decoration: line-through; }
.compact-habit-streak { font-size: 10px; color: var(--text-muted); flex-shrink: 0; }

/* 右侧栏打卡区容器：内部各卡片间距统一为 --space-md（消除 margin+gap 叠加） */
.talos-today-checkin {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* 右侧栏紧凑周打卡日历 */
.compact-week-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-top: var(--space-md);
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
}
.compact-week-calendar .week-day { gap: 3px; cursor: pointer; }
.compact-week-calendar .day-cell { width: 26px; height: 26px; font-size: 10px; }

/* ---- 模块6：项目时间线甘特图 ---- */
.gantt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}
.gantt-view-toggle {
  display: flex;
  gap: 2px;
  background: rgba(255, 255, 255, calc(var(--card-opacity) * 0.067));
  border-radius: var(--radius-md);
  padding: 3px;
}
.gantt-view-btn {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--fs-caption);
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
  font-weight: 500;
}
.gantt-view-btn.active {
  background: #cfe36a;
  color: #0f0f13;
  font-weight: 600;
}
.gantt-view-btn:hover:not(.active) {
  background: rgba(255,255,255,0.04);
  color: #f0f0f3;
}
.gantt-view-btn:active:not(.active) {
  background: rgba(255,255,255,0.08);
  color: #f0f0f3;
}
.talos-dashboard[data-theme="light"] .gantt-view-btn:hover:not(.active),
.talos-dashboard[data-theme="light"] .gantt-view-btn:active:not(.active) {
  background: rgba(0,0,0,0.04);
  color: #1a1a1a;
}
.gantt-plot { position: relative; padding-top: 28px; }
.gantt-range-label {
  position: absolute;
  top: 5px;
  left: 96px;
  font-size: var(--fs-micro);
  color: var(--text-muted);
  z-index: 1;
  font-weight: 500;
}
.gantt-month-line {
  position: absolute;
  top: 28px;
  bottom: 0;
  width: 1px;
  background: rgba(255, 255, 255, 0.14);
  pointer-events: none;
}
.talos-dashboard[data-theme="light"] .gantt-month-line { background: rgba(0, 0, 0, 0.14); }
.gantt-today-tag {
  position: absolute;
  top: 4px;
  transform: translateX(-50%);
  color: var(--text-brand);
  font-size: var(--fs-micro);
  z-index: 2;
  font-weight: 600;
}
.gantt-today-line {
  position: absolute;
  top: 28px;
  bottom: 0;
  width: 2px;
  background: rgba(200, 224, 96, 0.5);
  transform: translateX(-1px);
  pointer-events: none;
}
.gantt-grid {
  display: grid;
  grid-template-columns: 96px 1fr;
  column-gap: var(--space-sm);
  row-gap: 6px;
  align-items: center;
}
.gantt-row-label {
  font-size: var(--fs-caption);
  color: var(--text-secondary);
  white-space: nowrap;
  font-weight: 500;
}
.gantt-scale {
  position: relative;
  height: 20px;
  font-size: var(--fs-micro);
  color: var(--text-muted);
}
.gantt-tick { position: absolute; transform: translateX(-50%); top: 0; }
.gantt-row-track {
  position: relative;
  height: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  overflow: hidden;
}
.gantt-bar {
  position: absolute;
  top: 0;
  height: 20px;   /* 与 .gantt-row-track 同高，深浅主题一致 */
  border-radius: 10px;
  opacity: 0.9;
  cursor: grab;
  transition: opacity 0.2s ease, transform 0.15s ease;
}
.gantt-bar:hover { opacity: 1; transform: scaleY(1.08); }
.gantt-bar.dragging { cursor: grabbing; opacity: 0.85; transition: none; }
.gantt-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
  z-index: 2;
}
.gantt-handle-left { left: 0; border-radius: 10px 0 0 10px; }
.gantt-handle-right { right: 0; border-radius: 0 10px 10px 0; }
.gantt-handle:hover { background: rgba(255, 255, 255, 0.25); }

/* ---- 模块7：任务看板三列 ---- */
.kanban-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}
.filter-tabs { display: flex; gap: 6px; flex-wrap: wrap; }

/* ---- 搜索按钮（点击展开） ---- */
.talos-dashboard .kanban-search-wrap { display: flex; align-items: center; }
.talos-dashboard .kanban-search-toggle {
  width: 36px !important;
  height: 36px !important;
  padding: 0 !important;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.talos-dashboard .kanban-search-toggle svg { display: block; }
.talos-dashboard .kanban-search-toggle:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.3);
  color: #f0f0f3;
}
.talos-dashboard .kanban-search-box { display: none; position: relative; align-items: center; }
.talos-dashboard .kanban-search-wrap.expanded .kanban-search-box { display: flex; }
.talos-dashboard .kanban-search-wrap.expanded .kanban-search-toggle { display: none; }
.talos-dashboard .kanban-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  z-index: 2;
  pointer-events: none;
  display: flex;
  align-items: center;
}
.talos-dashboard .kanban-search-input {
  height: 36px !important;
  padding: 0 14px 0 36px !important;
  border: 1px solid rgba(255,255,255,0.15) !important;
  border-radius: var(--radius-md);
  background: rgba(255,255,255,0.04);
  color: var(--text-primary) !important;
  font-size: 13px;
  width: 220px !important;
  outline: none !important;
  box-shadow: none !important;
  transition: all 0.2s ease;
  font-family: inherit;
  box-sizing: border-box;
}
.talos-dashboard .kanban-search-input::placeholder { color: var(--text-muted) !important; opacity: 0.75; }
.talos-dashboard .kanban-search-input:focus {
  border-color: var(--focus-border) !important;
  background: rgba(255,255,255,0.06);
  box-shadow: none !important;
  outline: none !important;
}
.talos-dashboard .kanban-search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 12px;
  color: var(--text-muted);
  padding: 2px 6px;
  border-radius: 4px;
  z-index: 2;
}
.talos-dashboard .kanban-search-clear:hover { color: #f0f0f3; background: rgba(255,255,255,0.1); }

/* ---- 搜索结果反馈 ---- */
.talos-dashboard .kanban-search-result {
  font-size: 12px;
  color: var(--text-muted);
  margin: -4px 0 10px;
  padding-left: 2px;
}
.talos-dashboard .kanban-search-result b { color: var(--text-brand); font-weight: 700; }
.talos-dashboard .search-hit {
  background: rgba(200,224,96,0.35);
  color: inherit;
  border-radius: 2px;
  padding: 0 1px;
}
.talos-dashboard[data-theme="light"] .search-hit { background: rgba(200,224,96,0.55); }
.filter-tab {
  border: 1px solid rgba(255,255,255,0.1);
  background: transparent;
  color: #a1a1aa;
  font-size: var(--fs-caption);
  padding: 6px 14px;
  border-radius: var(--radius-md);
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
  font-weight: 500;
}
.filter-tab:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.5);
  color: #f0f0f3;
}
.filter-tab:active:not(.active) {
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.6);
  color: #f0f0f3;
}
.talos-dashboard[data-theme="light"] .filter-tab {
  border-color: rgba(0,0,0,0.15);
  color: #52525b;
}
.talos-dashboard[data-theme="light"] .filter-tab:hover,
.talos-dashboard[data-theme="light"] .filter-tab:active:not(.active) {
  background: rgba(0,0,0,0.06);
  border-color: rgba(0,0,0,0.5);
  color: #1a1a1a;
}
.filter-tab.active {
  background: var(--brand-green);
  border-color: var(--brand-green);
  color: #0f0f13;
  font-weight: 600;
}
.kanban-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}
.kanban-columns.single { grid-template-columns: 1fr; }
.kanban-column {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  min-height: 140px;
}
.kanban-column.hidden { display: none; }
.kanban-col-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--fs-caption);
  color: var(--text-secondary);
  padding: 0 4px 10px;
  border-bottom: 1px solid var(--divider-color);
  font-weight: 600;
}
.kanban-col-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.kanban-col-count {
  margin-left: auto;
  background: rgba(255, 255, 255, calc(var(--card-opacity) * 0.08));
  border-radius: var(--radius-full);
  padding: 2px 10px;
  font-size: var(--fs-micro);
  font-weight: 600;
}
.kanban-empty {
  font-size: var(--fs-caption);
  color: var(--text-muted);
  text-align: center;
  padding: var(--space-xl) 0;
}
.task-card {
  background: rgba(var(--card-bg-rgb), var(--card-opacity));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  cursor: pointer;
  box-shadow: var(--shadow-card);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
  border-color: rgba(200, 224, 96, 0.45);
}
.task-card.status-todo { border-left: 2px solid rgba(156,163,175,0.6); }
.task-card.status-doing { border-left: 2px solid rgba(59,130,246,0.6); }
.task-card.status-done { border-left: 2px solid rgba(34,197,94,0.6); }
.task-card.status-overdue { border-left: 2px solid rgba(239,68,68,0.6); }
.task-card-top { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
.task-priority {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: var(--fs-micro);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-weight: 600;
}
.task-priority .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.task-priority.p0 { background: rgba(192,132,252,0.2); color: var(--priority-p0); }
.task-priority.p1 { background: rgba(251,191,36,0.2);  color: var(--priority-p1); }
.task-priority.p2 { background: rgba(107,114,128,0.2); color: var(--text-secondary); }
.task-due { margin-left: auto; font-size: var(--fs-micro); color: var(--text-muted); white-space: nowrap; }
.task-due.overdue { color: var(--danger-red); font-weight: 600; }
.task-title { font-size: var(--fs-body); line-height: 1.5; margin-bottom: 12px; font-weight: 500; }
.task-progress-row { display: flex; align-items: center; gap: 10px; }

/* ============================================================
   中间画布 · 知识库看板组件
   ============================================================ */

/* ---- 折线图 + 饼图两列布局 ---- */
.knowledge-charts {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: var(--space-lg);
}
.chart-wrap { position: relative; height: 260px; }
.chart-wrap.pie { height: 240px; }

/* ---- RSS 资讯订阅 ---- */
.rss-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.15s ease;
}
.rss-item + .rss-item { border-top: 1px solid var(--divider-color); }
.rss-item:hover { background: rgba(255, 255, 255, 0.03); }
.rss-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-green);
  flex-shrink: 0;
}
.rss-info { flex: 1; min-width: 0; }
.rss-title {
  font-size: var(--fs-body);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rss-meta {
  font-size: var(--fs-micro);
  color: var(--text-muted);
  margin-top: 2px;
}
.rss-time { flex-shrink: 0; font-size: var(--fs-micro); color: var(--text-muted); white-space: nowrap; }

/* ============================================================
   中间画布 · 复习看板组件
   ============================================================ */

/* ---- 进度总览 + 今日复习两列布局 ---- */
.review-mid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: var(--space-lg);
}

/* ---- 环形进度条 ---- */
.ring-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xl);
  padding: var(--space-lg) 0;
}
.ring {
  position: relative;
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}
.ring svg { transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: rgba(255, 255, 255, calc(var(--card-opacity) * 0.107)); stroke-width: 12; }
.ring-fill {
  fill: none;
  stroke: url(#ringGradient);
  stroke-width: 12;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.6s ease;
}
.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.ring-num { font-size: 28px; font-weight: 700; line-height: 1; }
.ring-sub { font-size: var(--fs-micro); color: var(--text-muted); margin-top: 4px; }
.ring-detail { display: flex; flex-direction: column; gap: var(--space-md); }
.ring-detail-item { display: flex; flex-direction: column; gap: 2px; }
.ring-detail-num { font-size: var(--fs-title); font-weight: 700; }
.ring-detail-label { font-size: var(--fs-caption); color: var(--text-secondary); }

/* ---- 复习任务清单 ---- */
.review-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.15s ease;
}
.review-item + .review-item { border-top: 1px solid var(--divider-color); }
.review-item:hover { background: rgba(255, 255, 255, 0.03); }
.review-check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--check-border);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  background: transparent;
  padding: 0;
  font: inherit;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
}
.review-item.completed .review-check {
  background: var(--brand-green);
  border-color: var(--brand-green);
  color: #0f0f13;
  font-weight: 700;
}
.talos-dashboard[data-theme="light"] .review-check { border-color: rgba(0, 0, 0, 0.28); color: rgba(0, 0, 0, 0.45); }
.review-item.completed .review-text {
  text-decoration: line-through;
  color: var(--text-muted);
}
.review-info { flex: 1; min-width: 0; }
.review-text { font-size: var(--fs-body); transition: color 0.2s ease; }
.review-subject { font-size: var(--fs-micro); color: var(--text-muted); margin-top: 2px; }
.review-skip {
  flex-shrink: 0;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: var(--fs-caption);
  padding: 3px 12px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.15s ease;
}
.review-skip:hover {
  border-color: var(--brand-green);
  color: var(--brand-green);
  background: rgba(200, 224, 96, calc(var(--card-opacity) * 0.107));
}

.review-wrong {
  flex-shrink: 0;
  background: transparent;
  border: 1px solid rgba(251, 146, 60, 0.4);
  color: #fbbf24;
  font-size: var(--fs-caption);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.15s ease;
}
.review-wrong:hover {
  border-color: #f59e0b;
  background: rgba(251, 146, 60, calc(var(--card-opacity) * 0.16));
  color: #fb923c;
}

/* ---- 备忘录随手记 ---- */
.memo-textarea {
  width: 100%;
  min-height: 88px;
  resize: vertical;
  background: rgba(var(--card-bg-rgb), 0.5);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  color: var(--text-primary);
  font-size: var(--fs-body);
  font-family: inherit;
  line-height: 1.6;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.memo-textarea::placeholder { color: var(--text-muted); }
.memo-textarea:focus {
  border-color: var(--focus-border) !important;
  box-shadow: none !important;
}
.memo-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-md);
}

/* ============================================================
   右侧详情面板 · 多类型详情模板
   ============================================================ */
.detail-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* 区块容器 */
.detail-section {
  background: rgba(var(--card-bg-rgb), var(--card-opacity));
  backdrop-filter: blur(var(--card-blur));
  -webkit-backdrop-filter: blur(var(--card-blur));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-card);
}

/* 区块标题 */
.detail-section-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--fs-title);
  font-weight: 700;
  line-height: 1.2;
  padding-left: 15px;
  margin-bottom: var(--space-md);
  position: relative;
}
.detail-section-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  border-radius: 2px;
  background: var(--brand-green);
}

/* ---- 类型 A：焦点任务详情卡 ---- */
.detail-task-id {
  font-size: var(--fs-caption);
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-bottom: 4px;
}
.detail-task-title {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: var(--space-md);
}
.detail-badge-row {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-bottom: var(--space-md);
}
.detail-progress-label {
  display: flex;
  justify-content: space-between;
  font-size: var(--fs-caption);
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
}

/* 今日待办就地展开块：左竖线与所属任务行同色，形成"从该任务长出"的连接 */
.talos-todo-expand {
  margin: 0 0 4px 10px;
  padding: 10px 12px 12px 16px;
  border-left: 2px solid var(--brand-green);
  border-radius: 0 var(--radius-md) var(--radius-md) var(--radius-md);
  background: rgba(255, 255, 255, 0.02);
}
.talos-dashboard[data-theme="light"] .talos-todo-expand {
  background: rgba(0, 0, 0, 0.02);
}
/* 展开态任务行：品牌色淡底，标识当前展开来源 */
.talos-todo-item.todo-expanded {
  background: rgba(200, 224, 96, 0.10);
}
.talos-dashboard[data-theme="light"] .talos-todo-item.todo-expanded {
  background: rgba(200, 224, 96, 0.18);
}
/* 未展开行 hover 淡底（与今日打卡一致）；展开行不加，保留品牌绿底 */
.talos-todo-item:not(.todo-expanded):hover {
  background: rgba(255, 255, 255, 0.05);
}
.talos-dashboard[data-theme="light"] .talos-todo-item:not(.todo-expanded):hover {
  background: rgba(0, 0, 0, 0.05);
}
/* 展开块内紧凑排版：状态/优先级按钮均分不溢出 */
.talos-todo-expand .status-segmented { flex: 1; }
.talos-todo-expand .status-seg { flex: 1; text-align: center; padding: 6px 6px; font-size: 11px; }
.talos-todo-expand .detail-edit-row { padding: 10px 10px; }
.talos-todo-expand .detail-edit-row-label { min-width: 56px; font-size: 11px; }
.talos-todo-expand .detail-edit-row-input { min-width: 0; flex: 1; padding: 5px 8px; font-size: 11px; }
.talos-todo-expand .detail-grid { margin: 10px 0; }
.talos-todo-expand .badge { font-size: 10px; }

/* 2×2 信息网格 */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
  margin: var(--space-md) 0;
}
.detail-grid-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.detail-grid-label { font-size: var(--fs-micro); color: var(--text-muted); }
.detail-grid-value {
  font-size: var(--fs-body);
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}
.detail-grid-value .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.talos-dashboard[data-theme="light"] .detail-grid-item {
  background: rgba(0, 0, 0, 0.03);
}

/* 可编辑字段区域 */
.detail-edit-list {
  margin: var(--space-md) 0;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.detail-edit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-color);
  gap: 12px;
}
.detail-edit-row:last-child {
  border-bottom: none;
}
.detail-edit-row:hover {
  background: rgba(255, 255, 255, 0.02);
}
.detail-edit-row-label {
  font-size: var(--fs-caption);
  color: var(--text-secondary);
  flex-shrink: 0;
  min-width: 70px;
  font-weight: 500;
}
.detail-edit-row-value {
  font-size: var(--fs-body);
  color: var(--text-primary);
  text-align: right;
  flex: 1;
}
.detail-edit-row-value.readonly {
  color: var(--text-muted);
  cursor: not-allowed;
  opacity: 0.7;
}
.detail-edit-row-select,
.detail-edit-row-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 6px 10px;
  font-size: var(--fs-caption);
  color: var(--text-primary);
  cursor: pointer;
  outline: none;
  transition: all 0.15s;
  text-align: right;
  min-width: 100px;
  flex-shrink: 0;
}
.detail-edit-row-select:focus,
.detail-edit-row-input:focus {
  border-color: var(--focus-border) !important;
  background: rgba(200, 224, 96, 0.06);
}
.detail-edit-row-input {
  cursor: text;
  text-align: left;
}
.talos-dashboard[data-theme="light"] .detail-edit-row-select,
.talos-dashboard[data-theme="light"] .detail-edit-row-input {
  background: rgba(0, 0, 0, 0.03);
  color: #1a1a1a;
}
.talos-dashboard[data-theme="light"] .detail-edit-row:hover {
  background: rgba(0, 0, 0, 0.02);
}

/* 日期字段（可点选，仿飞书多维表格）：按钮外观沿用输入框，点击弹月历 */
.detail-edit-row-input.date-field {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  text-align: left;
  min-width: 100px;
  font-family: inherit;
}
.detail-edit-row-input.date-field:hover {
  border-color: var(--brand-green);
  background: rgba(200, 224, 96, 0.06);
}
.date-field-value.empty {
  color: var(--text-muted);
}
.date-field-icon {
  font-size: 12px;
  opacity: 0.7;
  flex-shrink: 0;
}

/* 日期选择浮层（月历点选面板） */
.talos-date-pop {
  position: fixed;
  z-index: 99999;
  width: 236px;
  background: rgba(var(--card-bg-rgb), 0.98);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
  padding: 10px;
  font-size: 12px;
  color: var(--text-primary);
}
/* 日期浮层挂载在 document.body（不在 .talos-dashboard 作用域内），浅色变量取不到会回退暗色；
   openDatePicker 会把插件主题写入浮层的 data-theme，据此补全浅色 token */
.talos-date-pop[data-theme="light"] {
  --card-bg-rgb: 255, 255, 255;
  --border-color: rgba(0, 0, 0, 0.06);
  --text-primary: #1a1a1f;
  --text-secondary: #52525b;
  --text-muted: #71717a;
  --control-bg: rgba(0, 0, 0, 0.06);
  --text-brand: #1a1a1f;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
}
.talos-date-pop-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.talos-date-nav {
  background: var(--control-bg);
  border: none;
  border-radius: 6px;
  padding: 2px 10px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}
.talos-date-nav:hover {
  color: var(--text-primary);
  background: rgba(200, 224, 96, 0.15);
}
.talos-date-pop-title {
  font-size: 13px;
  font-weight: 600;
}
.talos-date-pop-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
}
.talos-date-pop-week span {
  text-align: center;
  font-size: 11px;
  color: var(--text-muted);
  padding: 3px 0;
}
.talos-date-pop-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 8px;
}
.talos-date-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  cursor: pointer;
  font-size: 12px;
  color: var(--text-secondary);
  transition: all 0.12s;
}
.talos-date-cell:hover {
  background: rgba(200, 224, 96, 0.15);
  color: var(--text-primary);
}
.talos-date-cell.today {
  outline: 1.5px solid var(--brand-green);
}
.talos-date-cell.sel {
  background: var(--brand-green);
  color: #1a1a1a;
  font-weight: 700;
}
.talos-date-pop-foot {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--border-color);
  padding-top: 8px;
}
.talos-date-today,
.talos-date-clear {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  transition: all 0.15s;
}
.talos-date-today:hover,
.talos-date-clear:hover {
  color: var(--text-brand);
  background: rgba(200, 224, 96, 0.12);
}

/* 状态分段控件 */
.status-segmented {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  padding: 3px;
  gap: 2px;
  flex-shrink: 0;
}
.status-seg {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--fs-caption);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  font-weight: 500;
}
.status-seg:hover {
  background: rgba(255, 255, 255, 0.06);
}
.status-seg.active {
  background: var(--brand-green);
  color: #0f0f13;
  font-weight: 700;
}
.status-seg.active[data-status="todo"] {
  background: #9ca3af;
  color: #0f0f13;
}
.status-seg.active[data-status="doing"] {
  background: var(--info-blue);
  color: #0f0f13;
}
.status-seg.active[data-status="done"] {
  background: var(--brand-green);
  color: #0f0f13;
}
.talos-dashboard[data-theme="light"] .status-segmented {
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 2px;
}
.talos-dashboard[data-theme="light"] .status-seg {
  color: #374151;
}
.talos-dashboard[data-theme="light"] .status-seg:hover {
  background: rgba(0, 0, 0, 0.06);
}

/* 表单内优先级分段控件：与输入框同高同宽，三档均分 */
.talos-dashboard .form-priority-seg { width: 100%; height: 36px; }
.talos-dashboard .form-priority-seg .status-seg { flex: 1; display: flex; align-items: center; justify-content: center; height: 100%; padding: 0; font-size: 12px; }

/* 焦点任务详情状态行：分段按钮均分剩余宽度，避免第三个按钮被 space-between 推到右缘贴边/截断 */
.detail-edit-row .status-segmented {
  flex: 1;
  min-width: 0;
}
.detail-edit-row .status-seg {
  flex: 1;
  text-align: center;
  padding: 6px 6px;
}

/* 展开块分段按钮：显式压过 Obsidian 全局 button 样式（浅色下未选中必须透明，不能渲染成深灰底） */
.talos-dashboard[data-theme="light"] .status-seg:not(.active) {
  background: transparent !important;
  color: #374151 !important;
}
.talos-dashboard[data-theme="light"] .status-seg:hover:not(.active) {
  background: rgba(0, 0, 0, 0.08) !important;
  color: #374151 !important;
}
.talos-dashboard[data-theme="dark"] .status-seg:not(.active) {
  background: transparent !important;
}
.talos-dashboard[data-theme="dark"] .status-seg:hover:not(.active) {
  background: rgba(255, 255, 255, 0.08) !important;
}
/* 浅色次按钮加固：边框/底色不被 Obsidian 全局样式冲掉 */
.talos-dashboard[data-theme="light"] .btn-secondary {
  background: transparent !important;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
  color: #374151 !important;
}

/* 底部双按钮 */
.detail-actions { display: flex; gap: var(--space-sm); }
.detail-actions .btn-primary,
.detail-actions .btn-secondary { flex: 1; padding: 10px 0; }

/* ---- 本周学习进度 ---- */
.learning-item {
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  margin-bottom: 8px;
  transition: all 0.15s ease;
}
.learning-item:last-child { margin-bottom: 0; }
.learning-item:hover { background: rgba(200, 224, 96, 0.05); border-color: rgba(200, 224, 96, 0.25); }
.talos-dashboard[data-theme="light"] .learning-item { background: rgba(0, 0, 0, 0.02); }
.talos-dashboard[data-theme="light"] .learning-item:hover { background: rgba(200, 224, 96, 0.08); border-color: rgba(200, 224, 96, 0.3); }
.learning-top {
  display: flex;
  justify-content: space-between;
  font-size: var(--fs-caption);
  margin-bottom: 6px;
}
.learning-name { color: var(--text-secondary); }
.learning-pct { color: var(--text-secondary); font-weight: 600; }
.learning-pct.done { color: var(--text-brand); }

/* 右侧栏本周学习子项卡片 */
.talos-learning-item {
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  margin-bottom: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.talos-learning-item:hover { background: rgba(200, 224, 96, 0.05); border-color: rgba(200, 224, 96, 0.25); }
.talos-dashboard[data-theme="light"] .talos-learning-item { background: rgba(0, 0, 0, 0.02); }
.talos-dashboard[data-theme="light"] .talos-learning-item:hover { background: rgba(200, 224, 96, 0.08); border-color: rgba(200, 224, 96, 0.3); }

/* ---- 今日日记条目 ---- */
.diary-item {
  display: flex;
  gap: var(--space-sm);
  align-items: flex-start;
  padding: 10px 0;
  font-size: var(--fs-caption);
  color: var(--text-secondary);
  line-height: 1.6;
}
.diary-item + .diary-item { border-top: 1px solid var(--divider-color); }
.diary-type { color: var(--text-primary); font-weight: 600; }
.diary-icon { flex-shrink: 0; }

/* ---- 类型 B/C：图表与列表详情 ---- */
.detail-desc {
  font-size: var(--fs-caption);
  color: var(--text-muted);
  margin-bottom: var(--space-md);
  line-height: 1.6;
}
.insight-item {
  display: flex;
  gap: 8px;
  padding: 10px 0;
  font-size: var(--fs-caption);
  color: var(--text-secondary);
  line-height: 1.6;
}
.insight-item + .insight-item { border-top: 1px solid var(--divider-color); }
.insight-icon { flex-shrink: 0; }
.detail-info-rows { display: flex; flex-direction: column; gap: 12px; }
.detail-info-row {
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
  font-size: var(--fs-caption);
}
.detail-info-label { color: var(--text-muted); flex-shrink: 0; }
.detail-info-value { color: var(--text-primary); text-align: right; font-weight: 500; }

/* 图表卡片可点击提示 */
.talos-knowledge-trend, .talos-knowledge-para { cursor: pointer; }

/* ============================================================
   交互组件（弹窗/表单/滑块/开关/拖拽/画布头）
   ============================================================ */

/* ---- 画布顶部栏 ---- */
.canvas-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}
.canvas-header-title {
  font-size: var(--fs-hero);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

/* ---- 弹窗基础 ---- */
.talos-modal-root { position: fixed; inset: 0; z-index: 9998; display: none; }
.talos-modal-root.open { display: flex; align-items: center; justify-content: center; }
.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: overlayIn 0.2s ease both;
}
.modal-box {
  position: relative;
  width: 480px;
  max-width: 92vw;
  max-height: 86vh;
  overflow-y: auto;
  background: rgba(var(--card-bg-rgb), 0.95);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: var(--space-xl) var(--space-xl) 14px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  animation: modalIn 0.25s ease both;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xl);
}
.modal-title { font-size: var(--fs-title); font-weight: 700; }
.modal-close {
  background: transparent !important;   /* 覆盖 Obsidian 全局 button 背景 */
  border: none !important;
  color: var(--text-muted) !important;
  font-size: 18px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
}
.modal-close:hover { color: var(--text-primary) !important; background: rgba(255, 255, 255, 0.06) !important; }
/* 浅色主题：关闭按钮用深灰保证可见度，hover 更深 */
.talos-dashboard[data-theme="light"] .modal-close { color: #52525b !important; }
.talos-dashboard[data-theme="light"] .modal-close:hover { color: #1a1a1a !important; background: rgba(0, 0, 0, 0.06) !important; }

/* ---- 表单控件 ---- */
.form-field { margin-bottom: var(--space-lg); }
.form-label {
  display: block;
  font-size: var(--fs-caption);
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 600;
}
.form-label .required { color: var(--danger-red); }
.talos-dashboard .form-input,
.talos-dashboard .form-select,
.talos-dashboard .form-textarea,
.talos-dashboard .form-date-field {
  width: 100%;
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: var(--radius-md) !important;
  color: var(--text-primary) !important;
  font-size: var(--fs-body);
  font-family: inherit;
  outline: none;
  box-shadow: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.talos-dashboard .form-input {
  height: 36px !important;
  padding: 0 14px !important;
  line-height: 36px;
}
.talos-dashboard .form-input:focus,
.talos-dashboard .form-select:focus,
.talos-dashboard .form-textarea:focus,
.talos-dashboard .form-date-field:focus {
  border-color: var(--focus-border) !important;
  box-shadow: none !important;
  outline: none;
}
.talos-dashboard .form-input::placeholder,
.talos-dashboard .form-textarea::placeholder { color: var(--text-muted) !important; }
.talos-dashboard .form-textarea { min-height: 80px; resize: vertical; line-height: 1.6; padding: 10px 14px !important; }
.talos-dashboard .form-select {
  appearance: none;
  -webkit-appearance: none;
  height: 36px !important;
  padding: 0 32px 0 14px !important;
  cursor: pointer;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-opacity='0.5' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>") !important;
  background-repeat: no-repeat !important;
  background-position: right 10px center !important;
  background-size: 14px !important;
}
.talos-dashboard .form-select option { background: #1c1c22 !important; color: #f0f0f3 !important; }
.talos-dashboard[data-theme="light"] .form-select option { background: #ffffff !important; color: #1a1a1a !important; }
/* 表单日期字段（按钮式，与详情区一致；继承 form-input 外观） */
.talos-dashboard .form-date-field {
  appearance: none;
  -webkit-appearance: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
  color: var(--text-primary) !important;
  font-size: var(--fs-body);
  line-height: 1.4;
  height: 36px !important;
  padding: 0 14px !important;
}
.form-date-field .form-date-value { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.form-date-field .form-date-value.empty { color: var(--text-muted); }
.form-date-field .form-date-icon { font-size: 13px; opacity: 0.55; margin-left: 8px; flex-shrink: 0; }
.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}
.form-row .form-field { margin-bottom: 0; }
.form-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  margin-top: 48px;   /* 分隔线到上方内容的空隙 */
  padding-top: 20px;  /* 分隔线到按钮的间距 */
  border-top: 1px solid rgba(255, 255, 255, 0.12) !important;  /* 统一分隔线，覆盖宿主样式 */
}
.talos-dashboard[data-theme="light"] .form-actions {
  border-top-color: rgba(0, 0, 0, 0.14) !important;  /* 浅色主题下的分隔线 */
}
.form-actions .btn-primary,
.form-actions .btn-secondary { min-width: 96px; }

/* ---- 设置弹窗：分区标题（绿竖条风格，与右侧栏标题统一） ---- */
.setting-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  padding-left: 15px;
  margin: 22px 0 14px;
  position: relative;
}
.setting-section-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  border-radius: 2px;
  background: var(--brand-green);
}
.setting-section-title:first-of-type { margin-top: 0; }

/* ---- 设置弹窗：滑块行 ---- */
.setting-row { margin-bottom: var(--space-xl); }
.setting-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: var(--fs-body);
}
.setting-value { color: var(--text-brand); font-weight: 700; font-size: var(--fs-caption); }
.setting-hint {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 6px;
  line-height: 1.5;
}
.talos-dashboard[data-theme="light"] .setting-hint { color: rgba(0, 0, 0, 0.45); }
input[type="range"].setting-slider {
  -webkit-appearance: none;
  appearance: none;
  box-sizing: border-box;
  width: 100%;
  height: 14px;
  padding: 0;
  border: none;
  background: transparent;
  outline: none;
  cursor: pointer;
}
input[type="range"].setting-slider::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.14);   /* Chromium 自动把轨道在 input(14px) 内居中，无需手动 margin */
}
input[type="range"].setting-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  box-sizing: border-box;
  width: 22px;
  height: 14px;
  border-radius: var(--radius-full);
  background: var(--brand-green);
  border: 2px solid #17171c;               /* 深色描边，浅色主题下换成白色 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  margin-top: -4px;                       /* (轨道6 - 按钮14)/2，按钮相对轨道垂直居中 */
  transition: transform 0.15s ease;
}
input[type="range"].setting-slider::-webkit-slider-thumb:hover { transform: scale(1.08); }
input[type="range"].setting-slider::-moz-range-track {
  height: 6px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.14);
}
input[type="range"].setting-slider::-moz-range-thumb {
  box-sizing: border-box;
  width: 22px;
  height: 14px;
  border-radius: var(--radius-full);
  background: var(--brand-green);
  border: 2px solid #17171c;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}
/* 浅色主题：轨道改浅灰、滑块描边改白 */
.talos-dashboard[data-theme="light"] input[type="range"].setting-slider::-webkit-slider-runnable-track { background: rgba(0, 0, 0, 0.10); }
.talos-dashboard[data-theme="light"] input[type="range"].setting-slider::-webkit-slider-thumb { border-color: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18); }
.talos-dashboard[data-theme="light"] input[type="range"].setting-slider::-moz-range-track { background: rgba(0, 0, 0, 0.10); }
.talos-dashboard[data-theme="light"] input[type="range"].setting-slider::-moz-range-thumb { border-color: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18); }
/* ---- 自绘滑块（自定义组件，替代原生 range：轨道与按钮 flex 精确居中） ---- */
.tslider { position: relative; height: 14px; display: flex; align-items: center; cursor: pointer; touch-action: none; }
.tslider-track { position: relative; width: 100%; height: 6px; border-radius: var(--radius-full); background: rgba(255, 255, 255, 0.14); }
.tslider-thumb { position: absolute; top: 50%; left: 0; width: 22px; height: 14px; border-radius: var(--radius-full); background: var(--brand-green); border: 2px solid #17171c; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); transform: translate(-50%, -50%); transition: transform 0.12s ease; }
.tslider:hover .tslider-thumb { transform: translate(-50%, -50%) scale(1.18); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.55); }
.talos-dashboard[data-theme="light"] .tslider-track { background: rgba(0, 0, 0, 0.10); }
.talos-dashboard[data-theme="light"] .tslider-thumb { border-color: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18); }
/* 手柄内联常显：标题左缘不再让位，竖条紧贴手柄右侧（手柄14px+4px间距，标题起点18px），module-title 无竖条 */
.rp-card .detail-section-title { padding-left: 0; }
.rp-card .module-title { padding-left: 0; }
.rp-card .detail-section-title::before { left: 22px; }
/* 上间距统一 8px：番茄(16→-8) / 打卡(12→-4) / 待办·学习(10→-2) */
.rp-card .glass-card-static .detail-section-title { margin-top: -8px; }
.rp-card .talos-compact-checkin .detail-section-title { margin-top: -4px; }
.rp-card .talos-today-todos .detail-section-title,
.rp-card .talos-today-quicknote .detail-section-title { margin-top: -2px; }
/* ---- 右栏卡片拖拽排序 ---- */
.rp-card { position: relative; }
.rp-handle { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; width: 14px; height: 14px; margin-right: 10px; cursor: grab; touch-action: none; font-size: 11px; line-height: 1; color: rgba(255, 255, 255, 0.55); border-radius: var(--radius-sm); opacity: 0.4; transition: opacity 0.15s ease, color 0.15s ease, transform 0.15s ease; }
.rp-handle::before { content: ""; position: absolute; inset: -7px -3px; border-radius: 8px; background: rgba(200, 224, 96, 0.16); opacity: 0; transition: opacity 0.15s ease; }
.rp-card:hover .rp-handle { opacity: 0.75; }
.rp-handle:hover::before { opacity: 1; }
.rp-handle:hover { opacity: 1 !important; color: var(--brand-green); transform: scale(1.12); }

/* ---- 设置弹窗：主题开关 ---- */
.theme-switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.theme-switch { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
.theme-switch input { opacity: 0; width: 0; height: 0; }
.switch-slider {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background 0.2s ease;
}
.switch-slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 2px;
  top: 2px;
  background: #ffffff;
  border-radius: 50%;
  transition: transform 0.2s ease, background 0.2s ease;
}
.theme-switch input:checked + .switch-slider { background: var(--brand-green); }
.theme-switch input:checked + .switch-slider::before {
  transform: translateX(18px);
  background: #0f0f13;
}
/* 浅色主题：开关轨道与圆点适配 */
.talos-dashboard[data-theme="light"] .switch-slider { background: rgba(0, 0, 0, 0.12); }
.talos-dashboard[data-theme="light"] .switch-slider::before { background: #ffffff; }
.talos-dashboard[data-theme="light"] .theme-switch input:checked + .switch-slider { background: var(--brand-green); }
.talos-dashboard[data-theme="light"] .theme-switch input:checked + .switch-slider::before { background: #ffffff; }

/* ---- 导出弹窗：配置预览 ---- */
.export-preview {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: var(--fs-caption);
  color: var(--text-secondary);
  max-height: 280px;
  overflow: auto;
  white-space: pre;
  margin-bottom: 0;
}

/* ---- 任务卡片拖拽补充 ---- */
.task-card { position: relative; cursor: grab; }
.task-card:active { cursor: grabbing; }
.task-card.dragging {
  z-index: 50;
  opacity: 0.5;
  transform: scale(0.96) rotate(2deg);
  cursor: grabbing;
}
.kanban-column.drag-over {
  background: rgba(200, 224, 96, 0.06);
  border: 2px dashed var(--brand-green);
  border-radius: var(--radius-xl);
}
.kanban-column.drag-over .kanban-col-header {
  color: var(--brand-green);
}

/* ============================================================
   开发占位块
   ============================================================ */
.placeholder {
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  color: var(--text-muted);
  font-size: var(--fs-caption);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.8;
  min-height: 48px;
}


/* ============================================================
   卡片组件化（CardShell）
   ============================================================ */
/* 卡片网格：12 列，卡片按 --span 占列 */
.dash-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-md);
  margin-top: 0;
  align-items: stretch;
}
/* 卡片壳（所有主卡片共用）：flex 纵向，头部固定、内容区弹性撑满（飞书式图表填充） */
.dash-card {
  grid-column: span var(--span, 12);
  position: relative;
  display: flex;
  flex-direction: column;
  background: rgba(var(--card-bg-rgb), var(--card-opacity));
  backdrop-filter: blur(var(--card-blur));
  -webkit-backdrop-filter: blur(var(--card-blur));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
  box-sizing: border-box;
  min-width: 0;
}
.dash-card:hover {
  transform: translateY(-2px);
}
/* 卡片头部：拖拽手柄 + 标题 + 工具区 */
.dash-card-head {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: -8px;
  margin-bottom: 10px;
  user-select: none;
  -webkit-user-select: none;
}
.dash-card-title {
  font-size: var(--fs-title);
  font-weight: 700;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dash-card-tools {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
/* 拖拽手柄 */
.dash-card-drag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  width: 14px;
  height: 14px;
  margin-right: -2px;
  cursor: grab;
  color: rgba(255, 255, 255, 0.55);
  font-size: 11px;
  padding: 0;
  border-radius: var(--radius-sm);
  line-height: 1;
  opacity: 0.4;
  transition: opacity 0.15s ease, color 0.15s ease, transform 0.15s ease;
}
.dash-card-drag::before { content: ""; position: absolute; inset: -7px -3px; border-radius: 8px; background: rgba(200, 224, 96, 0.16); opacity: 0; transition: opacity 0.15s ease; }
.dash-card:hover .dash-card-drag { opacity: 0.75; }
.dash-card-drag:hover::before { opacity: 1; }
.dash-card-drag:hover { opacity: 1 !important; color: var(--brand-green); transform: scale(1.12); }
.dash-card-drag:active { cursor: grabbing; }
/* 手柄已内联到标题行，不再需要顶部避让 */
/* 宽度调节手柄（右下角） */
.dash-card-resize {
  position: absolute;
  right: 6px;
  bottom: 4px;
  width: 20px;
  height: 20px;
  cursor: ew-resize;
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  user-select: none;
  -webkit-user-select: none;
  opacity: 0.7;
  transition: all 0.15s ease;
  letter-spacing: 1px;
  line-height: 1;
  z-index: 2;
}
.dash-card-resize:hover {
  opacity: 1;
  color: var(--brand-green);
  background: rgba(200, 224, 96, 0.12);
}
/* 拖拽中状态 */

/* 宽度提示气泡 */
.dash-width-tip {
  position: fixed;
  z-index: 9999;
  background: var(--background-primary, #1c1c22);
  border: 1px solid rgba(200, 224, 96, 0.4);
  color: var(--text-primary);
  padding: 4px 12px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  pointer-events: none;
}
/* 统计卡 danger（逾期高亮） */
.talos-stats-overview .stat-card.danger .stat-num,
.talos-stats-overview .stat-card.danger .stat-icon { color: var(--danger-red); }
/* 统计行卡片壳 */
.dash-card-stat-row .dash-card-body { padding: 0; }
.dash-card-body { flex: 1; min-width: 0; }

/* 内容少的复习卡片：垂直居中，避免等高拉伸后的顶部留白 */
.talos-rv-mastery {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
/* 图表类卡片 body：flex 纵向布局，让图表弹性填满卡片高度（飞书式填充） */
.dash-card-body.talos-rv-progress,
.dash-card-body.talos-rv-trend {
  display: flex;
  flex-direction: column;
}
/* 浅色主题：拖拽/调宽手柄可见性适配 */
.talos-dashboard[data-theme="light"] .dash-card-drag,
.talos-dashboard[data-theme="light"] .dash-card-resize { color: rgba(0, 0, 0, 0.45); }
.talos-dashboard[data-theme="light"] .rp-handle { color: rgba(0, 0, 0, 0.45); }

/* 复习角标（顶部导航与侧边导航） */
.review-badge {
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #ff4d4f;
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
  display: inline-block;
  margin-left: 4px;
  box-sizing: border-box;
}

/* 点击语录文本 → 管理每日一句（hover 给轻微可点暗示） */
.talos-quote-click:hover {
  color: var(--brand-green);
}
.talos-dashboard[data-theme="light"] .talos-quote-click:hover {
  color: #6b8f2f;
}

/* 每日一签：抽签入口 hover 反馈 */
.talos-sign-entry:hover {
  color: var(--brand-green);
}
.talos-dashboard[data-theme="light"] .talos-sign-entry:hover {
  color: #6b8f2f;
}

/* 每日一签：摇签动画（轻量，约 0.6s） */
.talos-sign-entry.talos-sign-shake,
.talos-sign-modal .talos-sign-shake {
  animation: talosSignShake 0.6s ease-in-out;
  display: inline-block;
}
@keyframes talosSignShake {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-10deg); }
  40% { transform: rotate(10deg); }
  60% { transform: rotate(-8deg); }
  80% { transform: rotate(8deg); }
}

/* ==================== 顶部搜索实时下拉 ==================== */
/* 结构：.talos-search-drop（flex 列，overflow hidden 裁圆角）
         ├─ .tsd-body（内部滚动）
         └─ .tsd-foot（底部结果栏，始终可见） */
.talos-search-drop {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 440px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: rgba(var(--card-bg-rgb), 0.98);
  border: 1px solid rgba(200, 224, 96, 0.7);
  border-top: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  font-size: 12px;
  color: var(--text-primary);
  z-index: 300;
}
.talos-dashboard[data-theme="light"] .talos-search-drop,
.talos-search-drop[data-theme="light"] {
  border-color: #96b030;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
}

/* 列表区：内部滚动 + 细滚动条（有更多内容时给出明确提示） */
.tsd-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden; /* 长路径靠副行换行展示，杜绝横向滚动条 */
  overscroll-behavior: contain;
  padding: 0 14px 6px; /* 左右留白加大：内容不再贴边（14 + 条目 12 = 26px 内容边距） */
  scroll-padding-top: 30px; /* 键盘导航时避开吸顶的分组标题 */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.16) transparent;
}
.tsd-body::-webkit-scrollbar { width: 6px; }
.tsd-body::-webkit-scrollbar-track { background: transparent; }
.tsd-body::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.16); border-radius: var(--radius-full); }
.tsd-body::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
.talos-dashboard[data-theme="light"] .tsd-body,
.talos-search-drop[data-theme="light"] .tsd-body { scrollbar-color: rgba(0, 0, 0, 0.18) transparent; }
.talos-dashboard[data-theme="light"] .tsd-body::-webkit-scrollbar-thumb,
.talos-search-drop[data-theme="light"] .tsd-body::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.18); }
/* 顶部分割线（输入框与内容区之间）：内缩于大边框之内，长度与组间分割线一致，
   不与外框相连，左右各留出与内容相同的留白 */
.tsd-body::before {
  content: "";
  display: block;
  height: 0;
  margin-bottom: 4px; /* 与组间分割线一致：线到分组标题的间距同为 12px（4 + 标题 8） */
  border-top: 1px solid rgba(255, 255, 255, 0.10);
}
.talos-dashboard[data-theme="light"] .tsd-body::before,
.talos-search-drop[data-theme="light"] .tsd-body::before { border-top-color: rgba(0, 0, 0, 0.12); }

/* 分组 */
.tsd-group { padding-bottom: 4px; }
.tsd-group + .tsd-group {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-top: 4px;
  padding-top: 4px;
}
.talos-dashboard[data-theme="light"] .tsd-group + .tsd-group,
.talos-search-drop[data-theme="light"] .tsd-group + .tsd-group { border-top-color: rgba(0, 0, 0, 0.07); }

/* 分组标题：吸顶，滚动过程中始终知道自己在看哪一组 */
.tsd-group-title {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--text-secondary);
  background: rgba(var(--card-bg-rgb), 0.98);
}
.tsd-gt-icon { font-size: 12px; line-height: 1; }
.tsd-gt-name { flex: 1; }
.tsd-gt-count {
  background: rgba(255, 255, 255, 0.10);
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  padding: 1px 7px;
  font-size: 10px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.talos-dashboard[data-theme="light"] .tsd-gt-count,
.talos-search-drop[data-theme="light"] .tsd-gt-count { background: rgba(0, 0, 0, 0.07); }

/* 条目：单行制（左标题 + 右路径元信息），靠 hover / 当前项区分。
   选择器统一加 .talos-search-drop 前缀提高特异性：
   行元素虽是 div，但仍会继承主题的列表/按钮样式，前缀可稳定压过。 */
.talos-search-drop .tsd-item {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
  width: 100%;
  height: auto;
  min-height: 30px;
  margin: 0;
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  box-shadow: none;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.45;
  text-align: left;
  white-space: normal;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  transition: background 0.12s ease, box-shadow 0.12s ease;
}
.talos-search-drop .tsd-item + .tsd-item { margin-top: 1px; }
.talos-search-drop .tsd-item:hover { background: rgba(255, 255, 255, 0.055); }
/* 当前项（键盘 ↑↓ 与鼠标 hover 共用同一状态）：左侧品牌绿指示条 + 更实的底 */
.talos-search-drop .tsd-item.tsd-active { background: rgba(200, 224, 96, 0.10); box-shadow: inset 2px 0 0 var(--brand-green); }
.talos-dashboard[data-theme="light"] .talos-search-drop .tsd-item:hover { background: rgba(0, 0, 0, 0.04); }
.talos-dashboard[data-theme="light"] .talos-search-drop .tsd-item.tsd-active { background: rgba(200, 224, 96, 0.28); }

.talos-search-drop .tsd-item-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 500; /* 长文件名不再全行加粗，消除"文字墙" */
  line-height: 1.45;
  color: var(--text-primary);
}
/* 第二行：完整文件夹路径 / 任务状态。弱化、不参与高亮，且【不做任何省略】——
   副行独占一行、可整行换行，把所在位置完整展示出来 */
.talos-search-drop .tsd-item-sub {
  min-width: 0;
  overflow: visible;
  white-space: normal;
  word-break: break-all;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
/* 命中高亮：直接复用看板搜索的 .search-hit（定义见上文"看板搜索"区块），
   不再单独定义 .tsd-hit —— 同一产品只保留一套高亮语言 */

/* 空态 */
.tsd-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 10px;
  color: var(--text-muted);
  text-align: center;
}
.tsd-empty-icon { font-size: 20px; opacity: 0.6; }

/* 底部结果栏：固定可见（规范 §8.2） */
.tsd-foot {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 26px 10px; /* 与条目文字左边缘对齐（14 + 12 = 26px） */
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  font-size: 11px;
  color: var(--text-muted);
}
.talos-dashboard[data-theme="light"] .tsd-foot,
.talos-search-drop[data-theme="light"] .tsd-foot { border-top-color: rgba(0, 0, 0, 0.07); }
.tsd-foot-count b { color: var(--text-secondary); font-weight: 600; font-variant-numeric: tabular-nums; }
.tsd-foot-actions { display: flex; align-items: center; gap: 4px; }
.talos-search-drop .tsd-seeall,
.talos-search-drop .tsd-close {
  display: inline-flex;
  align-items: center;
  height: auto;
  min-height: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  line-height: 1.4;
  padding: 3px 7px;
  border-radius: var(--radius-sm);
  transition: color 0.15s ease, background 0.15s ease;
}
.talos-search-drop .tsd-seeall { color: var(--text-brand); font-weight: 600; }
.talos-search-drop .tsd-seeall:hover { background: rgba(200, 224, 96, 0.12); }
.talos-search-drop .tsd-close { color: var(--text-muted); }
.talos-search-drop .tsd-close:hover { background: rgba(255, 255, 255, 0.08); color: var(--text-primary); }
.talos-dashboard[data-theme="light"] .talos-search-drop .tsd-close:hover { background: rgba(0, 0, 0, 0.06); }

`;
