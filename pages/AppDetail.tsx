import React, { useState } from 'react';
import { ArrowLeft, Play, ShieldCheck, Car, Cpu, Headset, Factory, ShoppingBag, Box, Layers, GitBranch, Clock, Star, StarHalf, Activity, Sparkles, AlertCircle, CheckCircle2, TrendingUp, Users, Download, Server, Code, Zap, MessageSquare, ThumbsUp, Edit2, Trash2, Smile, Meh, Frown, BarChart3, DollarSign } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';

interface AppDetailProps {
  onBack: () => void;
  appId?: string;
}

// --- Rich Data Types ---
interface AppFeature {
  title: string;
  desc: string;
}

interface AppVersion {
  version: string;
  date: string;
  changes: string[];
}

interface RichApp {
  id: string;
  name: string;
  description: string;
  iconType: 'shield' | 'car' | 'cpu' | 'headset' | 'factory' | 'shopping';
  iconBgColor: string;
  iconColor: string;
  status: 'active' | 'beta';
  developer: string;
  lastUpdate: string;
  screenshots: string[];
  features: AppFeature[];
  techStack: string[];
  versions: AppVersion[];
  tags: string[];
}

interface AppEvaluationData {
  summary: string;
  highlights: string;
  improvements: string;
  aiDetails: { dimension: string; weight: number; score: number; evaluation: string; suggestion: string }[];
  hotWords: { positive: string[]; neutral: string[]; negative: string[] };
}

interface AppValueMetric {
  label: string;
  value: string;
  trend: string;
  trendDir: 'up' | 'down';
  desc: string;
  history: { date: string; value: number }[];
}

