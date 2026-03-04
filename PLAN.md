# Refactor Plan: AI Agent Production Reference Implementation

## Current State

Basic Express + TypeScript customer-service bot with:
- OpenAI and DeepSeek LLM providers (intent classification + friendly response)
- AsyncLocalStorage-based request context
- Mock database (orders, products, users)
- Intent-based routing (ORDER_STATUS, PRODUCT_OFFER, DERIVATION, OFF_TOPIC)
- No tests, no observability, no guardrails, no Docker setup

### Current Structure
```
src/
  config/dotenv.ts              # dotenv wrapper
  context/                      # AsyncLocalStorage context
  controllers/                  # Agent controller + intent handlers
  data/mockDB.ts                # In-memory mock data
  middlewares/context.ts         # Request context middleware
  routes/                       # Express routes
  services/providers/            # OpenAI + DeepSeek providers
  utils/                        # Logger (in-memory) + sanitizer
  main.ts
```

## Target State

Production reference implementation demonstrating observability, guardrails, and cost control:

### Target Structure
```
src/
  agent/                        # Controller, handlers, routes, tools, context, data
  llm/                          # Provider interface, selector, OpenAI + DeepSeek, pricing
  guardrails/
    input/                      # Validation, prompt injection, sanitization
    output/                     # Output parser, content filters
    rate-limiter/               # Token budgets, circuit breaker
  observability/                # Pino logger, OTel bootstrap, tracing, metrics
  config/                       # Zod-validated env config
  main.ts
```

### New Capabilities
1. **Observability**: Pino structured logging, OpenTelemetry traces/metrics, Jaeger + Prometheus + Grafana stack
2. **Guardrails**: Input validation, prompt injection detection, output parsing with retry, rate limiting, circuit breaker
3. **Cost Tracking**: Per-model token pricing, cost calculation on every LLM call
4. **Developer Experience**: Multi-stage Docker build, docker-compose for full stack, vitest tests, GitHub Actions CI
5. **Type Safety**: Zod-validated config, typed provider returns with metadata

## Key Decisions

| Decision | Rationale |
|---|---|
| Refactor in-place | Preserves git history |
| Keep Express | Already in project, OTel auto-instrumentation support |
| OTel as abstraction layer | Works with Datadog, Grafana, New Relic — no vendor lock-in |
| tsx replaces ts-node + nodemon | Faster, simpler, ESM-compatible |
| Tools in agent/ not llm/ | Tools define agent capabilities, not LLM concerns |
| Keep Spanish customer-service domain | Agent functionality is simple; infrastructure is the showcase |
