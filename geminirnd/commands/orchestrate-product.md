---
description: Coordinate specialized agents to deliver complete product features and manage cross-functional initiatives
agent: core/product-manager-orchestrator
subtask: false
---

Strategic multi-agent coordination for complex product initiatives requiring security, frontend, backend, QA, and other specialists working together toward user value and business goals.

$ARGUMENTS

!`ls -la ./.opencode/agent/*/`
!`cat ./.opencode/docs/Integration_Guide.md 2>/dev/null | head -50`

## What This Command Does

The Product Manager Orchestrator coordinates specialized agents for complex initiatives:
- **Complexity Assessment**: Determines if single-agent or multi-agent approach is needed (≤2 capabilities = single, >2 = multi-agent)
- **Prioritization**: Uses impact/effort matrix to sequence work (strategic → quick wins → fill-ins)
- **Workflow Design**: Creates sequential, parallel, or hybrid agent workflows with clear handoffs
- **Context Gathering**: Provides agents with best practices, guardrails, and architectural patterns
- **Quality Gates**: Validates agent outputs before accepting results or moving to next phase
- **Integration**: Ensures cohesive product outcome aligned with original business goals

## When to Use This Command

✅ **Use Product Orchestrator For**:
- Complex features requiring >3 specialized capabilities (auth, payments, real-time, etc.)
- Security-sensitive features needing coordinated security review
- Multi-phase initiatives (research → design → implement → test → deploy)
- Critical production issues requiring investigation + coordinated fixes
- Technical debt reduction across multiple system components
- Features with high risk or many dependencies

❌ **Don't Use Orchestrator For** (Use Specialist Directly):
- Simple bug fixes → Use `senior-software-engineer`
- UI polish → Use `frontend-designer`
- Database query optimization → Use `elixir-performance-specialist`
- Writing tests → Use `qa-test-engineer`
- Security scan → Use `security-threat-analyst`

## Usage Examples

### Example 1: Simple Feature (Single Agent Sufficient)
```bash
# Request: Fix login button alignment on mobile
# Complexity: Simple (1 capability: frontend CSS)
# Decision: DON'T use orchestrator, use specialist directly

# Instead, use:
/frontend-designer "Fix login button alignment on mobile - center button and add responsive padding"
```

**Why**: Single capability (CSS styling), no dependencies, low risk. Orchestrator would add unnecessary overhead.

### Example 2: Moderate Feature (2-3 Agents)
```bash
# Request: Add OAuth login with Google
orchestrate-product "Add OAuth social login with Google for faster user registration"
```

**What the orchestrator does**:
1. **Assess Complexity**: Moderate (3 capabilities: backend auth, security review, testing)
2. **Select Agents**: 
   - `elixir-broadway` (backend OAuth integration)
   - `security-threat-analyst` (OAuth security review)
   - `qa-test-engineer` (test OAuth flows)
3. **Design Workflow**: Sequential (security review → backend → testing)
4. **Execute with Handoffs**:
   - Security → Backend: PKCE requirement, state parameter validation
   - Backend → Testing: API endpoints, success/error scenarios
5. **Quality Gates**: Validate each phase before proceeding

**Timeline**: 3 days (1 day security, 1.5 days backend, 0.5 days testing)

### Example 3: Complex Feature (5+ Agents)
```bash
# Request: Build payment integration with Stripe
orchestrate-product "Integrate Stripe for premium subscriptions with recurring billing, webhook handling, and refund support"
```

**What the orchestrator does**:
1. **Assess Complexity**: Complex (6+ capabilities: backend, frontend, security, testing, DevOps)
2. **Select Agents**:
   - `prd-writer` (requirements and user stories)
   - `security-threat-analyst` (PCI compliance review)
   - `elixir-broadway` (Stripe API integration, webhook handler)
   - `elixir-liveview-1_1-specialist` (checkout UI, subscription management)
   - `qa-test-engineer` (payment flow tests, webhook tests)
   - `elixir-devops` (webhook endpoint setup, monitoring)
