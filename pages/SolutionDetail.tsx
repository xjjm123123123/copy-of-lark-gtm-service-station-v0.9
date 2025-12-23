import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Share2, MessageSquare, Star, Send, TrendingUp, Users, DollarSign, Target, Briefcase, Clock, Zap, Sparkles, Activity, Box, FolderOpen, Heart, CheckCircle2, AlertCircle, ThumbsUp, Edit2, Trash2, StarHalf, Smile, Meh, Frown, FileText, X, ChevronRight, ArrowUpRight, ArrowDownRight, LayoutGrid, FileBarChart, Video, Link as LinkIcon, Layers, ShieldCheck, Globe, Presentation, Mic, File, Trophy, ArrowRight, History, ChevronDown, ChevronUp, Play, BarChart3, PieChart, Tag } from 'lucide-react';
import { Solution, NavTab, RichSolution, EvaluationData } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, Cell, Pie } from 'recharts';

interface SolutionDetailProps {
  solutionId: string;
  onBack: () => void;
  onNavigate?: (tab: NavTab, search?: string) => void;
  onViewReview?: (id: string) => void;
  onCaseClick?: (id: string) => void;
  initialTab?: 'detail' | 'evaluation' | 'market';
  extraRichSolutions?: Record<string, RichSolution>;
  extraEvaluations?: Record<string, EvaluationData>;
}

// --- MOCK DATA IMPORTS (Simulated) ---
// Note: We're reusing types from types.ts but defining initial data here for the static demo.
// In a real app, these would come from an API or store.

