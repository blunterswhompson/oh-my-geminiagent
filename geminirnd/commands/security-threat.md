---
description: Perform comprehensive security threat analysis using STRIDE methodology and OWASP validation
agent: core/security-threat-analyst
subtask: true
---

Comprehensive security analysis combining threat modeling (STRIDE), vulnerability scanning (CVE databases), OWASP Top 10 validation, and defense-in-depth architecture design. Use this command for security audits, code reviews, and penetration testing.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

!cat package-lock.json 2>/dev/null | head -50
!`find lib -name "*controller.ex" -o -name "*live.ex" | head -10`
!`ls -la config/ 2>/dev/null`

## Usage Examples

### 1. Full Security Audit

Comprehensive security assessment of entire codebase:

```bash
@security-threat-analyst Perform a complete security audit including:
- Taint analysis for all user inputs
- CVE scan of dependencies
- STRIDE threat modeling
- OWASP Top 10 validation
- Generate security_audit.md report
```

**What you'll get**:
- Complete taint flow analysis (Neo4j graph)
- CVE vulnerability report with severity ratings
- STRIDE analysis for all components
- OWASP compliance checklist
- Prioritized remediation roadmap

### 2. Analyze Authentication System

Focus on authentication and authorization security:

```bash
@security-threat-analyst Review authentication system in lib/chronodrip_app_web/auth/ for:
- Session management vulnerabilities
- Password hashing strength
- MFA implementation
- Rate limiting
- Session fixation risks
```

**What you'll get**:
- Authentication flow security analysis
- Specific vulnerabilities with code examples
- Remediation code samples
- Test cases for security validation

### 3. API Security Review

Review API endpoints for security issues:

```bash
@security-threat-analyst Analyze all API controllers for:
- SQL injection vulnerabilities
- Missing authorization checks
- CSRF protection
- Rate limiting
- Input validation
```

**What you'll get**:
- Per-endpoint security assessment
- IDOR vulnerability detection
- Missing authorization flags
- Secure coding examples

### 4. Dependency Vulnerability Scan

Check all dependencies for known CVEs:

```bash
@security-threat-analyst Scan mix.lock for CVE vulnerabilities. Prioritize by CVSS score and provide upgrade paths for critical issues.
```

**What you'll get**:
- CVE report with CVSS scores
- Affected versions and fix versions
- Upgrade compatibility analysis
- Security advisory links

### 5. Real-Time Feature Security

Analyze WebSocket and real-time features:

```bash
@security-threat-analyst Review Phoenix LiveView and PubSub implementation for:
- WebSocket authentication
- Message injection risks
- Authorization in handle_event
- Information disclosure via broadcasts
```

**What you'll get**:
- Real-time communication security analysis
- PubSub authorization gaps
- LiveView event handler vulnerabilities
- Secure implementation patterns

### 6. Data Protection Review

Ensure sensitive data is properly protected:

```bash
@security-threat-analyst Audit sensitive data handling:
- Encryption at rest (database fields)
- TLS configuration
- Secrets management
- PII exposure in logs
- Secure password storage
```

**What you'll get**:
- Data classification report
- Encryption status per field
- TLS configuration review
- Secrets in code detection
- GDPR compliance gaps

### 7. Penetration Testing Scenarios

Simulate attack scenarios:

```bash
@security-threat-analyst Use Sequential-Thinking to simulate these attacks:
- Credential stuffing on login
- SQL injection in search
- XSS in comment forms
- CSRF on state-changing endpoints
- Path traversal in file uploads
```

**What you'll get**:
- Attack simulation results
- Exploitation proof-of-concepts
- Detection and prevention strategies
- Automated security tests

### 8. Defense-in-Depth Architecture

Design layered security controls:

```bash
@security-threat-analyst Design defense-in-depth architecture for notifications system including:
- Network layer (WAF, TLS)
- Application layer (input validation, auth)
- Data layer (encryption, access control)
- Monitoring layer (logging, alerting)
```

**What you'll get**:
- 7-layer security architecture
- Implementation examples per layer
- Failure mode analysis
- Monitoring and alerting strategy

## What You'll Get

### Security Audit Report

A comprehensive markdown report (`security_audit.md`) including:

1. **Executive Summary**
   - Risk overview (Critical/High/Medium/Low counts)
   - Top 5 findings
   - Compliance status

2. **Detailed Findings**
   - Vulnerability description
   - Location in code
   - Risk score (CVSS)
   - Attack vector example
   - Remediation steps with code
   - Verification tests

3. **Remediation Roadmap**
   - Phase 1: Critical (immediate)
   - Phase 2: High (30 days)
   - Phase 3: Medium (90 days)
   - Phase 4: Low (ongoing)

4. **OWASP Top 10 Compliance**
   - Status per category
   - Specific violations
   - Fix recommendations

5. **Security Best Practices**
   - Secure development guidelines
   - Code review checklist
   - Security testing procedures

### Neo4j Taint Analysis Graph

Visual representation of data flow from inputs to sinks:
- Entry points (controllers, forms, APIs)
- Sanitization nodes
- Sensitive sinks (database, system commands)
- Unsanitized paths flagged

### Automated Security Tests

ExUnit tests for regression prevention:
```elixir
test "prevents SQL injection in search"
test "enforces authorization on admin endpoints"
test "escapes HTML in user content"
test "rate limits authentication attempts"
```

## Reference

- Taint analysis procedures
- CVE scanning techniques
- STRIDE application patterns
- OWASP validation checklists
- Defense-in-depth implementation
- Security testing strategies

## Integration with Other Agents

- **@senior-software-engineer**: Implements security remediations
- **@systems-architect**: Designs security architecture
- **@technical-mentor-guide**: Teaches secure coding practices
- **@explore**: Finds security-relevant code patterns

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
