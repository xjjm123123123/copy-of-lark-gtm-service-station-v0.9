
export interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  imageUrl: string;
  likes: number;
  comments: number;
  date: string;
  isLiked?: boolean;
}

export interface ResearchArticle {
  id: string;
  title: string;
  summary: string;
  author: string;
  sourceType: 'original' | 'external';
  sourceName?: string;
  category: string;
  industry: string;
  imageUrl: string;
  date: string;
  views: number;
  likes: number;
  favorites: number;
  comments: number;
  tags: string[];
  isLiked?: boolean;
  isFavorited?: boolean;
}

export interface ArticleContent {
  title: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  views: string;
  imageUrl: string;
  content: string;
  category?: string;
  initialLikes: number;
  initialCommentsCount: number;
}

export interface TagStructure {
  industry: string[];
  scene: string[];
  target: string[];
  product: string[];
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  author: string;
  imageUrl: string;
  likes: number;
  comments: number;
  favorites: number;
  date: string;
  industry: string;
  version?: string;
  tags?: TagStructure;
  isLiked?: boolean;
  isFavorited?: boolean;
  metrics?: {
    contentScore: number;
    clarityScore: number;
    depthScore: number;
    valueScore: number;
    visualScore: number;
  }
}

// --- Enhanced Solution Types ---

export interface MaterialItem {
  title: string;
  size?: string;
  duration?: string;
  author?: string;
  link?: string; // Added link support
}

export interface SolutionVersion {
  version: string;
  date: string;
  deck: MaterialItem;
  doc: MaterialItem;
  pitches: MaterialItem[];
}

export interface RichSolution extends Solution {
  highlights: string[];
  painPoints: string[];
  architecture?: string[];
  competitiveAdvantage?: string[];
  architectureImg?: string;
  versions?: SolutionVersion[];
  website?: { title: string; url: string };
  relatedApps?: { id: string; name: string; type: 'active' | 'beta'; linked?: boolean }[];
  relatedDocs?: { id: string; name: string; type: string; linked?: boolean }[];
  winningCases?: { id: string; title: string; customerName: string; logoUrl: string; tag: string }[];
}

export interface AIDimension {
  dimension: string;
  weight: number;
  score: number;
  evaluation: string;
  suggestion: string;
}

export interface EvaluationData {
  summary: string;
  highlights: string;
  improvements: string;
  aiDetails: AIDimension[];
  hotWords: {
    positive: { text: string; count: number }[];
    neutral: { text: string; count: number }[];
    negative: { text: string; count: number }[];
  };
}

export interface DemoApp {
  id: string;
  name: string;
  description: string;
  industry: string;
  status: 'active' | 'beta';
  launchUrl: string;
  iconBgColor: string;
  iconColor: string;
  iconType: 'shield' | 'car' | 'cpu' | 'headset' | 'factory' | 'shopping'; 
  tags?: TagStructure;
  updateDate?: string;
  heat?: number;
  likes?: number;
  favorites?: number;
  comments?: number;
  isLiked?: boolean;
  isFavorited?: boolean;
}

// --- AI Hub Types ---
export interface AIAgent {
  id: string;
  name: string;
  description: string;
  platform: 'Coze' | 'Aily' | 'LarkBase' | 'Meego' | 'aPaaS' | 'Other';
  model: string; // e.g. GPT-4, Gemini 1.5, Claude 3.5
  capabilities: string[];
  iconUrl?: string; // Optional custom icon
  author: string;
  updateDate: string;
  heat: number;
  likes: number;
  favorites: number;
  comments: number;
  isLiked?: boolean;
  isFavorited?: boolean;
  tags?: {
    businessCategories: string[]; // e.g. ["洞察行业-行业资讯", "客户分析-一客一档"]
    // Deprecated but kept for compatibility in other parts if needed
    industry?: string[];
    scene?: string[];
  };
  launchUrl: string;
  // Detail specific
  promptExample?: string;
  integration?: string;
}

