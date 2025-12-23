
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Upload, Bot, BrainCircuit, Code, FolderOpen } from 'lucide-react';
import { AI_BUSINESS_TAXONOMY } from '../constants';

interface AIHubUploadPageProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
}

const AIHubUploadPage: React.FC<AIHubUploadPageProps> = ({ onBack, onSubmitSuccess }) => {
  const [submitted, setSubmitted] = useState(false);
  
  // State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platform: 'Coze',
    model: '',
    launchUrl: '',
    capabilities: ''
  });

  const [categoryL1, setCategoryL1] = useState('');
  const [categoryL2, setCategoryL2] = useState('');

  // Derived L2 options
  const categoryL2Options = AI_BUSINESS_TAXONOMY.find(c => c.label === categoryL1)?.children || [];

  const handleSubmit = () => {
    if (!formData.name || !categoryL1 || !categoryL2 || !formData.launchUrl) {
        alert('请填写必填项');
        return;
    }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">提交成功</h2>
          <p className="text-gray-500 mb-6">您的 AI 助手已提交，审核通过后将上架效率工具。</p>
          <button onClick={onSubmitSuccess} className="bg-lark-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-lark-600 transition">
            前往 效率工具
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fadeIn pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">发布 AI 助手</h1>
            <p className="text-sm text-gray-500 mt-1">分享您的 GTM 业务 AI 应用，沉淀智能化能力</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition">取消</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-lark-500 text-white hover:bg-lark-600 rounded-lg text-sm font-medium transition shadow-sm">确认发布</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-l-4 border-lark-500 pl-3">基本信息</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">助手名称 <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" 
                  placeholder="例如：竞对分析助手" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">功能描述</label>
                <textarea 
                  rows={4} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition resize-none" 
                  placeholder="该助手解决了什么问题？具备哪些核心能力？"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              {/* New Business Classification Selectors */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                 <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-1"><FolderOpen size={14}/> 业务分类 <span className="text-red-500">*</span></label>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <select 
                         className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none bg-white text-sm"
                         value={categoryL1}
                         onChange={(e) => { setCategoryL1(e.target.value); setCategoryL2(''); }}
                       >
                          <option value="">一级分类</option>
                          {AI_BUSINESS_TAXONOMY.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                       </select>
                    </div>
                    <div>
                       <select 
                         className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none bg-white text-sm disabled:bg-gray-100 disabled:text-gray-400"
                         value={categoryL2}
                         onChange={(e) => setCategoryL2(e.target.value)}
                         disabled={!categoryL1}
                       >
                          <option value="">二级分类</option>
                          {categoryL2Options.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-l-4 border-lark-500 pl-3">技术规格</h3>
            <div className="space-y-5">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">开发平台 <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none bg-white"
                      value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})}
                    >
                       <option value="Coze">Coze (扣子)</option>
                       <option value="Aily">Aily</option>
                       <option value="LarkBase">多维表格</option>
                       <option value="Meego">飞书项目</option>
                       <option value="aPaaS">飞书 aPaaS</option>
                       <option value="Other">其他</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">底层模型 (可选)</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" 
                      placeholder="如：GPT-4o, Gemini 1.5" 
                      value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})}
                    />
                  </div>
               </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">体验链接 (Launch URL) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" 
                  placeholder="https://..." 
                  value={formData.launchUrl} onChange={e => setFormData({...formData, launchUrl: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">核心能力 (逗号分隔)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" 
                  placeholder="如：新闻抓取, 自动摘要, 报告生成" 
                  value={formData.capabilities} onChange={e => setFormData({...formData, capabilities: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">助手图标</h3>
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 text-gray-400 hover:border-lark-300 hover:bg-lark-50/50 transition cursor-pointer">
                 <Bot size={40} className="mb-2" />
                 <span className="text-xs">点击上传图标</span>
              </div>
           </div>
           
           <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-800 mb-2 flex items-center gap-2">
                 <BrainCircuit size={16} /> 提示
              </h3>
              <p className="text-xs text-indigo-700 leading-relaxed opacity-80">
                 请确保您的 AI 助手符合公司的数据安全规范，不要在 Prompt 中包含敏感客户数据。推荐使用 Coze 或 Aily 的企业版进行开发。
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIHubUploadPage;
