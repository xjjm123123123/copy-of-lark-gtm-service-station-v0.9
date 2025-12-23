
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Play, ExternalLink, ShieldCheck, Car, Cpu, Headset, Factory, ShoppingBag, ChevronDown, SlidersHorizontal, X, Briefcase, Tag, Box, Star, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { DemoApp } from '../types';
import { TAXONOMY } from '../constants';
import { useAnalytics } from '../contexts/AnalyticsContext';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

interface AppCenterPageProps {
  initialSearch?: string;
  onAppClick?: (id: string) => void;
  onUpload?: () => void;
}

const AppCenterPage: React.FC<AppCenterPageProps> = ({ initialSearch, onAppClick, onUpload }) => {
  const { trackEvent, getActionCount, hasUserActed } = useAnalytics();
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  
  // Filter States
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedScenes, setSelectedScenes] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const [sortBy, setSortBy] = useState<'date' | 'heat' | 'status'>('date');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const appsInitial: DemoApp[] = [
    {
      id: '1',
      name: '化工安全生产管理系统',
      description: '基于多维表格与IoT集成，实时监控化工厂区安全隐患，实现隐患随手拍与自动派单整改闭环。',
      industry: '能源化工',
      status: 'active',
      launchUrl: '#',
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      iconType: 'shield',
      updateDate: '2025-12-01',
      heat: 850,
      likes: 120,
      favorites: 45,
      comments: 12,
      tags: {
        industry: ['能源与基础材料', '化工'],
        scene: ['生产制造', '安全生产'],
        target: ['安全总监'],
        product: ['多维表格', '飞书机器人']
      }
    },
    // ... (Keep existing data)
    {
      id: '2',
      name: '钢铁设备全生命周期管理',
      description: '针对高炉、轧机等核心设备，建立“点检-维修-备件”一体化预防性维护模型，降低非计划停机风险。',
      industry: '先进制造',
      status: 'active',
      launchUrl: '#',
      iconBgColor: 'bg-slate-100',
      iconColor: 'text-slate-600',
      iconType: 'factory',
      updateDate: '2025-11-20',
      heat: 620,
      likes: 88,
      favorites: 30,
      comments: 8,
      tags: {
        industry: ['钢铁冶金', '先进制造'],
        scene: ['生产制造', '设备管理'],
        target: ['生产总监', '设备经理'],
        product: ['多维表格', '飞书应用引擎']
      }
    },
    {
      id: '3',
      name: '汽车IPD研发协同平台',
      description: '打通需求、设计、测试全流程，支持万人级研发团队敏捷协作，缩短新车上市周期。',
      industry: '大制造',
      status: 'active',
      launchUrl: '#',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      iconType: 'car',
      updateDate: '2025-12-10',
      heat: 1200,
      likes: 350,
      favorites: 120,
      comments: 45,
      tags: {
        industry: ['大制造', '汽车产业链'],
        scene: ['研发设计', '项目管理', '产品设计'],
        target: ['CTO', '研发总监'],
        product: ['飞书项目', '飞书文档']
      }
    },
    {
      id: '4',
      name: '消费电子智能客服工作台',
      description: '集成IM、邮件、电话多渠道，利用AI知识库辅助坐席快速回复，提升客户服务满意度(CSAT)。',
      industry: '大制造',
      status: 'beta',
      launchUrl: '#',
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      iconType: 'headset',
      updateDate: '2025-10-15',
      heat: 450,
      likes: 60,
      favorites: 20,
      comments: 5,
      tags: {
        industry: ['消费电子与家电'],
        scene: ['营销服务', '售后服务'],
        target: ['客服总监'],
        product: ['飞书IM', '飞书应用引擎']
      }
    },
    {
      id: '5',
      name: '半导体良率分析大屏',
      description: '连接产线MES数据，通过BI看板实时展示晶圆良率趋势，辅助工艺工程师快速定位异常。',
      industry: '大制造',
      status: 'beta',
      launchUrl: '#',
      iconBgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      iconType: 'cpu',
      updateDate: '2025-09-30',
      heat: 380,
      likes: 45,
      favorites: 15,
      comments: 3,
      tags: {
        industry: ['先进制造', '电子元器件'],
        scene: ['生产制造', '质量管理'],
        target: ['生产总监'],
        product: ['AnyCross', '多维表格']
      }
    },
    {
      id: '6',
      name: '新零售门店数字化巡检',
      description: '赋能督导与店长，通过移动端完成标准化巡检动作，数据实时上传总部，提升运营一致性。',
      industry: '大消费',
      status: 'active',
      launchUrl: '#',
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      iconType: 'shopping',
      updateDate: '2025-11-05',
      heat: 980,
      likes: 210,
      favorites: 90,
      comments: 32,
      tags: {
        industry: ['大消费', '零售连锁'],
        scene: ['营销服务', '门店管理'],
        target: ['运营总监', '督导'],
        product: ['多维表格', '飞书任务']
      }
    },
    {
      id: '7',
      name: '消费电子DMS渠道管理',
      description: '连接品牌总部与各级经销商，实现订货、库存、销量数据的实时透明化管理。',
      industry: '大制造',
      status: 'active',
      launchUrl: '#',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      iconType: 'shopping',
      updateDate: '2025-12-08',
      heat: 1100,
      likes: 280,
      favorites: 110,
      comments: 40,
      tags: {
        industry: ['大制造', '消费电子与家电'],
        scene: ['营销服务', '渠道管理'],
        target: ['销售总监'],
        product: ['多维表格', 'AnyCross']
      }
    },
    {
      id: '8',
      name: '车辆试制管理系统',
      description: '管理试制车间的排程、物料与车辆状态，确保试制进度可视可控，加速量产验证。',
      industry: '大制造',
      status: 'active',
      launchUrl: '#',
      iconBgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      iconType: 'car',
      updateDate: '2025-11-25',
      heat: 500,
      likes: 95,
      favorites: 35,
      comments: 10,
      tags: {
        industry: ['大制造', '汽车产业链'],
        scene: ['研发设计', '项目管理'],
        target: ['研发总监'],
        product: ['飞书项目', '多维表格']
      }
    },
    {
      id: '9',
      name: '研发工时填报助手',
      description: '集成于飞书侧边栏，研发人员可快速填报项目工时，自动生成效能报表。',
      industry: '大制造',
      status: 'beta',
      launchUrl: '#',
      iconBgColor: 'bg-gray-100',
      iconColor: 'text-gray-600',
      iconType: 'cpu',
      updateDate: '2025-10-20',
      heat: 300,
      likes: 40,
      favorites: 12,
      comments: 6,
      tags: {
        industry: ['大制造', '互联网'],
        scene: ['研发设计', '项目管理'],
        target: ['PMO总监'],
        product: ['飞书应用引擎']
      }
    },
    {
      id: '10',
      name: '汽车软件OTA管理平台',
      description: '管理车载软件的版本发布与空中升级任务，实时监控升级成功率。',
      industry: '大制造',
      status: 'active',
      launchUrl: '#',
      iconBgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      iconType: 'cpu',
      updateDate: '2025-11-15',
      heat: 700,
      likes: 150,
      favorites: 55,
      comments: 18,
      tags: {
        industry: ['大制造', '汽车产业链'],
        scene: ['研发设计', '产品设计'],
        target: ['CTO'],
        product: ['飞书项目']
      }
    }
  ];

  // Derived state with analytics
  const apps = useMemo(() => {
    return appsInitial.map(app => ({
      ...app,
      likes: (app.likes || 0) + getActionCount('app', app.id, 'like'),
      favorites: (app.favorites || 0) + getActionCount('app', app.id, 'favorite'),
      comments: (app.comments || 0) + getActionCount('app', app.id, 'comment'),
      isLiked: hasUserActed('app', app.id, 'like'),
      isFavorited: hasUserActed('app', app.id, 'favorite')
    }));
  }, [getActionCount, hasUserActed, appsInitial]);

  // Handlers
  const handleLike = (e: React.MouseEvent, id: string) => { e.stopPropagation(); trackEvent('app', id, 'like'); };
  const handleFavorite = (e: React.MouseEvent, id: string) => { e.stopPropagation(); trackEvent('app', id, 'favorite'); };
  const handleCommentBtnClick = (e: React.MouseEvent, id: string) => { e.stopPropagation(); if (onAppClick) onAppClick(id); };

  const getIcon = (type: string) => {
    switch(type) {
      case 'shield': return <ShieldCheck size={28} />;
      case 'car': return <Car size={28} />;
      case 'cpu': return <Cpu size={28} />;
      case 'headset': return <Headset size={28} />;
      case 'factory': return <Factory size={28} />;
      case 'shopping': return <ShoppingBag size={28} />;
      default: return <Cpu size={28} />;
    }
  };

  const filteredApps = useMemo(() => {
    let result = apps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.some(i => app.tags?.industry.some(t => t.includes(i)));
      const matchesScene = selectedScenes.length === 0 || selectedScenes.some(s => app.tags?.scene.some(t => t.includes(s)));
      const matchesProduct = selectedProducts.length === 0 || selectedProducts.some(p => app.tags?.product.some(t => t.includes(p)));

      return matchesSearch && matchesIndustry && matchesScene && matchesProduct;
    });

    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.updateDate || '').getTime() - new Date(a.updateDate || '').getTime();
      if (sortBy === 'heat') return (b.heat || 0) - (a.heat || 0);
      if (sortBy === 'status') return (a.status === 'active' ? 0 : 1) - (b.status === 'active' ? 0 : 1);
      return 0;
    });

    return result;
  }, [apps, searchQuery, selectedIndustries, selectedScenes, selectedProducts, sortBy]);

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
            <h2 className="text-2xl font-bold text-gray-800">应用中心</h2>
            <p className="text-gray-500 text-sm mt-1">沉淀行业最佳实践系统，点击即可在线体验 Demo</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
               <input 
                type="text" 
                placeholder="搜索应用名称、描述..." 
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
                 {sortBy === 'date' ? '最新上线' : (sortBy === 'heat' ? '热度最高' : '状态优先')}
                 <ChevronDown size={14} />
               </button>
               <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                  <button onClick={() => setSortBy('date')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'date' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>最新上线</button>
                  <button onClick={() => setSortBy('heat')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'heat' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>热度最高</button>
                  <button onClick={() => setSortBy('status')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'status' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>状态优先</button>
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
              <MultiSelectDropdown label="构建平台 (多选)" icon={Box} options={productOptions} selectedValues={selectedProducts} onChange={setSelectedProducts} />
           </div>
           {hasActiveFilters && (
             <div className="px-5 pb-4 flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex flex-wrap gap-2 text-xs">
                   {selectedIndustries.map(v => <span key={v} className="px-2 py-1 bg-blue-50 text-blue-600 rounded flex items-center gap-1">行业: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedIndustries(prev => prev.filter(i => i !== v))} /></span>)}
                   {selectedScenes.map(v => <span key={v} className="px-2 py-1 bg-green-50 text-green-600 rounded flex items-center gap-1">场景: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedScenes(prev => prev.filter(i => i !== v))} /></span>)}
                   {selectedProducts.map(v => <span key={v} className="px-2 py-1 bg-orange-50 text-orange-600 rounded flex items-center gap-1">平台: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedProducts(prev => prev.filter(i => i !== v))} /></span>)}
                   {searchQuery && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded flex items-center gap-1">搜索: "{searchQuery}"</span>}
                </div>
                <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition"><X size={12} /> 清空筛选</button>
             </div>
           )}
        </div>
      </div>

      {/* Grid */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {filteredApps.map((app) => (
            <div 
              key={app.id} 
              onClick={() => onAppClick && onAppClick(app.id)}
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full cursor-pointer hover:-translate-y-1 relative"
            >
              <button 
                onClick={(e) => handleFavorite(e, app.id)}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${app.isFavorited ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-500 hover:bg-gray-50'}`}
              >
                <Star size={16} className={app.isFavorited ? 'fill-current' : ''} />
              </button>

              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 ${app.iconBgColor} ${app.iconColor} rounded-2xl flex items-center justify-center shrink-0 shadow-inner`}>
                  {getIcon(app.iconType)}
                </div>
                {app.status === 'active' ? (
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded border border-green-100 mt-1 mr-8">ONLINE</span>
                ) : (
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded border border-indigo-100 mt-1 mr-8">BETA</span>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-lark-600 transition-colors">{app.name}</h3>
              <p className="text-sm text-gray-500 mb-4 flex-1 leading-relaxed line-clamp-2">{app.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                 {app.tags?.scene.slice(0, 2).map(t => (
                    <span key={t} className="px-1.5 py-0.5 bg-gray-50 text-gray-500 text-[10px] rounded border border-gray-100">{t}</span>
                 ))}
                 {app.tags?.product.slice(0, 1).map(t => (
                    <span key={t} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded border border-blue-100">{t}</span>
                 ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                   <button 
                      onClick={(e) => handleLike(e, app.id)}
                      className={`flex items-center gap-1 transition ${app.isLiked ? 'text-lark-600 font-bold' : 'hover:text-lark-600'}`}
                   >
                      <ThumbsUp size={12} className={app.isLiked ? 'fill-current' : ''} /> {app.likes}
                   </button>
                   <button 
                      onClick={(e) => handleCommentBtnClick(e, app.id)}
                      className="flex items-center gap-1 hover:text-lark-600 transition"
                   >
                      <MessageSquare size={12} /> {app.comments}
                   </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-lark-50 text-lark-600 rounded-lg text-sm font-medium hover:bg-lark-500 hover:text-white transition-colors group-hover:shadow-md">
                  <Play size={14} className="fill-current" /> 立即体验
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
           <div className="text-gray-300 mb-4 flex justify-center"><Search size={48} /></div>
           <p className="text-gray-500">未找到与 "{searchQuery}" 相关的应用</p>
           <button onClick={clearFilters} className="mt-4 text-lark-600 text-sm hover:underline">清除搜索与筛选</button>
        </div>
      )}
    </div>
  );
};

export default AppCenterPage;
