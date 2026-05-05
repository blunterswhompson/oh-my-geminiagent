---
description: Conduct systematic multi-source research with evidence synthesis and validation
agent: core/deep-research-specialist
subtask: true
---

Systematic multi-source research methodology following a 7-step process: Define → Map → Gather → Evaluate → Synthesize → Validate → Report. Use this command for comprehensive technical investigations requiring evidence-backed conclusions.

!`find docs/ -name "*.md" -type f 2>/dev/null | head -5 || echo "No docs found"`
!`ls README.md ARCHITECTURE.md 2>/dev/null || echo "No architecture docs"`

## Research Methodology (7 Steps)

1. **Define Research Questions**:
   - Break down broad topics into specific, answerable questions
   - Define scope boundaries (in/out of scope)
   - Establish success criteria

2. **Map Source Taxonomy**:
   - Primary sources (official docs, source code, CVEs)
   - Secondary sources (expert analysis, books, talks)
   - Tertiary sources (forums, blogs, news)
   - Grey literature (preprints, white papers, GitHub issues)

3. **Gather Information Systematically**:
   - Phase 1: Broad overview search
   - Phase 2: Targeted subtopic investigation
   - Phase 3: Gap filling
   - Phase 4: Validation search

4. **Evaluate Source Quality** (CRAAP Framework):
   - Currency: How recent?
   - Relevance: Addresses questions?
   - Authority: Author credentials?
   - Accuracy: Can verify claims?
   - Purpose: Any bias?

5. **Synthesize Evidence**:
   - Identify consensus vs debate
   - Document emerging trends
   - Create comparison matrices
   - Provide clear attribution chains

6. **Validate Findings**:
   - Cross-check major claims (2+ sources)
   - Test code examples
   - Resolve contradictions
   - Verify technical accuracy

7. **Report Findings**:
   - Executive summary with recommendations
   - Detailed analysis with confidence levels
   - Methodology documentation
   - Comprehensive references

## Use Cases

- **Technology Evaluation**: GraphQL vs REST, Ash Framework adoption, database selection
- **Security Research**: CVE analysis, vulnerability assessment, threat modeling
- **Technical Decisions**: Architecture patterns, library comparisons, migration strategies
- **Production Readiness**: Maturity assessment, case study analysis, scalability research
- **Learning Research**: Framework deep-dives, best practices compilation, pattern documentation

## Confidence Levels

- **HIGH**: 3+ credible sources agree, validated with primary sources
- **MEDIUM**: 2 sources or mixed signals, some uncertainty remains
- **LOW**: 1 source or contradictory information, needs more research
- **SPECULATION**: Logical inference, no direct evidence

## Output Structure

```
# Research Topic

## Executive Summary
- Key findings with confidence levels
- Recommendation
- Next steps

## Detailed Findings
- Technical analysis
- Comparison matrices
- Trade-offs

## Methodology
- Search strategy
- Sources consulted
- Validation approach

## References
- Annotated source list with quality scores
```


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
