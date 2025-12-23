
import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Briefcase, Box, Users, Target, FileText, X, TrendingUp, Bot } from 'lucide-react';
import Header from './components/Header';
import AssistantSidebar from './components/AssistantSidebar';
import HomePage from './pages/HomePage';
import SolutionsPage from './pages/SolutionsPage';
import SolutionDetail from './pages/SolutionDetail';
import SolutionUploadPage from './pages/SolutionUploadPage';
import AppCenterPage from './pages/AppCenterPage';
import AppDetail from './pages/AppDetail';
import CasesPage from './pages/CasesPage';
import CaseDetail from './pages/CaseDetail';
import ReviewsPage from './pages/ReviewsPage';
import ReviewDetail from './pages/ReviewDetail';
import ResourcesPage from './pages/ResourcesPage';
import DashboardPage from './pages/DashboardPage';
import ArticleDetail from './pages/ArticleDetail';
import UserProfilePage from './pages/UserProfilePage';
import AppUploadPage from './pages/AppUploadPage';
import CaseUploadPage from './pages/CaseUploadPage';
import ReviewUploadPage from './pages/ReviewUploadPage';
import ResourceUploadPage from './pages/ResourceUploadPage';
import ArticleUploadPage from './pages/ArticleUploadPage';
import ResearchPage from './pages/ResearchPage';
import BattleMapPage from './pages/BattleMapPage'; 
import ClientDetailPage from './pages/ClientDetailPage'; 
import AIHubPage from './pages/AIHubPage'; // Import AI Hub
import AIHubDetail from './pages/AIHubDetail'; // Import AI Detail
import AIHubUploadPage from './pages/AIHubUploadPage'; // Import AI Upload
import { NavTab, ResearchArticle, ArticleContent, Solution, RichSolution, EvaluationData } from './types';
import { UserProvider } from './contexts/UserContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';

