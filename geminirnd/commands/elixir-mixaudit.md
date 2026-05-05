---
description: Comprehensive security auditing with MixAudit, Sobelow, and SBOM generation for Elixir projects
agent: elixir-specific/elixir-mixaudit-specialist
subtask: true
---

# Elixir Security Auditing with MixAudit

Perform comprehensive security auditing for Elixir/Phoenix applications using MixAudit for dependency vulnerability scanning, Sobelow for static analysis, and SBOM generation for compliance.

## What This Command Does

This command invokes the **Elixir MixAudit Specialist** agent to help you:
- Install and configure MixAudit for dependency vulnerability scanning
- Track CVEs and security advisories from GitHub Advisory Database
- Generate Software Bill of Materials (SBOM) for compliance
- Integrate Sobelow static analysis for Phoenix-specific vulnerabilities
- Set up CI/CD security gates to block vulnerable deployments
- Assess supply chain security and dependency health
- Store vulnerability data in Neo4j for historical tracking
- Create compliance reports for security audits

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

Before invoking this command, gather the following information using shell commands:

**Check Current Dependencies:**
```bash
!`mix deps.tree`
```

**Check for Existing Security Tools:**
```bash
!`grep -E "mix_audit|sobelow|sbom" mix.exs`
```

**Check Mix Lock Status:**
```bash
!`mix deps.check`
```

**List Installed Security Tools:**
```bash
!`mix help | grep -E "audit|sobelow|sbom"`
```

**Check CI/CD Configuration:**
```bash
!`find .github .gitlab-ci.yml .semaphore -type f 2>/dev/null | head -5`
```

## When to Use This Command

Use `/elixir-mixaudit` when you need to:

### Pre-Deployment Security
- Scan dependencies before deploying to staging or production
- Validate release candidates for security vulnerabilities
- Implement deployment pipeline security gates
- Verify security posture before merging major branches

### Vulnerability Management
- Check for newly published security advisories
- Track CVEs affecting your dependency tree
- Identify vulnerable versions and upgrade paths
- Monitor transitive dependency vulnerabilities

### Compliance and Reporting
- Generate SBOMs for regulatory compliance (SOC2, PCI-DSS)
- Prepare for security audit requirements
- Create vulnerability remediation reports
- Document security posture for stakeholders

### Supply Chain Security
- Assess dependency health and maintainer activity
- Detect retired or abandoned packages
- Identify dependency confusion risks
- Monitor for malicious package submissions

### CI/CD Integration
- Set up GitHub Actions security workflows
- Configure GitLab CI or Semaphore security stages
- Generate SARIF reports for GitHub Code Scanning
- Implement automated vulnerability monitoring

## Usage Examples

### Example 1: Initial Security Audit Setup
```
/elixir-mixaudit set up comprehensive security auditing with MixAudit, Sobelow, and SBOM generation for our Phoenix application
```

### Example 2: Fix Critical Vulnerability
```
/elixir-mixaudit we have a critical CVE in plug - help me identify the vulnerability, find the patched version, and create a remediation plan
```

### Example 3: Generate Compliance Report
```
/elixir-mixaudit generate a complete compliance report with SBOM, vulnerability summary, and dependency health assessment for our SOC2 audit
```

### Example 4: Set Up CI/CD Security Gates
```
/elixir-mixaudit configure GitHub Actions to run MixAudit and Sobelow on every PR and block deployment if critical vulnerabilities are found
```

### Example 5: Assess Supply Chain Risk
```
/elixir-mixaudit analyze our dependency tree for supply chain risks including retired packages, dependency confusion, and low-health dependencies
```

### Example 6: Track Vulnerability History
```
/elixir-mixaudit set up Neo4j to track vulnerability history across all our dependencies with relationships and trends over time
```

## Security Scanning Tools

The agent helps you integrate these security tools:

### MixAudit
- Scans dependencies against GitHub Advisory Database
- Tracks CVEs and security advisories
- Supports ignore files for managed exceptions
- Generates JSON reports for automation

### Sobelow
- Static analysis for Phoenix-specific vulnerabilities
- Detects SQL injection, XSS, CSRF, and other risks
- Configurable severity thresholds
- Integrates with MixAudit for unified reporting

### SBOM Generators
- `sbom` Mix task for CycloneDX format
- `cdxgen` for SPDX and CycloneDX
- Integration with OWASP Dependency-Track
- Compliance with software supply chain standards

