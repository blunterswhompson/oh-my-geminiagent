# Agentic Ecosystem 2026

## Overview
A polyglot agentic workspace optimized for modern software engineering.

## Directory Structure
- **core/**: Essential agents for architecture, implementation, and quality.
- **typescript-nextjs/**: (NEW) Specialists for Next.js 15+ (App Router), Strict TS, and Vitest.
- **rust-specific/**: Rust 2024 specialists (Tokio, Axum, SQLx).
- **elixir-specific/**: Elixir 2025 specialists (Phoenix 1.7+, Ash 3.0).

## The Triad System (2026)
We have simplified the ecosystem by moving expert instructions directly into **Agent** and **Command** files, eliminating the dependency on external JSON prompt files.

1. **Agents**: Core expertise and pattern guidance.
2. **Commands**: Context-aware slash commands with high-signal examples.
3. **Skills**: Encapsulated expert workflows (e.g., frontend-design).

## Best Practices
- **Stack Detection**: Generic commands auto-detect your stack via `package.json`, `mix.exs`, or `Cargo.toml`.
- **Server Components**: Prefer Server Components as the default for web development.
- **Type Safety**: No `any` types; validate all boundaries with Zod.