// Define a snapshot of the application state for history tracking
interface NavigationState {
  tab: NavTab;
  solutionId: string | null;
  appId: string | null;
  caseId: string | null;
  reviewId: string | null;
  articleId: string | null;
  profileId: string | null;
  clientId: string | null; 
  agentId: string | null; // Add agentId
  search: string;
}

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.HOME);
  const [selectedSolutionId, setSelectedSolutionId] = useState<string | null>(null);
  const [solutionInitialTab, setSolutionInitialTab] = useState<'detail' | 'evaluation' | 'market'>('detail');
  
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null); 
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null); // New State for AI Agent
  const [articleAction, setArticleAction] = useState<'view' | 'comment'>('view');
  
  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // New state for cross-tab search navigation
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // History Stack for Global Back Button logic (kept for programmatic back navigation if needed)
  const [historyStack, setHistoryStack] = useState<NavigationState[]>([]);

  // State for newly published content (In-Memory Database)
  const [newArticles, setNewArticles] = useState<ResearchArticle[]>([]);
  const [newArticleDetails, setNewArticleDetails] = useState<Record<string, ArticleContent>>({});

  const [newSolutions, setNewSolutions] = useState<Solution[]>([]);
  const [newRichSolutions, setNewRichSolutions] = useState<Record<string, RichSolution>>({});
  const [newEvaluations, setNewEvaluations] = useState<Record<string, EvaluationData>>({});

  const handlePublishArticle = (summary: ResearchArticle, detail: ArticleContent) => {
    setNewArticles(prev => [summary, ...prev]);
    setNewArticleDetails(prev => ({ ...prev, [summary.id]: detail }));
  };

  const handlePublishSolution = (solution: Solution, richDetail: RichSolution, evaluation: EvaluationData) => {
    setNewSolutions(prev => [solution, ...prev]);
    setNewRichSolutions(prev => ({ ...prev, [solution.id]: richDetail }));
    setNewEvaluations(prev => ({ ...prev, [solution.id]: evaluation }));
  };

  // Helper to record current state before navigating
  const recordHistory = () => {
    const currentState: NavigationState = {
      tab: activeTab,
      solutionId: selectedSolutionId,
      appId: selectedAppId,
      caseId: selectedCaseId,
      reviewId: selectedReviewId,
      articleId: selectedArticleId,
      profileId: selectedProfileId,
      clientId: selectedClientId,
      agentId: selectedAgentId,
      search: globalSearch
    };
    setHistoryStack(prev => [...prev, currentState]);
  };

  // Global Back Handler
  const handleGlobalBack = () => {
    if (historyStack.length === 0) return;
    
    const lastState = historyStack[historyStack.length - 1];
    
    // Restore State
    setActiveTab(lastState.tab);
    setSelectedSolutionId(lastState.solutionId);
    setSelectedAppId(lastState.appId);
    setSelectedCaseId(lastState.caseId);
    setSelectedReviewId(lastState.reviewId);
    setSelectedArticleId(lastState.articleId);
    setSelectedProfileId(lastState.profileId);
    setSelectedClientId(lastState.clientId);
    setSelectedAgentId(lastState.agentId);
    setGlobalSearch(lastState.search);
    
    // Pop from stack
    setHistoryStack(prev => prev.slice(0, -1));
  };

  const handleTabChange = (tab: NavTab) => {
    recordHistory();
    setActiveTab(tab);
    // Reset selections
    setSelectedSolutionId(null);
    setSelectedAppId(null);
    setSelectedCaseId(null);
    setSelectedReviewId(null);
    setSelectedArticleId(null);
    setSelectedProfileId(null);
    setSelectedClientId(null);
    setSelectedAgentId(null);
    // Clear global search when manually switching tabs
    setGlobalSearch('');
  };

  const handleNavigateWithSearch = (tab: NavTab, search?: string) => {
    recordHistory();
    setGlobalSearch(search || '');
    setActiveTab(tab);
    // Ensure we exit detail views when navigating to list views
    setSelectedSolutionId(null);
    setSelectedAppId(null);
    setSelectedCaseId(null);
    setSelectedReviewId(null);
    setSelectedClientId(null);
    setSelectedAgentId(null);
  };

  const handleHomeNavigate = (type: string, id: string, search?: string) => {
    recordHistory();
    switch (type) {
      case 'research': 
        setActiveTab(NavTab.RESEARCH);
        break;
      case 'solution':
        setActiveTab(NavTab.SOLUTIONS);
        setSelectedSolutionId(id);
        setSolutionInitialTab('detail');
        break;
      case 'app':
        setActiveTab(NavTab.APP_CENTER);
        if (id) {
           setSelectedAppId(id);
        } else {
           setGlobalSearch(search || '');
        }
        break;
      case 'case':
        setActiveTab(NavTab.CASES);
        setSelectedCaseId(id);
        break;
      case 'review':
        setActiveTab(NavTab.REVIEW);
        setSelectedReviewId(id);
        break;
      case 'resource':
        setActiveTab(NavTab.RESOURCES);
        setGlobalSearch(search || '');
        break;
      case 'ai_agent':
        setActiveTab(NavTab.AI_HUB);
        setSelectedAgentId(id);
        break;
      default:
        break;
    }
  };

  const handleArticleNavigate = (id: string, action: 'view' | 'comment') => {
    recordHistory();
    setSelectedArticleId(id);
    setArticleAction(action);
  };

  // Internal selection handlers need to record history too if they act as navigation
  const handleSolutionSelect = (id: string) => {
    recordHistory();
    setSelectedSolutionId(id);
    setSolutionInitialTab('detail');
  };

  const handleSolutionCommentClick = (id: string) => {
    recordHistory();
    setSelectedSolutionId(id);
    setSolutionInitialTab('evaluation');
  };

  const handleAppSelect = (id: string) => {
    recordHistory();
    setSelectedAppId(id);
  }

  const handleCaseSelect = (id: string) => {
    recordHistory();
    setSelectedCaseId(id);
    setActiveTab(NavTab.CASES);
  };
  
  const handleReviewSelect = (id: string) => {
    recordHistory();
    setSelectedReviewId(id);
  };

  const handleProfileSelect = (userId: string | undefined) => {
    recordHistory();
    setSelectedProfileId(userId || null); // null means current user
    setActiveTab(NavTab.PROFILE);
  };

  const handleClientSelect = (clientId: string) => {
    recordHistory();
    setSelectedClientId(clientId);
  }

  const handleAgentSelect = (agentId: string) => {
    recordHistory();
    setSelectedAgentId(agentId);
  }

  // Handler for cross-module navigation (e.g. Solution -> Review)
  const handleViewReviewFromSolution = (id: string) => {
    recordHistory();
    setActiveTab(NavTab.REVIEW);
    setSelectedReviewId(id);
  };

  // Share/Upload Navigation
  const handleUploadNavigate = (tab: NavTab) => {
    setIsShareModalOpen(false);
    recordHistory();
    setActiveTab(tab);
  };

  // Research Article Select (reuses selectedArticleId)
  const handleResearchArticleSelect = (id: string) => {
    recordHistory();
    setSelectedArticleId(id);
    setArticleAction('view');
  };

  const renderContent = () => {
    // --- UPLOAD PAGES ---
    if (activeTab === NavTab.UPLOAD_ARTICLE) {
        return (
          <ArticleUploadPage 
            onBack={() => { recordHistory(); setActiveTab(NavTab.RESEARCH); }} 
            onSubmitSuccess={() => { recordHistory(); setActiveTab(NavTab.RESEARCH); }}
            onPublish={handlePublishArticle}
          />
        );
    }
    if (activeTab === NavTab.UPLOAD_SOLUTION) {
        return (
          <SolutionUploadPage 
            onBack={() => { recordHistory(); setActiveTab(NavTab.SOLUTIONS); }} 
            onSubmitSuccess={() => { recordHistory(); setActiveTab(NavTab.SOLUTIONS); }} 
            onPublish={handlePublishSolution}
          />
        );
    }
    if (activeTab === NavTab.UPLOAD_APP) {
        return <AppUploadPage onBack={() => { recordHistory(); setActiveTab(NavTab.HOME); }} onSubmitSuccess={() => { recordHistory(); setActiveTab(NavTab.APP_CENTER); }} />;
    }
    if (activeTab === NavTab.UPLOAD_CASE) {
        return <CaseUploadPage onBack={() => { recordHistory(); setActiveTab(NavTab.HOME); }} onSubmitSuccess={() => { recordHistory(); setActiveTab(NavTab.CASES); }} />;
    }
    if (activeTab === NavTab.UPLOAD_REVIEW) {
        return <ReviewUploadPage onBack={() => { recordHistory(); setActiveTab(NavTab.HOME); }} onSubmitSuccess={() => { recordHistory(); setActiveTab(NavTab.REVIEW); }} />;
    }
    if (activeTab === NavTab.UPLOAD_RESOURCE) {
        return <ResourceUploadPage onBack={() => { recordHistory(); setActiveTab(NavTab.HOME); }} onSubmitSuccess={() => { recordHistory(); setActiveTab(NavTab.RESOURCES); }} />;
    }
    if (activeTab === NavTab.UPLOAD_AI) {
        return <AIHubUploadPage onBack={() => { recordHistory(); setActiveTab(NavTab.AI_HUB); }} onSubmitSuccess={() => { recordHistory(); setActiveTab(NavTab.AI_HUB); }} />;
    }

    if (activeTab === NavTab.PROFILE) {
        return <UserProfilePage userId={selectedProfileId || undefined} onBack={() => { handleGlobalBack(); }} onNavigate={handleHomeNavigate} />;
    }

    if (activeTab === NavTab.SOLUTIONS) {
      if (selectedSolutionId) {
        return <SolutionDetail 
          solutionId={selectedSolutionId} 
          onBack={() => {
             setSelectedSolutionId(null);
          }} 
          onNavigate={handleNavigateWithSearch} 
          onViewReview={handleViewReviewFromSolution}
          onCaseClick={handleCaseSelect}
          initialTab={solutionInitialTab}
          extraRichSolutions={newRichSolutions}
          extraEvaluations={newEvaluations}
        />;
      }
      return <SolutionsPage 
        onSolutionClick={handleSolutionSelect} 
        onCommentClick={handleSolutionCommentClick} 
        extraSolutions={newSolutions}
        onUpload={() => handleUploadNavigate(NavTab.UPLOAD_SOLUTION)}
      />;
    }

    if (activeTab === NavTab.APP_CENTER) {
      if (selectedAppId) {
        return <AppDetail appId={selectedAppId} onBack={() => setSelectedAppId(null)} />;
      }
      return <AppCenterPage initialSearch={globalSearch} onAppClick={handleAppSelect} onUpload={() => handleUploadNavigate(NavTab.UPLOAD_APP)} />;
    }

    if (activeTab === NavTab.CASES) {
      if (selectedCaseId) {
        return <CaseDetail caseId={selectedCaseId} onBack={() => setSelectedCaseId(null)} />;
      }
      return <CasesPage onCaseClick={handleCaseSelect} onUpload={() => handleUploadNavigate(NavTab.UPLOAD_CASE)} />;
    }

    if (activeTab === NavTab.REVIEW) {
      if (selectedReviewId) {
        return <ReviewDetail reviewId={selectedReviewId} onBack={() => setSelectedReviewId(null)} />;
      }
      return <ReviewsPage onReviewClick={handleReviewSelect} onUpload={() => handleUploadNavigate(NavTab.UPLOAD_REVIEW)} />;
    }

    if (activeTab === NavTab.RESOURCES) {
      return <ResourcesPage initialSearch={globalSearch} onUpload={() => handleUploadNavigate(NavTab.UPLOAD_RESOURCE)} />;
    }

    // --- BATTLE MAP ---
    if (activeTab === NavTab.BATTLE_MAP) {
      if (selectedClientId) {
        return <ClientDetailPage clientId={selectedClientId} onBack={() => setSelectedClientId(null)} onDrillDown={handleClientSelect} />;
      }
      return <BattleMapPage onClientClick={handleClientSelect} />;
    }

    // --- AI HUB ---
    if (activeTab === NavTab.AI_HUB) {
      if (selectedAgentId) {
        return <AIHubDetail agentId={selectedAgentId} onBack={() => setSelectedAgentId(null)} />;
      }
      return <AIHubPage onAgentClick={handleAgentSelect} onUpload={() => handleUploadNavigate(NavTab.UPLOAD_AI)} />;
    }

    // --- RESEARCH TAB ---
    if (activeTab === NavTab.RESEARCH) {
      if (selectedArticleId) {
        return (
          <ArticleDetail 
            id={selectedArticleId} 
            initialAction={articleAction} 
            onBack={() => setSelectedArticleId(null)} 
            extraArticleContent={newArticleDetails}
          />
        );
      }
      return <ResearchPage onArticleClick={handleResearchArticleSelect} extraArticles={newArticles} onUpload={() => handleUploadNavigate(NavTab.UPLOAD_ARTICLE)} />;
    }

    switch (activeTab) {
      case NavTab.HOME:
        if (selectedArticleId) {
          return (
            <ArticleDetail 
              id={selectedArticleId} 
              initialAction={articleAction} 
              onBack={() => setSelectedArticleId(null)} 
              extraArticleContent={newArticleDetails}
            />
          );
        }
        return <HomePage onNavigate={handleHomeNavigate} onArticleClick={handleArticleNavigate} />;
      case NavTab.DASHBOARD:
        return <DashboardPage />;
      default:
        return <HomePage onNavigate={handleHomeNavigate} onArticleClick={handleArticleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f6f7] relative">
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onProfileClick={() => handleProfileSelect(undefined)} 
        onShareClick={() => setIsShareModalOpen(true)}
      />
      
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
        <main className="flex-1 min-w-0">
          {renderContent()}
        </main>
        
        {/* Right Sidebar - Persistent across pages */}
        <AssistantSidebar onNavigate={handleTabChange} />
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={() => setIsShareModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full animate-scaleIn border border-gray-100" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h2 className="text-2xl font-bold text-gray-900">我要分享</h2>
                   <p className="text-gray-500 mt-1">选择您要分享的内容类型，将您的最佳实践沉淀到 GTM 服务站</p>
                </div>
                <button onClick={() => setIsShareModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
                   <X size={24} />
                </button>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => handleUploadNavigate(NavTab.UPLOAD_ARTICLE)} className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 hover:-translate-y-1 transition group">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition"><TrendingUp size={24}/></div>
                   <span className="font-bold text-gray-800">资讯洞察</span>
                </button>
                <button onClick={() => handleUploadNavigate(NavTab.UPLOAD_SOLUTION)} className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 hover:-translate-y-1 transition group">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition"><Briefcase size={24}/></div>
                   <span className="font-bold text-gray-800">解决方案</span>
                </button>
                <button onClick={() => handleUploadNavigate(NavTab.UPLOAD_APP)} className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-orange-50 border border-orange-100 hover:bg-orange-100 hover:border-orange-200 hover:-translate-y-1 transition group">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-600 shadow-sm group-hover:scale-110 transition"><Box size={24}/></div>
                   <span className="font-bold text-gray-800">应用系统</span>
                </button>
                <button onClick={() => handleUploadNavigate(NavTab.UPLOAD_AI)} className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-cyan-50 border border-cyan-100 hover:bg-cyan-100 hover:border-cyan-200 hover:-translate-y-1 transition group">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-cyan-600 shadow-sm group-hover:scale-110 transition"><Bot size={24}/></div>
                   <span className="font-bold text-gray-800">效率工具</span>
                </button>
                <button onClick={() => handleUploadNavigate(NavTab.UPLOAD_CASE)} className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-purple-50 border border-purple-100 hover:bg-purple-100 hover:border-purple-200 hover:-translate-y-1 transition group">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm group-hover:scale-110 transition"><Users size={24}/></div>
                   <span className="font-bold text-gray-800">客户案例</span>
                </button>
                <button onClick={() => handleUploadNavigate(NavTab.UPLOAD_REVIEW)} className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 hover:border-green-200 hover:-translate-y-1 transition group">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm group-hover:scale-110 transition"><Target size={24}/></div>
                   <span className="font-bold text-gray-800">项目复盘</span>
                </button>
                <button onClick={() => handleUploadNavigate(NavTab.UPLOAD_RESOURCE)} className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:border-gray-200 hover:-translate-y-1 transition group">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm group-hover:scale-110 transition"><FileText size={24}/></div>
                   <span className="font-bold text-gray-800">其他资料</span>
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <AnalyticsProvider>
        <AppContent />
      </AnalyticsProvider>
    </UserProvider>
  );
};

export default App;
