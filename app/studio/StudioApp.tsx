'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, BookOpen, Boxes, Check, ChevronDown, ChevronRight, CirclePlay,
  Clapperboard, Clock3, Copy, Download, Expand, Film, GitBranch, Home,
  Image as ImageIcon, LayoutGrid, ListTree, Maximize2, MessageSquareText,
  MoreHorizontal, Pause, Play, Plus, Redo2, RefreshCw, Search, Send,
  Settings2, Share2, Sparkles, Split, Undo2, Upload, Volume2,
  WandSparkles, X, ZoomIn, ZoomOut,
} from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';

type Format = '互动影视' | '短剧';
type Toast = { title: string; detail?: string } | null;

const steps = [
  { label: '选题', icon: Sparkles },
  { label: '故事设定', icon: BookOpen },
  { label: '章节与分支', icon: GitBranch },
  { label: '小说与剧本', icon: MessageSquareText },
  { label: '资产库', icon: Boxes },
  { label: '分镜', icon: Clapperboard },
  { label: '成片', icon: Film },
];

const topics = [
  { tag: '末日生存', title: '冰封倒计时', copy: '30 天后全城失温，安全屋只剩两个席位。', color: 'coral' },
  { tag: '都市悬疑', title: '第七次来电', copy: '每晚零点，她都会接到七天后的自己打来的电话。', color: 'blue' },
  { tag: '商战群像', title: '雾港合伙人', copy: '签约前夜，团队里出现了两份完全不同的股权表。', color: 'violet' },
  { tag: '近未来爱情', title: '白昼失重', copy: '城市每天失重十一分钟，下一次却不会结束。', color: 'amber' },
];

const characters = [
  { name: '林晚', role: '主角', image: '/characters/fashion-woman.jpg', note: '前气象研究员 · 冷静克制', voice: '清冷女声' },
  { name: '陈默', role: '关键盟友', image: '/characters/fashion-man.jpg', note: '急诊医生 · 寡言敏锐', voice: '低沉男声' },
  { name: '夏栀', role: '情报者', image: '/characters/fashion-woman-2.jpg', note: '电台主播 · 温柔神秘', voice: '温柔女声' },
  { name: '周砚', role: '对立者', image: '/characters/fashion-man-3.jpg', note: '能源集团继承人 · 果断', voice: '成熟男声' },
];

const storyboard = [
  { n: '01', image: '/media/44557.jpg', title: '雪夜醒来', shot: '近景 · 缓慢推进', seconds: '4.0s' },
  { n: '02', image: '/media/49878.jpg', title: '异常预警', shot: '特写 · 手持轻晃', seconds: '3.5s' },
  { n: '03', image: '/media/40656.jpg', title: '停电记录', shot: '俯拍 · 快速拉近', seconds: '5.0s' },
  { n: '04', image: '/media/40741.jpg', title: '窗外初雪', shot: '远景 · 横向平移', seconds: '4.5s' },
  { n: '05', image: '/media/1594.jpg', title: '陌生来电', shot: '中近景 · 环绕', seconds: '5.0s' },
  { n: '06', image: '/media/44559.jpg', title: '做出选择', shot: '特写 · 静止', seconds: '4.0s' },
];

const scriptScenes = [
  { no: '01', title: '雪夜醒来', place: '林晚公寓 · 夜 · 内', copy: '窗外没有风，雪却在向上飘。林晚从噩梦中惊醒，手机屏幕正亮着，一份来自未来的停电记录自动下载完成。', line: '林晚（低声）：这不是天气预报……这是死亡名单。' },
  { no: '02', title: '第一次预警', place: '城市急诊中心 · 夜 · 内', copy: '急诊大厅的灯光闪烁。陈默隔着玻璃看向她，身后的病人同时开始咳出冰晶。', line: '陈默：如果你想活过今晚，就别把这份记录交给任何人。' },
  { no: '03', title: '必须做出选择', place: '地下停车场 · 夜 · 内', copy: '警报声由远及近。安全门只会再开启一次，而林晚收到了两个方向完全相反的坐标。', line: '旁白：她只有十秒钟决定相信谁。' },
];

const clips = ['/media/woman-01.mp4','/media/man-01.mp4','/media/woman-02.mp4','/media/man-02.mp4','/media/woman-04.mp4','/media/man-04.mp4'];

