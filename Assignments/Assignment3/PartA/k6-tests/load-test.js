import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, THRESHOLDS } from './config.js';
import { login, getAuthHeaders } from './helpers.js';

export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp up to 10 users over 1 minute
    { duration: '3m', target: 10 },   // Stay at 10 users for 3 minutes
    { duration: '1m', target: 25 },   // Ramp up to 25 users over 1 minute
    { duration: '3m', target: 25 },   // Stay at 25 users for 3 minutes
    { duration: '1m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: THRESHOLDS,
};

let authToken;

export function setup() {
  // Login once to get token for all virtual users
  const loginRes = http.post(`${BASE_URL}/users/login`, JSON.stringify({
    user: {
      email: 'perf-test@example.com',
      password: 'PerfTest123!'
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });

  if (loginRes.status !== 200) {
    console.log('Login failed, trying to register...');
    // If login fails, try to register
    const registerRes = http.post(`${BASE_URL}/users`, JSON.stringify({
      user: {
        email: 'perf-test@example.com',
        password: 'PerfTest123!',
        username: 'perftest'
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (registerRes.status === 200 || registerRes.status === 201) {
      return { token: registerRes.json('user.token') };
    }
  }

  return { token: loginRes.json('user.token') };
}

export default function (data) {
  const authHeaders = getAuthHeaders(data.token);

  // Test 1: Get articles list
  let response = http.get(`${BASE_URL}/articles`, authHeaders);
  check(response, {
    'articles list status is 200': (r) => r.status === 200,
    'articles list has data': (r) => r.json('articles') !== null,
  });
  sleep(1);

  // Test 2: Get tags
  response = http.get(`${BASE_URL}/tags`, authHeaders);
  check(response, {
    'tags status is 200': (r) => r.status === 200,
  });
  sleep(1);

  // Test 3: Get current user profile
  response = http.get(`${BASE_URL}/user`, authHeaders);
  check(response, {
    'current user status is 200': (r) => r.status === 200,
  });
  sleep(1);

  // Test 4: Create article (only 20% of users)
  if (Math.random() < 0.2) {
    const articlePayload = JSON.stringify({
      article: {
        title: `Performance Test Article ${Date.now()}-${Math.random()}`,
        description: 'Performance test article description',
        body: 'This is a test article for performance testing with k6.',
        tagList: ['test', 'performance', 'k6']
      }
    });

    response = http.post(`${BASE_URL}/articles`, articlePayload, authHeaders);
    check(response, {
      'article created successfully': (r) => r.status === 200 || r.status === 201,
    });

    // If article created, perform additional operations
    if (response.status === 200 || response.status === 201) {
      const slug = response.json('article.slug');
      
      // Test 5: Get the created article
      response = http.get(`${BASE_URL}/articles/${slug}`, authHeaders);
      check(response, {
        'get article status is 200': (r) => r.status === 200,
      });
      sleep(1);

      // Test 6: Favorite the article
      response = http.post(`${BASE_URL}/articles/${slug}/favorite`, null, authHeaders);
      check(response, {
        'favorite successful': (r) => r.status === 200,
      });
    }
  }
}

export function teardown(data) {
  // Optional cleanup
  console.log('Load test completed');
}