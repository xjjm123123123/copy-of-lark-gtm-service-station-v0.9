
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Download, FileText, FileBarChart, Presentation, Shield, ThumbsUp, ChevronDown, File, SlidersHorizontal, Briefcase, FileType, X, Share2 } from 'lucide-react';
import { Resource } from '../types';
import { TAXONOMY } from '../constants';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

interface ResourcesPageProps {
  initialSearch?: string;
  onUpload?: () => void;
}

const ResourcesPage: React.FC<ResourcesPageProps> = ({ initialSearch, onUpload }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [sortBy, setSortBy] = useState<'date' | 'downloads' | 'likes'>('date');
  
  // Multi-select
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  // Mock Data
  const resources: Resource[] = [
    { id: '1', title: '2025年新能源汽车行业数字化转型白皮书', category: 'report', fileType: 'pdf', size: '12.5 MB', industry: '大制造', tags: ['行研', '趋势'], uploader: '市场部', updateDate: '2025-12-01', downloads: 1240, likes: 350 },
    // ... (Keep existing data)
    { id: '2', title: 'Lark GTM 通用售前解决方案_V3.0', category: 'pitch', fileType: 'ppt', size: '45.2 MB', industry: '通用', tags: ['售前', '胶片'], uploader: '解决方案部', updateDate: '2025-11-20', downloads: 890, likes: 210 },
    { id: '3', title: '飞书私有化部署招投标技术参数表', category: 'bidding', fileType: 'excel', size: '2.1 MB', industry: '金融', tags: ['招投标', '参数'], uploader: '产研对接', updateDate: '2025-11-15', downloads: 560, likes: 88 },
    { id: '4', title: '某大型央企单一来源采购说明函模板', category: 'single_source', fileType: 'word', size: '500 KB', industry: '通用', tags: ['商务', '模板'], uploader: '销售运营', updateDate: '2025-10-10', downloads: 2300, likes: 520 },
    { id: '5', title: 'ISO27001 信息安全管理体系认证证书', category: 'qualification', fileType: 'zip', size: '5.6 MB', industry: '通用', tags: ['资质', '安全'], uploader: '法务部', updateDate: '2025-01-01', downloads: 3400, likes: 120 },
    { id: '6', title: '零售行业门店巡检立项汇报材料', category: 'initiation', fileType: 'ppt', size: '18.9 MB', industry: '大消费', tags: ['立项', '案例'], uploader: '行业售前', updateDate: '2025-09-05', downloads: 450, likes: 95 },
    { id: '7', title: '先进制造业设备管理解决方案_技术偏离表', category: 'bidding', fileType: 'excel', size: '1.8 MB', industry: '大制造', tags: ['招投标'], uploader: '张三', updateDate: '2025-12-05', downloads: 120, likes: 45 },
    { id: '8', title: '化工行业HSE管理规范', category: 'report', fileType: 'pdf', size: '5.2 MB', industry: '能源化工', tags: ['安全', '标准'], uploader: '解决方案部', updateDate: '2025-11-01', downloads: 880, likes: 150 },
    { id: '9', title: '安全隐患排查标准库', category: 'bidding', fileType: 'excel', size: '1.2 MB', industry: '能源化工', tags: ['安全', '数据库'], uploader: '张三', updateDate: '2025-10-25', downloads: 1200, likes: 300 },
    { id: '10', title: 'IoT设备接入指南_v2.0', category: 'pitch', fileType: 'word', size: '3.4 MB', industry: '通用', tags: ['IoT', '技术'], uploader: '产研对接', updateDate: '2025-09-15', downloads: 600, likes: 110 },
    { id: '11', title: '汽车行业IPD变革白皮书', category: 'report', fileType: 'pdf', size: '8.5 MB', industry: '大制造', tags: ['IPD', '变革'], uploader: '咨询部', updateDate: '2025-11-25', downloads: 950, likes: 180 },
    { id: '12', title: '研发流程SOP', category: 'initiation', fileType: 'word', size: '2.3 MB', industry: '大制造', tags: ['SOP', '研发'], uploader: 'PMO', updateDate: '2025-10-30', downloads: 620, likes: 140 },
    { id: '13', title: 'Meego API 对接文档', category: 'bidding', fileType: 'pdf', size: '4.1 MB', industry: '通用', tags: ['API', '技术'], uploader: '产研对接', updateDate: '2025-09-20', downloads: 400, likes: 90 },
    { id: '14', title: '消费电子终端门店运营手册', category: 'report', fileType: 'pdf', size: '15.2 MB', industry: '大制造', tags: ['门店', '运营'], uploader: '零售行业线', updateDate: '2025-11-10', downloads: 1100, likes: 250 },
    { id: '15', title: '导购培训SOP', category: 'initiation', fileType: 'word', size: '1.5 MB', industry: '大消费', tags: ['培训', 'SOP'], uploader: '培训部', updateDate: '2025-10-15', downloads: 800, likes: 160 },
    { id: '16', title: '应用引擎开发指南', category: 'bidding', fileType: 'pdf', size: '3.8 MB', industry: '通用', tags: ['低代码', '开发'], uploader: '平台生态', updateDate: '2025-08-20', downloads: 550, likes: 120 },
    { id: '17', title: '汽车行业IT架构蓝图_v2.0', category: 'report', fileType: 'ppt', size: '25.6 MB', industry: '大制造', tags: ['架构', '规划'], uploader: '架构部', updateDate: '2025-11-30', downloads: 780, likes: 160 },
    { id: '18', title: '研发效能度量指标体系', category: 'report', fileType: 'pdf', size: '6.8 MB', industry: '大制造', tags: ['效能', '指标'], uploader: 'PMO', updateDate: '2025-10-20', downloads: 920, likes: 210 },
  ];

  const categories = [
    { id: 'all', label: '全部资料' },
    { id: 'report', label: '行研报告' },
    { id: 'pitch', label: 'Pitch材料' },
    { id: 'initiation', label: '立项材料' },
    { id: 'bidding', label: '招投标文件' },
    { id: 'single_source', label: '单一来源' },
    { id: 'qualification', label: '资质文件' },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="text-red-500" size={24} />;
      case 'ppt': return <Presentation className="text-orange-500" size={24} />;
      case 'word': return <FileText className="text-blue-500" size={24} />;
      case 'excel': return <FileBarChart className="text-green-500" size={24} />;
      case 'zip': return <File className="text-gray-500" size={24} />;
      default: return <FileText className="text-gray-400" size={24} />;
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter(item => 
      (activeCategory === 'all' || item.category === activeCategory) &&
      (selectedIndustries.length === 0 || selectedIndustries.includes(item.industry) || item.industry === '通用') &&
      (selectedFileTypes.length === 0 || selectedFileTypes.includes(item.fileType)) &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    ).sort((a, b) => {
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'likes') return b.likes - a.likes;
      return new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime();
    });
  }, [resources, activeCategory, searchQuery, sortBy, selectedIndustries, selectedFileTypes]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustries([]);
    setSelectedFileTypes([]);
  };

  const hasActiveFilters = selectedIndustries.length > 0 || selectedFileTypes.length > 0 || searchQuery !== '';

  const industryOptions = TAXONOMY.INDUSTRIES.map(i => ({ label: i.label, value: i.label }));
  const fileTypeOptions = [
    { label: 'PDF', value: 'pdf' },
    { label: 'PPT / PPTX', value: 'ppt' },
    { label: 'Word / Doc', value: 'word' },
    { label: 'Excel', value: 'excel' },
    { label: '压缩包 (Zip/Rar)', value: 'zip' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">资料中心</h2>
            <p className="text-gray-500 text-sm mt-1">一站式获取最新的行研报告、售前方案与招投标资质文件</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
               <input 
                  type="text" 
                  placeholder="搜索资料名称、标签..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-lark-500 outline-none shadow-sm transition" 
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
                 {sortBy === 'date' ? '最新上传' : (sortBy === 'downloads' ? '最多下载' : '最多点赞')}
                 <ChevronDown size={14} />
               </button>
               <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                  <button onClick={() => setSortBy('date')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'date' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>最新上传</button>
                  <button onClick={() => setSortBy('downloads')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'downloads' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>最多下载</button>
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

        {/* Category Tabs (Horizontal Scroll) */}
        <div className="border-b border-gray-200">
          <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeCategory === cat.id 
                    ? 'border-lark-500 text-lark-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Advanced Filters */}
        <div className={`bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 overflow-visible ${isFilterExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden -mt-2'}`}>
           <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <MultiSelectDropdown label="适用行业 (多选)" icon={Briefcase} options={industryOptions} selectedValues={selectedIndustries} onChange={setSelectedIndustries} />
              <MultiSelectDropdown label="文件格式 (多选)" icon={FileType} options={fileTypeOptions} selectedValues={selectedFileTypes} onChange={setSelectedFileTypes} />
           </div>
           
           {hasActiveFilters && (
             <div className="px-5 pb-4 flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex flex-wrap gap-2 text-xs">
                   {selectedIndustries.map(v => <span key={v} className="px-2 py-1 bg-blue-50 text-blue-600 rounded flex items-center gap-1">行业: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedIndustries(prev => prev.filter(i => i !== v))} /></span>)}
                   {selectedFileTypes.map(v => <span key={v} className="px-2 py-1 bg-orange-50 text-orange-600 rounded flex items-center gap-1">格式: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedFileTypes(prev => prev.filter(i => i !== v))} /></span>)}
                   {searchQuery && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded flex items-center gap-1">搜索: "{searchQuery}"</span>}
                </div>
                <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition"><X size={12} /> 清空筛选</button>
             </div>
           )}
        </div>
      </div>

      {/* Resource List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">资料名称</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase w-32 hidden md:table-cell">行业/领域</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase w-32 hidden lg:table-cell">上传人</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase w-48 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredResources.map((item) => (
              <tr key={item.id} className="hover:bg-lark-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 shrink-0 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        {getFileIcon(item.fileType)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-lark-600 transition-colors cursor-pointer">{item.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="uppercase bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-500">{item.fileType}</span>
                        <span>{item.size}</span>
                        <span>•</span>
                        <span>{item.updateDate}</span>
                        <div className="flex items-center gap-3 ml-2">
                           <span className="flex items-center gap-1 hover:text-lark-500 cursor-pointer"><Download size={12} /> {item.downloads}</span>
                           <span className="flex items-center gap-1 hover:text-lark-500 cursor-pointer"><ThumbsUp size={12} /> {item.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                   <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-700">{item.industry}</span>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">{tag}</span>
                        ))}
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                   {item.uploader}
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-sm font-medium text-lark-600 bg-lark-50 hover:bg-lark-100 border border-lark-200 px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2 ml-auto">
                     <Download size={14} /> 下载
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredResources.length === 0 && (
          <div className="p-12 text-center text-gray-400">
             <Shield size={48} className="mx-auto mb-4 opacity-20" />
             <p>暂无相关资料</p>
             {searchQuery && <button onClick={clearFilters} className="mt-2 text-lark-600 text-sm hover:underline">清除搜索</button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
