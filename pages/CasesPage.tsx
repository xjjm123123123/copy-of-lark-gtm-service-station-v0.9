
import React, { useState, useMemo } from 'react';
import { Filter, Search, ArrowUpRight, Building2, Tag, ChevronDown, SlidersHorizontal, Briefcase, User, Box, X, Star, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { CaseStudy } from '../types';
import { TAXONOMY } from '../constants';
import { useAnalytics } from '../contexts/AnalyticsContext';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

interface CasesPageProps {
  onCaseClick: (id: string) => void;
  onUpload?: () => void;
}

const CasesPage: React.FC<CasesPageProps> = ({ onCaseClick, onUpload }) => {
  const { trackEvent, getActionCount, hasUserActed } = useAnalytics();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedScenes, setSelectedScenes] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'heat'>('date');
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const casesInitial: CaseStudy[] = [
    {
      id: '1',
      customerName: '未来汽车集团',
      title: '万人研发团队如何实现高效敏捷协同',
      industry: '大制造',
      logoUrl: 'https://picsum.photos/48/48?random=1',
      coverUrl: 'https://picsum.photos/400/240?random=101',
      summary: '通过飞书项目与多维表格的深度集成，打通研发全链路，需求交付周期缩短30%。',
      metrics: [
        { label: '研发效率', value: '+30%', trend: 'up' },
        { label: '会议时间', value: '-25%', trend: 'down' }
      ],
      tags: {
        industry: ['大制造', '汽车产业链'],
        scene: ['研发设计', '项目管理'],
        target: ['CTO', '研发总监'],
        product: ['飞书项目', '多维表格']
      },
      author: '张三',
      date: '2025/11/15',
      heat: 950,
      likes: 420,
      favorites: 150,
      comments: 65
    },
    // ... (Keep other initial data)
    {
      id: '2',
      customerName: '超级零售连锁',
      title: '连接5000家门店，打造数字化门店管理新范式',
      industry: '大消费',
      logoUrl: 'https://picsum.photos/48/48?random=2',
      coverUrl: 'https://picsum.photos/400/240?random=102',
      summary: '利用飞书机器人实现门店巡检自动化，一线员工上手即用，信息流转效率提升200%。',
      metrics: [
        { label: '巡检效率', value: '+200%', trend: 'up' },
        { label: '单店坪效', value: '+15%', trend: 'up' }
      ],
      tags: {
        industry: ['大消费', '零售连锁'],
        scene: ['营销服务', '门店管理'],
        target: ['运营总监'],
        product: ['飞书机器人', '多维表格']
      },
      author: '李四',
      date: '2025/11/10',
      heat: 880,
      likes: 350,
      favorites: 120,
      comments: 48
    },
    {
      id: '3',
      customerName: 'Global Tech Inc',
      title: '跨国企业的无障碍沟通实践',
      industry: '互联网',
      logoUrl: 'https://picsum.photos/48/48?random=3',
      coverUrl: 'https://picsum.photos/400/240?random=103',
      summary: '飞书翻译功能打破语言壁垒，让全球20个国家的员工像在一个办公室一样协作。',
      metrics: [
        { label: '沟通成本', value: '-40%', trend: 'down' },
        { label: '员工满意度', value: '4.9/5', trend: 'up' }
      ],
      tags: {
        industry: ['互联网', '高科技'],
        scene: ['组织管理', '文化建设', '协同办公'],
        target: ['HRD', 'CEO'],
        product: ['飞书会议', '飞书文档']
      },
      author: '王五',
      date: '2025/11/05',
      heat: 720,
      likes: 280,
      favorites: 90,
      comments: 35
    },
    {
      id: '4',
      customerName: '创新生物医药',
      title: '医药合规营销与学术推广数字化',
      industry: '大消费',
      logoUrl: 'https://picsum.photos/48/48?random=4',
      coverUrl: 'https://picsum.photos/400/240?random=104',
      summary: '在严格合规的前提下，利用飞书会议和文档沉淀学术资产，赋能医药代表。',
      metrics: [
        { label: '学术会议', value: '+50场/月', trend: 'up' },
        { label: '资源复用', value: '+80%', trend: 'up' }
      ],
      tags: {
        industry: ['大消费', '医药医疗'],
        scene: ['营销服务', '客户管理'],
        target: ['合规总监', '营销总监'],
        product: ['飞书会议', '飞书文档']
      },
      author: '赵六',
      date: '2025/10/20',
      heat: 650,
      likes: 190,
      favorites: 75,
      comments: 20
    }
  ];

  // Derived state
  const cases = useMemo(() => {
    return casesInitial.map(c => ({
      ...c,
      likes: (c.likes || 0) + getActionCount('case', c.id, 'like'),
      favorites: (c.favorites || 0) + getActionCount('case', c.id, 'favorite'),
      comments: (c.comments || 0) + getActionCount('case', c.id, 'comment'),
      isLiked: hasUserActed('case', c.id, 'like'),
      isFavorited: hasUserActed('case', c.id, 'favorite')
    }));
  }, [getActionCount, hasUserActed, casesInitial]);

  const handleLike = (e: React.MouseEvent, id: string) => { e.stopPropagation(); trackEvent('case', id, 'like'); };
  const handleFavorite = (e: React.MouseEvent, id: string) => { e.stopPropagation(); trackEvent('case', id, 'favorite'); };

  const filteredCases = useMemo(() => {
    let result = cases.filter(c => {
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.some(i => c.tags.industry.some(t => t.includes(i)));
      const matchesScene = selectedScenes.length === 0 || selectedScenes.some(s => c.tags.scene.some(t => t.includes(s)));
      const matchesProduct = selectedProducts.length === 0 || selectedProducts.some(p => c.tags.product.some(t => t.includes(p)));

      return matchSearch && matchesIndustry && matchesScene && matchesProduct;
    });

    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'heat') return (b.heat || 0) - (a.heat || 0);
      return 0;
    });

    return result;
  }, [cases, searchQuery, selectedIndustries, selectedScenes, selectedProducts, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustries([]);
    setSelectedScenes([]);
    setSelectedProducts([]);
  };

  const hasActiveFilters = selectedIndustries.length > 0 || selectedScenes.length > 0 || selectedProducts.length > 0 || searchQuery !== '';

  const industryOptions = TAXONOMY.INDUSTRIES.map(i => ({ label: i.label, value: i.label }));
  const sceneOptions = TAXONOMY.SCENARIOS.map(s => ({ label: s.label, value: s.label }));
  const productOptions = TAXONOMY.PRODUCTS.map(p => ({ label: p, value: p }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">客户案例</h2>
            <p className="text-gray-500 text-sm mt-1">探索各行业领先企业的数字化转型故事与价值验证</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
               <input 
                 type="text" 
                 placeholder="搜索客户、案例..." 
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
                 {sortBy === 'date' ? '最新发布' : '热度最高'}
                 <ChevronDown size={14} />
               </button>
               <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                  <button onClick={() => setSortBy('date')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'date' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>最新发布</button>
                  <button onClick={() => setSortBy('heat')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'heat' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>热度最高</button>
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
           <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <MultiSelectDropdown label="适用行业 (多选)" icon={Briefcase} options={industryOptions} selectedValues={selectedIndustries} onChange={setSelectedIndustries} />
              <MultiSelectDropdown label="适用场景 (多选)" icon={Tag} options={sceneOptions} selectedValues={selectedScenes} onChange={setSelectedScenes} />
              <MultiSelectDropdown label="涉及产品 (多选)" icon={Box} options={productOptions} selectedValues={selectedProducts} onChange={setSelectedProducts} />
           </div>
           {hasActiveFilters && (
             <div className="px-5 pb-4 flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex flex-wrap gap-2 text-xs">
                   {selectedIndustries.map(v => <span key={v} className="px-2 py-1 bg-blue-50 text-blue-600 rounded flex items-center gap-1">行业: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedIndustries(prev => prev.filter(i => i !== v))} /></span>)}
                   {selectedScenes.map(v => <span key={v} className="px-2 py-1 bg-green-50 text-green-600 rounded flex items-center gap-1">场景: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedScenes(prev => prev.filter(i => i !== v))} /></span>)}
                   {selectedProducts.map(v => <span key={v} className="px-2 py-1 bg-orange-50 text-orange-600 rounded flex items-center gap-1">产品: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedProducts(prev => prev.filter(i => i !== v))} /></span>)}
                   {searchQuery && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded flex items-center gap-1">搜索: "{searchQuery}"</span>}
                </div>
                <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition"><X size={12} /> 清空筛选</button>
             </div>
           )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
        {filteredCases.map((item) => (
          <div 
            key={item.id}
            onClick={() => onCaseClick(item.id)}
            className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col md:flex-row h-auto md:h-64 relative"
          >
            {/* Favorite Button */}
            <button 
              onClick={(e) => handleFavorite(e, item.id)}
              className={`absolute top-4 left-4 z-10 p-1.5 rounded-full transition-colors backdrop-blur-sm ${item.isFavorited ? 'text-yellow-500 bg-white/90' : 'text-white/70 bg-black/20 hover:text-yellow-500 hover:bg-white'}`}
            >
              <Star size={14} className={item.isFavorited ? 'fill-current' : ''} />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-2/5 relative overflow-hidden bg-gray-100">
               <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                 <Building2 size={12} className="text-lark-600" />
                 <span className="text-xs font-medium text-gray-700">{item.industry}</span>
               </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img src={item.logoUrl} alt="logo" className="w-6 h-6 rounded-full" />
                  <span className="text-sm font-semibold text-gray-600">{item.customerName}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-lark-600 transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.summary}</p>
                
                {/* Tags Preview */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags.scene.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">{tag}</span>
                  ))}
                  {item.tags.product.slice(0, 1).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded border border-blue-100">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Footer Metrics & Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-4">
                   <button 
                      onClick={(e) => handleLike(e, item.id)}
                      className={`flex items-center gap-1 text-xs transition ${item.isLiked ? 'text-lark-600 font-bold' : 'text-gray-400 hover:text-lark-600'}`}
                   >
                      <ThumbsUp size={12} className={item.isLiked ? 'fill-current' : ''} /> {item.likes}
                   </button>
                   <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MessageSquare size={12} /> {item.comments}
                   </div>
                </div>
                
                <div className="flex items-center text-lark-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  查看详情 <ArrowUpRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCases.length === 0 && (
        <div className="col-span-full py-20 text-center bg-white rounded-xl border border-gray-100">
           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300"><Search size={32} /></div>
           <h3 className="text-lg font-bold text-gray-800 mb-2">未找到相关案例</h3>
           <button onClick={clearFilters} className="mt-4 text-lark-600 text-sm font-medium hover:underline">清除所有筛选</button>
        </div>
      )}
    </div>
  );
};

export default CasesPage;
