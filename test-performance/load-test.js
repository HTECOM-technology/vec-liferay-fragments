import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/latest/dist/bundle.js'

const errorRate = new Rate('error_rate');
const responseTrend = new Trend('response_time');

const BASE_URL = 'http://portal.tctvec.vn';

export const options = {
  scenarios: {
    // constant_load: {
    //   executor: 'constant-vus',
    //   vus: 500,
    //   duration: '5m',
    // },
    find_limit: {
      executor: 'ramping-vus',
      startVUs: 0,
      gracefulRampDown: '30s',
      stages: [
        // Warm-up nhẹ
        { duration: '2m', target: 50 },
        { duration: '3m', target: 50 },

        // Tăng lên 100 VUs và giữ tải
        { duration: '2m', target: 100 },
        { duration: '3m', target: 100 },

        // Tăng lên 200 VUs và giữ tải
        { duration: '2m', target: 200 },
        { duration: '3m', target: 200 },

        // Tăng lên 300 VUs và giữ tải
        { duration: '2m', target: 300 },
        { duration: '3m', target: 300 },

        // Tăng lên 500 VUs và giữ tải lâu hơn
        { duration: '2m', target: 500 },
        { duration: '5m', target: 500 },

        // Ramp-down để server hạ tải từ từ
        { duration: '2m', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% request < 2s
    http_req_failed: ['rate<0.05'],     // Tỉ lệ lỗi < 5%
    error_rate: ['rate<0.05'],
  },
};

export function handleSummary(data) {
  return {
    'test-performance/summary.html': htmlReport(data),
  }
}

export default function Main() {
  const res = http.get(`${BASE_URL}/web/guest`, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'vi-VN,vi;q=0.9',
    },
    timeout: '10s',
  });

  const ok = check(res, {
    'status 200': (r) => r.status === 200,
    'response < 2000ms': (r) => r.timings.duration < 2000,
    'body not empty': (r) => r.body && r.body.length > 0,
  });

  errorRate.add(!ok);
  responseTrend.add(res.timings.duration);

  sleep(1);
}
