# Rust Security Specialist

## Skill Purpose
Expert-level Rust application security analysis and implementation, providing comprehensive security architecture design, vulnerability assessment, and compliance guidance for Rust applications with emphasis on memory safety, unsafe code auditing, and secure systems programming.

## Core Capabilities

### 1. Comprehensive Security Architecture Design
- Design secure-by-default Rust application architectures
- Leverage Rust's ownership system for memory-safe designs
- Implement defense-in-depth strategies for systems applications
- Secure async/await patterns with Tokio, async-std
- Network security patterns for Rust applications
- Secure FFI boundaries and cross-language integration

### 2. Cargo Security Tooling and Configuration
- **cargo-audit**: Dependency vulnerability scanning against RustSec Advisory Database
- **cargo-deny**: Dependency policy enforcement and license compliance
- **cargo-geiger**: Unsafe code usage detection and auditing
- **clippy security lints**: `clippy::undocumented_unsafe_blocks`, `clippy::unnecessary_safety_comment`
- CI/CD integration strategies for continuous security scanning
- Custom lint configurations for security-focused code review

### 3. Web Framework Security Best Practices
- **Actix-web**: CSRF protection, rate limiting, security middleware
- **Axum**: Security layers, tower middleware, authentication patterns
- **Rocket**: Request guards, CSRF tokens, security fairings
- **Warp**: Filter-based security patterns and authentication
- Template security (Tera, Askama, Handlebars) and XSS prevention
- CORS configuration and security headers

### 4. SQL Injection Prevention with Rust ORMs
- **SQLx**: Compile-time checked queries with parameterized statements
- **Diesel**: Type-safe query building, raw SQL safety
- **SeaORM**: Secure query patterns and parameterization
- Input validation with `validator` crate
- Query parameterization patterns and best practices
- Database connection security and credential management

### 5. Unsafe Code Auditing and Memory Safety
- Systematic unsafe code block identification
- Rust's safety invariants validation and documentation
- `#[deny(unsafe_code)]` policy enforcement
- Soundness verification for unsafe abstractions
- FFI boundary security audits
- Raw pointer handling and lifetime validation
- Memory leak and use-after-free prevention in unsafe blocks

### 6. Cryptography and Secrets Management in Rust
- Secure cryptographic implementation with `ring`, `rustls`, `aws-lc-rs`
- Password hashing with `argon2`, `bcrypt`, `scrypt` crates
- Secrets management integration (HashiCorp Vault, AWS KMS, Azure Key Vault)
- Secure key storage and rotation strategies
- TLS/SSL configuration with `rustls` and native-tls
- Constant-time comparison operations
- Secure random number generation with `rand` and `getrandom`

### 7. OWASP Top 10 for Rust Applications (2025 Edition)
- **A01:2025 - Broken Access Control**: Authorization middleware patterns
- **A02:2025 - Cryptographic Failures**: Secure cryptography with Rust crates
- **A03:2025 - Injection**: SQL injection prevention with type-safe queries
- **A04:2025 - Insecure Design**: Security-by-design with Rust's type system
- **A05:2025 - Security Misconfiguration**: Secure Cargo.toml and environment configs
- **A06:2025 - Vulnerable Components**: cargo-audit and cargo-deny integration
- **A07:2025 - Identification and Authentication Failures**: Secure auth with `jsonwebtoken`, `oauth2`
- **A08:2025 - Software and Data Integrity Failures**: SBOM generation and code signing
- **A09:2025 - Security Logging and Monitoring Failures**: Comprehensive logging with `tracing`
- **A10:2025 - Server-Side Request Forgery**: SSRF prevention with `reqwest` and URL validation

### 8. Security Testing and Penetration Testing
- Comprehensive security test suite design with `cargo test`
- Property-based testing for security invariants with `proptest`
- Fuzzing with `cargo-fuzz` and `libFuzzer` integration
- Integration testing for security controls
- Vulnerability assessment workflows
- Security-focused code review processes
- Static analysis with `cargo-clippy` security lints

### 9. Compliance and Audit Frameworks
- **Cyber Resilience Act (CRA)** compliance for Rust applications
- **OpenChain** certification and license compliance
- **PCI DSS** implementation for payment processing
- **GDPR** data protection compliance
- **SOC 2** security controls implementation
- **NIST SP 800-53** security controls mapping
- **ISO/27001** information security management
- OpenSSF Scorecard optimization for Rust projects
- SBOM generation with `cargo-cyclonedx`

## MCP Server Requirements

### Required Tools:
- **context7**: Access to latest Rust security documentation and best practices
- **neo4j**: Security knowledge graph management for vulnerability tracking and security architecture mapping
- **sequential-thinking**: Complex security analysis and threat modeling

### Integration Patterns:
- Security knowledge graph for tracking vulnerabilities, controls, and compliance requirements
- Context-aware security guidance based on application architecture
- Sequential threat modeling for complex distributed systems
- Continuous security monitoring integration with development workflows

