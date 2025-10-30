import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { GamesPage } from './pages/GamesPage';
import { GamePlayPage } from './pages/GamePlayPage';
import { ProgressPage } from './pages/ProgressPage';
import { RewardsPage } from './pages/RewardsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AIChatPage } from './pages/AIChatPage';
import { KnowledgeProfilePage } from './pages/KnowledgeProfilePage';
import { Toaster } from './components/ui/sonner';
import { GameType, Difficulty } from './types';

function AppContent() {
  const { currentPage } = useApp();

  // Parse game play routes (e.g., "play-vocabulary-beginner")
  if (currentPage.startsWith('play-')) {
    const parts = currentPage.split('-');
    if (parts.length === 3) {
      const gameType = parts[1] as GameType;
      const difficulty = parts[2] as Difficulty;
      return <GamePlayPage gameType={gameType} difficulty={difficulty} />;
    }
  }

  // Route to appropriate page
  switch (currentPage) {
    case 'landing':
      return <LandingPage />;
    case 'register':
      return <RegisterPage />;
    case 'login':
      return <LoginPage />;
    case 'onboarding':
      return <OnboardingPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'games':
      return <GamesPage />;
    case 'progress':
      return <ProgressPage />;
    case 'rewards':
      return <RewardsPage />;
    case 'resources':
      return <ResourcesPage />;
    case 'ai-chat':
      return <AIChatPage />;
    case 'knowledge-profile':
      return <KnowledgeProfilePage />;
    default:
      return <LandingPage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="size-full">
        <AppContent />
        <Toaster position="top-right" />
      </div>
    </AppProvider>
  );
}
