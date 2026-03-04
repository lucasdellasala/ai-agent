import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';

const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const prometheusPort = parseInt(process.env.PROMETHEUS_PORT ?? '9464', 10);

const traceExporter = otlpEndpoint
  ? new OTLPTraceExporter({ url: `${otlpEndpoint}/v1/traces` })
  : new ConsoleSpanExporter();

const prometheusExporter = new PrometheusExporter({ port: prometheusPort }, () => {
  console.log(`Prometheus metrics available at http://localhost:${prometheusPort}/metrics`);
});

const sdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? 'ai-agent',
    [ATTR_SERVICE_VERSION]: '2.0.0',
  }),
  traceExporter,
  metricReader: prometheusExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-dns': { enabled: false },
      '@opentelemetry/instrumentation-net': { enabled: false },
    }),
  ],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown().then(
    () => console.log('OTel SDK shut down'),
    (err) => console.error('Error shutting down OTel SDK', err),
  );
});

export { sdk };
