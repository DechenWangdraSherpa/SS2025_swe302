import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './config.js';

export const options = {
  stages: [
    { duration: '30s', target: 10 },    // Normal load
    { duration: '1m', target: 10 },     // Stable
    { duration: '10s', target: 200 },   // Sudden spike!
    { duration: '2m', target: 200 },    // Stay at spike
    { duration: '30s', target: 10 },    // Back to normal
    { duration: '1m', target: 10 },     // Recovery period
    { duration: '30s', target: 0 },     // Ramp down
  ],
};

export default function () {
  const response = http.get(`${BASE_URL}/articles`);
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
  
  // Also test a lightweight authenticated endpoint
  const tagsResponse = http.get(`${BASE_URL}/tags`);
  check(tagsResponse, {
    'tags status is 200': (r) => r.status === 200,
  });
}