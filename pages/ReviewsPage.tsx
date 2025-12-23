
import React, { useState, useMemo } from 'react';
import { Filter, Trophy, XCircle, ChevronRight, SlidersHorizontal, ChevronDown, Search, X, Briefcase, CheckCircle2, Share2 } from 'lucide-react';
import { ProjectReview } from '../types';
import { TAXONOMY } from '../constants';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

interface ReviewsPageProps {
  onReviewClick: (id: string) => void;
  onUpload?: () => void;
}

const ReviewsPage: React.FC<ReviewsPageProps> = ({ onReviewClick, onUpload }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const reviews: ProjectReview[] = [
    {
      id: '1',
      projectName: '某大型股份制银行协同办公项目',
      result: 'won',
      amount: '800万',
      competitor: '竞对A',
      reason: '产品体验极致，能够满足内网部署的高安全性要求。',
      industry: '金融',
      owner: '王金',
      date: '2025-08-15',
      tags: ['私有化部署', '信创适配']
    },
    // ... (Keep existing data)
    {
      id: '2',
      projectName: '某头部物流企业数字化升级',
      result: 'lost',
      amount: '350万',
      competitor: '竞对B',
      reason: '价格差距过大，且客户对IM的依赖度低，更看重ERP集成能力。',
      industry: '供应物流', // Aligned with TAXONOMY L1
      owner: '赵流',
      date: '2025-09-20',
      tags: ['价格战', '需求错位']
    },
    {
      id: '3',
      projectName: '科技独角兽企业全员上飞书',
      result: 'won',
      amount: '500万',
      competitor: '无',
      reason: '客户高层是飞书粉丝，自上而下推动，无需教育成本。',
      industry: '互联网',
      owner: '孙网',
      date: '2025-10-10',
      tags: ['高层推动', '口碑传播']
    },
     {
      id: '4',
      projectName: '某连锁餐饮集团门店管理',
      result: 'lost',
      amount: '200万',
      competitor: '竞对C',
      reason: '竞对提供了硬件+软件的一体化方案，我们纯软件方案落地阻力大。',
      industry: '大消费', // Aligned with TAXONOMY L1
      owner: '李餐',
      date: '2025-10-05',
      tags: ['软硬一体', '解决方案缺失']
    },
    {
      id: '5',
      projectName: '未来汽车集团研发协同项目',
      result: 'won',
      amount: '1200万',
      competitor: '竞对D',
      reason: '飞书项目(Meego)完美契合IPD研发流程，解决跨部门协作痛点。',
      industry: '大制造', // Aligned with TAXONOMY L1
      owner: '张三',
      date: '2025-11-15',
      tags: ['IPD变革', '万人协同']
    },
    {
      id: '6',
      projectName: '某知名消费电子品牌DMS项目',
      result: 'won',
      amount: '450万',
      competitor: '竞对E',
      reason: '多维表格搭建的轻量级DMS系统，上线快、成本低，深得业务部门喜爱。',
      industry: '大制造',
      owner: '陈静',
      date: '2025-12-01',
      tags: ['低代码', '渠道管理']
    },
    {
      id: '7',
      projectName: '某大型能源国企安全管理系统',
      result: 'won',
      amount: '680万',
      competitor: '竞对F',
      reason: 'IoT集成能力强，且私有化部署满足国企数据安全红线。',
      industry: '能源化工',
      owner: '刘伟',
      date: '2025-11-20',
      tags: ['安全生产', 'IoT集成']
    },
    {
      id: '8',
      projectName: '超级零售连锁门店数字化项目',
      result: 'won',
      amount: '320万',
      competitor: '竞对G',
      reason: '移动端体验极佳，一线店员零培训上手，巡检效率提升显著。',
      industry: '大消费',
      owner: '李雷',
      date: '2025-12-05',
      tags: ['门店巡检', '一线赋能']
    }
  ];

  const filteredReviews = useMemo(() => {
    let result = reviews.filter(item => {
      const matchesSearch = item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.tags.some(t => t.includes(searchQuery));
      const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(item.industry);
      const matchesResult = selectedResults.length === 0 || selectedResults.includes(item.result);

      return matchesSearch && matchesIndustry && matchesResult;
    });

    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'amount') {
        const amountA = parseInt(a.amount.replace(/\D/g, '')) || 0;
        const amountB = parseInt(b.amount.replace(/\D/g, '')) || 0;
        return amountB - amountA;
      }
      return 0;
    });

    return result;
  }, [reviews, searchQuery, selectedIndustries, selectedResults, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustries([]);
    setSelectedResults([]);
  };

  const hasActiveFilters = selectedIndustries.length > 0 || selectedResults.length > 0 || searchQuery !== '';

  const industryOptions = TAXONOMY.INDUSTRIES.map(i => ({ label: i.label, value: i.label }));
  const resultOptions = [
    { label: '赢单 (Won)', value: 'won' },
    { label: '输单 (Lost)', value: 'lost' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">项目复盘</h2>
            <p className="text-gray-500 text-sm mt-1">胜败乃兵家常事，复盘是进步阶梯</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
               <input 
                 type="text" 
                 placeholder="搜索项目、标签..." 
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
                 {sortBy === 'date' ? '最新复盘' : '金额最高'}
                 <ChevronDown size={14} />
               </button>
               <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                  <button onClick={() => setSortBy('date')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'date' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>最新复盘</button>
                  <button onClick={() => setSortBy('amount')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'amount' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>金额最高</button>
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
           <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <MultiSelectDropdown label="客户行业 (多选)" icon={Briefcase} options={industryOptions} selectedValues={selectedIndustries} onChange={setSelectedIndustries} />
              <MultiSelectDropdown label="复盘结果 (多选)" icon={CheckCircle2} options={resultOptions} selectedValues={selectedResults} onChange={setSelectedResults} />
           </div>
           
           {hasActiveFilters && (
             <div className="px-5 pb-4 flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex flex-wrap gap-2 text-xs">
                   {selectedIndustries.map(v => <span key={v} className="px-2 py-1 bg-blue-50 text-blue-600 rounded flex items-center gap-1">行业: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedIndustries(prev => prev.filter(i => i !== v))} /></span>)}
                   {selectedResults.map(v => <span key={v} className={`px-2 py-1 rounded flex items-center gap-1 ${v === 'won' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>结果: {v === 'won' ? '赢单' : '输单'} <X size={10} className="cursor-pointer" onClick={() => setSelectedResults(prev => prev.filter(i => i !== v))} /></span>)}
                   {searchQuery && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded flex items-center gap-1">搜索: "{searchQuery}"</span>}
                </div>
                <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition"><X size={12} /> 清空筛选</button>
             </div>
           )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4 animate-fadeIn">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((item) => (
            <div 
              key={item.id}
              onClick={() => onReviewClick(item.id)}
              className="group bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Status Strip */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.result === 'won' ? 'bg-green-500' : 'bg-gray-400'}`}></div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pl-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {item.result === 'won' ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-bold rounded border border-green-100 uppercase">
                        <Trophy size={12} /> Won
                      </span>
                    ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded border border-gray-200 uppercase">
                        <XCircle size={12} /> Lost
                      </span>
                    )}
                    <span className="text-xs text-gray-400 font-mono">{item.date}</span>
                    <span className="text-xs text-gray-400 px-1.5 py-0.5 bg-gray-50 rounded">{item.industry}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-lark-600 transition-colors mb-2">
                    {item.projectName}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    <span className="font-semibold text-gray-700">关键因素：</span>{item.reason}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-8 shrink-0 text-sm">
                  <div className="text-center w-24">
                    <div className="text-gray-400 text-xs mb-1">项目金额</div>
                    <div className="font-bold text-gray-800">{item.amount}</div>
                  </div>
                  <div className="text-center w-24 hidden md:block">
                    <div className="text-gray-400 text-xs mb-1">主要竞对</div>
                    <div className="font-medium text-gray-800">{item.competitor}</div>
                  </div>
                  <div className="text-center w-20 hidden md:block">
                    <div className="text-gray-400 text-xs mb-1">负责人</div>
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-5 h-5 bg-lark-100 rounded-full text-[10px] flex items-center justify-center text-lark-600">{item.owner[0]}</div>
                        <span className="text-gray-700">{item.owner}</span>
                    </div>
                  </div>
                  <div className="text-gray-300 group-hover:text-lark-500 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
             <div className="text-gray-300 mb-4 flex justify-center"><Search size={48} /></div>
             <p className="text-gray-500">未找到相关复盘记录</p>
             <button onClick={clearFilters} className="mt-4 text-lark-600 text-sm hover:underline">清除搜索与筛选</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
