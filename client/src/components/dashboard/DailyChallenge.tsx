import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DailyChallenge as DailyChallengeType } from '@/types';
import { Award, ArrowRight } from 'lucide-react';

interface DailyChallengeProps {
  challenge: DailyChallengeType;
  onContinue: () => void;
}

export function DailyChallenge({ challenge, onContinue }: DailyChallengeProps) {
  const progressPercentage = (challenge.progress / challenge.total) * 100;

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-600" />
          Today's Challenge
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{challenge.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-semibold">
              {challenge.progress}/{challenge.total} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Reward: </span>
            <span className="font-semibold text-purple-600">
              {challenge.xpReward} XP {challenge.bonusBadge && `+ ${challenge.bonusBadge} Badge`}
            </span>
          </div>
          <Button onClick={onContinue} className="bg-purple-600 hover:bg-purple-700">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}