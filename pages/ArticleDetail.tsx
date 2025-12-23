import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ThumbsUp, MessageCircle, Share2, Clock, Calendar, Eye, Send, Edit2, Trash2, X, Check } from 'lucide-react';
import { ArticleContent } from '../types';

interface ArticleDetailProps {
  id: string;
  initialAction?: 'view' | 'comment';
  onBack: () => void;
  extraArticleContent?: Record<string, ArticleContent>;
}

interface Comment {
  id: number;
  user: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  isLiked: boolean;
  isCurrentUser: boolean;
}

// --- Mock Data: Specific Comments per Article ---
const COMMENTS_DATABASE: Record<string, Comment[]> = {
  'r1': [ // Auto Trends
    { id: 101, user: '李想', avatar: '李', time: '2小时前', text: 'SDV确实是未来，但是传统车企的转型包袱太重了，飞书的介入点找得很准。', likes: 45, isLiked: true, isCurrentUser: false },
    { id: 102, user: 'TechAuto', avatar: 'T', time: '5小时前', text: 'McKinsey的报告一直很有前瞻性。请问文中的数据有详细版吗？', likes: 23, isLiked: false, isCurrentUser: false },
    { id: 103, user: '张工', avatar: '张', time: '1天前', text: '我们在做IPD转型，目前最大的痛点就是工具割裂，飞书如果能打通Jira就好了。', likes: 12, isLiked: false, isCurrentUser: false },
  ],
  'r2': [ // Manufacturing
    { id: 201, user: '厂长', avatar: '厂', time: '30分钟前', text: '一线员工确实不愿意用复杂的APP，飞书这种IM交互方式降低了门槛。', likes: 88, isLiked: false, isCurrentUser: false },
    { id: 202, user: '精益生产', avatar: '精', time: '3小时前', text: '信息流转加速是手段，最终还是要看决策效率提升了多少。', likes: 42, isLiked: false, isCurrentUser: false },
  ],
  'r3': [ // Consumer Electronics
    { id: 301, user: '出海人', avatar: '出', time: '1小时前', text: '品牌出海不仅是产品出海，更是文化出海。飞书的翻译功能帮了大忙。', likes: 56, isLiked: true, isCurrentUser: false },
  ],
  'r7': [ // DingTalk Competitor
    { id: 701, user: 'SaaS观察员', avatar: 'S', time: '1小时前', text: '钉钉这次7.5版本的AI力度很大，PaaS化的方向跟飞书越来越像了，怎么看？', likes: 120, isLiked: false, isCurrentUser: false },
    { id: 702, user: '中小企业主', avatar: '中', time: '3小时前', text: '对于我们这种小团队，钉钉的免费版门槛确实低。飞书的优势还是在体验和文档协同上。', likes: 56, isLiked: false, isCurrentUser: false },
    { id: 703, user: 'AI大模型', avatar: 'A', time: '1天前', text: 'Agent平台是未来的必争之地，飞书的智能伙伴需要加快生态建设了。', likes: 33, isLiked: false, isCurrentUser: false },
    { id: 704, user: '刘伟', avatar: '刘', time: '2天前', text: '竞对在下沉市场的渗透率很高，我们在头部客户的防守策略需要加强。', likes: 15, isLiked: true, isCurrentUser: true },
  ],
  'r8': [ // WeCom Competitor
    { id: 801, user: '私域操盘手', avatar: '私', time: '2小时前', text: '企微的连接能力确实是护城河，特别是在零售行业，这一点飞书很难切入。', likes: 95, isLiked: false, isCurrentUser: false },
    { id: 802, user: '零售PM', avatar: '零', time: '6小时前', text: '视频号直播打通后，企微的商业闭环更完整了。飞书的机会可能还是在组织内部效能上。', likes: 40, isLiked: false, isCurrentUser: false },
  ],
  'r9': [ // Copilot Competitor
    { id: 901, user: '极客', avatar: 'G', time: '40分钟前', text: '微软Copilot在Office全家桶里的体验确实丝滑，但是贵啊！', likes: 200, isLiked: false, isCurrentUser: false },
    { id: 902, user: 'CIO_John', avatar: 'J', time: '3小时前', text: '对于国内企业来说，数据出境是个大问题，飞书的本地化部署和合规性是微软比不了的。', likes: 150, isLiked: true, isCurrentUser: false },
    { id: 903, user: 'AI开发者', avatar: 'D', time: '1天前', text: '飞书的开放能力更强，我们可以自己开发插件调用业务系统，Copilot感觉更封闭一些。', likes: 80, isLiked: false, isCurrentUser: false },
  ],
  // Fallback for others
  'default': [
    { id: 1, user: '王建国', avatar: '王', time: '2小时前', text: '非常有深度的文章，对行业趋势的分析很透彻！', likes: 12, isLiked: false, isCurrentUser: false },
    { id: 2, user: 'Sarah Li', avatar: 'S', time: '5小时前', text: '请问文中提到的数据来源是哪里？', likes: 5, isLiked: false, isCurrentUser: false },
  ]
};

