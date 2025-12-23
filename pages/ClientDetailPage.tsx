import React, { useState } from 'react';
import { ArrowLeft, Building2, MapPin, Users, DollarSign, Target, Zap, FileText, Layout, Activity, ChevronRight, Globe, Briefcase, Calendar, CreditCard, UserPlus, Clock, Phone, Mail, ShieldCheck, TrendingUp, Network, Swords, Newspaper, Brain, X, ExternalLink, BarChart3, GraduationCap, Award, MessageSquare, Lightbulb, Map, Factory, ShoppingBag, FolderOpen, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ComposedChart, Area } from 'recharts';

interface ClientDetailPageProps {
  clientId: string;
  onBack: () => void;
  onDrillDown?: (clientId: string) => void;
}

// --- Types ---
interface Contact {
  name: string;
  title: string;
  role: string;
  attitude: 'Support' | 'Neutral' | 'Oppose';
  phone?: string;
  email?: string;
  notes: string;
}

interface Opportunity {
  id: string;
  title: string;
  probability: 'High' | 'Med' | 'Low';
  value: string;
  stage: string;
  createDate: string;
}

interface ActionItem {
  id: string;
  date: string;
  type: 'visit' | 'call' | 'meeting' | 'email';
  content: string;
  owner: string;
  status: 'pending' | 'completed';
}

interface PaymentRecord {
  id: string;
  date: string;
  amount: string;
  product: string;
  status: 'Paid' | 'Pending';
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

// Updated Types for Enhanced Public Info
interface FinancialData {
  summary: string; // General summary
  annualAnalysis: string; // AI Text for Yearly view
  quarterlyAnalysis: string; // AI Text for Quarterly view
  revenue: string;
  profit: string;
  growth: string;
  trendData: { year: string; revenue: number; profit: number }[];
  quarterlyData: { quarter: string; revenue: number; profit: number; growth: string }[];
}

interface Executive {
  name: string;
  title: string;
  tag: string;
  desc: string;
  avatar?: string;
  basicInfo?: { age?: string; education?: string; hometown?: string; tenure?: string; };
  coreInsights?: { style: string; focus: string; suggestion: string; };
  careerPath?: { period: string; company: string; role: string; achievement: string; }[];
  keyProjects?: { name: string; desc: string; analysis: string; }[];
  recentEvents?: { date: string; event: string; content: string; }[];
  larkStrategy?: { phase: string; focus: string; pitch: string; }[];
}

interface DigitalNews {
  date: string;
  title: string;
  source: string;
  summary: string;
  url?: string;
}

// Updated to support linking to Battle Map IDs
interface RelatedCompany {
  name: string;
  id?: string; // If present, it's a Battle Map client
  relation?: string; // e.g. "Core Supplier"
}

interface SupplyChainNode {
  category: string; 
  companies: RelatedCompany[];
}

interface Competitor {
  name: string;
  id?: string; // If present, it's a Battle Map client
  marketShare: string;
  strength: string;
  weakness: string;
}

interface CompetitorAnalysis {
  competitors: Competitor[];
  strategy: string;
}

interface RichClientData {
  id: string;
  name: string;
  logoUrl?: string; 
  industry: string;
  subIndustry?: string;
  region: string;
  address?: string;
  owner: string;
  employees: number;
  revenue: string;
  website: string;
  founded: string;
  stockCode: string;
  intro: string;
  tags: string[];
  
  // Battle Map Specific Fields (for Card Rendering)
  segment?: 'SA' | 'KA' | 'Mid' | 'LongTail';
  strategy?: 'Gold' | 'Silver' | 'Avoid';
  adoptionStatus?: 'Full' | 'Partial' | 'None';

  financials?: FinancialData;
  executives?: Executive[];
  
  newsAnalysis?: string; // New: AI Summary of news
  digitalNews?: DigitalNews[];
  
  supplyChain?: SupplyChainNode[];
  competitorAnalysis?: CompetitorAnalysis;

