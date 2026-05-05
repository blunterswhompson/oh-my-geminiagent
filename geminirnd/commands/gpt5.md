---
description: Consult GPT-5 for deep analysis of complex technical challenges and architectural decisions
agent: core/gpt-5
subtask: true
---

Leverage GPT-5's advanced AI capabilities for complex debugging, architectural decisions, and technical challenges requiring analysis beyond standard approaches. Operates with absolute honesty about tool availability.

!`which cursor-agent 2>/dev/null || echo "cursor-agent not found"`
!`find lib -name "*.ex" -type f | head -5`
!`git log --oneline -5 2>/dev/null || echo "No git history"`

## Overview

The GPT-5 agent provides specialized consultation for:
- **Complex debugging**: Race conditions, concurrency issues, distributed systems
- **Architecture decisions**: Trade-off analysis, technology evaluation
- **Performance investigation**: Bottlenecks requiring fresh perspective
- **Second opinions**: Validation of technical approaches

**Critical**: Always verifies cursor-agent availability. Never simulates GPT-5 responses.

## Usage Scenarios

### 1. Complex Race Condition Debugging
When initial debugging attempts fail:

```bash
@gpt5 Analyze race condition in distributed cache (see lib/cache/distributed.ex)

# Context automatically gathered:
# - Error messages from logs
# - Relevant code sections
# - Reproduction steps
# - System constraints
```

**What you'll get:**
- GPT-5 analysis of potential root causes
- Recommended debugging approaches
- Suggested fixes with code examples
- Trade-offs of different solutions
- Clear attribution (GPT-5 vs agent analysis)

### 2. Architecture Decision Support
Choosing between technical approaches:

```bash
@gpt5 Evaluate: Should we use Ash Framework or plain Ecto for our domain model?

# Provide context:
# - 50+ database tables
# - Complex business logic (authorization, multi-tenancy)
# - Team: 3 mid-level Elixir developers
# - Timeline: 6 months to MVP
```

**What you'll get:**
- GPT-5 trade-off analysis
- Pros/cons for your specific context
- Learning curve assessment
- Migration considerations
- Integration patterns
- Production readiness evaluation
- Confidence level indication

### 3. Performance Bottleneck Investigation
When profiling data is unclear:

```bash
@gpt5 Why is Ash query with aggregates 50x slower than plain Ecto? (see profiling results)

# Context gathered:
# - Before/after query times
# - EXPLAIN ANALYZE output
# - Ash query configuration
# - Database schema
```

**What you'll get:**
- GPT-5 hypothesis about slowdown cause
- Recommended optimization patterns
- Alternative approaches
- Verification steps
- Expected performance improvements

### 4. Distributed Systems Design
For complex coordination patterns:

```bash
@gpt5 How should we prevent duplicate cache fetches across 3 Elixir nodes?

# Context:
# - Node A and B both get cache miss
# - Both fetch from external API (expensive)
# - Both write to cache
# - Expected: Only one node fetches
```

**What you'll get:**
- GPT-5 distributed locking recommendations
- Code examples with full context
- Failure mode analysis
- Performance trade-offs
- Testing strategies

### 5. Technology Evaluation
Deep research on unfamiliar tech:

```bash
@gpt5 Research GraphQL with Absinthe for Phoenix API - pros/cons/production readiness

# Evaluation criteria:
# - Must scale to 10k concurrent users
# - Team knows Phoenix but not GraphQL
# - 3-month timeline
```

**What you'll get:**
- GPT-5 comprehensive analysis
- Comparison with REST
- Production case studies
- Learning curve assessment
- Deployment considerations
- Recommendation with rationale

### 6. Debugging GenServer Crashes
For mysterious production crashes:

```bash
@gpt5 GenServer crashes every 2-3 hours in production, never in dev (see error logs)

# Context:
# - Crashes correlate with high traffic
# - Mailbox size: 10k+ messages before crash
# - No crashes in staging
```

**What you'll get:**
- GPT-5 hypothesis (likely mailbox buildup)
- Root cause analysis
- Prevention patterns (backpressure, rate limiting)
- Code examples
- Monitoring recommendations

## Consultation Protocol

### Step 1: Verify Tool Availability
Before consultation, agent automatically:
1. Checks for cursor-agent binary
2. Tests GPT-5 connectivity
3. Documents tool status

If unavailable:
- Provides honest notification
- Offers fallback analysis from own expertise
- Clearly marks analysis source

### Step 2: Gather Verified Context
Agent collects:
- Exact error messages (verbatim)
- Relevant code with context
- System constraints (versions, deployment)
- Reproduction steps
- Previous debugging attempts

**Never includes speculation or assumptions**

### Step 3: Formulate Precise Question
Agent crafts question with:
- Brief background context
- Specific technical question
- Constraints and requirements
- What's been tried already
- Success criteria

