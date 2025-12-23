import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, BarChart2, Users, Target, Building2, Calendar, MapPin, Share2, Star, Heart, MessageSquare, Briefcase, Zap, Trophy, TrendingUp, Download, Eye, ThumbsUp, Sparkles, AlertCircle, Tag, Activity, LayoutGrid, ChevronRight, Edit2, Trash2, StarHalf, Smile, Meh, Frown, DollarSign, Presentation } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, Cell, Pie, PieChart, Legend } from 'recharts';
import { NavTab } from '../types';

interface CaseDetailProps {
  onBack: () => void;
  // Optional props for consistency with App.tsx routing
  caseId?: string; 
}

// --- Rich Data Types ---
interface CaseVersion {
  version: string;
  date: string;
  desc: string;
}

interface RichCaseStudy {
  id: string;
  title: string;
  customerName: string;
  logoUrl: string;
  industry: string;
  scale: string; // e.g., "10,000+ 人"
  location: string;
  author: string;
  date: string;
  likes: number;
  views: string;
  background: string;
  painPoints: string[];
  solutionSteps: { title: string; desc: string }[];
  keyResults: { label: string; value: string; desc: string }[];
  architectureImg?: string; // Placeholder for architecture diagram
  team: { role: string; name: string; avatar: string }[];
  relatedProducts: string[];
  tags: string[];
}

interface EvaluationData {
  summary: string;
  highlights: string;
  improvements: string;
  aiDetails: { dimension: string; weight: number; score: number; evaluation: string; suggestion: string }[];
  hotWords: { positive: string[]; neutral: string[]; negative: string[] };
}

interface ValueMetricDetail {
  label: string;
  value: string;
  trend: string;
  trendDir: 'up' | 'down';
  desc: string;
  history: { date: string; value: number }[];
}