// --- STATIC DATA ---
const SOLUTIONS_DATA: Record<string, RichSolution> = {
  '1': {
      id: '1',
      title: '汽车行业智慧研发解决方案',
      description: '针对传统车企研发工具割裂、协同效率低的痛点，基于飞书项目（Meego）打造IPD研发全流程管理平台。实现从需求收集、产品设计、代码开发到测试发布的端到端闭环，帮助车企缩短新车上市周期（TTM）30%以上。',
      author: '张三',
      imageUrl: 'https://picsum.photos/800/400?random=10',
      likes: 245,
      comments: 68,
      favorites: 520,
      date: '2025/12/10',
      industry: 'auto',
      version: 'V3.2',
      tags: {
          industry: ['大制造', '汽车产业链', '整车制造'],
          scene: ['研发设计', '项目管理', '敏捷协同'],
          target: ['研发副总', 'CIO', 'PMO总监'],
          product: ['飞书项目', '飞书文档', 'GitLab集成']
      },
      painPoints: [
        '研发工具烟囱林立，数据流转需人工搬运',
        '跨部门协作（产品、研发、测试）沟通成本高',
        '需求变更频繁，无法追溯影响范围'
      ],
      architecture: [
        '基于飞书项目 (Meego) 的敏捷研发底座',
        '集成 GitLab 代码托管与流水线',
        '云文档知识库实现技术资产沉淀',
        '自动化报表引擎实现效能度量'
      ],
      highlights: [
        'IPD 全流程线上化，需求交付周期缩短 30%',
        '沉淀企业级知识库，新人上手时间减少 50%',
        '自动化报表，实时洞察研发效能瓶颈'
      ],
      competitiveAdvantage: [
        'All-in-One 一站式体验，无需切换多个工具',
        '私有化部署方案成熟，满足车企合规要求',
        '强大的开放API生态，易于集成现有IT系统'
      ],
      versions: [
        {
          version: 'V3.2',
          date: '2025/12/10',
          deck: { title: '汽车IPD解决方案_v3.2.pptx', size: '25 MB' },
          doc: { title: 'Meego落地实施白皮书_v3.2.pdf', size: '12 MB' },
          pitches: [
            { title: '张三的方案讲解 (最新)', author: '张三', duration: '45min' },
            { title: '李四的售前演练', author: '李四', duration: '30min' }
          ]
        },
        {
          version: 'V3.0',
          date: '2025/10/01',
          deck: { title: '汽车IPD解决方案_v3.0.pptx', size: '22 MB' },
          doc: { title: 'Meego落地实施白皮书_v3.0.pdf', size: '10 MB' },
          pitches: [
            { title: '张三的初版讲解', author: '张三', duration: '50min' }
          ]
        },
        {
          version: 'V2.5',
          date: '2025/06/15',
          deck: { title: '汽车研发协同方案_v2.5.pptx', size: '18 MB' },
          doc: { title: '实施手册_v2.5.pdf', size: '8 MB' },
          pitches: []
        }
      ],
      website: { title: '访问飞书汽车行业官网', url: 'https://www.feishu.cn' },
      relatedApps: [
        { id: '3', name: '汽车IPD研发协同平台', type: 'active', linked: true },
        { id: '8', name: '车辆试制管理系统', type: 'active', linked: true },
        { id: '9', name: '研发工时填报助手', type: 'beta', linked: true },
        { id: '10', name: '汽车软件OTA管理平台', type: 'active', linked: true },
        { id: 'x', name: '供应链SRM系统', type: 'active', linked: false } // Not in AppCenter, linking disabled
      ],
      relatedDocs: [
        { id: '1', name: '2025年新能源汽车行业数字化转型白皮书', type: 'report', linked: true },
        { id: '13', name: 'Meego API 对接文档', type: 'tech', linked: true },
        { id: '12', name: '研发流程SOP', type: 'sop', linked: true },
        { id: '17', name: '汽车行业IT架构蓝图_v2.0', type: 'ppt', linked: true },
        { id: '18', name: '研发效能度量指标体系', type: 'excel', linked: true },
        { id: 'temp1', name: '内部保密协议_草稿', type: 'word', linked: false }, // Filter Test: Unlinked
        { id: 'temp2', name: '旧版需求规格说明书', type: 'word', linked: false }  // Filter Test: Unlinked
      ],
      winningCases: [
        {
          id: '1',
          customerName: '未来汽车集团',
          title: '万人研发团队如何实现高效敏捷协同',
          logoUrl: 'https://picsum.photos/48/48?random=1',
          tag: '研发效能 +30%'
        }
      ]
  },
  '2': {
      id: '2',
      title: '消费电子渠道管理方案',
      description: '连接品牌与终端，实时掌握渠道库存与销量。通过多维表格搭建轻量级DMS系统，赋能一线导购，数据自动汇总至总部看板。',
      author: '陈静',
      imageUrl: 'https://picsum.photos/800/400?random=11',
      likes: 180,
      comments: 42,
      favorites: 210,
      date: '2025/12/10',
      industry: 'manufacturing',
      version: 'V1.5',
      tags: {
          industry: ['大制造', '消费电子与家电', '消费电子终端'],
          scene: ['营销服务', '渠道管理', '库存管理'],
          target: ['销售总监', '渠道经理'],
          product: ['多维表格', '飞书应用引擎']
      },
      painPoints: [
        '渠道库存数据滞后，经常出现断货或积压',
        '一线导购不愿意用复杂的传统DMS系统',
        '营销活动落地效果无法实时监控'
      ],
      architecture: [
        '多维表格作为轻量级数据库',
        '飞书应用引擎构建业务逻辑',
        'AnyCross 集成 ERP 与 财务系统',
        '移动端小程序适配一线导购'
      ],
      highlights: [
        '移动端极简录入，一线员工零培训上手',
        '数据实时汇总，库存周转率提升 20%',
        '灵活配置，适应不同层级经销商需求'
      ],
      competitiveAdvantage: [
        '无需开发，极速上线 (Time-to-Market)',
        '移动端体验原生丝滑，员工爱用',
        '总拥有成本 (TCO) 极低'
      ],
      versions: [
        {
          version: 'V1.5',
          date: '2025/12/10',
          deck: { title: '轻量级DMS解决方案.pptx', size: '18 MB' },
          doc: { title: '渠道管理最佳实践.pdf', size: '5 MB' },
          pitches: [
             { title: '陈静的Pitch演练', author: '陈静', duration: '30min' }
          ]
        }
      ],
      website: { title: '消费电子行业案例集', url: '#' },
      relatedApps: [
        { id: '7', name: '消费电子DMS渠道管理', type: 'active', linked: true },
        { id: '4', name: '消费电子智能客服工作台', type: 'beta', linked: true }
      ],
      relatedDocs: [
        { id: '14', name: '消费电子终端门店运营手册', type: 'manual', linked: true },
        { id: '16', name: '应用引擎开发指南', type: 'tech', linked: true }
      ],
      winningCases: [
         {
          id: '2', // Mock, links to CasesPage ID 2 but name is tailored
          customerName: '小米之家',
          title: '连接5000家门店，打造数字化门店管理新范式',
          logoUrl: 'https://picsum.photos/48/48?random=2',
          tag: '巡检效率 +200%'
        }
      ]
  },
  '3': {
      id: '3',
      title: '化工安全隐患排查解决方案',
      description: '本方案针对化工行业安全生产痛点，结合IoT与多维表格，实现隐患“随手拍、自动派、闭环改”的全流程数字化管理。',
      author: '刘伟',
      imageUrl: 'https://picsum.photos/800/400?random=12',
      likes: 124,
      comments: 45,
      favorites: 320,
      date: '2025/12/10',
      industry: 'energy',
      version: 'V2.0',
      tags: {
          industry: ['大制造', '能源与基础材料', '化工'],
          scene: ['生产制造', '安全生产', '隐患治理'],
          target: ['生产总监', '安全总监 (HSE)', '厂长'],
          product: ['多维表格', '飞书机器人', 'AnyCross']
      },
      painPoints: [
        '隐患排查依赖纸质记录，容易丢失且难以追溯',
        '整改流程不透明，常常不了了之',
        '缺乏数据分析，无法识别高频风险点'
      ],
      architecture: [
        'IoT 传感器数据实时接入',
        '飞书机器人消息路由与报警',
        '多维表格隐患台账与分析大屏'
      ],
      highlights: [
        '隐患随手拍，自动触发整改任务',
        'IoT 设备联动，异常情况秒级报警',
        '安全看板实时展示全厂风险热力图'
      ],
      competitiveAdvantage: [
        '软硬一体化集成能力',
        '消息触达率 100%，确保安全无死角',
        '一线员工免培训，降低推广难度'
      ],
      versions: [
        {
          version: 'V2.0',
          date: '2025/12/10',
          deck: { title: '化工安全生产方案.pptx', size: '30 MB' },
          doc: { title: 'HSE管理规范落地指南.pdf', size: '8 MB' },
          pitches: [
             { title: '刘伟的客户沟通录音', author: '刘伟', duration: '60min' }
          ]
        }
      ],
      website: { title: '能源行业官网', url: '#' },
      relatedApps: [
        { id: '1', name: '化工安全生产管理系统', type: 'active', linked: true }
      ],
      relatedDocs: [
        { id: '8', name: '化工行业HSE管理规范', type: 'std', linked: true },
        { id: '9', name: '安全隐患排查标准库', type: 'data', linked: true }
      ],
      winningCases: []
  },
  '4': {
      id: '4',
      title: '互联网行业协同办公最佳实践',
      description: '针对互联网企业跨区域协作难、信息同步慢的痛点，通过飞书文档、会议、妙记的深度融合，打造极致敏捷的协作文化。',
      author: '孙敏',
      imageUrl: 'https://picsum.photos/800/400?random=13',
      likes: 560,
      comments: 88,
      favorites: 420,
      date: '2025/10/15',
      industry: 'tech',
      version: 'V4.0',
      tags: {
          industry: ['互联网', '高科技', '企业服务'],
          scene: ['组织管理', '文化建设', '协同办公'],
          target: ['HRD', 'CEO', 'CIO'],
          product: ['飞书文档', '飞书会议', '飞书妙记']
      },
      painPoints: [
        '会议过多，且效率低下，缺乏结论',
        '文档版本混乱，多人协作冲突频繁',
        '跨时区沟通成本高，信息传递有衰减'
      ],
      architecture: [
        '飞书文档协同编辑与知识沉淀',
        '妙记会议录制与智能转写',
        '多语言实时翻译引擎'
      ],
      highlights: [
        '飞书妙记自动生成会议纪要，回顾效率提升 10 倍',
        '文档即时协同，打造“Context not Control”文化',
        '多语言实时翻译，打破跨国沟通壁垒'
      ],
      competitiveAdvantage: [
        '全球化语言支持能力强',
        '极致的文档协作体验',
        '独特的异步沟通文化赋能'
      ],
      versions: [
        {
          version: 'V4.0',
          date: '2025/10/15',
          deck: { title: '高效协作最佳实践.pdf', size: '10 MB' },
          doc: { title: '敏捷组织转型指南.pdf', size: '15 MB' },
          pitches: [
             { title: '孙敏的全员分享', author: '孙敏', duration: '90min' }
          ]
        }
      ],
      website: { title: '互联网行业案例', url: '#' },
      relatedApps: [],
      relatedDocs: [],
      winningCases: [
        {
          id: '3',
          customerName: 'Global Tech',
          title: '跨国企业的无障碍沟通实践',
          logoUrl: 'https://picsum.photos/48/48?random=3',
          tag: '沟通成本 -40%'
        }
      ]
  },
  '5': {
      id: '5',
      title: '新零售门店数字化巡检',
      description: '面向连锁零售企业，利用飞书多维表格与移动端集成，重构门店巡检流程。督导通过手机即可完成巡检打分、拍照上传。',
      author: '李雷',
      imageUrl: 'https://picsum.photos/800/400?random=14',
      likes: 95,
      comments: 10,
      favorites: 60,
      date: '2025/12/01',
      industry: 'retail',
      version: 'V2.1',
      tags: {
          industry: ['大消费', '零售连锁', '商超便利'],
          scene: ['营销服务', '门店管理', '运营'],
          target: ['运营总监', '店长', '督导'],
          product: ['多维表格', '飞书任务', '集成平台']
      },
      painPoints: [
        '门店SOP执行不到位，品牌形象不统一',
        '巡检报告制作繁琐，数据反馈滞后',
        '优秀门店经验难以快速复制'
      ],
      architecture: [
        '移动端巡检任务分发与执行',
        '拍照水印与定位服务',
        'BI 仪表盘实时分析'
      ],
      highlights: [
        '标准化巡检模板，确保执行不走样',
        '问题自动派单，整改闭环率 100%',
        '门店数据横向对比，激励良性竞争'
      ],
      competitiveAdvantage: [
        '标准化执行 SOP，落地快',
        '数据实时性强，即时反馈',
        '支持大规模门店并发'
      ],
      versions: [
        {
          version: 'V2.1',
          date: '2025/12/01',
          deck: { title: '门店数字化巡检.pptx', size: '22 MB' },
          doc: { title: '连锁门店运营SOP.pdf', size: '6 MB' },
          pitches: [
             { title: '李雷的方案演示', author: '李雷', duration: '20min' }
          ]
        }
      ],
      website: { title: '零售行业官网', url: '#' },
      relatedApps: [
         { id: '6', name: '新零售门店数字化巡检', type: 'active', linked: true }
      ],
      relatedDocs: [
         { id: '6', name: '零售行业门店巡检立项汇报材料', type: 'ppt', linked: true }
      ],
      winningCases: []
  },
  '6': {
      id: '6',
      title: '金融行业合规营销方案',
      description: '针对金融行业严格的合规监管要求，提供基于飞书私有化部署的营销协作方案。在确保数据安全与合规留痕的前提下，打通公域获客与私域运营。',
      author: '周杰',
      imageUrl: 'https://picsum.photos/800/400?random=15',
      likes: 150,
      comments: 40,
      favorites: 110,
      date: '2025/11/30',
      industry: 'finance',
      version: 'V1.2',
      tags: {
          industry: ['金融', '银行业', '股份制'],
          scene: ['营销服务', '私域运营', '客户管理'],
          target: ['营销总监', '合规总监', 'CIO'],
          product: ['飞书IM', '云文档', '私有化部署']
      },
      painPoints: [
        '营销过程难以留痕，存在合规风险',
        '客户资产掌握在理财经理个人手中，离职带走客户',
        '内网办公与外网客户沟通割裂'
      ],
      architecture: [
        '私有化部署架构',
        '企业微信互通网关',
        '合规审计日志系统'
      ],
      highlights: [
        '全流程合规留痕，满足监管审计要求',
        '企业微信互通，沉淀客户资产至公司',
        '私有化部署，确保核心数据绝对安全'
      ],
      competitiveAdvantage: [
        '金融级安全合规标准',
        '公私域流量打通能力',
        '信创国产化适配认证'
      ],
      versions: [
        {
          version: 'V1.2',
          date: '2025/11/30',
          deck: { title: '金融合规营销方案.pptx', size: '40 MB' },
          doc: { title: '私有化部署白皮书.pdf', size: '20 MB' },
          pitches: [
             { title: '周杰的合规路演', author: '周杰', duration: '50min' }
          ]
        }
      ],
      website: { title: '金融行业解决方案', url: '#' },
      relatedApps: [],
      relatedDocs: [
        { id: '3', name: '飞书私有化部署招投标技术参数表', type: 'excel', linked: true }
      ],
      winningCases: []
  }
};

