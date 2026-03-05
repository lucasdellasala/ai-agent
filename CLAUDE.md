# CLAUDE.md — AI Agent Production Reference

## Quién es Lucas

Backend/platform engineer (Node.js, TypeScript, NestJS, AWS) pivoteando a AI Integration Engineering freelance en Upwork. Basado en Argentina. Este repo es su pieza de portfolio principal.

## Objetivo del proyecto

Transformar un bot básico de atención al cliente en una **referencia de producción** que demuestre observabilidad, guardrails y control de costos para sistemas con LLMs. La funcionalidad del agente es simple a propósito — la infraestructura alrededor es el showcase.

## Estado actual: TODO COMPLETADO (branch `feat/production-reference-implementation`)

### Lo que se hizo (9 commits, 31 source files, 8 test files, 43 tests)

**Reestructura completa:**
```
src/
  agent/           # Controller, routes, handlers, tools, context, mock data
  llm/             # Provider interface, OpenAI + DeepSeek, pricing, schemas
  guardrails/
    input/         # Validation (Zod), prompt injection detection, sanitization
    output/        # Output parser with retry, content filters
    rate-limiter/  # Token budgets per sesión, circuit breaker
  observability/   # Pino logger, OTel bootstrap, tracing, metrics, request logger
  config/          # Zod-validated env (ambas API keys opcionales, al menos una requerida)
  main.ts
```

**Observabilidad:**
- Pino con PII redaction + prompt hashing (no logea prompts raw)
- OpenTelemetry: traces (Jaeger/OTLP), metrics (Prometheus), auto-instrumentation HTTP/Express
- `withLLMSpan()` wrapper en cada llamada LLM
- Dashboard Grafana pre-armado (tokens, costo, latencia, errores, RPM)
- Docker stack: Jaeger :16686, Prometheus :9090, Grafana :3001

**Guardrails:**
- Pipeline completo: validate → sanitize → injection detect → rate limit → circuit breaker → LLM → parse output → content filter → respond
- Prompt injection: 10 patrones, risk score
- Rate limiter: token budget por sesión con ventana deslizante
- Circuit breaker: CLOSED → OPEN → HALF_OPEN → CLOSED

**Provider abstraction:**
- Interface `ILanguageModelProvider` con `LLMCallMetadata` (model, tokens, latency, cost, finishReason)
- OpenAI y DeepSeek implementados
- API keys opcionales — el default provider se auto-detecta según qué keys hay
- Cost calculator con pricing por modelo

**DX:**
- Dockerfile multi-stage (node:20-alpine, non-root, healthcheck)
- docker-compose con full stack
- 43 tests vitest (unit + integration con mock OpenAI SDK)
- GitHub Actions CI (typecheck + test)
- `.env.example` documentado

**Docs:**
- README con Mermaid diagram, quick start, features, "Production Patterns Demonstrated" table
- `upwork-profile.md` con 3 títulos, bio, 2 specialized profiles, portfolio entry
- `PLAN.md` y `STATUS.md`

### PR abierto
https://github.com/lucasdellasala/ai-agent/pull/2 — título y descripción ya actualizados.

---

## Qué se puede mejorar (backlog priorizado)

### Alta prioridad (impacto directo en portfolio)

1. **Verificar que `docker compose up` funciona end-to-end** — No se testeó en runtime real con una API key. Probar con DeepSeek key, mandar requests, verificar traces en Jaeger y métricas en Grafana.

2. **Hacer merge del PR** — El branch tiene 9 commits limpios. Mergear a main.

3. **Screenshots para el README** — Capturar Jaeger traces, Grafana dashboard, y terminal logs para agregar al README. Un CTO que escanea en 60 segundos necesita ver las imágenes.

4. **Publicar Upwork profile** — Copiar el contenido de `upwork-profile.md` al perfil real de Upwork.

### Media prioridad (mejoras técnicas)

5. **Agregar `parseWithRetry` al flujo real** — El output parser existe pero no está integrado en los providers todavía (los providers parsean directo con `JSON.parse`). Integrar para que si el LLM devuelve JSON malformado, reintente.

6. **Instrumentar con `withLLMSpan` de forma más granular** — Actualmente wrappea todo el method. Podría tener child spans para "prompt construction", "API call", "response parsing".

7. **Tests de integración con Docker** — Test que levante el docker-compose y haga requests reales (se puede hacer con testcontainers o un script bash).

8. **Mejorar el Grafana dashboard** — Agregar panel de cost per conversation, top users by token consumption, alert rules.

### Baja prioridad (nice to have)

9. **Agregar más providers** — Anthropic (Claude), Gemini. Mostrar que la abstracción realmente funciona.

10. **Lint config** — Agregar ESLint con config de TypeScript. El CI workflow no tiene lint todavía.

11. **Hacer el blog de lucasdellasala.com útil** — Escribir un post técnico tipo "How I built production observability for LLM calls" que linkee al repo.

12. **AIGS project** — Mencionar o empezar a buildear el AI governance side project que se menciona en el profile de Upwork.

---

## Decisiones técnicas importantes

| Decisión | Razón |
|---|---|
| Express (no Fastify/NestJS) | Ya estaba, OTel auto-instrumentation lo soporta |
| OTel (no Datadog SDK directo) | Vendor-agnostic, funciona con cualquier backend OTLP |
| Ambas API keys opcionales | Lucas solo tiene DeepSeek key, el repo debe correr sin OpenAI |
| tsx (no ts-node + nodemon) | Más rápido, un solo tool |
| Tests con vitest (no jest) | Más rápido, mejor DX, ESM-friendly |
| Prompts hasheados en logs | Demuestra PII awareness sin logear data sensible |

## Comandos útiles

```bash
npm run dev          # Desarrollo local (tsx watch)
npm run build        # Compilar TypeScript
npm test             # Correr 43 tests
npm run typecheck    # Type check estricto
docker compose -f docker/docker-compose.yml up  # Full stack con observabilidad
```

## Contexto adicional

- **Web personal**: lucasdellasala.com — Next.js, actualmente orientada a "Full Stack Developer". Hay un prompt generado para rediseñarla orientada a AI Integration Engineering (ver sesión anterior).
- **GitHub**: github.com/lucasdellasala
- **El repo NO usa LangChain ni frameworks pesados** — esa es una decisión intencional del CLAUDE.md original.
