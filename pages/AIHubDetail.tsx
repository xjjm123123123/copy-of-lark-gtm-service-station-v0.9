
import React, { useState } from 'react';
import { ArrowLeft, Bot, Play, Share2, Star, ThumbsUp, MessageSquare, ExternalLink, Code, BrainCircuit, Users, Clock, Box, Sparkles, Zap, Info, Copy, FolderOpen } from 'lucide-react';
import { AIAgent } from '../types';

interface AIHubDetailProps {
  agentId: string;
  onBack: () => void;
}

// --- MOCK DATABASE (Sync with AIHubPage) ---
const AI_AGENTS_DATA: Record<string, AIAgent> = {
  'ai-1': {
      id: 'ai-1',
      name: '竞对动态分析助手',
      description: '基于Coze搭建，自动抓取36Kr、虎嗅等媒体关于指定竞对的最新报道，并生成SWOT分析简报。解决市场部每日手动搜集竞对信息的痛点，效率提升10倍。',
      platform: 'Coze',
      model: 'GPT-4o',
      capabilities: ['全网新闻实时抓取', 'SWOT 深度分析', '自动生成日报', '飞书群机器人推送'],
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
    'ai-2': {
      id: 'ai-2',
      name: '售前方案生成器',
      description: '基于Aily开发，输入客户行业和痛点，自动匹配公司案例库，生成初步解决方案PPT大纲。大幅缩短方案编写时间。',
      platform: 'Aily',
      model: 'Gemini 1.5 Pro',
      capabilities: ['RAG 知识库检索', 'PPT 大纲生成', '客户痛点匹配', '成功案例推荐'],
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
    }
};

const DEFAULT_AGENT = AI_AGENTS_DATA['ai-1'];

const AIHubDetail: React.FC<AIHubDetailProps> = ({ agentId, onBack }) => {
  const agent = AI_AGENTS_DATA[agentId] || DEFAULT_AGENT;
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(agent.likes);

  const handleLike = () => {
    if (isLiked) setLikes(prev => prev - 1);
    else setLikes(prev => prev + 1);
    setIsLiked(!isLiked);
  };

  const getPlatformColor = (platform: string) => {
    const map: Record<string, string> = {
      'Coze': 'text-blue-600 bg-blue-50 border-blue-200',
      'Aily': 'text-purple-600 bg-purple-50 border-purple-200',
      'LarkBase': 'text-green-600 bg-green-50 border-green-200',
      'Meego': 'text-orange-600 bg-orange-50 border-orange-200',
    };
    return map[platform] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fadeIn pb-24">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition group">
        <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 返回效率工具
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row gap-8 items-start">
           <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 rounded-3xl flex items-center justify-center shrink-0 shadow-inner border border-indigo-100">
              <Bot size={40} />
           </div>
           
           <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                 <h1 className="text-3xl font-extrabold text-gray-900">{agent.name}</h1>
                 <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getPlatformColor(agent.platform)}`}>
                    {agent.platform}
                 </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 max-w-3xl">{agent.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                 <span className="flex items-center gap-1"><Users size={16}/> 作者: {agent.author}</span>
                 <span className="flex items-center gap-1"><Clock size={16}/> 更新: {agent.updateDate}</span>
                 <span className="flex items-center gap-1"><BrainCircuit size={16}/> 模型: {agent.model}</span>
                 <div className="flex gap-2 ml-2">
                    {agent.tags?.businessCategories?.map(t => (
                       <span key={t} className="px-2 py-0.5 bg-gray-100 rounded text-xs flex items-center gap-1">
                          <FolderOpen size={10} className="text-blue-400"/> {t.split('-')[1]}
                       </span>
                    ))}
                 </div>
              </div>
           </div>

           <div className="flex flex-col gap-3 min-w-[140px]">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition transform hover:-translate-y-0.5">
                 <Play size={18} fill="currentColor" /> 运行助手
              </button>
              <div className="flex items-center justify-center gap-2">
                 <button 
                    onClick={handleLike}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-xl font-medium transition ${isLiked ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                 >
                    <ThumbsUp size={16} className={isLiked ? 'fill-current' : ''} /> {likes}
                 </button>
                 <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition">
                    <Share2 size={16} />
                 </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
           
           {/* Left: Capabilities & Prompts */}
           <div className="lg:col-span-2 p-8 space-y-8">
              {/* Capabilities */}
              <div>
                 <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-yellow-500" /> 核心能力
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agent.capabilities.map((cap, i) => (
                       <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="mt-1 w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i+1}</div>
                          <span className="text-gray-700 font-medium">{cap}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Prompt Example */}
              <div>
                 <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageSquare size={20} className="text-green-500" /> 提示词示例 (Prompt)
                 </h3>
                 <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 relative group">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
                       <button className="p-2 bg-white rounded-lg shadow-sm hover:text-indigo-600 transition" title="复制">
                          <Copy size={14} />
                       </button>
                    </div>
                    <p className="text-gray-600 font-mono text-sm leading-relaxed">{agent.promptExample}</p>
                 </div>
              </div>
           </div>

           {/* Right: Technical Info */}
           <div className="p-8 space-y-8 bg-gray-50/30">
              <div>
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Code size={16} /> 技术规格
                 </h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                       <span className="text-sm text-gray-600">开发平台</span>
                       <span className="text-sm font-medium text-gray-900">{agent.platform}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                       <span className="text-sm text-gray-600">底层模型</span>
                       <span className="text-sm font-medium text-gray-900">{agent.model}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                       <span className="text-sm text-gray-600">版本号</span>
                       <span className="text-sm font-medium text-gray-900">v1.2.0</span>
                    </div>
                 </div>
              </div>

              <div>
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Zap size={16} /> 集成方式
                 </h3>
                 <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 leading-relaxed flex gap-3">
                    <Info size={16} className="shrink-0 mt-0.5" />
                    {agent.integration}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIHubDetail;