// --- MOCK DATABASE (Expanded for all 10 apps) ---
const RICH_APPS_DATA: Record<string, RichApp> = {
  '1': {
    id: '1',
    name: '化工安全生产管理系统',
    description: '基于多维表格与IoT集成，实时监控化工厂区安全隐患，实现隐患随手拍与自动派单整改闭环。',
    iconType: 'shield',
    iconBgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    status: 'active',
    developer: '能源行业产研团队',
    lastUpdate: '2025-12-01',
    screenshots: [
      'https://picsum.photos/400/250?random=201',
      'https://picsum.photos/400/250?random=202',
      'https://picsum.photos/400/250?random=203'
    ],
    features: [
      { title: '隐患随手拍', desc: '一线员工发现隐患，手机拍照一键上传，自动识别位置。' },
      { title: 'IoT 联动报警', desc: '对接厂区传感器，温度/压力异常自动触发报警任务。' },
      { title: '整改全闭环', desc: '隐患整改全流程记录，超时自动升级通知主管。' },
      { title: '风险热力图', desc: '可视化展示厂区风险分布，辅助管理层决策。' }
    ],
    techStack: ['多维表格', '飞书机器人', 'AnyCross', 'ECharts'],
    versions: [
      { version: 'v2.1.0', date: '2025-12-01', changes: ['新增AI识别隐患类型功能', '优化移动端拍照加载速度'] },
      { version: 'v2.0.0', date: '2025-10-15', changes: ['重构仪表盘，支持自定义组件', '接入新的IoT网关协议'] }
    ],
    tags: ['安全生产', 'IoT', '移动办公']
  },
  '2': {
    id: '2',
    name: '钢铁设备全生命周期管理',
    description: '针对高炉、轧机等核心设备，建立“点检-维修-备件”一体化预防性维护模型，降低非计划停机风险。',
    iconType: 'factory',
    iconBgColor: 'bg-slate-100',
    iconColor: 'text-slate-600',
    status: 'active',
    developer: '先进制造交付中心',
    lastUpdate: '2025-11-20',
    screenshots: [
      'https://picsum.photos/400/250?random=211',
      'https://picsum.photos/400/250?random=212',
      'https://picsum.photos/400/250?random=213'
    ],
    features: [
      { title: '预防性维护计划', desc: '基于设备运行时长自动生成保养工单。' },
      { title: '备件库存预警', desc: '与ERP打通，维修消耗自动扣减，低库存预警。' },
      { title: '故障知识库', desc: '沉淀历史维修记录，维修工扫码即可查看类似故障处理方案。' }
    ],
    techStack: ['飞书应用引擎', '多维表格', 'SAP集成连接器'],
    versions: [
      { version: 'v1.5.0', date: '2025-11-20', changes: ['新增移动端NFC巡检支持', '优化备件申请审批流'] },
      { version: 'v1.4.2', date: '2025-10-05', changes: ['修复设备台账同步延迟问题'] }
    ],
    tags: ['设备管理', 'TPM', '预防性维护']
  },
  '3': {
    id: '3',
    name: '汽车IPD研发协同平台',
    description: '打通需求、设计、测试全流程，支持万人级研发团队敏捷协作，缩短新车上市周期。',
    iconType: 'car',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    status: 'active',
    developer: '大制造解决方案部',
    lastUpdate: '2025-12-10',
    screenshots: [
      'https://picsum.photos/400/250?random=301',
      'https://picsum.photos/400/250?random=302',
      'https://picsum.photos/400/250?random=303'
    ],
    features: [
      { title: '需求全生命周期', desc: '从市场需求到研发需求，全链路可追溯。' },
      { title: '自动化流水线', desc: '集成GitLab/Jenkins，代码提交自动触发构建。' },
      { title: '研发效能看板', desc: '多维度度量研发效率，识别瓶颈。' }
    ],
    techStack: ['飞书项目 (Meego)', '飞书文档', 'GitLab集成', 'Jira迁移工具'],
    versions: [
      { version: 'v3.2.0', date: '2025-12-10', changes: ['支持跨项目需求关联', '优化甘特图性能'] },
      { version: 'v3.1.0', date: '2025-11-05', changes: ['新增自动化测试报告集成', '修复移动端查看Bug详情的显示问题'] }
    ],
    tags: ['IPD', '研发效能', 'DevOps']
  },
  '4': {
    id: '4',
    name: '消费电子智能客服工作台',
    description: '集成IM、邮件、电话多渠道，利用AI知识库辅助坐席快速回复，提升客户服务满意度(CSAT)。',
    iconType: 'headset',
    iconBgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    status: 'beta',
    developer: 'AI创新实验室',
    lastUpdate: '2025-10-15',
    screenshots: [
      'https://picsum.photos/400/250?random=401',
      'https://picsum.photos/400/250?random=402',
      'https://picsum.photos/400/250?random=403'
    ],
    features: [
      { title: 'AI 辅助回复', desc: '基于大模型自动生成回复建议，坐席一键发送。' },
      { title: '全渠道工单', desc: '统一管理来自APP、微信、邮件的用户反馈。' },
      { title: '舆情监控', desc: '实时分析用户对话情绪，负面情绪自动升级预警。' }
    ],
    techStack: ['飞书服务台', 'OpenAI Connector', 'Python Service'],
    versions: [
      { version: 'v0.9.0', date: '2025-10-15', changes: ['Beta版发布，开放内部试用', '接入知识库RAG能力'] }
    ],
    tags: ['AI客服', 'CSAT', '效率工具']
  },
  '5': {
    id: '5',
    name: '半导体良率分析大屏',
    description: '连接产线MES数据，通过BI看板实时展示晶圆良率趋势，辅助工艺工程师快速定位异常。',
    iconType: 'cpu',
    iconBgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    status: 'beta',
    developer: '高科技行业产研',
    lastUpdate: '2025-09-30',
    screenshots: [
      'https://picsum.photos/400/250?random=501',
      'https://picsum.photos/400/250?random=502'
    ],
    features: [
      { title: '实时良率监控', desc: '秒级刷新产线良率数据，支持按批次下钻。' },
      { title: '异常自动告警', desc: '检测到良率跌破阈值，自动拉群通知相关工程师。' },
      { title: '多维数据分析', desc: '支持按设备、工序、材料等多维度交叉分析。' }
    ],
    techStack: ['AnyCross', 'FineBI集成', '多维表格高级图表'],
    versions: [
      { version: 'v0.8.5', date: '2025-09-30', changes: ['优化大数据量下的图表渲染速度'] }
    ],
    tags: ['数据分析', '良率管理', 'MES集成']
  },
  '6': {
    id: '6',
    name: '新零售门店数字化巡检',
    description: '赋能督导与店长，通过移动端完成标准化巡检动作，数据实时上传总部，提升运营一致性。',
    iconType: 'shopping',
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    status: 'active',
    developer: '零售行业解决方案部',
    lastUpdate: '2025-11-05',
    screenshots: [
      'https://picsum.photos/400/250?random=601',
      'https://picsum.photos/400/250?random=602',
      'https://picsum.photos/400/250?random=603'
    ],
    features: [
      { title: '移动端标准化巡检', desc: '预置巡检SOP模板，支持拍照、水印打卡。' },
      { title: '问题自动整改', desc: '巡检发现问题自动生成整改任务，指派给店长。' },
      { title: '全国门店红黑榜', desc: '基于巡检分数自动生成排行榜，激励门店提升。' }
    ],
    techStack: ['多维表格', '飞书任务', '自动化流程'],
    versions: [
      { version: 'v2.0.1', date: '2025-11-05', changes: ['新增视频巡检功能', '优化弱网环境下的图片上传体验'] },
      { version: 'v1.9.0', date: '2025-09-20', changes: ['增加区域经理驾驶舱视图'] }
    ],
    tags: ['门店管理', '标准化', '移动办公']
  },
  '7': {
    id: '7',
    name: '消费电子DMS渠道管理',
    description: '连接品牌总部与各级经销商，实现订货、库存、销量数据的实时透明化管理。',
    iconType: 'shopping',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    status: 'active',
    developer: '渠道数字化团队',
    lastUpdate: '2025-12-08',
    screenshots: [
      'https://picsum.photos/400/250?random=701',
      'https://picsum.photos/400/250?random=702'
    ],
    features: [
      { title: '在线订货商城', desc: '经销商通过移动端直接下单，库存实时扣减。' },
      { title: 'PSI进销存管理', desc: '实时掌握各级渠道的库存水位，防止窜货。' },
      { title: '返利自动计算', desc: '根据销量达成情况自动计算返利金额。' }
    ],
    techStack: ['飞书应用引擎', '多维表格', '支付接口集成'],
    versions: [
      { version: 'v3.0.0', date: '2025-12-08', changes: ['全新UI升级，提升经销商订货体验', '支持多级经销商架构'] }
    ],
    tags: ['渠道管理', 'DMS', '进销存']
  },
  '8': {
    id: '8',
    name: '车辆试制管理系统',
    description: '管理试制车间的排程、物料与车辆状态，确保试制进度可视可控，加速量产验证。',
    iconType: 'car',
    iconBgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    status: 'active',
    developer: '汽车行业交付组',
    lastUpdate: '2025-11-25',
    screenshots: [
      'https://picsum.photos/400/250?random=801',
      'https://picsum.photos/400/250?random=802'
    ],
    features: [
      { title: '试制车辆档案', desc: '一车一档，全生命周期记录车辆状态与改制信息。' },
      { title: '车间可视化排程', desc: '甘特图展示台架占用情况，提升资源利用率。' },
      { title: '物料齐套分析', desc: '试制前自动检查物料齐套情况，避免停工待料。' }
    ],
    techStack: ['飞书项目', '多维表格', 'BOM系统集成'],
    versions: [
      { version: 'v1.2.0', date: '2025-11-25', changes: ['新增试驾车辆预约管理模块'] }
    ],
    tags: ['试制管理', '车辆档案', '研发协同']
  },
  '9': {
    id: '9',
    name: '研发工时填报助手',
    description: '集成于飞书侧边栏，研发人员可快速填报项目工时，自动生成效能报表。',
    iconType: 'cpu',
    iconBgColor: 'bg-gray-100',
    iconColor: 'text-gray-600',
    status: 'beta',
    developer: '内部效能团队',
    lastUpdate: '2025-10-20',
    screenshots: [
      'https://picsum.photos/400/250?random=901'
    ],
    features: [
      { title: '侧边栏快捷填报', desc: '无需跳转系统，在聊天窗口侧边即可完成填报。' },
      { title: '智能工时推荐', desc: '根据日历和代码提交记录，自动推荐工时内容。' },
      { title: '项目成本核算', desc: '自动生成各项目的研发人力成本报表。' }
    ],
    techStack: ['飞书小组件', '飞书应用引擎'],
    versions: [
      { version: 'v0.5.0', date: '2025-10-20', changes: ['支持批量填报一周工时'] }
    ],
    tags: ['工时管理', '研发效能', '成本核算']
  },
  '10': {
    id: '10',
    name: '汽车软件OTA管理平台',
    description: '管理车载软件的版本发布与空中升级任务，实时监控升级成功率。',
    iconType: 'cpu',
    iconBgColor: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    status: 'active',
    developer: '智能座舱研发部',
    lastUpdate: '2025-11-15',
    screenshots: [
      'https://picsum.photos/400/250?random=1001',
      'https://picsum.photos/400/250?random=1002'
    ],
    features: [
      { title: '版本发布管理', desc: '严格的审批流控制版本发布，确保安全。' },
      { title: '分批次灰度推送', desc: '支持按车型、地域进行灰度升级，降低风险。' },
      { title: '升级成功率监控', desc: '实时大屏展示升级成功率与失败原因分布。' }
    ],
    techStack: ['飞书项目', '后端微服务', '实时数据库'],
    versions: [
      { version: 'v2.1.0', date: '2025-11-15', changes: ['新增差分包下载加速功能'] }
    ],
    tags: ['OTA', '版本管理', '车联网']
  }
};