  // Sales Info
  adoptionDetails: { product: string; status: 'full' | 'partial' | 'none'; coverage: string }[];
  opportunities: Opportunity[];
  contacts: Contact[];
  activities: ActionItem[]; 
  payments: PaymentRecord[];
  team: TeamMember[];
}

// --- DETAILED MOCK DATABASE ---
const CLIENT_DATABASE: Record<string, RichClientData> = {
  'm-auto-1': {
    id: 'm-auto-1',
    name: '未来汽车',
    industry: '大制造',
    subIndustry: '新能源汽车',
    region: '上海',
    address: '上海市嘉定区安亭镇新能源汽车产业园88号',
    owner: '张三',
    employees: 15000,
    revenue: '356.8亿',
    website: 'www.futureauto.com',
    founded: '2015-05-12',
    stockCode: 'NYSE: AUTO',
    intro: '未来汽车集团是全球领先的新能源智能汽车制造商。作为造车新势力代表，公司业务覆盖整车研发、智能驾驶、互联网服务等。致力于通过软件定义汽车，重塑未来出行体验。',
    tags: ['新能源', '整车', '出海', '高新技术企业'],
    segment: 'SA',
    strategy: 'Gold',
    adoptionStatus: 'Full',
    
    financials: {
      summary: '营收保持高速增长，亏损幅度逐年收窄。',
      revenue: '356.8亿',
      profit: '-45.2亿',
      growth: '+38.5%',
      annualAnalysis: '【年度分析】近三年营收复合增长率超过40%，主要得益于两款主力车型（F5/F7）的量产交付。虽然净利润仍亏损，但毛利率已由负转正并提升至15%，随着规模效应释放，预计2026年实现盈利。研发投入占比保持在20%以上，持续构建技术护城河。',
      quarterlyAnalysis: '【季度分析】24Q4营收环比微增，主要受年底促销拉动。但利润端亏损略有扩大，源于新车型（F9）的营销费用前置投入。需关注Q1淡季的交付数据及现金流状况。',
      trendData: [
        { year: '2022', revenue: 180, profit: -80 },
        { year: '2023', revenue: 260, profit: -60 },
        { year: '2024', revenue: 356, profit: -45 },
      ],
      quarterlyData: [
        { quarter: '24 Q1', revenue: 75, profit: -15, growth: '+20%' },
        { quarter: '24 Q2', revenue: 88, profit: -12, growth: '+25%' },
        { quarter: '24 Q3', revenue: 95, profit: -10, growth: '+30%' },
        { quarter: '24 Q4', revenue: 98, profit: -14, growth: '+15%' }, // Profit drop simulated
      ]
    },
    newsAnalysis: '【AI 舆情洞察】近期未来汽车舆情整体偏正面，关注焦点集中在“智能化技术突破”与“全球化布局”。新发布的车载OS系统获得科技圈好评，但部分车主对售后服务响应速度有微词。资本市场对其与云厂商的战略合作反应积极。',
    digitalNews: [
      { date: '2025-11-15', title: '未来汽车发布全新车载OS，强调软件定义汽车', source: '36Kr', summary: '发布会上CEO强调了研发效率的重要性，并表示已全面采用敏捷开发模式。', url: 'https://36kr.com' },
      { date: '2025-10-01', title: '未来汽车与某云厂商达成战略合作', source: 'IT之家', summary: '双方将在自动驾驶算力、数字化工厂等领域展开深入合作。', url: 'https://ithome.com' },
      { date: '2025-09-20', title: '未来汽车欧洲首家直营店开业', source: 'Bloomberg', summary: '标志着其全球化战略迈出重要一步，首月试驾预约爆满。', url: '#' },
      { date: '2025-09-05', title: '车主吐槽：维修等待时间过长', source: '微博', summary: '部分地区车主反映零部件缺货导致维修周期长达2周。', url: '#' },
      { date: '2025-08-30', title: '未来汽车获颁L3级自动驾驶测试牌照', source: '新华网', summary: '将在上海指定区域开展高阶自动驾驶道路测试。', url: '#' }
    ],
    supplyChain: [
      { category: '上游 (核心部件)', companies: [{name: '宁德时代', id: 'm-auto-3', relation: '电池独供'}, {name: '英伟达', relation: '芯片'}, {name: '博世', relation: '制动系统'}] },
      { category: '中游 (整车制造)', companies: [{name: '未来汽车', id: 'm-auto-1', relation: '自建工厂'}] },
      { category: '下游 (销售/服务)', companies: [{name: '未来销售公司', relation: '直营'}, {name: '广汇汽车', relation: '交付中心'}] }
    ],
    competitorAnalysis: {
      competitors: [
        { name: '特斯拉', marketShare: '20%', strength: '品牌、FSD、成本', weakness: '内饰、服务', id: 'tesla-mock' }, // Not in battle map
        { name: '理想汽车', marketShare: '15%', strength: '产品定义、家庭定位', weakness: '纯电技术', id: 'm-auto-6' }, // In battle map
        { name: '小鹏汽车', marketShare: '8%', strength: '智驾技术', weakness: '营销能力', id: 'm-auto-8' }, // In battle map
      ],
      strategy: '防守策略：坚持高端纯电定位，强化“换电”补能体验护城河；加大自研芯片投入，降低对上游依赖。'
    },
    executives: [
      { 
        name: 'William Li', 
        title: '创始人 & CEO', 
        tag: '决策者', 
        desc: '连续创业者，关注用户体验与社区运营。',
        basicInfo: { age: '48岁', education: '北京大学 社会学', hometown: '安徽', tenure: '10年 (创始人)' },
        coreInsights: {
          style: '愿景驱动型，极度重视用户体验与品牌调性，敢于在服务体系上重投入。',
          focus: '当前核心关注全球化布局、子品牌下沉市场表现以及研发效率提升。',
          suggestion: '避免谈论单纯的工具功能，多谈“组织进化”、“全球协同”和“用户企业”的文化共鸣。'
        },
        careerPath: [
          { period: '2014 - 至今', company: '未来汽车', role: '创始人 & CEO', achievement: '带领公司美股上市，打造了高端纯电品牌形象。' },
          { period: '2000 - 2013', company: '易车网', role: '创始人 & 董事长', achievement: '中国最大的汽车互联网企业之一。' }
        ],
        keyProjects: [
          { name: 'NIO Day 社区运营', desc: '亲自策划每年一度的 Nio Day，构建了极高的用户粘性。', analysis: '体现了其“用户企业”的核心战略思想，飞书的社区运营方法论可以与其产生共鸣。' },
          { name: 'BaaS 电池租用服务', desc: '创新的商业模式，降低购车门槛。', analysis: '显示其敢于打破常规商业模式的魄力。' }
        ],
        recentEvents: [
          { date: '2025-11-20', event: 'Q3 财报电话会', content: '强调了研发投入不会减少，但要提升人效，提到内部正在进行组织架构调整。' },
          { date: '2025-10-15', event: '合作伙伴大会', content: '呼吁供应链伙伴共同出海，建立全球化研发体系。' }
        ],
        larkStrategy: [
          { phase: '接触期', focus: '文化与愿景', pitch: '“李总，飞书不仅仅是工具，更是支撑字节跳动全球化组织的数字底座，这与未来汽车的全球化愿景不谋而合。”' },
          { phase: '方案期', focus: '研发效能与敏捷', pitch: '“通过飞书项目（Meego），我们可以把软件定义的理念延伸到组织定义，实现万人研发团队的敏捷协同。”' },
          { phase: '决策期', focus: 'ROI与组织活力', pitch: '“飞书能带来的不仅是效率提升，更是像‘Context not Control’这样的创新文化土壤。”' }
        ]
      },
      { 
        name: 'Robin', 
        title: 'CIO', 
        tag: '关键人', 
        desc: '负责集团数字化转型，飞书项目的推行者。',
        basicInfo: { age: '42岁', education: '清华大学 计算机', hometown: '江苏', tenure: '4年' },
        coreInsights: {
          style: '技术务实派，关注系统的集成性、安全性和二次开发能力。',
          focus: '打通研发-制造-营销的数据孤岛，降低IT运维成本。',
          suggestion: '多展示开放平台API能力，以及私有化/混合部署的灵活性。'
        },
        careerPath: [
          { period: '2021 - 至今', company: '未来汽车', role: 'CIO', achievement: '主导了集团数字化底座重构。' },
          { period: '2015 - 2021', company: '某互联网大厂', role: '技术VP', achievement: '负责云平台架构。' }
        ],
        keyProjects: [
          { name: '云端一体化平台', desc: '打通车端数据与云端研发平台。', analysis: '看重数据的高频流动能力。' }
        ],
        recentEvents: [
          { date: '2025-11-05', event: '数字化转型峰会', content: '分享了关于“软件定义汽车背景下的IT架构演进”的主题演讲。' }
        ],
        larkStrategy: [
          { phase: '接触期', focus: '集成能力', pitch: '“飞书AnyCross可以无缝连接Jira、GitLab和SAP，保护既有IT投资。”' },
          { phase: '方案期', focus: '安全合规', pitch: '“我们提供金融级的安全合规方案，支持水印、审计等细粒度管控，满足车企出海合规要求。”' }
        ]
      }
    ],
    adoptionDetails: [
      { product: '飞书IM', status: 'full', coverage: '100%' },
      { product: '飞书文档', status: 'full', coverage: '95%' },
      { product: '飞书项目', status: 'partial', coverage: '40% (研发中心)' },
      { product: '多维表格', status: 'partial', coverage: '20% (供应链)' }
    ],
    opportunities: [
      { id: 'op1', title: 'IPD 研发全流程管理项目', probability: 'High', value: '500万', stage: 'POC验证', createDate: '2025-10-01' },
      { id: 'op2', title: '供应链 SRM 系统一期', probability: 'Med', value: '200万', stage: '需求调研', createDate: '2025-11-15' },
    ],
    contacts: [
      { name: '李总', title: 'CTO', role: '决策者', attitude: 'Support', notes: '认可飞书研发效能理念，推崇敏捷开发', phone: '139****1234', email: 'li@future.com' },
      { name: '王总', title: 'CIO', role: '决策者', attitude: 'Neutral', notes: '关注数据安全与私有化部署成本', phone: '138****5678', email: 'wang@future.com' },
    ],
    activities: [
      { id: 'a1', date: '2025-12-20', type: 'meeting', content: 'IPD 方案高层汇报，CTO出席', owner: '张三', status: 'pending' },
      { id: 'a2', date: '2025-12-10', type: 'visit', content: '拜访研发效能部，演示Meego Demo', owner: '张三', status: 'completed' }
    ],
    payments: [
      { id: 'p1', date: '2024-12-01', amount: '¥1,200,000', product: '飞书商业版 (5000人)', status: 'Paid' }
    ],
    team: [
      { name: '张三', role: '客户经理 (AM)', avatar: '张' },
      { name: '李四', role: '解决方案架构师', avatar: '李' }
    ]
  },
  
  // 2. 比亚迪
  'm-auto-2': {
    id: 'm-auto-2',
    name: '比亚迪',
    industry: '大制造',
    subIndustry: '汽车产业链',
    region: '深圳',
    address: '深圳市坪山区比亚迪路3009号',
    owner: '王力',
    employees: 570000,
    revenue: '6023亿',
    website: 'www.byd.com',
    founded: '1995-02-10',
    stockCode: 'SZ: 002594',
    intro: '比亚迪是一家致力于“用技术创新，满足人们对美好生活的向往”的高新技术企业。',
    tags: ['电池', '整车', '垂直整合', '龙头企业'],
    segment: 'SA',
    strategy: 'Gold',
    adoptionStatus: 'Full',
    
    financials: {
      summary: '营收保持高速增长，规模效应显现。',
      annualAnalysis: '【年度分析】全产业链垂直整合带来的成本优势在价格战中表现得淋漓尽致，毛利率逆势提升。',
      quarterlyAnalysis: '【季度分析】季度交付量创新高，出口业务占比提升，汇兑收益增加。',
      revenue: '6023亿',
      profit: '300亿',
      growth: '+42%',
      trendData: [{year:'2022',revenue:4240,profit:166},{year:'2023',revenue:6023,profit:300},{year:'2024',revenue:7500,profit:380}],
      quarterlyData: [
        { quarter: '24 Q1', revenue: 1500, profit: 60, growth: '+20%' },
        { quarter: '24 Q2', revenue: 1800, profit: 80, growth: '+25%' },
        { quarter: '24 Q3', revenue: 2100, profit: 100, growth: '+30%' },
        { quarter: '24 Q4', revenue: 2100, profit: 140, growth: '+35%' },
      ]
    },
    executives: [
      { 
        name: '王传福', 
        title: '董事长 & 总裁', 
        tag: '核心', 
        desc: '技术狂人，拥有绝对决策权，注重垂直整合。',
        basicInfo: { age: '58岁', education: '中南大学 冶金物理化学', hometown: '安徽', tenure: '30年 (创始人)' },
        coreInsights: { style: '工程思维，极度关注技术细节和成本控制，推崇“袋鼠理论”。', focus: '智能化下半场，以及海外工厂建设。', suggestion: '强调飞书在大型制造业的降本增效案例，特别是如何通过工具提升数十万人的协作效率。' },
        larkStrategy: [{ phase: '方案期', focus: '超大规模并发', pitch: '“飞书经过了字节跳动十几万人的验证，完全能支撑比亚迪的全球化协作。”' }]
      }
    ],
    newsAnalysis: '【AI 舆情洞察】近期比亚迪品牌势能持续提升，销量屡创新高。舆情关注点集中在“出海战略”和“高端化品牌（仰望/方程豹）”。',
    digitalNews: [], 
    supplyChain: [], 
    competitorAnalysis: { competitors: [], strategy: '' }, 
    adoptionDetails: [], opportunities: [], contacts: [], activities: [], payments: [], team: []
  },
  
  // 3. 超级零售 (c2)
  'c2': {
    id: 'c2',
    name: '超级零售连锁',
    industry: '大消费',
    subIndustry: '零售连锁',
    region: '北京',
    address: '北京市朝阳区商业中心A座',
    owner: '李雷',
    employees: 50000,
    revenue: '500亿',
    website: 'www.superretail.com',
    founded: '2000-08-08',
    stockCode: 'HK: 09988',
    intro: '国内知名的新零售连锁企业，拥有超过 5000 家线下门店。致力于通过数字化手段重构人、货、场，提升单店坪效和运营效率。',
    tags: ['连锁', '商超', '数字化', 'O2O'],
    segment: 'KA',
    strategy: 'Gold',
    adoptionStatus: 'Partial',
    
    financials: {
      summary: '在零售行业整体承压背景下，通过数字化转型实现逆势增长，同店销售额增长5%。',
      annualAnalysis: '【年度分析】数字化门店巡检系统的上线显著提升了运营效率，降低了管理成本。',
      quarterlyAnalysis: '【季度分析】Q4 旺季促销效果显著，线上到家业务占比提升至 30%。',
      revenue: '520亿',
      profit: '15亿',
      growth: '+8%',
      trendData: [{year:'2022', revenue:420, profit:8},{year:'2023', revenue:480, profit:12},{year:'2024', revenue:520, profit:15}],
      quarterlyData: [
        { quarter: '24 Q1', revenue: 110, profit: 3, growth: '+5%' },
        { quarter: '24 Q2', revenue: 120, profit: 3.5, growth: '+6%' },
        { quarter: '24 Q3', revenue: 130, profit: 4, growth: '+8%' },
        { quarter: '24 Q4', revenue: 160, profit: 4.5, growth: '+12%' },
      ]
    },
    executives: [
      { name: '张总', title: 'CEO', tag: '决策者', desc: '强调回归零售本质，重视单店盈利模型。', basicInfo: {age:'52岁', education:'EMBA'}, coreInsights: {style:'务实', focus:'单店模型', suggestion:'强调一线赋能'}, larkStrategy: [{phase:'接触期', focus:'一线提效', pitch:'让店长多卖货'}] }
    ],
    newsAnalysis: '【AI 舆情洞察】舆情正面，数字化转型案例被行业媒体多次报道。',
    digitalNews: [],
    supplyChain: [{category:'供应链', companies:[{name:'采购中心'}, {name:'区域仓'}, {name:'门店'}]}],
    competitorAnalysis: {competitors: [{name:'沃尔玛', marketShare:'-', strength:'供应链', weakness:'本土化'}], strategy:'深耕社区'},
    adoptionDetails: [{ product: '多维表格', status: 'full', coverage: '100% (巡检)' }, { product: '飞书任务', status: 'full', coverage: '100%' }],
    opportunities: [{ id: 'op1', title: 'AI 智能导购助手', probability: 'High', value: '350万', stage: '签约流程', createDate: '2025-11-01' }],
    contacts: [{ name: '钱总', title: '运营VP', role: '决策者', attitude: 'Support', notes: '对一线赋能效果非常满意' }],
    activities: [{ id: 'a1', date: '2025-12-18', type: 'meeting', content: 'AI 导购项目启动会', owner: '李雷', status: 'pending' }],
    payments: [{ id: 'p1', date: '2025-01-10', amount: '¥2,500,000', product: '多维表格增购', status: 'Paid' }],
    team: [{ name: '李雷', role: '客户经理', avatar: '李' }]
  }
};

// --- CLIENT REGISTRY (Enriched with Battle Map Tags) ---
const CLIENT_META_LOOKUP: Record<string, Partial<RichClientData>> = {
  // Auto
  'm-auto-3': { name: '宁德时代', industry: '大制造', subIndustry: '汽车产业链', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 80000, revenue: '3200亿' },
  'm-auto-4': { name: '吉利控股', industry: '大制造', subIndustry: '汽车产业链', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 120000, revenue: '3600亿' },
  'm-auto-6': { name: '理想汽车', industry: '大制造', subIndustry: '汽车产业链', segment: 'KA', strategy: 'Gold', adoptionStatus: 'Full', employees: 15000, revenue: '450亿' },
  'm-auto-8': { name: '小鹏汽车', industry: '大制造', subIndustry: '汽车产业链', segment: 'KA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 13000, revenue: '260亿' },
  // ... (Other lookups would go here)
};

// --- GENERATOR ---
const generateRichDataFromMeta = (id: string, meta: any): RichClientData => {
  const isManufacturing = meta.industry === '大制造';
  const baseRev = parseInt(meta.revenue?.replace(/[^0-9]/g, '') || '100') * (meta.revenue?.includes('万') ? 10000 : 1);

  return {
    id,
    name: meta.name || '未知客户',
    industry: meta.industry || '通用行业',
    subIndustry: meta.subIndustry,
    region: meta.region || '未知',
    address: '未知地址',
    owner: meta.owner || '销售经理',
    employees: meta.employees || 1000,
    revenue: meta.revenue || '未知',
    website: 'www.example.com',
    founded: '2000',
    stockCode: '-',
    intro: meta.intro || `${meta.name} 是该行业的领军企业。`,
    tags: meta.tags || [],
    segment: meta.segment,
    strategy: meta.strategy,
    adoptionStatus: meta.adoptionStatus,

    financials: {
      summary: '财务状况稳健。',
      annualAnalysis: '【年度分析】营收保持稳定增长，成本控制良好。',
      quarterlyAnalysis: '【季度分析】近期季度波动在正常范围内，主要受季节性因素影响。',
      revenue: meta.revenue || '0',
      profit: '未知',
      growth: '+10%',
      trendData: [
        { year: '2022', revenue: baseRev * 0.8, profit: baseRev * 0.08 },
        { year: '2023', revenue: baseRev * 0.9, profit: baseRev * 0.09 },
        { year: '2024', revenue: baseRev, profit: baseRev * 0.1 },
      ],
      quarterlyData: [
        { quarter: '24 Q1', revenue: baseRev * 0.22, profit: baseRev * 0.02, growth: '+5%' },
        { quarter: '24 Q2', revenue: baseRev * 0.24, profit: baseRev * 0.03, growth: '+8%' },
        { quarter: '24 Q3', revenue: baseRev * 0.26, profit: baseRev * 0.04, growth: '+10%' },
        { quarter: '24 Q4', revenue: baseRev * 0.28, profit: baseRev * 0.05, growth: '+12%' },
      ]
    },
    newsAnalysis: `【AI 舆情洞察】近期关于 ${meta.name} 的公开报道较少，整体舆情平稳。主要集中在行业展会活动及新产品发布预热。`,
    digitalNews: [
      { date: '2025-12-01', title: `${meta.name} 参加年度行业峰会`, source: '行业网', summary: '展示了最新技术成果。', url: '#' },
      { date: '2025-11-20', title: '数字化转型项目启动', source: '公司官网', summary: '旨在提升运营效率。', url: '#' }
    ],
    supplyChain: [{category: '上下游', companies: [{name: '核心供应商'}]}],
    competitorAnalysis: { competitors: [{name: '行业竞对A', marketShare: '10%', strength: '-', weakness: '-'}], strategy: '稳健发展。' },
    
    // ... Sales data defaults
    adoptionDetails: [], opportunities: [], contacts: [], activities: [], payments: [], team: [], executives: []
  };
};

const generateGenericData = (id: string): RichClientData => {
  return generateRichDataFromMeta(id, { name: '未知客户', industry: '其他' });
};

// --- HELPER COMPONENT: BATTLE MAP CARD ---
const BattleMapCard: React.FC<{ name: string; id?: string; onClick?: () => void; subText?: string }> = ({ name, id, onClick, subText }) => {
  // Try to find meta info from DB or Lookup
  const meta = CLIENT_DATABASE[id || ''] || CLIENT_META_LOOKUP[id || ''];
  const isBattleMapClient = !!meta;

  const renderStrategyBadge = (strategy?: string) => {
    if (strategy === 'Gold') return <span className="flex items-center gap-1 px-1.5 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded border border-yellow-200"><Target size={10} className="fill-yellow-600"/> 黄金</span>;
    if (strategy === 'Silver') return <span className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 text-slate-600 text-[10px] font-medium rounded border border-slate-200"><ShieldCheck size={10}/> 中优</span>;
    if (strategy === 'Avoid') return <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-medium rounded border border-red-100"><AlertTriangle size={10}/> 避坑</span>;
    return null;
  };

  const renderAdoption = (status?: string) => {
    if (status === 'Full') return <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100"><Zap size={10} className="fill-green-500"/> 全员</span>;
    if (status === 'Partial') return <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100"><Zap size={10} className="fill-yellow-500"/> 部分</span>;
    return null;
  };

  return (
    <div 
      onClick={onClick}
      className={`p-3 rounded-lg border transition relative group flex flex-col gap-2 ${isBattleMapClient ? 'bg-white border-lark-100 hover:border-lark-300 hover:shadow-md cursor-pointer' : 'bg-gray-50 border-gray-100 hover:bg-gray-100 cursor-pointer'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
           <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${isBattleMapClient ? 'bg-lark-100 text-lark-600' : 'bg-gray-200 text-gray-500'}`}>
              {name[0]}
           </div>
           <div>
              <div className={`text-sm font-bold truncate max-w-[120px] ${isBattleMapClient ? 'text-lark-900 group-hover:text-lark-600' : 'text-gray-700'}`}>{name}</div>
              {subText && <div className="text-[10px] text-gray-400">{subText}</div>}
           </div>
        </div>
        {isBattleMapClient && meta?.segment && (
           <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100">{meta.segment}</span>
        )}
      </div>
      
      {isBattleMapClient && (
        <div className="flex items-center gap-2 mt-1">
           {renderStrategyBadge(meta?.strategy)}
           {renderAdoption(meta?.adoptionStatus)}
        </div>
      )}
      
      {!isBattleMapClient && (
         <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
            <Globe size={10}/> 非作战地图客户
         </div>
      )}

      {isBattleMapClient && (
         <ChevronRight size={14} className="absolute right-2 bottom-2 text-lark-300 opacity-0 group-hover:opacity-100 transition-opacity"/>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS (Executive Modal, etc.) ---
// ... (Keeping DetailedExecutiveModal as is, implied reuse) ...
const DetailedExecutiveModal = ({ exec, onClose }: { exec: Executive; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'career' | 'projects' | 'news'>('strategy');

  if (!exec) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex overflow-hidden animate-scaleIn border border-gray-100" onClick={e => e.stopPropagation()}>
        
        {/* Left Sidebar: Profile & Insights */}
        <div className="w-80 bg-gray-50 border-r border-gray-100 flex flex-col overflow-y-auto">
           {/* Header */}
           <div className="p-6 text-center border-b border-gray-100 bg-white">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-3xl font-bold text-blue-600 mb-4 mx-auto shadow-sm border-4 border-white">
                 {exec.avatar || exec.name[0]}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{exec.name}</h2>
              <div className="text-sm text-gray-500 mb-3">{exec.title}</div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">{exec.tag}</span>
           </div>

           {/* Basic Info */}
           <div className="p-6 border-b border-gray-100 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"><UserPlus size={14}/> 基础信息</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                 <div><div className="text-gray-400 text-xs">年龄</div><div className="font-medium">{exec.basicInfo?.age || '未知'}</div></div>
                 <div><div className="text-gray-400 text-xs">司龄</div><div className="font-medium">{exec.basicInfo?.tenure || '未知'}</div></div>
                 <div className="col-span-2"><div className="text-gray-400 text-xs">教育背景</div><div className="font-medium">{exec.basicInfo?.education || '未知'}</div></div>
                 <div className="col-span-2"><div className="text-gray-400 text-xs">籍贯</div><div className="font-medium">{exec.basicInfo?.hometown || '未知'}</div></div>
              </div>
           </div>

           {/* Core Insights Summary */}
           <div className="p-6 bg-indigo-50/50 flex-1">
              <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-2 mb-3"><Brain size={14}/> 核心洞察摘要</h3>
              <div className="space-y-4">
                 <div>
                    <div className="text-xs font-bold text-indigo-600 mb-1">决策风格</div>
                    <p className="text-xs text-gray-600 leading-relaxed">{exec.coreInsights?.style || '暂无数据'}</p>
                 </div>
                 <div>
                    <div className="text-xs font-bold text-indigo-600 mb-1">当前关注</div>
                    <p className="text-xs text-gray-600 leading-relaxed">{exec.coreInsights?.focus || '暂无数据'}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Content: Tabs & Details */}
        <div className="flex-1 flex flex-col bg-white">
           {/* Header / Tabs */}
           <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex gap-6">
                 <button onClick={() => setActiveTab('strategy')} className={`pb-2 text-sm font-bold border-b-2 transition ${activeTab === 'strategy' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>飞书攻略方法论</button>
                 <button onClick={() => setActiveTab('career')} className={`pb-2 text-sm font-bold border-b-2 transition ${activeTab === 'career' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>成长履历</button>
                 <button onClick={() => setActiveTab('projects')} className={`pb-2 text-sm font-bold border-b-2 transition ${activeTab === 'projects' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>关键项目</button>
                 <button onClick={() => setActiveTab('news')} className={`pb-2 text-sm font-bold border-b-2 transition ${activeTab === 'news' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>近期动态</button>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition"><X size={20}/></button>
           </div>

           {/* Scrollable Content */}
           <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              
              {/* Tab: Strategy */}
              {activeTab === 'strategy' && (
                 <div className="space-y-6 animate-fadeIn">
                    <div className="bg-lark-50 p-6 rounded-xl border border-lark-100">
                       <h3 className="font-bold text-lark-800 flex items-center gap-2 mb-4"><Lightbulb size={20} className="fill-lark-500 text-white"/> AI 攻略建议</h3>
                       <p className="text-sm text-lark-700 leading-relaxed font-medium">
                          {exec.coreInsights?.suggestion || '暂无建议'}
                       </p>
                    </div>
                    
                    <h4 className="font-bold text-gray-800 flex items-center gap-2 mt-8 mb-4"><Swords size={18} className="text-red-500"/> 分阶段攻坚策略</h4>
                    <div className="space-y-4">
                       {exec.larkStrategy?.map((strat, idx) => (
                          <div key={idx} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition group">
                             <div className="w-24 shrink-0 flex flex-col items-center justify-center border-r border-gray-100 pr-4">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phase {idx + 1}</div>
                                <div className="text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">{strat.phase}</div>
                             </div>
                             <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                   <Target size={14} className="text-red-500"/>
                                   <span className="text-sm font-bold text-gray-700">切入重点：{strat.focus}</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic border border-gray-100 relative">
                                   <MessageSquare size={14} className="absolute top-3 left-3 text-gray-300"/>
                                   <div className="pl-6">" {strat.pitch} "</div>
                                </div>
                             </div>
                          </div>
                       )) || <div className="text-gray-400 text-sm">暂无策略数据</div>}
                    </div>
                 </div>
              )}

              {/* Tab: Career */}
              {activeTab === 'career' && (
                 <div className="space-y-6 animate-fadeIn">
                    <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Briefcase size={18} className="text-blue-500"/> 职业发展路径</h4>
                    <div className="relative border-l-2 border-blue-100 ml-3 space-y-8 pl-8 py-2">
                       {exec.careerPath?.map((job, idx) => (
                          <div key={idx} className="relative group">
                             <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-blue-500 border-4 border-white shadow-sm group-hover:scale-110 transition"></div>
                             <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                                <h5 className="text-lg font-bold text-gray-900">{job.company}</h5>
                                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{job.role}</span>
                             </div>
                             <span className="text-xs text-gray-400 font-mono block mb-2">{job.period}</span>
                             <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">{job.achievement}</p>
                          </div>
                       )) || <div className="text-gray-400 text-sm">暂无履历数据</div>}
                    </div>
                 </div>
              )}

              {/* Tab: Projects */}
              {activeTab === 'projects' && (
                 <div className="space-y-6 animate-fadeIn">
                    <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Award size={18} className="text-orange-500"/> 主导关键项目</h4>
                    <div className="grid grid-cols-1 gap-4">
                       {exec.keyProjects?.map((proj, idx) => (
                          <div key={idx} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-orange-200 transition">
                             <h5 className="text-lg font-bold text-gray-800 mb-2">{proj.name}</h5>
                             <p className="text-sm text-gray-600 mb-4">{proj.desc}</p>
                             <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex gap-3 items-start">
                                <Brain size={16} className="text-orange-500 shrink-0 mt-0.5"/>
                                <div>
                                   <div className="text-xs font-bold text-orange-700 mb-1">能力与思想解析</div>
                                   <p className="text-xs text-orange-800 leading-relaxed">{proj.analysis}</p>
                                </div>
                             </div>
                          </div>
                       )) || <div className="text-gray-400 text-sm">暂无项目数据</div>}
                    </div>
                 </div>
              )}

              {/* Tab: News */}
              {activeTab === 'news' && (
                 <div className="space-y-6 animate-fadeIn">
                    <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Newspaper size={18} className="text-green-500"/> 近期公开动态</h4>
                    <div className="space-y-4">
                       {exec.recentEvents?.map((news, idx) => (
                          <div key={idx} className="flex gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg transition">
                             <div className="w-16 h-16 bg-gray-100 rounded-lg flex flex-col items-center justify-center shrink-0 text-gray-500">
                                <span className="text-xs font-bold">{news.date.split('-')[1]}月</span>
                                <span className="text-lg font-bold text-gray-800">{news.date.split('-')[2]}</span>
                             </div>
                             <div>
                                <h5 className="font-bold text-gray-900 mb-1">{news.event}</h5>
                                <p className="text-sm text-gray-600 leading-relaxed">{news.content}</p>
                             </div>
                          </div>
                       )) || <div className="text-gray-400 text-sm">暂无动态数据</div>}
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const ClientDetailPage: React.FC<ClientDetailPageProps> = ({ clientId, onBack, onDrillDown }) => {
  const client = CLIENT_DATABASE[clientId] 
    || (CLIENT_META_LOOKUP[clientId] ? generateRichDataFromMeta(clientId, CLIENT_META_LOOKUP[clientId]) : generateGenericData(clientId));
    
  const [activeTab, setActiveTab] = useState<'public' | 'sales'>('public');
  const [selectedExec, setSelectedExec] = useState<Executive | null>(null);
  
  // Financial View State
  const [financialPeriod, setFinancialPeriod] = useState<'annual' | 'quarterly'>('annual');

  // Adoption Chart Data (Mock calculation)
  const adoptionRate = client.adoptionDetails.length > 0 ? 65 : 0;

  // Handle drill down logic
  const handleCompanyClick = (companyId?: string, name?: string) => {
    if (companyId && onDrillDown) {
      onDrillDown(companyId);
    } else if (onDrillDown && name) {
      // Simulate generic page for non-linked companies
      onDrillDown(`gen-${Math.random().toString(36).substr(2, 9)}`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn pb-24 relative">
      {/* Top Navigation */}
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition group">
        <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 返回作战地图
      </button>

      {/* Header Section (Shared) */}
      <div className="bg-white rounded-t-2xl border-b border-gray-100 p-8 pb-0">
         <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-xl bg-white border border-gray-200 flex items-center justify-center p-2 shadow-sm shrink-0">
               {client.industry === '大制造' ? <Factory size={40} className="text-blue-500" /> : 
                client.industry === '大消费' ? <ShoppingBag size={40} className="text-orange-500" /> :
                client.industry === '金融' ? <Building2 size={40} className="text-red-500" /> :
                <FolderOpen size={40} className="text-purple-500" />}
            </div>
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-extrabold text-gray-900">{client.name}</h1>
                  {client.segment === 'SA' && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded border border-purple-200">SA 超大客户</span>}
                  {client.strategy === 'Gold' && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded border border-yellow-200">黄金客户</span>}
               </div>
               <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Layout size={14}/> {client.industry} {client.subIndustry ? `/ ${client.subIndustry}` : ''}</span>
                  <span className="flex items-center gap-1"><MapPin size={14}/> {client.region}</span>
                  <span className="flex items-center gap-1"><Users size={14}/> {client.employees.toLocaleString()} 人</span>
               </div>
            </div>
            <div className="flex flex-col items-end gap-2">
               <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">负责销售</div>
                  <div className="font-bold text-gray-800 flex items-center gap-2 justify-end">
                     {client.owner} <div className="w-6 h-6 rounded-full bg-lark-100 flex items-center justify-center text-xs text-lark-600 font-bold">{client.owner[0]}</div>
                  </div>
               </div>
            </div>
         </div>

         {/* Tabs Navigation */}
         <div className="flex gap-8 mt-8">
            <button 
              onClick={() => setActiveTab('public')}
              className={`pb-4 text-sm font-bold border-b-2 transition ${activeTab === 'public' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              客户概览 (脱敏)
            </button>
            <button 
              onClick={() => setActiveTab('sales')}
              className={`pb-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${activeTab === 'sales' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              销售全景 (打单)
              <ShieldCheck size={12} className={activeTab === 'sales' ? 'text-lark-500' : 'text-gray-400'} />
            </button>
         </div>
      </div>

      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 border-t-0 p-8 min-h-[500px]">
        
        {/* --- TAB 1: PUBLIC INFO (Desensitized) --- */}
        {activeTab === 'public' && (
          <div className="animate-fadeIn space-y-8">
             
             {/* AI Insight Badge */}
             <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100 flex items-start gap-3">
               <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600 shrink-0">
                 <Brain size={20} />
               </div>
               <div>
                 <h3 className="text-sm font-bold text-gray-800 mb-1">AI 客户洞察报告</h3>
                 <p className="text-xs text-gray-600 leading-relaxed">
                   以下信息由 AI 基于互联网公开数据（年报、新闻、官网）自动抓取并分析生成，旨在帮助销售快速了解客户经营状况与行业地位。数据更新于 {new Date().toLocaleDateString()}。
                 </p>
               </div>
             </div>

             {/* Row 1: Enterprise Overview & Executives (Side by Side) */}
             <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left: Enterprise Intro & Info (Span 2) */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                   {/* Intro */}
                   <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex-1">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FileText size={18} className="text-lark-500"/> 企业简介</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{client.intro}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {client.tags.map(t => <span key={t} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200">{t}</span>)}
                      </div>
                   </div>
                   
                   {/* Business Info Table */}
                   <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2"><Building2 size={16}/> 工商信息</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                         <div>
                            <span className="text-gray-400 block text-xs mb-1">成立时间</span>
                            <span className="font-medium text-gray-800">{client.founded}</span>
                         </div>
                         <div>
                            <span className="text-gray-400 block text-xs mb-1">营收规模</span>
                            <span className="font-medium text-gray-800">{client.revenue}</span>
                         </div>
                         <div>
                            <span className="text-gray-400 block text-xs mb-1">股票代码</span>
                            <span className="font-medium text-gray-800 font-mono">{client.stockCode}</span>
                         </div>
                         <div>
                            <span className="text-gray-400 block text-xs mb-1">官方网站</span>
                            <a href={`http://${client.website}`} target="_blank" rel="noreferrer" className="font-medium text-lark-600 hover:underline truncate block">{client.website}</a>
                         </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-200">
                         <span className="text-gray-400 text-xs mr-2">总部地址:</span>
                         <span className="font-medium text-gray-800 text-sm">{client.address || client.region}</span>
                      </div>
                   </div>
                </div>

                {/* Right: Executives (Span 1) */}
                {client.executives && (
                  <div className="xl:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
                     <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Users size={18} className="text-orange-500"/> 高管与组织架构</h3>
                     <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[400px]">
                        {client.executives.map((exec, idx) => (
                           <div 
                             key={idx} 
                             onClick={() => setSelectedExec(exec)}
                             className="flex gap-3 items-start p-3 rounded-lg border border-gray-50 bg-gray-50/50 hover:border-orange-200 hover:shadow-sm transition cursor-pointer group"
                           >
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0 group-hover:scale-105 transition">
                                 {exec.name[0]}
                              </div>
                              <div>
                                 <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition">{exec.name}</span>
                                    <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">{exec.tag}</span>
                                 </div>
                                 <div className="text-xs text-gray-500 font-medium mb-1">{exec.title}</div>
                                 <p className="text-xs text-gray-400 line-clamp-1">{exec.desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                )}
             </div>

             {/* Row 2: Financial Analysis (Dynamic Toggle) */}
             {client.financials && (
               <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="font-bold text-gray-800 flex items-center gap-2"><TrendingUp size={18} className="text-green-500"/> 经营财报分析</h3>
                     <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button 
                           onClick={() => setFinancialPeriod('annual')}
                           className={`px-3 py-1 text-xs font-medium rounded-md transition ${financialPeriod === 'annual' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                           近三年
                        </button>
                        <button 
                           onClick={() => setFinancialPeriod('quarterly')}
                           className={`px-3 py-1 text-xs font-medium rounded-md transition ${financialPeriod === 'quarterly' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                           近4个Q
                        </button>
                     </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-8">
                     {/* Left: Charts */}
                     <div className="flex-1 min-w-0">
                        <div className="h-64 w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart data={financialPeriod === 'annual' ? client.financials.trendData : client.financials.quarterlyData}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                 <XAxis dataKey={financialPeriod === 'annual' ? "year" : "quarter"} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                 <YAxis yAxisId="left" orientation="left" stroke="#9ca3af" fontSize={12} axisLine={false} tickLine={false} />
                                 <YAxis yAxisId="right" orientation="right" stroke="#22c55e" fontSize={12} axisLine={false} tickLine={false} />
                                 <Tooltip contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}} />
                                 <Legend />
                                 <Bar yAxisId="left" dataKey="revenue" name="营收 (亿)" fill="#e5e7eb" barSize={30} radius={[4, 4, 0, 0]} />
                                 <Line yAxisId="right" type="monotone" dataKey="profit" name="利润 (亿)" stroke="#22c55e" strokeWidth={3} dot={{r:4}} />
                              </ComposedChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                     {/* Right: AI Analysis (Dynamic) */}
                     <div className="w-full md:w-80 shrink-0 flex flex-col">
                        <div className="bg-green-50 p-5 rounded-xl border border-green-100 flex-1 flex flex-col">
                           <h4 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                              <Brain size={16} /> AI 归因分析 ({financialPeriod === 'annual' ? '年度' : '季度'})
                           </h4>
                           <p className="text-xs text-green-700 leading-relaxed text-justify flex-1">
                              {financialPeriod === 'annual' 
                                 ? (client.financials.annualAnalysis || client.financials.summary)
                                 : (client.financials.quarterlyAnalysis || '暂无季度详细分析数据。')}
                           </p>
                           <div className="mt-4 pt-4 border-t border-green-100/50">
                              <div className="flex justify-between items-center text-xs">
                                 <span className="text-green-600">最新营收</span>
                                 <span className="font-bold text-green-900">{client.financials.revenue}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs mt-1">
                                 <span className="text-green-600">同比增长</span>
                                 <span className="font-bold text-green-900">{client.financials.growth}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             )}

             {/* Row 3: Digital News (Enhanced AI Summary & List) */}
             {client.digitalNews && (
               <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Newspaper size={18} className="text-blue-500"/> 数字化动态 & 舆情</h3>
                  
                  {/* AI News Summary */}
                  {client.newsAnalysis && (
                     <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-6">
                        <div className="flex gap-2 items-start">
                           <Brain size={16} className="text-blue-500 mt-0.5 shrink-0"/>
                           <p className="text-xs text-blue-800 leading-relaxed text-justify">{client.newsAnalysis}</p>
                        </div>
                     </div>
                  )}

                  <div className="space-y-4">
                     {client.digitalNews.slice(0, 5).map((news, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-200 transition bg-white group cursor-pointer" onClick={() => window.open(news.url, '_blank')}>
                           <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                 <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{news.source}</span>
                                 <span className="text-xs text-gray-400">{news.date}</span>
                              </div>
                              <h4 className="font-bold text-gray-800 text-sm mb-2 group-hover:text-blue-600 transition leading-snug flex items-center gap-1">
                                 {news.title}
                                 <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                              </h4>
                              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{news.summary}</p>
                           </div>
                        </div>
                     ))}
                     {client.digitalNews.length === 0 && <div className="text-sm text-gray-400 py-4">暂无相关动态</div>}
                  </div>
               </div>
             )}

             {/* Row 4: Competitors (Battle Map Cards) */}
             {client.competitorAnalysis && (
               <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <div className="flex flex-col lg:flex-row gap-8">
                     <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Swords size={18} className="text-red-500"/> 核心竞对分析</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                           {client.competitorAnalysis.competitors.map((comp, idx) => (
                              <BattleMapCard 
                                 key={idx} 
                                 name={comp.name} 
                                 id={comp.id} 
                                 subText={`市占率: ${comp.marketShare}`}
                                 onClick={() => handleCompanyClick(comp.id, comp.name)}
                              />
                           ))}
                        </div>
                     </div>
                     <div className="w-full lg:w-80 bg-red-50 rounded-xl p-5 border border-red-100 shrink-0 flex flex-col">
                        <h4 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2"><ShieldCheck size={16} /> 竞争与防守策略</h4>
                        <p className="text-xs text-red-800 leading-relaxed text-justify flex-1">
                           {client.competitorAnalysis.strategy}
                        </p>
                     </div>
                  </div>
               </div>
             )}

             {/* Row 5: Supply Chain (Battle Map Cards) */}
             {client.supplyChain && (
               <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-8 flex items-center gap-2"><Network size={18} className="text-purple-500"/> 上下游产业链图谱 (支持下钻)</h3>
                  <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 relative">
                     {/* Connector Line (Desktop) */}
                     <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
                     
                     {client.supplyChain.map((node, index) => (
                        <React.Fragment key={index}>
                           <div className="flex-1 bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col items-center relative z-10 min-w-[200px]">
                              <span className={`text-xs font-bold text-white px-3 py-1 rounded-full mb-4 ${
                                 index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-purple-500' : 'bg-green-500'
                              }`}>
                                 {node.category}
                              </span>
                              <div className="w-full space-y-3">
                                 {node.companies.map((comp, idx) => (
                                    <BattleMapCard 
                                       key={idx} 
                                       name={comp.name} 
                                       id={comp.id} 
                                       subText={comp.relation}
                                       onClick={() => handleCompanyClick(comp.id, comp.name)}
                                    />
                                 ))}
                              </div>
                           </div>
                           {index < (client.supplyChain?.length || 0) - 1 && (
                              <div className="flex items-center justify-center md:hidden">
                                 <div className="h-8 w-0.5 bg-gray-300"></div>
                              </div>
                           )}
                        </React.Fragment>
                     ))}
                  </div>
               </div>
             )}
          </div>
        )}

        {/* --- TAB 2: SALES INFO (Internal) --- */}
        {activeTab === 'sales' && (
          <div className="animate-fadeIn space-y-8">
             {/* Key Metrics Cards */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                   <div className="text-xs text-orange-600 font-medium mb-1">商机总额 (Pipeline)</div>
                   <div className="text-2xl font-bold text-gray-900">
                      {client.opportunities.length > 0 
                        ? `¥${client.opportunities.reduce((acc, op) => acc + parseInt(op.value.replace(/[^0-9]/g, '')), 0)}万` 
                        : '¥0'}
                   </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                   <div className="text-xs text-blue-600 font-medium mb-1">进行中商机</div>
                   <div className="text-2xl font-bold text-gray-900">{client.opportunities.length} <span className="text-sm font-normal text-gray-500">个</span></div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                   <div className="text-xs text-green-600 font-medium mb-1">累计回款</div>
                   <div className="text-2xl font-bold text-gray-900">
                      {client.payments.length > 0 ? '¥' + (client.payments.length * 1.5).toFixed(1) + 'M' : '¥0'}
                   </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                   <div className="text-xs text-purple-600 font-medium mb-1">产品覆盖率</div>
                   <div className="text-2xl font-bold text-gray-900">{adoptionRate}%</div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Center Column: Opportunities & Activities */}
                <div className="lg:col-span-2 space-y-8">
                   {/* Opportunities */}
                   <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="font-bold text-gray-800 flex items-center gap-2"><Target size={18} className="text-red-500"/> 商机管理</h3>
                         <button className="text-xs text-lark-600 font-medium flex items-center gap-1"><UserPlus size={14}/> 新建商机</button>
                      </div>
                      <div className="space-y-3">
                         {client.opportunities.map(op => (
                            <div key={op.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition flex items-center justify-between group">
                               <div>
                                  <div className="flex items-center gap-2 mb-1">
                                     <span className="font-bold text-gray-800">{op.title}</span>
                                     <span className={`text-[10px] px-1.5 py-0.5 rounded ${op.probability === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{op.probability} Win</span>
                                  </div>
                                  <div className="text-xs text-gray-500 flex gap-3">
                                     <span>阶段: {op.stage}</span>
                                     <span>创建: {op.createDate}</span>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <div className="font-bold text-lark-600">{op.value}</div>
                                  <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition cursor-pointer">查看详情 &gt;</div>
                               </div>
                            </div>
                         ))}
                         {client.opportunities.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">暂无活跃商机</div>}
                      </div>
                   </div>

                   {/* Activity Timeline */}
                   <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                         <h3 className="font-bold text-gray-800 flex items-center gap-2"><Activity size={18} className="text-blue-500"/> 跟进记录</h3>
                         <button className="text-xs text-lark-600 font-medium flex items-center gap-1"><Clock size={14}/> 写跟进</button>
                      </div>
                      <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                         {client.activities.map(act => (
                            <div key={act.id} className="relative">
                               <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${act.status === 'completed' ? 'bg-gray-400' : 'bg-blue-500'}`}></div>
                               <div className="flex justify-between items-start mb-1">
                                  <div className="flex items-center gap-2">
                                     <span className="text-sm font-bold text-gray-800">{act.content}</span>
                                     <span className={`text-[10px] px-1.5 rounded ${
                                        act.type === 'meeting' ? 'bg-purple-50 text-purple-600' : 
                                        act.type === 'visit' ? 'bg-green-50 text-green-600' : 
                                        'bg-gray-100 text-gray-600'
                                     }`}>{act.type}</span>
                                  </div>
                                  <span className="text-xs text-gray-400 font-mono">{act.date}</span>
                               </div>
                               <div className="text-xs text-gray-500 flex gap-2">
                                  <span>负责人: {act.owner}</span>
                                  <span>状态: {act.status === 'completed' ? '已完成' : '待办'}</span>
                               </div>
                            </div>
                         ))}
                         {client.activities.length === 0 && <div className="text-xs text-gray-400">暂无跟进记录</div>}
                      </div>
                   </div>

                   {/* Payments */}
                   <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><CreditCard size={18} className="text-green-500"/> 回款记录</h3>
                      <div className="overflow-x-auto">
                         <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 bg-gray-50">
                               <tr><th className="p-2">日期</th><th className="p-2">产品内容</th><th className="p-2">金额</th><th className="p-2">状态</th></tr>
                            </thead>
                            <tbody>
                               {client.payments.map(pay => (
                                  <tr key={pay.id} className="border-b border-gray-50 last:border-0">
                                     <td className="p-2 font-mono text-gray-600">{pay.date}</td>
                                     <td className="p-2 text-gray-800">{pay.product}</td>
                                     <td className="p-2 font-bold text-gray-900">{pay.amount}</td>
                                     <td className="p-2"><span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded">{pay.status}</span></td>
                                  </tr>
                               ))}
                               {client.payments.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-400 text-xs">暂无回款记录</td></tr>}
                            </tbody>
                         </table>
                      </div>
                   </div>
                </div>

                {/* Right Column: Stakeholders & Team */}
                <div className="space-y-6">
                   {/* Adoption DNA */}
                   <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm"><Zap size={16} className="text-yellow-500"/> 产品点亮情况</h3>
                      <div className="space-y-3">
                        {client.adoptionDetails.map((item, idx) => (
                           <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-gray-700 font-medium">{item.product}</span>
                              <div className="flex items-center gap-2">
                                 <span className="text-gray-400">{item.coverage}</span>
                                 <div className={`w-2 h-2 rounded-full ${item.status === 'full' ? 'bg-green-500' : item.status === 'partial' ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                              </div>
                           </div>
                        ))}
                      </div>
                   </div>

                   {/* Decision Makers */}
                   <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm"><Users size={16} className="text-orange-500"/> 关键决策链</h3>
                      <div className="space-y-3">
                         {client.contacts.map((contact, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 group">
                               <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                     <span className="font-bold text-gray-900 text-sm">{contact.name}</span>
                                     <span className="text-xs text-gray-500">{contact.title}</span>
                                  </div>
                                  <span className={`text-[10px] px-1.5 rounded ${contact.attitude === 'Support' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{contact.attitude}</span>
                                </div>
                                <div className="flex gap-2 text-[10px] text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="flex items-center gap-0.5"><Phone size={10}/> {contact.phone || '-'}</span>
                                  <span className="flex items-center gap-0.5"><Mail size={10}/> {contact.email || '-'}</span>
                               </div>
                               <p className="text-xs text-gray-600 line-clamp-2">{contact.notes}</p>
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* Project Team */}
                   <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm"><Briefcase size={16} className="text-blue-500"/> 项目成员</h3>
                      <div className="space-y-3">
                         {client.team.map((member, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-lark-100 flex items-center justify-center text-xs font-bold text-lark-600">{member.avatar}</div>
                               <div>
                                  <div className="text-sm font-bold text-gray-800">{member.name}</div>
                                  <div className="text-xs text-gray-400">{member.role}</div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

      </div>
      
      {/* Detail Modal */}
      {selectedExec && <DetailedExecutiveModal exec={selectedExec} onClose={() => setSelectedExec(null)} />}
    </div>
  );
};

export default ClientDetailPage;