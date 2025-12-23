
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown, ChevronUp, X, Building2, MapPin, Users, Target, ShieldCheck, Zap, AlertTriangle, Layers, ArrowUpRight, FolderOpen, Folder, Factory, ShoppingBag, Wallet, LayoutGrid, CheckCircle2, Circle, Check } from 'lucide-react';
import { ClientAccount } from '../types';
import { TAXONOMY } from '../constants';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

interface BattleMapPageProps {
  onClientClick: (id: string) => void;
}

const BattleMapPage: React.FC<BattleMapPageProps> = ({ onClientClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Multi-select States
  const [selectedIndustryL1, setSelectedIndustryL1] = useState<string[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string[]>([]); // SA, KA, Mid, LongTail
  const [selectedStrategy, setSelectedStrategy] = useState<string[]>([]); // Gold, Silver, Avoid
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]); // Full, Partial, None
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<'employees' | 'revenue'>('employees');
  
  // State for collapsible L1 sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    '大制造': true, '大消费': true, '金融': true, '其他': true
  });

  // State for collapsible L2 sections
  const [expandedSubSections, setExpandedSubSections] = useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setExpandedSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const toggleSubSection = (l1: string, l2: string) => {
    const key = `${l1}-${l2}`;
    setExpandedSubSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isSubSectionExpanded = (l1: string, l2: string) => {
    const key = `${l1}-${l2}`;
    return expandedSubSections[key] !== false; // Default to true
  };

  // Expanded Mock Data with ~30 Manufacturing Clients and Province Info
  const clients: ClientAccount[] = [
    // --- 大制造 (Manufacturing) - 汽车产业链 (9) ---
    { id: 'm-auto-1', name: '未来汽车', industry: '大制造', subIndustry: '汽车产业链', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Full', employees: 15000, revenue: '300亿', owner: '张三', logoUrl: 'https://ui-avatars.com/api/?name=F&background=0D8ABC&color=fff', region: '上海', province: '上海', tags: ['新能源', '整车'] },
    // ... (Keep existing clients data)
    { id: 'm-auto-2', name: '比亚迪', industry: '大制造', subIndustry: '汽车产业链', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Full', employees: 570000, revenue: '4200亿', owner: '王力', logoUrl: 'https://ui-avatars.com/api/?name=B&background=e11d48&color=fff', region: '深圳', province: '广东', tags: ['电池', '整车'] },
    { id: 'm-auto-3', name: '宁德时代', industry: '大制造', subIndustry: '汽车产业链', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 80000, revenue: '3200亿', owner: '李能', logoUrl: 'https://ui-avatars.com/api/?name=C&background=059669&color=fff', region: '宁德', province: '福建', tags: ['电池', '龙头'] },
    { id: 'm-auto-4', name: '吉利控股', industry: '大制造', subIndustry: '汽车产业链', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 120000, revenue: '3600亿', owner: '赵吉', logoUrl: 'https://ui-avatars.com/api/?name=G&background=2563eb&color=fff', region: '杭州', province: '浙江', tags: ['整车', '全球化'] },
    { id: 'm-auto-5', name: '长城汽车', industry: '大制造', subIndustry: '汽车产业链', segment: 'KA', strategy: 'Silver', adoptionStatus: 'Partial', employees: 70000, revenue: '1300亿', owner: '孙城', logoUrl: 'https://ui-avatars.com/api/?name=G&background=4b5563&color=fff', region: '保定', province: '河北', tags: ['整车', 'SUV'] },
    { id: 'm-auto-6', name: '理想汽车', industry: '大制造', subIndustry: '汽车产业链', segment: 'KA', strategy: 'Gold', adoptionStatus: 'Full', employees: 15000, revenue: '450亿', owner: '李想', logoUrl: 'https://ui-avatars.com/api/?name=L&background=f59e0b&color=fff', region: '北京', province: '北京', tags: ['新势力', '家庭'] },
    { id: 'm-auto-7', name: '蔚来汽车', industry: '大制造', subIndustry: '汽车产业链', segment: 'KA', strategy: 'Gold', adoptionStatus: 'Full', employees: 20000, revenue: '490亿', owner: '吴蔚', logoUrl: 'https://ui-avatars.com/api/?name=N&background=000&color=fff', region: '上海', province: '上海', tags: ['新势力', '服务'] },
    { id: 'm-auto-8', name: '小鹏汽车', industry: '大制造', subIndustry: '汽车产业链', segment: 'KA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 13000, revenue: '260亿', owner: '何鹏', logoUrl: 'https://ui-avatars.com/api/?name=X&background=10b981&color=fff', region: '广州', province: '广东', tags: ['新势力', '智驾'] },
    { id: 'm-auto-9', name: '上汽集团', industry: '大制造', subIndustry: '汽车产业链', segment: 'SA', strategy: 'Silver', adoptionStatus: 'None', employees: 200000, revenue: '7000亿', owner: '陈汽', logoUrl: 'https://ui-avatars.com/api/?name=S&background=1d4ed8&color=fff', region: '上海', province: '上海', tags: ['国企', '合资'] },

    // --- 大制造 (Manufacturing) - 消费电子 (8) ---
    { id: 'm-ce-1', name: '某家电巨头', industry: '大制造', subIndustry: '消费电子产业链', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 100000, revenue: '3000亿', owner: '吴电', logoUrl: 'https://ui-avatars.com/api/?name=M&background=0ea5e9&color=fff', region: '佛山', province: '广东', tags: ['家电', '全球化'] },
    { id: 'm-ce-2', name: '立讯精密', industry: '大制造', subIndustry: '消费电子产业链', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Full', employees: 170000, revenue: '2100亿', owner: '赵立', logoUrl: 'https://ui-avatars.com/api/?name=L&background=ef4444&color=fff', region: '东莞', province: '广东', tags: ['果链', '精密'] },
    { id: 'm-ce-3', name: '小米集团', industry: '大制造', subIndustry: '消费电子产业链', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 30000, revenue: '2800亿', owner: '雷总', logoUrl: 'https://ui-avatars.com/api/?name=X&background=f97316&color=fff', region: '北京', province: '北京', tags: ['手机', 'IoT'] },
    { id: 'm-ce-4', name: '京东方', industry: '大制造', subIndustry: '消费电子产业链', segment: 'SA', strategy: 'Silver', adoptionStatus: 'None', employees: 80000, revenue: '1700亿', owner: '王屏', logoUrl: 'https://ui-avatars.com/api/?name=B&background=3b82f6&color=fff', region: '北京', province: '北京', tags: ['面板', '国企'] },
    { id: 'm-ce-5', name: '歌尔股份', industry: '大制造', subIndustry: '消费电子产业链', segment: 'KA', strategy: 'Gold', adoptionStatus: 'Full', employees: 80000, revenue: '1000亿', owner: '姜歌', logoUrl: 'https://ui-avatars.com/api/?name=G&background=6366f1&color=fff', region: '潍坊', province: '山东', tags: ['声学', 'VR'] },
    { id: 'm-ce-6', name: '传音控股', industry: '大制造', subIndustry: '消费电子产业链', segment: 'KA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 16000, revenue: '460亿', owner: '朱音', logoUrl: 'https://ui-avatars.com/api/?name=T&background=06b6d4&color=fff', region: '深圳', province: '广东', tags: ['出海', '手机'] },
    { id: 'm-ce-7', name: '大疆创新', industry: '大制造', subIndustry: '消费电子产业链', segment: 'KA', strategy: 'Avoid', adoptionStatus: 'None', employees: 14000, revenue: '300亿', owner: '汪飞', logoUrl: 'https://ui-avatars.com/api/?name=D&background=000&color=fff', region: '深圳', province: '广东', tags: ['无人机', '硬核'] },
    { id: 'm-ce-8', name: '安克创新', industry: '大制造', subIndustry: '消费电子产业链', segment: 'KA', strategy: 'Gold', adoptionStatus: 'Full', employees: 3500, revenue: '140亿', owner: '阳克', logoUrl: 'https://ui-avatars.com/api/?name=A&background=22c55e&color=fff', region: '长沙', province: '湖南', tags: ['出海', '配件'] },

    // --- 大制造 (Manufacturing) - 能源化工 (6) ---
    { id: 'm-en-1', name: '中石化某厂', industry: '大制造', subIndustry: '能源化工', segment: 'KA', strategy: 'Silver', adoptionStatus: 'Partial', employees: 4000, revenue: '200亿', owner: '刘伟', logoUrl: 'https://ui-avatars.com/api/?name=S&background=dc2626&color=fff', region: '南京', province: '江苏', tags: ['化工', '安全'] },
    { id: 'm-en-2', name: '中国石油', industry: '大制造', subIndustry: '能源化工', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 500000, revenue: '2万亿', owner: '孙油', logoUrl: 'https://ui-avatars.com/api/?name=P&background=dc2626&color=fff', region: '北京', province: '北京', tags: ['央企', '能源'] },
    { id: 'm-en-3', name: '隆基绿能', industry: '大制造', subIndustry: '能源化工', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Full', employees: 60000, revenue: '1200亿', owner: '李光', logoUrl: 'https://ui-avatars.com/api/?name=L&background=16a34a&color=fff', region: '西安', province: '陕西', tags: ['光伏', '龙头'] },
    { id: 'm-en-4', name: '通威股份', industry: '大制造', subIndustry: '能源化工', segment: 'SA', strategy: 'Silver', adoptionStatus: 'None', employees: 40000, revenue: '1400亿', owner: '刘威', logoUrl: 'https://ui-avatars.com/api/?name=T&background=0ea5e9&color=fff', region: '成都', province: '四川', tags: ['光伏', '饲料'] },
    { id: 'm-en-5', name: '万华化学', industry: '大制造', subIndustry: '能源化工', segment: 'KA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 20000, revenue: '1600亿', owner: '廖化', logoUrl: 'https://ui-avatars.com/api/?name=W&background=3b82f6&color=fff', region: '烟台', province: '山东', tags: ['化工', '国企'] },
    { id: 'm-en-6', name: '晶科能源', industry: '大制造', subIndustry: '能源化工', segment: 'KA', strategy: 'Gold', adoptionStatus: 'Full', employees: 30000, revenue: '800亿', owner: '陈晶', logoUrl: 'https://ui-avatars.com/api/?name=J&background=84cc16&color=fff', region: '上饶', province: '江西', tags: ['光伏', '出海'] },

    // --- 大制造 (Manufacturing) - 钢铁冶金 (4) ---
    { id: 'm-st-1', name: '某钢铁集团', industry: '大制造', subIndustry: '钢铁冶金', segment: 'SA', strategy: 'Gold', adoptionStatus: 'None', employees: 20000, revenue: '800亿', owner: '陈钢', logoUrl: 'https://ui-avatars.com/api/?name=S&background=475569&color=fff', region: '唐山', province: '河北', tags: ['钢铁', '国企'] },
    { id: 'm-st-2', name: '宝武钢铁', industry: '大制造', subIndustry: '钢铁冶金', segment: 'SA', strategy: 'Silver', adoptionStatus: 'None', employees: 200000, revenue: '9000亿', owner: '周铁', logoUrl: 'https://ui-avatars.com/api/?name=B&background=1e293b&color=fff', region: '上海', province: '上海', tags: ['央企', '钢铁'] },
    { id: 'm-st-3', name: '沙钢集团', industry: '大制造', subIndustry: '钢铁冶金', segment: 'SA', strategy: 'Avoid', adoptionStatus: 'None', employees: 30000, revenue: '2000亿', owner: '沈沙', logoUrl: 'https://ui-avatars.com/api/?name=S&background=64748b&color=fff', region: '张家港', province: '江苏', tags: ['民企', '钢铁'] },
    { id: 'm-st-4', name: '紫金矿业', industry: '大制造', subIndustry: '钢铁冶金', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 40000, revenue: '2700亿', owner: '陈矿', logoUrl: 'https://ui-avatars.com/api/?name=Z&background=fbbf24&color=fff', region: '龙岩', province: '福建', tags: ['有色', '出海'] },

    // --- 大制造 (Manufacturing) - 其他制造 (3) ---
    { id: 'm-om-1', name: '三一重工', industry: '大制造', subIndustry: '其他制造', segment: 'KA', strategy: 'Gold', adoptionStatus: 'Full', employees: 30000, revenue: '800亿', owner: '郑工', logoUrl: 'https://ui-avatars.com/api/?name=S&background=ef4444&color=fff', region: '长沙', province: '湖南', tags: ['工程机械', '出海'] },
    { id: 'm-om-2', name: '徐工机械', industry: '大制造', subIndustry: '其他制造', segment: 'KA', strategy: 'Silver', adoptionStatus: 'Partial', employees: 28000, revenue: '900亿', owner: '王机', logoUrl: 'https://ui-avatars.com/api/?name=X&background=f59e0b&color=fff', region: '徐州', province: '江苏', tags: ['工程机械', '国企'] },
    { id: 'm-om-3', name: '中联重科', industry: '大制造', subIndustry: '其他制造', segment: 'KA', strategy: 'Silver', adoptionStatus: 'None', employees: 20000, revenue: '400亿', owner: '詹联', logoUrl: 'https://ui-avatars.com/api/?name=Z&background=10b981&color=fff', region: '长沙', province: '湖南', tags: ['工程机械'] },

    // --- 大消费 (Consumption) ---
    { id: 'c2', name: '超级零售连锁', industry: '大消费', subIndustry: '零售连锁', segment: 'KA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 50000, revenue: '500亿', owner: '李雷', logoUrl: 'https://ui-avatars.com/api/?name=S&background=e11d48&color=fff', region: '北京', province: '北京', tags: ['连锁', '商超'] },
    { id: 'c19', name: '海底捞', industry: '大消费', subIndustry: '零售连锁', segment: 'KA', strategy: 'Silver', adoptionStatus: 'Full', employees: 100000, revenue: '400亿', owner: '冯吃', logoUrl: 'https://ui-avatars.com/api/?name=H&background=ef4444&color=fff', region: '北京', province: '北京', tags: ['餐饮', '服务'] },
    { id: 'c4', name: '创新生物医药', industry: '大消费', subIndustry: '医药医疗', segment: 'KA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 5000, revenue: '80亿', owner: '赵六', logoUrl: 'https://ui-avatars.com/api/?name=I&background=0ea5e9&color=fff', region: '苏州', province: '江苏', tags: ['医药', '合规'] },
    
    // --- 金融 (Finance) ---
    { id: 'c5', name: '某大型股份制银行', industry: '金融', subIndustry: '银行业', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 30000, revenue: '1000亿', owner: '王金', logoUrl: 'https://ui-avatars.com/api/?name=B&background=ef4444&color=fff', region: '北京', province: '北京', tags: ['银行业', '国企'] },
    { id: 'c14', name: '工商银行', industry: '金融', subIndustry: '银行业', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Partial', employees: 400000, revenue: '8000亿', owner: '钱行', logoUrl: 'https://ui-avatars.com/api/?name=I&background=ef4444&color=fff', region: '北京', province: '北京', tags: ['国有行'] },
    { id: 'c20', name: '中国平安', industry: '金融', subIndustry: '保险业', segment: 'SA', strategy: 'Gold', adoptionStatus: 'Full', employees: 300000, revenue: '1万亿', owner: '马保', logoUrl: 'https://ui-avatars.com/api/?name=P&background=f97316&color=fff', region: '深圳', province: '广东', tags: ['保险', '综合金融'] },

    // --- 其他 (Others) ---
    { id: 'c3', name: 'Global Tech Inc', industry: '其他', subIndustry: '互联网', segment: 'SA', strategy: 'Silver', adoptionStatus: 'Full', employees: 8000, revenue: '150亿', owner: '王五', logoUrl: 'https://ui-avatars.com/api/?name=G&background=3b82f6&color=fff', region: '深圳', province: '广东', tags: ['出海', 'SaaS'] },
    { id: 'c13', name: 'SHEIN', industry: '其他', subIndustry: '互联网', segment: 'KA', strategy: 'Silver', adoptionStatus: 'Partial', employees: 10000, revenue: '1000亿', owner: '陈衣', logoUrl: 'https://ui-avatars.com/api/?name=S&background=000&color=fff', region: '广州', province: '广东', tags: ['电商', '快时尚'] },
    { id: 'c6', name: '某物流企业', industry: '其他', subIndustry: '物流运输', segment: 'Mid', strategy: 'Avoid', adoptionStatus: 'None', employees: 2000, revenue: '10亿', owner: '赵流', logoUrl: 'https://ui-avatars.com/api/?name=L&background=f59e0b&color=fff', region: '广州', province: '广东', tags: ['物流', '传统'] },
  ];

  // Distinct list of provinces
  const ALL_PROVINCES = Array.from(new Set(clients.map(c => c.province).filter(Boolean) as string[])).sort();

  // Filtering Logic
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          client.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchIndustry = selectedIndustryL1.length === 0 || selectedIndustryL1.includes(client.industry);
      const matchSegment = selectedSegment.length === 0 || selectedSegment.includes(client.segment);
      const matchStrategy = selectedStrategy.length === 0 || selectedStrategy.includes(client.strategy);
      const matchStatus = selectedStatus.length === 0 || selectedStatus.includes(client.adoptionStatus);
      const matchProvince = selectedProvinces.length === 0 || (client.province && selectedProvinces.includes(client.province));

      return matchSearch && matchIndustry && matchSegment && matchStrategy && matchStatus && matchProvince;
    }).sort((a, b) => {
        if (sortBy === 'employees') return b.employees - a.employees;
        // Simple string comparison for mock revenue
        return b.revenue.localeCompare(a.revenue);
    });
  }, [clients, searchQuery, selectedIndustryL1, selectedSegment, selectedStrategy, selectedStatus, selectedProvinces, sortBy]);

  // Group by Level 1 then Level 2
  const groupedClients = useMemo(() => {
    const hierarchy: Record<string, Record<string, ClientAccount[]>> = {};

    TAXONOMY.INDUSTRIES.forEach(l1 => {
      hierarchy[l1.label] = {};
      l1.children.forEach(l2Obj => {
        const l2Label = typeof l2Obj === 'string' ? l2Obj : l2Obj.label;
        hierarchy[l1.label][l2Label] = [];
      });
    });

    filteredClients.forEach(client => {
      if (!hierarchy[client.industry]) hierarchy[client.industry] = {};
      if (!hierarchy[client.industry][client.subIndustry]) hierarchy[client.industry][client.subIndustry] = [];
      hierarchy[client.industry][client.subIndustry].push(client);
    });

    return hierarchy;
  }, [filteredClients]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustryL1([]);
    setSelectedSegment([]);
    setSelectedStrategy([]);
    setSelectedStatus([]);
    setSelectedProvinces([]);
  };

  const hasActiveFilters = selectedIndustryL1.length > 0 || selectedSegment.length > 0 || selectedStrategy.length > 0 || selectedStatus.length > 0 || selectedProvinces.length > 0 || searchQuery !== '';

  const industryOptions = TAXONOMY.INDUSTRIES.map(i => ({ label: i.label, value: i.label }));
  const provinceOptions = ALL_PROVINCES.map(p => ({ label: p, value: p }));
  const segmentOptions = [
    { label: 'SA (超大型)', value: 'SA' },
    { label: 'KA (大型)', value: 'KA' },
    { label: 'Mid (中腰部)', value: 'Mid' },
    { label: 'LongTail (长尾)', value: 'LongTail' },
  ];
  const strategyOptions = [
    { label: '黄金客户', value: 'Gold' },
    { label: '中优客户', value: 'Silver' },
    { label: '避坑客户', value: 'Avoid' },
  ];
  const statusOptions = [
    { label: '全员点亮', value: 'Full' },
    { label: '部分点亮', value: 'Partial' },
    { label: '未点亮', value: 'None' },
  ];

  // --- Visual Helpers ---
  const renderStrategyBadge = (strategy: string) => {
    switch (strategy) {
      case 'Gold': return (<span className="flex items-center gap-1 px-1.5 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded border border-yellow-200"><Target size={10} className="fill-yellow-600 text-yellow-600"/> 黄金</span>);
      case 'Silver': return (<span className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 text-slate-600 text-[10px] font-medium rounded border border-slate-200"><ShieldCheck size={10} /> 中优</span>);
      case 'Avoid': return (<span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-medium rounded border border-red-100"><AlertTriangle size={10} /> 避坑</span>);
      default: return null;
    }
  };

  const renderAdoptionStatus = (status: string) => {
    switch (status) {
      case 'Full': return (<div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100"><Zap size={10} className="fill-green-500" /> 全员</div>);
      case 'Partial': return (<div className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100"><Zap size={10} className="fill-yellow-500" /> 部分</div>);
      case 'None': return (<div className="flex items-center gap-1 text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100"><Circle size={8} /> 未点</div>);
      default: return null;
    }
  };

  const getSegmentBadge = (segment: string) => {
      const colors: Record<string, string> = {
          'SA': 'bg-purple-50 text-purple-700 border-purple-100',
          'KA': 'bg-blue-50 text-blue-700 border-blue-100',
          'Mid': 'bg-cyan-50 text-cyan-700 border-cyan-100',
          'LongTail': 'bg-gray-50 text-gray-600 border-gray-100'
      };
      return <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${colors[segment] || colors['LongTail']}`}>{segment}</span>
  };

  const formatEmployees = (num: number) => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1).replace('.0', '') + '万';
    }
    return num.toLocaleString();
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">作战地图</h2>
            <p className="text-gray-500 text-sm mt-1">头部客户全景看板：按行业纵深，识别机会，精准拓客</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
               <input 
                 type="text" 
                 placeholder="搜索客户名称、标签..." 
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
                 排序
                 <ChevronDown size={14} />
               </button>
               <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                  <button onClick={() => setSortBy('employees')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'employees' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>按人员规模</button>
                  <button onClick={() => setSortBy('revenue')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition ${sortBy === 'revenue' ? 'text-lark-600 font-medium' : 'text-gray-700'}`}>按营收规模</button>
               </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <div className={`bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 overflow-visible mt-2 ${isFilterExpanded ? 'max-h-96 opacity-100 p-5' : 'max-h-0 opacity-0 overflow-hidden'}`}>
             <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                <MultiSelectDropdown label="所属行业 (多选)" icon={Building2} options={industryOptions} selectedValues={selectedIndustryL1} onChange={setSelectedIndustryL1} />
                <MultiSelectDropdown label="所在省份 (多选)" icon={MapPin} options={provinceOptions} selectedValues={selectedProvinces} onChange={setSelectedProvinces} />
                <MultiSelectDropdown label="客户分类 (多选)" icon={Layers} options={segmentOptions} selectedValues={selectedSegment} onChange={setSelectedSegment} />
                <MultiSelectDropdown label="拓展建议 (多选)" icon={Target} options={strategyOptions} selectedValues={selectedStrategy} onChange={setSelectedStrategy} />
                <MultiSelectDropdown label="飞书点亮 (多选)" icon={Zap} options={statusOptions} selectedValues={selectedStatus} onChange={setSelectedStatus} />
             </div>
             {hasActiveFilters && (
               <div className="px-5 pb-4 flex items-center justify-between border-t border-gray-50 pt-3 mt-4 -mx-5 -mb-5">
                  <div className="flex flex-wrap gap-2 text-xs">
                     {selectedIndustryL1.map(v => <span key={v} className="px-2 py-1 bg-blue-50 text-blue-600 rounded flex items-center gap-1">行业: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedIndustryL1(prev => prev.filter(i => i !== v))} /></span>)}
                     {selectedProvinces.map(v => <span key={v} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded flex items-center gap-1">省份: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedProvinces(prev => prev.filter(i => i !== v))} /></span>)}
                     {selectedSegment.map(v => <span key={v} className="px-2 py-1 bg-purple-50 text-purple-600 rounded flex items-center gap-1">分类: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedSegment(prev => prev.filter(i => i !== v))} /></span>)}
                     {selectedStrategy.map(v => <span key={v} className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded flex items-center gap-1">建议: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedStrategy(prev => prev.filter(i => i !== v))} /></span>)}
                     {selectedStatus.map(v => <span key={v} className="px-2 py-1 bg-green-50 text-green-600 rounded flex items-center gap-1">状态: {v} <X size={10} className="cursor-pointer" onClick={() => setSelectedStatus(prev => prev.filter(i => i !== v))} /></span>)}
                     {searchQuery && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded flex items-center gap-1">搜索: "{searchQuery}"</span>}
                  </div>
                  <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition">
                     <X size={12} /> 清空筛选
                  </button>
               </div>
             )}
          </div>
      </div>

      {/* Content Area - Grouped by Level 1 and then Level 2 */}
      <div className="space-y-8 animate-fadeIn">
        {TAXONOMY.INDUSTRIES.map((l1) => {
          const l1Label = l1.label;
          const l2Groups = groupedClients[l1Label];
          
          // Check if there are any clients in this L1 industry
          const hasClients = l2Groups && Object.values(l2Groups).some((arr: ClientAccount[]) => arr.length > 0);
          
          if (!hasClients) return null;

          return (
            <div key={l1Label} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              {/* L1 Header - Collapsible */}
              <div 
                className="bg-white px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition border-b border-gray-100 sticky top-16 z-20 rounded-t-2xl shadow-sm"
                onClick={() => toggleSection(l1Label)}
              >
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-lark-600 shadow-sm">
                       {l1Label === '大制造' && <Factory size={20} />}
                       {l1Label === '大消费' && <ShoppingBag size={20} />}
                       {l1Label === '金融' && <Building2 size={20} />}
                       {l1Label === '其他' && <FolderOpen size={20} />}
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-gray-900">{l1Label}</h3>
                       <p className="text-xs text-gray-500">
                          共 {Object.values(l2Groups).reduce((sum: number, arr: ClientAccount[]) => sum + arr.length, 0)} 家头部客户
                       </p>
                    </div>
                 </div>
                 <div className="text-gray-400">
                    {expandedSections[l1Label] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                 </div>
              </div>

              {/* L2 Sections */}
              {expandedSections[l1Label] && (
                <div className="p-6 space-y-6 bg-gray-50/20 rounded-b-2xl">
                   {l1.children.map(l2Obj => {
                      const l2Label = typeof l2Obj === 'string' ? l2Obj : l2Obj.label;
                      const clients = l2Groups[l2Label];
                      
                      if (!clients || clients.length === 0) return null;
                      
                      const isL2Expanded = isSubSectionExpanded(l1Label, l2Label);

                      return (
                         <div key={l2Label} className="border border-gray-100 rounded-xl bg-white overflow-hidden shadow-sm flex flex-col">
                            {/* L2 Header - Clickable for Collapse */}
                            <div 
                              className="px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition border-b border-gray-100"
                              onClick={() => toggleSubSection(l1Label, l2Label)}
                            >
                               <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                  <div className="w-1.5 h-1.5 rounded-full bg-lark-400"></div>
                                  {l2Label} 
                                  <span className="text-xs font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{clients.length}</span>
                               </h4>
                               <div className="text-gray-300 hover:text-gray-500">
                                  {isL2Expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                               </div>
                            </div>
                            
                            {/* Client Grid - Scrollable Container */}
                            {isL2Expanded && (
                              <div className="max-h-[800px] overflow-y-auto p-4 custom-scrollbar bg-gray-50/30">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 animate-fadeIn">
                                   {clients.map(client => (
                                      <div 
                                        key={client.id}
                                        onClick={() => onClientClick(client.id)}
                                        className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md hover:border-lark-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col gap-2"
                                      >
                                        {/* Top Row: Logo, Name, Emp */}
                                        <div className="flex items-start gap-2">
                                            <div className="w-8 h-8 rounded-md border border-gray-100 bg-white p-0.5 shrink-0 flex items-center justify-center">
                                               <img src={client.logoUrl} alt={client.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-lark-600 transition">{client.name}</h4>
                                                    {/* Segment Badge - Small */}
                                                    <div className="scale-75 origin-right -ml-2">{getSegmentBadge(client.segment)}</div>
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] text-gray-500 bg-gray-100 px-1 rounded flex items-center gap-0.5 whitespace-nowrap">
                                                        <Users size={8} /> {formatEmployees(client.employees)}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5 truncate" title={`${client.province} ${client.region}`}>
                                                        <MapPin size={8} /> {client.province || client.region}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Bottom Row: Status Tags */}
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 gap-1">
                                             {/* Strategy */}
                                             <div className="scale-90 origin-left">{renderStrategyBadge(client.strategy)}</div>
                                             {/* Adoption */}
                                             <div className="scale-90 origin-right">{renderAdoptionStatus(client.adoptionStatus)}</div>
                                        </div>
                                      </div>
                                   ))}
                                </div>
                              </div>
                            )}
                         </div>
                      );
                   })}
                </div>
              )}
            </div>
          );
        })}

        {filteredClients.length === 0 && (
          <div className="py-20 text-center text-gray-400">
             <Search size={48} className="mx-auto mb-4 opacity-20" />
             <p>未找到匹配的客户</p>
             <button onClick={clearFilters} className="mt-4 text-lark-600 text-sm hover:underline">清除筛选</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleMapPage;