export interface CaseStudy {
  id: string;
  customerName: string;
  title: string;
  industry: string;
  logoUrl: string;
  coverUrl: string;
  summary: string;
  metrics: { label: string; value: string; trend: 'up' | 'down' }[];
  tags: TagStructure;
  author: string;
  date: string;
  heat?: number;
  likes?: number;
  favorites?: number;
  comments?: number;
  isLiked?: boolean;
  isFavorited?: boolean;
}

export interface ProjectReview {
  id: string;
  projectName: string;
  result: 'won' | 'lost';
  amount: string;
  competitor: string;
  reason: string;
  industry: string;
  owner: string;
  date: string;
  tags: string[];
  scores?: {
    product: number;
    price: number;
    service: number;
    relationship: number;
    brand: number;
  }
  likes?: number;
  favorites?: number;
  comments?: number;
  isLiked?: boolean;
  isFavorited?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  category: 'report' | 'pitch' | 'initiation' | 'bidding' | 'single_source' | 'qualification';
  fileType: 'pdf' | 'ppt' | 'word' | 'excel' | 'zip';
  size: string;
  industry: string;
  tags: string[];
  uploader: string;
  updateDate: string;
  downloads: number;
  likes: number;
  views?: number;
  favorites?: number;
  comments?: number;
  isLiked?: boolean;
  isFavorited?: boolean;
}

export interface RecommendationItem {
  id: string;
  type: 'solution' | 'case' | 'app' | 'review' | 'resource' | 'article' | 'ai_agent';
  title: string;
  desc?: string;
  tag?: string;
}

export interface ChartData {
  type: 'bar' | 'pie' | 'line';
  title: string;
  data: { name: string; value: number; [key: string]: any }[];
  config?: { color?: string; dataKey?: string };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  recommendations?: RecommendationItem[];
  chartData?: ChartData;
  timestamp: Date;
}

// --- Battle Map Types ---
export interface ClientAccount {
  id: string;
  name: string;
  logoUrl: string;
  industry: string; // Level 1: 大制造, 大消费, etc.
  subIndustry: string; // Level 2: 汽车产业链, 零售连锁, etc.
  segment: 'SA' | 'KA' | 'Mid' | 'LongTail'; // 人员规模分类
  strategy: 'Gold' | 'Silver' | 'Avoid'; // 拓展建议
  adoptionStatus: 'Full' | 'Partial' | 'None'; // 飞书点亮情况
  employees: number;
  revenue: string;
  owner: string;
  region: string;
  province?: string;
  tags: string[];
}

export enum NavTab {
  HOME = 'home',
  RESEARCH = 'research',
  SOLUTIONS = 'solutions',
  APP_CENTER = 'app_center',
  CASES = 'cases',
  REVIEW = 'review',
  RESOURCES = 'resources',
  BATTLE_MAP = 'battle_map',
  DASHBOARD = 'dashboard',
  AI_HUB = 'ai_hub', // New Tab
  PROFILE = 'profile',
  UPLOAD_ARTICLE = 'upload_article',
  UPLOAD_SOLUTION = 'upload_solution',
  UPLOAD_APP = 'upload_app',
  UPLOAD_CASE = 'upload_case',
  UPLOAD_REVIEW = 'upload_review',
  UPLOAD_RESOURCE = 'upload_resource',
  UPLOAD_AI = 'upload_ai', // New Upload Tab
  UPLOAD = 'upload_solution',
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'sales' | 'solution_architect' | 'product_manager';
  department: string;
  email: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  totalLikesReceived: number;
  isFollowing?: boolean;
}

export type InteractionType = 'view' | 'like' | 'favorite' | 'share' | 'comment' | 'download' | 'follow';
export type TargetType = 'solution' | 'case' | 'app' | 'review' | 'resource' | 'article' | 'user' | 'research' | 'ai_agent';

export interface AnalyticsEvent {
  id: string;
  userId: string;
  targetType: TargetType;
  targetId: string;
  action: InteractionType;
  timestamp: number;
  metadata?: any;
}

export interface AggregatedStats {
  views: number;
  uv: number;
  likes: number;
  favorites: number;
  comments: number;
  shares: number;
  downloads: number;
}
