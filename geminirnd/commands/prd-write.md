---
description: Create comprehensive Product Requirements Documents with user stories and acceptance criteria
agent: core/prd-writer
subtask: true
---

Transform vague feature requests into comprehensive, testable PRDs that bridge business objectives with technical implementation.

$ARGUMENTS

!`ls -la ./docs/prd/ 2>/dev/null || echo "No PRD directory yet"`
!`ls -la ./lib/*/`

## What This Command Does

The PRD Writer creates detailed Product Requirements Documents following industry standards:
- **Feasibility Analysis**: Validates against existing system capabilities via Neo4j
- **User Stories**: Breaks features into atomic stories with Given/When/Then acceptance criteria
- **Technical Specs**: Defines data models, API contracts, and implementation approach
- **Success Metrics**: Establishes quantifiable metrics (business, UX, technical, quality)
- **Risk Assessment**: Identifies risks with mitigation plans and rollback procedures

## Usage Examples

### Example 1: Simple Feature Request
```bash
# User request: "Add email notifications for new messages"
prd-write "Email notifications when user receives a message"
```

**What you'll get**:
- PRD document: `docs/prd/email_notifications.md`
- 6 user stories (PROJ-201 to PROJ-206)
- API contracts for notification endpoints
- Ecto schemas for notifications table
- Success metrics (target: 80% email open rate)
- Implementation timeline (3 weeks)

### Example 2: Complex Security Feature
```bash
# User request: "Add two-factor authentication"
prd-write "Implement 2FA for user accounts with SMS and authenticator app support"
```

**What you'll get**:
- PRD document: `docs/prd/two_factor_authentication.md`
- 12 user stories covering setup, login, recovery
- Security review requirements (OWASP standards)
- Technical spec (Ecto schemas, Guardian integration, Twilio SMS)
- Edge cases (lost phone, backup codes, rate limiting)
- Risk assessment (SMS interception, account lockout)

### Example 3: Payment Integration
```bash
# User request: "Integrate Stripe payments"
prd-write "Add Stripe payment processing for premium subscriptions"
```

**What you'll get**:
- PRD document: `docs/prd/stripe_payment_integration.md`
- 15 user stories (checkout, webhooks, refunds, subscription management)
- PCI compliance requirements
- Technical spec (Stripe SDK, webhook handler, Oban workers)
- Success metrics (target: <2% payment failure rate, >95% webhook reliability)
- Rollback plan with feature flags

### Example 4: Real-Time Feature
```bash
# User request: "Add real-time collaboration like Google Docs"
prd-write "Real-time collaborative editing with Phoenix LiveView and operational transforms"
```

**What you'll get**:
- PRD document: `docs/prd/realtime_collaboration.md`
- 20 user stories (presence, cursor tracking, conflict resolution, undo/redo)
- Technical spec (Phoenix Channels, PubSub, CRDT or OT library)
- Performance requirements (<100ms latency, 100 concurrent users)
- Edge cases (network interruptions, stale data, race conditions)

### Example 5: Dashboard Analytics
```bash
# User request: "Add analytics dashboard"
prd-write "Analytics dashboard showing user engagement metrics and conversion funnels"
```

**What you'll get**:
- PRD document: `docs/prd/analytics_dashboard.md`
- 10 user stories (metrics display, date range filtering, export to CSV)
- Technical spec (LiveView components, Ecto aggregations, caching strategy)
- Success metrics (dashboard load time <1s for 1M records)
- Implementation phases (MVP: 3 metrics → V2: advanced filtering)

### Example 6: OAuth Social Login
```bash
# User request: "Let users sign in with Google"
prd-write "Add OAuth login with Google, GitHub, and Microsoft"
```

**What you'll get**:
- PRD document: `docs/prd/oauth_social_login.md`
- 12 user stories (login, account linking, provider switching)
- Security requirements (PKCE flow, state parameter validation)
- Technical spec (Ueberauth library, provider configurations)
- MoSCoW prioritization (Must: Google | Should: GitHub | Could: Microsoft)

## What You'll Get

After running this command, the PRD Writer will deliver:

### 1. Comprehensive PRD Document (`docs/prd/{feature_name}.md`)
**Sections**:
- Executive Summary (problem, solution, success criteria, timeline)
- Product Vision (business goals, user goals, out of scope)
- User Personas (primary and secondary)
- User Stories (with unique IDs, acceptance criteria, dependencies)
- Functional Requirements (Must/Should/Could/Won't have)
- Technical Specification (architecture, data models, API contracts)
- Success Metrics (business, UX, technical, quality)
- Risk Assessment (risks, mitigation, rollback plans)
- Implementation Plan (phases, owners, deliverables)

### 2. User Stories with Acceptance Criteria
**Format**: 
```markdown
Story ID: PROJ-101
Title: User can log in with email and password

As a returning user,
I want to log in with my email and password,
So that I can access my personalized dashboard.

**Acceptance Criteria**:

Scenario 1: Successful login
Given I have a verified account with email "user@example.com"
When I enter correct credentials and click "Login"
Then I am redirected to my dashboard within 500ms
And I see a welcome message with my name

Scenario 2: Invalid password
Given I have an account with email "user@example.com"
When I enter an incorrect password
Then I see "Invalid credentials" error message
And my account is NOT locked (no brute-force triggered yet)

**Technical Notes**:
- Use Argon2 for password hashing
- Rate limit: 5 attempts per 15min per IP
- Session storage: Guardian JWT tokens
```

### 3. Technical Specifications with Code Examples
**Includes**:
- Ecto schemas with fields, validations, relationships
- Phoenix contexts with function signatures
- API endpoint contracts (request/response examples)
- Migration files structure
- Dependency requirements (libraries, versions)

### 4. Success Metrics Dashboard
**Metrics**:
- Business: User adoption rate, conversion rate, revenue impact
- UX: Task completion rate, time to complete, error rate
- Technical: API response time, database query time, uptime
- Quality: Test coverage, security scan results, documentation coverage

### 5. Risk Assessment with Mitigation Plans
**For Each Risk**:
- Probability and impact assessment
- Concrete mitigation strategies
- Detection metrics and alerts
- Rollback procedures

### 6. Neo4j Knowledge Graph Updates
**Stored Patterns**:
- PRD entity with user stories and metrics
- User story entities with acceptance criteria
- Technical patterns (e.g., Argon2 password hashing)
- Relationships linking PRD → stories → patterns

## How It Works

1. **Feasibility Check**: Queries Neo4j for existing schemas, modules, and features to avoid duplication
2. **Market Research**: Uses Context7 to research modern implementations and best practices
3. **Spec Definition**: Uses Sequential-Thinking to break feature into atomic user stories
4. **Stakeholder Context**: Gathers business objectives, user personas, success metrics, constraints
5. **Technical Spec**: Defines data models, API contracts, implementation approach aligned with project architecture
6. **Success Metrics**: Establishes quantifiable metrics mapping to business goals
7. **Risk Assessment**: Identifies risks, edge cases, and failure scenarios with mitigation plans
8. **Documentation**: Generates comprehensive PRD document ready for stakeholder review

## Tips for Best Results

- **Be specific**: "Add OAuth login with Google" is better than "improve login"
- **Include context**: Mention user type, business goal, or technical constraint if known
- **Specify constraints**: Budget, timeline, or technical limitations help prioritization
- **Request clarification**: PRD Writer will ask clarifying questions if request is vague

## Related Commands

- `/orchestrate-product` - Coordinate multiple agents for complex features
- `/qa-engineer` - Generate comprehensive test suites from PRD user stories
- `/elixir-broadway` - Implement backend features from PRD technical specs

## Reference


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
