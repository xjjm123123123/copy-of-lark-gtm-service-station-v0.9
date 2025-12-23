import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, PanelRightClose, PanelRightOpen, TrendingUp, Search, Lightbulb, FileText, UserCheck, MessageSquare, ArrowRight, Box, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { generateGTMResponse } from '../services/geminiService';
import { ChatMessage, NavTab, RecommendationItem } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

interface AssistantSidebarProps {
  onNavigate?: (tab: NavTab, id?: string) => void;
}

const COLORS = ['#3370ff', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AssistantSidebar: React.FC<AssistantSidebarProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: '我是你的 GTM 智能助手。我可以帮你查找站内方案、案例、资料，也可以分析数据。试试问我：“帮我找一下制造业的方案” 或 “统计一下方案的行业分布”。', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API (Only text for context)
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    
    try {
      const responseJsonString = await generateGTMResponse(text, history);
      let responseData: any = {};
      
      try {
        responseData = JSON.parse(responseJsonString);
      } catch (e) {
        // Fallback if not valid JSON
        responseData = { text: responseJsonString };
      }

      const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: responseData.text || '我好像遇到了一点问题，请重试。',
        recommendations: responseData.recommendations,
        chartData: responseData.chartData,
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: '网络请求失败，请稍后再试。', timestamp: new Date() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (item: RecommendationItem) => {
    // Navigate based on type
    if (!onNavigate) return;
    
    switch(item.type) {
      case 'solution': onNavigate(NavTab.SOLUTIONS, item.id); break;
      case 'case': onNavigate(NavTab.CASES, item.id); break;
      case 'app': onNavigate(NavTab.APP_CENTER, item.id); break;
      case 'review': onNavigate(NavTab.REVIEW, item.id); break;
      case 'resource': onNavigate(NavTab.RESOURCES, item.title); break; // Resources search by name usually
      default: break;
    }
  };

  const renderChart = (chart: any) => {
    if (!chart || !chart.data) return null;

    return (
      <div className="mt-3 bg-white rounded-xl border border-gray-100 p-3 h-64 w-full shadow-sm">
        <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
          {chart.type === 'pie' ? <PieChartIcon size={12}/> : <BarChart2 size={12}/>}
          {chart.title}
        </h4>
        <ResponsiveContainer width="100%" height="90%">
          {chart.type === 'pie' ? (
            <PieChart>
              <Pie data={chart.data} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" nameKey="name">
                {chart.data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{fontSize: '10px'}}/>
            </PieChart>
          ) : (
            <BarChart data={chart.data}>
              <XAxis dataKey="name" tick={{fontSize: 10}} />
              <YAxis tick={{fontSize: 10}} />
              <Tooltip />
              <Bar dataKey="value" fill="#3370ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  const quickTools = [
    { label: '找方案', icon: Lightbulb, color: 'text-yellow-600', bg: 'bg-yellow-50', prompt: '帮我推荐几个适合大制造行业的解决方案。' },
    { label: '查案例', icon: FileText, color: 'text-green-600', bg: 'bg-green-50', prompt: '最近有哪些赢单的客户案例？' },
    { label: '看数据', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', prompt: '统计一下目前解决方案的行业分布情况。' },
    { label: '搜应用', icon: Box, color: 'text-orange-600', bg: 'bg-orange-50', prompt: '推荐一些安全生产相关的应用。' },
  ];

  return (
    <aside 
      className={`bg-white border-l border-gray-200 h-[calc(100vh-64px)] sticky top-16 flex flex-col shadow-sm shrink-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-80' : 'w-14'}`}
    >
      {/* Header / Toggle Area */}
      <div className={`flex items-center justify-between p-3 border-b border-gray-100 ${isOpen ? '' : 'flex-col gap-4'}`}>
        {isOpen ? (
           <div className="flex items-center gap-2">
              <Sparkles className="text-lark-500 w-5 h-5" />
              <h2 className="font-semibold text-gray-800 text-sm">GTM 助手</h2>
           </div>
        ) : (
           <button onClick={() => setIsOpen(true)} className="p-1 hover:bg-gray-100 rounded-full text-lark-500 mt-1 transition">
              <Sparkles className="w-6 h-6" />
           </button>
        )}
        
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          title={isOpen ? "收起" : "展开"}
        >
          {isOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
        </button>
      </div>

      {/* Chat Content - Only visible when open */}
      <div className={`flex-1 flex flex-col overflow-hidden bg-gray-50/50 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all duration-200`}>
        
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.length === 1 && (
             <div className="grid grid-cols-2 gap-2 mb-4">
             {quickTools.map((tool) => (
               <button
                 key={tool.label}
                 onClick={() => handleSendMessage(tool.prompt)}
                 className={`${tool.bg} p-3 rounded-lg flex flex-col items-center justify-center gap-2 hover:opacity-80 transition cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-sm h-20`}
               >
                 <tool.icon className={`${tool.color} w-5 h-5`} />
                 <span className="text-xs text-gray-700 font-medium">{tool.label}</span>
               </button>
             ))}
           </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* Text Bubble */}
              <div className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-lark-500 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }`}>
                {msg.text}
              </div>

              {/* Recommendations Cards */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="mt-2 w-[90%] space-y-2">
                  {msg.recommendations.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleCardClick(item)}
                      className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:border-lark-300 hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{item.type}</span>
                        <ArrowRight size={14} className="text-gray-300 group-hover:text-lark-500 transition-colors"/>
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm mb-1 leading-snug group-hover:text-lark-600 transition-colors line-clamp-2">{item.title}</h4>
                      {item.desc && <p className="text-xs text-gray-500 line-clamp-2">{item.desc}</p>}
                      {item.tag && <div className="mt-2 flex flex-wrap gap-1"><span className="text-[10px] bg-lark-50 text-lark-600 px-1.5 rounded">{item.tag}</span></div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Chart */}
              {msg.chartData && (
                <div className="w-[90%]">
                  {renderChart(msg.chartData)}
                </div>
              )}

            </div>
          ))}
           {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-200">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="搜方案、查数据..."
              className="w-full pl-4 pr-10 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-lark-500 focus:ring-1 focus:ring-lark-500 rounded-full text-sm outline-none transition-all"
            />
            <button 
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="absolute right-1.5 top-1.5 p-1.5 bg-lark-500 text-white rounded-full hover:bg-lark-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Collapsed State Visuals (Vertical Text) */}
      {!isOpen && (
        <div 
          className="flex-1 flex flex-col items-center pt-6 cursor-pointer hover:bg-gray-50 transition-colors" 
          onClick={() => setIsOpen(true)}
        >
           <div 
             className="text-sm font-medium text-gray-400 tracking-widest hover:text-lark-600 transition-colors"
             style={{ writingMode: 'vertical-lr', textOrientation: 'upright' }}
           >
              智能助手
           </div>
        </div>
      )}
    </aside>
  );
};

export default AssistantSidebar;