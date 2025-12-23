import React, { useState, useMemo } from 'react';
import { User, NavTab } from '../types';
import { useUser } from '../contexts/UserContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { MapPin, Briefcase, Mail, Calendar, Edit, UserPlus, UserCheck, Heart, Star, FileText, Box, Users, Target, LayoutGrid, ArrowLeft } from 'lucide-react';

interface UserProfilePageProps {
  userId?: string; // If null, show current user
  onBack: () => void;
  onNavigate: (type: string, id: string) => void;
}

// --- MOCK DATA CONSOLIDATION FOR PROFILE VIEW ---
// Ideally this should be in a centralized store, but for this demo we recreate the index to map IDs to content.
// In a real app, this would be API calls.
const CONTENT_INDEX: any[] = [
  // Solutions
  { id: '1', type: 'solution', title: '汽车行业智慧研发解决方案', author: '张三', date: '2025/12/10', desc: 'IPD全流程管理平台' },
  { id: '2', type: 'solution', title: '消费电子渠道管理方案', author: '陈静', date: '2025/12/08', desc: 'DMS系统' },
  { id: '3', type: 'solution', title: '化工安全隐患排查解决方案', author: '刘伟', date: '2025/11/25', desc: 'IoT安全' },
  { id: '4', type: 'solution', title: '互联网行业协同办公最佳实践', author: '孙敏', date: '2025/10/15', desc: '敏捷办公' },
  { id: '5', type: 'solution', title: '新零售门店数字化巡检', author: '李雷', date: '2025/12/01', desc: '门店管理' },
  { id: '6', type: 'solution', title: '金融行业合规营销方案', author: '周杰', date: '2025/11/30', desc: '合规营销' },
  // Apps
  { id: '1', type: 'app', title: '化工安全生产管理系统', author: '刘伟', date: '2025/12/01', desc: '应用中心-安全' },
  { id: '3', type: 'app', title: '汽车IPD研发协同平台', author: '张三', date: '2025-12-10', desc: '应用中心-IPD' },
  { id: '6', type: 'app', title: '新零售门店数字化巡检', author: '李雷', date: '2025-11-05', desc: '应用中心-巡检' },
  // Cases
  { id: '1', type: 'case', title: '未来汽车集团：万人研发协同', author: '张三', date: '2025/11/15', desc: '客户案例-汽车' },
  { id: '2', type: 'case', title: '超级零售连锁：门店数字化', author: '李雷', date: '2025/11/10', desc: '客户案例-零售' },
  { id: '4', type: 'case', title: '创新生物医药：合规营销', author: '赵六', date: '2025/10/20', desc: '客户案例-医药' },
  // Reviews
  { id: '1', type: 'review', title: '某大型股份制银行协同办公项目', author: '王金', date: '2025/08/15', desc: '复盘-赢单' },
  { id: '5', type: 'review', title: '未来汽车集团研发协同项目', author: '张三', date: '2025/11/15', desc: '复盘-赢单' },
  { id: '7', type: 'review', title: '某大型能源国企安全管理系统', author: '刘伟', date: '2025/11/20', desc: '复盘-赢单' },
  // Resources
  { id: '8', type: 'resource', title: '化工行业HSE管理规范', author: '刘伟', date: '2025-11-01', desc: '资料-规范' },
  { id: '9', type: 'resource', title: '安全隐患排查标准库', author: '张三', date: '2025-10-25', desc: '资料-库' },
];

