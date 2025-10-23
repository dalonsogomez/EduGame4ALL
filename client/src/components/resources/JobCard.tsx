import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/types';
import { Briefcase, MapPin, Clock, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
}

export function JobCard({ job, onViewDetails }: JobCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-green-100 text-green-700';
      case 'part-time':
        return 'bg-blue-100 text-blue-700';
      case 'internship':
        return 'bg-purple-100 text-purple-700';
      case 'volunteer':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            {job.logo ? (
              <img src={job.logo} alt={job.company} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Briefcase className="h-6 w-6 text-gray-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg line-clamp-1">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getTypeColor(job.type)}>{job.type}</Badge>
            <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
              <TrendingUp className="h-4 w-4" />
              {job.matchScore}%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground">{job.salary}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {job.requirements.slice(0, 3).map((req, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {req}
            </Badge>
          ))}
          {job.requirements.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{job.requirements.length - 3} more
            </Badge>
          )}
        </div>

        <Button onClick={() => onViewDetails(job)} className="w-full">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}