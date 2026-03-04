# Upwork Profile Copy

## Title Options (max 70 chars)

1. **AI Integration Engineer | LLM Pipelines with Observability & Guardrails**
2. **I Ship AI Features to Production — With Monitoring, Safety & Cost Control**
3. **AI-to-Production Engineer | Observable, Safe LLM Systems in TypeScript**

---

## Overview / Bio

I help companies move AI features from prototype to production. My focus is the infrastructure nobody thinks about until something breaks — input validation, output guardrails, cost monitoring, and observability.

I've spent years building production Node.js and TypeScript systems, from NestJS APIs handling real-time workloads to AWS infrastructure running on ECS Fargate with SQS queues and RDS databases. I implemented structured logging and observability pipelines with PII obfuscation — the kind of work that keeps your Datadog bills useful instead of just expensive. More recently, I've been building compliance middleware for AI systems in regulated industries, tackling the governance problems that come when LLMs meet production requirements.

**What I deliver:**

- **LLM API integration** — Structured outputs with Zod validation, automatic retry on malformed responses, fallback strategies across providers (OpenAI, DeepSeek, or your preferred model). Provider-agnostic design so you're never locked in.
- **AI observability** — OpenTelemetry instrumentation on every LLM call: token tracking, cost-per-conversation dashboards, latency monitoring, input/output logging with PII-safe prompt hashing. Works with Datadog, Grafana, New Relic, or any OTLP-compatible backend.
- **Production hardening** — Rate limiting with per-user token budgets, prompt injection detection, input sanitization, circuit breakers for provider outages, content filtering on outputs.
- **Infrastructure** — Containerized deployments with multi-stage Docker builds, CI/CD pipelines, infrastructure as code. Everything typed, tested, and ready for code review.

I'm based in Argentina (UTC-3), which means strong overlap with US Eastern and Central time zones. I communicate async-first, ship working code with tests, and document decisions as I go.

---

## Skills to Tag

- Node.js
- TypeScript
- NestJS
- OpenAI API
- LLM Integration
- AI/ML
- AWS (ECS, Lambda, SQS)
- API Development
- REST API
- Docker
- CI/CD
- Monitoring & Observability
- Python

---

## Specialized Profile 1: AI Integration & LLM Engineering

### Title
AI Integration Engineer | Production-Ready LLM Pipelines

### Overview

I take AI prototypes and turn them into production systems. If your team has a working proof-of-concept with OpenAI or another LLM provider and needs it shipped with proper observability, cost controls, and safety guardrails — that's what I do.

**Key services:**

- **LLM API integration** with structured output validation, retry logic, and multi-provider support. Interface-based design that lets you swap between OpenAI, DeepSeek, or any compatible provider without changing application code.
- **AI observability** — OpenTelemetry instrumentation for every LLM call. Token counting, cost tracking, latency histograms, and error rate monitoring. Pre-built dashboards for Grafana or compatible with Datadog via OTLP.
- **Guardrails and safety** — Prompt injection detection, input validation, output schema enforcement with automatic retries, per-user rate limiting with token budgets, and circuit breaker patterns for provider resilience.
- **Cost optimization** — Per-model pricing calculations on every call, cost-per-conversation tracking, token budget enforcement to prevent runaway spend.

I work in TypeScript with Node.js, deploy to AWS (ECS Fargate, Lambda), and test everything with vitest. My open-source reference implementation demonstrates all of these patterns: [github.com/lucasdellasala/ai-agent](https://github.com/lucasdellasala/ai-agent).

---

## Specialized Profile 2: Backend & Platform Engineering

### Title
Backend Engineer | Scalable Node.js/TypeScript APIs with Observability

### Overview

I build backend systems in Node.js and TypeScript that are designed for production from day one — typed strictly, logged structurally, monitored automatically, and deployed in containers.

**Key services:**

- **API design and development** — Express and NestJS APIs with Zod-validated inputs, structured error handling, and OpenAPI-compatible patterns. Clean module boundaries that scale with your team.
- **Cloud infrastructure** — AWS deployments on ECS Fargate, SQS-driven async processing, RDS database integration. Dockerized with multi-stage builds, health checks, and non-root containers.
- **Observability** — Structured JSON logging with Pino, PII redaction built into the logging pipeline, OpenTelemetry tracing, Prometheus metrics. I've set up monitoring stacks from scratch and integrated with Datadog, Axiom, and Grafana.
- **Developer experience** — CI/CD pipelines with GitHub Actions, comprehensive test suites with vitest, TypeScript strict mode, and documented configuration. The kind of codebase where new team members can be productive on day one.

I'm a LATAM-based contractor with strong US timezone overlap and fluent English communication. I prefer async-first workflows and ship pull requests with clear commit messages and test coverage.

---

## Portfolio Project: AI Agent Reference Implementation

### Title
Production-Grade AI Agent with Observability, Guardrails & Cost Control

### Problem
Companies struggle to move AI prototypes to production. The LLM call works in a notebook, but there's no observability on token usage, no cost tracking, no protection against prompt injection, and no circuit breakers for when the provider goes down. The gap between "it works locally" and "it's running in production safely" is where projects stall.

### Solution
A reference implementation that demonstrates every production pattern needed for AI agent systems. Built as a customer-service bot (intentionally simple domain), the showcase is the infrastructure around it:

- **OpenTelemetry integration** — Every LLM call emits traces (Jaeger) and metrics (Prometheus). A pre-built Grafana dashboard shows token usage over time, cost per conversation, latency distribution, and error rates.
- **Input/output guardrails** — Zod validation on inputs, prompt injection detection with risk scoring, input sanitization, structured output parsing with automatic retry, and pluggable content filters.
- **Token cost tracking** — Per-model pricing map with automatic cost calculation. Per-session token budgets prevent runaway spend.
- **Provider abstraction** — Interface-based LLM integration. Ships with OpenAI and DeepSeek; add any provider by implementing one interface.
- **Production-ready DX** — Multi-stage Docker build, full observability stack in docker-compose, 43 automated tests, GitHub Actions CI.

### Tech Stack
TypeScript, Express, OpenAI SDK, Zod, OpenTelemetry, Pino, Prometheus, Jaeger, Grafana, Docker, vitest

### Link
[github.com/lucasdellasala/ai-agent](https://github.com/lucasdellasala/ai-agent)