### Step 4: Execute Consultation
Agent:
1. Formats prompt for cursor-agent
2. Invokes GPT-5 with proper parameters
3. Captures complete response
4. Documents consultation details

### Step 5: Synthesize Insights
Agent provides:
- GPT-5 recommendations (clearly attributed)
- Own analysis and additions
- Integration with domain knowledge
- Gaps in GPT-5 response identified
- Actionable implementation plan
- Confidence levels documented

### Step 6: Validate Recommendations
Agent validates by:
- Cross-referencing official documentation
- Testing code examples
- Verifying against community practices
- Identifying limitations
- Running performance benchmarks

## Example Workflows

### Workflow 1: Complex Debugging
```bash
# User reports intermittent GenServer crashes
@gpt5 Analyze GenServer crash pattern (see logs/production.log)

# Agent gathers context:
# - Error messages
# - GenServer code
# - System metrics
# - Traffic patterns

# Agent consults GPT-5:
# - Formulates hypothesis about mailbox buildup
# - Provides prevention patterns
# - Suggests monitoring approach

# Agent validates:
# - Checks official GenServer docs
# - Verifies mailbox monitoring approach
# - Tests recommended fix in dev

# Agent provides synthesis:
# - GPT-5 analysis + validation results
# - Implementation plan (5 steps)
# - Confidence: HIGH (validated against docs)
```

### Workflow 2: Architecture Decision
```bash
@gpt5 Should we adopt Phoenix LiveView or React SPA for real-time dashboard?

# Agent gathers requirements:
# - User count: 10k concurrent
# - Update frequency: 1 update/second
# - Team skills: Phoenix experienced, React beginner
# - Timeline: 4 months

# Agent consults GPT-5:
# - Trade-off analysis
# - Scalability comparison
# - Development speed assessment
# - Team learning curve

# Agent adds context:
# - Production LiveView examples (Discord, Felt)
# - Community best practices
# - Own experience with both approaches

# Agent synthesizes:
# - Recommendation: LiveView (reasoning provided)
# - Implementation approach
# - Risk mitigation
# - Confidence: MEDIUM-HIGH
```

### Workflow 3: Performance Investigation
```bash
@gpt5 Why does adding Ash aggregate cause 50x query slowdown?

# Agent profiles:
# - Before: 15ms (plain Ecto)
# - After: 850ms (Ash with aggregates)
# - EXPLAIN ANALYZE shows N+1 pattern

# Agent consults GPT-5:
# - Query analysis
# - Aggregate optimization patterns
# - Alternative approaches

# Agent validates:
# - Checks Ash documentation
# - Tests optimization in dev
# - Benchmarks results

# Agent provides:
# - Root cause: Incorrect aggregate configuration
# - Fix: Use proper loading strategy
# - Result: 850ms → 35ms (24x improvement)
# - Confidence: HIGH (tested and verified)
```

## What You'll Get

**Consultation Report:**
- Tool status documentation
- Problem summary
- GPT-5 recommendation (verbatim)
- Agent analysis and additions
- Validation results
- Implementation plan
- Confidence level (HIGH/MEDIUM/LOW)
- Next steps

**If GPT-5 Unavailable:**
- Honest notification
- Fallback analysis from agent expertise
- Context7 library research
- Official documentation references
- Community best practices
- Clear source attribution

**Validation Evidence:**
- Official docs cross-referenced
- Code examples tested
- Community practices verified
- Performance benchmarked
- Edge cases identified
- Limitations documented

## Anti-Patterns to Avoid

❌ **Don't ask vague questions**:
```
How do I make my app faster?
```

✅ **Do provide specific context**:
```
My Phoenix API has slow database queries (p95: 850ms).
I've added indexes and use Repo.preload. What other
Ecto query optimization patterns should I investigate?
```

❌ **Don't assume GPT-5 is always right**:
```
GPT-5 said it, so I'll implement without verification.
```

✅ **Do validate recommendations**:
```
GPT-5 recommends X. Let me verify against:
- Official documentation
- Community practices
- Test in development
- Benchmark performance
```

❌ **Don't skip providing context**:
```
@gpt5 How to fix race condition?
```

✅ **Do gather complete context**:
```
@gpt5 Race condition in distributed cache:
- 3 nodes
- Both get cache miss
- Both fetch from API
- Need only one to fetch
- See code: lib/cache/distributed.ex
- Error logs: logs/race.log
```

## Success Criteria

**Consultation is successful when:**
- GPT-5 availability verified (or fallback documented)
- Complete context gathered without speculation
- Precise question formulated
- GPT-5 response captured (or fallback provided)
- Recommendations validated against docs
- Code examples tested
- Implementation plan created
- Confidence level justified
- Clear attribution maintained

**Consultation should be retried if:**
- GPT-5 response too generic (ask follow-up)
- Missing code examples (request specifics)
- Unclear recommendations (ask for clarification)
- Conflicts with documentation (verify and document)


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
