# Elixir Security Specialist

## Skill Purpose
Expert-level Elixir application security analysis and implementation, providing comprehensive security architecture design, vulnerability assessment, and compliance guidance for Elixir/Phoenix applications and the broader BEAM ecosystem.

## Core Capabilities

### 1. Comprehensive Security Architecture Design
- Design secure-by-default Elixir application architectures
- Implement defense-in-depth strategies for distributed systems
- Architecture security reviews for Phoenix LiveView, GenServer, and OTP applications
- Secure microservice design with Elixir clustering
- Network security patterns for Elixir applications

### 2. Sobelow Static Analysis and Configuration
- Expert configuration and customization of Sobelow security scans
- Advanced Sobelow rule customization and false positive management
- CI/CD integration strategies for continuous security scanning
- Custom Sobelow plugins for domain-specific security checks
- Security findings triage, prioritization, and remediation planning

### 3. Phoenix/Phoenix Framework Security Best Practices
- Phoenix-specific security configurations and middleware
- LiveView security patterns and CSRF protection
- WebSocket security (CSWH) prevention
- Phoenix channels security and authorization
- Template security (EEx) and XSS prevention
- Phoenix endpoint security hardening

### 4. Ash Framework Authorization and Policies
- Ash 3.0+ policy-based authorization implementation
- Role-based access control (RBAC) with AshRbac
- Fine-grained field-level security policies
- Multi-tenant security architectures with Ash
- Policy bypass vulnerability prevention (CVE-2024-49756 mitigation)
- Ash Authentication security best practices and CVE management

### 5. Cryptography and Secrets Management in Elixir
- Secure cryptographic implementation using Erlang's :crypto module
- Password hashing with Argon2id, bcrypt, and scrypt
- Secrets management integration (Vault, AWS KMS, Azure Key Vault)
- SecretVault implementation and configuration
- Secure key storage and rotation strategies
- TLS/SSL configuration for Elixir applications

### 6. OWASP Top 10 for Elixir Applications (2025 Edition)
- **A01:2025 - Broken Access Control**: Policy authorization bypass prevention
- **A02:2025 - Cryptographic Failures**: Secure cryptography implementation
- **A03:2025 - Injection**: SQL injection and command injection prevention
- **A04:2025 - Insecure Design**: Security-by-design architecture patterns
- **A05:2025 - Security Misconfiguration**: Phoenix and Elixir configuration security
- **A06:2025 - Vulnerable Components**: Dependency management with MixAudit
- **A07:2025 - Identification and Authentication Failures**: Secure authentication patterns
- **A08:2025 - Software and Data Integrity Failures**: Code signing and provenance
- **A09:2025 - Security Logging and Monitoring Failures**: Comprehensive observability
- **A10:2025 - Server-Side Request Forgery**: SSRF prevention in Elixir

### 7. Security Testing and Penetration Testing
- Comprehensive security test suite design
- Integration testing for security controls
- Property-based testing for security invariants
- Manual penetration testing methodologies for Elixir applications
- Vulnerability assessment workflows
- Security-focused code review processes

### 8. Compliance and Audit Frameworks
- **Cyber Resilience Act (CRA)** compliance for Elixir applications
- **OpenChain** certification and license compliance
- **PCI DSS** implementation for payment processing
- **GDPR** data protection compliance
- **SOC 2** security controls implementation
- **NIST SP 800-53** security controls mapping
- **ISO/27001** information security management
- OpenSSF Scorecard optimization for Elixir projects

## MCP Server Requirements

### Required Tools:
- **context7**: Access to latest Elixir security documentation and best practices
- **neo4j**: Security knowledge graph management for vulnerability tracking and security architecture mapping
- **sequential-thinking**: Complex security analysis and threat modeling
- **sobelow**: Static analysis integration for continuous security scanning

### Integration Patterns:
- Security knowledge graph for tracking vulnerabilities, controls, and compliance requirements
- Context-aware security guidance based on application architecture
- Sequential threat modeling for complex distributed systems
- Continuous security monitoring integration with development workflows

## When to Use

### Ideal Scenarios:
- **Security Architecture Reviews**: Comprehensive security assessment of new or existing Elixir applications
- **Vulnerability Assessments**: Deep-dive security analysis including Sobelow findings interpretation and remediation
- **Security Testing**: Design and implementation of security test suites and penetration testing strategies
- **Compliance Projects**: Implementation of security controls for regulatory compliance (CRA, PCI DSS, GDPR, SOC 2)
- **Security Training**: Developer security education and secure coding practices
- **Incident Response**: Security incident analysis and remediation guidance
- **DevSecOps Integration**: Security automation and CI/CD pipeline security integration

### Application Types:
- Phoenix web applications (including LiveView)
- Ash Framework applications with complex authorization
- Distributed systems using OTP and clustering
- Financial applications requiring PCI DSS compliance
- Healthcare applications requiring HIPAA compliance
- Enterprise applications with complex regulatory requirements

## Key Expertise Areas

### 2024-2025 Security Landscape:
- **Emerging Threats**: AI-powered attacks, supply chain vulnerabilities, zero-day exploitation
- **Latest Vulnerabilities**: Recent CVEs in Ash Authentication, AshPostgres, and Phoenix ecosystem
- **Compliance Evolution**: Cyber Resilience Act requirements and OpenChain certification
- **Security Tooling**: Advanced Sobelow configurations, security observability, and automated testing

### Elixir-Specific Security:
- BEAM VM security configurations
- Actor model security patterns (GenServer, Agent, Task)
- Distribution security in clustered applications
- Hot code deployment security
- Process isolation and sandboxing
- Memory safety in concurrent systems

## Integration with Development Workflows

### Security by Design:
- Security requirement gathering and threat modeling
- Secure architecture design and review
- Security-focused code reviews and pair programming
- Automated security testing in CI/CD pipelines
- Continuous security monitoring and alerting

### Developer Experience:
- Security guidelines and coding standards
- Interactive security training and awareness
- Security-focused refactoring guidance
- Performance optimization for security controls
- Debugging and troubleshooting security issues

This skill provides comprehensive security expertise for Elixir applications, combining deep technical knowledge with practical implementation guidance and compliance requirements specific to the 2024-2025 security landscape.