const EVALUATION_DATABASE: Record<string, EvaluationData> = {
  '1': {
    summary: '该方案整体结构严谨，逻辑清晰，准确抓住了汽车行业数字化转型的核心痛点。内容规范性高，对IPD业务流程的理解深入。但在AI技术的具体应用场景上略显保守。',
    highlights: 'IPD流程拆解详尽，落地性强；Meego配置截图真实可信。',
    improvements: '建议补充更多“AI+研发”的前沿实践，如代码自动生成场景。',
    aiDetails: [
      { dimension: '内容规范及完整性', weight: 0.10, score: 95, evaluation: '方案结构完整，包含背景、痛点、解决方案、价值、案例等核心要素。', suggestion: '配图分辨率可提升。' },
      { dimension: '目标客户及故事线', weight: 0.20, score: 88, evaluation: '明确界定了整车制造企业的研发场景，故事线从“工具割裂”痛点切入。', suggestion: '增加CIO视角的价值描述。' },
      { dimension: '业务理解深度与价值', weight: 0.30, score: 92, evaluation: '对IPD流程有深刻理解，准确命中了研发周期长的核心痛点。', suggestion: '可增加关于软件定义汽车（SDV）的策略。' },
      { dimension: '方案创新性及AI含量', weight: 0.15, score: 75, evaluation: '主要聚焦于流程数字化，未充分体现AI在代码生成等环节的应用。', suggestion: '强烈建议补充AI编程助手场景。' },
      { dimension: '竞争优势及防守策略', weight: 0.15, score: 85, evaluation: '有效突出了飞书“All-in-One”的协作优势。', suggestion: '补充私有化部署说明。' },
      { dimension: '市场空间及可复制性', weight: 0.10, score: 90, evaluation: '汽车行业是数字化转型深水区，市场巨大。方案逻辑通用，易于复制。', suggestion: '无。' }
    ],
    hotWords: {
      positive: [{ text: '逻辑清晰', count: 12 }, { text: '落地性强', count: 8 }, { text: '干货满满', count: 6 }],
      neutral: [{ text: '中规中矩', count: 4 }, { text: '图表一般', count: 2 }],
      negative: [{ text: '缺少AI场景', count: 3 }]
    }
  },
  '2': {
    summary: '方案切入点非常精准，利用多维表格低代码特性解决渠道管理难题，具有极高的性价比和推广价值。',
    highlights: '轻量级DMS概念新颖；移动端体验演示生动。',
    improvements: '缺少对大型经销商复杂库存调拨场景的覆盖。',
    aiDetails: [
      { dimension: '内容规范及完整性', score: 90, weight: 0.1, evaluation: '排版精美，逻辑清晰。', suggestion: '无。' },
      { dimension: '目标客户及故事线', score: 92, weight: 0.20, evaluation: '直击销售总监痛点。', suggestion: '强化导购体验。' },
      { dimension: '业务理解深度与价值', score: 85, weight: 0.3, evaluation: '进销存逻辑理解到位。', suggestion: '补充逆向物流。' },
      { dimension: '方案创新性及AI含量', score: 88, weight: 0.15, evaluation: '仪表盘实时呈现非常有吸引力。', suggestion: '结合AI预测销量。' },
      { dimension: '竞争优势及防守策略', score: 82, weight: 0.15, evaluation: '低成本是最大优势。', suggestion: '强调生态粘性。' },
      { dimension: '市场空间及可复制性', score: 95, weight: 0.1, evaluation: '适用范围极广。', suggestion: '快速复制到家电。' }
    ],
    hotWords: {
      positive: [{ text: '上手简单', count: 15 }, { text: '移动端好用', count: 10 }],
      neutral: [{ text: '功能简单', count: 5 }],
      negative: [{ text: '不能对接ERP', count: 4 }]
    }
  }
};

const DEFAULT_EVALUATION: EvaluationData = {
  summary: '该方案结构完整，逻辑自洽，能够较好地解决客户痛点。在业务深度和创新性上表现均衡，是一个标准的合格方案。',
  highlights: '逻辑闭环，文档规范。',
  improvements: '建议进一步挖掘业务场景深度，增加量化价值数据。',
  aiDetails: [
      { dimension: '内容规范及完整性', weight: 0.10, score: 80, evaluation: '符合标准规范。', suggestion: '无。' },
      { dimension: '目标客户及故事线', weight: 0.20, score: 80, evaluation: '目标客户清晰。', suggestion: '故事线可更生动。' },
      { dimension: '业务理解深度与价值', weight: 0.30, score: 75, evaluation: '理解到位。', suggestion: '需增加行业Insight。' },
      { dimension: '方案创新性及AI含量', weight: 0.15, score: 70, evaluation: '传统模式为主。', suggestion: '增加智能化场景。' },
      { dimension: '竞争优势及防守策略', weight: 0.15, score: 75, evaluation: '具备一定优势。', suggestion: '强化差异化。' },
      { dimension: '市场空间及可复制性', weight: 0.10, score: 80, evaluation: '市场空间尚可。', suggestion: '无。' }
  ],
  hotWords: {
      positive: [{ text: '值得参考', count: 5 }],
      neutral: [{ text: '一般', count: 2 }],
      negative: []
  }
};

// --- MARKET DATA Interface ---
interface MarketMetricDetail {
  key: string;
  label: string;
  value: string;
  growth: string;
  growthTrend: 'up' | 'down';
  description: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  historyData: { date: string; value: number }[];
  breakdownData: { name: string; value: string; date: string; status?: string }[];
}

const getMarketData = (solutionId: string): Record<string, MarketMetricDetail> => {
  const base = {
    'asset': {
      key: 'asset', label: 'Asset 业绩基本面', value: '', growth: '', growthTrend: 'up' as const, description: '衡量方案带来的直接财务价值与客户沉淀。', icon: DollarSign, colorClass: 'text-blue-600', bgClass: 'bg-blue-50',
      historyData: [], breakdownData: []
    },
    'momentum': {
      key: 'momentum', label: 'Momentum 市场动能', value: '', growth: '', growthTrend: 'up' as const, description: '反映方案的市场热度与未来潜力。', icon: Activity, colorClass: 'text-green-600', bgClass: 'bg-green-50',
      historyData: [], breakdownData: []
    },
    'efficiency': {
      key: 'efficiency', label: 'Efficiency 转化效率', value: '', growth: '', growthTrend: 'up' as const, description: '衡量销售全链路的流转效率。', icon: Zap, colorClass: 'text-orange-600', bgClass: 'bg-orange-50',
      historyData: [], breakdownData: []
    },
    'innovation': {
      key: 'innovation', label: 'Innovation 创新增长', value: '', growth: '', growthTrend: 'up' as const, description: '评估方案带来的第二增长曲线。', icon: Sparkles, colorClass: 'text-purple-600', bgClass: 'bg-purple-50',
      historyData: [], breakdownData: []
    }
  };

  if (solutionId === '1') { // Auto
    return {
      'asset': { ...base.asset, value: '¥1,200W', growth: '+12%', historyData: [{date:'7月',value:800},{date:'8月',value:850},{date:'9月',value:920},{date:'10月',value:1050},{date:'11月',value:1100},{date:'12月',value:1200}], breakdownData: [{name:'未来汽车',value:'¥300W',date:'11-15'},{name:'长城动力',value:'¥150W',date:'10-20'}] },
      'momentum': { ...base.momentum, value: '342', growth: '+15%', historyData: [{date:'7月',value:120},{date:'12月',value:342}], breakdownData: [{name:'线索转化',value:'210条',date:'本月'},{name:'新增商机',value:'45个',date:'本月'}] },
      'efficiency': { ...base.efficiency, value: '45天', growth: '+5%', historyData: [{date:'7月',value:60},{date:'12月',value:45}], breakdownData: [{name:'线索->商机',value:'14天',date:'平均'}] },
      'innovation': { ...base.innovation, value: '+240%', growth: '+20%', historyData: [{date:'7月',value:20},{date:'12月',value:240}], breakdownData: [{name:'AI Tokens',value:'2.4M',date:'本月'}] }
    };
  } else if (solutionId === '2') { // Consumer Electronics
    return {
      'asset': { ...base.asset, value: '¥850W', growth: '+25%', historyData: [{date:'7月',value:200},{date:'8月',value:300},{date:'9月',value:450},{date:'10月',value:600},{date:'11月',value:720},{date:'12月',value:850}], breakdownData: [{name:'小米之家',value:'¥120W',date:'11-10'},{name:'传音控股',value:'¥90W',date:'10-05'}] },
      'momentum': { ...base.momentum, value: '560', growth: '+30%', historyData: [{date:'7月',value:100},{date:'12月',value:560}], breakdownData: [{name:'新增线索',value:'380条',date:'本月'}] },
      'efficiency': { ...base.efficiency, value: '30天', growth: '+10%', historyData: [{date:'7月',value:50},{date:'12月',value:30}], breakdownData: [{name:'商机->签约',value:'30天',date:'平均'}] },
      'innovation': { ...base.innovation, value: '+120%', growth: '+15%', historyData: [{date:'7月',value:10},{date:'12月',value:120}], breakdownData: [{name:'活跃门店',value:'5000+',date:'本月'}] }
    };
  } else if (solutionId === '3') { // Chemical/Energy
    return {
      'asset': { ...base.asset, value: '¥2,100W', growth: '+8%', historyData: [{date:'7月',value:1500},{date:'12月',value:2100}], breakdownData: [{name:'中石化某厂',value:'¥500W',date:'09-15'}] },
      'momentum': { ...base.momentum, value: '120', growth: '+5%', historyData: [{date:'7月',value:80},{date:'12月',value:120}], breakdownData: [{name:'高意向',value:'15个',date:'本月'}] },
      'efficiency': { ...base.efficiency, value: '90天', growth: '-2%', historyData: [{date:'7月',value:95},{date:'12月',value:90}], breakdownData: [{name:'POC周期',value:'30天',date:'平均'}] },
      'innovation': { ...base.innovation, value: '+50%', growth: '+5%', historyData: [{date:'7月',value:10},{date:'12月',value:50}], breakdownData: [{name:'IoT设备数',value:'10k+',date:'累计'}] }
    };
  }
  return {
    'asset': { ...base.asset, value: '-', growth: '-', historyData: [], breakdownData: [] },
    'momentum': { ...base.momentum, value: '-', growth: '-', historyData: [], breakdownData: [] },
    'efficiency': { ...base.efficiency, value: '-', growth: '-', historyData: [], breakdownData: [] },
    'innovation': { ...base.innovation, value: '-', growth: '-', historyData: [], breakdownData: [] }
  };
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

  const handleClick = () => {
    if (hoverScore !== null) onChange(hoverScore);
  };

  const displayScore = hoverScore !== null ? hoverScore : score;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHoverScore(null)}>
      {[0, 1, 2, 3, 4].map(i => {
        const starValueFull = (i + 1) * 20;
        const starValueHalf = starValueFull - 10;
        
        let icon;
        if (displayScore >= starValueFull) {
           icon = <Star size={24} className="fill-yellow-400 text-yellow-400 transition-colors" />;
        } else if (displayScore >= starValueHalf) {
           icon = <StarHalf size={24} className="fill-yellow-400 text-yellow-400 transition-colors" />;
        } else {
           icon = <Star size={24} className="text-gray-300 transition-colors" />;
        }
        
        return (
           <div 
             key={i} 
             className="cursor-pointer p-0.5"
             onMouseMove={(e) => handleMouseMove(e, i)}
             onClick={handleClick}
           >
             {icon}
           </div> 
        )
      })}
      <span className="ml-3 text-lg font-bold text-yellow-500 min-w-[3rem]">{displayScore}分</span>
    </div>
  )
}