### Neo4j Integration
- Store vulnerability history and trends
- Track dependency relationships
- Query historical security data
- Generate audit trails

## Critical Security Rules

The agent follows these critical constraints:

1. **Pre-Deployment Scanning**
   - ALWAYS run security scans before production deployments
   - NEVER deploy with known critical vulnerabilities
   - BLOCK deployments that exceed severity thresholds

2. **Vulnerability Management**
   - TRACK all vulnerabilities in Neo4j for audit trails
   - DOCUMENT false positives with clear justification
   - REVIEW ignore files regularly (minimum monthly)

3. **Dependency Control**
   - ALWAYS commit mix.lock to version control
   - PIN dependency versions for reproducibility
   - VERIFY lockfile is current before deployment

4. **SBOM Requirements**
   - GENERATE SBOMs for every release build
   - VALIDATE SBOMs against specification schemas
   - STORE SBOMs with build artifacts
   - SUBMIT to Dependency-Track for monitoring

5. **CI/CD Integration**
   - AUTOMATE security scans in CI/CD pipeline
   - FAIL builds on critical vulnerabilities
   - UPLOAD scan results as artifacts
   - SCHEDULE weekly vulnerability scans

## Vulnerability Response Workflow

The agent guides you through this remediation process:

1. **Immediate Assessment**
   - Query Neo4j for vulnerability history
   - Classify severity (CVSS scores)
   - Evaluate exploitability and impact

2. **Remediation Planning**
   - Identify patched versions
   - Assess compatibility risks
   - Plan testing strategy

3. **Implementation**
   - Update dependencies to patched versions
   - Run comprehensive tests
   - Verify fixes in staging

4. **Validation**
   - Re-scan with MixAudit
   - Update SBOM
   - Confirm vulnerability resolution

5. **Documentation**
   - Update security records
   - Generate compliance reports
   - Document lessons learned

## Common Security Scenarios

### Scenario 1: Critical Vulnerability in Production
```
Steps the agent will guide you through:
1. Run mix deps.audit --format json --details
2. Identify affected package and CVE
3. Check advisory for patched version
4. Update mix.exs with new version constraint
5. Run mix deps.update <package>
6. Verify with mix deps.audit
7. Update SBOM and deploy
```

### Scenario 2: False Positive Management
```
Steps the agent will guide you through:
1. Research CVE to confirm false positive
2. Add to .mix_audit_ignore with justification
3. Document why vulnerability doesn't apply
4. Set 30-day review reminder
```

### Scenario 3: Compliance Audit Preparation
```
Steps the agent will guide you through:
1. Generate comprehensive security report
2. Create SBOMs in required formats
3. Export vulnerability data from Neo4j
4. Assess dependency health scores
5. Document security policies
```

## What You'll Get

The agent will provide:

1. **Security Configuration**
   - MixAudit installation and setup
   - Sobelow configuration with thresholds
   - Ignore files with documented exceptions
   - CI/CD security workflow templates

2. **Vulnerability Reports**
   - Comprehensive dependency scans
   - CVE tracking with severity levels
   - Patched version recommendations
   - Upgrade path documentation

3. **SBOM Artifacts**
   - CycloneDX and SPDX format SBOMs
   - Dependency inventory with versions
   - License compliance data
   - Integration with Dependency-Track

4. **Neo4j Integration**
   - Vulnerability storage schema
   - Historical tracking queries
   - Dependency relationship graphs
   - Audit trail generation

5. **CI/CD Workflows**
   - GitHub Actions security workflow
   - GitLab CI/Semaphore configurations
   - Security gate implementation
   - SARIF report generation

6. **Compliance Documentation**
   - Security posture reports
   - Vulnerability remediation plans
   - Dependency health assessments
   - Compliance status summaries

## Related Resources

- MixAudit: https://hexdocs.pm/mix_audit/
- Sobelow: https://hexdocs.pm/sobelow/
- SBOM: https://hexdocs.pm/sbom/
- Hex Security: https://hex.pm/docs/security
- Elixir Security Advisories: https://github.com/mirego/elixir-security-advisories
- OWASP Dependency-Track: https://dependencytrack.org/
- CycloneDX: https://cyclonedx.org/

---

**See Also:**
- `/elixir-test` - For security-focused integration testing
- `/backend-reliability` - For secure system architecture
- `/code-refactoring` - For security code improvements

---

This command loads the comprehensive JSON prompt from:

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
