
import React, { useState, useMemo } from 'react';
import { Search, Filter, Bot, BrainCircuit, Sparkles, ChevronDown, SlidersHorizontal, X, FolderOpen, Star, ThumbsUp, MessageSquare, ExternalLink, Share2 } from 'lucide-react';
import { AIAgent } from '../types';
import { AI_BUSINESS_TAXONOMY } from '../constants';
import { useAnalytics } from '../contexts/AnalyticsContext';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

interface AIHubPageProps {
  onAgentClick: (id: string) => void;
  onUpload?: () => void;
}

const AIHubPage: React.FC<AIHubPageProps> = ({ onAgentClick, onUpload }) => {
  const { trackEvent, getActionCount, hasUserActed } = useAnalytics();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Multi-select States
  const [selectedBusinessCategories, setSelectedBusinessCategories] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  
  const [sortBy, setSortBy] = useState<'date' | 'heat' | 'likes'>('heat');
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  // Flatten taxonomy for dropdown
  const businessOptions = useMemo(() => {
    return AI_BUSINESS_TAXONOMY.flatMap(group => 
      group.children.map(child => ({
        label: child,
        value: `${group.label}-${child}`,
        group: group.label
      }))
    );
  }, []);

  const platformOptions = [
    { label: 'Coze (扣子)', value: 'Coze' },
    { label: 'Aily (飞书智能伙伴)', value: 'Aily' },
    { label: 'LarkBase (多维表格)', value: 'LarkBase' },
    { label: 'Meego (飞书项目)', value: 'Meego' },
    { label: 'aPaaS (飞书)', value: 'aPaaS' },
    { label: 'Other', value: 'Other' },
  ];

  // --- MOCK DATA FOR AI AGENTS ---
  const INITIAL_AGENTS: AIAgent[] = [
    {
      id: 'ai-1',
      name: '竞对动态分析助手',
      description: '基于Coze搭建，自动抓取36Kr、虎嗅等媒体关于指定竞对的最新报道，并生成SWOT分析简报。',
      platform: 'Coze',
      model: 'GPT-4o',
      capabilities: ['新闻抓取', 'SWOT分析', '日报推送'],
      author: '市场部-王强',
      updateDate: '2025-12-10',
      heat: 1200,
      likes: 245,
      favorites: 88,
      comments: 32,
      tags: {
        businessCategories: ['洞察行业-行业资讯', '洞察行业-市场策略']
      },
      launchUrl: '#'
    },
    {
      id: 'ai-2',
      name: '售前方案生成器',
      description: '基于Aily开发，输入客户行业和痛点，自动匹配公司案例库，生成初步解决方案PPT大纲。',
      platform: 'Aily',
      model: 'Gemini 1.5 Pro',
      capabilities: ['RAG知识库', 'PPT大纲', '痛点匹配'],
      author: '解决方案部-李雷',
      updateDate: '2025-12-08',
      heat: 980,
      likes: 190,
      favorites: 120,
      comments: 45,
      tags: {
        businessCategories: ['研发方案-行业方案', '研发方案-售前故事线']
      },
      launchUrl: '#'
    },
    {
      id: 'ai-3',
      name: '销售Roleplay陪练',
      description: '利用飞书多维表格+OpenAI接口，模拟真实客户刁钻提问，帮助销售进行话术演练和考核。',
      platform: 'LarkBase',
      model: 'GPT-4',
      capabilities: ['情景模拟', '语音交互', '评分反馈'],
      author: '培训部-陈静',
      updateDate: '2025-11-25',
      heat: 850,
      likes: 150,
      favorites: 60,
      comments: 20,
      tags: {
        businessCategories: ['打单管理-Pitch复盘', '打单管理-经营分析']
      },
      launchUrl: '#'
    },
    {
      id: 'ai-4',
      name: '客户成单率预测',
      description: '基于aPaaS数据对象，分析历史赢单数据特征，预测当前商机的赢单概率并给出推进建议。',
      platform: 'aPaaS',
      model: 'Custom ML',
      capabilities: ['数据分析', '预测模型', '行动建议'],
      author: '销售运营-赵六',
      updateDate: '2025-11-10',
      heat: 720,
      likes: 110,
      favorites: 45,
      comments: 15,
      tags: {
        businessCategories: ['打单管理-成单预测', '客户分析-财务经营']
      },
      launchUrl: '#'
    },
    {
      id: 'ai-5',
      name: '代码自动Review助手',
      description: '集成在GitLab流水线中，自动对提交的代码进行安全扫描和规范检查，并给出修复建议。',
      platform: 'Meego',
      model: 'DeepSeek-Coder',
      capabilities: ['代码审查', '安全扫描', '自动修复'],
      author: '研发效能-张三',
      updateDate: '2025-12-01',
      heat: 650,
      likes: 95,
      favorites: 30,
      comments: 12,
      tags: {
        businessCategories: ['研发方案-行业方案']
      },
      launchUrl: '#'
    },
    {
      id: 'ai-6',
      name: '招投标控标参数生成',
      description: '上传产品白皮书，自动提取关键技术参数，并生成差异化控标点，辅助标书制作。',
      platform: 'Coze',
      model: 'Claude 3.5 Sonnet',
      capabilities: ['文档解析', '参数提取', '标书辅助'],
      author: '售前-刘伟',
      updateDate: '2025-11-30',
      heat: 1100,
      likes: 210,
      favorites: 95,
      comments: 28,
      tags: {
        businessCategories: ['研发方案-售前故事线', '研发方案-行业方案']
      },
      launchUrl: '#'
    },
    {
      id: 'ai-7',
      name: '客户高层动态追踪',
      description: '监控客户官网及社交媒体，自动识别客户高层变动、公开演讲等关键信息，及时预警。',
      platform: 'Coze',
      model: 'GPT-4',
      capabilities: ['信息监控', '高层识别', '商机挖掘'],
      author: 'KA销售部',
      updateDate: '2025-12-05',
      heat: 920,
      likes: 175,
      favorites: 70,
      comments: 18,
      tags: {
        businessCategories: ['客户分析-高层动态', '客户分析-客户关键人攻略']
      },
      launchUrl: '#'
    },
    {
      id: 'ai-8',
      name: '一客一档自动生成',
      description: '自动聚合CRM、邮件、即时通讯中的客户信息，生成360度客户画像与大事记。',
      platform: 'Aily',
      model: 'Lark-Search',
      capabilities: ['信息聚合', '画像生成', '时间轴'],
      author: '销售运营',
      updateDate: '2025-11-20',
      heat: 1050,
      likes: 230,
      favorites: 110,
      comments: 42,
      tags: {
        businessCategories: ['客户分析-一客一档']
      },
      launchUrl: '#'
    }
  ];

  // Merge Analytics
  const agents = useMemo(() => {
    return INITIAL_AGENTS.map(agent => ({
      ...agent,
      likes: agent.likes + getActionCount('ai_agent', agent.id, 'like'),
      favorites: agent.favorites + getActionCount('ai_agent', agent.id, 'favorite'),
      comments: agent.comments + getActionCount('ai_agent', agent.id, 'comment'),
      isLiked: hasUserActed('ai_agent', agent.id, 'like'),
      isFavorited: hasUserActed('ai_agent', agent.id, 'favorite')
    }));
  }, [getActionCount, hasUserActed]);

  // Handlers
  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    trackEvent('ai_agent', id, 'like');
  };

  const handleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    trackEvent('ai_agent', id, 'favorite');
  };

  // Filter Logic
  const filteredAgents = useMemo(() => {
    let result = agents.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory = selectedBusinessCategories.length === 0 || 
                            item.tags?.businessCategories?.some(tag => selectedBusinessCategories.includes(tag));

      const matchPlatform = selectedPlatforms.length === 0 || 
                            selectedPlatforms.includes(item.platform);

      return matchSearch && matchCategory && matchPlatform;
    });

    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime();
      if (sortBy === 'heat') return b.heat - a.heat;
      if (sortBy === 'likes') return b.likes - a.likes;
      return 0;
    });

    return result;
  }, [agents, searchQuery, selectedBusinessCategories, selectedPlatforms, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBusinessCategories([]);
    setSelectedPlatforms([]);
  };

  const hasActiveFilters = selectedBusinessCategories.length > 0 || selectedPlatforms.length > 0 || searchQuery !== '';

  const getPlatformBadge = (platform: string) => {
    const styles: Record<string, string> = {
      'Coze': 'bg-blue-100 text-blue-700 border-blue-200',
      'Aily': 'bg-purple-100 text-purple-700 border-purple-200',
      'LarkBase': 'bg-green-100 text-green-700 border-green-200',
      'Meego': 'bg-orange-100 text-orange-700 border-orange-200',
      'aPaaS': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Other': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[platform] || styles['Other']}`}>
        {platform}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Filter Bar */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
               <Bot className="text-lark-500" /> 效率工具
            </h2>
            <p className="text-gray-500 text-sm mt-1">GTM 业务专属的 AI 助手与工具库，涵盖行业洞察、方案研发、客户分析与打单管理全场景</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
               <input 
                 type="text" 
                 placeholder="搜索工具、功能..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-lark-500 outline-none shadow-sm transition" 
               />
               {searchQuery && (
                 <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"><X size={14} /></button>
               )}
            </div>

            <button 
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition shadow-sm ${isFilterExpanded ? 'bg-lark-50 border-lark-200 text-lark-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              <Filter size={16} /> 筛选
            </button>

            <div className="relative group shrink-0">
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition shadow-sm">
                 <SlidersHorizontal size={16} />
                 {sortBy === 'heat' ? '热度最高' : (sortBy === 'date' ? '最新发布' : '最多点赞')}
                 <ChevronDown size={14} />
               </button>
               <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                  <button onClick={() => setSortBy('heat')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'heat' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>热度最高</button>
                  <button onClick={() => setSortBy('date')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'date' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>最新发布</button>
                  <button onClick={() => setSortBy('likes')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'likes' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>最多点赞</button>
               </div>
            </div>

            <button 
              onClick={onUpload}
              className="flex items-center gap-2 px-4 py-2 bg-lark-600 text-white rounded-lg text-sm font-medium hover:bg-lark-700 transition shadow-sm shrink-0"
            >
              <Share2 size={16} /> 我要分享
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        <div className={`bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 overflow-visible ${isFilterExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
           <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              
              {/* Business Classification Filter (Grouped Multi-select) */}
              <MultiSelectDropdown 
                label="业务分类 (多选)" 
                icon={FolderOpen} 
                options={businessOptions}
                selectedValues={selectedBusinessCategories}
                onChange={setSelectedBusinessCategories}
              />

              {/* Platform Filter (Multi-select) */}
              <MultiSelectDropdown 
                label="开发工具/平台 (多选)" 
                icon={BrainCircuit}
                options={platformOptions}
                selectedValues={selectedPlatforms}
                onChange={setSelectedPlatforms}
              />
           </div>
           
           {hasActiveFilters && (
             <div className="px-5 pb-4 flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex flex-wrap gap-2 text-xs">
                   {selectedBusinessCategories.map(cat => (
                      <span key={cat} className="px-2 py-1 bg-blue-50 text-blue-600 rounded flex items-center gap-1 border border-blue-100">
                         {cat.split('-')[1]}
                         <X size={10} className="cursor-pointer" onClick={() => setSelectedBusinessCategories(prev => prev.filter(c => c !== cat))} />
                      </span>
                   ))}
                   {selectedPlatforms.map(plat => (
                      <span key={plat} className="px-2 py-1 bg-purple-50 text-purple-600 rounded flex items-center gap-1 border border-purple-100">
                         {plat}
                         <X size={10} className="cursor-pointer" onClick={() => setSelectedPlatforms(prev => prev.filter(p => p !== plat))} />
                      </span>
                   ))}
                   {searchQuery && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded flex items-center gap-1">搜索: "{searchQuery}"</span>}
                </div>
                <button 
                  onClick={clearFilters}
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition"
                >
                   <X size={12} /> 清空筛选
                </button>
             </div>
           )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
        {filteredAgents.length > 0 ? (
          filteredAgents.map((agent) => (
            <div 
              key={agent.id} 
              onClick={() => onAgentClick(agent.id)}
              className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full relative"
            >
              <button 
                onClick={(e) => handleFavorite(e, agent.id)}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${agent.isFavorited ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-500 hover:bg-gray-50'}`}
              >
                <Star size={16} className={agent.isFavorited ? 'fill-current' : ''} />
              </button>

              <div className="p-6 pb-4 flex flex-col flex-1">
                 <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border border-indigo-100">
                       <Bot size={28} />
                    </div>
                    {getPlatformBadge(agent.platform)}
                 </div>

                 <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-lark-600 transition-colors line-clamp-1">{agent.name}</h3>
                 <p className="text-sm text-gray-500 mb-4 flex-1 leading-relaxed line-clamp-2">{agent.description}</p>

                 <div className="flex flex-wrap gap-1.5 mb-4">
                    {agent.tags?.businessCategories?.slice(0, 3).map(tag => (
                       <span key={tag} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] rounded border border-gray-100 flex items-center gap-1">
                          <FolderOpen size={8} className="text-blue-400"/> {tag.split('-')[1]}
                       </span>
                    ))}
                 </div>
              </div>

              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 rounded-b-xl flex items-center justify-between">
                 <div className="flex items-center gap-3 text-xs text-gray-400">
                    <button 
                       onClick={(e) => handleLike(e, agent.id)}
                       className={`flex items-center gap-1 transition ${agent.isLiked ? 'text-lark-600 font-bold' : 'hover:text-lark-600'}`}
                    >
                       <ThumbsUp size={12} className={agent.isLiked ? 'fill-current' : ''} /> {agent.likes}
                    </button>
                    <div className="flex items-center gap-1 hover:text-lark-600 transition">
                       <MessageSquare size={12} /> {agent.comments}
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium group-hover:underline">
                    查看详情 <ExternalLink size={12} />
                 </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border border-gray-100">
             <div className="text-gray-300 mb-4 flex justify-center"><Bot size={48} /></div>
             <p className="text-gray-500">未找到相关工具</p>
             <button onClick={clearFilters} className="mt-4 text-lark-600 text-sm hover:underline">清除所有筛选</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIHubPage;
