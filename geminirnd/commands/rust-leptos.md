---
description: Design Leptos reactive components with signals, resources, and server functions for full-stack Rust web apps
agent: rust-specific/rust-leptos-specialist
subtask: true
---

Build production-ready Leptos applications with reactive signals, async resources, server functions, and component architecture for full-stack Rust web development.

!`cat Cargo.toml 2>/dev/null | grep -E "(leptos|leptos_meta|leptos_router|leptos_axum|leptos_actix)"`
!`ls -la src/app.rs src/app/ 2>/dev/null || echo "No app.rs or app/ directory found"`

1. **Reactive Component Design**:
   - Define components as `#[component]` functions returning `impl IntoView`
   - Accept typed props with `#[prop(optional)]`, `#[prop(default)]`, and `#[prop(into)]` attributes
   - Compose components with `<Show>`, `<Switch>`, `<For>`, and `<ErrorBoundary>`
   - Structure app layout in `src/app.rs` with `<Router>`, `<Routes>`, and `<Route>`

2. **Signals and Reactive State**:
   - Use `create_signal(cx, value)` for local component state with read/write split
   - Derive computed values with `create_memo(cx, |_| ...)` for memoized reactive expressions
   - Share cross-component state via `create_rw_signal` passed through context with `provide_context`
   - Implement effects with `create_effect(cx, |_| ...)` for side effects on signal changes

3. **Async Resources**:
   - Fetch server data with `create_resource(cx, source_signal, async |input| fetch(input))`
   - Wrap resource consumers in `<Suspense fallback=|| view! { <Spinner/> }>` for loading states
   - Handle errors with `<ErrorBoundary fallback=|err| view! { <ErrorMsg error=err/> }>`
   - Use `create_local_resource` for client-only data that should not SSR

4. **Server Functions with `#[server]` Macro**:
   - Define server-only logic with `#[server(FnName, "/api")]` above async functions
   - Return `Result<T, ServerFnError>` and call directly from component event handlers
   - Configure `leptos_axum::handle_server_fns()` route in Axum router
   - Protect server functions with middleware extractors (auth, CSRF) via `use_context::<AuthSession>()`

5. **Build, SSR, and Hydration**:
   - Configure `ssr` and `hydrate` features in `Cargo.toml` for server/client feature gating
   - Set up `cargo-leptos` for full-stack development with hot reload: `cargo leptos watch`
   - Configure `leptos_meta` for `<Title>`, `<Meta>`, and `<Link>` SSR head management
   - Run `cargo leptos build --release` for optimized WASM + server binary production build


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
