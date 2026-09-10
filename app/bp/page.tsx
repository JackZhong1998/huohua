'use client';

import {useState} from 'react';
import {ArrowLeft,ArrowRight,Check,ChevronDown,Copy,Gamepad2,Globe2,Layers3,Play,Share2,Sparkles,TrendingUp,Users,Zap} from 'lucide-react';
import './bp.css';

const markets=[['核心切入','中国互动影游','18 亿','37 亿','2030E'],['相邻市场','中国微短剧','677.9 亿','1505.9 亿','2030E'],['技术扩张','全球 AI 视频','55 亿美元','423 亿美元','2033E']];
const solutions=[['01','0 → 1','精品互动影视游戏','用恋爱、逆袭、生存与悬疑内容验证付费、互动率、多周目和留存。'],['02','1 → 10','AI 创作工具扩大供给','剧本 Agent、导演 Agent 与低门槛编辑器，把制作经验变成创作者能力。'],['03','10 → 100','无限流互动','点击、语言和偏好成为下一段视频的生产信号，消费过程中按需生成。']];
const directions=[['女性向恋爱互动','年轻女性','关系选择 · 专属角色 · 情绪价值'],['男性向逆袭 / 生存','年轻男性','身份升级 · 策略选择 · 掌控结果'],['悬疑与密室闯关','泛游戏用户','自由解法 · 即时反馈 · 多结局'],['改写剧情','影视与短剧用户','换角色 · 换走向 · 弥补遗憾']];
const milestones=[['0—6 个月','上线多款精品互动游戏','验证订阅、单款直卖和游戏包；建立互动率、完播率、多周目率与留存基线。'],['6—12 个月','工具与供给启动','上线积分体系、剧本 Agent、导演 Agent；引入首批邀请制创作者。'],['12—24 个月','从分支走向无限流','扩大品类与创作者规模，提高实时生成占比，验证品牌剧情与 IP 联运。']];

