import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame } from 'lucide-react';

interface WelcomeBannerProps {
  userName: string;
  streak: number;
  dailyProgress: number;
  dailyGoal: number;
}

export function WelcomeBanner({ userName, streak, dailyProgress, dailyGoal }: WelcomeBannerProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const progressPercentage = (dailyProgress / dailyGoal) * 100;

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 shadow-lg">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="text-blue-100 mt-1">Ready to continue your learning journey?</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <Flame className="h-5 w-5 text-orange-300" />
            <span className="font-semibold">{streak} day streak!</span>
          </div>

          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span>Daily Goal</span>
              <span className="font-semibold">
                {dailyProgress}/{dailyGoal} games
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-white/30" />
          </div>
        </div>
      </div>
    </Card>
  );
}