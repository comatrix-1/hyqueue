import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import {
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const otlpEndpoint = process.env.NEXT_PUBLIC_OTLP_ENDPOINT;
const otlpApiKey = process.env.NEXT_PUBLIC_OTLP_API_KEY;

const provider = new WebTracerProvider({
  spanProcessors: [
    new SimpleSpanProcessor(
      new OTLPTraceExporter({
        url: otlpEndpoint,
        headers: {
          Authorization: `Bearer ${otlpApiKey}`,
        },
      })
    ),
    new SimpleSpanProcessor(new ConsoleSpanExporter()),
  ],
});

provider.register();