const DEFAULT_APP = RICH_APPS_DATA['1'];

// --- MOCK EVALUATION DATA ---
const APP_EVALUATION_DATABASE: Record<string, AppEvaluationData> = {
  '1': {
    summary: '该应用业务逻辑清晰，利用多维表格低代码特性实现了复杂的IoT集成。用户体验流畅，但在高并发消息推送下有优化空间。',
    highlights: '移动端交互体验极佳；IoT集成是亮点。',
    improvements: '建议优化机器人消息推送频率，避免消息轰炸。',
    aiDetails: [
      { dimension: '功能完备度', weight: 0.3, score: 95, evaluation: '核心功能覆盖完整。', suggestion: '无。' },
      { dimension: '用户体验 (UX)', weight: 0.2, score: 92, evaluation: '移动端操作非常顺手。', suggestion: '无。' },
      { dimension: '技术稳定性', weight: 0.2, score: 85, evaluation: '偶发消息推送延迟。', suggestion: '优化消息队列。' },
      { dimension: '创新性', weight: 0.15, score: 88, evaluation: 'IoT结合场景很有新意。', suggestion: '尝试接入视频流。' },
      { dimension: '代码规范', weight: 0.15, score: 90, evaluation: '配置规范。', suggestion: '无。' }
    ],
    hotWords: { positive: ['上手快', '报警及时'], neutral: ['配置略复杂'], negative: [] }
  },
  '2': {
    summary: '非常扎实的工业级应用，很好地解决了设备管理中的“信息孤岛”问题。虽然界面偏传统，但功能非常实用。',
    highlights: '数据模型设计严谨；与SAP集成稳定。',
    improvements: '移动端界面较为拥挤，建议优化布局。',
    aiDetails: [
      { dimension: '功能完备度', weight: 0.3, score: 92, evaluation: '覆盖设备全生命周期。', suggestion: '无。' },
      { dimension: '用户体验 (UX)', weight: 0.2, score: 75, evaluation: '信息密度过高。', suggestion: '简化移动端展示。' },
      { dimension: '技术稳定性', weight: 0.2, score: 98, evaluation: '非常稳定，适合高可靠场景。', suggestion: '无。' },
      { dimension: '创新性', weight: 0.15, score: 70, evaluation: '传统功能数字化。', suggestion: '引入预测性维护AI。' },
      { dimension: '代码规范', weight: 0.15, score: 88, evaluation: '逻辑清晰。', suggestion: '无。' }
    ],
    hotWords: { positive: ['稳定', '数据全', '实用'], neutral: ['界面一般'], negative: [] }
  },
  '3': {
    summary: '企业级的大型解决方案应用，逻辑严密，功能强大。完美复刻了IPD流程，但配置复杂度较高。',
    highlights: '流程非常专业；报表功能强大。',
    improvements: '新手引导不足，初次使用学习成本高。',
    aiDetails: [
      { dimension: '功能完备度', weight: 0.3, score: 98, evaluation: '几乎覆盖研发全场景。', suggestion: '无。' },
      { dimension: '用户体验 (UX)', weight: 0.2, score: 80, evaluation: '功能太多导致菜单复杂。', suggestion: '优化导航结构。' },
      { dimension: '技术稳定性', weight: 0.2, score: 95, evaluation: '非常稳定。', suggestion: '无。' },
      { dimension: '创新性', weight: 0.15, score: 85, evaluation: '标准的IPD落地。', suggestion: '增加AI需求辅助。' },
      { dimension: '代码规范', weight: 0.15, score: 92, evaluation: '配置规范。', suggestion: '无。' }
    ],
    hotWords: { positive: ['专业', '功能全'], neutral: ['有点重'], negative: ['学习成本高'] }
  },
  '4': {
    summary: '极具前瞻性的AI应用，大大减轻了客服压力。虽然目前处于Beta阶段，回答准确率有待提升，但潜力巨大。',
    highlights: 'RAG检索速度快；集成度高。',
    improvements: 'AI回答有时候会出现幻觉，需加强知识库清洗。',
    aiDetails: [
      { dimension: '功能完备度', weight: 0.3, score: 70, evaluation: '核心流程跑通，边缘场景待覆盖。', suggestion: '增加人工接管机制。' },
      { dimension: '用户体验 (UX)', weight: 0.2, score: 90, evaluation: '交互自然流畅。', suggestion: '无。' },
      { dimension: '技术稳定性', weight: 0.2, score: 80, evaluation: 'API调用偶尔超时。', suggestion: '增加重试机制。' },
      { dimension: '创新性', weight: 0.15, score: 98, evaluation: 'AI落地典范。', suggestion: '无。' },
      { dimension: '代码规范', weight: 0.15, score: 85, evaluation: '代码结构良好。', suggestion: '无。' }
    ],
    hotWords: { positive: ['智能', '省心'], neutral: ['回答不准'], negative: [] }
  },
  '5': {
    summary: '专注于数据可视化的应用，图表设计专业，能够处理海量MES数据。但在移动端的适配上稍显不足。',
    highlights: '数据处理能力强；可视化效果好。',
    improvements: '移动端查看体验较差，建议开发专门的手机视图。',
    aiDetails: [
      { dimension: '功能完备度', weight: 0.3, score: 85, evaluation: '分析维度丰富。', suggestion: '增加导出功能。' },
      { dimension: '用户体验 (UX)', weight: 0.2, score: 88, evaluation: '大屏效果震撼。', suggestion: '优化移动端适配。' },
      { dimension: '技术稳定性', weight: 0.2, score: 85, evaluation: '大数据量下偶有卡顿。', suggestion: '优化前端渲染。' },
      { dimension: '创新性', weight: 0.15, score: 80, evaluation: '传统BI的升级。', suggestion: '增加归因分析。' },
      { dimension: '代码规范', weight: 0.15, score: 90, evaluation: '规范。', suggestion: '无。' }
    ],
    hotWords: { positive: ['炫酷', '数据实时'], neutral: ['手机看不了'], negative: [] }
  },
  '6': {
    summary: '零售行业的标杆应用，极简的操作逻辑非常适合一线店员。系统稳定性经受住了千店并发的考验。',
    highlights: '极简易用；并发能力强。',
    improvements: '报表统计维度可以更丰富一些。',
    aiDetails: [
      { dimension: '功能完备度', weight: 0.3, score: 90, evaluation: '满足巡检核心需求。', suggestion: '增加视频分析。' },
      { dimension: '用户体验 (UX)', weight: 0.2, score: 98, evaluation: '零培训上手。', suggestion: '无。' },
      { dimension: '技术稳定性', weight: 0.2, score: 95, evaluation: '高并发无压力。', suggestion: '无。' },
      { dimension: '创新性', weight: 0.15, score: 85, evaluation: '流程创新。', suggestion: '无。' },
      { dimension: '代码规范', weight: 0.15, score: 92, evaluation: '非常规范。', suggestion: '无。' }
    ],
    hotWords: { positive: ['好用', '不卡顿', '店员喜欢'], neutral: [], negative: [] }
  },
  '7': {
    summary: '通过低代码平台实现了复杂的渠道管理逻辑，性价比极高。', highlights: '灵活配置；成本低。', improvements: '界面美观度有待提升。',
    aiDetails: [
        { dimension: '功能完备度', weight: 0.3, score: 88, evaluation: '覆盖进销存。', suggestion: '无。' },
        { dimension: '用户体验', weight: 0.2, score: 82, evaluation: '逻辑通顺但UI一般。', suggestion: 'UI升级。' },
        { dimension: '稳定性', weight: 0.2, score: 90, evaluation: '稳定。', suggestion: '无。' },
        { dimension: '创新性', weight: 0.15, score: 85, evaluation: '低代码模式创新。', suggestion: '无。' },
        { dimension: '规范性', weight: 0.15, score: 88, evaluation: '规范。', suggestion: '无。' }
    ],
    hotWords: { positive: ['灵活', '便宜'], neutral: ['丑'], negative: [] }
  },
  '8': {
    summary: '解决了试制车间排程混乱的老大难问题，甘特图交互很棒。', highlights: '可视化排程；交互好。', improvements: '与其他研发系统的集成深度不够。',
    aiDetails: [
        { dimension: '功能完备度', weight: 0.3, score: 85, evaluation: '排程功能强大。', suggestion: '加强集成。' },
        { dimension: '用户体验', weight: 0.2, score: 92, evaluation: '拖拽排程很方便。', suggestion: '无。' },
        { dimension: '稳定性', weight: 0.2, score: 90, evaluation: '稳定。', suggestion: '无。' },
        { dimension: '创新性', weight: 0.15, score: 80, evaluation: '可视化创新。', suggestion: '无。' },
        { dimension: '规范性', weight: 0.15, score: 85, evaluation: '规范。', suggestion: '无。' }
    ],
    hotWords: { positive: ['直观', '排程快'], neutral: [], negative: ['集成少'] }
  },
  '9': {
    summary: '小而美的工具，解决了填工时这一痛点。侧边栏嵌入体验无缝。', highlights: '嵌入式体验；智能推荐。', improvements: '功能单一，扩展性有限。',
    aiDetails: [
        { dimension: '功能完备度', weight: 0.3, score: 75, evaluation: '功能单一聚焦。', suggestion: '增加报表。' },
        { dimension: '用户体验', weight: 0.2, score: 95, evaluation: '无缝集成。', suggestion: '无。' },
        { dimension: '稳定性', weight: 0.2, score: 90, evaluation: '稳定。', suggestion: '无。' },
        { dimension: '创新性', weight: 0.15, score: 85, evaluation: '交互创新。', suggestion: '无。' },
        { dimension: '规范性', weight: 0.15, score: 90, evaluation: '规范。', suggestion: '无。' }
    ],
    hotWords: { positive: ['方便', '不打扰'], neutral: [], negative: [] }
  },
  '10': {
    summary: '高风险高可靠性应用，权限控制和审批流设计非常严谨。', highlights: '安全可靠；灰度发布。', improvements: '操作流程较为繁琐，审批链条过长。',
    aiDetails: [
        { dimension: '功能完备度', weight: 0.3, score: 95, evaluation: '功能完善。', suggestion: '无。' },
        { dimension: '用户体验', weight: 0.2, score: 78, evaluation: '流程繁琐。', suggestion: '简化审批。' },
        { dimension: '稳定性', weight: 0.2, score: 99, evaluation: '极高可靠性。', suggestion: '无。' },
        { dimension: '创新性', weight: 0.15, score: 80, evaluation: '常规。', suggestion: '无。' },
        { dimension: '规范性', weight: 0.15, score: 95, evaluation: '极其规范。', suggestion: '无。' }
    ],
    hotWords: { positive: ['安全', '放心'], neutral: ['慢'], negative: ['流程长'] }
  }
};