// --- MOCK DATABASE ---
const RICH_CASES_DATA: Record<string, RichCaseStudy> = {
  '1': { // Future Auto
    id: '1',
    customerName: '未来汽车集团',
    title: '万人研发团队如何实现高效敏捷协同',
    logoUrl: 'https://picsum.photos/48/48?random=1',
    industry: '大制造 / 新能源汽车',
    scale: '15,000+ 员工',
    location: '上海 · 嘉定',
    author: '张三',
    date: '2025/11/15',
    likes: 420,
    views: '12.5k',
    background: '未来汽车集团是国内领先的新能源车企。随着业务指数级增长，研发团队规模迅速扩张至万人级别，传统的科层制管理和割裂的工具链已无法支撑“软件定义汽车”的敏捷迭代需求。',
    painPoints: [
      '工具墙林立：需求、代码、测试、发布分散在7个不同系统中，数据流转需人工搬运。',
      '信息由于部门墙产生衰减：产品经理与研发工程师对需求的理解偏差导致返工率高达 25%。',
      '知识资产流失：大量技术文档散落在个人电脑中，新人入职平均需要 3 个月才能上手。'
    ],
    solutionSteps: [
      { title: '统一研发底座', desc: '引入飞书项目 (Meego) 替换原有 Jira + Excel 模式，实现需求到上线的全链路可视化管理。' },
      { title: '文档即知识', desc: '将所有技术方案、API文档、会议纪要迁移至飞书文档，构建企业级知识库，搜索效率提升 10 倍。' },
      { title: '自动化工作流', desc: '通过飞书集成平台打通 GitLab 与 Jenkins，代码提交自动触发流水线，并通过飞书机器人推送构建结果。' }
    ],
    keyResults: [
      { label: '需求交付周期', value: '-30%', desc: '从平均 45 天缩短至 30 天' },
      { label: '缺陷逃逸率', value: '<0.5%', desc: '自动化测试覆盖率提升至 90%' },
      { label: '知识复用率', value: '85%', desc: '新人上手时间缩短至 2 周' }
    ],
    team: [
      { role: '客户成功', name: '张三', avatar: '张' },
      { role: '解决方案', name: '李四', avatar: '李' },
      { role: '交付经理', name: '王五', avatar: '王' }
    ],
    relatedProducts: ['飞书项目', '飞书文档', '飞书集成平台'],
    tags: ['研发效能', 'IPD变革', '知识管理']
  },
  '2': { // Super Retail
    id: '2',
    customerName: '超级零售连锁',
    title: '连接5000家门店，打造数字化门店管理新范式',
    logoUrl: 'https://picsum.photos/48/48?random=2',
    industry: '大消费 / 连锁零售',
    scale: '50,000+ 员工',
    location: '北京 · 朝阳',
    author: '李雷',
    date: '2025/11/10',
    likes: 350,
    views: '8.9k',
    background: '超级零售连锁在全国拥有5000+门店。过去，总部对门店的管控依赖层层下发的Excel表格和微信群截图，数据滞后且不真实，SOP执行率难以保障。',
    painPoints: [
      '巡检数据造假：传统的纸质或水印相机打卡容易作弊，无法真实反映门店情况。',
      '信息触达难：总部指令层层传达，到达一线店员时往往失真或被忽略。',
      '优秀经验难复制：金牌店长的经营秘籍无法快速沉淀并推广到全网。'
    ],
    solutionSteps: [
      { title: '巡检在线化', desc: '利用多维表格+飞书任务，搭建移动端巡检系统，督导进店扫码即刻开始标准化巡检。' },
      { title: '超级群连接', desc: '建立按区域划分的门店超级群，机器人自动播报每日业绩排名，激发竞争意识。' },
      { title: 'AI 导购助手', desc: '基于飞书知识库打造 AI 问答机器人，店员遇到陈列或话术问题，拍照提问即刻获得答案。' }
    ],
    keyResults: [
      { label: '巡检效率', value: '+200%', desc: '单店巡检时间从 2 小时缩短至 40 分钟' },
      { label: '问题整改率', value: '100%', desc: '自动派单闭环，杜绝推诿' },
      { label: '单店坪效', value: '+15%', desc: '标准化运营带来业绩直接提升' }
    ],
    team: [
      { role: '客户成功', name: '赵六', avatar: '赵' },
      { role: '行业专家', name: '钱七', avatar: '钱' }
    ],
    relatedProducts: ['多维表格', '飞书任务', '飞书机器人'],
    tags: ['门店数字化', '一线赋能', '标准化运营']
  },
  '3': { // Global Tech
    id: '3',
    customerName: 'Global Tech Inc',
    title: '跨国企业的无障碍沟通实践',
    logoUrl: 'https://picsum.photos/48/48?random=3',
    industry: '互联网 / 高科技',
    scale: '8,000+ 员工',
    location: '新加坡 / 深圳',
    author: '王五',
    date: '2025/11/05',
    likes: 280,
    views: '6.5k',
    background: 'Global Tech 是一家业务遍布全球20个国家的互联网公司。团队分布在不同时区，语言背景多样，导致跨国协作效率低下，会议频次高但产出低。',
    painPoints: [
      '语言壁垒：非英语母语员工在全员会上不敢发言，信息传递层层衰减。',
      '时差困扰：为了对齐信息，员工经常需要在深夜开会，身心俱疲。',
      '文化隔阂：各地区办公室使用不同的IM和文档工具，形成信息孤岛。'
    ],
    solutionSteps: [
      { title: '翻译即服务', desc: '全面启用飞书即时翻译（文档、聊天、会议），让员工使用母语即可顺畅沟通。' },
      { title: '异步协作', desc: '推行“飞书妙记”代替同步会议，通过录制视频和评论进行异步沟通，减少跨时区会议。' },
      { title: '全球一张网', desc: '统一使用飞书作为唯一办公入口，集成Workday与Salesforce，实现全球组织架构在线。' }
    ],
    keyResults: [
      { label: '会议时长', value: '-40%', desc: '通过异步沟通减少无效会议' },
      { label: '全员满意度', value: '4.9/5', desc: '打破语言障碍，增强归属感' },
      { label: '信息触达', value: '100%', desc: '全球全员公告必达' }
    ],
    team: [
      { role: '客户成功', name: '孙敏', avatar: '孙' },
      { role: '国际化顾问', name: 'Tom', avatar: 'T' }
    ],
    relatedProducts: ['飞书会议', '飞书妙记', '即时翻译'],
    tags: ['跨国协作', '异步办公', '文化融合']
  },
  '4': { // BioMed
    id: '4',
    customerName: '创新生物医药',
    title: '医药合规营销与学术推广数字化',
    logoUrl: 'https://picsum.photos/48/48?random=4',
    industry: '大消费 / 医药',
    scale: '5,000+ 员工',
    location: '苏州 · 工业园',
    author: '赵六',
    date: '2025/10/20',
    likes: 190,
    views: '4.2k',
    background: '在医药代表备案制和两票制背景下，药企面临严峻的合规挑战。传统的线下学术推广难以留痕，且市场部制作的高质量学术资料难以精准触达一线代表。',
    painPoints: [
      '合规风险高：线下拜访和会议缺乏数字化留痕，存在合规隐患。',
      '资源利用率低：市场部花费重金制作的学术幻灯片，一线代表使用率不足 30%。',
      '培训周期长：新药上市周期加快，代表培训考核流程繁琐，响应市场慢。'
    ],
    solutionSteps: [
      { title: '合规日历', desc: '基于飞书日历与审批，实现代表拜访计划的预申报与签到打卡，确保行迹合规。' },
      { title: '学术资源库', desc: '搭建云文档学术资料库，设置精细化权限，支持水印与防泄密，追踪阅读数据。' },
      { title: '移动培训', desc: '利用飞书多维表格搭建微课堂，代表碎片时间即可完成新药知识学习与考试。' }
    ],
    keyResults: [
      { label: '学术会议', value: '+50场/月', desc: '线上会议场次显著增加' },
      { label: '资源复用率', value: '+80%', desc: '市场物料下载量翻倍' },
      { label: '合规审计', value: '100%', desc: '所有拜访记录可追溯' }
    ],
    team: [
      { role: '客户成功', name: '周杰', avatar: '周' },
      { role: '行业架构', name: '吴九', avatar: '吴' }
    ],
    relatedProducts: ['飞书日历', '云文档', '多维表格'],
    tags: ['合规营销', '学术推广', '资源管理']
  }
};