export default function StudioApp() {
  const [active, setActive] = useState(0);
  const [format, setFormat] = useState<Format>('互动影视');
  const [selected, setSelected] = useState(0);
  const [idea, setIdea] = useState('');
  const [toast, setToast] = useState<Toast>(null);
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantLog, setAssistantLog] = useState<string[]>([]);

  const notify = (title: string, detail?: string) => setToast({ title, detail });
  const go = (index: number) => { setActive(index); window.setTimeout(() => window.scrollTo(0, 0), 0); };

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const context = (document as unknown as { modelContext?: { registerTool?: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tool = {
      name: 'navigate_creation_stage', title: '前往创作阶段',
      description: '在火花创作 Studio 中切换到指定的创作阶段。',
      inputSchema: { type: 'object', properties: { stage: { type: 'string', enum: steps.map((item) => item.label) } }, required: ['stage'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        const stage = typeof input === 'object' && input ? (input as { stage?: string }).stage : undefined;
        const index = steps.findIndex((item) => item.label === stage);
        if (index < 0) throw new Error('未知的创作阶段');
        setActive(index);
        return { stage, status: 'opened' };
      },
    };
    try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch {}
    return () => lifecycle.abort();
  }, []);

  const sendAssistant = () => {
    if (!assistantInput.trim()) return;
    setAssistantLog((items) => [...items, assistantInput.trim()]);
    notify('AI 已应用你的修改', '当前页面内容已更新');
    setAssistantInput('');
  };

  return (
    <SidebarProvider className={`studio-root ${assistantOpen ? '' : 'assistant-closed'}`}>
      <Sidebar collapsible="none" className="studio-sidebar">
        <SidebarHeader className="studio-brand"><a href="/" aria-label="返回火花首页"><span>火花</span><i /></a><button aria-label="搜索"><Search /></button></SidebarHeader>
        <SidebarContent><SidebarGroup><SidebarGroupContent><SidebarMenu className="studio-nav">
          {steps.map((step, index) => <SidebarMenuItem key={step.label}><SidebarMenuButton isActive={active === index} onClick={() => go(index)} className="studio-nav-button"><step.icon /><span>{step.label}</span>{index < active && <Check className="nav-check" />}</SidebarMenuButton></SidebarMenuItem>)}
        </SidebarMenu></SidebarGroupContent></SidebarGroup></SidebarContent>
        <SidebarFooter className="studio-sidebar-footer"><button onClick={() => { go(0); notify('已创建空白项目'); }}><Plus />新建项目</button><a href="/"><Home />返回首页</a></SidebarFooter>
      </Sidebar>
      <SidebarInset className="studio-inset">
        <Topbar active={active} assistantOpen={assistantOpen} setAssistantOpen={setAssistantOpen} notify={notify} />
        <main className="studio-workspace"><div className="studio-canvas">
          {active === 0 && <TopicStage format={format} setFormat={setFormat} selected={selected} setSelected={setSelected} idea={idea} setIdea={setIdea} next={() => go(1)} notify={notify} />}
          {active === 1 && <StoryStage next={() => go(2)} notify={notify} />}
          {active === 2 && <BranchStage next={() => go(3)} notify={notify} />}
          {active === 3 && <ScriptStage next={() => go(4)} notify={notify} />}
          {active === 4 && <AssetStage next={() => go(5)} notify={notify} />}
          {active === 5 && <StoryboardStage next={() => go(6)} notify={notify} />}
          {active === 6 && <MovieStage notify={notify} />}
        </div>{assistantOpen && <Assistant stage={steps[active].label} input={assistantInput} setInput={setAssistantInput} log={assistantLog} send={sendAssistant} notify={notify} />}</main>
      </SidebarInset>
      {toast && <div className="studio-toast"><span><Check /></span><div><strong>{toast.title}</strong>{toast.detail && <small>{toast.detail}</small>}</div><button onClick={() => setToast(null)}><X /></button></div>}
    </SidebarProvider>
  );
}

function Topbar({ active, assistantOpen, setAssistantOpen, notify }: { active: number; assistantOpen: boolean; setAssistantOpen: (v: boolean) => void; notify: (t: string, d?: string) => void }) {
  return <header className="studio-topbar"><div className="project-switcher"><span className="project-mark">冰</span><div><strong>冰封倒计时</strong><small>互动影视 · 草稿</small></div><ChevronDown /></div><div className="topbar-center"><button aria-label="撤销" onClick={() => notify('已撤销上一步操作')}><Undo2 /></button><button aria-label="重做" onClick={() => notify('已重做上一步操作')}><Redo2 /></button><span><i />自动保存于刚刚</span></div><div className="topbar-actions"><button onClick={() => notify('预览已就绪', '将从当前章节开始播放')}><CirclePlay />预览</button><button onClick={() => notify('已打开导出面板', '可导出演示视频、剧本和 Prompt')}><Download />导出</button><button className="primary" onClick={() => notify('正在发布到火花 App', '演示作品将保存为草稿')}><Upload />发布</button><button className={`assistant-toggle ${assistantOpen ? 'active' : ''}`} aria-label="切换 AI 助手" onClick={() => setAssistantOpen(!assistantOpen)}><Sparkles /></button></div><div className="stage-breadcrumb"><span>{String(active + 1).padStart(2, '0')}</span>{steps[active].label}</div></header>;
}

function TopicStage({ format, setFormat, selected, setSelected, idea, setIdea, next, notify }: { format: Format; setFormat: (v: Format) => void; selected: number; setSelected: (v: number) => void; idea: string; setIdea: (v: string) => void; next: () => void; notify: (t: string, d?: string) => void }) {
  return <section className="stage-page topic-workbench"><div className="workbench-head"><div><span className="eyebrow">01 · 开始创作</span><h1>今天想讲一个什么故事？</h1><p>选择灵感方向，或用一句话描述你的想法。</p></div><div className="format-toggle" aria-label="作品类型">{(['互动影视', '短剧'] as const).map((item) => <button key={item} className={format === item ? 'active' : ''} onClick={() => setFormat(item)}>{item}</button>)}</div></div><div className="idea-box"><WandSparkles /><textarea value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="例如：一名律师发现所有监控里都没有自己，她必须在天亮前证明自己存在……" /><div><span>⌘ Enter 生成</span><button onClick={() => setIdea('一名失去记忆的气象研究员，提前收到了未来三十天的停电记录。')}>让 AI 帮我想</button><button className="generate" onClick={() => notify('已生成 4 个创作方向')}>生成方向</button></div></div><div className="filter-row"><button className="active">为你推荐</button><button>热门方向</button><button>女性向</button><button>男性向</button><button>高互动潜力</button><span /><button><Settings2 />更多筛选</button></div><div className="recommend-head"><div><h2>为你推荐</h2><span>根据题材热度与互动潜力生成</span></div><button onClick={() => notify('已刷新推荐方向')}><RefreshCw />换一批</button></div><div className="topic-grid">{topics.map((topic, index) => <button key={topic.title} onClick={() => setSelected(index)} className={`topic-card ${topic.color} ${selected === index ? 'selected' : ''}`}><div className="topic-number">0{index + 1}</div><span>{topic.tag}</span><h3>{topic.title}</h3><p>{topic.copy}</p><footer><span>{format === '互动影视' ? '3 条主分支 · 5 个结局' : '12 集 · 每集 90 秒'}</span>{selected === index && <b><Check />已选择</b>}</footer></button>)}</div><Continue label="已选择" title={topics[selected].title} meta={`${format} · 可随时返回修改`} action="生成故事设定" onClick={next} /></section>;
}

function StoryStage({ next, notify }: { next: () => void; notify: (t: string, d?: string) => void }) {
  const [tab, setTab] = useState('故事概览');
  return <section className="stage-page detail-page"><StageTitle eyebrow="02 · 故事设定" title="冰封倒计时" desc="一个关于信任、资源与生存代价的互动故事。" action="重新生成" onAction={() => notify('正在重新生成故事设定')} /><div className="subtabs">{['故事概览','世界观','角色圣经','人物关系'].map((item) => <button className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>{tab === '故事概览' ? <div className="story-setting-grid"><article className="setting-card featured"><span>一句话梗概</span><h2>末日来临前，她收到了一份来自未来的死亡名单。</h2><p>前气象研究员林晚必须在 30 天内建成安全屋，并从身边六个人中找到真正值得信任的同伴。</p><button onClick={() => notify('梗概进入编辑状态')}>编辑内容</button></article><article className="setting-card"><span>核心冲突</span><h3>两个席位，六个候选人</h3><p>每一次选择都会改变物资、信任与结局。</p></article><article className="setting-card"><span>叙事节奏</span><h3>倒计时推进</h3><p>每章减少一天，并揭开一层灾难真相。</p></article><article className="setting-card"><span>目标受众</span><h3>18–35 岁 · 女性向</h3><p>情感悬疑、强反转、关系驱动。</p></article><article className="setting-card"><span>视觉基调</span><h3>冷蓝现实主义</h3><p>冰雪、玻璃反光、低饱和城市夜景。</p></article></div> : <ReferencePanel tab={tab} />}<Continue label="故事设定" title="内容已完成" meta="4 个模块 · AI 完整性检查通过" action="生成章节与分支" onClick={next} /></section>;
}

function ReferencePanel({ tab }: { tab: string }) {
  if (tab === '角色圣经') return <div className="character-bible">{characters.map((item) => <article key={item.name}><img src={item.image} alt={item.name} /><div><span>{item.role}</span><h3>{item.name}</h3><p>{item.note}</p><small>人物弧光：从独自求生到重新相信他人</small></div></article>)}</div>;
  if (tab === '人物关系') return <div className="relationship-map"><div className="relation main">林晚<small>主角</small></div><div className="relation r1">陈默<small>互相试探</small></div><div className="relation r2">夏栀<small>提供情报</small></div><div className="relation r3">周砚<small>利益对立</small></div><svg viewBox="0 0 600 300" preserveAspectRatio="none"><path d="M300 150 L125 70 M300 150 L490 70 M300 150 L300 260" /></svg></div>;
  return <div className="world-panel"><article><span>灾难规则</span><h3>极寒不是自然现象</h3><p>每晚零点，城市温度下降 3℃；所有电子记录会被覆盖一次，只有纸质记录能够留下。</p></article><article><span>时间与地点</span><h3>近未来 · 沿海城市</h3><p>故事发生在冰封前 30 天，主要场景包括旧城区、急诊中心、气象站与地下安全屋。</p></article><article><span>不可违背的设定</span><h3>选择必有代价</h3><p>玩家无法救下所有人。每获得一种关键资源，都必须失去一段关系或一条线索。</p></article></div>;
}

function BranchStage({ next, notify }: { next: () => void; notify: (t: string, d?: string) => void }) {
  const [selectedNode, setSelectedNode] = useState('第 03 章 · 必须做出选择');
  return <section className="stage-page branch-page"><StageTitle eyebrow="03 · 章节与分支" title="故事树" desc="6 个章节 · 3 条主分支 · 5 个结局" action="AI 检查" onAction={() => notify('故事树检查通过', '所有分支均可到达结局')} /><div className="branch-toolbar"><div><button className="active"><ListTree />故事树</button><button><LayoutGrid />章节列表</button></div><div><button onClick={() => notify('已缩小画布')}><ZoomOut /></button><span>80%</span><button onClick={() => notify('已放大画布')}><ZoomIn /></button><button onClick={() => notify('画布已居中')}><Maximize2 /></button><button className="add" onClick={() => notify('已添加新章节')}><Plus />添加章节</button></div></div><div className="branch-board"><div className="branch-canvas"><svg viewBox="0 0 1040 570" preserveAspectRatio="none"><path d="M130 280 C210 280 205 280 280 280 M470 280 C540 280 520 120 600 120 M470 280 C540 280 520 280 600 280 M470 280 C540 280 520 440 600 440 M790 120 C850 120 830 200 900 200 M790 280 C850 280 830 200 900 200 M790 440 C850 440 830 360 900 360" /></svg><BranchNode className="n1" title="第 01 章" text="雪夜醒来" status="完成" onClick={setSelectedNode} /><BranchNode className="n2" title="第 02 章" text="第一次预警" status="完成" onClick={setSelectedNode} /><BranchNode className="n3 decision" title="第 03 章" text="必须做出选择" status="选择节点" onClick={setSelectedNode} /><BranchNode className="n4" title="A · 相信陈默" text="前往急诊中心" status="分支" onClick={setSelectedNode} /><BranchNode className="n5" title="B · 相信夏栀" text="前往废弃电台" status="分支" onClick={setSelectedNode} /><BranchNode className="n6" title="C · 独自调查" text="潜入气象站" status="分支" onClick={setSelectedNode} /><BranchNode className="n7 ending" title="结局 01" text="黎明之前" status="好结局" onClick={setSelectedNode} /><BranchNode className="n8 ending bad" title="结局 02" text="永恒寒夜" status="坏结局" onClick={setSelectedNode} /></div><aside className="node-inspector"><span>当前节点</span><h3>{selectedNode}</h3><label>章节目标<textarea defaultValue="迫使玩家第一次在关系与线索之间做出取舍。" /></label><label>结尾钩子<textarea defaultValue="安全屋容量并不是两个人，而是从一开始就没有人能活着进去。" /></label><div><button onClick={() => notify('已复制章节')}><Copy />复制</button><button onClick={() => notify('节点已重新生成')}><RefreshCw />重新生成</button></div></aside></div><Continue label="结构检查" title="所有路径完整" meta="无断裂分支 · 无不可达结局" action="生成小说与剧本" onClick={next} /></section>;
}

function BranchNode({ className, title, text, status, onClick }: { className: string; title: string; text: string; status: string; onClick: (s: string) => void }) { return <button className={`branch-node ${className}`} onClick={() => onClick(`${title} · ${text}`)}><span>{title}<b>{status}</b></span><strong>{text}</strong><small>点击查看与编辑</small></button>; }

function ScriptStage({ next, notify }: { next: () => void; notify: (t: string, d?: string) => void }) {
  const [mode, setMode] = useState('剧本'); const [scene, setScene] = useState(0);
  return <section className="stage-page script-page"><StageTitle eyebrow="04 · 小说与剧本" title="第 01 章 · 冰点之前" desc="预计阅读 4 分钟 · 3 个场景 · 1 个选择节点" action="生成本章" onAction={() => notify('本章已重新生成')} /><div className="script-layout"><aside className="chapter-list"><header><strong>章节</strong><button onClick={() => notify('已添加新章节')}><Plus /></button></header>{['第 01 章 · 冰点之前','第 02 章 · 第一次失温','第 03 章 · 地下协议','第 04 章 · 谁在说谎','A · 前往急诊中心','B · 前往废弃电台','C · 潜入气象站'].map((item, i) => <button className={i === 0 ? 'active' : ''} key={item}><span>{String(i + 1).padStart(2,'0')}</span>{item}{i < 4 && <Check />}</button>)}</aside><div className="script-editor"><div className="editor-tabs"><div>{['小说原文','剧本'].map((item) => <button className={mode === item ? 'active' : ''} key={item} onClick={() => setMode(item)}>{item}</button>)}</div><span>{mode === '剧本' ? '1,286 字' : '2,940 字'} · 自动保存</span></div>{mode === '小说原文' ? <article className="novel-copy"><h2>第一章　冰点之前</h2><p>凌晨三点十七分，林晚被一种过分安静的声音惊醒。</p><p>那不是风，也不是雪。窗外的雪正违背重力，一片片向漆黑的天空升去。她伸手摸到手机，屏幕上多了一份从未下载过的文件。</p><p>文件名只有一行：<strong>未来三十天全城停电记录。</strong></p><p>记录的最后一页，写着她自己的名字。</p></article> : <div className="scene-stack">{scriptScenes.map((item, i) => <article className={scene === i ? 'active' : ''} key={item.no} onClick={() => setScene(i)}><header><span>场 {item.no}</span><strong>{item.title}</strong><small>{item.place}</small><MoreHorizontal /></header><p>{item.copy}</p><blockquote>{item.line}</blockquote>{i === 2 && <div className="choice-script"><GitBranch /><span>选择节点</span><button>A · 相信陈默</button><button>B · 相信夏栀</button><button>C · 独自调查</button></div>}</article>)}</div>}<div className="script-floating-tools"><button onClick={() => notify('已优化当前段落')}><WandSparkles />AI 改写</button><button onClick={() => notify('已续写 240 字')}><Plus />续写</button><button onClick={() => notify('当前段落已复制')}><Copy /></button></div></div></div><Continue label="当前章节" title="小说与剧本已生成" meta="3 个场景 · 预计成片 26 秒" action="提取角色与场景资产" onClick={next} /></section>;
}

function AssetStage({ next, notify }: { next: () => void; notify: (t: string, d?: string) => void }) {
  const [tab, setTab] = useState('角色'); const [selectedAsset, setSelectedAsset] = useState('林晚');
  return <section className="stage-page assets-stage"><StageTitle eyebrow="05 · 资产库" title="视觉与声音资产" desc="从剧本自动提取，可在所有章节复用。" action="重新提取" onAction={() => notify('已从剧本重新提取资产')} /><div className="asset-tabs">{['角色 4','场景 6','道具 8','声音 5'].map((item) => <button className={tab === item.split(' ')[0] ? 'active' : ''} key={item} onClick={() => setTab(item.split(' ')[0])}>{item}</button>)}<button className="new-asset" onClick={() => notify('已创建空白资产')}><Plus />新建资产</button></div><div className="asset-layout"><div className="asset-grid">{tab === '角色' ? characters.map((item) => <button className={`asset-card ${selectedAsset === item.name ? 'selected' : ''}`} key={item.name} onClick={() => setSelectedAsset(item.name)}><img src={item.image} alt={item.name} /><div><span>{item.role}</span><h3>{item.name}</h3><p>{item.note}</p><small><Volume2 />{item.voice}</small></div>{selectedAsset === item.name && <b><Check /></b>}</button>) : <GenericAssets tab={tab} />}</div><aside className="asset-inspector"><header><span>资产详情</span><button><MoreHorizontal /></button></header><div className="asset-preview"><img src={characters.find((x) => x.name === selectedAsset)?.image ?? characters[0].image} alt={selectedAsset} /><button onClick={() => notify('正在生成新的角色参考图')}><RefreshCw />重新生成</button></div><label>资产名称<input value={selectedAsset} readOnly /></label><label>视觉描述<textarea defaultValue="28 岁，黑色及肩短发，冷白肤色，灰蓝眼睛。穿深色羊绒大衣，干净利落，神情克制。" /></label><div className="consistency"><Check /><div><strong>跨章节一致性已锁定</strong><span>用于 6 个章节、14 个镜头</span></div><button onClick={() => notify('一致性设置已更新')}>设置</button></div></aside></div><Continue label="资产检查" title="23 项资产已确认" meta="角色、场景与道具关系完整" action="生成分镜" onClick={next} /></section>;
}

function GenericAssets({ tab }: { tab: string }) {
  const sets: Record<string, { title:string; sub:string; image:string }[]> = { '场景': [{title:'林晚公寓',sub:'夜 · 室内 · 冷蓝光',image:'/media/44557.jpg'},{title:'急诊中心',sub:'夜 · 室内 · 闪烁灯光',image:'/media/49878.jpg'},{title:'废弃电台',sub:'雪夜 · 红色信号灯',image:'/media/40656.jpg'},{title:'地下停车场',sub:'夜 · 警报红光',image:'/media/40741.jpg'}], '道具': [{title:'未来停电记录',sub:'关键线索 · 纸质文件',image:'/media/1594.jpg'},{title:'气象终端',sub:'关键设备 · 老旧屏幕',image:'/media/44559.jpg'}], '声音': [{title:'林晚音色',sub:'清冷、克制、28 岁',image:'/characters/fashion-woman.jpg'},{title:'末日环境音',sub:'低频风雪与电流噪音',image:'/media/40656.jpg'}] };
  return <>{(sets[tab] ?? sets['场景']).map((item) => <button className="asset-card generic" key={item.title}><img src={item.image} alt="" /><div><span>{tab}</span><h3>{item.title}</h3><p>{item.sub}</p></div></button>)}</>;
}

function StoryboardStage({ next, notify }: { next: () => void; notify: (t: string, d?: string) => void }) {
  const [shot, setShot] = useState(0); const current = storyboard[shot];
  return <section className="stage-page storyboard-stage"><StageTitle eyebrow="06 · 分镜" title="第 01 章 · 冰点之前" desc="6 个镜头 · 预计成片 26 秒" action="生成全部镜头" onAction={() => notify('6 个镜头已加入生成队列')} /><div className="storyboard-tools"><div><button className="active"><LayoutGrid />分镜卡片</button><button><ListTree />镜头列表</button></div><div><button onClick={() => notify('已添加镜头')}><Plus />添加镜头</button><button onClick={() => notify('已重新生成全部分镜')}><RefreshCw />重新生成</button></div></div><div className="storyboard-layout"><div className="storyboard-grid">{storyboard.map((item,i) => <button className={`shot-card ${shot === i ? 'selected' : ''}`} key={item.n} onClick={() => setShot(i)}><div><img src={item.image} alt={item.title} /><span>{item.n}</span><span className="shot-play"><Play /></span></div><header><strong>{item.title}</strong><small>{item.seconds}</small></header><p>{item.shot}</p><footer><span>林晚</span><span>公寓</span></footer></button>)}</div><aside className="shot-inspector"><div className="inspector-preview"><img src={current.image} alt={current.title} /><button><Expand /></button></div><div className="inspector-head"><div><span>镜头 {current.n}</span><h3>{current.title}</h3></div><button><MoreHorizontal /></button></div><label>画面 Prompt<textarea value={`电影感画面，${current.title}，冷蓝色调，林晚神情警觉，窗外暴雪，真实光影，细节丰富`} readOnly /><button onClick={() => notify('Prompt 已复制')}><Copy /></button></label><div className="prompt-grid"><label>景别<select defaultValue="近景"><option>近景</option><option>中景</option><option>远景</option></select></label><label>运镜<select defaultValue="缓慢推进"><option>缓慢推进</option><option>手持跟随</option><option>固定机位</option></select></label><label>时长<select defaultValue={current.seconds}><option>{current.seconds}</option><option>6.0s</option></select></label><label>声音<select defaultValue="原声+配乐"><option>原声+配乐</option><option>仅环境音</option></select></label></div><button className="regenerate" onClick={() => notify(`正在重新生成镜头 ${current.n}`)}><WandSparkles />重新生成当前镜头</button></aside></div><Continue label="分镜进度" title="6 / 6 个镜头已完成" meta="画面、运镜、对白与音乐 Prompt 已生成" action="生成演示视频" onClick={next} /></section>;
}

function MovieStage({ notify }: { notify: (t: string, d?: string) => void }) {
  const [clip, setClip] = useState(0); const [playing, setPlaying] = useState(true); const [timelineWidth, setTimelineWidth] = useState(1); const video = useRef<HTMLVideoElement>(null);
  useEffect(() => { const v = video.current; if (!v) return; if (playing) v.play().catch(() => {}); else v.pause(); }, [playing, clip]);
  const total = useMemo(() => storyboard.reduce((n,item) => n + Number(item.seconds.replace('s','')),0), []);
  return <section className="movie-stage"><div className="movie-main"><div className="movie-toolbar"><div><button><ArrowLeft />章节</button><strong>第 01 章 · 冰点之前</strong></div><div><button onClick={() => notify('预览窗口已适应画布')}>适应</button><button onClick={() => notify('已进入全屏预览')}><Maximize2 /></button></div></div><div className="preview-area"><div className="video-frame" onClick={() => setPlaying(!playing)}><video key={clips[clip]} ref={video} src={clips[clip]} autoPlay muted loop playsInline />{!playing && <span className="big-play"><Play /></span>}<div className="video-caption">{scriptScenes[Math.min(clip,2)].line.split('：').slice(-1)[0]}</div>{clip === 5 && <div className="video-choice"><span>你要相信谁？</span><button>A · 相信陈默</button><button>B · 相信夏栀</button></div>}</div></div></div><aside className="movie-side"><header><strong>章节与分支</strong><button><MoreHorizontal /></button></header><div className="mini-tree"><button className="done"><Check />01 冰点之前</button><i /><button className="active"><Play />02 第一次失温</button><i /><div><button>A · 急诊中心</button><button>B · 废弃电台</button><button>C · 气象站</button></div></div><div className="publish-check"><strong>发布前检查</strong><p><Check />6 个镜头生成完成</p><p><Check />字幕与对白已对齐</p><p><Check />所有分支可到达</p><button onClick={() => notify('正在发布到火花 App', '演示作品将保存为草稿')}><Share2 />发布到火花 App</button></div></aside><div className="timeline-panel"><div className="timeline-head"><div><button onClick={() => setPlaying(!playing)}>{playing ? <Pause /> : <Play />}</button><span>00:{String(clip * 4).padStart(2,'0')}.0 / 00:{Math.round(total)}</span><button onClick={() => {setClip(0); setPlaying(true);}}><RefreshCw /></button></div><div><button onClick={() => notify('已拆分当前镜头')}><Split />拆分</button><button onClick={() => notify('已替换当前镜头')}><ImageIcon />替换镜头</button><button onClick={() => setTimelineWidth(Math.max(.75,timelineWidth-.25))}><ZoomOut /></button><input type="range" min=".75" max="1.6" step=".05" value={timelineWidth} onChange={(e) => setTimelineWidth(Number(e.target.value))} /><button onClick={() => setTimelineWidth(Math.min(1.6,timelineWidth+.25))}><ZoomIn /></button></div></div><div className="timeline-ruler"><span>00:00</span><span>00:05</span><span>00:10</span><span>00:15</span><span>00:20</span><span>00:25</span></div><div className="timeline-track"><div className="track-label"><Film /><span>视频</span></div><div className="track-clips" style={{'--zoom':timelineWidth} as React.CSSProperties}><i className="timeline-playhead" style={{left:`calc(${clip} * (132px * var(--zoom) + 4px) + 2px)`}} />{storyboard.map((item,i) => <button className={clip === i ? 'active' : ''} key={item.n} onClick={() => {setClip(i);setPlaying(true)}}><img src={item.image} alt="" /><span>{item.n} {item.title}</span><small>{item.seconds}</small></button>)}</div></div><div className="timeline-foot"><div><Clock3 />总时长 {total.toFixed(1)} 秒</div><button onClick={() => notify('文字重做已开启', '输入描述即可修改选中镜头')}><WandSparkles />输入文字重做</button></div></div></section>;
}

function Assistant({ stage, input, setInput, log, send, notify }: { stage: string; input: string; setInput: (v:string) => void; log: string[]; send: () => void; notify: (t:string,d?:string) => void }) {
  const hints: Record<string,string[]> = { '选题':['女性向都市悬疑','3 分钟互动体验','给我一个新点子'], '故事设定':['增强核心冲突','补全世界观规则','让角色关系更复杂'], '章节与分支':['增加一个隐藏结局','检查断裂分支','让选择代价更明显'], '小说与剧本':['对白更自然','增加结尾钩子','把这段改成动作戏'], '资产库':['统一角色服装','场景改成雪夜','重新设计主角'], '分镜':['增加人物特写','运镜更有压迫感','优化视频 Prompt'], '成片':['重做当前镜头','节奏更紧张','预览全部分支'] };
  return <aside className="studio-assistant"><header><div className="assistant-orb"><Sparkles /></div><div><strong>AI 创作助手</strong><span><i />正在协助：{stage}</span></div><button><MoreHorizontal /></button></header><div className="assistant-thread"><div className="assistant-message">我已经理解当前项目。你可以直接告诉我想修改什么，我会定位到当前选中的章节、资产或镜头。</div>{log.map((item,i) => <div className="user-message" key={`${item}-${i}`}>{item}</div>)}{log.length > 0 && <div className="assistant-message compact">已处理。相关内容已更新，你可以继续编辑或撤销这次修改。</div>}<div className="quick-prompts">{hints[stage].map((item) => <button key={item} onClick={() => { setInput(item); notify('已填入修改要求'); }}>{item}</button>)}</div></div><div className="assistant-input"><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {if(e.key === 'Enter' && !e.shiftKey){e.preventDefault();send();}}} placeholder="告诉 AI 你想怎么调整…" /><div><button className="attach" onClick={() => notify('可上传参考图片或文件')}><Plus /></button><span>Enter 发送 · Shift 换行</span><button className="send" onClick={send}><Send /></button></div></div></aside>;
}

function StageTitle({ eyebrow, title, desc, action, onAction }: { eyebrow:string; title:string; desc:string; action:string; onAction:()=>void }) { return <div className="stage-title"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{desc}</p></div><button onClick={onAction}><WandSparkles />{action}</button></div>; }
function Continue({ label, title, meta, action, onClick }: { label:string; title:string; meta:string; action:string; onClick:()=>void }) { return <div className="continue-bar"><div><span>{label}</span><strong>{title}</strong><small>{meta}</small></div><button onClick={onClick}>{action}<ChevronRight /></button></div>; }
