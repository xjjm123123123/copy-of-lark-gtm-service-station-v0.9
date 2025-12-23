import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface UserContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  availableUsers: User[];
  toggleFollow: (targetUserId: string) => void;
  getUserById: (userId: string) => User | undefined;
}

// Mock Users Data with Social Stats
const INITIAL_USERS: User[] = [
  { id: 'u1', name: '刘伟', avatar: '刘', role: 'sales', department: '能源行业线', email: 'liuwei@example.com', followersCount: 128, followingCount: 45, totalLikesReceived: 850, bio: '深耕能源化工行业，专注数字化转型落地。' },
  { id: 'u2', name: '张三', avatar: '张', role: 'solution_architect', department: '大制造行业线', email: 'zhangsan@example.com', followersCount: 342, followingCount: 80, totalLikesReceived: 2100, bio: 'IPD 咨询专家，致力于提升研发效能。' },
  { id: 'u3', name: '陈静', avatar: '陈', role: 'product_manager', department: '渠道产品部', email: 'chenjing@example.com', followersCount: 210, followingCount: 65, totalLikesReceived: 1200, bio: '用产品思维解决业务问题。' },
  { id: 'u4', name: 'Admin', avatar: 'A', role: 'admin', department: 'GTM运营部', email: 'admin@example.com', followersCount: 50, followingCount: 10, totalLikesReceived: 200, bio: '系统管理员' },
  { id: 'u5', name: '李雷', avatar: '李', role: 'sales', department: '大消费行业', email: 'lilei@example.com', followersCount: 156, followingCount: 30, totalLikesReceived: 920, bio: '新零售数字化推行者。' },
  { id: 'u6', name: '王金', avatar: '王', role: 'sales', department: '金融行业', email: 'wangjin@example.com', followersCount: 88, followingCount: 22, totalLikesReceived: 450, bio: '专注金融合规与信创。' },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  
  // Social Graph: Map<FollowerID, Set<FollowingID>>
  const [socialGraph, setSocialGraph] = useState<Record<string, string[]>>({
    'u1': ['u2', 'u3'], // Liu Wei follows Zhang San and Chen Jing
    'u2': ['u1'],
  });

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId);
  }

  const toggleFollow = (targetUserId: string) => {
    if (targetUserId === currentUser.id) return;

    setSocialGraph(prev => {
      const currentFollowing = prev[currentUser.id] || [];
      const isFollowing = currentFollowing.includes(targetUserId);
      
      let newFollowing;
      if (isFollowing) {
        newFollowing = currentFollowing.filter(id => id !== targetUserId);
      } else {
        newFollowing = [...currentFollowing, targetUserId];
      }

      // Update User Stats (Optimistic UI update)
      setUsers(prevUsers => prevUsers.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, followingCount: isFollowing ? u.followingCount - 1 : u.followingCount + 1 };
        }
        if (u.id === targetUserId) {
          return { ...u, followersCount: isFollowing ? u.followersCount - 1 : u.followersCount + 1 };
        }
        return u;
      }));

      // Update Current User State immediately
      setCurrentUser(prev => ({
         ...prev,
         followingCount: isFollowing ? prev.followingCount - 1 : prev.followingCount + 1
      }));

      return {
        ...prev,
        [currentUser.id]: newFollowing
      };
    });
  };

  // Enhance available users with "isFollowing" status relative to currentUser
  const enrichedUsers = users.map(u => ({
    ...u,
    isFollowing: (socialGraph[currentUser.id] || []).includes(u.id)
  }));

  return (
    <UserContext.Provider value={{ currentUser: enrichedUsers.find(u => u.id === currentUser.id) || currentUser, switchUser, availableUsers: enrichedUsers, toggleFollow, getUserById }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};