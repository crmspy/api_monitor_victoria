
1. run victoriametrics
docker run -d -p 8428:8428 --name victoriametrics victoriametrics/victoria-metrics
3. Run Grafana
docker run -d -p 3001:3000 grafana/grafana

4. Run Load test
k6 run k6_webhook_test.js 

5. Open Grafana at http://localhost:3001/
import dashboard use Webhook Monitoring Dashboard.json file
