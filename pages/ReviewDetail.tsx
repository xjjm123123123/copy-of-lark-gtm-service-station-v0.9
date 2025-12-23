import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, XCircle, Users, Scale, AlertTriangle, Lightbulb, CheckCircle, Sparkles, Activity, MessageSquare, ThumbsUp, Edit2, Trash2, Star, StarHalf, Smile, Meh, Frown, BookOpen, GitMerge, Target, Calendar, MapPin, DollarSign, Briefcase, FileText, Share2, Download, BarChart3, Presentation } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';

interface ReviewDetailProps {
  onBack: () => void;
  reviewId?: string; // Optional prop for routing
}

// --- Rich Data Types ---
interface DecisionRole {
  role: string;
  title: string;
  attitude: 'support' | 'neutral' | 'oppose';
  concern: string;
}

interface RichReview {
  id: string;
  projectName: string;
  result: 'won' | 'lost';
  amount: string;
  competitor: string;
  industry: string;
  owner: string;
  date: string;
  reason: string;
  background: string;
  timeline: { date: string; event: string; status: 'normal' | 'risk' | 'critical' }[];
  decisionChain: DecisionRole[];
  comparisonData: { subject: string; us: number; them: number; fullMark: number }[];
  lessons: { type: 'good' | 'bad'; content: string }[];
  tags: string[];
}

interface ReviewEvaluationData {
  summary: string;
  highlights: string;
  improvements: string;
  aiDetails: { dimension: string; weight: number; score: number; evaluation: string; suggestion: string }[];
  hotWords: { positive: string[]; neutral: string[]; negative: string[] };
}

interface ReviewValueMetric {
  label: string;
  value: string;
  trend: string;
  trendDir: 'up' | 'down';
  desc: string;
  history: { date: string; value: number }[];
}

