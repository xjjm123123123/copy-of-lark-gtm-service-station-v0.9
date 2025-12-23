import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnalyticsEvent, InteractionType, TargetType, AggregatedStats } from '../types';
import { useUser } from './UserContext';

interface AnalyticsContextType {
  trackEvent: (targetType: TargetType, targetId: string, action: InteractionType, metadata?: any) => void;
  getStats: (targetType: TargetType, targetId: string) => AggregatedStats;
  hasUserActed: (targetType: TargetType, targetId: string, action: InteractionType) => boolean;
  getActionCount: (targetType: TargetType, targetId: string, action: InteractionType) => number;
  getUserInteractedItems: (userId: string, action: InteractionType) => AnalyticsEvent[];
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUser();
  const [events, setEvents] = useState<AnalyticsEvent[]>(() => {
    // Load from local storage or empty array
    const stored = localStorage.getItem('gtm_analytics_events');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('gtm_analytics_events', JSON.stringify(events));
  }, [events]);

  const trackEvent = (targetType: TargetType, targetId: string, action: InteractionType, metadata?: any) => {
    // Prevent duplicate actions for stateful toggles like 'like' or 'favorite'
    // If user already liked, this action acts as "unlike" (remove event)
    if (action === 'like' || action === 'favorite') {
      const existingIndex = events.findIndex(
        e => e.userId === currentUser.id && e.targetType === targetType && e.targetId === targetId && e.action === action
      );

      if (existingIndex > -1) {
        // Remove event (Untoggle)
        setEvents(prev => prev.filter((_, idx) => idx !== existingIndex));
        return;
      }
    }

    const newEvent: AnalyticsEvent = {
      id: Date.now().toString(),
      userId: currentUser.id,
      targetType,
      targetId,
      action,
      timestamp: Date.now(),
      metadata
    };

    setEvents(prev => [...prev, newEvent]);
  };

  const getActionCount = (targetType: TargetType, targetId: string, action: InteractionType) => {
    return events.filter(e => e.targetType === targetType && e.targetId === targetId && e.action === action).length;
  };

  const hasUserActed = (targetType: TargetType, targetId: string, action: InteractionType) => {
    return events.some(e => e.userId === currentUser.id && e.targetType === targetType && e.targetId === targetId && e.action === action);
  };

  const getStats = (targetType: TargetType, targetId: string): AggregatedStats => {
    const relevantEvents = events.filter(e => e.targetType === targetType && e.targetId === targetId);
    
    // Unique Visitors calculation
    const uniqueViewers = new Set(relevantEvents.filter(e => e.action === 'view').map(e => e.userId));

    return {
      views: relevantEvents.filter(e => e.action === 'view').length,
      uv: uniqueViewers.size,
      likes: relevantEvents.filter(e => e.action === 'like').length,
      favorites: relevantEvents.filter(e => e.action === 'favorite').length,
      comments: relevantEvents.filter(e => e.action === 'comment').length,
      shares: relevantEvents.filter(e => e.action === 'share').length,
      downloads: relevantEvents.filter(e => e.action === 'download').length,
    };
  };

  const getUserInteractedItems = (userId: string, action: InteractionType) => {
    return events.filter(e => e.userId === userId && e.action === action);
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent, getStats, hasUserActed, getActionCount, getUserInteractedItems }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};