
import React, { useState } from 'react';
import { Bell, ChevronDown, User as UserIcon, Share2 } from 'lucide-react';
import { NavTab } from '../types';
import { useUser } from '../contexts/UserContext';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onProfileClick?: () => void;
  onShareClick?: () => void; // New Prop
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onProfileClick, onShareClick }) => {
  const { currentUser, switchUser, availableUsers } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { id: NavTab.HOME, label: '首页' },
    { id: NavTab.RESEARCH, label: '资讯洞察' }, 
    { id: NavTab.SOLUTIONS, label: '解决方案' },
    { id: NavTab.APP_CENTER, label: '应用中心' },
    { id: NavTab.CASES, label: '客户案例' },
    { id: NavTab.REVIEW, label: '项目复盘' },
    { id: NavTab.RESOURCES, label: '资料中心' },
    { id: NavTab.BATTLE_MAP, label: '作战地图' },
    { id: NavTab.AI_HUB, label: '效率工具' }, // Renamed and Moved up
    { id: NavTab.DASHBOARD, label: '运营看板' }, // Moved down
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-lark-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            L
          </div>
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Lark GTM服务站</h1>
        </div>

        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-lark-50 text-lark-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* User Switcher Dropdown */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 cursor-pointer hover:bg-gray-100 transition select-none"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <div className="w-6 h-6 bg-lark-200 rounded-full flex items-center justify-center text-lark-700 text-xs font-bold">
              {currentUser.avatar}
            </div>
            <span className="text-sm text-gray-700 font-medium">{currentUser.name}，你好</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>

          {isUserMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden animate-fadeIn">
                
                {/* My Profile */}
                <div 
                  className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700 transition-colors"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onProfileClick && onProfileClick();
                  }}
                >
                  <UserIcon size={16} />
                  <span className="text-sm font-medium">我的主页</span>
                </div>

                {/* Share Button (New) */}
                <div 
                  className="px-4 py-3 border-b border-gray-100 hover:bg-lark-50 cursor-pointer flex items-center gap-2 text-lark-600 transition-colors"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onShareClick && onShareClick();
                  }}
                >
                  <Share2 size={16} />
                  <span className="text-sm font-bold">我要分享</span>
                </div>
                
                {/* Switch User */}
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-medium">切换账号 (模拟)</div>
                {availableUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user.id);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-lark-50 transition flex items-center gap-2 ${currentUser.id === user.id ? 'text-lark-600 font-bold bg-lark-50/50' : 'text-gray-700'}`}
                  >
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-600">{user.avatar}</div>
                    <div>
                      <div>{user.name}</div>
                      <div className="text-[10px] text-gray-400">{user.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button className="p-2 text-gray-500 hover:text-lark-600 hover:bg-lark-50 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
