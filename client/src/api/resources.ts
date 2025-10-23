import api from './api';
import { Job, Grant, Service, NewsArticle } from '@/types';

// Description: Get job listings
// Endpoint: GET /api/resources/jobs
// Request: { type?: string, industry?: string }
// Response: { jobs: Job[] }
export const getJobs = async (filters?: { type?: string; industry?: string }) => {
  // Mocking the response
  return new Promise<{ jobs: Job[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        jobs: [
          {
            _id: '1',
            title: 'Warehouse Associate',
            company: 'LogisticsCorp',
            location: 'City Center',
            type: 'full-time',
            matchScore: 85,
            requirements: ['Basic Spanish', 'Teamwork', 'Physical fitness'],
            salary: '€1,200 - €1,500/month',
            postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=LC',
          },
          {
            _id: '2',
            title: 'Kitchen Assistant',
            company: 'Restaurant Plaza',
            location: 'Downtown',
            type: 'part-time',
            matchScore: 72,
            requirements: ['Basic Spanish', 'Food handling'],
            salary: '€900/month',
            postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=RP',
          },
          {
            _id: '3',
            title: 'Community Volunteer',
            company: 'Local NGO',
            location: 'Various',
            type: 'volunteer',
            matchScore: 90,
            requirements: ['Communication skills', 'Empathy'],
            postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=LN',
          },
        ],
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/resources/jobs', { params: filters });
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get grants and subsidies
// Endpoint: GET /api/resources/grants
// Request: {}
// Response: { grants: Grant[] }
export const getGrants = async () => {
  // Mocking the response
  return new Promise<{ grants: Grant[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        grants: [
          {
            _id: '1',
            name: 'Integration Support Fund',
            organization: 'City Council',
            amount: 'Up to €500',
            eligibility: ['Refugees', 'Arrived within 2 years', 'Proof of residence'],
            deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Financial support for integration activities including language courses and job training',
          },
          {
            _id: '2',
            name: 'Education Grant',
            organization: 'Ministry of Education',
            amount: 'Up to €1,000',
            eligibility: ['Students', 'Under 25 years old', 'Enrolled in education'],
            deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Support for educational materials and tuition fees',
          },
        ],
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/resources/grants');
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get community services
// Endpoint: GET /api/resources/services
// Request: { category?: string }
// Response: { services: Service[] }
export const getServices = async (category?: string) => {
  // Mocking the response
  return new Promise<{ services: Service[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        services: [
          {
            _id: '1',
            name: 'Legal Aid Center',
            category: 'Legal Aid',
            address: '123 Main Street, Madrid',
            phone: '+34 123 456 789',
            email: 'info@legalaid.org',
            hours: 'Mon-Fri 9:00-17:00',
            languages: ['Spanish', 'English', 'Arabic'],
            isFree: true,
            coordinates: { lat: 40.4168, lng: -3.7038 },
          },
          {
            _id: '2',
            name: 'Community Health Clinic',
            category: 'Healthcare',
            address: '456 Health Ave, Madrid',
            phone: '+34 987 654 321',
            email: 'contact@healthclinic.org',
            hours: 'Mon-Sat 8:00-20:00',
            languages: ['Spanish', 'English', 'French'],
            isFree: true,
            coordinates: { lat: 40.4200, lng: -3.7100 },
          },
          {
            _id: '3',
            name: 'Housing Support Office',
            category: 'Housing Support',
            address: '789 Support Blvd, Madrid',
            phone: '+34 555 123 456',
            email: 'help@housing.org',
            hours: 'Mon-Fri 10:00-18:00',
            languages: ['Spanish', 'Arabic'],
            isFree: true,
            coordinates: { lat: 40.4150, lng: -3.7000 },
          },
        ],
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/resources/services', { params: { category } });
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get local news
// Endpoint: GET /api/resources/news
// Request: { category?: string }
// Response: { news: NewsArticle[] }
export const getNews = async (category?: string) => {
  // Mocking the response
  return new Promise<{ news: NewsArticle[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        news: [
          {
            _id: '1',
            title: 'Community Festival This Weekend',
            summary: 'Join us for a celebration of cultures with food, music, and activities for all ages.',
            category: 'events',
            source: 'Local News',
            difficulty: 'easy',
            publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            content: 'Full article content here...',
          },
          {
            _id: '2',
            title: 'New Job Training Programs Available',
            summary: 'The city announces free vocational training for refugees and migrants.',
            category: 'important',
            source: 'City Council',
            difficulty: 'easy',
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            content: 'Full article content here...',
          },
          {
            _id: '3',
            title: 'Understanding Local Holidays',
            summary: 'Learn about upcoming traditional celebrations and what they mean.',
            category: 'culture',
            source: 'Cultural Center',
            difficulty: 'medium',
            publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            content: 'Full article content here...',
          },
        ],
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/resources/news', { params: { category } });
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};