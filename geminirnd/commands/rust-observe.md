---
description: Implement comprehensive observability and monitoring for Rust applications with tracing, OpenTelemetry, tokio-console, and metrics
agent: rust-specific/rust-observability-specialist
subtask: true
---

Complete observability strategy with the `tracing` crate, OpenTelemetry-Rust SDK, `tokio-console` runtime inspector, `metrics` crate for Prometheus export, and APM/error tracking for production Rust applications.

!`ls -la ./src/observability.rs ./src/telemetry.rs ./src/metrics.rs 2>/dev/null || echo "No observability modules"`
!`cat Cargo.toml 2>/dev/null | grep -i "tracing\|metrics\|opentelemetry\|tokio-console\|console-subscriber\|sentry"`

1. **Tracing Configuration**:
   - Configure `tracing` with `tracing-subscriber` registry and stacked `Layer`s (stdout, JSON, OTel)
   - Use `EnvFilter::from_default_env()` to drive log levels from `RUST_LOG` without recompilation
   - Apply `#[tracing::instrument(skip(password), fields(user.id = %user_id))]` on critical functions
   - Rotate and buffer log files with `tracing-appender::rolling::daily` for non-blocking IO

2. **Metrics with the `metrics` Crate**:
   - Add `metrics`, `metrics-exporter-prometheus`, and `metrics-util` to `Cargo.toml`
   - Register counters, gauges, and histograms: `counter!("requests_total", "method" => method).increment(1)`
   - Describe metric metadata with `describe_counter!`, `describe_histogram!` for Prometheus `HELP` lines
   - Expose `/metrics` endpoint via `PrometheusBuilder::new().install_recorder()` + Axum route

3. **OpenTelemetry-Rust Integration**:
   - Add `opentelemetry`, `opentelemetry-otlp`, `opentelemetry_sdk`, and `tracing-opentelemetry` to deps
   - Initialize OTLP batch exporter: `opentelemetry_otlp::new_pipeline().tracing().install_batch(runtime::Tokio)`
   - Bridge `tracing` spans to OTel traces with `OpenTelemetryLayer::new(tracer)` in subscriber stack
   - Configure service resource attributes: `OTEL_SERVICE_NAME`, `OTEL_SERVICE_VERSION`, `OTEL_EXPORTER_OTLP_ENDPOINT`
   - Implement W3C trace-context propagation with `TraceContextPropagator` for distributed tracing across services

4. **Tokio Runtime Monitoring**:
   - Enable `tokio-console` by adding `console-subscriber` and running `TOKIO_CONSOLE_BIND=0.0.0.0:6669 cargo run`
   - Initialize with `console_subscriber::init()` at the top of `main()` before the Tokio runtime starts
   - Add `tokio-metrics` to export task poll times, queue depths, and worker utilization to Prometheus
   - Analyze task stalls, hot loops, and waker drop bugs in real time with the `tokio-console` TUI

5. **APM, Error Tracking, and Alerting**:
   - Integrate Sentry via `sentry` + `sentry-tracing` crates — set `attach_stacktrace: true` and `traces_sample_rate`
   - Configure Datadog or Honeycomb by targeting their OTLP endpoint in `OTEL_EXPORTER_OTLP_ENDPOINT`
   - Define SLOs: ≥99.9% availability, P99 latency ≤200ms, error rate ≤0.1% — encode as PromQL alert rules
   - Set up Prometheus `AlertManager` with PagerDuty and Slack notification channels
   - Document incident runbooks referencing dashboard links, rollback procedures, and on-call rotation


## Modern System Standards

### Next.js 15+ (App Router)
- **Architecture**: App Router with Server Components as default. Use `use client` sparingly.
- **Mutations**: Server Actions with Zod validation.
- **Performance**: Optimize for INP (Interaction to Next Paint) and leverage Next.js Data Cache.

### Elixir 2025 (Phoenix/Ash)
- **Architecture**: Phoenix 1.7+ with LiveView 1.1 (Streaming). Ash 3.0 for domain logic.
- **Testing**: ExUnit with StreamData for property-based testing.

### Rust 2024 (Tokio/Axum)
- **Architecture**: Axum with safe concurrency actors and JoinSet for task management.
- **Data Layer**: Compile-time checked SQLx queries.