export default function BusinessPlan(){
 const[copied,setCopied]=useState(false);
 async function copyWechat(){await navigator.clipboard?.writeText('lifetour2026');setCopied(true);setTimeout(()=>setCopied(false),1800)}
 return <main className="bp-page">
  <nav className="bp-nav"><a href="../"><ArrowLeft/>返回产品</a><span className="bp-brand">火花<i/></span><button onClick={()=>navigator.share?.({title:'火花｜天使轮商业计划书',url:location.href}).catch(()=>{})}><Share2/>分享</button></nav>
  <section className="bp-hero"><div className="hero-orbit"><i/><i/><i/></div><span className="eyebrow">ANGEL ROUND · 2026</span><h1>让视频从<br/><em>观看</em>变成<em>参与</em></h1><p>可看、可选、可由用户输入实时生成。</p><div className="hero-actions"><a href="#overview">开始阅读<ChevronDown/></a><div><b>AI 原生</b><span>互动视频平台</span></div></div></section>
  <section className="bp-metrics"><article><small>切入市场</small><strong>18<sup>亿</sup></strong><span>互动影游 · 2026E</span></article><article><small>相邻市场</small><strong>678<sup>亿</sup></strong><span>中国微短剧 · 2025</span></article><article><small>目标市场</small><strong>1506<sup>亿</sup></strong><span>中国微短剧 · 2030E</span></article></section>

  <section id="overview" className="bp-section"><Title no="01" en="PROJECT">生产即消费的<br/>AI 原生视频平台</Title><div className="overview-grid"><p>火花独立于抖音、红果，从互动影视游戏的生产与消费切入，逐步走向无限视频消费平台。</p><div className="path-cards"><article><b>现在</b><span>精品互动游戏</span><small>建立「可看可选」心智</small></article><ArrowRight/><article><b>接下来</b><span>AI 创作工具</span><small>扩大内容供给</small></article><ArrowRight/><article><b>未来</b><span>无限流互动</span><small>输入即刻生成</small></article></div></div></section>

  <section className="bp-section dark"><Title no="02" en="OPPORTUNITY">已验证市场<br/>叠加两个新变量</Title><div className="variable-grid"><article><div><Layers3/><span>变量一</span></div><h3>供给低门槛化、规模化</h3><p>剧本 Agent、导演 Agent 与视频生成降低成本和周期，精品 PGC 可扩展为 PUGC / UGC。</p></article><article><div><Zap/><span>变量二</span></div><h3>解锁无限消费</h3><p>互动从预拍固定分支升级为根据用户输入实时生成新角色、新情节与新知识。</p></article></div><p className="formula">更多供给 <b>×</b> 更长消费 <b>×</b> 更多人群</p></section>

  <section className="bp-section"><Title no="03" en="MARKET">从 18 亿切入<br/>打开千亿空间</Title><div className="market-grid">{markets.map((m,i)=><article key={m[1]}><small>{m[0]}</small><h3>{m[1]}</h3><div><span>当前</span><b>{m[2]}</b></div><div><span>{m[4]}</span><b>{m[3]}</b></div><i style={{height:`${42+i*22}%`}}/></article>)}</div><div className="tam"><div><span>TAM</span><b>约 1506 亿元</b><small>虚构视频内容消费</small></div><ArrowRight/><div><span>SAM</span><b>约 75—151 亿元</b><small>AI 互动可服务市场</small></div><ArrowRight/><div><span>SOM</span><b>约 4—15 亿元</b><small>头部平台年收入</small></div></div><p className="source">互动影游与短剧：中信证券引述 DataEye、艾媒咨询；全球 AI 视频：Grand View Research。SAM / SOM 为互动渗透率情景测算。</p></section>

  <section className="bp-section"><Title no="04" en="POSITION">进入虚构世界<br/>并决定如何发展</Title><div className="quadrant"><span className="axis top">主动创造</span><span className="axis bottom">被动消费</span><span className="axis left">真实世界</span><span className="axis right">虚构世界</span><i className="h"/><i className="v"/><div className="brand-point"><Sparkles/><b>火花</b><small>可看 · 可选 · 可生成</small></div><div className="point douyin">抖音<small>真实 · 被动刷</small></div><div className="point hongguo">红果<small>虚构 · 被动看</small></div></div><div className="intensity"><article><small>轻度</small><b>看</b><p>像短剧一样自动播放</p></article><article><small>中度</small><b>选</b><p>只在关键节点参与</p></article><article><small>重度</small><b>改</b><p>高频控制角色与剧情</p></article></div></section>

  <section className="bp-section soft"><Title no="05" en="SOLUTION">三步走</Title><div className="solution-list">{solutions.map(s=><article key={s[0]}><span>{s[0]}</span><div><small>{s[1]}</small><h3>{s[2]}</h3><p>{s[3]}</p></div></article>)}</div></section>

  <section className="bp-section"><Title no="06" en="CONTENT">首批内容方向</Title><div className="direction-list">{directions.map((d,i)=><article key={d[0]}><span>0{i+1}</span><div><h3>{d[0]}</h3><small>{d[1]}</small><p>{d[2]}</p></div><Play/></article>)}</div><p className="focus">首阶段聚焦娱乐内容和强付费意愿，不同时铺开所有场景。</p></section>

  <section className="bp-section"><Title no="07" en="WHY NOW">视频生成成本<br/>正在快速下降</Title><div className="cost-card"><div className="cost-head"><TrendingUp/><span>15 秒视频生成成本</span></div><article><span>Seedance 2.0</span><b>US$2.25</b><i style={{width:'100%'}}/></article><article><span>MiniMax H3 Max</span><b>US$1.20</b><i style={{width:'53%'}}/></article><article className="promo"><span>H3 Max 发布期</span><b>US$0.30</b><i style={{width:'13%'}}/></article></div><small className="note">公开价格用于趋势展示；Seedance 因渠道与地区不同而变化，H3 Max 促销价格截至 2026 年 9 月 14 日。</small></section>

  <section className="bp-section"><Title no="08" en="BUSINESS">先验证内容收入<br/>再平台化</Title><div className="business-flow"><article><small>0—6 个月</small><h3>内容付费</h3><p>会员订阅 · 单款直卖 · 游戏包</p></article><article><small>6—12 个月</small><h3>生成消费</h3><p>订阅 + 积分 / Token</p></article><article><small>2 年后</small><h3>平台商业化</h3><p>PPL · 品牌剧情 · IP 联运</p></article></div></section>

  <section className="bp-section dark"><Title no="09" en="FLYWHEEL">供给与消费<br/>共同加速</Title><div className="wheel"><div><Sparkles/><b>火花</b><small>互动视频网络</small></div>{['精品游戏','付费用户','选择数据','Agent 模板','创作者供给','更强分发'].map((x,i)=><span key={x} style={{'--i':i} as React.CSSProperties}>{x}</span>)}</div></section>

  <section className="bp-section"><Title no="10" en="ROADMAP">24 个月里程碑</Title><div className="roadmap-list">{milestones.map((m,i)=><article key={m[0]}><span>{i+1}</span><div><small>{m[0]}</small><h3>{m[1]}</h3><p>{m[2]}</p></div></article>)}</div></section>

  <section className="bp-section"><Title no="11" en="VALIDATION">用结果证明<br/>互动值得存在</Title><div className="validation-grid"><article><h3><Check/>核心指标</h3><p>互动节点触发率 · 连续互动率 · 完播率 · 多周目率 · D1 / D7 / D30 · 付费转化率 · ARPPU · 单分钟成本 · 模式切换率 · 创作者首作完成率</p></article><article><h3><Zap/>证伪条件</h3><p>互动长期偏低；无法提升留存与付费；单位经济模型不成立；连续性、角色一致性和剧情质量达不到付费标准。</p></article></div></section>

  <section className="bp-section"><Title no="12" en="TEAM">来自剪映 AI 产品一线</Title><div className="team-card"><img src="../team-avatar.jpg" alt="钟镇杰"/><div><span>创始人 / 核心团队</span><h3>产品、内容与 AI 工程的交叉能力</h3><p>负责剪映 AI 成片、AI 图片与剪映 Agent 等产品建设，理解创作者工作流、大规模消费产品、增长分发与商业化。</p></div></div><div className="team-points"><span><Gamepad2/>精品内容制作</span><span><Sparkles/>模型能力产品化</span><span><Users/>创作者生态</span><span><Globe2/>全球化分发</span></div></section>

  <section className="bp-section"><Title no="13" en="ANGEL ROUND">本轮资金用途</Title><div className="funds"><article><b>35%</b><span>首批内容制作与发行</span></article><article><b>30%</b><span>产品与 AI 工程团队</span></article><article><b>25%</b><span>Agent 与互动编辑器研发</span></article><article><b>10%</b><span>增长和商业化验证</span></article></div></section>

  <section className="bp-close"><span className="bp-brand large">火花<i/></span><h2>用 AI 把有限分支<br/>变成无限供给</h2><p>把一款互动游戏，扩展为一个新的视频内容平台。</p><a href="../">体验产品<ArrowRight/></a></section>
  <div className="bp-contact"><img src="../team-avatar.jpg" alt="钟镇杰"/><div><small>联系创始人 · 微信</small><b>lifetour2026</b></div><button onClick={copyWechat}>{copied?<><Check/>已复制</>:<><Copy/>复制</>}</button></div>
 </main>
}

function Title({no,en,children}:{no:string;en:string;children:React.ReactNode}){return <header><span>{no} / {en}</span><h2>{children}</h2></header>}