const DEFAULT_CASE = RICH_CASES_DATA['1'];

// --- MOCK EVALUATION DATA ---
const EVALUATION_DATABASE: Record<string, EvaluationData> = {
  '1': {
    summary: '该案例完整度极高，数据翔实，逻辑闭环。特别是对“研发工具割裂”这一行业共性痛点的描述非常精准，解决方案中的架构图清晰展示了飞书作为底座的连接能力，具有极高的参考价值。',
    highlights: '痛点挖掘深刻，直击CTO关注点；ROI数据有对比，说服力强。',
    improvements: '建议补充更多一线工程师的实际使用感受引用，增强感性认知。',
    aiDetails: [
      { dimension: '内容完整性', weight: 0.2, score: 95, evaluation: '结构非常完整。', suggestion: '无。' },
      { dimension: '故事吸引力', weight: 0.2, score: 88, evaluation: '背景铺垫到位。', suggestion: '增加“变革前的混乱”描写。' },
      { dimension: '数据真实性', weight: 0.3, score: 92, evaluation: '核心指标均有数据支撑。', suggestion: '无。' },
      { dimension: '可复制性', weight: 0.2, score: 90, evaluation: '方案逻辑通用。', suggestion: '无。' },
      { dimension: '视觉表现', weight: 0.1, score: 85, evaluation: '配图专业。', suggestion: '增加现场照片。' }
    ],
    hotWords: { positive: ['标杆案例', '数据详实', '逻辑清晰'], neutral: ['篇幅较长'], negative: [] }
  },
  '2': {
    summary: '非常接地气的零售行业案例，移动端截图展示非常直观，能够很好地打动运营总监。',
    highlights: '移动端体验展示生动；AI导购助手是亮点。',
    improvements: '缺少对加盟商管理场景的描述。',
    aiDetails: [
      { dimension: '内容完整性', weight: 0.2, score: 90, evaluation: '覆盖了核心场景。', suggestion: '补充加盟商视角。' },
      { dimension: '故事吸引力', weight: 0.2, score: 92, evaluation: '一线赋能的故事很打动人。', suggestion: '无。' },
      { dimension: '数据真实性', weight: 0.3, score: 85, evaluation: '数据较为宏观。', suggestion: '增加单店具体案例。' },
      { dimension: '可复制性', weight: 0.2, score: 95, evaluation: '极易复制到连锁行业。', suggestion: '无。' },
      { dimension: '视觉表现', weight: 0.1, score: 88, evaluation: '手机端截图清晰。', suggestion: '无。' }
    ],
    hotWords: { positive: ['落地性强', '一线视角'], neutral: ['中规中矩'], negative: [] }
  },
  '3': {
    summary: '针对出海和跨国企业的经典案例，很好地展示了飞书在语言和时区上的产品优势。',
    highlights: '“异步协作”的概念包装很好；Workday集成体现了生态能力。',
    improvements: '对于文化融合软性价值的描述可以更具象化。',
    aiDetails: [
      { dimension: '内容完整性', weight: 0.2, score: 88, evaluation: '场景覆盖全面。', suggestion: '无。' },
      { dimension: '故事吸引力', weight: 0.2, score: 85, evaluation: '跨国痛点很有共鸣。', suggestion: '增加员工访谈视频。' },
      { dimension: '数据真实性', weight: 0.3, score: 90, evaluation: '会议时长数据很有说服力。', suggestion: '无。' },
      { dimension: '可复制性', weight: 0.2, score: 85, evaluation: '适合出海企业。', suggestion: '无。' },
      { dimension: '视觉表现', weight: 0.1, score: 80, evaluation: '截图一般。', suggestion: '展示翻译界面细节。' }
    ],
    hotWords: { positive: ['出海必备', '打破语言障碍'], neutral: [], negative: [] }
  },
  '4': {
    summary: '医药行业合规营销的典范，切中“合规”这一命门。',
    highlights: '合规日历的设计非常巧妙；学术资源库解决了实际问题。',
    improvements: '可以增加关于代表隐私保护的说明，消除客户顾虑。',
    aiDetails: [
      { dimension: '内容完整性', weight: 0.2, score: 92, evaluation: '合规逻辑严密。', suggestion: '无。' },
      { dimension: '故事吸引力', weight: 0.2, score: 80, evaluation: '专业性强，趣味性略弱。', suggestion: '无。' },
      { dimension: '数据真实性', weight: 0.3, score: 88, evaluation: '资源复用数据真实。', suggestion: '无。' },
      { dimension: '可复制性', weight: 0.2, score: 90, evaluation: '医药行业通用。', suggestion: '无。' },
      { dimension: '视觉表现', weight: 0.1, score: 85, evaluation: '流程图清晰。', suggestion: '无。' }
    ],
    hotWords: { positive: ['合规', '专业'], neutral: ['行业门槛高'], negative: [] }
  }
};