// --- MOCK DATABASE ---
const RICH_REVIEWS_DATA: Record<string, RichReview> = {
  '1': { // Won - Finance
    id: '1',
    projectName: '某大型股份制银行协同办公项目',
    result: 'won',
    amount: '800万',
    competitor: '传统OA厂商A',
    industry: '金融',
    owner: '王金',
    date: '2025-08-15',
    reason: '产品体验极致，能够满足内网部署的高安全性要求。',
    background: '客户原有OA系统架构老旧，移动端体验差，无法支持敏捷开发团队的协作需求。CIO发起数字化转型专项，意图引入新一代办公平台。',
    tags: ['私有化部署', '信创适配', '高层攻坚'],
    timeline: [
      { date: '2025-02', event: '首次接触，挖掘需求', status: 'normal' },
      { date: '2025-04', event: 'POC 测试启动', status: 'normal' },
      { date: '2025-05', event: '竞对恶意低价竞争', status: 'risk' },
      { date: '2025-06', event: '高层互访，确定战略合作', status: 'normal' },
      { date: '2025-08', event: '中标签约', status: 'normal' }
    ],
    decisionChain: [
      { role: '决策者', title: 'CIO', attitude: 'support', concern: '系统安全性与信创适配能力' },
      { role: '影响者', title: '科技部总经理', attitude: 'support', concern: '开发接口开放性与生态集成' },
      { role: '把关者', title: '采购部总经理', attitude: 'neutral', concern: '采购合规性与价格' },
      { role: '使用者', title: '业务线员工', attitude: 'support', concern: '移动办公体验' }
    ],
    comparisonData: [
      { subject: '产品功能', us: 90, them: 70, fullMark: 100 },
      { subject: '价格竞争力', us: 60, them: 90, fullMark: 100 },
      { subject: '安全性', us: 95, them: 85, fullMark: 100 },
      { subject: '服务响应', us: 90, them: 75, fullMark: 100 },
      { subject: '品牌', us: 85, them: 80, fullMark: 100 },
    ],
    lessons: [
      { type: 'good', content: 'POC阶段全员驻场，快速响应客户定制化需求，建立了深厚的信任壁垒。' },
      { type: 'good', content: '利用飞书文档协同撰写标书，效率远超竞对，展现了产品价值。' },
      { type: 'bad', content: '商务谈判阶段对采购流程预判不足，导致合同签署延期2周。' }
    ]
  },
  '2': { // Lost - Logistics
    id: '2',
    projectName: '某头部物流企业数字化升级',
    result: 'lost',
    amount: '350万',
    competitor: '竞对B',
    industry: '供应物流',
    owner: '赵流',
    date: '2025-09-20',
    reason: '价格差距过大，且客户对IM的依赖度低，更看重ERP集成能力。',
    background: '客户希望打通仓储、运输与财务系统，实现数据的一体化流转。',
    tags: ['价格战', '需求错位', 'ERP集成'],
    timeline: [
      { date: '2025-06', event: '收到标书邀请', status: 'normal' },
      { date: '2025-07', event: '方案宣讲', status: 'normal' },
      { date: '2025-08', event: '技术答疑，发现关键功能缺失', status: 'critical' },
      { date: '2025-09', event: '丢单', status: 'normal' }
    ],
    decisionChain: [
      { role: '决策者', title: '运营副总裁', attitude: 'oppose', concern: '更看重业务流数据打通，而非沟通' },
      { role: '影响者', title: 'IT总监', attitude: 'neutral', concern: '旧系统迁移成本' },
      { role: '使用者', title: '一线调度', attitude: 'support', concern: '操作简便性' }
    ],
    comparisonData: [
      { subject: '产品功能', us: 80, them: 85, fullMark: 100 },
      { subject: '业务理解', us: 70, them: 90, fullMark: 100 },
      { subject: '价格', us: 60, them: 95, fullMark: 100 },
      { subject: '集成能力', us: 75, them: 85, fullMark: 100 },
    ],
    lessons: [
      { type: 'bad', content: '前期需求调研不充分，未发现客户核心痛点是ERP数据打通，而非IM沟通。' },
      { type: 'bad', content: '过分强调通用功能，忽视了物流行业的垂直场景需求。' },
      { type: 'good', content: '虽然输单，但与IT部门建立了联系，未来有局部合作机会。' }
    ]
  },
  '3': { // Won - Internet
    id: '3',
    projectName: '科技独角兽企业全员上飞书',
    result: 'won',
    amount: '500万',
    competitor: '竞对X',
    industry: '互联网',
    owner: '孙网',
    date: '2025-10-10',
    reason: '客户高层是飞书粉丝，自上而下推动，无需教育成本。',
    background: '客户处于快速扩张期，原有办公工具无法支撑3000人规模的敏捷协同。CEO非常认可字节跳动的管理理念。',
    tags: ['高层推动', '口碑传播', '敏捷协作'],
    timeline: [
        { date: '2025-08', event: 'CEO直接联系我方', status: 'normal' },
        { date: '2025-09', event: '快速验证，全员试用', status: 'normal' },
        { date: '2025-10', event: '正式签约', status: 'normal' }
    ],
    decisionChain: [
        { role: '决策者', title: 'CEO', attitude: 'support', concern: '组织效率与文化' },
        { role: '执行者', title: 'HRD', attitude: 'support', concern: 'OKR落地' }
    ],
    comparisonData: [
        { subject: '文化契合度', us: 98, them: 60, fullMark: 100 },
        { subject: '功能', us: 90, them: 85, fullMark: 100 },
        { subject: '价格', us: 80, them: 80, fullMark: 100 },
        { subject: '服务', us: 90, them: 85, fullMark: 100 }
    ],
    lessons: [
        { type: 'good', content: '抓住了CEO这个核心关键人，通过“Context not Control”理念产生共鸣。' },
        { type: 'good', content: '快速部署，让全员在试用期就产生了路径依赖。' }
    ]
  },
  '4': { // Lost - Catering
    id: '4',
    projectName: '某连锁餐饮集团门店管理',
    result: 'lost',
    amount: '200万',
    competitor: '竞对C',
    industry: '大消费',
    owner: '李餐',
    date: '2025-10-05',
    reason: '竞对提供了硬件+软件的一体化方案，我们纯软件方案落地阻力大。',
    background: '客户需要一套门店管理系统，不仅要软件，还需要配套的收银机、巡店摄像头等硬件设备。',
    tags: ['软硬一体', '解决方案缺失'],
    timeline: [
        { date: '2025-08', event: '方案入围', status: 'normal' },
        { date: '2025-09', event: '硬件POC测试失败', status: 'critical' },
        { date: '2025-10', event: '输单', status: 'normal' }
    ],
    decisionChain: [
        { role: '决策者', title: '运营总监', attitude: 'oppose', concern: '不想分别采购软硬件' },
        { role: '影响者', title: 'IT经理', attitude: 'neutral', concern: '集成难度' }
    ],
    comparisonData: [
        { subject: '软件体验', us: 90, them: 75, fullMark: 100 },
        { subject: '硬件集成', us: 40, them: 95, fullMark: 100 },
        { subject: '总成本', us: 70, them: 85, fullMark: 100 },
        { subject: '售后便利性', us: 60, them: 90, fullMark: 100 }
    ],
    lessons: [
        { type: 'bad', content: '低估了客户对“交钥匙工程”的诉求，纯SaaS方案在传统行业落地难。' },
        { type: 'bad', content: '缺乏硬件生态合作伙伴，临时寻找的供应商配合度低。' }
    ]
  },
  '5': { // Won - Auto
    id: '5',
    projectName: '未来汽车集团研发协同项目',
    result: 'won',
    amount: '1200万',
    competitor: '竞对D',
    industry: '大制造',
    owner: '张三',
    date: '2025-11-15',
    reason: '飞书项目(Meego)完美契合IPD研发流程，解决跨部门协作痛点。',
    background: '客户研发团队破万人，工具割裂严重。',
    tags: ['IPD变革', '万人协同', 'Meego'],
    timeline: [
        { date: '2025-06', event: '深入调研，梳理IPD流程', status: 'normal' },
        { date: '2025-09', event: 'POC验证成功', status: 'normal' },
        { date: '2025-11', event: '签约', status: 'normal' }
    ],
    decisionChain: [
        { role: '决策者', title: 'CTO', attitude: 'support', concern: '研发效能' },
        { role: '支持者', title: 'PMO总监', attitude: 'support', concern: '流程规范' }
    ],
    comparisonData: [
        { subject: '流程适配', us: 95, them: 70, fullMark: 100 },
        { subject: '用户体验', us: 90, them: 60, fullMark: 100 },
        { subject: '数据分析', us: 90, them: 80, fullMark: 100 }
    ],
    lessons: [
        { type: 'good', content: '不仅仅是卖工具，更是卖咨询，帮客户梳理了研发SOP。' },
        { type: 'good', content: 'Meego的高度可配置性完美承接了复杂的IPD流程。' }
    ]
  },
  '6': { // Won - Consumer Electronics
    id: '6',
    projectName: '某知名消费电子品牌DMS项目',
    result: 'won',
    amount: '450万',
    competitor: '竞对E',
    industry: '大制造',
    owner: '陈静',
    date: '2025-12-01',
    reason: '多维表格搭建的轻量级DMS系统，上线快、成本低，深得业务部门喜爱。',
    background: '客户需要管理全国经销商库存，传统DMS系统重、贵、难用。',
    tags: ['低代码', '渠道管理', '性价比'],
    timeline: [
        { date: '2025-10', event: '需求沟通', status: 'normal' },
        { date: '2025-11', event: 'Demo演示（多维表格）', status: 'normal' },
        { date: '2025-12', event: '签约', status: 'normal' }
    ],
    decisionChain: [
        { role: '决策者', title: '销售VP', attitude: 'support', concern: '数据实时性' },
        { role: '使用者', title: '渠道经理', attitude: 'support', concern: '好用' }
    ],
    comparisonData: [
        { subject: '实施周期', us: 98, them: 60, fullMark: 100 },
        { subject: '成本', us: 95, them: 70, fullMark: 100 },
        { subject: '灵活性', us: 95, them: 65, fullMark: 100 }
    ],
    lessons: [
        { type: 'good', content: '用低代码打败了传统软件，降维打击。' },
        { type: 'good', content: '现场搭建Demo，展示了极强的灵活性。' }
    ]
  },
  '7': { // Won - Energy
    id: '7',
    projectName: '某大型能源国企安全管理系统',
    result: 'won',
    amount: '680万',
    competitor: '竞对F',
    industry: '能源化工',
    owner: '刘伟',
    date: '2025-11-20',
    reason: 'IoT集成能力强，且私有化部署满足国企数据安全红线。',
    background: '国企数字化转型，安全生产是重中之重。',
    tags: ['安全生产', 'IoT集成', '私有化'],
    timeline: [
        { date: '2025-07', event: '技术交流', status: 'normal' },
        { date: '2025-09', event: '安全审计通过', status: 'normal' },
        { date: '2025-11', event: '签约', status: 'normal' }
    ],
    decisionChain: [
        { role: '决策者', title: '安全总监', attitude: 'support', concern: '免责' },
        { role: '把关者', title: '信息中心主任', attitude: 'support', concern: '数据不出域' }
    ],
    comparisonData: [
        { subject: '安全性', us: 95, them: 90, fullMark: 100 },
        { subject: '连接能力', us: 90, them: 75, fullMark: 100 },
        { subject: '移动端', us: 85, them: 70, fullMark: 100 }
    ],
    lessons: [
        { type: 'good', content: '私有化部署是国企的敲门砖。' },
        { type: 'good', content: '集成了现有的摄像头和传感器，避免了客户重复投资。' }
    ]
  },
  '8': { // Won - Retail
    id: '8',
    projectName: '超级零售连锁门店数字化项目',
    result: 'won',
    amount: '320万',
    competitor: '竞对G',
    industry: '大消费',
    owner: '李雷',
    date: '2025-12-05',
    reason: '移动端体验极佳，一线店员零培训上手，巡检效率提升显著。',
    background: '门店巡检效率低，数据不真实。',
    tags: ['门店巡检', '一线赋能', '移动办公'],
    timeline: [
        { date: '2025-10', event: '门店试点', status: 'normal' },
        { date: '2025-11', event: '效果验证', status: 'normal' },
        { date: '2025-12', event: '全员推广', status: 'normal' }
    ],
    decisionChain: [
        { role: '决策者', title: '运营总监', attitude: 'support', concern: '执行力' },
        { role: '使用者', title: '店长', attitude: 'support', concern: '简单' }
    ],
    comparisonData: [
        { subject: '易用性', us: 98, them: 80, fullMark: 100 },
        { subject: '部署速度', us: 95, them: 70, fullMark: 100 },
        { subject: '数据闭环', us: 90, them: 85, fullMark: 100 }
    ],
    lessons: [
        { type: 'good', content: '得一线者得天下，简单的产品一线才愿意用。' },
        { type: 'good', content: '巡检+任务闭环，直接解决了问题。' }
    ]
  }
};