const ArticleDetail: React.FC<ArticleDetailProps> = ({ id, initialAction = 'view', onBack, extraArticleContent = {} }) => {
  const commentsRef = useRef<HTMLDivElement>(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(0);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  // Articles Data Map (Synced with ResearchPage & HomePage data)
  const articlesData: Record<string, ArticleContent> = {
    // --- HOME PAGE MOCK IDS ---
    '1': {
      title: '汽车行业数字化转型趋势洞察 2025',
      author: '张晓明',
      role: '高级行业分析师',
      date: '2025-05-12',
      readTime: '8 min read',
      views: '2,341',
      category: '资讯洞察',
      imageUrl: 'https://picsum.photos/800/400?random=1',
      initialLikes: 245,
      initialCommentsCount: 32,
      content: `
        <p class="mb-4">随着新能源汽车市场的爆发式增长，传统车企正面临着前所未有的挑战与机遇。数字化转型已不再是选择题，而是必答题。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">1. 软件定义汽车 (SDV) 成为主流</h3>
        <p class="mb-4">软件在汽车价值链中的占比预计将从目前的10%提升至2030年的50%。这意味着车企必须建立强大的软件研发能力，打破传统的硬件研发流程。</p>
        <p class="mb-4">飞书作为新一代协同平台，能够帮助车企打破部门墙，实现“需求-开发-测试-发布”的全链路敏捷协同。通过飞书项目（Meego），可以实现研发全流程的可视化与自动化。</p>
        <div class="my-6 p-4 bg-gray-50 border-l-4 border-lark-500 rounded-r-lg">
          <p class="text-gray-700 italic">“未来的汽车将是装在轮子上的超级计算机，而组织效能将决定这台计算机的进化速度。”</p>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">2. 用户运营私域化</h3>
        <p class="mb-4">车企与用户的关系正在从“一锤子买卖”转变为“全生命周期服务”。通过构建私域流量池，车企可以直接触达用户，获取一手反馈，从而反哺产品研发。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">3. 供应链协同网络化</h3>
        <p class="mb-4">面对复杂的国际形势和供应链波动，构建透明、敏捷的供应链网络至关重要。飞书多维表格可以轻松连接上下游合作伙伴，实现产能、库存数据的实时同步。</p>
      `
    },
    '2': {
      title: '消费电子行业：从单品爆款到生态构建',
      author: '李丽',
      role: '资深产品专家',
      date: '2025-05-10',
      readTime: '6 min read',
      views: '1,890',
      category: '资讯洞察',
      imageUrl: 'https://picsum.photos/800/400?random=2',
      initialLikes: 180,
      initialCommentsCount: 24,
      content: `
        <p class="mb-4">消费电子行业竞争日益激烈，单纯依靠“单品爆款”的时代已经过去。构建硬件+软件+服务的完整生态，成为品牌突围的关键。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">1. 全渠道DTC模式兴起</h3>
        <p class="mb-4">品牌不再完全依赖传统分销渠道，而是通过自建商城、私域社群等方式直接触达消费者（Direct to Consumer）。这要求企业具备极强的数据中台能力，能够实时洞察用户需求。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">2. 敏捷研发与快速迭代</h3>
        <p class="mb-4">消费电子产品生命周期缩短，对研发速度提出了更高要求。通过飞书IPD解决方案，企业可以实现跨部门的高效协同，将产品上市周期缩短30%以上。</p>
        <div class="my-6 p-4 bg-gray-50 border-l-4 border-lark-500 rounded-r-lg">
          <p class="text-gray-700 italic">“唯快不破。在消费电子领域，晚发布一个月可能就意味着失去整个市场窗口期。”</p>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">3. 智能化服务体验</h3>
        <p class="mb-4">利用AI技术提升售后服务体验，例如智能客服、故障预测等，能够显著提升用户满意度和品牌忠诚度。</p>
      `
    },
    '3': {
      title: '能源化工行业：绿色低碳与智能化并行',
      author: '王强',
      role: '能源行业顾问',
      date: '2025-05-08',
      readTime: '10 min read',
      views: '1,560',
      category: '资讯洞察',
      imageUrl: 'https://picsum.photos/800/400?random=3',
      initialLikes: 120,
      initialCommentsCount: 15,
      content: `
        <p class="mb-4">在“双碳”目标背景下，能源化工行业正经历着深刻的变革。绿色低碳转型与数字化智能化升级，是企业发展的双轮驱动。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">1. 安全生产数字化</h3>
        <p class="mb-4">安全是化工企业的生命线。利用IoT物联网技术和移动端应用，实现人员定位、设备状态监测、隐患排查的全流程数字化，可以有效降低事故风险。</p>
        <p class="mb-4">飞书多维表格与机器人的结合，让巡检数据实时上报、自动预警，真正实现了“人人都是安全员”。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">2. 生产运营精益化</h3>
        <p class="mb-4">通过数据驱动生产决策，优化工艺参数，降低能耗和物耗。数字化工厂的建设，让生产过程透明可控。</p>
        <div class="my-6 p-4 bg-gray-50 border-l-4 border-lark-500 rounded-r-lg">
          <p class="text-gray-700 italic">“数字化不是目的，降本增效、安全合规才是能源化工企业转型的核心诉求。”</p>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">3. 供应链韧性增强</h3>
        <p class="mb-4">建立多元化的供应商体系，利用数字化工具提升供应链的抗风险能力，确保原材料供应的稳定。</p>
      `
    },
    // --- RESEARCH PAGE MOCK IDS (r1-r9) ---
    'r1': {
      title: '2026年全球汽车行业数字化转型趋势预测',
      author: 'McKinsey',
      role: '外部机构',
      date: '2025-12-10',
      readTime: '15 min read',
      views: '5,200',
      category: '趋势洞察',
      imageUrl: 'https://picsum.photos/800/400?random=101',
      initialLikes: 340,
      initialCommentsCount: 45,
      content: '<p class="mb-4">McKinsey 最新报告指出，到2026年，全球汽车行业将迎来SDV（软件定义汽车）的爆发期。各大车企纷纷加大在软件研发领域的投入，力求在新的竞争格局中占据有利位置...</p>'
    },
    'r2': {
      title: '飞书在先进制造行业的落地实践与思考',
      author: '张三',
      role: 'GTM 专家',
      date: '2025-12-05',
      readTime: '10 min read',
      views: '3,800',
      category: '最佳实践',
      imageUrl: 'https://picsum.photos/800/400?random=102',
      initialLikes: 450,
      initialCommentsCount: 68,
      content: '<p class="mb-4">过去一年，我们深入100+工厂车间，发现信息流转加速是提升制造效率的关键。传统的看板管理存在滞后性，而飞书的消息机制可以将异常情况秒级推送到相关责任人...</p>'
    },
    'r3': {
      title: '消费电子出海：从“卖产品”到“卖品牌”的路径演进',
      author: '36Kr',
      role: '外部媒体',
      date: '2025-11-28',
      readTime: '12 min read',
      views: '4,100',
      category: '市场分析',
      imageUrl: 'https://picsum.photos/800/400?random=103',
      initialLikes: 220,
      initialCommentsCount: 32,
      content: '<p class="mb-4">中国消费电子品牌正在经历从性价比到品牌溢价的转型。在这一过程中，如何构建全球化的品牌心智，如何管理跨国团队，成为企业面临的新挑战...</p>'
    },
    'r4': {
      title: '金融行业信创替代背景下的协同办公新选择',
      author: '王金',
      role: '金融行业顾问',
      date: '2025-11-15',
      readTime: '8 min read',
      views: '2,900',
      category: '政策解读',
      imageUrl: 'https://picsum.photos/800/400?random=104',
      initialLikes: 180,
      initialCommentsCount: 25,
      content: '<p class="mb-4">信创国产化替代不仅是政策要求，更是金融机构自主可控的必由之路。飞书私有化部署方案，在满足金融级安全合规的前提下，提供了极致的办公体验...</p>'
    },
    'r5': {
      title: '新零售门店数字化：如何让数据驱动决策',
      author: '李雷',
      role: '零售行业专家',
      date: '2025-11-01',
      readTime: '10 min read',
      views: '3,500',
      category: '最佳实践',
      imageUrl: 'https://picsum.photos/800/400?random=105',
      initialLikes: 310,
      initialCommentsCount: 52,
      content: '<p class="mb-4">门店是零售的神经末梢，数据采集的实时性决定了决策的准确性。通过移动端工具，店长可以随时随地查看经营数据，总部也能实时掌握全国门店的运营状况...</p>'
    },
    'r6': {
      title: '生成式AI在企业知识管理中的应用前景',
      author: 'Gartner',
      role: '外部机构',
      date: '2025-10-20',
      readTime: '20 min read',
      views: '6,800',
      category: '趋势洞察',
      imageUrl: 'https://picsum.photos/800/400?random=106',
      initialLikes: 520,
      initialCommentsCount: 88,
      content: '<p class="mb-4">Gartner预测，知识管理将是生成式AI最先落地的场景之一。传统的搜索方式将被对话式AI取代，员工获取知识的效率将提升10倍以上...</p>'
    },
    'r7': {
      title: '深度拆解钉钉7.5版本：AI Agent 成为核心战略',
      author: '36Kr',
      role: '外部媒体',
      date: '2025-12-12',
      readTime: '12 min read',
      views: '8,900',
      category: '竞对观察',
      imageUrl: 'https://picsum.photos/800/400?random=107',
      initialLikes: 650,
      initialCommentsCount: 110,
      content: `
        <p class="mb-4">2025年底，钉钉发布了年度重磅更新 7.5 版本。本次更新最核心的战略转向就是全面拥抱 AI Agent，试图通过智能化底座重构协同办公生态。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">1. “魔法棒”的全面升级</h3>
        <p class="mb-4">钉钉将原有的 AI 功能整合为统一的“魔法棒”入口，并开放了 Agent 构建平台。企业用户可以通过自然语言对话，快速生成业务应用、审批流程甚至数据报表。这一举措极大降低了数字化门槛。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">2. 个人版与企业版的打通</h3>
        <p class="mb-4">为了应对飞书和企业微信的竞争，钉钉强化了个人版（针对自由职业者和小团队）与企业版之间的连接能力，试图通过C端用户的使用习惯反向渗透B端市场。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">3. PaaS 化战略的深化</h3>
        <p class="mb-4">钉钉继续坚持“做厚PaaS，做薄SaaS”的战略，通过酷应用（Cool Apps）将业务系统碎片化地嵌入到聊天流中。这对飞书的“多维表格+消息卡片”模式构成了直接竞争。</p>
        <div class="my-6 p-4 bg-gray-50 border-l-4 border-lark-500 rounded-r-lg">
          <p class="text-gray-700 italic">“钉钉正在从一个管理工具，进化为一个智能化的业务底座。飞书需要警惕其在中小企业市场的渗透率。”</p>
        </div>
      `
    },
    'r8': {
      title: '企业微信2025战略：深耕私域，连接消费者',
      author: '见实',
      role: '行业观察',
      date: '2025-12-08',
      readTime: '10 min read',
      views: '7,200',
      category: '竞对观察',
      imageUrl: 'https://picsum.photos/800/400?random=108',
      initialLikes: 580,
      initialCommentsCount: 95,
      content: `
        <p class="mb-4">企业微信在 2025 年的战略发布会上，再次强调了其核心差异化优势——“连接”。连接微信生态，连接 13 亿消费者，是其不可撼动的护城河。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">1. 视频号直播打通</h3>
        <p class="mb-4">企业微信彻底打通了视频号直播链路。导购可以在企微端直接发起直播，并一键分发给私域社群。直播间的互动数据、下单数据实时回流到企微客户画像中。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">2. 微信客服升级</h3>
        <p class="mb-4">微信客服能力进一步增强，支持在微信内（搜一搜、支付凭证、公众号）全触点接入。对于零售品牌而言，这是构建私域流量池的最佳入口。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">3. 行业化解决方案</h3>
        <p class="mb-4">企微针对零售、金融、教育等行业推出了深度定制的行业版，试图在垂直领域建立壁垒。特别是在金融合规方面，企微加强了会话存档与审计能力。</p>
        <div class="my-6 p-4 bg-gray-50 border-l-4 border-lark-500 rounded-r-lg">
          <p class="text-gray-700 italic">“对于大消费行业客户，企微的连接能力是刚需。飞书的机会在于后台管理的先进性与组织效能的提升。”</p>
        </div>
      `
    },
    'r9': {
      title: '微软 Copilot vs 飞书智能伙伴：生产力工具的 AI 路线之争',
      author: '极客公园',
      role: '科技媒体',
      date: '2025-12-01',
      readTime: '15 min read',
      views: '9,500',
      category: '竞对观察',
      imageUrl: 'https://picsum.photos/800/400?random=109',
      initialLikes: 800,
      initialCommentsCount: 150,
      content: `
        <p class="mb-4">随着 GPT-5 的发布，办公软件的 AI 大战进入白热化。微软 Microsoft 365 Copilot 与飞书智能伙伴（My AI）代表了两种不同的技术路线与产品哲学。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">1. 文档为中心 vs 沟通为中心</h3>
        <p class="mb-4">微软 Copilot 的优势在于 Office 全家桶的深厚积淀，Word、Excel、PPT 的生成能力极强，适合传统文档型工作流。而飞书智能伙伴更侧重于 IM 对话框，通过自然语言调用业务系统（AnyCross），更适合协作型工作流。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">2. 生态封闭 vs 开放集成</h3>
        <p class="mb-4">微软 Copilot 深度绑定 Azure 与 Windows 生态，体验一致性好但封闭。飞书则主打开放，支持集成 Salesforce、Jira 等第三方系统数据，AI 可以跨系统调度信息。</p>
        <h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">3. 本土化与落地服务</h3>
        <p class="mb-4">在中国市场，飞书的响应速度和服务能力远超微软。针对中国企业复杂的组织架构和管理模式，飞书 AI 提供了更多定制化场景，如日报周报自动生成、会议纪要智能分发等。</p>
        <div class="my-6 p-4 bg-gray-50 border-l-4 border-lark-500 rounded-r-lg">
          <p class="text-gray-700 italic">“微软是生产力工具的霸主，但飞书正在用更懂中国企业的 AI 体验撕开一道口子。”</p>
        </div>
      `
    },
    ...extraArticleContent
  };

  // Fallback to r1 if id not found, but try '1' first as default in original code
  const article = articlesData[id] || articlesData['1'] || articlesData['r1'];

  // Initialize State with correct stats and comments
  useEffect(() => {
    // 1. Set Article Specific Comments
    // If it's a new article (comments count is 0), initialize with empty array instead of default mock data
    const specificComments = COMMENTS_DATABASE[id] || (article.initialCommentsCount === 0 ? [] : COMMENTS_DATABASE['default']);
    setComments(specificComments);
    
    // 2. Set Stats (Likes & Comment Count)
    // Note: In a real app we'd fetch this. Here we take initial value from metadata
    setLikes(article.initialLikes);
    // Comment count is base + length of displayed comments (which is just a subset)
    // To make it look consistent with the card, we use the larger number from metadata
    setCommentCount(article.initialCommentsCount);

    if (initialAction === 'comment' && commentsRef.current) {
      setTimeout(() => {
        commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [initialAction, id, article]);

  const handleArticleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      user: '刘伟',
      avatar: '刘',
      time: '刚刚',
      text: commentText,
      likes: 0,
      isLiked: false,
      isCurrentUser: true
    };
    setComments([newComment, ...comments]);
    setCommentCount(prev => prev + 1);
    setCommentText('');
  };

  // --- Comment Feature Handlers ---

  const handleCommentLike = (commentId: number) => {
    setComments(prev => prev.map(c => 
      c.id === commentId 
        ? { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked }
        : c
    ));
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm('确定要删除这条评论吗？')) {
      setComments(prev => prev.filter(c => c.id !== commentId));
      setCommentCount(prev => prev - 1);
    }
  };

  const handleEditClick = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
    setReplyingId(null); // Close reply if open
  };

  const handleSaveEdit = (commentId: number) => {
    if (!editText.trim()) return;
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, text: editText } : c));
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleReplyClick = (commentId: number, userName: string) => {
    setReplyingId(commentId);
    setReplyText(`回复 @${userName} : `);
    setEditingId(null); // Close edit if open
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      user: '刘伟',
      avatar: '刘',
      time: '刚刚',
      text: replyText,
      likes: 0,
      isLiked: false,
      isCurrentUser: true
    };
    // Add reply to top of list for visibility
    setComments([newComment, ...comments]);
    setCommentCount(prev => prev + 1);
    setReplyingId(null);
    setReplyText('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fadeIn pb-24">
      {/* Navigation */}
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition group">
        <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 返回资讯列表
      </button>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
           <span className="px-2 py-0.5 bg-lark-50 text-lark-600 text-xs rounded font-bold">{article.category || '资讯洞察'}</span>
           <span className="text-gray-400 text-xs">|</span>
           <span className="text-gray-500 text-xs">ID: {id}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{article.title}</h1>
        
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-white shadow-sm">
                  {article.author[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{article.author}</div>
                  <div className="text-xs text-gray-500">{article.role}</div>
                </div>
             </div>
             <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
             <div className="flex items-center gap-4 text-xs text-gray-500">
               <span className="flex items-center gap-1"><Calendar size={14} /> {article.date}</span>
               <span className="flex items-center gap-1"><Clock size={14} /> {article.readTime}</span>
               <span className="flex items-center gap-1"><Eye size={14} /> {article.views} 阅读</span>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
             <button className="p-2 text-gray-400 hover:text-lark-600 hover:bg-lark-50 rounded-full transition">
               <Share2 size={20} />
             </button>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="rounded-xl overflow-hidden mb-8 shadow-sm">
        <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover" />
      </div>

      {/* Content */}
      <div 
        className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-12"
        dangerouslySetInnerHTML={{ __html: article.content }}
      ></div>

      {/* Interaction Bar */}
      <div className="flex items-center justify-center gap-6 mb-16">
        <button 
          onClick={handleArticleLike}
          className={`flex flex-col items-center gap-1 px-8 py-3 rounded-full border transition-all duration-300 ${
            isLiked 
              ? 'bg-lark-50 border-lark-200 text-lark-600 shadow-inner' 
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:shadow-sm'
          }`}
        >
          <ThumbsUp size={24} className={isLiked ? 'fill-current' : ''} />
          <span className="text-sm font-medium">{likes} 赞</span>
        </button>
        <button 
          onClick={() => commentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 px-8 py-3 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:shadow-sm transition-all"
        >
          <MessageCircle size={24} />
          <span className="text-sm font-medium">{commentCount} 评论</span>
        </button>
      </div>

      {/* Comments Section */}
      <div ref={commentsRef} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          评论 <span className="text-gray-400 text-sm font-normal">({commentCount})</span>
        </h3>
        
        {/* Comment Input */}
        <div className="flex gap-4 mb-8">
           <div className="w-10 h-10 rounded-full bg-lark-200 flex items-center justify-center text-lark-700 font-bold text-sm shrink-0">
             刘
           </div>
           <div className="flex-1">
             <div className="relative">
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="写下你的想法..." 
                  className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:ring-1 focus:ring-lark-500 outline-none resize-none bg-white text-sm"
                  rows={3}
                ></textarea>
                <button 
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="absolute bottom-3 right-3 p-2 bg-lark-500 text-white rounded-lg hover:bg-lark-600 disabled:bg-gray-200 disabled:cursor-not-allowed transition"
                >
                  <Send size={16} />
                </button>
             </div>
           </div>
        </div>

        {/* Comment List */}
        <div className="space-y-6">
           {comments.map((comment) => (
             <div key={comment.id} className="group">
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 font-medium text-sm shrink-0 shadow-sm">
                   {comment.avatar}
                 </div>
                 <div className="flex-1">
                   
                   {/* Comment Header */}
                   <div className="flex items-center justify-between mb-1">
                     <span className={`font-bold text-sm ${comment.isCurrentUser ? 'text-lark-600' : 'text-gray-900'}`}>
                        {comment.user} {comment.isCurrentUser && '(我)'}
                     </span>
                     <span className="text-xs text-gray-400">{comment.time}</span>
                   </div>

                   {/* Comment Body / Edit Mode */}
                   {editingId === comment.id ? (
                     <div className="mt-1 mb-2">
                        <textarea 
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 border border-lark-300 rounded-lg text-sm focus:ring-1 focus:ring-lark-500 outline-none bg-white mb-2"
                          rows={2}
                        />
                        <div className="flex gap-2 justify-end">
                           <button onClick={handleCancelEdit} className="flex items-center gap-1 px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded">
                             <X size={12} /> 取消
                           </button>
                           <button onClick={() => handleSaveEdit(comment.id)} className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-lark-500 hover:bg-lark-600 rounded">
                             <Check size={12} /> 保存
                           </button>
                        </div>
                     </div>
                   ) : (
                     <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                   )}

                   {/* Comment Actions */}
                   <div className="mt-2 flex items-center gap-4">
                      <button 
                        onClick={() => handleCommentLike(comment.id)}
                        className={`text-xs flex items-center gap-1 transition ${comment.isLiked ? 'text-lark-500 font-medium' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                         <ThumbsUp size={12} className={comment.isLiked ? 'fill-current' : ''} /> {comment.likes || '赞'}
                      </button>
                      <button 
                        onClick={() => handleReplyClick(comment.id, comment.user)}
                        className="text-xs text-gray-400 hover:text-lark-600 flex items-center gap-1 transition"
                      >
                         回复
                      </button>
                      
                      {comment.isCurrentUser && (
                        <>
                          <button 
                            onClick={() => handleEditClick(comment)}
                            className="text-xs text-gray-400 hover:text-blue-600 flex items-center gap-1 transition opacity-0 group-hover:opacity-100"
                          >
                             <Edit2 size={12} /> 编辑
                          </button>
                          <button 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1 transition opacity-0 group-hover:opacity-100"
                          >
                             <Trash2 size={12} /> 删除
                          </button>
                        </>
                      )}
                   </div>

                   {/* Reply Input Box */}
                   {replyingId === comment.id && (
                     <div className="mt-3 flex gap-2 animate-fadeIn">
                       <input 
                         type="text" 
                         autoFocus
                         value={replyText}
                         onChange={(e) => setReplyText(e.target.value)}
                         className="flex-1 px-3 py-2 text-sm border border-lark-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-lark-500"
                       />
                       <button onClick={handleSubmitReply} className="px-3 py-2 bg-lark-500 text-white rounded-lg text-xs hover:bg-lark-600 transition">
                         发送
                       </button>
                       <button onClick={() => setReplyingId(null)} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 transition">
                         取消
                       </button>
                     </div>
                   )}

                 </div>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;