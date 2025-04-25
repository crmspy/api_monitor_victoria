const client = require('prom-client');
const os = require('os');
const axios = require('axios'); // Untuk HTTP POST ke VictoriaMetrics

const vmUrl = 'http://localhost:8428/api/v1/import/prometheus'; // URL VictoriaMetrics

const register = new client.Registry();
client.collectDefaultMetrics({ register });

// === Metrik yang Dicatat ===
const requestTotal = new client.Counter({
  name: 'api_victoria_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'instance'],
});
register.registerMetric(requestTotal);

const errorTotal = new client.Counter({
  name: 'api_victoria_http_errors_total',
  help: 'Total HTTP error responses (4xx/5xx)',
  labelNames: ['method', 'route', 'status_code', 'instance'],
});
register.registerMetric(errorTotal);

const durationHistogram = new client.Histogram({
  name: 'api_victoria_http_request_duration_ms',
  help: 'HTTP request durations in ms',
  labelNames: ['method', 'route', 'status_code', 'instance'],
  buckets: [50, 100, 200, 500, 1000, 2000],
});
register.registerMetric(durationHistogram);

// === Dapatkan label instance unik ===
const INSTANCE_ID = `${os.hostname()}-${process.pid}`;

// === Push Metrik ke VictoriaMetrics secara berkala ===
let lastPushTime = Date.now();
const pushInterval = 60000; // Push setiap 60 detik

async function pushToVictoria() {
  const now = Date.now();
  
  // Hanya kirim metrik setiap interval waktu tertentu
  if (now - lastPushTime < pushInterval) {
    return; // Skip push jika belum waktunya
  }

  try {
    const metrics = await register.metrics(); // Ambil semua metrik yang tercatat
    console.log('Metrics:', metrics);
    await axios.post(vmUrl, metrics, {
      headers: { 'Content-Type': 'text/plain' }, // Penting: pakai text/plain
    });
    console.log('Metrics pushed to VictoriaMetrics');
    lastPushTime = now; // Update waktu terakhir push
  } catch (err) {
    console.error('Error pushing metrics to VictoriaMetrics:', err.message);
  }
}

// === Middleware Express untuk push metrik ===
function pushMetricsMiddleware(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const routePath = req.route?.path || req.path;
    const labels = {
      method: req.method,
      route: routePath,
      status_code: res.statusCode,
      instance: INSTANCE_ID,
    };

    requestTotal.labels(labels).inc();
    durationHistogram.labels(labels).observe(duration);

    if (res.statusCode >= 400) {
      errorTotal.labels(labels).inc();
    }

    // Push ke VictoriaMetrics setelah selesai
    pushToVictoria().catch((err) => console.error('Error pushing metrics:', err.message));
  });

  next();
}

module.exports = {
  pushMetricsMiddleware,
};
