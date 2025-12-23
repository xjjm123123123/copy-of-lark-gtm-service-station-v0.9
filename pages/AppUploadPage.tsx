import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Upload, Box, Monitor, Smartphone, LayoutGrid, Code, Info } from 'lucide-react';
import { TAXONOMY } from '../constants';

interface AppUploadPageProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
}

const AppUploadPage: React.FC<AppUploadPageProps> = ({ onBack, onSubmitSuccess }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    industry: '',
    techStack: '',
    features: '',
    launchUrl: '',
    iconType: 'shield'
  });

  const handleSubmit = () => {
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">应用提报成功</h2>
          <p className="text-gray-500 mb-6">您的应用已成功提交，正在进入安全审核流程。</p>
          <button onClick={onSubmitSuccess} className="bg-lark-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-lark-600 transition">
            前往应用中心
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
            <h1 className="text-2xl font-bold text-gray-800">发布应用系统</h1>
            <p className="text-sm text-gray-500 mt-1">分享您的最佳实践应用，供全员体验与复制</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition">取消</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-lark-500 text-white hover:bg-lark-600 rounded-lg text-sm font-medium transition shadow-sm">发布应用</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-l-4 border-lark-500 pl-3">应用基础信息</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">应用名称 <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" placeholder="例如：化工安全生产管理系统" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">应用描述</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition resize-none" placeholder="简要描述应用解决的核心痛点与功能..."
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">所属行业</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none bg-white"
                    value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}
                  >
                    <option value="">请选择</option>
                    {TAXONOMY.INDUSTRIES.map(i => <option key={i.label} value={i.label}>{i.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">发布状态</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none bg-white"
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">正式上线 (Active)</option>
                    <option value="beta">公测版 (Beta)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-l-4 border-lark-500 pl-3">技术与体验</h3>
            <div className="space-y-5">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">体验链接 (Launch URL)</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">核心功能点 (每行一个)</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition resize-none" placeholder="例如：隐患随手拍..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">技术栈 (用逗号分隔)</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" placeholder="例如：飞书应用引擎, 多维表格, AnyCross" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">应用图标</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                 {['shield', 'car', 'cpu', 'headset', 'factory', 'shopping'].map(type => (
                    <div key={type} 
                      onClick={() => setFormData({...formData, iconType: type})}
                      className={`h-12 rounded-lg flex items-center justify-center cursor-pointer border transition ${formData.iconType === type ? 'bg-lark-50 border-lark-500 text-lark-600' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'}`}
                    >
                       <Box size={20} />
                    </div>
                 ))}
              </div>
              <p className="text-xs text-gray-400">选择一个最能代表应用类型的图标。</p>
           </div>

           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">应用截图</h3>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-lark-300 transition cursor-pointer">
                  <Upload size={32} className="mb-2 text-gray-300" />
                  <span className="text-xs">上传截图</span>
                  <span className="text-[10px] text-gray-300 mt-1">支持 PNG, JPG</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppUploadPage;