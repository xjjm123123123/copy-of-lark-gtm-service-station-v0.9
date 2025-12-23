import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, ArrowRight, Rocket, FileText, Box, Users, Target, Clock, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface HomePageProps {
  onNavigate: (type: string, id: string, search?: string) => void;
  onArticleClick: (id: string, action: 'view' | 'comment') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onArticleClick }) => {
  // Syncing with ResearchPage TOP 3 Articles for consistency
  const [articles, setArticles] = useState<Article[]>([
    { id: 'r1', title: '2026年全球汽车行业数字化转型趋势预测', author: 'McKinsey', category: '趋势洞察', imageUrl: 'https://picsum.photos/600/300?random=101', likes: 340, comments: 45, date: '2025-12-10', isLiked: false },
    { id: 'r2', title: '飞书在先进制造行业的落地实践与思考', author: '张三', category: '最佳实践', imageUrl: 'https://picsum.photos/600/300?random=102', likes: 450, comments: 68, date: '2025-12-05', isLiked: false },
    { id: 'r3', title: '消费电子出海：从“卖产品”到“卖品牌”的路径演进', author: '36Kr', category: '市场分析', imageUrl: 'https://picsum.photos/600/300?random=103', likes: 220, comments: 32, date: '2025-11-28', isLiked: false },
  ]);

  // Sync with actual latest data from Solutions, Apps, Cases, and Reviews pages
  const newArrivals = [
    {
      id: '1', // Real ID from SolutionsPage (Date: 2025/12/10)
      category: '解决方案',
      title: '汽车行业智慧研发解决方案',
      type: 'solution',
      date: '2025/12/10',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tag: '版本 V3.2',
      imageUrl: 'https://picsum.photos/400/200?random=10' // Matches Solution 1
    },
    {
      id: '7', // Real ID from AppCenterPage
      category: '场景应用',
      title: '消费电子DMS渠道管理',
      type: 'app',
      date: '刚刚上线',
      icon: Box,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      tag: '新应用',
      imageUrl: 'https://picsum.photos/400/200?random=30' // Custom random seed
    },
    {
      id: '1', // Real ID from CasesPage (Date: 2025/11/15)
      category: '客户案例',
      title: '未来汽车集团：万人研发协同',
      type: 'case',
      date: '2025/11/15',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      tag: '新签约',
      imageUrl: 'https://picsum.photos/400/240?random=101' // Matches Case 1
    },
    {
      id: '8', // Real ID from ReviewsPage (Date: 2025/12/05)
      category: '项目复盘',
      title: '超级零售连锁门店数字化项目',
      type: 'review',
      date: '2025/12/05',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      tag: '赢单复盘',
      imageUrl: 'https://picsum.photos/400/200?random=23'
    }
  ];

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setArticles(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          likes: a.isLiked ? a.likes - 1 : a.likes + 1,
          isLiked: !a.isLiked
        };
      }
      return a;
    }));
  };

  const handleCommentClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onArticleClick(id, 'comment');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg h-64 group cursor-pointer">
        <img src="https://picsum.photos/1200/400?grayscale&blur=2" alt="Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-lark-900/80 to-transparent flex flex-col justify-center px-12">
          <h2 className="text-4xl font-bold text-white mb-4">欢迎来到飞书GTM服务站</h2>
          <p className="text-lark-100 text-lg max-w-xl">
            赋能一线，连接价值。这里有最新的行业洞察、最全的解决方案与最生动的客户案例。
          </p>
          <button className="mt-6 w-fit bg-white text-lark-600 px-6 py-2.5 rounded-lg font-medium hover:bg-lark-50 transition flex items-center gap-2">
            开始探索 <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* NEW: Just Launched Module */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-red-100 to-orange-50 rounded-lg flex items-center justify-center text-red-500 shadow-sm border border-red-100">
               <Rocket size={18} />
            </span>
            上线啦！
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
            <Clock size={12} />
            <span>数据实时更新</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {newArrivals.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onNavigate(item.type, item.id, item.title)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col"
            >
               
               {/* Image Area */}
               <div className="h-36 relative overflow-hidden bg-gray-100">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* Floating Badge: Category */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                     <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/95 backdrop-blur-sm ${item.color} text-[10px] font-bold shadow-sm border border-gray-100`}>
                       <item.icon size={11} />
                       {item.category}
                     </div>
                  </div>
                  
                  {/* Floating Badge: NEW */}
                  <div className="absolute top-3 right-3 z-10">
                     <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                       <Sparkles size={10} className="fill-white" /> NEW
                     </span>
                  </div>
               </div>
               
               {/* Content Area */}
               <div className="p-4 flex-1 flex flex-col">
                 <h4 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-lark-600 transition-colors line-clamp-2 mb-3">
                   {item.title}
                 </h4>
                 
                 <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{item.tag}</span>
                     <span className="text-[10px] text-gray-400">{item.date}</span>
                   </div>
                   <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-lark-50 group-hover:text-lark-500 transition-colors">
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* News Feed */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-lark-500 rounded-full"></span>
            资讯洞察
          </h3>
          <button 
            onClick={() => onNavigate('research', '', '')}
            className="text-sm text-gray-500 hover:text-lark-600 flex items-center gap-1 transition"
          >
            更多 <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {articles.map((article) => (
            <div 
              key={article.id} 
              onClick={() => onArticleClick(article.id, 'view')}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex gap-6 cursor-pointer group"
            >
              <div className="w-64 h-36 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-lark-50 text-lark-600 text-xs rounded font-medium">{article.category}</span>
                    <span className="text-xs text-gray-400">{article.date}</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-lark-600 transition-colors line-clamp-2">{article.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {article.title} 的详细内容摘要。这里展示的是文章的简介，用于快速了解文章的核心观点和价值...
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600 font-medium">作者：{article.author}</div>
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <button 
                      onClick={(e) => handleLike(e, article.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md transition ${article.isLiked ? 'text-lark-500 bg-lark-50' : 'hover:bg-gray-100 hover:text-gray-600'}`}
                    >
                      <ThumbsUp size={14} className={article.isLiked ? "fill-current" : ""} /> {article.likes}
                    </button>
                    <button 
                      onClick={(e) => handleCommentClick(e, article.id)}
                      className="flex items-center gap-1 hover:text-lark-600 hover:bg-gray-100 px-2 py-1 rounded-md transition"
                    >
                      <MessageCircle size={14} /> {article.comments}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Quick Links */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-center gap-8 text-sm text-gray-500">
        <span>快速链接:</span>
        <a href="#" className="hover:text-lark-500 transition">C360 客户系统</a>
        <a href="#" className="hover:text-lark-500 transition">Sales Enablement</a>
        <a href="#" className="hover:text-lark-500 transition">BI 看板</a>
      </div>
    </div>
  );
};

export default HomePage;