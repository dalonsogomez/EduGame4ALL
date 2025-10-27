/**
 * Demo script to showcase Community Resources API
 * This script demonstrates how to use the resources endpoints
 */

import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000';

// Demo user credentials
const demoUser = {
  email: 'admin@edugame4all.com',
  password: 'Admin@123',
};

let authToken = '';

const makeRequest = async (method: string, endpoint: string, data?: any, params?: any) => {
  const config: any = {
    method,
    url: `${API_URL}${endpoint}`,
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  };
  if (data) config.data = data;
  if (params) config.params = params;

  return axios(config);
};

const login = async () => {
  console.log('🔐 Logging in as admin...\n');
  const response = await makeRequest('post', '/api/auth/login', demoUser);
  authToken = response.data.accessToken;
  console.log('✅ Logged in successfully\n');
};

const demoJobs = async () => {
  console.log('💼 JOB LISTINGS DEMO');
  console.log('='.repeat(60));

  // Get all jobs
  console.log('\n1. Get All Jobs (with personalized match scores):');
  const allJobs = await makeRequest('get', '/api/resources/jobs');
  console.log(`   Found ${allJobs.data.jobs.length} jobs`);
  allJobs.data.jobs.forEach((job: any) => {
    console.log(`   - ${job.title} at ${job.company}`);
    console.log(`     Location: ${job.location} | Type: ${job.jobType}`);
    console.log(`     Match Score: ${job.matchScore}% | Salary: ${job.salary || 'Not specified'}`);
  });

  // Filter by location
  console.log('\n2. Filter by Location (New York):');
  const nyJobs = await makeRequest('get', '/api/resources/jobs', null, { location: 'New York' });
  console.log(`   Found ${nyJobs.data.jobs.length} jobs in New York`);
  nyJobs.data.jobs.forEach((job: any) => {
    console.log(`   - ${job.title} (Match: ${job.matchScore}%)`);
  });

  // Filter by job type
  console.log('\n3. Filter by Job Type (Full-time):');
  const fullTimeJobs = await makeRequest('get', '/api/resources/jobs', null, { jobType: 'Full-time' });
  console.log(`   Found ${fullTimeJobs.data.jobs.length} full-time positions`);
  fullTimeJobs.data.jobs.forEach((job: any) => {
    console.log(`   - ${job.title} at ${job.company} (Match: ${job.matchScore}%)`);
  });

  console.log('\n' + '='.repeat(60) + '\n');
};

const demoGrants = async () => {
  console.log('💰 GRANTS & SUBSIDIES DEMO');
  console.log('='.repeat(60));

  const grants = await makeRequest('get', '/api/resources/grants');
  console.log(`\nFound ${grants.data.grants.length} available grants:\n`);

  grants.data.grants.forEach((grant: any) => {
    console.log(`📋 ${grant.title}`);
    console.log(`   Amount: ${grant.amount}`);
    console.log(`   Deadline: ${new Date(grant.deadline).toLocaleDateString()}`);
    console.log(`   Eligibility:`);
    grant.eligibility.forEach((req: string) => {
      console.log(`     • ${req}`);
    });
    console.log(`   Description: ${grant.description}\n`);
  });

  console.log('='.repeat(60) + '\n');
};

const demoServices = async () => {
  console.log('🏥 COMMUNITY SERVICES DEMO');
  console.log('='.repeat(60));

  // Get all services
  console.log('\n1. All Available Services:');
  const allServices = await makeRequest('get', '/api/resources/services');
  console.log(`   Found ${allServices.data.services.length} services\n`);

  allServices.data.services.forEach((service: any) => {
    console.log(`   📍 ${service.title}`);
    console.log(`      Provider: ${service.provider}`);
    console.log(`      Type: ${service.serviceType}`);
    console.log(`      Address: ${service.address}`);
    console.log(`      Hours: ${service.hours}`);
    console.log(`      Languages: ${service.languages.join(', ')}`);
    console.log(`      Free: ${service.isFree ? 'Yes' : 'No'}`);
    console.log(`      Contact: ${service.phone} | ${service.email}\n`);
  });

  // Filter by type
  console.log('2. Filter by Type (Legal Services):');
  const legalServices = await makeRequest('get', '/api/resources/services', null, {
    serviceType: 'Legal',
  });
  console.log(`   Found ${legalServices.data.services.length} legal service(s)`);
  legalServices.data.services.forEach((service: any) => {
    console.log(`   - ${service.title}: ${service.phone}\n`);
  });

  console.log('='.repeat(60) + '\n');
};

const demoNews = async () => {
  console.log('📰 LOCAL NEWS DEMO');
  console.log('='.repeat(60));

  // Get all news
  console.log('\n1. All News Articles:');
  const allNews = await makeRequest('get', '/api/resources/news');
  console.log(`   Found ${allNews.data.news.length} articles\n`);

  allNews.data.news.forEach((article: any) => {
    console.log(`   📄 ${article.title}`);
    console.log(`      Category: ${article.category} | Difficulty: ${article.difficulty}`);
    console.log(`      Source: ${article.source}`);
    console.log(`      Published: ${new Date(article.publishedDate).toLocaleDateString()}`);
    console.log(`      Summary: ${article.summary}\n`);
  });

  // Filter by category
  console.log('2. Filter by Category (Important):');
  const importantNews = await makeRequest('get', '/api/resources/news', null, {
    category: 'important',
  });
  console.log(`   Found ${importantNews.data.news.length} important article(s)`);
  importantNews.data.news.forEach((article: any) => {
    console.log(`   - ${article.title}`);
  });

  // Limit results
  console.log('\n3. Limit Results (2 articles):');
  const limitedNews = await makeRequest('get', '/api/resources/news', null, { limit: 2 });
  console.log(`   Returned ${limitedNews.data.news.length} articles`);
  limitedNews.data.news.forEach((article: any) => {
    console.log(`   - ${article.title}`);
  });

  console.log('\n' + '='.repeat(60) + '\n');
};

const runDemo = async () => {
  try {
    console.log('\n🎯 Community Resources API Demo\n');
    console.log('This demo showcases the community resources endpoints');
    console.log('including jobs, grants, services, and news with filtering.\n');
    console.log('='.repeat(60) + '\n');

    await login();

    await demoJobs();
    await demoGrants();
    await demoServices();
    await demoNews();

    console.log('✨ Demo completed successfully!\n');
    console.log('Key Features Demonstrated:');
    console.log('  ✅ Personalized job match scoring based on user skills');
    console.log('  ✅ Location and job type filtering');
    console.log('  ✅ Grant listings with eligibility criteria');
    console.log('  ✅ Community services with detailed contact info');
    console.log('  ✅ News articles with category and difficulty filtering');
    console.log('  ✅ Result limiting for pagination\n');

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Demo failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

runDemo();