const SolutionDetail: React.FC<SolutionDetailProps> = ({ solutionId, onBack, onNavigate, onViewReview, onCaseClick, initialTab = 'detail', extraRichSolutions = {}, extraEvaluations = {} }) => {
  const [activeTab, setActiveTab] = useState<'detail' | 'evaluation' | 'market'>(initialTab);
  const [detailedMetric, setDetailedMetric] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Update active tab if initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const solution = extraRichSolutions[solutionId] || SOLUTIONS_DATA[solutionId] || SOLUTIONS_DATA['1'];
  const currentEval = extraEvaluations[solutionId] || EVALUATION_DATABASE[solutionId] || DEFAULT_EVALUATION;
  const marketMetrics = useMemo(() => getMarketData(solutionId), [solutionId]);

  const sortedVersions = useMemo(() => solution.versions || [], [solution.versions]);
  const latestVersion = sortedVersions[0];
  const historyVersions = sortedVersions.slice(1);

  // --- Evaluation State ---
  const [currentUser] = useState({ name: '刘伟', avatar: '刘' });
  const [userReviews, setUserReviews] = useState<any[]>([]);
  
  // Interactions
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewScore, setNewReviewScore] = useState(80); // Default 4 stars
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editReviewText, setEditReviewText] = useState('');
  const [editReviewScore, setEditReviewScore] = useState(0);

  useEffect(() => {
    // Mock user reviews based on ID
    // Logic: if new solution (extraSolutions), start with empty reviews
    let initialReviews: any[] = [];
    if (extraRichSolutions[solutionId]) {
        initialReviews = [];
    } else if (solutionId === '1') {
      initialReviews = [
        { 
          id: 1, 
          user: '王建国', 
          avatar: '王', 
          score: 80, 
          comment: '方案很扎实，但是PPT的配色可以再优化一下，客户觉得不够科技感。', 
          date: '2025/12/12', 
          likes: 12, 
          isLiked: false, 
          isCurrentUser: false, 
          replies: [
             { id: 101, user: '张三', text: '收到，下个版本会更新一套深色系模板。', date: '2025/12/12' }
          ] 
        },
        { 
          id: 2, 
          user: 'Sarah Li', 
          avatar: 'S', 
          score: 90, 
          comment: '逻辑非常清晰，IPD流程拆解得很到位，直接拿来就能用。', 
          date: '2025/12/10', 
          likes: 5, 
          isLiked: false, 
          isCurrentUser: false, 
          replies: [] 
        }
      ];
    }
    setUserReviews(initialReviews);
  }, [solutionId, extraRichSolutions]);

  // Calculation Logic with NEW Weighting (50% AI, 50% User)
  const { aiScoreTotal, userScoreAvg, compositeScore, chartData, grade, gradeLabel, gradeColor } = useMemo(() => {
    const aiTotal = currentEval.aiDetails.reduce((acc, item) => acc + (item.score * item.weight), 0);
    // User Score Avg defaults to 60 if no reviews
    const userAvg = userReviews.length > 0 
      ? userReviews.reduce((acc, r) => acc + r.score, 0) / userReviews.length 
      : 60;
    
    // Composite: 50% AI + 50% User
    const finalScore = Math.round((aiTotal * 0.5) + (userAvg * 0.5));
    
    let g = '', label = '', color = '';
    // Grading Scale: S(90+), A(80-89), B(60-79), C(<60)
    if (finalScore >= 90) { g = 'S'; label = '卓越'; color = 'text-purple-600 bg-purple-50 border-purple-200'; } 
    else if (finalScore >= 80) { g = 'A'; label = '优秀'; color = 'text-green-600 bg-green-50 border-green-200'; } 
    else if (finalScore >= 60) { g = 'B'; label = '合格'; color = 'text-blue-600 bg-blue-50 border-blue-200'; } 
    else { g = 'C'; label = '不合格'; color = 'text-red-600 bg-red-50 border-red-200'; }
    
    const cData = currentEval.aiDetails.map(item => ({ subject: item.dimension.slice(0, 4), A: item.score, fullMark: 100 }));
    
    return { 
      aiScoreTotal: Math.round(aiTotal), 
      userScoreAvg: Math.round(userAvg), 
      compositeScore: finalScore, 
      chartData: cData, 
      grade: g, 
      gradeLabel: label, 
      gradeColor: color 
    };
  }, [currentEval, userReviews]);

  const reviewStats = useMemo(() => {
    const total = userReviews.length;
    
    // Simple distribution for now
    const positive = userReviews.filter(r => r.score >= 80).length;
    const neutral = userReviews.filter(r => r.score >= 60 && r.score < 80).length;
    const negative = userReviews.filter(r => r.score < 60).length;

    return { total, positive, neutral, negative };
  }, [userReviews]);

  // --- Render Functions ---
  const renderStars = (score: number, size: number = 14) => {
    // 100 score = 5 stars, 1 star = 20 pts, 0.5 star = 10 pts.
    const full = Math.floor(score / 20);
    const half = (score % 20) >= 10;
    const empty = 5 - full - (half ? 1 : 0);
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(full)].map((_, i) => <Star key={`f-${i}`} size={size} className="fill-yellow-400 text-yellow-400" />)}
            {half && <StarHalf key="h" size={size} className="fill-yellow-400 text-yellow-400" />}
            {[...Array(empty)].map((_, i) => <Star key={`e-${i}`} size={size} className="text-gray-300" />)}
            <span className="ml-2 text-xs text-gray-500 font-mono">{score}分</span>
        </div>
    );
  };

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'report': return <FileText size={16} className="text-red-500" />;
      case 'ppt': return <Presentation size={16} className="text-orange-500" />;
      case 'excel': return <FileBarChart size={16} className="text-green-500" />;
      case 'tech': return <FileText size={16} className="text-blue-500" />;
      case 'sop': return <FileText size={16} className="text-purple-500" />;
      case 'manual': return <FileText size={16} className="text-indigo-500" />;
      case 'std': return <ShieldCheck size={16} className="text-teal-500" />;
      default: return <File size={16} className="text-gray-500" />;
    }
  };

  // Review Actions
  const handleLikeReview = (reviewId: number) => {
     setUserReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, likes: r.isLiked ? r.likes - 1 : r.likes + 1, isLiked: !r.isLiked } : r
     ));
  };

  const handleDeleteReview = (reviewId: number) => {
     if (window.confirm('确定要删除这条评价吗？')) {
        setUserReviews(prev => prev.filter(r => r.id !== reviewId));
     }
  };

  const handleStartEdit = (review: any) => {
     setEditingReviewId(review.id);
     setEditReviewText(review.comment);
     setEditReviewScore(review.score);
     setReplyingTo(null);
  };

  const handleSaveEdit = () => {
     if (!editReviewText.trim()) return;
     setUserReviews(prev => prev.map(r => 
        r.id === editingReviewId ? { ...r, comment: editReviewText, score: editReviewScore } : r
     ));
     setEditingReviewId(null);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditReviewText(''); // Fixed from setEditText
  };

  const handleAddReview = () => {
     if (!newReviewText.trim()) return;
     const newReview: any = {
        id: Date.now(),
        user: currentUser.name,
        avatar: currentUser.avatar,
        score: newReviewScore,
        comment: newReviewText,
        date: '刚刚',
        likes: 0,
        isLiked: false,
        isCurrentUser: true,
        replies: []
     };
     setUserReviews([newReview, ...userReviews]);
     setNewReviewText('');
     setNewReviewScore(80);
  };

  const handleReplySubmit = (reviewId: number) => {
     if (!replyText.trim()) return;
     setUserReviews(prev => prev.map(r => {
        if (r.id === reviewId) {
           return {
              ...r,
              replies: [...r.replies, {
                 id: Date.now(),
                 user: currentUser.name,
                 text: replyText,
                 date: '刚刚'
              }]
           };
        }
        return r;
     }));
     setReplyingTo(null);
     setReplyText('');
  };

  const renderMarketModal = () => {
    if (!detailedMetric) return null;
    const data = marketMetrics[detailedMetric];
    if (!data) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scaleIn" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gray-50/50">
             <div className="flex gap-4">
               <div className={`p-3 rounded-xl ${data.bgClass} ${data.colorClass} shadow-sm`}><data.icon size={24} /></div>
               <div><h3 className="text-lg font-bold text-gray-900">{data.label}</h3><p className="text-sm text-gray-500 mt-1">{data.description}</p></div>
             </div>
             <button onClick={() => setDetailedMetric(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-8">
             <div>
                <div className="flex items-baseline gap-3 mb-4">
                  <div className="text-4xl font-extrabold text-gray-900">{data.value}</div>
                  <div className={`flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded-full ${data.growthTrend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{data.growth}</div>
                </div>
                <div className="h-48 w-full bg-white border border-gray-100 rounded-xl p-2 shadow-sm">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.historyData}><defs><linearGradient id={`c${data.key}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="currentColor" className={data.colorClass} stopOpacity={0.1}/><stop offset="95%" stopColor="currentColor" className={data.colorClass} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" /><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10}} /><YAxis hide domain={['auto', 'auto']} /><Tooltip /><Area type="monotone" dataKey="value" stroke="currentColor" className={data.colorClass} strokeWidth={2} fill={`url(#c${data.key})`} /></AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>
             <div>
                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><Box size={14} /> 数据构成</h4>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                   <table className="w-full text-sm"><thead className="bg-gray-50 border-b border-gray-100 text-gray-500"><tr><th className="px-4 py-3 text-left">名称</th><th className="px-4 py-3 text-right">数值</th><th className="px-4 py-3 text-right">时间</th></tr></thead><tbody className="divide-y divide-gray-50">{data.breakdownData.map((item, idx) => (<tr key={idx}><td className="px-4 py-3 text-gray-800">{item.name}</td><td className={`px-4 py-3 text-right font-bold ${data.colorClass}`}>{item.value}</td><td className="px-4 py-3 text-right text-gray-500 text-xs">{item.date}</td></tr>))}</tbody></table>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVersionCard = (ver: any, isLatest: boolean) => (
    <div className={`rounded-xl overflow-hidden border transition-all duration-300 ${isLatest ? 'bg-white border-lark-100 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
        {/* Version Header */}
        <div className={`px-5 py-3 flex items-center justify-between ${isLatest ? 'bg-lark-50/30' : 'bg-gray-50'} border-b border-gray-100`}>
           <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${isLatest ? 'bg-lark-100 text-lark-700' : 'bg-gray-200 text-gray-600'}`}>
                {ver.version}
              </span>
              <span className="text-xs text-gray-400">更新于 {ver.date}</span>
           </div>
           {isLatest && <span className="text-xs font-medium text-lark-600 bg-white px-2 py-0.5 rounded border border-lark-100 shadow-sm">当前版本</span>}
        </div>

        <div className="p-5">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Documents Group */}
              <div className="lg:col-span-7 space-y-3">
                 <div className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1">核心资料</div>
                 <div className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-lg hover:border-lark-200 hover:shadow-sm transition group cursor-pointer">
                    <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center shrink-0"><Presentation size={20}/></div>
                    <div className="flex-1 overflow-hidden">
                       <div className="text-xs font-bold text-gray-500 mb-0.5">客户胶片</div>
                       <div className="text-sm font-bold text-gray-800 truncate group-hover:text-lark-600 transition">{ver.deck.title}</div>
                       <div className="text-xs text-gray-400 mt-0.5">{ver.deck.size}</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-lg hover:border-lark-200 hover:shadow-sm transition group cursor-pointer">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0"><FileText size={20}/></div>
                    <div className="flex-1 overflow-hidden">
                       <div className="text-xs font-bold text-gray-500 mb-0.5">说明文档</div>
                       <div className="text-sm font-bold text-gray-800 truncate group-hover:text-lark-600 transition">{ver.doc.title}</div>
                       <div className="text-xs text-gray-400 mt-0.5">{ver.doc.size}</div>
                    </div>
                 </div>
              </div>

              {/* Right: Associated Pitches */}
              <div className="lg:col-span-5 bg-gray-50 rounded-lg border border-gray-100 p-4">
                 <div className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-1"><Mic size={14} className="text-purple-500"/> 关联Pitch妙记 ({ver.pitches.length})</div>
                 <div className="space-y-2">
                    {ver.pitches.length > 0 ? ver.pitches.map((p: any, i: number) => (
                       <div key={i} className="flex items-center gap-3 p-2 bg-white rounded border border-gray-100 hover:border-purple-200 hover:shadow-sm cursor-pointer transition group">
                          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                             {p.author?.[0] || 'M'}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="text-xs font-bold text-gray-700 truncate group-hover:text-purple-600 transition">{p.title}</div>
                             <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                               <span>{p.duration}</span> • <span>{p.author}</span>
                             </div>
                          </div>
                          <div className="text-gray-300 group-hover:text-purple-500 transition"><Play size={16} fill="currentColor" /></div>
                       </div>
                    )) : (
                       <div className="text-xs text-gray-400 text-center py-4 italic">暂无关联妙记</div>
                    )}
                 </div>
              </div>
           </div>
        </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn pb-24 relative">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition group">
        <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 返回方案列表
      </button>

      {/* Tabs */}
      <div className="bg-white rounded-t-2xl border-b border-gray-100 px-8 pt-2 flex gap-8 overflow-x-auto shadow-sm z-10 relative">
        <button onClick={() => setActiveTab('detail')} className={`py-4 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'detail' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>方案详情</button>
        <button onClick={() => setActiveTab('evaluation')} className={`py-4 text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1 ${activeTab === 'evaluation' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>质量评价 (二期) <span className="bg-lark-100 text-lark-600 text-[10px] px-1.5 py-0.5 rounded-full font-normal">AI Powered</span></button>
        <button onClick={() => setActiveTab('market')} className={`py-4 text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1 ${activeTab === 'market' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>市场表现 (三期) <span className="bg-gradient-to-r from-lark-500 to-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-normal shadow-sm">New</span></button>
      </div>

      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 border-t-0 p-8 min-h-[600px]">
        
        {/* --- DETAIL TAB --- */}
        {activeTab === 'detail' && (
          <div className="space-y-10 animate-fadeIn">
             {/* Header */}
             <div className="flex flex-col lg:flex-row gap-10">
              <div className="w-full lg:w-[480px] shrink-0">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-gray-100 group relative">
                  <img src={solution.imageUrl} alt={solution.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm border border-gray-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>{solution.version}
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-lark-50 text-lark-600 px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-lark-100">场景解决方案</span>
                  <div className="flex items-center gap-3">
                     {solution.website?.url && (
                        <>
                          <a 
                            href={solution.website.url} 
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-lark-600 hover:text-lark-700 flex items-center gap-1.5 hover:underline transition"
                          >
                             <Globe size={16} /> 访问官网
                          </a>
                          <div className="w-px h-4 bg-gray-300 mx-1"></div>
                        </>
                     )}
                     <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-lark-600 hover:bg-gray-50 rounded-full transition"><Share2 size={18} /></button>
                        <button className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition"><Star size={18} /></button>
                     </div>
                  </div>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6 leading-tight">{solution.title}</h1>
                <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-100 text-sm">
                  <div className="flex items-center gap-3 pr-6 border-r border-gray-100">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lark-400 to-lark-600 p-[2px]"><div className="w-full h-full rounded-full bg-white flex items-center justify-center text-lark-600 font-bold text-xs">{solution.author[0]}</div></div>
                    <div><div className="font-bold text-gray-900">{solution.author}</div><div className="text-xs text-gray-400">方案 Owner</div></div>
                  </div>
                  <div className="flex items-center gap-6 text-gray-500">
                    <div className="flex items-center gap-1.5"><Clock size={16} /><span>{solution.date}</span></div>
                    <div className="flex items-center gap-1.5"><Activity size={16} className="text-orange-400" /><span className="font-medium text-gray-700">856</span> 热度</div>
                    <div className="flex items-center gap-1.5"><Heart size={16} className="text-red-400" /><span className="font-medium text-gray-700">{solution.likes}</span></div>
                  </div>
                </div>
                <div className="mt-auto bg-gradient-to-r from-lark-50/80 to-white rounded-xl p-5 border border-lark-100 relative group">
                   <div className="absolute -left-1 top-5 bottom-5 w-1 bg-lark-400 rounded-r opacity-50"></div>
                   <div className="flex items-center gap-2 mb-2"><Sparkles size={14} className="text-lark-500" /><span className="text-xs font-bold text-lark-700">AI 方案摘要</span></div>
                   <p className="text-gray-600 text-sm leading-relaxed">{solution.description}</p>
                </div>
              </div>
            </div>

            {/* MOVED UP: 方案定位 */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Target size={14} /> 方案定位</h3>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <div className="space-y-2"><span className="text-xs font-semibold text-gray-500 flex items-center gap-1"><Briefcase size={12}/> 适用行业</span><div className="flex items-center gap-2 flex-wrap">{solution.tags?.industry.map(t=>(<span key={t} className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 shadow-sm">{t}</span>))}</div></div>
                  <div className="space-y-2"><span className="text-xs font-semibold text-gray-500 flex items-center gap-1"><LayoutGrid size={12}/> 业务场景</span><div className="flex items-center gap-2 flex-wrap">{solution.tags?.scene.map(t=>(<span key={t} className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 shadow-sm">{t}</span>))}</div></div>
                  <div className="space-y-2"><span className="text-xs font-semibold text-gray-500 flex items-center gap-1"><Users size={12}/> 关键角色</span><div className="flex items-center gap-2 flex-wrap">{solution.tags?.target.map(t=>(<span key={t} className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 shadow-sm">{t}</span>))}</div></div>
                  <div className="space-y-2"><span className="text-xs font-semibold text-gray-500 flex items-center gap-1"><Box size={12}/> 涉及产品</span><div className="flex items-center gap-2 flex-wrap">{solution.tags?.product.map(t=>(<span key={t} className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 shadow-sm">{t}</span>))}</div></div>
              </div>
            </div>
             
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* 业务痛点 */}
               <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col h-full">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Target className="text-red-500" size={20} /> 业务痛点</h3>
                  <ul className="space-y-3 flex-1">
                    {solution.painPoints && solution.painPoints.length > 0 ? solution.painPoints.map((point, i) => (
                      <li key={i} className="flex gap-3 items-start text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0"></div>
                        <span>{point}</span>
                      </li>
                    )) : ( <li className="text-gray-400 text-sm">暂无描述</li> )}
                  </ul>
               </div>

               {/* 方案架构 (New) */}
               <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col h-full">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Layers className="text-blue-500" size={20} /> 方案架构</h3>
                  <ul className="space-y-3 flex-1">
                    {solution.architecture && solution.architecture.length > 0 ? solution.architecture.map((point, i) => (
                      <li key={i} className="flex gap-3 items-start text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></div>
                        <span>{point}</span>
                      </li>
                    )) : ( <li className="text-gray-400 text-sm">暂无架构描述</li> )}
                  </ul>
               </div>

               {/* 价值成效 (Renamed from Highlights) */}
               <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col h-full">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp className="text-green-500" size={20} /> 价值成效</h3>
                  <ul className="space-y-3 flex-1">
                    {solution.highlights && solution.highlights.length > 0 ? solution.highlights.map((point, i) => (
                      <li key={i} className="flex gap-3 items-start text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 shrink-0"></div>
                        <span>{point}</span>
                      </li>
                    )) : ( <li className="text-gray-400 text-sm">暂无描述</li> )}
                  </ul>
               </div>

               {/* 竞争优势 (New) */}
               <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col h-full">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Trophy className="text-purple-500" size={20} /> 竞争优势</h3>
                  <ul className="space-y-3 flex-1">
                    {solution.competitiveAdvantage && solution.competitiveAdvantage.length > 0 ? solution.competitiveAdvantage.map((point, i) => (
                      <li key={i} className="flex gap-3 items-start text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0"></div>
                        <span>{point}</span>
                      </li>
                    )) : ( <li className="text-gray-400 text-sm">暂无优势描述</li> )}
                  </ul>
               </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><FolderOpen className="text-lark-500" /> 资料查阅</h3>
                
                {latestVersion ? (
                  <div className="space-y-4">
                    {renderVersionCard(latestVersion, true)}
                    {historyVersions.length > 0 && (
                      <div className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
                         <button 
                           onClick={() => setShowHistory(!showHistory)}
                           className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                         >
                            <span className="flex items-center gap-2"><History size={16}/> 历史版本 ({historyVersions.length})</span>
                            {showHistory ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                         </button>
                         {showHistory && (
                           <div className="p-4 space-y-4 border-t border-gray-100 animate-fadeIn">
                              {historyVersions.map((ver, idx) => (
                                 <div key={idx}>
                                    {renderVersionCard(ver, false)}
                                 </div>
                              ))}
                           </div>
                         )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                     暂无资料
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                                <Box size={16} className="text-lark-500"/> 相关应用
                            </h4>
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                {solution.relatedApps?.filter(a => a.linked).length || 0}
                            </span>
                        </div>
                        <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar max-h-[300px]">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                           {solution.relatedApps?.filter(a => a.linked).length > 0 ? (
                             solution.relatedApps.filter(a => a.linked).map((app, i) => (
                               <div 
                                 key={i} 
                                 onClick={() => onNavigate && onNavigate(NavTab.APP_CENTER, app.name)}
                                 className="group relative p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-white hover:border-lark-200 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col gap-3"
                               >
                                  <div className="flex justify-between items-start">
                                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                                          app.type === 'active' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                                      }`}>
                                         {app.type === 'active' ? <Zap size={18} fill="currentColor" /> : <Sparkles size={18} />}
                                      </div>
                                      <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                                          app.type === 'active' 
                                            ? 'bg-green-50 text-green-600 border-green-100' 
                                            : 'bg-purple-50 text-purple-600 border-purple-100'
                                      }`}>
                                          {app.type === 'active' ? 'ONLINE' : 'BETA'}
                                      </div>
                                  </div>
                                  <div>
                                     <h5 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-lark-600 transition-colors line-clamp-2 mb-1">
                                         {app.name}
                                     </h5>
                                     <div className="flex items-center gap-1 text-[10px] text-gray-400 group-hover:text-lark-400 transition-colors">
                                        <span>点击体验 Demo</span>
                                        <ArrowRight size={10} />
                                     </div>
                                  </div>
                               </div>
                             ))
                           ) : (
                             <div className="col-span-full py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                                <Box size={24} className="mb-2 opacity-20" />
                                <span className="text-xs">暂无关联应用</span>
                             </div>
                           )}
                           </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide"><FileText size={16} className="text-gray-400"/> 相关文档</h4>
                         <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                           {solution.relatedDocs?.filter(d => d.linked).length > 0 ? (
                             solution.relatedDocs.filter(d => d.linked).map((doc, i) => (
                               <div 
                                 key={i} 
                                 onClick={() => onNavigate && onNavigate(NavTab.RESOURCES, doc.name)}
                                 className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-gray-50 cursor-pointer group transition"
                               >
                                  <div className="flex items-center gap-3 overflow-hidden">
                                     <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gray-50 border border-gray-100">
                                         {getDocIcon(doc.type)}
                                     </div>
                                     <span className="text-sm font-medium truncate text-gray-700 group-hover:text-lark-600">
                                         {doc.name}
                                     </span>
                                  </div>
                                  <ArrowUpRight size={14} className="text-gray-300 group-hover:text-lark-500" />
                               </div>
                             ))
                           ) : (
                             <div className="text-sm text-gray-400 py-4 text-center">暂无关联文档</div>
                           )}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* --- EVALUATION TAB --- */}
        {activeTab === 'evaluation' && (
          <div className="animate-fadeIn space-y-8">
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex-1">
                 <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
                   <Sparkles className="text-lark-500 fill-lark-50" size={20} /> 方案综合质量评价
                 </h3>
                 <p className="text-sm text-gray-500 leading-relaxed">
                   方案综合得分由AI 智能评分 (50%权重) 与用户评分均分 (50%权重) 加权计算得出。当没有用户评价时，用户评价均分默认为60分。
                 </p>
               </div>
               
               <div className="flex items-center gap-6">
                  {/* Breakdown Stats */}
                  <div className="flex gap-4 text-center mr-2 bg-white/60 px-4 py-2 rounded-lg border border-indigo-50/50 backdrop-blur-sm">
                    <div>
                       <div className="text-lg font-bold text-gray-700">{aiScoreTotal}</div>
                       <div className="text-[10px] text-gray-400 uppercase font-medium">AI 评分</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div>
                       <div className="text-lg font-bold text-gray-700">{userScoreAvg}</div>
                       <div className="text-[10px] text-gray-400 uppercase font-medium">用户评分</div>
                    </div>
                  </div>

                  {/* Grade Display */}
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl ${gradeColor} flex items-center justify-center text-4xl font-extrabold border-2 shadow-sm`}>
                      {grade}
                    </div>
                    <span className={`text-xs font-bold mt-1.5 px-2 py-0.5 rounded-full ${gradeColor.replace('text-4xl', '')} border`}>
                      {gradeLabel}
                    </span>
                  </div>
                  
                  <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
                  
                  {/* Composite Score */}
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lark-600 to-purple-600">
                      {compositeScore}
                    </div>
                    <div className="text-xs font-bold text-gray-600 mt-1 uppercase">综合得分</div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                   <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Sparkles size={16} className="text-yellow-500" /> 评价综述</h4>
                   <p className="text-gray-600 text-sm bg-lark-50/50 p-5 rounded-lg border border-lark-100 leading-relaxed mb-6">{currentEval.summary}</p>
                   
                   <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 bg-green-50 p-4 rounded-lg border border-green-100">
                         <h5 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
                           <CheckCircle2 size={14} /> 亮点
                         </h5>
                         <p className="text-xs text-green-800 leading-relaxed whitespace-pre-wrap">{currentEval.highlights}</p>
                      </div>
                      <div className="flex-1 bg-orange-50 p-4 rounded-lg border border-orange-100">
                         <h5 className="text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
                           <AlertCircle size={14} /> 待改进
                         </h5>
                         <p className="text-xs text-orange-800 leading-relaxed whitespace-pre-wrap">{currentEval.improvements}</p>
                      </div>
                   </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 h-80 lg:h-auto">
                   <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                         <PolarGrid />
                         <PolarAngleAxis dataKey="subject" tick={{fontSize: 10}} />
                         <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                         <Radar name="得分" dataKey="A" stroke="#3370ff" fill="#3370ff" fillOpacity={0.4} />
                         <Tooltip />
                      </RadarChart>
                   </ResponsiveContainer>
                </div>
            </div>

            {/* DETAILED SCORE TABLE - Updated with Weights */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
               <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                 <h4 className="font-bold text-gray-800 text-sm">详细得分表</h4>
                 <div className="text-xs text-gray-500">AI 总分: <span className="font-bold text-lark-600">{aiScoreTotal}</span></div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                     <tr>
                       <th className="px-6 py-3 w-40 text-left">评价维度</th>
                       <th className="px-4 py-3 w-20 text-center">权重</th>
                       <th className="px-4 py-3 w-20 text-center">得分</th>
                       <th className="px-6 py-3 text-left">AI 评价详情</th>
                       <th className="px-6 py-3 text-left">优化建议</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                     {currentEval.aiDetails.map((item, idx) => (
                       <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                         <td className="px-6 py-4 font-medium text-gray-800">{item.dimension}</td>
                         <td className="px-4 py-4 text-center text-gray-500 bg-gray-50/30 font-mono text-xs">{Math.round(item.weight * 100)}%</td>
                         <td className="px-4 py-4 text-center font-bold text-lark-600">{item.score}</td>
                         <td className="px-6 py-4 text-gray-600 min-w-[200px]">{item.evaluation}</td>
                         <td className="px-6 py-4 text-orange-600 min-w-[200px]">{item.suggestion}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* NEW: USER REVIEW OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Dashboard Stats */}
               <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="font-bold text-gray-800 flex items-center gap-2"><BarChart3 size={18} className="text-lark-500"/> 用户评价概览</h3>
                     <span className="text-xs text-gray-400">共 {reviewStats.total} 条评价</span>
                  </div>
                  <div className="space-y-4">
                     {/* Positive */}
                     <div className="flex items-center gap-4">
                        <div className="w-16 text-xs font-medium text-gray-600 flex items-center gap-1"><Smile size={14} className="text-green-500"/> 好评</div>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-green-500 rounded-full" style={{ width: `${reviewStats.total ? (reviewStats.positive / reviewStats.total) * 100 : 0}%` }}></div>
                        </div>
                        <div className="w-8 text-xs text-gray-500 text-right">{reviewStats.positive}</div>
                     </div>
                     {/* Neutral */}
                     <div className="flex items-center gap-4">
                        <div className="w-16 text-xs font-medium text-gray-600 flex items-center gap-1"><Meh size={14} className="text-yellow-500"/> 中评</div>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${reviewStats.total ? (reviewStats.neutral / reviewStats.total) * 100 : 0}%` }}></div>
                        </div>
                        <div className="w-8 text-xs text-gray-500 text-right">{reviewStats.neutral}</div>
                     </div>
                     {/* Negative */}
                     <div className="flex items-center gap-4">
                        <div className="w-16 text-xs font-medium text-gray-600 flex items-center gap-1"><Frown size={14} className="text-red-500"/> 差评</div>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-red-500 rounded-full" style={{ width: `${reviewStats.total ? (reviewStats.negative / reviewStats.total) * 100 : 0}%` }}></div>
                        </div>
                        <div className="w-8 text-xs text-gray-500 text-right">{reviewStats.negative}</div>
                     </div>
                  </div>
               </div>

               {/* Tags Cloud */}
               <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4"><Tag size={18} className="text-blue-500"/> 评价热词</h3>
                  <div className="flex flex-wrap gap-2">
                     {currentEval.hotWords.positive.map((tag, idx) => (
                        <span key={`p-${idx}`} className="px-3 py-1.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-100 font-medium">
                           {tag.text} <span className="opacity-60 ml-1">{tag.count}</span>
                        </span>
                     ))}
                     {currentEval.hotWords.neutral.map((tag, idx) => (
                        <span key={`n-${idx}`} className="px-3 py-1.5 bg-yellow-50 text-yellow-700 text-xs rounded-full border border-yellow-100 font-medium">
                           {tag.text} <span className="opacity-60 ml-1">{tag.count}</span>
                        </span>
                     ))}
                     {currentEval.hotWords.negative.map((tag, idx) => (
                        <span key={`neg-${idx}`} className="px-3 py-1.5 bg-red-50 text-red-700 text-xs rounded-full border border-red-100 font-medium">
                           {tag.text} <span className="opacity-60 ml-1">{tag.count}</span>
                        </span>
                     ))}
                     {(!currentEval.hotWords.positive.length && !currentEval.hotWords.neutral.length) && (
                        <span className="text-gray-400 text-xs">暂无热词</span>
                     )}
                  </div>
               </div>
            </div>
            
            {/* USER REVIEWS SECTION */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                   <h3 className="font-bold text-gray-800 flex items-center gap-2">精选评价 <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">{userReviews.length} / {solution.comments}</span></h3>
                </div>
                
                {/* Add Review Input */}
                <div className="p-6 bg-gray-50 border-b border-gray-100">
                    <div className="flex gap-4">
                       <div className="w-10 h-10 rounded-full bg-lark-100 flex items-center justify-center text-lark-600 font-bold text-sm shrink-0">{currentUser.avatar}</div>
                       <div className="flex-1">
                          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm focus-within:ring-1 focus-within:ring-lark-500 transition">
                             <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-3">
                                <span className="text-sm font-bold text-gray-700">发表评价</span>
                                {/* New Interactive Star Input */}
                                <StarRatingInput score={newReviewScore} onChange={setNewReviewScore} />
                             </div>
                             <textarea 
                               value={newReviewText} 
                               onChange={(e) => setNewReviewText(e.target.value)}
                               placeholder="写下你的想法..." 
                               className="w-full text-sm outline-none resize-none text-gray-700 placeholder:text-gray-400"
                               rows={3}
                             />
                             <div className="flex justify-end mt-2">
                                <button 
                                  onClick={handleAddReview} 
                                  disabled={!newReviewText.trim()}
                                  className="px-4 py-1.5 bg-lark-500 text-white text-xs font-bold rounded-lg hover:bg-lark-600 disabled:bg-gray-200 disabled:cursor-not-allowed transition"
                                >
                                   发布评价
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-50">
                   {userReviews.map((review) => (
                      <div key={review.id} className="p-6 hover:bg-gray-50/50 transition group">
                         <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0 border border-white shadow-sm">{review.avatar}</div>
                            <div className="flex-1"> 
                               <div className="flex justify-between items-start mb-1">
                                  <div>
                                     <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-gray-900">{review.user}</span>
                                        {review.isCurrentUser && <span className="text-[10px] bg-lark-50 text-lark-600 px-1.5 rounded border border-lark-100">我</span>}
                                     </div>
                                     <div className="flex items-center gap-2 mt-1">
                                        {renderStars(review.score, 12)}
                                        <span className="text-xs text-gray-400 ml-2">{review.date}</span>
                                     </div>
                                  </div>
                                  
                                  {/* Review Actions: Edit/Delete for self */}
                                  {review.isCurrentUser && (
                                     <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                        <button onClick={() => handleStartEdit(review)} className="p-1.5 text-gray-400 hover:text-lark-600 hover:bg-lark-50 rounded transition" title="编辑"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDeleteReview(review.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition" title="删除"><Trash2 size={14} /></button>
                                     </div>
                                  )}
                               </div> 
                               
                               {/* Edit Mode vs View Mode */}
                               {editingReviewId === review.id ? (
                                  <div className="mt-2 bg-white border border-lark-200 rounded-lg p-3 shadow-sm">
                                     <div className="flex items-center gap-4 mb-2">
                                        <StarRatingInput score={editReviewScore} onChange={setEditReviewScore} />
                                     </div>
                                     <textarea 
                                        value={editReviewText} 
                                        onChange={(e) => setEditReviewText(e.target.value)} 
                                        className="w-full text-sm border border-gray-200 rounded p-2 focus:border-lark-500 outline-none" 
                                        rows={2}
                                     />
                                     <div className="flex justify-end gap-2 mt-2">
                                        <button onClick={() => setEditingReviewId(null)} className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded">取消</button>
                                        <button onClick={handleSaveEdit} className="px-3 py-1 text-xs bg-lark-500 text-white rounded hover:bg-lark-600">保存</button>
                                     </div>
                                  </div>
                               ) : (
                                  <p className="text-gray-700 text-sm mt-2 leading-relaxed">{review.comment}</p>
                               )}
                               
                               {/* Action Bar */}
                               <div className="flex items-center gap-6 mt-3">
                                  <button onClick={() => handleLikeReview(review.id)} className={`text-xs flex items-center gap-1 transition ${review.isLiked ? 'text-lark-600 font-medium' : 'text-gray-400 hover:text-gray-600'}`}>
                                     <ThumbsUp size={14} className={review.isLiked ? 'fill-current' : ''} /> {review.likes || '赞'}
                                  </button>
                                  <button onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)} className="text-xs flex items-center gap-1 text-gray-400 hover:text-lark-600 transition">
                                     <MessageSquare size={14} /> 回复
                                  </button>
                               </div>

                               {/* Replies Section */}
                               {(review.replies.length > 0 || replyingTo === review.id) && (
                                  <div className="mt-4 bg-gray-50 rounded-lg p-3 space-y-3">
                                     {review.replies.map((reply: any) => (
                                        <div key={reply.id} className="flex gap-2 text-sm">
                                           <span className="font-bold text-gray-700 shrink-0">{reply.user}:</span>
                                           <span className="text-gray-600">{reply.text}</span>
                                        </div>
                                     ))}
                                     
                                     {/* Reply Input */}
                                     {replyingTo === review.id && (
                                        <div className="flex gap-2 mt-2 animate-fadeIn">
                                           <input 
                                             type="text" 
                                             autoFocus
                                             value={replyText}
                                             onChange={(e) => setReplyText(e.target.value)}
                                             placeholder={`回复 @${review.user}...`}
                                             className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:border-lark-500 outline-none"
                                           />
                                           <button onClick={() => handleReplySubmit(review.id)} className="px-3 py-1.5 bg-lark-500 text-white text-xs rounded-md hover:bg-lark-600">发送</button>
                                        </div>
                                     )}
                                  </div>
                               )}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
            </div>
          </div>
        )}

        {/* --- MARKET TAB --- */}
        {activeTab === 'market' && (
          <div className="space-y-8 animate-fadeIn">
             <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">AMEI 市场表现模型</h2><p className="text-gray-500 text-sm mt-1">从资产、动能、效率、创新四个维度全方位评估方案的市场生命力</p></div><div className="text-xs text-gray-400">数据更新于: 2025-12-12</div></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['asset', 'momentum', 'efficiency', 'innovation'].map(key => {
                   const data = marketMetrics[key];
                   if (!data) return null;
                   return (
                    <div key={key} onClick={() => setDetailedMetric(key)} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm relative overflow-hidden group hover:border-gray-300 transition cursor-pointer">
                       <div className={`absolute top-0 right-0 w-24 h-24 ${data.bgClass} rounded-bl-full -mr-4 -mt-4 transition opacity-50 group-hover:opacity-80`}></div>
                       <div className="absolute bottom-3 right-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-xs flex items-center gap-1">查看详情 <ChevronRight size={14} /></span></div>
                       <div className="relative z-10"><div className="flex items-center gap-2 mb-6"><div className={`p-2 ${data.bgClass} ${data.colorClass} rounded-lg`}><data.icon size={20} /></div><h3 className="font-bold text-gray-800">{data.label}</h3></div><div className="mb-4"><div className="text-3xl font-extrabold text-gray-900 mb-1">{data.value}</div><div className={`text-xs font-bold flex items-center gap-1 ${data.growthTrend === 'up' ? 'text-green-600' : 'text-red-500'}`}>{data.growth}</div></div><div className="h-12 w-full opacity-60"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.historyData}><defs><linearGradient id={`grad${key}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" className={data.colorClass} stopOpacity={0.2}/><stop offset="100%" stopColor="currentColor" className={data.colorClass} stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="value" stroke="currentColor" className={data.colorClass} strokeWidth={2} fill={`url(#grad${key})`} /></AreaChart></ResponsiveContainer></div></div>
                    </div>
                   );
                })}
             </div>

             <div className="space-y-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Trophy className="text-yellow-500" /> 市场赢单案例</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {solution.winningCases && solution.winningCases.length > 0 ? solution.winningCases.map((item, i) => (
                      <div 
                        key={i}
                        onClick={() => onCaseClick && onCaseClick(item.id)}
                        className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                      >
                         <div className="flex items-center gap-3 mb-3">
                            <img src={item.logoUrl} alt={item.customerName} className="w-8 h-8 rounded-full border border-gray-100 bg-white" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{item.customerName}</span>
                         </div>
                         <h4 className="font-bold text-gray-800 mb-3 group-hover:text-lark-600 transition leading-snug">{item.title}</h4>
                         <div className="flex items-center justify-between mt-auto">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 text-xs font-medium border border-yellow-100">
                               <CheckCircle2 size={12} className="mr-1" /> {item.tag}
                            </span>
                            <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-lark-50 group-hover:text-lark-500 transition-colors">
                               <ArrowRight size={14} />
                            </div>
                         </div>
                      </div>
                   )) : (
                      <div className="col-span-full py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                         <Trophy size={24} className="mx-auto text-gray-300 mb-2" />
                         <span className="text-sm text-gray-400">暂无关联赢单案例</span>
                      </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>
      {renderMarketModal()}
    </div>
  );
};

export default SolutionDetail;