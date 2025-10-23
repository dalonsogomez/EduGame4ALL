import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkillProgress } from '@/components/progress/SkillProgress';
import { BadgeGrid } from '@/components/progress/BadgeGrid';
import { getDashboardData } from '@/api/dashboard';
import { getBadges, getGameHistory, getWeeklyReport } from '@/api/progress';
import { useToast } from '@/hooks/useToast';
import { Loader2, TrendingUp, Award, History, BarChart3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { SkillLevel, Badge, GameSession } from '@/types';

interface WeeklyReport {
  gamesPlayed: number;
  totalTime: number;
  xpEarned: number;
  strengths: string[];
  improvements: string[];
  insights: string[];
  weeklyActivity: Array<{ day: string; xp: number }>;
}

export function Progress() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [skills, setSkills] = useState<SkillLevel[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [history, setHistory] = useState<GameSession[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);

  const loadProgressData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading progress data...');

      const [dashboardRes, badgesRes, historyRes, reportRes] = await Promise.all([
        getDashboardData(),
        getBadges(),
        getGameHistory(10),
        getWeeklyReport(),
      ]);

      setSkills(dashboardRes.skills);
      setBadges(badgesRes.badges);
      setHistory(historyRes.sessions);
      setWeeklyReport(reportRes.report);

      console.log('Progress data loaded successfully');
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error('Error loading progress:', error);
      toast({
        title: 'Error',
        description: err.message || 'Failed to load progress data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-purple-600" />
          My Progress
        </h1>
        <p className="text-muted-foreground mt-1">Track your learning journey and achievements</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="badges">
            <Award className="h-4 w-4 mr-2" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="report">
            <TrendingUp className="h-4 w-4 mr-2" />
            Weekly Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <SkillProgress skills={skills} />

          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <BadgeGrid badges={badges.filter((b) => b.isEarned).slice(0, 4)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Badges</CardTitle>
              <p className="text-sm text-muted-foreground">
                {badges.filter((b) => b.isEarned).length} of {badges.length} earned
              </p>
            </CardHeader>
            <CardContent>
              <BadgeGrid badges={badges} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Game History</CardTitle>
              <p className="text-sm text-muted-foreground">Your recent game sessions</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((session) => (
                  <Card key={session._id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">Game Session</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(session.completedAt), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-2xl font-bold text-purple-600">+{session.xpEarned} XP</p>
                          <p className="text-sm text-muted-foreground">
                            Score: {session.score}/10
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm">{session.feedback.personalizedMessage}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="space-y-6 mt-6">
          {weeklyReport && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">Games Played</p>
                    <p className="text-3xl font-bold mt-2">{weeklyReport.gamesPlayed}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">Total Time</p>
                    <p className="text-3xl font-bold mt-2">{weeklyReport.totalTime}m</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">XP Earned</p>
                    <p className="text-3xl font-bold mt-2 text-purple-600">{weeklyReport.xpEarned}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">Avg Score</p>
                    <p className="text-3xl font-bold mt-2">78%</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Your Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {weeklyReport.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-orange-600">Areas for Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {weeklyReport.improvements.map((improvement: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-600 mt-1">→</span>
                          <span className="text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {weeklyReport.insights.map((insight: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">💡</span>
                        <span className="text-sm">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}