---
description: Security analysis and hardening for Elixir/Phoenix applications
agent: elixir-specific/elixir-security
subtask: true
---

Comprehensive security analysis and hardening for Elixir applications using Phoenix, Ash, and best practices.

!`mix deps 2>/dev/null | head -30`
!`ls -la ./config/`

1. **Static Analysis**:
   - Run `mix sobelow --all` for Phoenix vulnerabilities (XSS, SQL injection, path traversal, etc.)
   - Run `mix credo --strict --format=json` for security-focused rules
   - Run `mix deps.audit --include-unused` for dependency vulnerabilities

2. **Dependency Scanning**:
   - Use `mix hex.outdated --all` and `mix hex.audit` for CVE databases
   - Generate dependency inventory with security risk assessment

3. **Code Review**:
   - Analyze injection vulnerabilities (SQL, Command, Code, Template, Path traversal)
   - Review authentication & authorization (password hashing, sessions, MFA, OAuth)
   - Review input validation

4. **Configuration Audit**:
   - Audit Phoenix config (CSRF, secure headers, session encryption, LiveView security)
   - Review Ash authorization policies and field-level security
   - Review database security

5. **Penetration Testing**: Create security test scenarios for OWASP Top 10.


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