const DEFAULT_REVIEW = RICH_REVIEWS_DATA['1'];

// --- MOCK EVALUATION DATA ---
const REVIEW_EVALUATION_DATABASE: Record<string, ReviewEvaluationData> = {
  '1': {
    summary: '这是一篇非常高质量的赢单复盘。详细记录了打单过程，决策链分析透彻。',
    highlights: '决策链分析精准；POC策略总结到位。',
    improvements: '商务谈判环节挖掘可更深。',
    aiDetails: [
      { dimension: '复盘深度', weight: 0.3, score: 95, evaluation: '归因准确。', suggestion: '无。' },
      { dimension: '信息完整性', weight: 0.2, score: 90, evaluation: '数据详实。', suggestion: '无。' },
      { dimension: '可复制性', weight: 0.2, score: 92, evaluation: 'POC策略可复制。', suggestion: '无。' },
      { dimension: '敢于暴露问题', weight: 0.2, score: 85, evaluation: '坦诚。', suggestion: '无。' },
      { dimension: '逻辑', weight: 0.1, score: 90, evaluation: '清晰。', suggestion: '无。' }
    ],
    hotWords: { positive: ['教科书级', '金融必读'], neutral: [], negative: [] }
  },
  '2': {
    summary: '态度诚恳的输单复盘。客观面对产品短板，指出了物流垂类场景的不足。',
    highlights: '竞对分析详细；痛点挖掘深刻。',
    improvements: '改进建议偏少。',
    aiDetails: [
      { dimension: '复盘深度', weight: 0.3, score: 88, evaluation: '归因准确。', suggestion: '无。' },
      { dimension: '信息完整性', weight: 0.2, score: 85, evaluation: '基本完整。', suggestion: '无。' },
      { dimension: '可复制性', weight: 0.2, score: 80, evaluation: '避坑指南。', suggestion: '无。' },
      { dimension: '敢于暴露问题', weight: 0.2, score: 95, evaluation: '非常坦诚。', suggestion: '无。' },
      { dimension: '逻辑', weight: 0.1, score: 85, evaluation: '清晰。', suggestion: '无。' }
    ],
    hotWords: { positive: ['诚恳', '避坑'], neutral: ['遗憾'], negative: [] }
  },
  '3': {
    summary: '展示了如何利用高层影响力进行销售的经典案例。',
    highlights: '抓住了关键人；利用了产品文化势能。',
    improvements: '对具体实施过程的描述略显简略。',
    aiDetails: [
      { dimension: '复盘深度', weight: 0.3, score: 90, evaluation: '策略清晰。', suggestion: '无。' },
      { dimension: '信息完整性', weight: 0.2, score: 85, evaluation: '完整。', suggestion: '增加实施细节。' },
      { dimension: '可复制性', weight: 0.2, score: 80, evaluation: '特定场景可复制。', suggestion: '无。' },
      { dimension: '敢于暴露问题', weight: 0.2, score: 85, evaluation: '尚可。', suggestion: '无。' },
      { dimension: '逻辑', weight: 0.1, score: 90, evaluation: '清晰。', suggestion: '无。' }
    ],
    hotWords: { positive: ['借势', '文化输出'], neutral: [], negative: [] }
  },
  '4': {
    summary: '深刻的输单教训，揭示了纯SaaS方案在传统行业面临的软硬一体化挑战。',
    highlights: '归因非常准确，指出了生态短板。',
    improvements: '缺乏对未来生态建设的具体建议。',
    aiDetails: [
      { dimension: '复盘深度', weight: 0.3, score: 92, evaluation: '痛点分析到位。', suggestion: '无。' },
      { dimension: '信息完整性', weight: 0.2, score: 88, evaluation: '完整。', suggestion: '无。' },
      { dimension: '可复制性', weight: 0.2, score: 85, evaluation: '警示作用强。', suggestion: '无。' },
      { dimension: '敢于暴露问题', weight: 0.2, score: 95, evaluation: '不回避。', suggestion: '无。' },
      { dimension: '逻辑', weight: 0.1, score: 90, evaluation: '清晰。', suggestion: '无。' }
    ],
    hotWords: { positive: ['生态短板', '警示'], neutral: [], negative: [] }
  },
  '5': {
    summary: '大制造行业标杆案例复盘，体现了专业解决方案的价值。',
    highlights: '体现了Consultative Selling的能力。',
    improvements: '无。',
    aiDetails: [
      { dimension: '复盘深度', weight: 0.3, score: 95, evaluation: '极佳。', suggestion: '无。' },
      { dimension: '信息完整性', weight: 0.2, score: 95, evaluation: '极佳。', suggestion: '无。' },
      { dimension: '可复制性', weight: 0.2, score: 90, evaluation: '高。', suggestion: '无。' },
      { dimension: '敢于暴露问题', weight: 0.2, score: 90, evaluation: '好。', suggestion: '无。' },
      { dimension: '逻辑', weight: 0.1, score: 95, evaluation: '严密。', suggestion: '无。' }
    ],
    hotWords: { positive: ['专业', '顾问式销售'], neutral: [], negative: [] }
  },
  '6': {
    summary: '低代码应用场景的经典胜利，证明了“快”也是一种核心竞争力。',
    highlights: '即兴Demo能力展示了售前的技术自信。',
    improvements: '无。',
    aiDetails: [
      { dimension: '复盘深度', weight: 0.3, score: 90, evaluation: '好。', suggestion: '无。' },
      { dimension: '信息完整性', weight: 0.2, score: 90, evaluation: '好。', suggestion: '无。' },
      { dimension: '可复制性', weight: 0.2, score: 95, evaluation: '极高。', suggestion: '无。' },
      { dimension: '敢于暴露问题', weight: 0.2, score: 85, evaluation: '好。', suggestion: '无。' },
      { dimension: '逻辑', weight: 0.1, score: 90, evaluation: '清晰。', suggestion: '无。' }
    ],
    hotWords: { positive: ['降维打击', '灵活'], neutral: [], negative: [] }
  },
  '7': {
    summary: '国企攻坚战的胜利，验证了私有化+IoT策略的有效性。',
    highlights: '准确把握了国企客户的安全红线。',
    improvements: '无。',
    aiDetails: [
      { dimension: '复盘深度', weight: 0.3, score: 92, evaluation: '好。', suggestion: '无。' },
      { dimension: '信息完整性', weight: 0.2, score: 88, evaluation: '好。', suggestion: '无。' },
      { dimension: '可复制性', weight: 0.2, score: 85, evaluation: '中。', suggestion: '无。' },
      { dimension: '敢于暴露问题', weight: 0.2, score: 85, evaluation: '好。', suggestion: '无。' },
      { dimension: '逻辑', weight: 0.1, score: 90, evaluation: '清晰。', suggestion: '无。' }
    ],
    hotWords: { positive: ['安全红线', 'IoT'], neutral: [], negative: [] }
  },
  '8': {
    summary: '零售行业标准化打法的胜利，产品力是核心。',
    highlights: '强调了用户体验在决策中的权重。',
    improvements: '无。',
    aiDetails: [
      { dimension: '复盘深度', weight: 0.3, score: 90, evaluation: '好。', suggestion: '无。' },
      { dimension: '信息完整性', weight: 0.2, score: 90, evaluation: '好。', suggestion: '无。' },
      { dimension: '可复制性', weight: 0.2, score: 95, evaluation: '高。', suggestion: '无。' },
      { dimension: '敢于暴露问题', weight: 0.2, score: 85, evaluation: '好。', suggestion: '无。' },
      { dimension: '逻辑', weight: 0.1, score: 90, evaluation: '清晰。', suggestion: '无。' }
    ],
    hotWords: { positive: ['体验至上', '一线'], neutral: [], negative: [] }
  }
};

