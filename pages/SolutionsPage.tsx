
import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, MessageSquare, Clock, ThumbsUp, Search, ChevronDown, X, Tag, Briefcase, User, Box, Star, Share2 } from 'lucide-react';
import { Solution } from '../types';
import { TAXONOMY } from '../constants';
import { useAnalytics } from '../contexts/AnalyticsContext';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

interface SolutionsPageProps {
  onSolutionClick: (id: string) => void;
  onCommentClick?: (id: string) => void;
  extraSolutions?: Solution[];
  onUpload?: () => void;
}

const SolutionsPage: React.FC<SolutionsPageProps> = ({ onSolutionClick, onCommentClick, extraSolutions = [], onUpload }) => {
  const { trackEvent, getActionCount, hasUserActed } = useAnalytics();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Multi-select state
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedScenes, setSelectedScenes] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const [sortBy, setSortBy] = useState<'date' | 'heat' | 'favorites'>('date');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Initial Static Data (Same as before)
  const INITIAL_SOLUTIONS: Solution[] = [
    { 
      id: '1', 
      title: '汽车行业智慧研发解决方案', 
      description: '针对传统车企研发工具割裂痛点，基于飞书项目打造IPD全流程管理平台，缩短TTM 30%。', 
      author: '张三', 
      imageUrl: 'https://picsum.photos/400/300?random=10', 
      likes: 245, 
      comments: 68, 
      favorites: 520, 
      date: '2025/12/10', 
      industry: 'auto',
      tags: {
        industry: ['大制造', '汽车产业链', '整车制造'],
        scene: ['研发设计', '项目管理', '敏捷协同'],
        target: ['研发副总', 'CIO', 'PMO总监'],
        product: ['飞书项目', '飞书文档', 'GitLab集成']
      },
      isLiked: false,
      isFavorited: false
    },
    // ... (Other initial solutions kept implicit or can be copy-pasted if full file needed, assuming merge logic holds)
    { 
      id: '2', 
      title: '消费电子渠道管理方案', 
      description: '连接品牌与终端，实时掌握渠道库存与销量。通过多维表格搭建轻量级DMS系统。', 
      author: '陈静', 
      imageUrl: 'https://picsum.photos/400/300?random=11', 
      likes: 180, 
      comments: 42, 
      favorites: 210, 
      date: '2025/12/08', 
      industry: 'manufacturing',
      tags: {
        industry: ['大制造', '消费电子与家电', '消费电子终端'],
        scene: ['营销服务', '渠道管理', '库存管理'],
        target: ['销售总监', '渠道经理'],
        product: ['多维表格', '飞书应用引擎']
      },
      isLiked: false,
      isFavorited: false
    },
    { 
      id: '3', 
      title: '化工安全隐患排查解决方案', 
      description: 'IoT与多维表格结合，实现隐患“随手拍、自动派、闭环改”，巡检效率提升200%。', 
      author: '刘伟', 
      imageUrl: 'https://picsum.photos/400/300?random=12', 
      likes: 124, 
      comments: 45, 
      favorites: 320, 
      date: '2025/11/25', 
      industry: 'energy',
      tags: {
        industry: ['大制造', '能源与基础材料', '化工'],
        scene: ['生产制造', '安全生产', '隐患治理'],
        target: ['生产总监', '安全总监 (HSE)', '厂长'],
        product: ['多维表格', '飞书机器人', 'AnyCross']
      },
      isLiked: false,
      isFavorited: false
    },
    { 
      id: '4', 
      title: '互联网行业协同办公最佳实践', 
      description: '飞书深度用法，激发组织创新活力，打造敏捷组织文化，提升跨国协作效率。', 
      author: '孙敏', 
      imageUrl: 'https://picsum.photos/400/300?random=13', 
      likes: 560, 
      comments: 88, 
      favorites: 420, 
      date: '2025/10/15', 
      industry: 'tech',
      tags: {
        industry: ['互联网', '高科技'],
        scene: ['组织管理', '文化建设', '协同办公'],
        target: ['HRD', 'CEO', 'CIO'],
        product: ['飞书文档', '飞书会议', '飞书妙记']
      },
      isLiked: false,
      isFavorited: false
    },
    { 
      id: '5', 
      title: '新零售门店数字化巡检', 
      description: '赋能督导与店长，通过移动端完成标准化巡检动作，数据实时上传总部。', 
      author: '李雷', 
      imageUrl: 'https://picsum.photos/400/300?random=14', 
      likes: 95, 
      comments: 10, 
      favorites: 60, 
      date: '2025/12/01', 
      industry: 'retail',
      tags: {
        industry: ['大消费', '零售连锁', '商超便利'],
        scene: ['营销服务', '门店管理', '运营'],
        target: ['运营总监', '店长', '督导'],
        product: ['多维表格', '飞书任务']
      },
      isLiked: false,
      isFavorited: false
    },
    { 
      id: '6', 
      title: '金融行业合规营销方案', 
      description: '在合规前提下，利用私域流量实现业绩增长，沉淀客户资产。', 
      author: '周杰', 
      imageUrl: 'https://picsum.photos/400/300?random=15', 
      likes: 150, 
      comments: 40, 
      favorites: 110, 
      date: '2025/11/30', 
      industry: 'finance',
      tags: {
        industry: ['金融', '银行业', '股份制'],
        scene: ['营销服务', '私域运营', '客户管理'],
        target: ['营销总监', '合规总监'],
        product: ['飞书IM', '云文档']
      },
      isLiked: false,
      isFavorited: false
    },
  ];

  // Merge Analytics
  const solutions = useMemo(() => {
    const combined = [...extraSolutions, ...INITIAL_SOLUTIONS];
    return combined.map(sol => ({
      ...sol,
      likes: sol.likes + getActionCount('solution', sol.id, 'like'),
      favorites: sol.favorites + getActionCount('solution', sol.id, 'favorite'),
      comments: sol.comments + getActionCount('solution', sol.id, 'comment'),
      isLiked: hasUserActed('solution', sol.id, 'like'),
      isFavorited: hasUserActed('solution', sol.id, 'favorite')
    }));
  }, [getActionCount, hasUserActed, extraSolutions]);

  // Handlers
  const handleLike = (e: React.MouseEvent, id: string) => { e.stopPropagation(); trackEvent('solution', id, 'like'); };
  const handleFavorite = (e: React.MouseEvent, id: string) => { e.stopPropagation(); trackEvent('solution', id, 'favorite'); };
  const handleCommentBtnClick = (e: React.MouseEvent, id: string) => { e.stopPropagation(); onCommentClick ? onCommentClick(id) : onSolutionClick(id); };

  // Generate Options
  const industryOptions = TAXONOMY.INDUSTRIES.map(i => ({ label: i.label, value: i.label }));
  const sceneOptions = TAXONOMY.SCENARIOS.map(s => ({ label: s.label, value: s.label }));
  const roleOptions = TAXONOMY.ROLES.map(r => ({ label: r, value: r }));
  const productOptions = TAXONOMY.PRODUCTS.map(p => ({ label: p, value: p }));

  const processedSolutions = useMemo(() => {
    let result = solutions.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.some(i => item.tags?.industry.some(t => t.includes(i)));
      const matchesScene = selectedScenes.length === 0 || selectedScenes.some(s => item.tags?.scene.some(t => t.includes(s)));
      const matchesRole = selectedRoles.length === 0 || selectedRoles.some(r => item.tags?.target.some(t => t.includes(r)));
      const matchesProduct = selectedProducts.length === 0 || selectedProducts.some(p => item.tags?.product.some(t => t.includes(p)));

      return matchesSearch && matchesIndustry && matchesScene && matchesRole && matchesProduct;
    });

    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'heat') return (b.likes + b.comments * 2) - (a.likes + a.comments * 2);
      if (sortBy === 'favorites') return b.favorites - a.favorites;
      return 0;
    });

    return result;
  }, [solutions, searchQuery, selectedIndustries, selectedScenes, selectedRoles, selectedProducts, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustries([]);
    setSelectedScenes([]);
    setSelectedRoles([]);
    setSelectedProducts([]);
  };

  const hasActiveFilters = selectedIndustries.length > 0 || selectedScenes.length > 0 || selectedRoles.length > 0 || selectedProducts.length > 0 || searchQuery !== '';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">方案中心</h2>
            <p className="text-gray-500 text-sm mt-1">汇聚全行业优秀实践，赋能业务增长</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
               <input 
                 type="text" 
                 placeholder="搜索方案名称、关键词..." 
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
                 {sortBy === 'date' ? '最新发布' : (sortBy === 'heat' ? '热度最高' : '最多收藏')}
                 <ChevronDown size={14} />
               </button>
               <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                  <button onClick={() => setSortBy('date')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'date' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>最新发布</button>
                  <button onClick={() => setSortBy('heat')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'heat' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>热度最高</button>
                  <button onClick={() => setSortBy('favorites')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'favorites' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>最多收藏</button>
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

        {/* Advanced Filters Panel */}
        <div className={`bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 overflow-visible ${isFilterExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
           <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              <MultiSelectDropdown label="适用行业 (多选)" icon={Briefcase} options={industryOptions} selectedValues={selectedIndustries} onChange={setSelectedIndustries} />
              <MultiSelectDropdown label="适用场景 (多选)" icon={Tag} options={sceneOptions} selectedValues={selectedScenes} onChange={setSelectedScenes} />
              <MultiSelectDropdown label="关键角色 (多选)" icon={User} options={roleOptions} selectedValues={selectedRoles} onChange={setSelectedRoles} />
              <MultiSelectDropdown label="涉及产品 (多选)" icon={Box} options={productOptions} selectedValues={selectedProducts} onChange={setSelectedProducts} />
           </div>
           
           {hasActiveFilters && (
             <div className="px-5 pb-4 flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex flex-wrap gap-2 text-xs">
                   {selectedIndustries.map(v => <span key={v} className="px-2 py-1 bg-blue-50 text-blue-600 rounded flex items-center gap-1">行业: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedIndustries(prev => prev.filter(i => i !== v))} /></span>)}
                   {selectedScenes.map(v => <span key={v} className="px-2 py-1 bg-green-50 text-green-600 rounded flex items-center gap-1">场景: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedScenes(prev => prev.filter(i => i !== v))} /></span>)}
                   {selectedRoles.map(v => <span key={v} className="px-2 py-1 bg-purple-50 text-purple-600 rounded flex items-center gap-1">角色: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedRoles(prev => prev.filter(i => i !== v))} /></span>)}
                   {selectedProducts.map(v => <span key={v} className="px-2 py-1 bg-orange-50 text-orange-600 rounded flex items-center gap-1">产品: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedProducts(prev => prev.filter(i => i !== v))} /></span>)}
                   {searchQuery && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded flex items-center gap-1">搜索: "{searchQuery}"</span>}
                </div>
                <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition"><X size={12} /> 清空筛选</button>
             </div>
           )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
        {processedSolutions.length > 0 ? (
          processedSolutions.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onSolutionClick(item.id)}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden shrink-0">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button 
                  onClick={(e) => handleFavorite(e, item.id)}
                  className={`absolute top-3 right-3 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium backdrop-blur-md transition-all active:scale-95 ${item.isFavorited ? 'bg-yellow-500 text-white shadow-md' : 'bg-black/40 text-white hover:bg-black/60'}`}
                >
                  <Star size={12} className={item.isFavorited ? "fill-current" : ""} /> {item.favorites}
                </button>
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-md font-bold shadow-sm border border-gray-100">
                   {item.tags?.industry[1] || item.tags?.industry[0] || '通用行业'}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1 group-hover:text-lark-600 transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10 leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                   {item.tags?.scene.slice(0, 2).map(t => (
                      <span key={t} className="px-1.5 py-0.5 bg-gray-50 text-gray-500 text-[10px] rounded border border-gray-100">{t}</span>
                   ))}
                </div>
                <div className="mt-auto flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-gray-500 font-medium">{item.author}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {item.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => handleLike(e, item.id)} className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition ${item.isLiked ? 'text-lark-600 font-bold bg-lark-50' : 'hover:text-lark-500 hover:bg-gray-100'}`}>
                      <ThumbsUp size={12} className={item.isLiked ? "fill-current" : ""} /> {item.likes}
                    </button>
                    <button onClick={(e) => handleCommentBtnClick(e, item.id)} className="flex items-center gap-1 hover:text-lark-500 hover:bg-gray-100 px-1.5 py-0.5 rounded transition">
                      <MessageSquare size={12} /> {item.comments}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border border-gray-100">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300"><Search size={32} /></div>
             <h3 className="text-lg font-bold text-gray-800 mb-2">未找到相关方案</h3>
             <button onClick={clearFilters} className="mt-4 text-lark-600 text-sm font-medium hover:underline">清除所有筛选</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionsPage;
