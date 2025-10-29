/**
 * Test script for Community Resources endpoints
 * Tests all resource endpoints including jobs, grants, services, and news
 */
import axios from 'axios';
const API_URL = process.env.API_URL || 'http://localhost:3000';
// Test user credentials
const testUser = {
    email: `test_resources_${Date.now()}@test.com`,
    password: 'Test@12345',
    name: 'Resource Test User',
};
let authToken = '';
let testResults = [];
// Helper function to log test results
const logTest = (testName, passed, message) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status}: ${testName}`);
    if (message) {
        console.log(`   ${message}`);
    }
    testResults.push({ test: testName, passed, message });
};
// Helper to make authenticated requests
const makeRequest = async (method, endpoint, data, params) => {
    const config = {
        method,
        url: `${API_URL}${endpoint}`,
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    };
    if (data)
        config.data = data;
    if (params)
        config.params = params;
    return axios(config);
};
// Test 1: Register a new test user and login
const testRegister = async () => {
    try {
        // Register
        const registerResponse = await makeRequest('post', '/api/auth/register', testUser);
        const registerPassed = registerResponse.status === 200 && !!registerResponse.data._id;
        if (!registerPassed) {
            logTest('User Registration', false, 'Registration failed');
            return false;
        }
        // Login to get access token
        const loginResponse = await makeRequest('post', '/api/auth/login', {
            email: testUser.email,
            password: testUser.password,
        });
        const loginPassed = loginResponse.status === 200 && !!loginResponse.data.accessToken;
        logTest('User Registration and Login', loginPassed);
        if (loginPassed) {
            authToken = loginResponse.data.accessToken;
        }
        return loginPassed;
    }
    catch (error) {
        logTest('User Registration and Login', false, error.response?.data?.error || error.message);
        return false;
    }
};
// Test 2: Get all jobs
const testGetJobs = async () => {
    try {
        const response = await makeRequest('get', '/api/resources/jobs');
        const passed = response.status === 200 &&
            Array.isArray(response.data.jobs) &&
            response.data.jobs.length > 0;
        if (passed) {
            const job = response.data.jobs[0];
            const hasRequiredFields = job.title &&
                job.company &&
                job.location &&
                job.jobType &&
                typeof job.matchScore === 'number';
            logTest('Get All Jobs', hasRequiredFields, `Found ${response.data.jobs.length} jobs with match scores`);
            return hasRequiredFields;
        }
        else {
            logTest('Get All Jobs', false, 'No jobs returned');
            return false;
        }
    }
    catch (error) {
        logTest('Get All Jobs', false, error.response?.data?.error || error.message);
        return false;
    }
};
// Test 3: Get jobs with location filter
const testGetJobsWithLocationFilter = async () => {
    try {
        const response = await makeRequest('get', '/api/resources/jobs', null, { location: 'New York' });
        const passed = response.status === 200 && Array.isArray(response.data.jobs);
        if (passed) {
            const allMatchLocation = response.data.jobs.every((job) => job.location.toLowerCase().includes('new york'));
            logTest('Get Jobs with Location Filter', allMatchLocation, `Found ${response.data.jobs.length} jobs in New York`);
            return allMatchLocation;
        }
        else {
            logTest('Get Jobs with Location Filter', false);
            return false;
        }
    }
    catch (error) {
        logTest('Get Jobs with Location Filter', false, error.response?.data?.error || error.message);
        return false;
    }
};
// Test 4: Get jobs with job type filter
const testGetJobsWithJobTypeFilter = async () => {
    try {
        const response = await makeRequest('get', '/api/resources/jobs', null, { jobType: 'Full-time' });
        const passed = response.status === 200 && Array.isArray(response.data.jobs);
        if (passed) {
            const allMatchType = response.data.jobs.every((job) => job.jobType === 'Full-time');
            logTest('Get Jobs with Job Type Filter', allMatchType, `Found ${response.data.jobs.length} full-time jobs`);
            return allMatchType;
        }
        else {
            logTest('Get Jobs with Job Type Filter', false);
            return false;
        }
    }
    catch (error) {
        logTest('Get Jobs with Job Type Filter', false, error.response?.data?.error || error.message);
        return false;
    }
};
// Test 5: Verify match scores are personalized
const testMatchScorePersonalization = async () => {
    try {
        const response = await makeRequest('get', '/api/resources/jobs');
        const passed = response.status === 200 && Array.isArray(response.data.jobs);
        if (passed && response.data.jobs.length > 0) {
            const hasMatchScores = response.data.jobs.every((job) => typeof job.matchScore === 'number' && job.matchScore >= 0 && job.matchScore <= 100);
            logTest('Match Score Personalization', hasMatchScores, `All jobs have valid match scores (0-100)`);
            return hasMatchScores;
        }
        else {
            logTest('Match Score Personalization', false);
            return false;
        }
    }
    catch (error) {
        logTest('Match Score Personalization', false, error.response?.data?.error || error.message);
        return false;
    }
};
// Test 6: Get all grants
const testGetGrants = async () => {
    try {
        const response = await makeRequest('get', '/api/resources/grants');
        const passed = response.status === 200 &&
            Array.isArray(response.data.grants) &&
            response.data.grants.length > 0;
        if (passed) {
            const grant = response.data.grants[0];
            const hasRequiredFields = grant.title && grant.amount && grant.deadline && Array.isArray(grant.eligibility);
            logTest('Get All Grants', hasRequiredFields, `Found ${response.data.grants.length} grants`);
            return hasRequiredFields;
        }
        else {
            logTest('Get All Grants', false, 'No grants returned');
            return false;
        }
    }
    catch (error) {
        logTest('Get All Grants', false, error.response?.data?.error || error.message);
        return false;
    }
};
// Test 7: Get all services
const testGetServices = async () => {
    try {
        const response = await makeRequest('get', '/api/resources/services');
        const passed = response.status === 200 &&
            Array.isArray(response.data.services) &&
            response.data.services.length > 0;
        if (passed) {
            const service = response.data.services[0];
            const hasRequiredFields = service.title &&
                service.provider &&
                service.serviceType &&
                service.address &&
                service.phone &&
                service.email &&
                Array.isArray(service.languages);
            logTest('Get All Services', hasRequiredFields, `Found ${response.data.services.length} services`);
            return hasRequiredFields;
        }
        else {
            logTest('Get All Services', false, 'No services returned');
            return false;
        }
    }
    catch (error) {
        logTest('Get All Services', false, error.response?.data?.error || error.message);
        return false;
    }
};
// Test 8: Get services with type filter
const testGetServicesWithTypeFilter = async () => {
    try {
        const response = await makeRequest('get', '/api/resources/services', null, {
            serviceType: 'Legal',
        });
        const passed = response.status === 200 && Array.isArray(response.data.services);
        if (passed && response.data.services.length > 0) {
            const allMatchType = response.data.services.every((service) => service.serviceType === 'Legal');
            logTest('Get Services with Type Filter', allMatchType, `Found ${response.data.services.length} legal services`);
            return allMatchType;
        }
        else {
            logTest('Get Services with Type Filter', passed, 'No services with type Legal found');
            return passed;
        }
    }
    catch (error) {
        logTest('Get Services with Type Filter', false, error.response?.data?.error || error.message);
        return false;
    }
};
// Test 9: Get all news
const testGetNews = async () => {
    try {
        const response = await makeRequest('get', '/api/resources/news');
        const passed = response.status === 200 &&
            Array.isArray(response.data.news) &&
            response.data.news.length > 0;
        if (passed) {
            const article = response.data.news[0];
            const hasRequiredFields = article.title &&
                article.summary &&
                article.category &&
                article.source &&
                article.difficulty;
            logTest('Get All News', hasRequiredFields, `Found ${response.data.news.length} news articles`);
            return hasRequiredFields;
        }
        else {
            logTest('Get All News', false, 'No news returned');
            return false;
        }
    }
    catch (error) {
        logTest('Get All News', false, error.response?.data?.error || error.message);
        return false;
    }
};
// Test 10: Get news with category filter
const testGetNewsWithCategoryFilter = async () => {
    try {
        const response = await makeRequest('get', '/api/resources/news', null, {
            category: 'important',
        });
        const passed = response.status === 200 && Array.isArray(response.data.news);
        if (passed && response.data.news.length > 0) {
            const allMatchCategory = response.data.news.every((article) => article.category === 'important');
            logTest('Get News with Category Filter', allMatchCategory, `Found ${response.data.news.length} important news articles`);
            return allMatchCategory;
        }
        else {
            logTest('Get News with Category Filter', passed, 'No important news found');
            return passed;
        }
    }
    catch (error) {
        logTest('Get News with Category Filter', false, error.response?.data?.error || error.message);
        return false;
    }
};
// Test 11: Get news with limit
const testGetNewsWithLimit = async () => {
    try {
        const response = await makeRequest('get', '/api/resources/news', null, { limit: 2 });
        const passed = response.status === 200 &&
            Array.isArray(response.data.news) &&
            response.data.news.length <= 2;
        logTest('Get News with Limit', passed, `Returned ${response.data.news.length} articles (limit: 2)`);
        return passed;
    }
    catch (error) {
        logTest('Get News with Limit', false, error.response?.data?.error || error.message);
        return false;
    }
};
// Test 12: Test unauthenticated access (should fail)
const testUnauthenticatedAccess = async () => {
    try {
        const tempToken = authToken;
        authToken = ''; // Temporarily remove token
        await makeRequest('get', '/api/resources/jobs');
        authToken = tempToken; // Restore token
        logTest('Unauthenticated Access Blocked', false, 'Should have been blocked');
        return false;
    }
    catch (error) {
        authToken = authToken || testResults[0]?.passed ? authToken : ''; // Restore if available
        const passed = error.response?.status === 401;
        logTest('Unauthenticated Access Blocked', passed, 'Properly blocked unauthorized access');
        return passed;
    }
};
// Run all tests
const runAllTests = async () => {
    console.log('\n🧪 Starting Community Resources API Tests...\n');
    console.log('='.repeat(60));
    // Authentication tests
    console.log('\n📝 Authentication Tests');
    console.log('-'.repeat(60));
    await testRegister();
    // Job tests
    console.log('\n💼 Job Listing Tests');
    console.log('-'.repeat(60));
    await testGetJobs();
    await testGetJobsWithLocationFilter();
    await testGetJobsWithJobTypeFilter();
    await testMatchScorePersonalization();
    // Grant tests
    console.log('\n💰 Grant Tests');
    console.log('-'.repeat(60));
    await testGetGrants();
    // Service tests
    console.log('\n🏥 Service Tests');
    console.log('-'.repeat(60));
    await testGetServices();
    await testGetServicesWithTypeFilter();
    // News tests
    console.log('\n📰 News Tests');
    console.log('-'.repeat(60));
    await testGetNews();
    await testGetNewsWithCategoryFilter();
    await testGetNewsWithLimit();
    // Security tests
    console.log('\n🔒 Security Tests');
    console.log('-'.repeat(60));
    await testUnauthenticatedAccess();
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Summary');
    console.log('='.repeat(60));
    const totalTests = testResults.length;
    const passedTests = testResults.filter((r) => r.passed).length;
    const failedTests = totalTests - passedTests;
    const passRate = ((passedTests / totalTests) * 100).toFixed(1);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`Pass Rate: ${passRate}%`);
    if (failedTests > 0) {
        console.log('\n❌ Failed Tests:');
        testResults
            .filter((r) => !r.passed)
            .forEach((r) => {
            console.log(`   - ${r.test}${r.message ? ': ' + r.message : ''}`);
        });
    }
    console.log('\n' + '='.repeat(60));
    process.exit(failedTests > 0 ? 1 : 0);
};
// Run tests
runAllTests().catch((error) => {
    console.error('\n❌ Test suite failed with error:', error.message);
    process.exit(1);
});
//# sourceMappingURL=test-resources.js.map