// --- MOCK VALUE DATA ---
const VALUE_METRICS_DATA: Record<string, Record<string, ValueMetricDetail>> = {
  '1': {
    'sales': { label: '打单引用次数', value: '452次', trend: '+12%', trendDir: 'up', desc: '被销售在方案中引用的次数。', history: [{date:'8月',value:250},{date:'12月',value:452}] },
    'win': { label: '协助赢单金额', value: '¥8,500W', trend: '+25%', trendDir: 'up', desc: '关联商机且最终赢单总额。', history: [{date:'8月',value:2500},{date:'12月',value:8500}] },
    'visit': { label: '参访接待场次', value: '28场', trend: '+3场', trendDir: 'up', desc: 'CXO级参访接待场次。', history: [{date:'8月',value:8},{date:'12月',value:28}] },
    'reach': { label: '外部传播热度', value: 'Top 5%', trend: '-', trendDir: 'up', desc: '综合曝光指数。', history: [{date:'8月',value:60},{date:'12月',value:95}] }
  },
  '2': {
    'sales': { label: '打单引用次数', value: '380次', trend: '+8%', trendDir: 'up', desc: '被销售在方案中引用的次数。', history: [{date:'8月',value:200},{date:'12月',value:380}] },
    'win': { label: '协助赢单金额', value: '¥3,200W', trend: '+10%', trendDir: 'up', desc: '关联商机且最终赢单总额。', history: [{date:'8月',value:1200},{date:'12月',value:3200}] },
    'visit': { label: '参访接待场次', value: '12场', trend: '+1场', trendDir: 'up', desc: 'CXO级参访接待场次。', history: [{date:'8月',value:4},{date:'12月',value:12}] },
    'reach': { label: '外部传播热度', value: 'Top 15%', trend: '-', trendDir: 'up', desc: '综合曝光指数。', history: [{date:'8月',value:40},{date:'12月',value:75}] }
  },
  '3': {
    'sales': { label: '打单引用次数', value: '120次', trend: '+15%', trendDir: 'up', desc: '被销售在方案中引用的次数。', history: [{date:'8月',value:50},{date:'12月',value:120}] },
    'win': { label: '协助赢单金额', value: '¥1,500W', trend: '+20%', trendDir: 'up', desc: '关联商机且最终赢单总额。', history: [{date:'8月',value:500},{date:'12月',value:1500}] },
    'visit': { label: '参访接待场次', value: '5场', trend: '0', trendDir: 'up', desc: 'CXO级参访接待场次。', history: [{date:'8月',value:2},{date:'12月',value:5}] },
    'reach': { label: '外部传播热度', value: 'Top 30%', trend: '-', trendDir: 'up', desc: '综合曝光指数。', history: [{date:'8月',value:20},{date:'12月',value:50}] }
  },
  '4': {
    'sales': { label: '打单引用次数', value: '210次', trend: '+5%', trendDir: 'up', desc: '被销售在方案中引用的次数。', history: [{date:'8月',value:150},{date:'12月',value:210}] },
    'win': { label: '协助赢单金额', value: '¥2,800W', trend: '+12%', trendDir: 'up', desc: '关联商机且最终赢单总额。', history: [{date:'8月',value:1000},{date:'12月',value:2800}] },
    'visit': { label: '参访接待场次', value: '8场', trend: '+2场', trendDir: 'up', desc: 'CXO级参访接待场次。', history: [{date:'8月',value:3},{date:'12月',value:8}] },
    'reach': { label: '外部传播热度', value: 'Top 20%', trend: '-', trendDir: 'up', desc: '综合曝光指数。', history: [{date:'8月',value:30},{date:'12月',value:65}] }
  }
};

