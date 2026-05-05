---
description: Set up wasm-bindgen exports and bidirectional JS↔Rust communication built with wasm-pack
agent: rust-specific/rust-wasm-interop-specialist
subtask: true
---

Implement production-ready WebAssembly interop with wasm-bindgen for seamless JavaScript↔Rust bidirectional communication, typed exports, and wasm-pack build pipelines.

!`cat Cargo.toml 2>/dev/null | grep -E "(wasm-bindgen|wasm-pack|js-sys|web-sys|getrandom)"`
!`ls -la pkg/ 2>/dev/null || echo "No pkg/ directory — wasm-pack not yet run"`

1. **wasm-bindgen Export Setup**:
   - Annotate public Rust types and functions with `#[wasm_bindgen]`
   - Use `#[wasm_bindgen(constructor)]` for class-like JS interfaces
   - Export enums with `#[wasm_bindgen]` and derive `Copy + Clone`
   - Configure `Cargo.toml` with `crate-type = ["cdylib"]` and `wasm-bindgen` dependency

2. **JS↔Rust Bidirectional Communication**:
   - Import JS functions into Rust via `#[wasm_bindgen(module = "...")]` extern blocks
   - Use `js_sys::Function` and `web_sys::*` for DOM and Web API access
   - Pass complex data across the boundary with `serde-wasm-bindgen` (avoid JSON round-trips)
   - Implement callback patterns with `Closure<dyn Fn(...)>` and `forget()` for long-lived callbacks

3. **Build Pipeline with wasm-pack**:
   - Run `wasm-pack build --target web` for ES module output into `pkg/`
   - Configure `wasm-pack build --target bundler` for webpack/vite integration
   - Add `wasm-opt` passes via `wasm-pack build --release` for size optimization
   - Automate builds with a `Makefile` or `cargo-make` task

4. **Error Handling Across the Boundary**:
   - Return `Result<T, JsValue>` from `#[wasm_bindgen]` functions to propagate JS exceptions
   - Convert Rust errors to `JsValue` via `.map_err(|e| JsValue::from_str(&e.to_string()))`
   - Use `console_error_panic_hook` to surface Rust panics as JS errors in dev builds
   - Gate panic hook initialization behind `#[cfg(feature = "console_error_panic_hook")]`

5. **Testing and Optimization**:
   - Write `wasm-bindgen-test` headless browser tests with `#[wasm_bindgen_test]`
   - Run browser tests with `wasm-pack test --headless --chrome`
   - Profile binary size with `twiggy` and eliminate dead code via `wasm-opt -Oz`
   - Benchmark hot paths with `web_sys::Performance` timestamps from Rust


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
