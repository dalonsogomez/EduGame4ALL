import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { JobCard } from '@/components/resources/JobCard';
import { getJobs, getGrants, getServices, getNews } from '@/api/resources';
import { Job, Grant, Service, NewsArticle } from '@/types';
import { useToast } from '@/hooks/useToast';
import { Loader2, Briefcase, DollarSign, MapPin, Newspaper, Phone, Mail, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function Resources() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDialog, setShowJobDialog] = useState(false);

  const loadResourcesData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading resources data...');

      const [jobsRes, grantsRes, servicesRes, newsRes] = await Promise.all([
        getJobs(),
        getGrants(),
        getServices(),
        getNews(),
      ]);

      setJobs(jobsRes.jobs);
      setGrants(grantsRes.grants);
      setServices(servicesRes.services);
      setNews(newsRes.news);

      console.log('Resources data loaded successfully');
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error('Error loading resources:', error);
      toast({
        title: 'Error',
        description: err.message || 'Failed to load resources',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadResourcesData();
  }, [loadResourcesData]);

  const handleViewJobDetails = (job: Job) => {
    console.log('Viewing job details:', job._id);
    setSelectedJob(job);
    setShowJobDialog(true);
  };

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
          <MapPin className="h-8 w-8 text-purple-600" />
          Resources Center
        </h1>
        <p className="text-muted-foreground mt-1">Find jobs, grants, services, and local news</p>
      </div>

      <Tabs defaultValue="jobs">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs">
            <Briefcase className="h-4 w-4 mr-2" />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="grants">
            <DollarSign className="h-4 w-4 mr-2" />
            Grants
          </TabsTrigger>
          <TabsTrigger value="services">
            <MapPin className="h-4 w-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="news">
            <Newspaper className="h-4 w-4 mr-2" />
            News
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Opportunities</CardTitle>
              <p className="text-sm text-muted-foreground">Positions matched to your skills and profile</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} onViewDetails={handleViewJobDetails} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grants" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Grants & Subsidies</CardTitle>
              <p className="text-sm text-muted-foreground">Financial support programs you may be eligible for</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {grants.map((grant) => (
                  <Card key={grant._id} className="border-2 border-green-200">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{grant.name}</h3>
                          <p className="text-sm text-muted-foreground">{grant.organization}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700 text-lg px-4 py-1">{grant.amount}</Badge>
                      </div>

                      <p className="text-sm">{grant.description}</p>

                      <div>
                        <p className="text-sm font-semibold mb-2">Eligibility Requirements:</p>
                        <ul className="space-y-1">
                          {grant.eligibility.map((req, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                          <Clock className="h-4 w-4" />
                          <span>Deadline: {formatDistanceToNow(new Date(grant.deadline), { addSuffix: true })}</span>
                        </div>
                        <Button>Check Eligibility</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Services</CardTitle>
              <p className="text-sm text-muted-foreground">Local organizations and support services</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {services.map((service) => (
                  <Card key={service._id}>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{service.name}</h3>
                          <Badge variant="outline" className="mt-1">
                            {service.category}
                          </Badge>
                        </div>
                        {service.isFree && <Badge className="bg-green-100 text-green-700">Free</Badge>}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span>{service.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <a href={`tel:${service.phone}`} className="text-blue-600 hover:underline">
                            {service.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <a href={`mailto:${service.email}`} className="text-blue-600 hover:underline">
                            {service.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span>{service.hours}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Languages spoken:</p>
                        <div className="flex flex-wrap gap-1">
                          {service.languages.map((lang, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm">
                          Get Directions
                        </Button>
                        <Button variant="outline" className="flex-1" size="sm">
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Local News</CardTitle>
              <p className="text-sm text-muted-foreground">Simplified news articles in your language</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {news.map((article) => (
                  <Card key={article._id}>
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{article.category}</Badge>
                            <Badge variant="outline">{article.difficulty} to read</Badge>
                          </div>
                          <h3 className="font-semibold text-lg">{article.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{article.source}</p>
                        </div>
                      </div>

                      <p className="text-sm">{article.summary}</p>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                        </span>
                        <Button variant="outline" size="sm">
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>Complete information about this opportunity</DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {selectedJob.logo ? (
                    <img src={selectedJob.logo} alt={selectedJob.company} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Briefcase className="h-8 w-8 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl">{selectedJob.title}</h3>
                  <p className="text-muted-foreground">{selectedJob.company}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedJob.location}
                    </span>
                    {selectedJob.salary && <span className="font-semibold">{selectedJob.salary}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-semibold text-green-600">
                    <TrendingUp className="h-5 w-5" />
                    {selectedJob.matchScore}% Match
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Requirements</h4>
                <ul className="space-y-1">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">Apply Now</Button>
                <Button variant="outline" className="flex-1">
                  Save Job
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}