import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Globe, Users, Trophy, ArrowRight, Star } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Gamepad2,
      title: 'Interactive Games',
      description: 'Learn through fun, engaging games designed for all skill levels',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Globe,
      title: 'Cultural Integration',
      description: 'Understand local customs, traditions, and social norms',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Users,
      title: 'Soft Skills',
      description: 'Develop communication, teamwork, and conflict resolution skills',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Trophy,
      title: 'Earn Rewards',
      description: 'Get real-world rewards like discounts and free services',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  const testimonials = [
    {
      name: 'Maria S.',
      role: 'Adult Learner',
      content: 'EduGame4ALL helped me find my first job in just 3 months. The language games made learning fun!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      rating: 5,
    },
    {
      name: 'Ahmed K.',
      role: 'Student',
      content: 'I love the cultural games. They helped me understand local customs and make new friends.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
      rating: 5,
    },
    {
      name: 'Sofia L.',
      role: 'Youth Learner',
      content: 'The soft skills games boosted my confidence. Now I can speak up in groups!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              EduGame4ALL
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Log In
            </Button>
            <Button onClick={() => navigate('/register')} className="bg-gradient-to-r from-purple-600 to-pink-600">
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <section className="container px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                🎮 Gamified Learning Platform
              </Badge>
              <h1 className="text-5xl font-bold leading-tight">
                Learn, Play, Grow
                <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Your Path to Integration
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Master languages, understand cultures, and build soft skills through interactive games. Designed for refugees, migrants, and anyone seeking to integrate into a new community.
              </p>
              <div className="flex gap-4">
                <Button size="lg" onClick={() => navigate('/register')} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-purple-600">10K+</p>
                  <p className="text-sm text-muted-foreground">Active Learners</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">50+</p>
                  <p className="text-sm text-muted-foreground">Interactive Games</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">15+</p>
                  <p className="text-sm text-muted-foreground">Languages</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-3xl opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                alt="People learning together"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </section>

        <section className="container px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose EduGame4ALL?</h2>
            <p className="text-muted-foreground text-lg">Everything you need to succeed in your new community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-6 space-y-4">
                  <div className={`${feature.bgColor} w-14 h-14 rounded-lg flex items-center justify-center`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-muted-foreground text-lg">Hear from our community members</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm">{testimonial.content}</p>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container px-6 py-20">
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold">Ready to Start Your Journey?</h2>
              <p className="text-xl text-purple-100">
                Join thousands of learners building a better future through education
              </p>
              <Button size="lg" variant="secondary" onClick={() => navigate('/register')} className="bg-white text-purple-600 hover:bg-gray-100">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="container px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-purple-600" />
              <span className="font-bold">EduGame4ALL</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 EduGame4ALL. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}