// --- Helper Component: Interactive Star Rating ---
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

const CaseDetail: React.FC<CaseDetailProps> = ({ onBack, caseId = '1' }) => {
  const [activeTab, setActiveTab] = useState<'detail' | 'quality' | 'value'>('detail');
  
  // Load Data
  const caseStudy = RICH_CASES_DATA[caseId] || DEFAULT_CASE;
  const evaluation = EVALUATION_DATABASE[caseId] || EVALUATION_DATABASE['1'];
  const valueMetrics = VALUE_METRICS_DATA[caseId] || VALUE_METRICS_DATA['1'];

  // --- Evaluation State (Mocking User Reviews) ---
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewScore, setNewReviewScore] = useState(80);

  // Initialize reviews dynamically based on Case ID
  useEffect(() => {
    let initialReviews: any[] = [];
    if (caseId === '1') {
      initialReviews = [
        { id: 1, user: '王建国', score: 90, comment: '这个案例非常经典，上次给客户讲完，客户直接要求对标建设。', date: '2025/12/12', likes: 12 },
        { id: 2, user: '李明', score: 80, comment: '数据很全，但是缺少具体的实施周期描述，客户比较关心落地难度。', date: '2025/12/10', likes: 5 }
      ];
    } else if (caseId === '2') {
      initialReviews = [
        { id: 1, user: '陈静', score: 95, comment: '零售行业的必读案例，巡检场景切得非常准。', date: '2025/11/20', likes: 8 }
      ];
    } else if (caseId === '3') {
      initialReviews = [
        { id: 1, user: 'Tom', score: 85, comment: 'Cross-border collaboration is tough, this case shows a good way out.', date: '2025/11/08', likes: 10 }
      ];
    } else if (caseId === '4') {
      initialReviews = [
        { id: 1, user: '周杰', score: 92, comment: '合规是医药行业的红线，这个案例在这方面做得很好。', date: '2025/10/25', likes: 15 }
      ];
    } else {
      initialReviews = [
        { id: 1, user: '匿名用户', score: 80, comment: '案例很有参考价值。', date: '2025/12/01', likes: 0 }
      ];
    }
    setUserReviews(initialReviews);
  }, [caseId]);

  // Derived Calculations
  const aiScore = Math.round(evaluation.aiDetails.reduce((acc, i) => acc + i.score * i.weight, 0));
  const userScore = Math.round(userReviews.reduce((acc, r) => acc + r.score, 0) / (userReviews.length || 1));
  const finalScore = Math.round(aiScore * 0.6 + userScore * 0.4); // 60% AI, 40% User for Cases
  
  const chartData = evaluation.aiDetails.map(item => ({ subject: item.dimension, A: item.score, fullMark: 100 }));

  const handleAddReview = () => {
    if (!newReviewText.trim()) return;
    setUserReviews([{ id: Date.now(), user: '我', score: newReviewScore, comment: newReviewText, date: '刚刚', likes: 0 }, ...userReviews]);
    setNewReviewText('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn pb-24">
      {/* Navigation */}
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition group">
        <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 返回案例列表
      </button>

      {/* Tabs */}
      <div className="bg-white rounded-t-2xl border-b border-gray-100 px-8 pt-2 flex gap-8 overflow-x-auto shadow-sm z-10 relative">
        <button onClick={() => setActiveTab('detail')} className={`py-4 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'detail' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>案例详情</button>
        <button onClick={() => setActiveTab('quality')} className={`py-4 text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1 ${activeTab === 'quality' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>质量评分 <span className="bg-lark-100 text-lark-600 text-[10px] px-1.5 py-0.5 rounded-full font-normal">AI</span></button>
        <button onClick={() => setActiveTab('value')} className={`py-4 text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1 ${activeTab === 'value' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>赋能价值</button>
      </div>

      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 border-t-0 p-8 min-h-[600px]">
        
        {/* --- TAB 1: DETAIL --- */}
        {activeTab === 'detail' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Block */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8">
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                     <img src={caseStudy.logoUrl} alt="Logo" className="w-12 h-12 rounded-lg border border-gray-100 shadow-sm" />
                     <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">{caseStudy.title}</h1>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                           <span className="flex items-center gap-1"><Building2 size={14}/> {caseStudy.customerName}</span>
                           <span className="w-px h-3 bg-gray-300"></span>
                           <span>{caseStudy.industry}</span>
                           <span className="w-px h-3 bg-gray-300"></span>
                           <span className="flex items-center gap-1"><MapPin size={14}/> {caseStudy.location}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                     {caseStudy.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">{tag}</span>
                     ))}
                  </div>
               </div>
               <div className="flex gap-3 shrink-0">
                  <button className="flex items-center gap-2 px-4 py-2 bg-lark-500 text-white rounded-lg hover:bg-lark-600 transition shadow-sm font-medium text-sm">
                     <Download size={16} /> 下载 PDF
                  </button>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition">
                     <Share2 size={18} />
                  </button>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-yellow-50 text-gray-500 hover:text-yellow-500 transition">
                     <Star size={18} />
                  </button>
               </div>
            </div>

            {/* Core Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left: Narrative */}
               <div className="lg:col-span-2 space-y-8">
                  <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                     <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Target size={20} className="text-lark-500" /> 项目背景
                     </h3>
                     <p className="text-gray-700 leading-relaxed text-sm">{caseStudy.background}</p>
                  </div>

                  <div>
                     <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertCircle size={20} className="text-red-500" /> 核心痛点
                     </h3>
                     <ul className="space-y-3">
                        {caseStudy.painPoints.map((point, i) => (
                           <li key={i} className="flex gap-3 bg-red-50/50 p-4 rounded-lg border border-red-50">
                              <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i+1}</div>
                              <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
                           </li>
                        ))}
                     </ul>
                  </div>

                  <div>
                     <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Zap size={20} className="text-yellow-500" /> 解决方案
                     </h3>
                     <div className="space-y-4">
                        {caseStudy.solutionSteps.map((step, i) => (
                           <div key={i} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition bg-white">
                              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                 <CheckCircle2 size={16} className="text-green-500" /> {step.title}
                              </h4>
                              <p className="text-gray-600 text-sm">{step.desc}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Right: Metrics & Meta */}
               <div className="space-y-6">
                  {/* ROI Card */}
                  <div className="bg-gradient-to-br from-lark-500 to-lark-700 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-10 -mt-10"></div>
                     <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10"><Trophy size={18} /> 核心价值收益</h3>
                     <div className="space-y-6 relative z-10">
                        {caseStudy.keyResults.map((res, i) => (
                           <div key={i}>
                              <div className="text-3xl font-extrabold mb-1">{res.value}</div>
                              <div className="font-medium opacity-90 mb-1">{res.label}</div>
                              <div className="text-xs opacity-70">{res.desc}</div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Team Card */}
                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                     <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><Users size={16}/> 核心团队</h3>
                     <div className="space-y-4">
                        {caseStudy.team.map((member, i) => (
                           <div key={i} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{member.avatar}</div>
                              <div>
                                 <div className="text-sm font-bold text-gray-800">{member.name}</div>
                                 <div className="text-xs text-gray-400">{member.role}</div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Related Products */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                     <h3 className="text-sm font-bold text-gray-800 mb-4">涉及产品</h3>
                     <div className="flex flex-wrap gap-2">
                        {caseStudy.relatedProducts.map(p => (
                           <span key={p} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">{p}</span>
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
             {/* Score Header */}
             <div className="bg-gradient-to-r from-purple-50 to-white p-8 rounded-2xl border border-purple-100 flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2"><Sparkles className="text-purple-500" /> 案例质量综合评分</h3>
                   <p className="text-gray-500 text-sm">基于AI多维度分析与一线销售真实反馈加权计算</p>
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
                              placeholder="这个案例对你的打单有帮助吗？" 
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
                   <h3 className="text-xl font-bold text-gray-900">案例赋能价值看板</h3>
                   <p className="text-sm text-gray-500 mt-1">全方位评估该案例对销售打单、市场品牌及客户成功的影响力</p>
                </div>
                <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">数据更新于: {new Date().toLocaleDateString()}</div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[valueMetrics.sales, valueMetrics.win, valueMetrics.visit, valueMetrics.reach].map((m, i) => (
                   <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm font-medium">
                         {i === 0 && <Presentation size={18} className="text-blue-500"/>}
                         {i === 1 && <Trophy size={18} className="text-yellow-500"/>}
                         {i === 2 && <Building2 size={18} className="text-purple-500"/>}
                         {i === 3 && <Share2 size={18} className="text-green-500"/>}
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
                   <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><DollarSign size={18} className="text-lark-500"/> 赢单贡献趋势 (近6个月)</h4>
                   <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={valueMetrics.win.history}>
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
                            <Pie data={[{name: '售前方案', value: 45}, {name: '高层宣讲', value: 30}, {name: '市场活动', value: 15}, {name: '内部培训', value: 10}]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                               {[ '#3b82f6', '#f97316', '#22c55e', '#a855f7'].map((col, idx) => <Cell key={idx} fill={col} />)}
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

export default CaseDetail;