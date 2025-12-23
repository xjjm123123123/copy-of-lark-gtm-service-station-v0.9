import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Target, Calendar, DollarSign, XCircle, Trophy } from 'lucide-react';
import { TAXONOMY } from '../constants';

interface ReviewUploadPageProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
}

const ReviewUploadPage: React.FC<ReviewUploadPageProps> = ({ onBack, onSubmitSuccess }) => {
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<'won' | 'lost'>('won');

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">复盘提交成功</h2>
          <p className="text-gray-500 mb-6">感谢您的复盘分享，经验与教训都是宝贵的财富。</p>
          <button onClick={onSubmitSuccess} className="bg-lark-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-lark-600 transition">
            返回复盘列表
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
            <h1 className="text-2xl font-bold text-gray-800">提交项目复盘</h1>
            <p className="text-sm text-gray-500 mt-1">记录赢单经验与输单教训，提升团队战斗力</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition">取消</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-lark-500 text-white hover:bg-lark-600 rounded-lg text-sm font-medium transition shadow-sm">提交复盘</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-l-4 border-lark-500 pl-3">项目基本信息</h3>
            <div className="space-y-6">
               {/* Result Toggle */}
               <div className="flex gap-4">
                  <button 
                    onClick={() => setResult('won')}
                    className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition ${result === 'won' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                  >
                     <Trophy size={20} /> 赢单 (Won)
                  </button>
                  <button 
                    onClick={() => setResult('lost')}
                    className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition ${result === 'lost' ? 'border-gray-400 bg-gray-100 text-gray-700' : 'border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                  >
                     <XCircle size={20} /> 输单 (Lost)
                  </button>
               </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目名称 <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition" placeholder="例如：某银行协同办公项目" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">合同金额</label>
                    <div className="relative">
                       <DollarSign size={16} className="absolute left-3 top-3 text-gray-400"/>
                       <input type="text" className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-lark-500 outline-none" placeholder="800万" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">主要竞对</label>
                    <div className="relative">
                       <Target size={16} className="absolute left-3 top-3 text-gray-400"/>
                       <input type="text" className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-lark-500 outline-none" placeholder="竞对A" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">复盘日期</label>
                    <div className="relative">
                       <Calendar size={16} className="absolute left-3 top-3 text-gray-400"/>
                       <input type="text" className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-lark-500 outline-none" placeholder="2025-12-12" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">所属行业</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-lark-500 outline-none">
                       {TAXONOMY.INDUSTRIES.map(i => <option key={i.label} value={i.label}>{i.label}</option>)}
                    </select>
                 </div>
              </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-l-4 border-lark-500 pl-3">核心复盘内容</h3>
            <div className="space-y-5">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">核心归因 <span className="text-red-500">*</span></label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition resize-none" placeholder="一句话总结赢单/输单的关键原因..."></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目背景</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-lark-500 outline-none transition resize-none" placeholder="客户痛点、项目背景..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">经验与教训 (Keep & Change)</label>
                <div className="grid grid-cols-2 gap-4">
                   <textarea rows={4} className="w-full px-4 py-2 border border-green-200 bg-green-50/20 rounded-lg focus:ring-1 focus:ring-green-500 outline-none transition resize-none" placeholder="做对了什么？(Good)"></textarea>
                   <textarea rows={4} className="w-full px-4 py-2 border border-red-200 bg-red-50/20 rounded-lg focus:ring-1 focus:ring-red-500 outline-none transition resize-none" placeholder="做错了什么/改进点？(Bad)"></textarea>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewUploadPage;