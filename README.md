# 📊 API Monitoring with Push Method (Grafana + VictoriaMetrics)

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Prometheus](https://img.shields.io/badge/Metrics-Prom--Client-orange)
![Grafana](https://img.shields.io/badge/Visualization-Grafana-yellow)
![VictoriaMetrics](https://img.shields.io/badge/Backend-VictoriaMetrics-brightgreen)

> This repository demonstrates API metrics collection using a **push-based** method, sending data directly to **VictoriaMetrics**, and visualized with **Grafana** dashboards.


1. run victoriametrics
docker run -d -p 8428:8428 --name victoriametrics victoriametrics/victoria-metrics
3. Run Grafana
docker run -d -p 3001:3000 grafana/grafana

4. Run automatic hit api for data sample
node tools push-api.js

5. Open Grafana at http://localhost:3001/
victoria monitoring dashboard.json

# 📊 Grafana Dashboard Setup for API Push Monitoring

This document explains how to import and use the Grafana dashboard provided for visualizing API metrics pushed to **VictoriaMetrics**.

---

## 🧾 Dashboard Import Instructions

### 1. Open Grafana

Go to your Grafana instance (e.g., http://localhost:3000) and:

- Login (default: `admin` / `admin`)

---

### 2. Import the Dashboard

- Go to **Dashboards → Import**
- Upload or paste the contents of `victoria monitoring dashboard.json`
- When prompted to select a data source, choose your **VictoriaMetrics** data source (must be configured as **Prometheus type**)
- Click **Import**

---

## 📈 Panels Included

The dashboard contains the following visualizations:

| Panel Title                | Description                                      |
|---------------------------|--------------------------------------------------|
| Total HTTP Requests       | Total number of requests grouped by method/route|
| Error Count               | Total 4xx/5xx responses                          |
| Request Duration Histogram| Shows request latency buckets over time         |
| P95 Latency per Route     | 95th percentile latency grouped by route        |
| Requests per Instance     | Grouped by hostname + PID (via `instance` label)|

---

## 🔍 PromQL Queries Used

You can customize or clone the panels using queries like:

**Total Requests**
```promql
sum(api_victoria_http_requests_total) by (method, route)
