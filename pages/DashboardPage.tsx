
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, AreaChart, Area, ComposedChart, ScatterChart, Scatter, ZAxis, Treemap
} from 'recharts';
import { 
  Trophy, TrendingUp, Users, FileText, Box, Target, Download, Eye, 
  Star, ThumbsUp, Activity, Crown, Zap, LayoutGrid, Briefcase, X, ArrowUpRight, Filter, ChevronRight, Scale, AlertTriangle, Percent, Heart, MessageSquare, DollarSign, Smile, Frown, Medal, Calendar, MousePointerClick, Layers, Lightbulb, Map, Bot, Server, ShieldCheck, Database, Building2, Share2
} from 'lucide-react';

type DashboardTab = 'overview' | 'solutions' | 'apps' | 'cases' | 'reviews' | 'resources' | 'battle_map' | 'ai_hub';
type TimeRange = 'day' | 'week' | 'month' | 'quarter' | 'year';

const COLORS = ['#3370ff', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff7875', '#82ca9d', '#a4de6c'];
const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze

// --- 1. MOCK DATA GENERATORS (Per Module) ---

// Solutions (Preserved)
const generateSolutionData = () => {
  const industries = ['大制造', '大消费', '金融', '互联网', '能源化工', '物流运输'];
  const owners = ['张三', '李四', '王五', '赵六', '陈静', '周杰'];
  return Array.from({ length: 40 }).map((_, i) => ({
    id: `sol-${i}`, name: `行业解决方案 ${i+1}.0`, owner: owners[i%owners.length], industry: industries[i%industries.length],
    views: Math.floor(Math.random()*10000), revenue: Math.floor(Math.random()*5000), scoreAI: 70+Math.random()*30
  }));
};

// Apps (New)
const generateAppData = () => {
  const types = ['生产', '营销', 'HR', '财务', '办公'];
  return Array.from({ length: 25 }).map((_, i) => ({
    id: `app-${i}`, name: `应用系统 ${i+1}`, type: types[i%types.length],
    dau: Math.floor(Math.random() * 2000) + 50,
    instances: Math.floor(Math.random() * 50) + 1,
    stability: 95 + Math.random() * 5, // 95-100%
    developer: ['Dev A', 'Dev B', 'Dev C'][i%3]
  }));
};

// Cases (New)
const generateCaseData = () => {
  return Array.from({ length: 30 }).map((_, i) => ({
    id: `case-${i}`, name: `客户案例 ${i+1}`, customer: `客户 ${i+1}`,
    winContribution: Math.floor(Math.random() * 2000) + 100, // Assisted Revenue
    refCount: Math.floor(Math.random() * 100), // Referenced by sales
    industry: ['大制造', '大消费', '金融'][i%3]
  }));
};

// Reviews (New)
const generateReviewData = () => {
  return Array.from({ length: 50 }).map((_, i) => ({
    id: `rev-${i}`, projectName: `项目 ${i+1}`, 
    result: Math.random() > 0.4 ? 'won' : 'lost',
    amount: Math.floor(Math.random() * 1000) + 50,
    reason: ['价格', '产品', '关系', '服务'][Math.floor(Math.random()*4)]
  }));
};

// Battle Map (New)
const generateClientData = () => {
  return Array.from({ length: 60 }).map((_, i) => ({
    id: `cli-${i}`, name: `头部客户 ${i+1}`,
    employees: Math.floor(Math.random() * 50000) + 1000,
    revenue: Math.floor(Math.random() * 1000) + 100, // 亿
    adoption: ['Full', 'Partial', 'None'][Math.floor(Math.random()*3)],
    industry: ['大制造', '大消费', '金融', '互联网'][i%4]
  }));
};

// AI Hub (New)
const generateAgentData = () => {
  return Array.from({ length: 20 }).map((_, i) => ({
    id: `agt-${i}`, name: `AI 助手 ${i+1}`,
    invocations: Math.floor(Math.random() * 10000),
    tokens: Math.floor(Math.random() * 5000000),
    platform: ['Coze', 'Aily', 'Meego'][i%3]
  }));
};

// --- 2. DRILL DOWN DATA FACTORY (Context Aware) ---
const getDrillDownData = (type: string, timeRange: TimeRange, contextData?: any) => {
  let points = 7;
  let labelFormat = (i: number) => `T-${points - i}`;
  
  // Time Axis Logic
  switch (timeRange) {
    case 'day': points = 24; labelFormat = (i) => `${i}:00`; break;
    case 'week': points = 7; labelFormat = (i) => ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]; break;
    case 'month': points = 30; labelFormat = (i) => `${i+1}日`; break;
    case 'quarter': points = 12; labelFormat = (i) => `W${i+1}`; break; 
    case 'year': points = 12; labelFormat = (i) => `${i+1}月`; break;
  }

  const generateSeries = (min: number, max: number) => Array.from({ length: points }).map((_, i) => ({
    name: labelFormat(i),
    value: Math.floor(Math.random() * (max - min)) + min,
    value2: Math.floor(Math.random() * (max - min) * 0.5) + min
  }));

  // --- Dynamic Content Switching ---
  // 1. Solution & Generic Trends
  if (['count', 'heat', 'solution_detail'].includes(type)) {
    return {
      chartType: 'area', title: `${contextData?.name || '趋势'} - 综合热度分析`,
      data: generateSeries(100, 500), dataKeys: [{key:'value', name:'浏览量', color:'#3370ff'}, {key:'value2', name:'互动量', color:'#FF8042'}]
    };
  }
  
  // 2. Financial / Money
  if (['revenue', 'win_amount', 'value'].includes(type)) {
    return {
      chartType: 'bar', title: '业绩贡献趋势 (万元)',
      data: generateSeries(50, 300), dataKeys: [{key:'value', name:'业绩金额', color:'#00C49F'}]
    };
  }

  // 3. App Metrics
  if (['app_dau', 'app_detail'].includes(type)) {
    return {
      chartType: 'line', title: `${contextData?.name || '应用'} - 活跃用户(DAU)趋势`,
      data: generateSeries(200, 1000), dataKeys: [{key:'value', name:'DAU', color:'#8884d8'}]
    };
  }

  // 4. Battle Map / Clients
  if (['client_coverage', 'client_detail'].includes(type)) {
    return {
      chartType: 'bar', title: '客户渗透率/活跃度变化',
      data: generateSeries(10, 100), dataKeys: [{key:'value', name:'活跃人数', color:'#FFBB28'}]
    };
  }

  // 5. Reviews / Win Rate
  if (['review_win', 'review_detail'].includes(type)) {
    return {
      chartType: 'area', title: '赢单率/数量趋势',
      data: generateSeries(5, 20), dataKeys: [{key:'value', name:'赢单数', color:'#3370ff'}, {key:'value2', name:'输单数', color:'#ff7875'}]
    };
  }

  // 6. AI Usage
  if (['ai_token', 'agent_detail'].includes(type)) {
    return {
      chartType: 'line', title: 'Token 消耗与调用次数',
      data: generateSeries(1000, 50000), dataKeys: [{key:'value', name:'Tokens', color:'#8b5cf6'}]
    };
  }

  // Default
  return {
    chartType: 'area', title: '数据趋势',
    data: generateSeries(10, 100), dataKeys: [{key:'value', name:'数值', color:'#3370ff'}]
  };
};

