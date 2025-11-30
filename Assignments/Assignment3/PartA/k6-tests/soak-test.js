import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from './config.js';

export const options = {
  stages: [
    { duration: '1m', target: 10 },     // Ramp up
    { duration: '5m', target: 10 },     // Stay at load for 5 minutes (reduced for assignment)
    { duration: '1m', target: 0 },      // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  // Realistic user behavior pattern
  const responses = http.batch([
    ['GET', `${BASE_URL}/articles`, null, { tags: { name: 'GetArticles' } }],
    ['GET', `${BASE_URL}/tags`, null, { tags: { name: 'GetTags' } }],
  ]);

  // Check all responses
  check(responses[0], {
    'articles status is 200': (r) => r.status === 200,
  });
  
  check(responses[1], {
    'tags status is 200': (r) => r.status === 200,
  });

  // Simulate user think time
  sleep(3);
}