// --- MOCK VALUE DATA ---
const REVIEW_VALUE_DATA: Record<string, Record<string, ReviewValueMetric>> = {
  '1': {
    'train': { label: '培训引用', value: '12次', trend: '+2', trendDir: 'up', desc: '新员工培训案例。', history: [{date:'8月',value:2},{date:'12月',value:12}] },
    'sop': { label: 'SOP优化', value: '3项', trend: '+1', trendDir: 'up', desc: '优化了POC流程。', history: [{date:'8月',value:0},{date:'12月',value:3}] },
    'win': { label: '协助赢单', value: '5单', trend: '+1', trendDir: 'up', desc: '类似项目参考赢单。', history: [{date:'8月',value:0},{date:'12月',value:5}] },
    'read': { label: '阅读量', value: '2.5k', trend: '+15%', trendDir: 'up', desc: '内部阅读热度。', history: [{date:'8月',value:500},{date:'12月',value:2500}] }
  },
  '2': {
    'train': { label: '培训引用', value: '5次', trend: '+1', trendDir: 'up', desc: '避坑典型案例。', history: [{date:'9月',value:1},{date:'12月',value:5}] },
    'sop': { label: 'SOP优化', value: '1项', trend: '0', trendDir: 'up', desc: '补充需求调研清单。', history: [{date:'9月',value:0},{date:'12月',value:1}] },
    'win': { label: '规避风险', value: '8次', trend: '+2', trendDir: 'up', desc: '早期识别不匹配商机。', history: [{date:'9月',value:2},{date:'12月',value:8}] },
    'read': { label: '阅读量', value: '1.2k', trend: '+5%', trendDir: 'up', desc: '内部阅读热度。', history: [{date:'9月',value:300},{date:'12月',value:1200}] }
  },
  '3': {
    'train': { label: '培训引用', value: '8次', trend: '+2', trendDir: 'up', desc: '高层攻坚案例。', history: [{date:'10月',value:2},{date:'12月',value:8}] },
    'sop': { label: 'SOP优化', value: '0项', trend: '0', trendDir: 'up', desc: '无。', history: [{date:'10月',value:0},{date:'12月',value:0}] },
    'win': { label: '协助赢单', value: '3单', trend: '+1', trendDir: 'up', desc: '参考赢单。', history: [{date:'10月',value:1},{date:'12月',value:3}] },
    'read': { label: '阅读量', value: '1.8k', trend: '+10%', trendDir: 'up', desc: '热度。', history: [{date:'10月',value:500},{date:'12月',value:1800}] }
  },
  '4': {
    'train': { label: '培训引用', value: '3次', trend: '+1', trendDir: 'up', desc: '行业警示。', history: [{date:'10月',value:1},{date:'12月',value:3}] },
    'sop': { label: 'SOP优化', value: '1项', trend: '+1', trendDir: 'up', desc: '生态合作评估流程。', history: [{date:'10月',value:0},{date:'12月',value:1}] },
    'win': { label: '规避风险', value: '5次', trend: '+1', trendDir: 'up', desc: '止损。', history: [{date:'10月',value:1},{date:'12月',value:5}] },
    'read': { label: '阅读量', value: '900', trend: '+5%', trendDir: 'up', desc: '热度。', history: [{date:'10月',value:200},{date:'12月',value:900}] }
  },
  '5': {
    'train': { label: '培训引用', value: '15次', trend: '+3', trendDir: 'up', desc: '制造业必读。', history: [{date:'11月',value:5},{date:'12月',value:15}] },
    'sop': { label: 'SOP优化', value: '2项', trend: '0', trendDir: 'up', desc: 'IPD售前SOP。', history: [{date:'11月',value:1},{date:'12月',value:2}] },
    'win': { label: '协助赢单', value: '6单', trend: '+2', trendDir: 'up', desc: '复制成功。', history: [{date:'11月',value:2},{date:'12月',value:6}] },
    'read': { label: '阅读量', value: '3.5k', trend: '+20%', trendDir: 'up', desc: '极高热度。', history: [{date:'11月',value:1000},{date:'12月',value:3500}] }
  },
  '6': {
    'train': { label: '培训引用', value: '10次', trend: '+2', trendDir: 'up', desc: '多维表格应用案例。', history: [{date:'12月',value:5},{date:'12月',value:10}] },
    'sop': { label: 'SOP优化', value: '0项', trend: '0', trendDir: 'up', desc: '无。', history: [{date:'12月',value:0},{date:'12月',value:0}] },
    'win': { label: '协助赢单', value: '4单', trend: '+2', trendDir: 'up', desc: '复制。', history: [{date:'12月',value:1},{date:'12月',value:4}] },
    'read': { label: '阅读量', value: '2.0k', trend: '+15%', trendDir: 'up', desc: '热度。', history: [{date:'12月',value:500},{date:'12月',value:2000}] }
  },
  '7': {
    'train': { label: '培训引用', value: '6次', trend: '+1', trendDir: 'up', desc: '国企案例。', history: [{date:'11月',value:3},{date:'12月',value:6}] },
    'sop': { label: 'SOP优化', value: '1项', trend: '0', trendDir: 'up', desc: '私有化交付标准。', history: [{date:'11月',value:1},{date:'12月',value:1}] },
    'win': { label: '协助赢单', value: '2单', trend: '+1', trendDir: 'up', desc: '复制。', history: [{date:'11月',value:1},{date:'12月',value:2}] },
    'read': { label: '阅读量', value: '1.5k', trend: '+10%', trendDir: 'up', desc: '热度。', history: [{date:'11月',value:500},{date:'12月',value:1500}] }
  },
  '8': {
    'train': { label: '培训引用', value: '8次', trend: '+2', trendDir: 'up', desc: '零售案例。', history: [{date:'12月',value:4},{date:'12月',value:8}] },
    'sop': { label: 'SOP优化', value: '0项', trend: '0', trendDir: 'up', desc: '无。', history: [{date:'12月',value:0},{date:'12月',value:0}] },
    'win': { label: '协助赢单', value: '3单', trend: '+1', trendDir: 'up', desc: '复制。', history: [{date:'12月',value:1},{date:'12月',value:3}] },
    'read': { label: '阅读量', value: '1.8k', trend: '+12%', trendDir: 'up', desc: '热度。', history: [{date:'12月',value:600},{date:'12月',value:1800}] }
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

const ReviewDetail: React.FC<ReviewDetailProps> = ({ onBack, reviewId = '1' }) => {
  const [activeTab, setActiveTab] = useState<'detail' | 'quality' | 'value'>('detail');
  
  const review = RICH_REVIEWS_DATA[reviewId] || DEFAULT_REVIEW;
  const evaluation = REVIEW_EVALUATION_DATABASE[reviewId] || REVIEW_EVALUATION_DATABASE['1'];
  const valueMetrics = REVIEW_VALUE_DATA[reviewId] || REVIEW_VALUE_DATA['1'];

  // --- Evaluation State ---
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewScore, setNewReviewScore] = useState(80);

  // Initialize reviews dynamically based on Review ID
  useEffect(() => {
    let initialReviews: any[] = [];
    switch (reviewId) {
        case '1': // Finance
            initialReviews = [
                { id: 1, user: '销售总监-李强', score: 95, comment: '这篇复盘写得非常深刻，把我们赢单的关键点总结得很到位，建议全员学习。', date: '2025/08/20', likes: 25 },
                { id: 2, user: '售前-张伟', score: 90, comment: '感谢分享，POC策略对我现在的项目很有启发。', date: '2025/08/21', likes: 10 }
            ];
            break;
        case '2': // Logistics (Lost)
            initialReviews = [
                { id: 1, user: '销售总监-李强', score: 85, comment: '输单复盘很及时，物流行业的坑要吸取教训。', date: '2025/09/25', likes: 12 }
            ];
            break;
        case '3': // Internet
            initialReviews = [
                { id: 1, user: 'HRVP', score: 98, comment: '文化输出是最好的销售策略，赞同！', date: '2025/10/12', likes: 20 }
            ];
            break;
        case '4': // Catering (Lost)
            initialReviews = [
                { id: 1, user: '生态合作部', score: 80, comment: '正在抓紧补齐硬件生态伙伴，这种丢单不会再发生了。', date: '2025/10/08', likes: 15 }
            ];
            break;
        case '5': // Auto
             initialReviews = [
                { id: 1, user: '交付负责人-赵强', score: 98, comment: 'IPD流程梳理是关键，Meego配置太灵活了，完美适配。', date: '2025/11/18', likes: 15 },
                { id: 2, user: '销售-张三', score: 95, comment: '客户CTO对我们的专业度评价很高，大家辛苦了。', date: '2025/11/16', likes: 20 }
             ];
             break;
        case '6': // Consumer Electronics
             initialReviews = [
                { id: 1, user: '售前-陈静', score: 92, comment: '多维表格演示效果炸裂，客户没想到这么快就能搭出系统。', date: '2025/12/03', likes: 10 },
                { id: 2, user: '交付-王工', score: 85, comment: '实施周期确实短，但数据量大了之后仪表盘渲染有点慢，要注意。', date: '2025/12/05', likes: 5 }
             ];
             break;
        case '7': // Energy
             initialReviews = [
                { id: 1, user: '安全顾问-李工', score: 90, comment: '国企对安全红线卡得很死，私有化部署方案立大功。', date: '2025/11/22', likes: 12 },
                { id: 2, user: '销售-刘伟', score: 95, comment: '现场POC的时候，IoT设备一连上数据就跳出来，客户领导直接拍板了。', date: '2025/11/21', likes: 18 }
             ];
             break;
        case '8': // Retail
             initialReviews = [
                { id: 1, user: '运营专家-周周', score: 96, comment: '一线店员的体验是决胜关键，竞对的产品太复杂了。', date: '2025/12/07', likes: 14 },
                { id: 2, user: '售前-吴总', score: 90, comment: '巡检闭环逻辑讲得很透，客户运营总监非常有共鸣。', date: '2025/12/06', likes: 8 }
             ];
             break;
        default:
             initialReviews = [
                { id: 1, user: '匿名用户', score: 88, comment: '值得学习的案例。', date: '2025/11/01', likes: 2 }
             ];
    }
    setUserReviews(initialReviews);
  }, [reviewId]);

  // Derived Calculations
  const aiScore = Math.round(evaluation.aiDetails.reduce((acc, i) => acc + i.score * i.weight, 0));
  const userScore = Math.round(userReviews.reduce((acc, r) => acc + r.score, 0) / (userReviews.length || 1));
  const finalScore = Math.round(aiScore * 0.6 + userScore * 0.4); 
  
  const chartData = evaluation.aiDetails.map(item => ({ subject: item.dimension, A: item.score, fullMark: 100 }));

  const handleAddReview = () => {
    if (!newReviewText.trim()) return;
    setUserReviews([{ id: Date.now(), user: '我', score: newReviewScore, comment: newReviewText, date: '刚刚', likes: 0 }, ...userReviews]);
    setNewReviewText('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn pb-24">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition group">
        <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 返回复盘列表
      </button>

      {/* Tabs */}
      <div className="bg-white rounded-t-2xl border-b border-gray-100 px-8 pt-2 flex gap-8 overflow-x-auto shadow-sm z-10 relative">
        <button onClick={() => setActiveTab('detail')} className={`py-4 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'detail' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>复盘详情</button>
        <button onClick={() => setActiveTab('quality')} className={`py-4 text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1 ${activeTab === 'quality' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>质量评分 <span className="bg-lark-100 text-lark-600 text-[10px] px-1.5 py-0.5 rounded-full font-normal">AI</span></button>
        <button onClick={() => setActiveTab('value')} className={`py-4 text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1 ${activeTab === 'value' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>复盘价值</button>
      </div>

      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 border-t-0 p-8 min-h-[600px]">
        
        {/* --- TAB 1: DETAIL --- */}
        {activeTab === 'detail' && (
          <div className="space-y-8 animate-fadeIn">
             {/* Header Card */}
             <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full opacity-10 ${review.result === 'won' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                   <div>
                      <div className="flex items-center gap-3 mb-3">
                         {review.result === 'won' ? (
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded border border-green-200">
                              <Trophy size={14} /> 赢单复盘
                            </span>
                         ) : (
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded border border-gray-200">
                              <XCircle size={14} /> 输单复盘
                            </span>
                         )}
                         <span className="text-gray-400 text-sm">|</span>
                         <span className="text-gray-500 text-sm flex items-center gap-1"><Briefcase size={14}/> {review.industry}</span>
                         <span className="text-gray-400 text-sm">|</span>
                         <span className="text-gray-500 text-sm flex items-center gap-1"><Calendar size={14}/> {review.date}</span>
                      </div>
                      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{review.projectName}</h1>
                      <p className="text-gray-600 max-w-3xl leading-relaxed text-sm"><span className="font-bold text-gray-800">核心复盘结论：</span>{review.reason}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                         {review.tags.map(t => <span key={t} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200">{t}</span>)}
                      </div>
                   </div>
                   <div className="flex flex-col items-center gap-2 bg-gray-50 p-5 rounded-xl border border-gray-100 min-w-[120px]">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">合同金额</span>
                      <span className="text-2xl font-extrabold text-lark-600">{review.amount}</span>
                      <div className="w-full h-px bg-gray-200 my-1"></div>
                      <span className="text-xs text-gray-500">Owner: {review.owner}</span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Comparison Chart */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <Scale size={18} className="text-lark-500" /> 竞对优劣势分析 ({review.competitor})
                   </h3>
                   <div className="h-72 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={review.comparisonData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" tick={{fontSize: 12}} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="飞书" dataKey="us" stroke="#3370ff" fill="#3370ff" fillOpacity={0.5} />
                          <Radar name={review.competitor} dataKey="them" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.3} />
                          <Legend />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <Activity size={18} className="text-blue-500" /> 项目关键里程碑
                   </h3>
                   <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                      {review.timeline.map((item, idx) => (
                         <div key={idx} className="relative">
                            <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${item.status === 'normal' ? 'bg-blue-400' : item.status === 'risk' ? 'bg-orange-400' : 'bg-red-500'}`}></div>
                            <div className="flex items-center justify-between mb-1">
                               <span className="text-sm font-bold text-gray-800">{item.event}</span>
                               <span className="text-xs text-gray-400 font-mono">{item.date}</span>
                            </div>
                            {item.status !== 'normal' && (
                               <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.status === 'risk' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                                  {item.status === 'risk' ? '风险点' : '关键转折'}
                               </span>
                            )}
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Decision Chain */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <Users size={18} className="text-orange-500" /> 决策链分析
                   </h3>
                   <div className="space-y-4">
                      {review.decisionChain.map((person, idx) => (
                         <div key={idx} className="flex items-start gap-4 p-3 rounded-lg border border-gray-50 bg-gray-50/50 hover:bg-white hover:shadow-sm transition">
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${person.attitude === 'support' ? 'bg-green-500' : person.attitude === 'neutral' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-gray-900 text-sm">{person.title}</span>
                                  <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-200 rounded">{person.role}</span>
                               </div>
                               <p className="text-xs text-gray-600">关注点: {person.concern}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Lessons Learned */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <Lightbulb size={18} className="text-yellow-500" /> 经验与教训 (Keep & Change)
                   </h3>
                   <div className="space-y-3">
                      {review.lessons.map((lesson, idx) => (
                         <div key={idx} className={`flex gap-3 p-3 rounded-lg ${lesson.type === 'good' ? 'bg-green-50/50 border border-green-50' : 'bg-red-50/50 border border-red-50'}`}>
                            {lesson.type === 'good' ? <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" /> : <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />}
                            <p className="text-sm text-gray-700 leading-relaxed">{lesson.content}</p>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB 2: QUALITY (EVALUATION) --- */}
        {activeTab === 'quality' && (
          <div className="space-y-8 animate-fadeIn">
             {/* Score Header */}
             <div className="bg-gradient-to-r from-purple-50 to-white p-8 rounded-2xl border border-purple-100 flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2"><Sparkles className="text-purple-500" /> 复盘质量综合评分</h3>
                   <p className="text-gray-500 text-sm">基于AI对复盘深度、客观性及逻辑闭环的智能评估</p>
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
                      <h4 className="font-bold text-gray-800 mb-6">同事评价 ({userReviews.length})</h4>
                      
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
                              placeholder="这个复盘对你有启发吗？" 
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
                   <h3 className="text-xl font-bold text-gray-900">复盘知识价值看板</h3>
                   <p className="text-sm text-gray-500 mt-1">评估该复盘文档作为组织知识资产的流动性与贡献度</p>
                </div>
                <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">数据更新于: {new Date().toLocaleDateString()}</div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[valueMetrics.read, valueMetrics.train, valueMetrics.sop, valueMetrics.win].map((m, i) => (
                   <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm font-medium">
                         {i === 0 && <BookOpen size={18} className="text-blue-500"/>}
                         {i === 1 && <Presentation size={18} className="text-yellow-500"/>}
                         {i === 2 && <GitMerge size={18} className="text-purple-500"/>}
                         {i === 3 && <Target size={18} className="text-green-500"/>}
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
                   <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><BookOpen size={18} className="text-lark-500"/> 阅读热度趋势 (近5个月)</h4>
                   <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={valueMetrics.read.history}>
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
                   <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Presentation size={18} className="text-orange-500"/> 引用场景分布</h4>
                   <div className="flex items-center justify-center h-64">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie data={[{name: '新人培训', value: 40}, {name: '打单参考', value: 35}, {name: 'SOP改进', value: 15}, {name: '外部宣讲', value: 10}]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                               {[ '#3b82f6', '#f97316', '#a855f7', '#22c55e'].map((col, idx) => <Cell key={idx} fill={col} />)}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                         </PieChart>
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

export default ReviewDetail;