// --- SUB-COMPONENT: DRILL DOWN MODAL ---
const DrillDownModal = ({ title, metricType, timeRange, onClose, detailData }: any) => {
  const chartConfig = useMemo(() => getDrillDownData(metricType, timeRange, detailData), [metricType, timeRange, detailData]);
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Activity size={20} className="text-lark-500"/> {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              分析维度：{timeRange === 'day' ? '今日' : timeRange === 'week' ? '本周' : timeRange === 'month' ? '本月' : timeRange === 'quarter' ? '本季' : '本年'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500"><X size={20} /></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
           <h4 className="text-sm font-bold text-gray-800 mb-4">{chartConfig.title}</h4>
           <div className="h-80 w-full bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                {chartConfig.chartType === 'bar' ? (
                  <BarChart data={chartConfig.data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="name" tick={{fontSize:12}}/>
                    <YAxis tick={{fontSize:12}}/>
                    <Tooltip cursor={{fill: '#f0f0f0'}}/>
                    <Legend />
                    {chartConfig.dataKeys.map((k: any) => <Bar key={k.key} dataKey={k.key} name={k.name} fill={k.color} radius={[4,4,0,0]} />)}
                  </BarChart>
                ) : chartConfig.chartType === 'line' ? (
                   <LineChart data={chartConfig.data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                      <XAxis dataKey="name" tick={{fontSize:12}}/>
                      <YAxis tick={{fontSize:12}}/>
                      <Tooltip />
                      <Legend />
                      {chartConfig.dataKeys.map((k: any) => <Line key={k.key} type="monotone" dataKey={k.key} name={k.name} stroke={k.color} strokeWidth={3} dot={{r:4}} />)}
                   </LineChart>
                ) : (
                  <AreaChart data={chartConfig.data}>
                    <defs>
                      <linearGradient id="colorDrill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartConfig.dataKeys[0].color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartConfig.dataKeys[0].color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="name" tick={{fontSize:12}}/>
                    <YAxis tick={{fontSize:12}}/>
                    <Tooltip />
                    <Legend />
                    {chartConfig.dataKeys.map((k: any, idx: number) => (
                       <Area key={k.key} type="monotone" dataKey={k.key} name={k.name} stroke={k.color} fill={idx===0 ? "url(#colorDrill)" : "none"} />
                    ))}
                  </AreaChart>
                )}
              </ResponsiveContainer>
           </div>
           
           <div className="mt-6">
              <h4 className="text-sm font-bold text-gray-800 mb-3">详细数据明细</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                       <tr><th className="px-4 py-2">时间区间</th><th className="px-4 py-2">数值</th><th className="px-4 py-2">环比变化</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {chartConfig.data.slice(-5).reverse().map((d: any, i: number) => (
                          <tr key={i} className="hover:bg-gray-50">
                             <td className="px-4 py-2 text-gray-700">{d.name}</td>
                             <td className="px-4 py-2 font-bold text-gray-900">{d.value.toLocaleString()}</td>
                             <td className="px-4 py-2 text-green-600 flex items-center gap-1"><TrendingUp size={12}/> +{Math.floor(Math.random()*15)}%</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. MAIN DASHBOARD COMPONENT ---

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('solutions');
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [drillDownItem, setDrillDownItem] = useState<{ title: string, type: string, data?: any } | null>(null);

  // --- DATA INITIALIZATION & CALCULATIONS ---
  const data = useMemo(() => {
    // 1. Solutions Data (Legacy Logic)
    const rawSolutions = generateSolutionData();
    const solutions = rawSolutions.map(s => ({
        ...s,
        heatScore: Math.floor(Math.random()*100),
        qualityScore: Math.floor(Math.random()*100),
        valueScore: Math.floor(Math.random()*100),
        compositeScore: Math.floor(Math.random()*100)
    })).sort((a,b) => b.compositeScore - a.compositeScore);
    
    // Group Solutions by Owner & Industry for charts
    const owners = Object.values(solutions.reduce((acc: any, cur) => {
        if(!acc[cur.owner]) acc[cur.owner] = { name: cur.owner, count: 0, score: 0 };
        acc[cur.owner].count++; acc[cur.owner].score += cur.compositeScore;
        return acc;
    }, {})).map((o: any) => ({...o, avgScore: o.score/o.count})).sort((a: any, b: any) => b.avgScore - a.avgScore);

    const industries = Object.values(solutions.reduce((acc: any, cur) => {
        if(!acc[cur.industry]) acc[cur.industry] = { name: cur.industry, count: 0, heat: 0 };
        acc[cur.industry].count++; acc[cur.industry].heat += cur.views;
        return acc;
    }, {}));

    // 2. Apps Data
    const rawApps = generateAppData();
    const apps = rawApps.map(a => ({ ...a, usageScore: (a.dau * 0.7 + a.instances * 30) / 100 }));
    
    // 3. Cases Data
    const rawCases = generateCaseData();
    const cases = rawCases.sort((a,b) => b.winContribution - a.winContribution);

    // 4. Reviews Data
    const rawReviews = generateReviewData();
    const reviews = {
        won: rawReviews.filter(r => r.result === 'won'),
        lost: rawReviews.filter(r => r.result === 'lost'),
        reasons: rawReviews.reduce((acc:any, cur) => { acc[cur.reason] = (acc[cur.reason] || 0) + 1; return acc; }, {})
    };

    // 5. Clients Data (Battle Map)
    const rawClients = generateClientData();
    const clients = rawClients.map(c => ({
        ...c,
        healthScore: c.adoption === 'Full' ? 90 : (c.adoption === 'Partial' ? 60 : 30)
    }));

    // 6. AI Data
    const rawAgents = generateAgentData();
    const agents = rawAgents.sort((a,b) => b.invocations - a.invocations);

    return { solutions, owners, industries, apps, cases, reviews, clients, agents };
  }, []);

  // --- RENDER HELPERS ---
  const renderTabButton = (id: DashboardTab, label: string, icon: React.ElementType) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
        activeTab === id
          ? 'bg-white text-lark-600 shadow-sm ring-1 ring-black/5'
          : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
      }`}
    >
      {React.createElement(icon, { size: 16 })}
      {label}
    </button>
  );

  const renderKPI = (title: string, value: string | number, change: string, colorClass: string, icon: React.ElementType, onClickType?: string) => (
    <div 
        onClick={() => onClickType && setDrillDownItem({ title: `${title} 趋势分析`, type: onClickType })}
        className={`bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition cursor-pointer group`}
    >
        <div className="flex justify-between items-start">
            <div>
                <div className="text-gray-500 text-xs font-medium mb-1">{title}</div>
                <div className={`text-2xl font-extrabold ${colorClass.replace('bg-', 'text-').replace('-50', '-600')}`}>{value}</div>
            </div>
            <div className={`p-2 rounded-lg ${colorClass} group-hover:scale-110 transition`}>
                {React.createElement(icon, { size: 20 })}
            </div>
        </div>
        <div className="flex justify-between items-center mt-4">
            <span className={`text-xs font-medium flex items-center gap-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                <TrendingUp size={12} className={change.startsWith('-') ? 'rotate-180' : ''}/> {change}
            </span>
            <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition flex items-center gap-1">趋势 <ChevronRight size={10}/></span>
        </div>
    </div>
  );

  const renderRankingList = (title: string, items: any[], nameKey: string, valueKey: string, valueLabel: string) => (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm h-full flex flex-col">
        <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><Crown size={16} className="text-yellow-500"/> {title}</h4>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {items.slice(0, 8).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-1.5 rounded transition">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white shrink-0 ${idx===0 ? 'bg-yellow-400' : idx===1 ? 'bg-gray-400' : idx===2 ? 'bg-orange-400' : 'bg-gray-200 text-gray-500'}`}>
                            {idx + 1}
                        </div>
                        <div className="truncate text-xs font-medium text-gray-700">{item[nameKey]}</div>
                    </div>
                    <div className="text-xs font-bold text-gray-900 group-hover:text-lark-600">{typeof item[valueKey] === 'number' ? item[valueKey].toLocaleString() : item[valueKey]} <span className="text-[10px] font-normal text-gray-400">{valueLabel}</span></div>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">运营总览看板</h2>
          <p className="text-gray-500 text-sm mt-1">全域业务数据实时监控与智能分析</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                {['day', 'week', 'month', 'quarter', 'year'].map(t => (
                    <button 
                        key={t}
                        onClick={() => setTimeRange(t as TimeRange)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${timeRange === t ? 'bg-lark-50 text-lark-600 shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                    >
                        {t === 'day' ? '今日' : t === 'week' ? '本周' : t === 'month' ? '本月' : t === 'quarter' ? '本季' : '本年'}
                    </button>
                ))}
            </div>
            <div className="text-xs text-gray-400 bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2">
                <Activity size={14} className="text-green-500 animate-pulse" />
                Live
            </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="bg-gray-100/50 p-1.5 rounded-xl flex gap-1 overflow-x-auto no-scrollbar border border-gray-200/50">
        {renderTabButton('solutions', '解决方案', Briefcase)}
        {renderTabButton('apps', '应用中心', Box)}
        {renderTabButton('cases', '客户案例', Users)}
        {renderTabButton('reviews', '项目复盘', Target)}
        {renderTabButton('resources', '资料中心', FileText)}
        {renderTabButton('battle_map', '作战地图', Map)}
        {renderTabButton('ai_hub', '效率工具', Bot)}
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="animate-fadeIn min-h-[600px]">
        
        {/* --- TAB: SOLUTIONS (Preserved Original Logic) --- */}
        {activeTab === 'solutions' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {renderKPI('方案总数', data.solutions.length, '+5', 'bg-blue-50', Briefcase, 'count')}
                    {renderKPI('总热度', data.solutions.reduce((a,b)=>a+b.views,0).toLocaleString(), '+12%', 'bg-orange-50', Activity, 'heat')}
                    {renderKPI('平均质量分', '85.4', '+2.1', 'bg-purple-50', Star, 'quality')}
                    {renderKPI('业绩贡献', '¥1.2亿', '+18%', 'bg-green-50', DollarSign, 'revenue')}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-800 mb-4">行业热度分布</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.industries}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                <XAxis dataKey="name" tick={{fontSize:12}}/>
                                <YAxis tick={{fontSize:12}}/>
                                <Tooltip />
                                <Bar dataKey="heat" fill="#3370ff" radius={[4,4,0,0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {renderRankingList('最佳方案榜', data.solutions, 'name', 'compositeScore', '分')}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {renderRankingList('金牌 Owner', data.owners, 'name', 'avgScore', '均分')}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-800 mb-4">价值 vs 质量 矩阵</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <ScatterChart>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="qualityScore" name="质量" unit="分" domain={[0,100]} />
                                <YAxis type="number" dataKey="valueScore" name="价值" unit="分" domain={[0,100]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Solutions" data={data.solutions} fill="#8884d8">
                                    {data.solutions.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

        {/* --- TAB: APPS (New Logic) --- */}
        {activeTab === 'apps' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {renderKPI('应用总数', data.apps.length, '+2', 'bg-blue-50', Box, 'count')}
                    {renderKPI('总日活 (DAU)', data.apps.reduce((a,b)=>a+b.dau,0).toLocaleString(), '+15%', 'bg-green-50', Users, 'app_dau')}
                    {renderKPI('平均稳定性', '99.8%', '+0.1%', 'bg-indigo-50', Server, 'quality')}
                    {renderKPI('部署实例', '420个', '+8%', 'bg-orange-50', Layers, 'count')}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-800 mb-4">应用活跃度 (Top 10)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.apps.sort((a,b)=>b.dau-a.dau).slice(0,10)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false}/>
                                <XAxis type="number" tick={{fontSize:12}}/>
                                <YAxis dataKey="name" type="category" width={100} tick={{fontSize:10}}/>
                                <Tooltip />
                                <Bar dataKey="dau" fill="#8884d8" radius={[0,4,4,0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col">
                        <h4 className="text-sm font-bold text-gray-800 mb-4">应用类型分布</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={[{name:'生产',value:30},{name:'营销',value:25},{name:'办公',value:20},{name:'HR',value:15},{name:'财务',value:10}]} outerRadius={80} dataKey="value">
                                    {COLORS.map((entry, index) => <Cell key={`cell-${index}`} fill={entry} />)}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom"/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

        {/* --- TAB: CASES (New Logic) --- */}
        {activeTab === 'cases' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {renderKPI('标杆案例数', data.cases.length, '+3', 'bg-purple-50', Trophy, 'count')}
                    {renderKPI('赋能赢单金额', '¥8.5亿', '+25%', 'bg-green-50', DollarSign, 'win_amount')}
                    {renderKPI('销售引用次数', data.cases.reduce((a,b)=>a+b.refCount,0), '+40%', 'bg-blue-50', Share2, 'heat')}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-800 mb-4">案例赋能贡献榜 (Assist Revenue)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.cases.slice(0,10)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={false} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="winContribution" fill="#00C49F" name="赋能金额(万)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {renderRankingList('引用热度榜', data.cases.sort((a,b)=>b.refCount-a.refCount), 'name', 'refCount', '次引用')}
                </div>
            </div>
        )}

        {/* --- TAB: REVIEWS (New Logic) --- */}
        {activeTab === 'reviews' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {renderKPI('复盘项目数', data.reviews.won.length + data.reviews.lost.length, '+5', 'bg-gray-50', Target, 'count')}
                    {renderKPI('近期胜率', '62%', '+2%', 'bg-green-50', ThumbsUp, 'review_win')}
                    {renderKPI('赢单总额', `¥${data.reviews.won.reduce((a,b)=>a+b.amount,0)}万`, '+10%', 'bg-red-50', DollarSign, 'win_amount')}
                    {renderKPI('输单总额', `¥${data.reviews.lost.reduce((a,b)=>a+b.amount,0)}万`, '-5%', 'bg-gray-100', X, 'win_amount')}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-800 mb-4">赢单/输单 原因分布</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={Object.entries(data.reviews.reasons).map(([k,v]) => ({name:k, value:v}))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" barSize={50}>
                                  {Object.entries(data.reviews.reasons).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-800 mb-4">金额区间分布</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={[{name:'<50万',value:20},{name:'50-200万',value:40},{name:'200-500万',value:30},{name:'>500万',value:10}]} outerRadius={80} dataKey="value">
                                    {COLORS.map((entry, index) => <Cell key={`cell-${index}`} fill={entry} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

        {/* --- TAB: RESOURCES --- */}
        {activeTab === 'resources' && (
            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl border border-gray-100">
                <FileText size={48} className="text-gray-200 mb-4" />
                <p className="text-gray-500">资料中心数据分析正在接入中...</p>
            </div>
        )}

        {/* --- TAB: BATTLE MAP (New Logic) --- */}
        {activeTab === 'battle_map' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {renderKPI('头部客户数', data.clients.length, '+2', 'bg-indigo-50', Building2, 'count')}
                    {renderKPI('全员点亮率', '35%', '+5%', 'bg-green-50', Zap, 'client_coverage')}
                    {renderKPI('覆盖总营收', '¥15万亿', '+2%', 'bg-blue-50', DollarSign, 'revenue')}
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-[600px]">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">客户价值矩阵 (X:人员规模, Y:营收规模, Color:点亮状态)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid />
                            <XAxis type="number" dataKey="employees" name="人员规模" unit="人" />
                            <YAxis type="number" dataKey="revenue" name="营收" unit="亿" />
                            <ZAxis type="number" dataKey="healthScore" range={[100, 500]} name="健康度" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({active, payload}) => {
                                if(active && payload && payload.length){
                                    const d = payload[0].payload;
                                    return <div className="bg-white p-2 border border-gray-200 shadow rounded text-xs">
                                        <div className="font-bold">{d.name}</div>
                                        <div>{d.industry} - {d.adoption}</div>
                                        <div>规模: {d.employees}人, 营收: {d.revenue}亿</div>
                                    </div>
                                }
                                return null;
                            }}/>
                            <Legend />
                            <Scatter name="已点亮" data={data.clients.filter(c=>c.adoption==='Full')} fill="#22c55e" shape="circle" />
                            <Scatter name="部分点亮" data={data.clients.filter(c=>c.adoption==='Partial')} fill="#eab308" shape="triangle" />
                            <Scatter name="未点亮" data={data.clients.filter(c=>c.adoption==='None')} fill="#9ca3af" shape="cross" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}

        {/* --- TAB: AI HUB (New Logic) --- */}
        {activeTab === 'ai_hub' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {renderKPI('AI 工具数', data.agents.length, '+2', 'bg-purple-50', Bot, 'count')}
                    {renderKPI('总调用次数', data.agents.reduce((a,b)=>a+b.invocations,0).toLocaleString(), '+150%', 'bg-blue-50', MousePointerClick, 'agent_detail')}
                    {renderKPI('Token 消耗', `${(data.agents.reduce((a,b)=>a+b.tokens,0)/1000000).toFixed(1)}M`, '+80%', 'bg-indigo-50', Database, 'ai_token')}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
                    {renderRankingList('最热 AI 助手', data.agents, 'name', 'invocations', '次调用')}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-800 mb-4">平台分布</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={[{name:'Coze',value:45},{name:'Aily',value:30},{name:'Meego',value:15},{name:'Other',value:10}]} innerRadius={60} outerRadius={100} dataKey="value">
                                    {[ '#8884d8', '#82ca9d', '#ffc658', '#ff8042'].map((col, idx) => <Cell key={idx} fill={col} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* Drill Down Modal */}
      {drillDownItem && (
        <DrillDownModal 
          title={drillDownItem.title} 
          metricType={drillDownItem.type} 
          timeRange={timeRange} 
          onClose={() => setDrillDownItem(null)} 
          detailData={drillDownItem.data}
        />
      )}

    </div>
  );
};

export default DashboardPage;
