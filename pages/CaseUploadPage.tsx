import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Building2, MapPin, Target, Trophy, Upload, Users } from 'lucide-react';
import { TAXONOMY } from '../constants';

interface CaseUploadPageProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
}

const CaseUploadPage: React.FC<CaseUploadPageProps> = ({ onBack, onSubmitSuccess }) => {
  const [submitted, setSubmitted] = useState(false);

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">案例提交成功</h2>
          <p className="text-gray-500 mb-6">您的客户案例已提交，将由行业GTM进行审核。</p>
          <button onClick={onSubmitSuccess} className="bg-lark-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-lark-600 transition">
            返回案例列表
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
            <h1 className="text-2xl font-bold text-gray-800">上传客户案例</h1>
            <p className="text-sm text-gray-500 mt-1">分享标杆客户的成功故事与价值验证</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition">取消</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-lark-500 text-white hover:bg-lark-600 rounded-lg text-sm font-medium transition shadow-sm">发布案例</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-l-4 border-lark-500 pl-3">客户与项目概况</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">案例标题 <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" placeholder="例如：未来汽车集团：万人研发协同实践" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">客户名称</label>
                    <div className="relative">
                       <Building2 size={16} className="absolute left-3 top-3 text-gray-400"/>
                       <input type="text" className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" placeholder="公司全称" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">所属行业</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none bg-white">
                       {TAXONOMY.INDUSTRIES.map(i => <option key={i.label} value={i.label}>{i.label}</option>)}
                    </select>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">客户规模</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" placeholder="例如：10,000+ 人" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">所在地区</label>
                    <div className="relative">
                       <MapPin size={16} className="absolute left-3 top-3 text-gray-400"/>
                       <input type="text" className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" placeholder="例如：上海 · 嘉定" />
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-l-4 border-lark-500 pl-3">故事与价值</h3>
            <div className="space-y-5">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目背景</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition resize-none" placeholder="客户在什么背景下启动了该项目？"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">核心痛点 (每行一个)</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition resize-none" placeholder="1. 工具割裂..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">解决方案亮点</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition resize-none" placeholder="主要使用了哪些产品组合，解决了什么问题？"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">核心价值收益 (Label - Value)</label>
                <div className="grid grid-cols-2 gap-4">
                   <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" placeholder="指标名称 (如：效率提升)" />
                   <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" placeholder="数值 (如：30%)" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">封面与Logo</h3>
              <div className="space-y-4">
                 <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-lark-300 transition cursor-pointer">
                    <Upload size={24} className="mb-2 text-gray-300" />
                    <span className="text-xs">上传封面图 (16:9)</span>
                 </div>
                 <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-lark-300 transition cursor-pointer">
                    <span className="text-xs">上传客户 Logo</span>
                 </div>
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">涉及产品</h3>
              <div className="flex flex-wrap gap-2">
                 {['飞书项目', '多维表格', '飞书文档', '飞书机器人'].map(p => (
                    <span key={p} className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 cursor-pointer hover:bg-lark-50 hover:text-lark-600 hover:border-lark-200 transition">{p}</span>
                 ))}
                 <span className="px-2 py-1 border border-dashed border-gray-300 rounded text-xs text-gray-400 cursor-pointer">+ 添加</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CaseUploadPage;