// --- MOCK VALUE DATA ---
const APP_VALUE_DATA: Record<string, Record<string, AppValueMetric>> = {
  '1': { // Chemical Safety
    'instances': { label: '活跃厂区数', value: '342个', trend: '+12%', trendDir: 'up', desc: '部署并活跃使用的化工厂区数量。', history: [{date:'8月',value:200},{date:'12月',value:342}] },
    'users': { label: '日活安全员', value: '12.5k', trend: '+5%', trendDir: 'up', desc: '一线安全巡检人员DAU。', history: [{date:'8月',value:8000},{date:'12月',value:12500}] },
    'value': { label: '隐患整改率', value: '99.8%', trend: '+15%', trendDir: 'up', desc: '隐患闭环整改的比例。', history: [{date:'8月',value:85},{date:'12月',value:99.8}] },
    'copy': { label: '被复制次数', value: '85次', trend: '+8', trendDir: 'up', desc: '被其他架构师引用的次数。', history: [{date:'8月',value:20},{date:'12月',value:85}] }
  },
  '2': { // Steel Equipment
    'instances': { label: '管理设备数', value: '5.2万台', trend: '+5%', trendDir: 'up', desc: '纳入系统的核心设备总数。', history: [{date:'8月',value:40000},{date:'12月',value:52000}] },
    'users': { label: '维修工单数', value: '850/周', trend: '-10%', trendDir: 'down', desc: '预防性维护降低了故障维修工单。', history: [{date:'8月',value:1000},{date:'12月',value:850}] },
    'value': { label: '非停时间降低', value: '25%', trend: '-', trendDir: 'up', desc: '非计划停机时间环比下降。', history: [{date:'8月',value:10},{date:'12月',value:25}] },
    'copy': { label: '被复制次数', value: '30次', trend: '+2', trendDir: 'up', desc: '被复制次数。', history: [{date:'8月',value:10},{date:'12月',value:30}] }
  },
  '3': { // Auto IPD
    'instances': { label: '活跃项目数', value: '120个', trend: '+8%', trendDir: 'up', desc: '正在进行的车型研发项目。', history: [{date:'8月',value:80},{date:'12月',value:120}] },
    'users': { label: '研发DAU', value: '8.5k', trend: '+12%', trendDir: 'up', desc: '研发人员日活。', history: [{date:'8月',value:6000},{date:'12月',value:8500}] },
    'value': { label: 'TTM缩短', value: '30%', trend: '-', trendDir: 'up', desc: '上市周期缩短比例。', history: [{date:'8月',value:10},{date:'12月',value:30}] },
    'copy': { label: '被复制次数', value: '120次', trend: '+15', trendDir: 'up', desc: '行业标杆效应明显。', history: [{date:'8月',value:50},{date:'12月',value:120}] }
  },
  '4': { // AI CS
    'instances': { label: '接入渠道数', value: '15个', trend: '+3', trendDir: 'up', desc: '覆盖的IM、邮件等渠道。', history: [{date:'8月',value:5},{date:'12月',value:15}] },
    'users': { label: 'AI解决率', value: '65%', trend: '+20%', trendDir: 'up', desc: 'AI独立解决问题的比例。', history: [{date:'8月',value:45},{date:'12月',value:65}] },
    'value': { label: 'CSAT提升', value: '15%', trend: '+5%', trendDir: 'up', desc: '客户满意度提升。', history: [{date:'8月',value:5},{date:'12月',value:15}] },
    'copy': { label: '被复制次数', value: '12次', trend: '+5', trendDir: 'up', desc: 'Beta阶段引用较少。', history: [{date:'8月',value:2},{date:'12月',value:12}] }
  },
  '5': { // Semi Yield
    'instances': { label: '接入产线', value: '8条', trend: '0', trendDir: 'up', desc: '覆盖的核心晶圆产线。', history: [{date:'8月',value:4},{date:'12月',value:8}] },
    'users': { label: '日均访问', value: '450次', trend: '+10%', trendDir: 'up', desc: '工程师查看看板次数。', history: [{date:'8月',value:300},{date:'12月',value:450}] },
    'value': { label: '异常发现耗时', value: '-80%', trend: 'down', trendDir: 'up', desc: '从发生异常到发现的时间缩短。', history: [{date:'8月',value:50},{date:'12月',value:80}] },
    'copy': { label: '被复制次数', value: '18次', trend: '+1', trendDir: 'up', desc: '复制数。', history: [{date:'8月',value:5},{date:'12月',value:18}] }
  },
  '6': { // Retail
    'instances': { label: '覆盖门店', value: '5200家', trend: '+500', trendDir: 'up', desc: '活跃使用系统的门店。', history: [{date:'8月',value:4000},{date:'12月',value:5200}] },
    'users': { label: '店长月活', value: '98%', trend: '0', trendDir: 'up', desc: '店长每月至少使用一次的比例。', history: [{date:'8月',value:95},{date:'12月',value:98}] },
    'value': { label: '巡检报告耗时', value: '-90%', trend: 'down', trendDir: 'up', desc: '自动生成报告节省的时间。', history: [{date:'8月',value:50},{date:'12月',value:90}] },
    'copy': { label: '被复制次数', value: '210次', trend: '+30', trendDir: 'up', desc: '极其热门的模板。', history: [{date:'8月',value:100},{date:'12月',value:210}] }
  },
  '7': { // DMS
    'instances': { label: '经销商数', value: '1200家', trend: '+10%', trendDir: 'up', desc: '活跃订货的经销商。', history: [{date:'8月',value:1000},{date:'12月',value:1200}] },
    'users': { label: '订单处理', value: '5k/天', trend: '+15%', trendDir: 'up', desc: '日均自动处理订单量。', history: [{date:'8月',value:3000},{date:'12月',value:5000}] },
    'value': { label: '库存周转天数', value: '-15%', trend: 'down', trendDir: 'up', desc: '渠道库存周转优化。', history: [{date:'8月',value:5},{date:'12月',value:15}] },
    'copy': { label: '被复制次数', value: '95次', trend: '+12', trendDir: 'up', desc: '复制数。', history: [{date:'8月',value:50},{date:'12月',value:95}] }
  },
  '8': { // Auto Proto
    'instances': { label: '管理车辆', value: '350辆', trend: '+20', trendDir: 'up', desc: '在管试制车数量。', history: [{date:'8月',value:200},{date:'12月',value:350}] },
    'users': { label: '资源利用率', value: '85%', trend: '+10%', trendDir: 'up', desc: '台架/车间资源利用率。', history: [{date:'8月',value:70},{date:'12月',value:85}] },
    'value': { label: '排程耗时', value: '-60%', trend: 'down', trendDir: 'up', desc: '排程计划编制时间缩短。', history: [{date:'8月',value:30},{date:'12月',value:60}] },
    'copy': { label: '被复制次数', value: '25次', trend: '+2', trendDir: 'up', desc: '复制数。', history: [{date:'8月',value:10},{date:'12月',value:25}] }
  },
  '9': { // Timesheet
    'instances': { label: '使用团队', value: '45个', trend: '+5', trendDir: 'up', desc: '内部研发团队数。', history: [{date:'8月',value:30},{date:'12月',value:45}] },
    'users': { label: '填报率', value: '99%', trend: '+5%', trendDir: 'up', desc: '按时填报工时的比例。', history: [{date:'8月',value:90},{date:'12月',value:99}] },
    'value': { label: '填报耗时', value: '1min', trend: 'flat', trendDir: 'up', desc: '人均周填报耗时。', history: [{date:'8月',value:1},{date:'12月',value:1}] },
    'copy': { label: '被复制次数', value: '150次', trend: '+20', trendDir: 'up', desc: '工具类应用复制量大。', history: [{date:'8月',value:100},{date:'12月',value:150}] }
  },
  '10': { // OTA
    'instances': { label: '升级任务', value: '500+', trend: '+50', trendDir: 'up', desc: '累计执行的升级任务。', history: [{date:'8月',value:300},{date:'12月',value:500}] },
    'users': { label: '覆盖车辆', value: '200万', trend: '+10%', trendDir: 'up', desc: 'OTA覆盖的终端车辆。', history: [{date:'8月',value:150},{date:'12月',value:200}] },
    'value': { label: '升级成功率', value: '99.5%', trend: '+0.5%', trendDir: 'up', desc: 'OTA升级成功率。', history: [{date:'8月',value:99},{date:'12月',value:99.5}] },
    'copy': { label: '被复制次数', value: '10次', trend: '0', trendDir: 'up', desc: '专业性强，复制少。', history: [{date:'8月',value:8},{date:'12月',value:10}] }
  }
};

// --- Helper: Star Rating ---
const StarRatingInput = ({ score, onChange }: { score: number, onChange: (s: number) => void }) => {
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    const value = (index * 20) + (isHalf ? 10 : 20);
    setHoverScore(value);
  };
  const handleClick = () => { if (hoverScore !== null) onChange(hoverScore); };
  const displayScore = hoverScore !== null ? hoverScore : score;
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHoverScore(null)}>
      {[0, 1, 2, 3, 4].map(i => {
        const starValueFull = (i + 1) * 20;
        const starValueHalf = starValueFull - 10;
        let icon;
        if (displayScore >= starValueFull) icon = <Star size={20} className="fill-yellow-400 text-yellow-400 transition-colors" />;
        else if (displayScore >= starValueHalf) icon = <StarHalf size={20} className="fill-yellow-400 text-yellow-400 transition-colors" />;
        else icon = <Star size={20} className="text-gray-300 transition-colors" />;
        return <div key={i} className="cursor-pointer p-0.5" onMouseMove={(e) => handleMouseMove(e, i)} onClick={handleClick}>{icon}</div> 
      })}
      <span className="ml-2 text-sm font-bold text-yellow-500 w-10">{displayScore}</span>
    </div>
  )
}

const AppDetail: React.FC<AppDetailProps> = ({ onBack, appId = '1' }) => {
  const [activeTab, setActiveTab] = useState<'detail' | 'quality' | 'value'>('detail');
  
  const app = RICH_APPS_DATA[appId] || RICH_APPS_DATA['1']; // Fallback strictly
  const evaluation = APP_EVALUATION_DATABASE[appId] || APP_EVALUATION_DATABASE['1'];
  const valueMetrics = APP_VALUE_DATA[appId] || APP_VALUE_DATA['1'];

  // --- Evaluation State ---
  const [userReviews, setUserReviews] = useState([
    { id: 1, user: '业务负责人', score: 100, comment: '功能正好满足我们的痛点，推荐！', date: '2025/11/20', likes: 8 },
    { id: 2, user: 'IT管理员', score: 80, comment: '部署很方便，API文档也很全。', date: '2025/11/25', likes: 3 }
  ]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewScore, setNewReviewScore] = useState(80);

  // Derived Calculations
  const aiScore = Math.round(evaluation.aiDetails.reduce((acc, i) => acc + i.score * i.weight, 0));
  const userScore = Math.round(userReviews.reduce((acc, r) => acc + r.score, 0) / userReviews.length);
  const finalScore = Math.round(aiScore * 0.6 + userScore * 0.4); 
  
  const chartData = evaluation.aiDetails.map(item => ({ subject: item.dimension, A: item.score, fullMark: 100 }));

  const handleAddReview = () => {
    if (!newReviewText.trim()) return;
    setUserReviews([{ id: Date.now(), user: '我', score: newReviewScore, comment: newReviewText, date: '刚刚', likes: 0 }, ...userReviews]);
    setNewReviewText('');
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'shield': return <ShieldCheck size={32} />;
      case 'car': return <Car size={32} />;
      case 'cpu': return <Cpu size={32} />;
      case 'headset': return <Headset size={32} />;
      case 'factory': return <Factory size={32} />;
      case 'shopping': return <ShoppingBag size={32} />;
      default: return <Box size={32} />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn pb-24">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition group">
        <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 返回应用中心
      </button>

      {/* Tabs */}
      <div className="bg-white rounded-t-2xl border-b border-gray-100 px-8 pt-2 flex gap-8 overflow-x-auto shadow-sm z-10 relative">
        <button onClick={() => setActiveTab('detail')} className={`py-4 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'detail' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>应用详情</button>
        <button onClick={() => setActiveTab('quality')} className={`py-4 text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1 ${activeTab === 'quality' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>质量评分 <span className="bg-lark-100 text-lark-600 text-[10px] px-1.5 py-0.5 rounded-full font-normal">AI</span></button>
        <button onClick={() => setActiveTab('value')} className={`py-4 text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1 ${activeTab === 'value' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>应用价值</button>
      </div>

      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 border-t-0 p-8 min-h-[600px]">
        
        {/* --- TAB 1: DETAIL --- */}
        {activeTab === 'detail' && (
          <div className="space-y-8 animate-fadeIn">
             {/* Header */}
             <div className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-8">
                <div className={`w-24 h-24 ${app.iconBgColor} ${app.iconColor} rounded-3xl flex items-center justify-center shrink-0 shadow-inner`}>
                   {getIcon(app.iconType)}
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-extrabold text-gray-900">{app.name}</h1>
                      {app.status === 'active' ? (
                        <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">ONLINE</span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border border-purple-200">BETA</span>
                      )}
                   </div>
                   <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-3xl">{app.description}</p>
                   <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Users size={14}/> 开发者: {app.developer}</span>
                      <span className="flex items-center gap-1"><Clock size={14}/> 更新于: {app.lastUpdate}</span>
                      <div className="flex gap-2">
                         {app.tags.map(t => <span key={t} className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">{t}</span>)}
                      </div>
                   </div>
                </div>
                <div className="flex flex-col justify-center gap-3 min-w-[140px]">
                   <button className="flex items-center justify-center gap-2 px-6 py-3 bg-lark-500 hover:bg-lark-600 text-white rounded-xl font-bold shadow-lg shadow-lark-200 transition transform hover:-translate-y-0.5">
                      <Play size={18} fill="currentColor" /> 立即试用
                   </button>
                   <button className="flex items-center justify-center gap-2 px-6 py-2 bg-white border border-gray-200 hover:border-lark-200 text-gray-600 hover:text-lark-600 rounded-xl font-medium transition">
                      <Download size={16} /> 安装指南
                   </button>
                </div>
             </div>

             {/* Screenshots */}
             <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Layers size={20} className="text-lark-500"/> 应用截图</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {app.screenshots.map((src, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group">
                         <img src={src} alt={`Screenshot ${i+1}`} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                   ))}
                </div>
             </div>

             {/* Features & Tech Stack */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Zap size={20} className="text-yellow-500"/> 核心功能</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {app.features.map((feat, i) => (
                         <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-lark-200 transition">
                            <h4 className="font-bold text-gray-900 mb-1">{feat.title}</h4>
                            <p className="text-xs text-gray-500">{feat.desc}</p>
                         </div>
                      ))}
                   </div>
                </div>
                <div>
                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Code size={20} className="text-blue-500"/> 技术架构</h3>
                   <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                      <div className="flex flex-wrap gap-2 mb-6">
                         {app.techStack.map(t => (
                            <span key={t} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg border border-blue-100">{t}</span>
                         ))}
                      </div>
                      <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2"><GitBranch size={16}/> 更新日志</h4>
                      <div className="space-y-4 relative pl-2 border-l-2 border-gray-100">
                         {app.versions.map((ver, i) => (
                            <div key={i} className="relative">
                               <div className="absolute -left-[13px] top-1.5 w-2 h-2 rounded-full bg-lark-300 ring-4 ring-white"></div>
                               <div className="flex justify-between items-center mb-1">
                                  <span className="font-bold text-xs text-gray-800">{ver.version}</span>
                                  <span className="text-[10px] text-gray-400">{ver.date}</span>
                               </div>
                               <ul className="list-disc list-inside text-xs text-gray-500 space-y-0.5">
                                  {ver.changes.map((c, idx) => <li key={idx}>{c}</li>)}
                               </ul>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB 2: QUALITY (EVALUATION) --- */}
        {activeTab === 'quality' && (
          <div className="space-y-8 animate-fadeIn">
             <div className="bg-gradient-to-r from-purple-50 to-white p-8 rounded-2xl border border-purple-100 flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2"><Sparkles className="text-purple-500" /> 应用质量评分</h3>
                   <p className="text-gray-500 text-sm">基于AI对代码规范、用户体验及运行稳定性的智能评估</p>
                </div>
                <div className="flex items-center gap-8">
                   <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">AI 评分 (60%)</div>
                      <div className="text-2xl font-bold text-gray-800">{aiScore}</div>
                   </div>
                   <div className="w-px h-10 bg-gray-200"></div>
                   <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">用户评分 (40%)</div>
                      <div className="text-2xl font-bold text-gray-800">{userScore}</div>
                   </div>
                   <div className="w-px h-10 bg-gray-200"></div>
                   <div className="text-center">
                      <div className="text-sm text-purple-600 font-bold mb-1">综合得分</div>
                      <div className="text-5xl font-extrabold text-purple-600">{finalScore}</div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Radar & Summary */}
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex gap-6">
                      <div className="w-1/3 shrink-0 h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                               <PolarGrid />
                               <PolarAngleAxis dataKey="subject" tick={{fontSize: 12}} />
                               <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                               <Radar name="得分" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                               <Tooltip />
                            </RadarChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="flex-1 py-2">
                         <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Activity size={16} className="text-purple-500"/> AI 评价综述</h4>
                         <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">{evaluation.summary}</p>
                         <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-green-600 font-bold block mb-1">亮点</span><p className="text-gray-500 text-xs">{evaluation.highlights}</p></div>
                            <div><span className="text-orange-500 font-bold block mb-1">待改进</span><p className="text-gray-500 text-xs">{evaluation.improvements}</p></div>
                         </div>
                      </div>
                   </div>

                   {/* User Reviews */}
                   <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                      <h4 className="font-bold text-gray-800 mb-6">用户评价 ({userReviews.length})</h4>
                      
                      {/* Input */}
                      <div className="bg-gray-50 p-4 rounded-lg mb-6 flex gap-4">
                         <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">我</div>
                         <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                               <span className="text-sm text-gray-600 font-medium">打分:</span>
                               <StarRatingInput score={newReviewScore} onChange={setNewReviewScore} />
                            </div>
                            <textarea 
                              value={newReviewText}
                              onChange={(e) => setNewReviewText(e.target.value)}
                              placeholder="使用体验如何？" 
                              className="w-full p-2 border border-gray-200 rounded-md text-sm mb-2 focus:outline-none focus:border-lark-500"
                              rows={2}
                            />
                            <div className="flex justify-end">
                               <button onClick={handleAddReview} className="px-4 py-1.5 bg-lark-500 text-white text-xs rounded-md hover:bg-lark-600 transition">发布评价</button>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4">
                         {userReviews.map(r => (
                            <div key={r.id} className="border-b border-gray-50 pb-4 last:border-0">
                               <div className="flex justify-between items-start mb-1">
                                  <div className="flex items-center gap-2">
                                     <span className="font-bold text-sm text-gray-800">{r.user}</span>
                                     <div className="flex text-yellow-400 text-xs">{[...Array(Math.floor(r.score/20))].map((_,i)=><Star key={i} size={10} fill="currentColor"/>)}</div>
                                  </div>
                                  <span className="text-xs text-gray-400">{r.date}</span>
                               </div>
                               <p className="text-sm text-gray-600">{r.comment}</p>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Right: Tag Cloud */}
                <div className="space-y-6">
                   <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                      <h4 className="font-bold text-gray-800 mb-4">评价热词</h4>
                      <div className="flex flex-wrap gap-2">
                         {evaluation.hotWords.positive.map(w => <span key={w} className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full">{w}</span>)}
                         {evaluation.hotWords.neutral.map(w => <span key={w} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{w}</span>)}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB 3: VALUE (IMPACT) --- */}
        {activeTab === 'value' && (
          <div className="space-y-8 animate-fadeIn">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-bold text-gray-900">应用业务价值看板</h3>
                   <p className="text-sm text-gray-500 mt-1">评估该应用在业务侧的实际使用情况与产生的降本增效价值</p>
                </div>
                <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">数据更新于: {new Date().toLocaleDateString()}</div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[valueMetrics.instances, valueMetrics.users, valueMetrics.value, valueMetrics.copy].map((m, i) => (
                   <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm font-medium">
                         {i === 0 && <Server size={18} className="text-blue-500"/>}
                         {i === 1 && <Users size={18} className="text-yellow-500"/>}
                         {i === 2 && <DollarSign size={18} className="text-purple-500"/>}
                         {i === 3 && <Download size={18} className="text-green-500"/>}
                         {m.label}
                      </div>
                      <div className="flex items-baseline gap-2 mb-2">
                         <span className="text-3xl font-extrabold text-gray-900">{m.value}</span>
                         <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${m.trendDir === 'up' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{m.trend}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-4 h-8 leading-tight">{m.desc}</p>
                      <div className="h-10">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={m.history}>
                               <Area type="monotone" dataKey="value" stroke={i===0?'#3b82f6':i===1?'#eab308':i===2?'#a855f7':'#22c55e'} strokeWidth={2} fillOpacity={0.1} fill={i===0?'#3b82f6':i===1?'#eab308':i===2?'#a855f7':'#22c55e'} />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                ))}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                   <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Server size={18} className="text-lark-500"/> 实例增长趋势 (近5个月)</h4>
                   <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={valueMetrics.instances.history}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                            <YAxis hide />
                            <Tooltip cursor={{fill: '#f8fafc'}} />
                            <Bar dataKey="value" fill="#3370ff" radius={[4, 4, 0, 0]} barSize={32} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                   <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-orange-500"/> DAU 活跃趋势</h4>
                   <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={valueMetrics.users.history}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#eab308" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                            <YAxis hide />
                            <Tooltip cursor={{fill: '#f8fafc'}} />
                            <Area type="monotone" dataKey="value" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AppDetail;