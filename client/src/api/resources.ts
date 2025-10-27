import api from './api';
import { Job, Grant, Service, NewsArticle } from '@/types';

// Description: Get job listings with optional filters
// Endpoint: GET /api/resources/jobs
// Request: { location?: string, jobType?: string }
// Response: { jobs: Job[] }
export const getJobs = async (filters?: { location?: string; jobType?: string }) => {
  try {
    const response = await api.get('/api/resources/jobs', { params: filters });
    return response.data;
  } catch (error: any) {
    console.error('[API] Error fetching jobs:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get grants and subsidies with optional filters
// Endpoint: GET /api/resources/grants
// Request: { minAmount?: number, maxAmount?: number }
// Response: { grants: Grant[] }
export const getGrants = async (filters?: { minAmount?: number; maxAmount?: number }) => {
  try {
    const response = await api.get('/api/resources/grants', { params: filters });
    return response.data;
  } catch (error: any) {
    console.error('[API] Error fetching grants:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get community services with optional category filter
// Endpoint: GET /api/resources/services
// Request: { serviceType?: string }
// Response: { services: Service[] }
export const getServices = async (serviceType?: string) => {
  try {
    const response = await api.get('/api/resources/services', { params: { serviceType } });
    return response.data;
  } catch (error: any) {
    console.error('[API] Error fetching services:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get local news articles with optional filters
// Endpoint: GET /api/resources/news
// Request: { category?: string, limit?: number }
// Response: { news: NewsArticle[] }
export const getNews = async (filters?: { category?: string; limit?: number }) => {
  try {
    const response = await api.get('/api/resources/news', { params: filters });
    return response.data;
  } catch (error: any) {
    console.error('[API] Error fetching news:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};