const express = require('express');
const { pushMetricsMiddleware } = require('./monitoring/metrics');

const app = express();
app.use(express.json());
app.use(pushMetricsMiddleware);

// Contoh endpoint
app.get('/api/hello', (req, res) => {
  res.status(200).send('Hello with VictoriaMetrics!');
});

app.get('/api/fail', (req, res) => {
  res.status(500).send('Simulated Error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
