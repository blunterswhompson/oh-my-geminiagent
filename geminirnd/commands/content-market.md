---
description: Create compelling content that transforms complex technical topics into accessible narratives
agent: core/content-marketer-writer
subtask: true
---

Transform complex technical topics into engaging, accessible content for general audiences using direct response copywriting principles and research-backed approaches.

!`ls .content/ 2>/dev/null || echo "No content directory found"`
!`find lib -name "*.ex" -type f | head -5`
!`grep -r "defmodule" lib | head -3 || echo "No modules found"`

## Overview

The Content Marketer Writer operates in two modes:

**OUTLINE Mode**: Creates structured outlines (max 5 H2 sections) with research-backed content descriptions
**WRITE Mode**: Produces full articles at 8th-grade reading level with conversational tone and varied sentence structure

## Usage Scenarios

### 1. Technical Blog Posts
Transform complex Elixir/Phoenix topics into accessible explanations:

```bash
@content-market Create outline for "Phoenix LiveView for React Developers"
```

**What you'll get:**
- H1 title under 70 characters (engaging yet clear)
- 5 H2 sections with sentence-case headings
- Specific content descriptions (not vague summaries)
- Saved to `.content/phoenix-liveview-for-react-developers.md`

**Then write:**
```bash
@content-market Write full article from outline in .content/phoenix-liveview-for-react-developers.md
```

**What you'll get:**
- Conversational, transcript-style prose
- 8th-grade Flesch-Kincaid reading level
- Varied sentence structure (burstiness: 2-30 word sentences)
- ~30% vocabulary variety (less common synonyms)
- Intentional minor grammatical imperfections for authenticity
- Sections max 300 words each
- Markdown tables for statistics
- Bullet points for dense information
- Smooth transitions between sections
- All facts verified and cited

### 2. Product Documentation
Make technical documentation accessible and engaging:

```bash
@content-market Create outline for "Getting Started with Ash Framework"
```

**Focus:**
- Installation steps (clear, copy-paste ready)
- First example (working code in 15 lines)
- Common patterns (practical, real-world)
- Production considerations (deployment, testing)
- Troubleshooting (actual error messages and fixes)

### 3. Marketing Copy
Create direct response copy that converts:

```bash
@content-market Write landing page copy for Oban Pro features
```

**What you'll get:**
- Attention-grabbing headline
- Problem statement (pain points)
- Solution explanation (benefits, not features)
- Social proof (case studies, testimonials)
- Clear call-to-action
- Scannable format (bullets, short paragraphs)

### 4. Case Studies
Transform technical success stories into compelling narratives:

```bash
@content-market Create outline for "How Discord Scales to 5M Users with Elixir"
```

**Structure:**
- The challenge (specific metrics)
- The solution (technical approach)
- The results (quantified improvement)
- Lessons learned (actionable insights)

### 5. Educational Content
Create tutorials and learning materials:

```bash
@content-market Write tutorial for "Building Real-Time Features with Phoenix Channels"
```

**Approach:**
- Progressive complexity (simple → advanced)
- Working code examples (tested, runnable)
- Clear explanations (dependency grammar)
- Common mistakes (with solutions)
- Next steps (further learning)

### 6. Newsletter Content
Condense complex topics into digestible updates:

```bash
@content-market Write newsletter section on "New Phoenix LiveView 0.20 Features"
```

**Format:**
- Short paragraphs (3-4 sentences max)
- Highlight key changes
- Link to full documentation
- Call-out practical implications

## Writing Principles

### Research First
- Gather verified facts from authoritative sources
- Never hallucinate statistics or claims
- Verify package names exist before recommending
- Document sources for major claims

### Readability Standards
- 8th-grade Flesch-Kincaid reading level
- Conversational, transcript-style tone
- Varied sentence structure (1-5, 10-15, 20-30 words)
- Replace ~30% of words with less common synonyms
- Intentional minor grammatical imperfections

### Structure Guidelines
- Maximum 5 H2 sections per article
- Sentence case for headings (not title case)
- Maximum 300 words per section
- Use markdown tables for statistics
- Use bullet points for dense information
- Smooth transitions between sections

### Quality Standards
- No prohibited words (delve, tapestry, vibrant, realm, embark, etc.)
- No repetition between sections
- High information density (minimal fluff)
- All code examples tested
- Technical accuracy verified

## Example Workflows

### Workflow 1: Full Article from Scratch
```bash
# Step 1: Research and outline
@content-market Research and create outline for "Optimizing Phoenix API Performance"

# Review outline in .content/optimizing-phoenix-api-performance.md
# Adjust if needed

# Step 2: Write full article
@content-market Write article from .content/optimizing-phoenix-api-performance.md

# Review article, check:
# - Reading level (use hemingwayapp.com)
# - Fact accuracy (verify claims)
# - Code examples (test in project)
# - Flow (smooth transitions)
```

### Workflow 2: Multi-Part Series
```bash
# Create outlines for 3-part series
@content-market Create outline for "Phoenix LiveView Basics - Part 1: Setup"
@content-market Create outline for "Phoenix LiveView Basics - Part 2: State Management"
@content-market Create outline for "Phoenix LiveView Basics - Part 3: Production Patterns"

# Write each part sequentially
@content-market Write article from .content/phoenix-liveview-basics-part-1-setup.md
# etc.
```

### Workflow 3: Technical Comparison
```bash
@content-market Create outline for "Oban vs Exq: Background Jobs in Elixir"

# Result: Structured comparison with:
# - Introduction to both libraries
# - Feature comparison table
# - Use case recommendations
# - Migration considerations
# - Conclusion with clear recommendation
```

## Anti-Patterns to Avoid

❌ **Don't create vague outlines**:
```
## Getting started
We'll talk about how to begin...
```

✅ **Do create specific outlines**:
```
## Installation takes 5 minutes
Add phoenix_live_view to mix.exs, run two commands,
and configure your endpoint. We'll show the exact steps
with copy-paste code blocks. You'll have your first
LiveView rendering in under 10 minutes.
```

❌ **Don't use formal academic language**:
```
One must configure the endpoint prior to utilizing LiveView functionality.
```

✅ **Do use conversational tone**:
```
Before you can use LiveView, you need to configure your Phoenix endpoint.
Don't worry—it's two lines of code.
```

❌ **Don't include unverified claims**:
```
Thousands of companies use LiveView in production.
```

✅ **Do verify and cite facts**:
```
LiveView powers production apps at companies like Felt,
Bleacher Report, and Divvy (verified case studies).
```

## What You'll Get

**From Outline Creation:**
- Markdown file in `.content/{slug}.md`
- H1 title under 70 characters
- 5 or fewer H2 sections with sentence case
- Specific content descriptions for each section
- Research notes and sources documented

**From Full Article Writing:**
- Complete article (1500-2500 words typical)
- 8th-grade reading level (verified)
- Conversational, engaging prose
- Varied sentence structure (burstiness)
- Code examples (tested and working)
- Statistics in markdown tables
- Bullet points for readability
- Smooth section transitions
- All facts verified and attributed
- No prohibited words or phrases
- No repetition between sections
- High information density

**Quality Metrics:**
- Flesch-Kincaid Reading Ease: 60-70
- Flesch-Kincaid Grade Level: 7-9
- Passive voice: <10%
- Sentence variety: 2-30 word range
- Section length: <300 words each


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