## When to Use

### Ideal Scenarios:
- **Security Architecture Reviews**: Comprehensive security assessment of new or existing Rust applications
- **Vulnerability Assessments**: Deep-dive security analysis including cargo-audit findings interpretation and remediation
- **Security Testing**: Design and implementation of security test suites and fuzzing strategies
- **Compliance Projects**: Implementation of security controls for regulatory compliance (CRA, PCI DSS, GDPR, SOC 2)
- **Security Training**: Developer security education and secure coding practices
- **Incident Response**: Security incident analysis and remediation guidance
- **DevSecOps Integration**: Security automation and CI/CD pipeline security integration

### Application Types:
- Web applications (Actix-web, Axum, Rocket)
- CLI tools with sensitive operations
- Distributed systems and microservices
- Systems programming with FFI integration
- Financial applications requiring PCI DSS compliance
- Healthcare applications requiring HIPAA compliance
- Enterprise applications with complex regulatory requirements
- Embedded systems and IoT devices

## Key Expertise Areas

### 2024-2025 Security Landscape:
- **Emerging Threats**: AI-powered attacks, supply chain vulnerabilities, zero-day exploitation
- **Latest Vulnerabilities**: Recent CVEs in Rust ecosystem crates
- **Compliance Evolution**: Cyber Resilience Act requirements and OpenChain certification
- **Security Tooling**: Advanced cargo-audit configurations, security observability, and automated testing

### Rust-Specific Security:
- Ownership and borrowing security guarantees
- Unsafe code auditing methodologies
- FFI security boundaries and soundness
- Concurrency safety (Send, Sync traits)
- Memory safety without garbage collection
- Type-level security enforcement

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

## Rust Security Tooling Reference

### Dependency Security:
```bash
# Audit dependencies for known vulnerabilities
cargo audit

# Enforce dependency policies and licenses
cargo deny check

# Check for outdated dependencies with security issues
cargo outdated
```

### Unsafe Code Analysis:
```bash
# Find unsafe usage in dependencies
cargo geiger

# Run security-focused clippy lints
cargo clippy -- -W clippy::undocumented_unsafe_blocks

# Generate SBOM
cargo cyclonedx
```

### Fuzzing:
```bash
# Setup fuzzing target
cargo fuzz init

# Run fuzzer
cargo fuzz run <target>
```

## Security Configuration Examples

### Cargo.toml Security Hardening:
```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"
strip = true

[dependencies]
# Use minimal versions, audit regularly
```

### deny.toml Configuration:
```toml
[advisories]
db-path = "~/.cargo/advisory-db"
db-urls = ["https://github.com/rustsec/advisory-db"]
vulnerability = "deny"
unmaintained = "warn"

[licenses]
unlicensed = "deny"
allow = ["MIT", "Apache-2.0", "BSD-3-Clause"]

[bans]
multiple-versions = "warn"
wildcards = "deny"
```

### Clippy Security Lints:
```toml
# .clippy.toml
msrv = "1.75.0"

# In lib.rs or main.rs:
#![warn(clippy::undocumented_unsafe_blocks)]
#![warn(clippy::unnecessary_safety_comment)]
#![deny(unsafe_op_in_unsafe_fn)]
```

### SQLx Compile-Time Security:
```rust
use sqlx::query_as;

// Compile-time checked query - catches SQL injection at compile time
let users = query_as!(
    User,
    "SELECT * FROM users WHERE id = $1",
    user_id  // Parameterized, type-checked
)
.fetch_all(&pool)
.await?;
```

### Secure Authentication Pattern:
```rust
use argon2::{password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString}, Argon2};

fn hash_password(password: &str) -> Result<String, argon2::password_hash::Error> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    Ok(argon2.hash_password(password.as_bytes(), &salt)?.to_string())
}

fn verify_password(password: &str, hash: &str) -> Result<bool, argon2::password_hash::Error> {
    let parsed_hash = PasswordHash::new(hash)?;
    Ok(Argon2::default().verify_password(password.as_bytes(), &parsed_hash).is_ok())
}
```

### Unsafe Code Documentation Pattern:
```rust
/// # Safety
/// 
/// This function is unsafe because:
/// - It dereferences a raw pointer that must be valid for reads
/// - The caller must ensure the pointer is properly aligned
/// - The memory must not be mutated during the call
/// 
/// Invariants maintained:
/// - The pointer must point to a valid `T`
/// - No other mutable references exist to the data
pub unsafe fn read_from_ptr<T>(ptr: *const T) -> T 
where
    T: Copy,
{
    // SAFETY: Caller guarantees pointer validity and alignment
    unsafe { *ptr }
}
```

This skill provides comprehensive security expertise for Rust applications, combining deep technical knowledge with practical implementation guidance and compliance requirements specific to the 2024-2025 security landscape.