3. **Design Workflow**: Hybrid (sequential planning + parallel implementation)
   ```
   Phase 1 (Sequential): Requirements & Security
     prd-writer → security-threat-analyst
   
   Phase 2 (Parallel): Implementation
     elixir-broadway (backend) ‖ elixir-liveview (frontend) ‖ elixir-devops (infrastructure)
   
   Phase 3 (Sequential): Testing & Launch
     qa-test-engineer → elixir-reviewer → elixir-devops (deploy)
   ```
4. **Execute with Coordination Checkpoints**:
   - After Phase 1: PRD + PCI requirements available for all Phase 2 agents
   - After Phase 2: All agents deliver, integration validation before Phase 3
   - After Phase 3: Full system test, go/no-go decision
5. **Quality Gates**: Each phase validated against best practices, guardrails, security requirements

**Timeline**: 4 weeks (1 week planning, 2 weeks implementation, 1 week testing/launch)

### Example 4: Crisis Management
```bash
# Request: Production security incident - user data exposed
orchestrate-product "URGENT: Investigate and fix security vulnerability that exposed user emails in API response"
```

**What the orchestrator does**:
1. **Assess Severity**: Critical (security incident, data exposure)
2. **Immediate Actions**:
   - `security-threat-analyst` (assess scope, identify vulnerability)
   - `elixir-reviewer` (code audit for similar issues)
   - `senior-software-engineer` (implement immediate fix)
3. **Workflow**: Parallel investigation + sequential fix
   ```
   Phase 1 (Parallel): Investigation
     security-threat-analyst (identify root cause)
     ‖
     elixir-reviewer (find similar patterns in codebase)
   
   Phase 2 (Sequential): Fix & Validation
     senior-software-engineer (implement fix)
     → qa-test-engineer (verify fix, test edge cases)
     → security-threat-analyst (security re-review)
     → elixir-devops (hotfix deploy)
   ```
4. **Coordination**: All agents have access to incident report, work in tight feedback loops
5. **Outcome**: Fix deployed in 4 hours, postmortem document, guardrails updated

**Timeline**: 4-8 hours (depends on severity)

### Example 5: Multi-Phase Product Initiative
```bash
# Request: Build analytics dashboard
orchestrate-product "Create analytics dashboard showing user engagement metrics, conversion funnels, and revenue tracking with drill-down capabilities"
```

**What the orchestrator does**:
1. **Assess Complexity**: Complex (5+ capabilities: requirements, backend, frontend, performance, testing)
2. **Prioritize with Impact/Effort Matrix**:
   - **Do First (High impact, high effort)**: Core metrics dashboard
   - **Quick Wins (High impact, low effort)**: Export to CSV
   - **Defer (Low impact, high effort)**: Advanced drill-down (V2)
3. **Select Agents**:
   - `prd-writer` (define metrics, user stories)
   - `elixir-broadway` (backend aggregations, caching)
   - `elixir-performance-specialist` (optimize queries for 1M+ records)
   - `elixir-liveview-1_1-specialist` (interactive dashboard UI)
   - `qa-test-engineer` (test metric accuracy, performance)
4. **Design Workflow**: Sequential with iterative releases
   ```
   Sprint 1: MVP (3 core metrics)
     prd-writer → elixir-broadway → elixir-liveview → qa-test-engineer
   
   Sprint 2: Performance optimization
     elixir-performance-specialist → qa-test-engineer
   
   Sprint 3: Advanced features (filtering, export)
     elixir-broadway → elixir-liveview → qa-test-engineer
   ```
5. **Execute Iteratively**: Each sprint delivers working feature, validated before next sprint
6. **Outcome**: Dashboard launched incrementally, user feedback incorporated

**Timeline**: 6 weeks (3 sprints × 2 weeks)

### Example 6: Technical Debt Reduction
```bash
# Request: Reduce technical debt in authentication system
orchestrate-product "Refactor authentication system to use modern patterns, improve test coverage, and fix security issues"
```

**What the orchestrator does**:
1. **Assess Scope**: Complex (4+ capabilities: code review, refactoring, security, testing)
2. **Select Agents**:
   - `code-refactoring-expert` (identify refactoring opportunities)
   - `elixir-security` (security audit, fix vulnerabilities)
   - `elixir-reviewer` (code review, pattern enforcement)
   - `qa-test-engineer` (increase test coverage to >90%)
3. **Design Workflow**: Parallel audit + sequential fixes
   ```
   Phase 1 (Parallel): Audit
     code-refactoring-expert (identify tech debt)
     ‖
     elixir-security (find vulnerabilities)
     ‖
     qa-test-engineer (measure current coverage)
   
   Phase 2 (Sequential): Fixes
     Prioritize fixes by impact/effort
     → code-refactoring-expert (refactor high-priority items)
     → elixir-security (fix vulnerabilities)
     → qa-test-engineer (add tests to >90%)
     → elixir-reviewer (final code review)
   ```
4. **Execute with Balance**: 20% of sprint capacity on tech debt (not blocking new features)
5. **Outcome**: 15 tech debt items fixed, 0 security issues, 93% test coverage

**Timeline**: 4 weeks (across multiple sprints)

## What You'll Get

After running this command, the Product Orchestrator will deliver:

### 1. Complexity Assessment Report
```markdown
## Complexity Assessment: OAuth Login Feature

**Complexity Level**: Moderate
**Required Capabilities**: 3 (backend, security, testing)
**Risk Level**: High (authentication is security-sensitive)
**Estimated Effort**: 3 days

**Recommended Approach**: Multi-agent coordination (3 agents)
**Orchestration Strategy**: Sequential workflow with security review first
```

### 2. Prioritization Analysis
```markdown
## Prioritization Matrix

**Strategic Projects** (High impact, high effort):
- OAuth login (enables 60% faster signup - critical)

**Quick Wins** (High impact, low effort):
- [None for this feature]

**Impact Score**: 8/10 (high user value, security requirement)
**Effort Score**: 5/10 (medium effort, well-documented libraries)
**Priority Score**: 1.6 (impact/effort) → DO FIRST
```

### 3. Agent Workflow Design
```markdown
## Workflow: OAuth Login Feature

**Type**: Sequential (dependencies between phases)

### Phase 1: Security Review
**Agent**: security-threat-analyst
**Duration**: 1 day
**Deliverables**:
- Threat model for OAuth flow
- PKCE requirement documentation
- State parameter validation requirements

### Phase 2: Backend Implementation
**Agent**: elixir-broadway
**Duration**: 1.5 days
**Input from Phase 1**: Security requirements, PKCE flow
**Deliverables**:
- OAuth context with register_oauth_user/2
- Google OAuth provider configuration
- Unit tests >90% coverage

### Phase 3: Testing
**Agent**: qa-test-engineer
**Duration**: 0.5 days
**Input from Phase 2**: Implemented endpoints, success/error scenarios
**Deliverables**:
- E2E tests for OAuth flow
- Security test cases (invalid state, expired code)
- Test coverage report
```

### 4. Coordination Checkpoints
```markdown
## Phase 2 Complete: Backend Implementation

**Agent**: elixir-broadway
**Status**: ✅ Complete

### Deliverables:
- [x] OAuth context implemented
- [x] Google provider configured
- [x] Unit tests written (92% coverage)
- [x] Migrations created

### Handoff to Testing Agent:
**Inputs for qa-test-engineer**:
- OAuth flow: GET /auth/google/callback?code=XXX&state=YYY
- Success: Redirects to /dashboard with session
- Error: Redirects to /login with error flash
```

### 5. Final Integration Report
```markdown
## Product Orchestration Report: OAuth Login Feature

**Status**: ✅ Complete and ready for launch
**Timeline**: 3 days (planned) → 2.5 days (actual) ✅ Under budget
**Agents Deployed**: 3 (security-threat-analyst, elixir-broadway, qa-test-engineer)

### Key Deliverables:
- ✅ Security threat model with PKCE requirements
- ✅ OAuth implementation with 92% test coverage
- ✅ E2E tests for success and error scenarios
- ✅ 0 security issues (Sobelow scan passed)

### Success Metrics:
- **Business**: Target 60% OAuth adoption → Baseline established
- **Technical**: <500ms OAuth callback processing → Achieved (avg 320ms)
- **Quality**: >90% test coverage → Achieved (92%)

### Lessons Learned:
✅ Security review BEFORE implementation prevented rework
✅ Feature flag strategy enables safe gradual rollout
📚 Stored OAuth pattern in Neo4j for reuse (GitHub, Microsoft OAuth)
```

### 6. Neo4j Knowledge Graph Updates
**Stored**:
- Multi-agent workflow pattern (sequential OAuth implementation)
- Agent capabilities demonstrated (security review, backend, testing)
- Lessons learned (security review early, feature flags by default)

## How It Works

1. **Complexity Assessment**: Counts required capabilities (backend, frontend, security, etc.) and determines single vs. multi-agent approach
2. **Prioritization**: Uses impact/effort matrix to sequence work and resolve conflicts
3. **Agent Selection**: Selects domain-specific experts (Elixir agents prioritized) based on capabilities
4. **Workflow Design**: Creates sequential, parallel, or hybrid workflow with clear handoffs
5. **Context Gathering**: Provides agents with documentation, best practices, guardrails, architectural patterns
6. **Execution**: Spawns agents with proper context, monitors progress, validates outputs
7. **Quality Gates**: Validates each phase against best practices, guardrails, coverage targets
8. **Integration**: Validates end-to-end functionality and business goal alignment

## Decision Framework

### Use Orchestrator If:
- ✅ Feature requires >2 specialized capabilities
- ✅ High risk or security-sensitive (auth, payments, data access)
- ✅ Multi-phase initiative (research → implement → test → deploy)
- ✅ Critical production issue needing coordinated response
- ✅ Cross-functional work (backend + frontend + security + QA)

### Use Specialist Directly If:
- ❌ Single capability needed (bug fix, UI change, query optimization)
- ❌ Low risk, simple scope
- ❌ Clear, well-defined task
- ❌ No dependencies on other work

## Conflict Resolution

The orchestrator uses these principles when specialists disagree:

**Security vs. Speed**:
- Principle: Minimum Viable Security (MVS)
- Decision: "Ship fast but secure critical paths (auth, payments). Defer non-critical security."

**Performance vs. Features**:
- Principle: User Experience Wins
- Decision: "If feature degrades UX, optimize first OR reduce scope."

**Technical Debt vs. New Features**:
- Principle: Balanced Iteration (20% debt, 80% features)
- Decision: "Refactor ONLY if blocking development or causing production issues."

**Perfect vs. Good Enough**:
- Principle: Ship and Iterate
- Decision: "MVP scope + feature flags for gradual rollout."

## Tips for Best Results

- **Be clear about business goals**: "Increase conversion by 20%" helps prioritization
- **Specify constraints**: Budget, timeline, or technical limitations guide agent selection
- **Indicate urgency**: "URGENT" or "Critical production issue" changes workflow
- **Request specific outcomes**: "Dashboard with <1s load time for 1M records" sets clear targets

## Related Commands

- `/prd-write` - Create PRD first, then orchestrate implementation
- `/elixir-broadway` - Implement backend features directly (no orchestration)
- `/qa-engineer` - Generate tests directly (no orchestration)

## Reference

Multi-agent workflows: `./.opencode/docs/Integration_Guide.md`

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
