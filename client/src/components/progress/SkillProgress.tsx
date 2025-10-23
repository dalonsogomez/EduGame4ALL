import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SkillLevel } from '@/types';
import { BookOpen, Globe, Users } from 'lucide-react';

interface SkillProgressProps {
  skills: SkillLevel[];
}

export function SkillProgress({ skills }: SkillProgressProps) {
  const getSkillIcon = (category: string) => {
    switch (category) {
      case 'language':
        return BookOpen;
      case 'culture':
        return Globe;
      case 'softSkills':
        return Users;
      default:
        return BookOpen;
    }
  };

  const getSkillLabel = (category: string) => {
    switch (category) {
      case 'language':
        return 'Language Skills';
      case 'culture':
        return 'Cultural Knowledge';
      case 'softSkills':
        return 'Soft Skills';
      default:
        return category;
    }
  };

  const getSkillColor = (category: string) => {
    switch (category) {
      case 'language':
        return 'text-blue-600';
      case 'culture':
        return 'text-green-600';
      case 'softSkills':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {skills.map((skill) => {
        const Icon = getSkillIcon(skill.category);
        return (
          <Card key={skill.category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${getSkillColor(skill.category)}`} />
                {getSkillLabel(skill.category)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - skill.percentage / 100)}`}
                      className={getSkillColor(skill.category)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{skill.percentage}%</span>
                    <span className="text-xs text-muted-foreground">Level {skill.level}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress to Level {skill.level + 1}</span>
                  <span className="font-semibold">
                    {skill.xp}/{skill.xpToNextLevel} XP
                  </span>
                </div>
                <Progress value={skill.percentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}