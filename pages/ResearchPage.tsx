
import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown, X, Briefcase, Tag, Globe, PenTool, Star, Heart, MessageSquare, Eye, Clock, ThumbsUp, Share2 } from 'lucide-react';
import { ResearchArticle } from '../types';
import { TAXONOMY } from '../constants';
import { useAnalytics } from '../contexts/AnalyticsContext';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

interface ResearchPageProps {
  onArticleClick: (id: string) => void;
  extraArticles?: ResearchArticle[];
  onUpload?: () => void;
}

const ResearchPage: React.FC<ResearchPageProps> = ({ onArticleClick, extraArticles = [], onUpload }) => {
  const { trackEvent, getActionCount, hasUserActed } = useAnalytics();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSourceTypes, setSelectedSourceTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'heat' | 'likes'>('date');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Initial Data
  const INITIAL_ARTICLES: ResearchArticle[] = [
    {
      id: 'r1',
      title: '2026年全球汽车行业数字化转型趋势预测',
      summary: '随着软件定义汽车（SDV）时代的到来，车企数字化转型进入深水区。本文基于McKinsey最新报告，深度解读未来3年的五大关键趋势。',
      author: 'McKinsey',
      sourceType: 'external',
      sourceName: 'McKinsey',
      category: '趋势洞察',
      industry: '大制造',
      imageUrl: 'https://picsum.photos/400/250?random=101',
      date: '2025-12-10',
      views: 5200,
      likes: 340,
      favorites: 120,
      comments: 45,
      tags: ['SDV', '数字化转型', '新能源']
    },
    {
      id: 'r2',
      title: '飞书在先进制造行业的落地实践与思考',
      summary: '结合过去一年的交付经验，我们总结了飞书在工厂车间场景下的三个核心价值点：信息流转加速、知识沉淀与一线员工赋能。',
      author: '张三',
      sourceType: 'original',
      category: '最佳实践',
      industry: '大制造',
      imageUrl: 'https://picsum.photos/400/250?random=102',
      date: '2025-12-05',
      views: 3800,
      likes: 450,
      favorites: 210,
      comments: 68,
      tags: ['一线赋能', '车间管理']
    },
    {
      id: 'r3',
      title: '消费电子出海：从“卖产品”到“卖品牌”的路径演进',
      summary: '面对复杂的国际形势，中国消费电子品牌出海面临哪些新挑战？如何利用数字化工具构建全球化品牌心智？',
      author: '36Kr',
      sourceType: 'external',
      sourceName: '36Kr',
      category: '市场分析',
      industry: '大消费',
      imageUrl: 'https://picsum.photos/400/250?random=103',
      date: '2025-11-28',
      views: 4100,
      likes: 220,
      favorites: 90,
      comments: 32,
      tags: ['出海', '品牌建设']
    },
    {
      id: 'r4',
      title: '金融行业信创替代背景下的协同办公新选择',
      summary: '在信创国产化替代的大潮下，金融机构如何平衡安全合规与极致体验？本文分析了飞书私有化部署的独特优势。',
      author: '王金',
      sourceType: 'original',
      category: '政策解读',
      industry: '金融',
      imageUrl: 'https://picsum.photos/400/250?random=104',
      date: '2025-11-15',
      views: 2900,
      likes: 180,
      favorites: 150,
      comments: 25,
      tags: ['信创', '私有化', '合规']
    },
    {
      id: 'r5',
      title: '新零售门店数字化：如何让数据驱动决策',
      summary: '门店是零售的神经末梢。通过数字化手段采集客流、动线、交易数据，能够帮助管理者做出更科学的经营决策。',
      author: '李雷',
      sourceType: 'original',
      category: '最佳实践',
      industry: '大消费',
      imageUrl: 'https://picsum.photos/400/250?random=105',
      date: '2025-11-01',
      views: 3500,
      likes: 310,
      favorites: 180,
      comments: 52,
      tags: ['数据驱动', '智慧门店']
    },
    {
      id: 'r6',
      title: '生成式AI在企业知识管理中的应用前景',
      summary: 'Gartner预测，到2027年，50%的企业将利用生成式AI重构知识管理体系。飞书在这一领域有哪些探索？',
      author: 'Gartner',
      sourceType: 'external',
      sourceName: 'Gartner',
      category: '趋势洞察',
      industry: '互联网',
      imageUrl: 'https://picsum.photos/400/250?random=106',
      date: '2025-10-20',
      views: 6800,
      likes: 520,
      favorites: 340,
      comments: 88,
      tags: ['AIGC', '知识库', '未来办公']
    },
    {
      id: 'r7',
      title: '深度拆解钉钉7.5版本：AI Agent 成为核心战略',
      summary: '钉钉宣布全线接入通义千问，AI Agent 平台将如何改变协同办公格局？本文深度分析其PaaS化策略对市场的影响。',
      author: '36Kr',
      sourceType: 'external',
      sourceName: '36Kr',
      category: '竞对观察',
      industry: '互联网',
      imageUrl: 'https://picsum.photos/400/250?random=107',
      date: '2025-12-12',
      views: 8900,
      likes: 650,
      favorites: 420,
      comments: 110,
      tags: ['AI Agent', 'PaaS', '钉钉']
    },
    {
      id: 'r8',
      title: '企业微信2025战略：深耕私域，连接消费者',
      summary: '企业微信打通视频号直播与微信客服，进一步强化“连接”属性。本文分析其在私域变现路径上的最新布局。',
      author: '见实',
      sourceType: 'external',
      sourceName: '见实',
      category: '竞对观察',
      industry: '大消费',
      imageUrl: 'https://picsum.photos/400/250?random=108',
      date: '2025-12-08',
      views: 7200,
      likes: 580,
      favorites: 350,
      comments: 95,
      tags: ['私域流量', '视频号', '企业微信']
    },
    {
      id: 'r9',
      title: '微软 Copilot vs 飞书智能伙伴：生产力工具的 AI 路线之争',
      summary: '微软基于 Office 生态的 Copilot 与飞书基于即时沟通的智能伙伴，谁更懂中国企业？深度对比两者的技术路线与落地场景。',
      author: '极客公园',
      sourceType: 'external',
      sourceName: '极客公园',
      category: '竞对观察',
      industry: '互联网',
      imageUrl: 'https://picsum.photos/400/250?random=109',
      date: '2025-12-01',
      views: 9500,
      likes: 800,
      favorites: 560,
      comments: 150,
      tags: ['AI助手', 'Copilot', '生产力']
    }
  ];

  // Merge Analytics & Extra Articles
  const articles = useMemo(() => {
    const combined = [...extraArticles, ...INITIAL_ARTICLES];
    return combined.map(art => ({
      ...art,
      likes: art.likes + getActionCount('research', art.id, 'like'),
      favorites: art.favorites + getActionCount('research', art.id, 'favorite'),
      comments: art.comments + getActionCount('research', art.id, 'comment'),
      isLiked: hasUserActed('research', art.id, 'like'),
      isFavorited: hasUserActed('research', art.id, 'favorite')
    }));
  }, [getActionCount, hasUserActed, extraArticles]);

  // Handlers
  const handleLike = (e: React.MouseEvent, id: string) => { e.stopPropagation(); trackEvent('research', id, 'like'); };
  const handleFavorite = (e: React.MouseEvent, id: string) => { e.stopPropagation(); trackEvent('research', id, 'favorite'); };

  const filteredArticles = useMemo(() => {
    let result = articles.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(item.industry) || item.industry === '通用';
      const matchSource = selectedSourceTypes.length === 0 || selectedSourceTypes.includes(item.sourceType);
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);

      return matchSearch && matchIndustry && matchSource && matchCategory;
    });

    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'heat') return (b.views + b.comments * 5) - (a.views + a.comments * 5);
      if (sortBy === 'likes') return b.likes - a.likes;
      return 0;
    });

    return result;
  }, [articles, searchQuery, selectedIndustries, selectedSourceTypes, selectedCategories, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustries([]);
    setSelectedSourceTypes([]);
    setSelectedCategories([]);
  };

  const hasActiveFilters = selectedIndustries.length > 0 || selectedSourceTypes.length > 0 || selectedCategories.length > 0 || searchQuery !== '';

  const industryOptions = TAXONOMY.INDUSTRIES.map(i => ({ label: i.label, value: i.label }));
  const sourceTypeOptions = [
    { label: 'GTM 原创', value: 'original' },
    { label: '外部资讯', value: 'external' }
  ];
  const categoryOptions = [
    { label: '趋势洞察', value: '趋势洞察' },
    { label: '最佳实践', value: '最佳实践' },
    { label: '市场分析', value: '市场分析' },
    { label: '竞对观察', value: '竞对观察' },
    { label: '政策解读', value: '政策解读' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Filter Bar */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">资讯洞察中心</h2>
            <p className="text-gray-500 text-sm mt-1">汇聚内外部行业洞察，助力把握市场脉搏</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
               <input 
                 type="text" 
                 placeholder="搜索资讯标题、摘要..." 
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
                 {sortBy === 'date' ? '最新发布' : (sortBy === 'heat' ? '热度最高' : '最多点赞')}
                 <ChevronDown size={14} />
               </button>
               <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                  <button onClick={() => setSortBy('date')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'date' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>最新发布</button>
                  <button onClick={() => setSortBy('heat')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'heat' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>热度最高</button>
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
           <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <MultiSelectDropdown label="关注行业 (多选)" icon={Briefcase} options={industryOptions} selectedValues={selectedIndustries} onChange={setSelectedIndustries} />
              <MultiSelectDropdown label="来源类型 (多选)" icon={Globe} options={sourceTypeOptions} selectedValues={selectedSourceTypes} onChange={setSelectedSourceTypes} />
              <MultiSelectDropdown label="资讯分类 (多选)" icon={Tag} options={categoryOptions} selectedValues={selectedCategories} onChange={setSelectedCategories} />
           </div>
           
           {hasActiveFilters && (
             <div className="px-5 pb-4 flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex flex-wrap gap-2 text-xs">
                   {selectedIndustries.map(v => <span key={v} className="px-2 py-1 bg-blue-50 text-blue-600 rounded flex items-center gap-1">行业: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedIndustries(prev => prev.filter(i => i !== v))} /></span>)}
                   {selectedSourceTypes.map(v => <span key={v} className={`px-2 py-1 rounded flex items-center gap-1 ${v === 'original' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>来源: {v === 'original' ? '原创' : '外部'} <X size={10} className="cursor-pointer" onClick={() => setSelectedSourceTypes(prev => prev.filter(i => i !== v))} /></span>)}
                   {selectedCategories.map(v => <span key={v} className="px-2 py-1 bg-green-50 text-green-600 rounded flex items-center gap-1">分类: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedCategories(prev => prev.filter(i => i !== v))} /></span>)}
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
        {filteredArticles.length > 0 ? (
          filteredArticles.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onArticleClick(item.id)}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden shrink-0">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                {/* Favorite Button */}
                <button 
                  onClick={(e) => handleFavorite(e, item.id)}
                  className={`absolute top-3 right-3 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium backdrop-blur-md transition-all active:scale-95 ${
                    item.isFavorited 
                      ? 'bg-yellow-500 text-white shadow-md' 
                      : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
                >
                  <Star size={12} className={item.isFavorited ? "fill-current" : ""} /> {item.favorites}
                </button>

                {/* Source Label */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold shadow-sm backdrop-blur-sm flex items-center gap-1 ${item.sourceType === 'original' ? 'bg-indigo-500/90 text-white' : 'bg-orange-500/90 text-white'}`}>
                   {item.sourceType === 'original' ? <PenTool size={10} /> : <Globe size={10} />}
                   {item.sourceType === 'original' ? 'GTM 原创' : `外部: ${item.sourceName}`}
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                   <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{item.industry}</span>
                   <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                   <span>{item.category}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 group-hover:text-lark-600 transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10 leading-relaxed">{item.summary}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                   {item.tags.slice(0, 3).map(t => (
                      <span key={t} className="px-1.5 py-0.5 bg-gray-50 text-gray-400 text-[10px] rounded border border-gray-100">#{t}</span>
                   ))}
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-600">{item.author}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {item.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => handleLike(e, item.id)}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition ${
                        item.isLiked ? 'text-lark-600 font-bold bg-lark-50' : 'hover:text-lark-500 hover:bg-gray-100'
                      }`}
                    >
                      <ThumbsUp size={12} className={item.isLiked ? "fill-current" : ""} /> {item.likes}
                    </button>
                    <div className="flex items-center gap-1 hover:text-lark-500 transition">
                      <MessageSquare size={12} /> {item.comments}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border border-gray-100">
             <div className="text-gray-300 mb-4 flex justify-center"><Search size={48} /></div>
             <p className="text-gray-500">未找到相关资讯</p>
             <button onClick={clearFilters} className="mt-4 text-lark-600 text-sm hover:underline">清除所有筛选</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchPage;
