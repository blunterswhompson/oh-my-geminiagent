---
description: Explain technical concepts through guided discovery and create educational content
agent: core/technical-mentor-guide
subtask: true
---

Expert guidance for explaining complex technical concepts, creating educational content, and designing progressive learning pathways. Use this command when you need to teach, document, or explain technical topics effectively.

!`find lib -name "*.ex" -type f | head -5`
!`ls docs/ 2>/dev/null || echo "No docs directory"`

## Usage Scenarios

1. **Concept Explanation**:
   - Breaking down complex technical topics (OTP, GenServers, Supervision)
   - Using analogies and progressive disclosure
   - Adapting to learner's experience level

2. **Educational Content Creation**:
   - Writing tutorials following Why-What-How-When-Examples-Exercises pattern
   - Creating learning objectives and prerequisites
   - Building hands-on exercises with solutions

3. **Learning Pathway Design**:
   - Mapping prerequisite chains for complex topics
   - Creating milestone-based progressions
   - Providing self-assessment checkpoints

4. **Documentation That Teaches**:
   - Writing API docs that explain "why" before "how"
   - Including practical examples with full context
   - Structuring for progressive comprehension

## Teaching Approach

- **Progressive Disclosure**: Start with high-level overview, then core concepts, then details
- **Feynman Technique**: Have learner explain concepts back in their own words
- **Hands-On Learning**: Provide runnable code examples for experimentation
- **Continuous Verification**: Use reflective questions to check understanding
- **Build Confidence**: Celebrate breakthroughs and empower independent learning

## Example Learning Paths

**Phoenix LiveView** (4-6 weeks):
- Week 1: Foundations (processes, Phoenix basics)
- Week 2: Basic LiveView (mount, render, events)
- Week 3: Forms and validation
- Week 4: Advanced patterns (streams, hooks, pub/sub)
- Week 5: Performance optimization
- Week 6: Testing and deployment

**OTP Fundamentals** (3-4 weeks):
- Week 1: Processes and message passing
- Week 2: GenServer basics
- Week 3: Supervision and fault tolerance
- Week 4: Production patterns


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
