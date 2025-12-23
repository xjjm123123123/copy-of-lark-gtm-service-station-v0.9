import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Image as ImageIcon, Sparkles, Link as LinkIcon, Loader2, Globe, PenTool, RefreshCw, Wand2 } from 'lucide-react';
import { generateGTMResponse } from '../services/geminiService';
import { TAXONOMY } from '../constants';
import { ResearchArticle, ArticleContent } from '../types';

interface ArticleUploadPageProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
  onPublish: (summary: ResearchArticle, detail: ArticleContent) => void;
}

const ArticleUploadPage: React.FC<ArticleUploadPageProps> = ({ onBack, onSubmitSuccess, onPublish }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isAiPolishing, setIsAiPolishing] = useState(false);
  
  // Smart Import State
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  
  // Hierarchy State
  const [industryL1, setIndustryL1] = useState('');
  const [industryL2, setIndustryL2] = useState('');
  const [scenarioL1, setScenarioL1] = useState('');
  const [scenarioL2, setScenarioL2] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: '资讯洞察',
    sourceType: 'original', // 'original' | 'external'
    sourceLink: '',
    author: '刘伟',
    role: '行业分析师',
    summary: '',
    content: '',
    coverUrl: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Derived Options for Selects
  const industryL2Options = TAXONOMY.INDUSTRIES.find(i => i.label === industryL1)?.children || [];
  const scenarioL2Options = TAXONOMY.SCENARIOS.find(s => s.label === scenarioL1)?.children || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- AI Smart Import Logic ---
  const handleSmartImport = async () => {
    if (!importUrl.trim()) return;
    setIsImporting(true);
    setIsGeneratingCover(false);

    try {
      // 1. Rule-based Source Classification
      const isFeishu = importUrl.includes('feishu.cn') || importUrl.includes('larksuite.com');
      const detectedSourceType = isFeishu ? 'original' : 'external';

      // 2. Prepare Context for AI
      // We send the taxonomy structure so AI can pick the exact strings
      const taxonomyContext = JSON.stringify({
        industries: TAXONOMY.INDUSTRIES.map(i => ({ label: i.label, children: i.children.map(c => c.label) })),
        scenarios: TAXONOMY.SCENARIOS.map(s => ({ label: s.label, children: s.children.map(c => c.label) })),
        categories: ['资讯洞察', '最佳实践', '市场分析', '竞对观察', '政策解读']
      });

      const prompt = `
        我正在发布一篇行业资讯。请根据我提供的链接：${importUrl}
        
        请扮演一个爬虫和行业分析师，完成以下任务：
        1. 模拟抓取该链接的标题、正文内容（保留原文，不要总结）。
        2. 基于内容，写一段300-500字的深度内容摘要（summary）。
        3. 分析内容，从以下分类体系中匹配最精准的行业和业务领域（必须严格匹配提供的名称）：
           分类体系参考：${taxonomyContext}
        4. 推测作者和发布日期。
        5. 尝试提取封面图URL。如果不像图片链接或无法提取，请返回 "GENERATE_REQUIRED"。

        请务必返回纯 JSON 格式字符串，不要包含 Markdown 标记（如 \`\`\`json ），格式如下：
        {
          "title": "文章标题",
          "summary": "300-500字的深度摘要...",
          "content": "原文正文内容...",
          "author": "作者名",
          "date": "YYYY-MM-DD",
          "industryL1": "一级行业名称",
          "industryL2": "二级行业名称",
          "scenarioL1": "一级场景名称",
          "scenarioL2": "二级场景名称",
          "category": "资讯分类名称",
          "coverUrl": "图片链接 或 GENERATE_REQUIRED"
        }
      `;

      const responseText = await generateGTMResponse(prompt, []);
      
      // Clean up potential markdown formatting from AI
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);

      // Batch Update State
      setFormData(prev => ({
        ...prev,
        title: data.title || '',
        summary: data.summary || '',
        content: data.content || '',
        author: data.author || (detectedSourceType === 'external' ? '外部媒体' : 'GTM 专家'),
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || '资讯洞察',
        sourceType: detectedSourceType,
        sourceLink: importUrl,
        // If extracted URL is valid use it, else we will generate later
        coverUrl: (data.coverUrl && data.coverUrl !== 'GENERATE_REQUIRED') ? data.coverUrl : '' 
      }));

      // Set Hierarchies
      if (data.industryL1) setIndustryL1(data.industryL1);
      // Wait a tick for L1 to settle if we were using real effects, but here strictly setting state works for controlled inputs if we passed options correctly. 
      // However, simplified approach:
      if (data.industryL2) setIndustryL2(data.industryL2);
      if (data.scenarioL1) setScenarioL1(data.scenarioL1);
      if (data.scenarioL2) setScenarioL2(data.scenarioL2);

      // Handle Image Generation if needed
      if (!data.coverUrl || data.coverUrl === 'GENERATE_REQUIRED' || data.coverUrl === '') {
         generateCoverImage(data.summary || data.title);
      }

    } catch (error) {
      console.error("Import failed", error);
      alert("AI 智能解析失败，请检查链接或手动填写。");
    } finally {
      setIsImporting(false);
    }
  };

  // Mock Image Generation
  const generateCoverImage = (context: string) => {
    setIsGeneratingCover(true);
    setTimeout(() => {
      // Use a random picsum image with a consistent seed based on length to simulate "generation"
      const seed = context.length;
      const mockGeneratedUrl = `https://picsum.photos/800/400?random=${seed}`;
      setFormData(prev => ({ ...prev, coverUrl: mockGeneratedUrl }));
      setIsGeneratingCover(false);
    }, 2000); // Simulate network delay
  };

  const handleAiPolish = async () => {
    if (!formData.summary.trim()) return;
    
    setIsAiPolishing(true);
    const prompt = `请作为一个专业的行业分析师，帮我润色以下文章摘要。使其语言更加专业、精炼，突出行业洞察价值。保留原有核心意思，字数控制在300字左右。\n\n原文：${formData.summary}`;
    
    const polishedText = await generateGTMResponse(prompt, []);
    setFormData(prev => ({ ...prev, summary: polishedText }));
    setIsAiPolishing(false);
  };

  const handleSubmit = () => {
    // 1. Construct ResearchArticle (List View)
    const newId = Date.now().toString();
    const newSummaryArticle: ResearchArticle = {
      id: newId,
      title: formData.title,
      summary: formData.summary,
      author: formData.author || '匿名',
      sourceType: formData.sourceType as 'original' | 'external',
      sourceName: formData.sourceType === 'external' ? '外部来源' : undefined,
      category: formData.category,
      industry: industryL1 || '通用',
      imageUrl: formData.coverUrl || 'https://picsum.photos/400/250?grayscale',
      date: formData.date,
      views: 0,
      likes: 0,
      favorites: 0,
      comments: 0,
      tags: [industryL1, scenarioL1].filter(Boolean),
      isLiked: false,
      isFavorited: false
    };

    // 2. Construct ArticleContent (Detail View)
    const newDetailArticle: ArticleContent = {
      title: formData.title,
      author: formData.author || '匿名',
      role: formData.role,
      date: formData.date,
      readTime: Math.ceil(formData.content.length / 500) + ' min read', // Simple calc
      views: '0',
      imageUrl: formData.coverUrl || 'https://picsum.photos/800/400?grayscale',
      content: formData.content, // Should be HTML or converted to HTML
      category: formData.category,
      initialLikes: 0,
      initialCommentsCount: 0
    };

    onPublish(newSummaryArticle, newDetailArticle);

    setSubmitted(true);
    setTimeout(() => {
      onSubmitSuccess();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-7xl mx-auto h-full flex items-center justify-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center max-w-lg w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">发布成功</h2>
          <p className="text-gray-500 mb-6">您的资讯洞察已发布，正推送给相关订阅用户。</p>
          <button onClick={onSubmitSuccess} className="bg-lark-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-lark-600 transition">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fadeIn pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">发布资讯洞察</h1>
            <p className="text-sm text-gray-500 mt-1">分享行业洞察、市场分析与趋势预测</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition">取消</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-lark-500 text-white hover:bg-lark-600 rounded-lg text-sm font-medium transition shadow-sm">发布资讯</button>
        </div>
      </div>

      {/* AI Smart Import Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                <Sparkles size={18} />
             </div>
             <div>
                <h3 className="text-sm font-bold text-gray-900">AI 智能导入</h3>
                <p className="text-xs text-gray-500">粘贴链接，AI 自动解析标题、摘要、正文，并匹配行业与场景分类</p>
             </div>
          </div>
          <div className="flex gap-3">
             <div className="flex-1 relative">
                <LinkIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="粘贴公众号文章、36Kr新闻或飞书文档链接..." 
                  className="w-full pl-10 pr-4 py-2.5 border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white/80"
                />
             </div>
             <button 
               onClick={handleSmartImport}
               disabled={isImporting || !importUrl}
               className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition flex items-center gap-2 min-w-[120px] justify-center shadow-sm"
             >
               {isImporting ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16} />}
               {isImporting ? '智能解析中...' : '智能解析'}
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-l-4 border-lark-500 pl-3">资讯基本信息</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">文章标题 <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition font-bold text-gray-800" 
                  placeholder="例如：2025年新能源汽车行业数字化转型趋势洞察" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">资讯来源类型</label>
                    <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                       <button 
                         onClick={() => setFormData(prev => ({ ...prev, sourceType: 'original' }))}
                         className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition ${formData.sourceType === 'original' ? 'bg-white text-lark-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          <PenTool size={12}/> GTM 原创
                       </button>
                       <button 
                         onClick={() => setFormData(prev => ({ ...prev, sourceType: 'external' }))}
                         className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition ${formData.sourceType === 'external' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          <Globe size={12}/> 外部资讯
                       </button>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">原文链接</label>
                    <input 
                      type="text" 
                      name="sourceLink"
                      value={formData.sourceLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition text-sm text-gray-600" 
                      placeholder="https://..." 
                    />
                 </div>
              </div>

              {/* Classification Hierarchies */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">资讯相关行业</label>
                       <div className="flex gap-2">
                          <select 
                            value={industryL1} 
                            onChange={(e) => { setIndustryL1(e.target.value); setIndustryL2(''); }}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-lark-500 bg-white"
                          >
                             <option value="">一级行业</option>
                             {TAXONOMY.INDUSTRIES.map(i => <option key={i.label} value={i.label}>{i.label}</option>)}
                          </select>
                          <select 
                            value={industryL2} 
                            onChange={(e) => setIndustryL2(e.target.value)}
                            disabled={!industryL1}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-lark-500 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                          >
                             <option value="">二级行业</option>
                             {industryL2Options.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                          </select>
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">资讯相关业务领域</label>
                       <div className="flex gap-2">
                          <select 
                            value={scenarioL1} 
                            onChange={(e) => { setScenarioL1(e.target.value); setScenarioL2(''); }}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-lark-500 bg-white"
                          >
                             <option value="">一级领域</option>
                             {TAXONOMY.SCENARIOS.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
                          </select>
                          <select 
                            value={scenarioL2} 
                            onChange={(e) => setScenarioL2(e.target.value)}
                            disabled={!scenarioL1}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-lark-500 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                          >
                             <option value="">二级领域</option>
                             {scenarioL2Options.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                          </select>
                       </div>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/60">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">资讯分类</label>
                        <select 
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none bg-white"
                        >
                          <option value="资讯洞察">资讯洞察</option>
                          <option value="最佳实践">最佳实践</option>
                          <option value="市场分析">市场分析</option>
                          <option value="竞对观察">竞对观察</option>
                          <option value="政策解读">政策解读</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">发布者/作者</label>
                        <input 
                          type="text" 
                          name="author"
                          value={formData.author}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" 
                          placeholder="例如：高级行业分析师" 
                        />
                    </div>
                 </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between items-center">
                   <span>内容摘要 (AI 自动总结 300-500字) <span className="text-red-500">*</span></span>
                   <button 
                      onClick={handleAiPolish}
                      disabled={isAiPolishing || !formData.summary}
                      className={`text-xs flex items-center gap-1 transition ${isAiPolishing ? 'text-gray-400' : 'text-indigo-600 hover:text-indigo-700'}`}
                   >
                      <Sparkles size={12} /> {isAiPolishing ? 'AI 优化中...' : 'AI 优化摘要'}
                   </button>
                </label>
                <textarea 
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={6} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition resize-none leading-relaxed text-sm" 
                  placeholder="此处将显示 AI 根据原文自动生成的深度摘要，您也可以手动编辑..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-[600px]">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-lark-500 pl-3">原文内容</h3>
            <div className="flex-1 border border-gray-200 rounded-lg bg-gray-50/30 relative">
               <textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full h-full p-4 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed" 
                  placeholder="此处将显示 AI 抓取的原文内容 (支持 Markdown 格式)..."
               ></textarea>
               {/* Toolbar Placeholder */}
               <div className="absolute bottom-4 right-4 flex gap-2">
                  <span className="text-xs text-gray-400 bg-white/80 px-2 py-1 rounded backdrop-blur-sm border border-gray-100">支持 Markdown 编辑</span>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           {/* Cover Image Section - Enhanced for AI Generation */}
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">封面设置</h3>
              <div className="space-y-4">
                 <div className="relative group rounded-lg overflow-hidden border-2 border-dashed border-gray-200 hover:border-lark-300 transition h-48 bg-gray-50 flex flex-col items-center justify-center">
                    
                    {formData.coverUrl ? (
                       <>
                          <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                             <button onClick={() => setFormData(prev => ({...prev, coverUrl: ''}))} className="p-2 bg-white/20 text-white rounded-full hover:bg-white/40 transition">
                                <RefreshCw size={16} />
                             </button>
                          </div>
                       </>
                    ) : (
                       isGeneratingCover ? (
                          <div className="flex flex-col items-center text-indigo-500 animate-pulse">
                             <Wand2 size={32} className="mb-2" />
                             <span className="text-xs font-medium">AI 正在根据摘要生成封面...</span>
                          </div>
                       ) : (
                          <div className="flex flex-col items-center text-gray-400 cursor-pointer" onClick={() => generateCoverImage(formData.summary || formData.title)}>
                             <ImageIcon size={32} className="mb-2 text-gray-300" />
                             <span className="text-xs font-medium text-gray-500">AI 自动匹配/生成</span>
                             <span className="text-[10px] text-gray-300 mt-1">或点击手动上传</span>
                          </div>
                       )
                    )}
                 </div>
                 
                 {/* Generation Prompt if needed */}
                 {!formData.coverUrl && !isGeneratingCover && (
                    <button 
                      onClick={() => generateCoverImage(formData.summary || formData.title)}
                      disabled={!formData.title && !formData.summary}
                      className="w-full py-2 text-xs flex items-center justify-center gap-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                       <Wand2 size={12} /> 手动触发 AI 生成封面
                    </button>
                 )}
              </div>
           </div>

           {/* Removed "Release Settings" as requested, keeping Layout clean */}
           <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                 <CheckCircle2 size={16} /> AI 辅助检查
              </h3>
              <ul className="text-xs text-blue-700 space-y-2 leading-relaxed opacity-80 list-disc pl-4">
                 <li>已自动匹配行业分类：<span className="font-bold">{industryL1 || '-'}</span></li>
                 <li>已自动匹配业务场景：<span className="font-bold">{scenarioL1 || '-'}</span></li>
                 <li>摘要字数检查：<span className={formData.summary.length > 300 ? 'text-green-600 font-bold' : 'text-orange-500'}>{formData.summary.length} 字</span></li>
                 <li>封面图状态：{formData.coverUrl ? '✅ 已就绪' : '⚠️ 待生成'}</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleUploadPage;