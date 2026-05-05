---
description: Rapid tool evaluation and adoption decisions within sprint timelines
agent: testing/tool-evaluator
subtask: true
---

Pragmatic tool evaluation that cuts through marketing hype to deliver clear adoption recommendations. Executes 6-test rapid assessment framework, builds comparison matrices, and creates data-driven ADOPT/TRIAL/ASSESS/AVOID decisions within single sprint.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

!`ls -la config/ lib/ | head -20`
!`git log --oneline --grep="tool\|dependency\|upgrade" | head -10`

## Overview

Evaluates development tools, frameworks, and services for rapid adoption decisions. Protects team from shiny object syndrome while identifying tools that provide genuine competitive advantages. Completes evaluation within 2-week sprint timeline.

## Usage Examples

### 1. Rapid Tool Assessment (6-Test Framework)

Evaluate tool within 2-4 hours using systematic testing:

```bash
@tool-eval "Evaluate Ash Framework for our Phoenix app using 6-test rapid assessment:
1. Hello World test (target: <30 min to running example)
2. CRUD test (target: <1 hour for basic functionality)
3. Integration test (target: <2 hours to connect with Phoenix LiveView)
4. Scale test (benchmark 10k records vs current Ecto performance)
5. Debug test (plant bug, measure time to fix with docs)
6. Deploy test (time to production on Fly.io)

Provide:
- Evaluation scorecard (time vs targets)
- Weighted score (Speed 40%, DX 30%, Scale 20%, Flexibility 10%)
- Clear ADOPT/TRIAL/ASSESS/AVOID recommendation
- Working prototype repository"
```

**What you'll get**:
- All 6 tests completed with timing data
- Evaluation scorecard showing pass/fail per test
- Weighted overall score (e.g., 4.3/5)
- Working prototype code in GitHub
- Performance benchmarks vs current stack
- Clear recommendation with confidence level

### 2. Tool Comparison Matrix

Compare multiple tools with objective criteria:

```bash
@tool-eval "Compare backend architecture options:
- Option A: Ash Framework (resource-based declarative)
- Option B: Phoenix Contexts (current standard)
- Option C: Commanded (CQRS/Event Sourcing)

Comparison criteria:
- Boilerplate reduction
- Learning curve (time to productivity)
- Authorization built-in vs custom
- GraphQL support
- Production usage (company count)
- Vendor lock-in risk
- 2-year TCO for 10-person team

Create decision matrix with weighted scores"
```

**What you'll get**:
- Feature comparison matrix (15+ criteria)
- TCO analysis (2-year projection)
- Vendor lock-in assessment with exit strategy
- Production case studies (3+ companies)
- Decision matrix with weighted criteria
- Recommendation with confidence level
- Migration path from current stack

### 3. Team Readiness Assessment

Evaluate team's ability to adopt tool within sprint timeline:

```bash
@tool-eval "Assess team readiness for Ash Framework adoption:
- Team: 10 engineers (5 senior, 3 mid, 2 junior)
- Current skills: Strong Elixir/Phoenix, 6-24 months experience
- Required skills for Ash: Spark DSL, Resource modeling, Policy auth

Provide:
- Skills gap analysis (hours training needed)
- 4-week adoption roadmap
- Learning resources assessment (docs quality, community)
- Knowledge transfer plan
- Productivity projections (before/after learning curve)
- Decision criteria for ADOPT after trial"
```

**What you'll get**:
- Skills gap matrix with training hours
- 4-week adoption roadmap (weekly goals + deliverables)
- Learning resources curated (docs 4.5/5 quality)
- Knowledge transfer plan (expert development, peer learning)
- Productivity projections (35% gain after 2-week curve)
- Success criteria for trial period

### 4. Cost-Benefit Analysis

Calculate total cost of ownership including hidden costs:

```bash
@tool-eval "Calculate TCO for adopting Chromatic visual testing:
- Current: Manual screenshot comparison
- Proposed: Chromatic cloud service
- Team size: 10 engineers
- Features/month: 40
- Time frame: 2 years

Include:
- Direct costs (subscription, per-snapshot fees)
- Learning investment (training time)
- Hidden costs (maintenance, upgrades)
- Time savings (automation of manual work)
- Opportunity cost (features not shipped)
- Break-even analysis
- ROI projections"
```

**What you'll get**:
- Direct cost breakdown (subscription + usage)
- Learning investment calculation (hours × rate)
- Hidden cost analysis (API usage, scaling fees)
- Time savings projection (hours/month)
- Break-even point (e.g., Month 4)
- 2-year ROI (e.g., 40x return)
- Cost-adjusted decision matrix

### 5. Integration Testing

Verify tool works with existing tech stack:

```bash
@tool-eval "Test integration of Percy visual testing with our stack:
- Phoenix LiveView
- Playwright E2E tests
- GitHub Actions CI/CD
- Existing screenshot workflow

Prototype:
- Percy integration with Playwright
- CI/CD workflow updates
- Baseline screenshot capture
- PR comment integration
- Cost at our scale (40 features/month)
- Migration from current approach"
```

**What you'll get**:
- Working integration prototype
- CI/CD configuration (GitHub Actions YAML)
- Migration guide from current approach
- Integration complexity assessment
- API compatibility verification
- Edge case handling tested
- Deployment complexity measured

### 6. Trial Period Setup

Create structured trial with clear success criteria:

```bash
@tool-eval "Set up 4-week trial for Ash Framework:
- Week 1: Team training (16 hours/engineer)
- Week 2: Pilot feature (Notification Preferences)
- Week 3: Parallel development (3 features)
- Week 4: Evaluation and decision

Define:
- Success criteria (productivity gain ≥20%, bugs <5, satisfaction ≥4.0/5)
- Metrics to track (velocity, bugs, team satisfaction)
- Rollback plan (if trial fails)
- ADOPT criteria (what converts TRIAL → ADOPT)
- Evaluation retrospective template"
```

**What you'll get**:
- 4-week detailed adoption plan
- Success criteria established before trial
- Metrics tracking system (automated)
- Rollback plan (1-week revert time)
- ADOPT decision criteria
- Retrospective template
- Anonymous team survey

### 7. Track Adoption Outcomes

Monitor trial results and update knowledge graph:

```bash
@tool-eval "Generate adoption retrospective for Ash Framework trial:
- Trial period: Jan 8 - Feb 5 (4 weeks)
- Metrics collected: velocity, bugs, satisfaction
- Success criteria: Check if met
- Lessons learned: Technical + process
- ROI calculation: Actual vs projected
- Recommendation: ADOPT/REVERT with evidence

Store in Neo4j:
- Trial results
- Lessons learned
- Best practices
- When to use/avoid Ash"
```

**What you'll get**:
- Quantitative results (velocity +35.5%, bugs -75%)
- Success criteria evaluation (4/4 passed)
- Retrospective document (quant + qual insights)
- Lessons learned with code examples
- ROI calculation (57% Month 1, 1779% annual)
- Neo4j knowledge graph updated
- Recommendations for future evaluations

### 8. Decision Documentation

Create comprehensive evaluation report:

```bash
@tool-eval "Document Ash Framework evaluation decision:
- Executive summary (recommendation + confidence)
- Evaluation methodology (6 tests + comparison)
- Detailed findings (strengths + weaknesses with evidence)
- Decision matrix (weighted criteria)
- TCO analysis (2-year projection)
- Risk assessment (technical + business risks)
- Recommendation (ADOPT with action plan)
- Appendices (prototype, research, surveys)"
```

**What you'll get**:
- Executive summary (1 page, clear recommendation)
- Evaluation methodology documented
- Strengths/weaknesses with code examples
- Decision matrix (weighted 4.34/5 score)
- TCO analysis ($828k Year 1 gain)
- Risk assessment with mitigation
- Action plan (next steps with timeline)
- Supporting evidence linked (prototypes, research)

## What You'll Get

### Evaluation Scorecard

```
Test               Time    Target   Status   Score
─────────────────────────────────────────────────
Hello World        25m     30m      ✓        5/5
CRUD Operations    45m     60m      ✓        5/5
Integration        90m     120m     ✓        4/5
Scale/Performance  55m     60m      ✓        3/5
Debug Test         15m     30m      ✓        5/5
Deploy Test        90m     120m     ✓        4/5
─────────────────────────────────────────────────
Total Time         5h 20m  7h       PASS     4.3/5

Weighted Score:
- Speed to Market (40%): 4.5/5
- Developer Experience (30%): 4.8/5
- Scalability (20%): 3.5/5
- Flexibility (10%): 4.0/5

OVERALL: 4.3/5 - RECOMMEND FOR TRIAL
```

### Decision Matrix

| Criterion | Weight | Tool A | Tool B | Tool C |
|-----------|--------|--------|--------|--------|
| Speed to Market | 40% | 4.5/5 | 3.0/5 | 2.0/5 |
| Developer Experience | 30% | 4.8/5 | 4.0/5 | 2.5/5 |
| Scalability | 20% | 3.5/5 | 4.5/5 | 4.0/5 |
| Flexibility | 10% | 4.0/5 | 5.0/5 | 3.0/5 |
| **Weighted Total** | | **4.18** | **3.70** | **2.63** |

### TCO Analysis

**2-Year Projection**:
- Year 1: $66k investment - $480k savings = **$828k gain**
- Year 2: $890k savings
- **2-Year ROI**: 40x return

### Adoption Roadmap

```markdown
Week 1: Learning (16h/engineer)
- [ ] Team workshop
- [ ] Individual exercises
- [ ] Example resources built

Week 2: Pilot Feature
- [ ] Non-critical feature selected
- [ ] Implementation
- [ ] Production deployment

Week 3: Parallel Development
- [ ] 3 features simultaneously
- [ ] Patterns documented
- [ ] Utilities extracted

Week 4: Decision
- [ ] Metrics analyzed
- [ ] Retrospective held
- [ ] ADOPT or REVERT decided
```

## Reference

- 6-test rapid assessment framework details
- Comparative analysis techniques
- Cost-benefit evaluation methods
- Team readiness assessment criteria
- Trial period best practices
- Adoption outcome tracking patterns

## Integration with Other Agents

- **@elixir-architect**: Architectural implications of tool adoption
- **@senior-software-engineer**: Implementation of evaluated tools
- **@visual-regression**: Visual testing tool evaluations (Percy, Chromatic)
- **@workflow-optimizer**: Process impact of tool adoption

## Core Principles

### Evidence Over Hype
- NEVER adopt based on marketing without POC
- ALWAYS build working prototype
- Research production case studies
- Measure actual performance
- Document trade-offs explicitly

### Sprint-Timeboxed
- Complete evaluation in <2 weeks
- 6-test framework in 2-4 hours
- Trial period max 4 weeks
- Clear go/no-go decision criteria
- Fast feedback loops

### Team-Centric
- Assess team readiness realistically
- Account for learning curve
- Create knowledge transfer plan
- Measure team satisfaction
- Build internal expertise

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
