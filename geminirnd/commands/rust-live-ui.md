---
description: Build reactive Rust UIs with Leptos signals, keyed list rendering, and async Suspense data loading
agent: rust-specific/rust-leptos-specialist
subtask: true
---

Implement reactive user interfaces in Rust using Leptos signals and resources, Dioxus, or Axum with HTMX — covering keyed list rendering, async data loading, and real-time UI patterns.

!`cat Cargo.toml 2>/dev/null | grep -E "(leptos|dioxus|axum|htmx|tower-http)"`
!`grep -r "create_signal\|use_state\|hx-get\|hx-swap" src/ 2>/dev/null | head -10`

1. **Reactive UI with Leptos Signals**:
   - Create fine-grained reactive state with `create_signal(cx, initial)` — avoid over-coarse re-renders
   - Use `create_memo` for derived state that should only recompute when dependencies change
   - Implement two-way binding on inputs with `on:input=move |ev| set_value(event_target_value(&ev))`
   - Share global UI state (theme, auth, locale) via `provide_context` + `use_context` pattern

2. **Keyed List Rendering**:
   - Render dynamic lists with `<For each=items key=|item| item.id let:item>` for O(1) DOM diffing
   - Avoid index-keyed lists — always key by stable unique ID to prevent stale closures
   - Implement optimistic list mutations: update signal immediately, revert on server error
   - Use `create_rw_signal(cx, vec![])` for mutable list state with `.update(|v| v.push(item))`

3. **Async Data Loading with Suspense**:
   - Load data with `create_resource(cx, signal, async |param| api_call(param).await)`
   - Wrap in `<Suspense fallback=|| view! { <Loading/> }>` to defer render until resolved
   - Nest multiple `<Suspense>` boundaries to avoid waterfall — load independent data in parallel
   - Implement pull-to-refresh by calling `.refetch()` on the resource signal

4. **Dioxus and Axum+HTMX Alternatives**:
   - For Dioxus: use `use_state`, `use_future`, and `use_coroutine` hooks; target web via `dioxus-web`
   - For Axum+HTMX: return `Html<String>` fragments from Axum handlers triggered by `hx-get`/`hx-post`
   - Implement HTMX out-of-band swaps (`hx-swap-oob`) for updating multiple DOM regions
   - Use `maud` or `askama` templates for typed server-side HTML rendering with Axum

5. **Performance and Accessibility**:
   - Profile signal dependency graphs with Leptos devtools to find unnecessary re-renders
   - Apply `#[component(transparent)]` for wrapper components that should not create DOM nodes
   - Add ARIA attributes and keyboard handlers directly on Leptos elements for accessibility
   - Use `leptos_router::A` component for SPA navigation without full page reloads


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
