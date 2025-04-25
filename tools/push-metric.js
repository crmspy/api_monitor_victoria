const client = require('prom-client');
const axios = require('axios');

// Konfigurasi instance
const INSTANCE_ID = process.env.INSTANCE_ID || 'vm-instance-01';
const VM_PUSH_ENDPOINT = 'http://localhost:8428/api/v1/import/prometheus';

// Registry prom-client
const register = new client.Registry();

// Tambahkan global label (opsional)
register.setDefaultLabels({
  instance: INSTANCE_ID,
  job: 'webhook_monitor'
});

// Metric yang dipantau
const requestCounter = new client.Counter({
  name: 'webhook_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(requestCounter);

// Simulasi metric (atau gunakan update nyata dari middleware)
function simulateMetricUpdate() {
  requestCounter.labels({
    method: 'GET',
    route: '/ping',
    status_code: '200'
  }).inc();
}

// Push metrics ke VictoriaMetrics
async function pushMetrics() {
  try {
    const metrics = await register.metrics();

    const response = await axios.post(VM_PUSH_ENDPOINT, metrics, {
      headers: { 'Content-Type': 'text/plain' }
    });

    console.log(`[${new Date().toISOString()}] ✅ Metrics pushed successfully`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Push failed:`, error.message);
  }
}

// Interval push
setInterval(() => {
  simulateMetricUpdate(); // optional: hapus jika kamu pakai data real dari server
  pushMetrics();
}, 5000); // tiap 10 detik

// Debug awal
console.log('📡 Starting VictoriaMetrics pusher...');