const UserProfilePage: React.FC<UserProfilePageProps> = ({ userId, onBack, onNavigate }) => {
  const { currentUser, getUserById, toggleFollow } = useUser();
  const { getUserInteractedItems } = useAnalytics();
  const [activeTab, setActiveTab] = useState<'published' | 'favorites' | 'likes'>('published');

  // Determine which user profile to show
  const profileUser = userId ? getUserById(userId) : currentUser;
  
  if (!profileUser) {
    return <div className="p-10 text-center">用户不存在</div>;
  }

  const isSelf = profileUser.id === currentUser.id;

  // --- Data Aggregation ---
  // 1. Published: Filter CONTENT_INDEX by author name (Matching logic used in mock data)
  const publishedItems = useMemo(() => {
    return CONTENT_INDEX.filter(item => item.author === profileUser.name);
  }, [profileUser.name]);

  // 2. Favorites: Get IDs from AnalyticsContext and map to Content
  const favoritedItems = useMemo(() => {
    const events = getUserInteractedItems(profileUser.id, 'favorite');
    const ids = new Set(events.map(e => `${e.targetType}_${e.targetId}`)); // Composite key simulation
    // In a real app, we'd query by ID. Here we scan our mock index.
    // Note: Our mock index has non-unique numeric IDs across types, so we need to be careful.
    // For this demo, we match loosely on ID + Type or just ID if type matches.
    return events.map(e => CONTENT_INDEX.find(c => c.id === e.targetId && c.type === e.targetType)).filter(Boolean);
  }, [profileUser.id, getUserInteractedItems]);

  // 3. Liked: Similar to favorites
  const likedItems = useMemo(() => {
    const events = getUserInteractedItems(profileUser.id, 'like');
    return events.map(e => CONTENT_INDEX.find(c => c.id === e.targetId && c.type === e.targetType)).filter(Boolean);
  }, [profileUser.id, getUserInteractedItems]);

  const currentList = activeTab === 'published' ? publishedItems : (activeTab === 'favorites' ? favoritedItems : likedItems);

  const getIcon = (type: string) => {
    switch (type) {
      case 'solution': return <Briefcase size={16} className="text-blue-500" />;
      case 'app': return <Box size={16} className="text-orange-500" />;
      case 'case': return <Users size={16} className="text-purple-500" />;
      case 'review': return <Target size={16} className="text-green-500" />;
      case 'resource': return <FileText size={16} className="text-red-500" />;
      default: return <FileText size={16} />;
    }
  };

  const getTypeText = (type: string) => {
    const map: Record<string, string> = { 'solution': '方案', 'app': '应用', 'case': '案例', 'review': '复盘', 'resource': '资料' };
    return map[type] || '内容';
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fadeIn">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-lark-400 to-lark-600 w-full relative">
        <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-black/20 text-white rounded-full hover:bg-black/40 transition backdrop-blur-sm">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="px-8 relative">
        {/* Profile Header Info */}
        <div className="flex flex-col md:flex-row items-end -mt-12 mb-8 gap-6">
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg shrink-0">
            <div className="w-full h-full rounded-full bg-lark-100 flex items-center justify-center text-4xl font-bold text-lark-600">
              {profileUser.avatar}
            </div>
          </div>
          
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-4 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{profileUser.name}</h1>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200">{profileUser.role}</span>
            </div>
            <p className="text-gray-500 text-sm mb-3">{profileUser.bio || '这个家伙很懒，什么都没写'}</p>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1 text-gray-700">
                <span className="font-bold">{profileUser.followingCount}</span> <span className="text-gray-400">关注</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <span className="font-bold">{profileUser.followersCount}</span> <span className="text-gray-400">粉丝</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <span className="font-bold">{profileUser.totalLikesReceived}</span> <span className="text-gray-400">获赞</span>
              </div>
            </div>
          </div>

          <div className="pb-2">
            {isSelf ? (
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                <Edit size={16} /> 编辑资料
              </button>
            ) : (
              <button 
                onClick={() => toggleFollow(profileUser.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition shadow-sm ${
                  profileUser.isFollowing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' 
                    : 'bg-lark-500 text-white hover:bg-lark-600'
                }`}
              >
                {profileUser.isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                {profileUser.isFollowing ? '已关注' : '关注'}
              </button>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar: Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">个人信息</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Briefcase size={16} className="text-gray-400" />
                  <span>{profileUser.department}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={16} className="text-gray-400" />
                  <span>中国 · 北京</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <span>{profileUser.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  <span>入职时间：2023-05-12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content: Tabs & List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm min-h-[500px]">
              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                <button 
                  onClick={() => setActiveTab('published')}
                  className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition ${activeTab === 'published' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  <LayoutGrid size={16} /> 我的发布 <span className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded-full">{publishedItems.length}</span>
                </button>
                <button 
                  onClick={() => setActiveTab('favorites')}
                  className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition ${activeTab === 'favorites' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  <Star size={16} /> 我的收藏 <span className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded-full">{favoritedItems.length}</span>
                </button>
                <button 
                  onClick={() => setActiveTab('likes')}
                  className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition ${activeTab === 'likes' ? 'border-lark-500 text-lark-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  <Heart size={16} /> 我的点赞 <span className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded-full">{likedItems.length}</span>
                </button>
              </div>

              {/* List */}
              <div className="p-4">
                {currentList.length > 0 ? (
                  <div className="space-y-3">
                    {currentList.map((item, idx) => (
                      <div 
                        key={`${item.type}-${item.id}-${idx}`} 
                        onClick={() => onNavigate(item.type, item.id)}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-lark-200 hover:shadow-sm transition cursor-pointer group bg-gray-50/30"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                          {getIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded border border-gray-200 uppercase">{getTypeText(item.type)}</span>
                            <span className="text-xs text-gray-400">{item.date}</span>
                          </div>
                          <h4 className="font-bold text-gray-800 text-sm truncate group-hover:text-lark-600 transition-colors">{item.title}</h4>
                          <p className="text-xs text-gray-500 mt-1 truncate">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center text-gray-400 flex flex-col items-center">
                    <Box size={48} className="opacity-10 mb-4" />
                    <p className="text-sm">暂无相关内容</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;