import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Upload, FileText, Link as LinkIcon, File } from 'lucide-react';
import { TAXONOMY } from '../constants';

interface ResourceUploadPageProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
}

const ResourceUploadPage: React.FC<ResourceUploadPageProps> = ({ onBack, onSubmitSuccess }) => {
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">资料上传成功</h2>
          <p className="text-gray-500 mb-6">资料已上传至资料中心，即刻可被全员检索下载。</p>
          <button onClick={onSubmitSuccess} className="bg-lark-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-lark-600 transition">
            返回资料中心
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
            <h1 className="text-2xl font-bold text-gray-800">上传资料</h1>
            <p className="text-sm text-gray-500 mt-1">分享行研报告、售前胶片、标书模板等实用资源</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition">取消</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-lark-500 text-white hover:bg-lark-600 rounded-lg text-sm font-medium transition shadow-sm">确认上传</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-l-4 border-lark-500 pl-3">资料信息</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">资料标题 <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" placeholder="例如：2025年新能源汽车行业白皮书" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">资料分类</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none bg-white">
                       <option value="report">行研报告</option>
                       <option value="pitch">Pitch材料</option>
                       <option value="bidding">招投标文件</option>
                       <option value="qualification">资质文件</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">所属行业</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none bg-white">
                       <option value="all">通用/不限</option>
                       {TAXONOMY.INDUSTRIES.map(i => <option key={i.label} value={i.label}>{i.label}</option>)}
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">关联标签</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" placeholder="例如：趋势, 安全, 模板 (逗号分隔)" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">文件上传</h3>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-lark-300 transition cursor-pointer">
                  <Upload size={32} className="mb-2 text-gray-300" />
                  <span className="text-xs">点击或拖拽上传文件</span>
                  <span className="text-[10px] text-gray-300 mt-1">支持 PDF, PPT, Word, Excel, Zip</span>
              </div>
              
              <div className="mt-4 flex items-center gap-2">
                 <div className="w-full h-px bg-gray-100"></div>
                 <span className="text-xs text-gray-400 shrink-0">或</span>
                 <div className="w-full h-px bg-gray-100"></div>
              </div>

              <div className="mt-4">
                 <label className="block text-xs font-medium text-gray-500 mb-1">外部链接 (可选)</label>
                 <div className="flex items-center gap-2">
                    <LinkIcon size={14} className="text-gray-400"/>
                    <input type="text" className="w-full border-b border-gray-200 text-sm py-1 focus:border-lark-500 outline-none" placeholder="https://..." />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceUploadPage;