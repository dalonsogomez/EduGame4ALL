import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { DailyChallenge } from '@/components/dashboard/DailyChallenge';
import { RecommendedGames } from '@/components/dashboard/RecommendedGames';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { LeaderboardWidget } from '@/components/dashboard/LeaderboardWidget';
import { getUserProfile } from '@/api/profile';
import { getDashboardData } from '@/api/dashboard';
import { getGames } from '@/api/games';
import { useToast } from '@/hooks/useToast';
import { Loader2 } from 'lucide-react';
import { UserProfile } from '@/types';
import { SkillLevel, DailyChallenge as DailyChallengeType, ActivityItem, LeaderboardEntry } from '@/types';
import { Game } from '@/types';

interface DashboardData {
  skills: SkillLevel[];
  dailyChallenge: DailyChallengeType;
  recentActivity: ActivityItem[];
  leaderboard: LeaderboardEntry[];
}

export function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading dashboard data...');

      const [profileRes, dashboardRes, gamesRes] = await Promise.all([
        getUserProfile(),
        getDashboardData(),
        getGames(),
      ]);

      setProfile(profileRes.profile);
      setDashboardData(dashboardRes);
      setRecommendedGames(gamesRes.games.slice(0, 3));

      console.log('Dashboard data loaded successfully');
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error('Error loading dashboard:', error);
      toast({
        title: 'Error',
        description: err.message || 'Failed to load dashboard',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handlePlayGame = (gameId: string) => {
    console.log('Navigating to game:', gameId);
    navigate(`/games/${gameId}`);
  };

  const handleContinueChallenge = () => {
    console.log('Continuing daily challenge');
    navigate('/games');
  };

  const handleViewLeaderboard = () => {
    console.log('Viewing full leaderboard');
    navigate('/progress?tab=leaderboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!profile || !dashboardData) {
    return null;
  }

  return (
    <div className="space-y-6 pb-8">
      <WelcomeBanner
        userName={profile.name}
        streak={profile.streak}
        dailyProgress={dashboardData.dailyChallenge.progress}
        dailyGoal={dashboardData.dailyChallenge.total}
      />

      <QuickStats totalXP={profile.xp} level={profile.level} gamesThisWeek={12} rewardsEarned={8} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DailyChallenge challenge={dashboardData.dailyChallenge} onContinue={handleContinueChallenge} />
          <RecommendedGames games={recommendedGames} onPlayGame={handlePlayGame} />
        </div>

        <div className="space-y-6">
          <RecentActivity activities={dashboardData.recentActivity} />
          <LeaderboardWidget entries={dashboardData.leaderboard} onViewFull={handleViewLeaderboard} />
        </div>
      </div>
    </div>
  );
}