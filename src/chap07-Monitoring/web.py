from flask import Response, Flask
from time import sleep
import random
import prometheus_client
from prometheus_client import Counter, Histogram

app = Flask('prometheus-app')

REQUESTS = Counter(
    'requests', 'Application Request Count',
    ['endpoint']
)

TIMER = Histogram(
    'slow', 'Slow Requests',
    ['endpoint']
)

@app.route('/metrics/')
def metrics():
    return Response(
        prometheus_client.generate_latest(),
        mimetype='text/plain; version=0.0.4; charset=utf-8'
    )


@app.route('/')
def index():
    REQUESTS.labels('/').inc()
    return '<h1>Development Prometheus-backed Flask App</h1>'

@app.route('/database/')
def database():
    with TIMER.labels('/database').time():
        sleep(random.uniform(1, 3))
    return '<h1>Completed expensive database operation</h1>'
