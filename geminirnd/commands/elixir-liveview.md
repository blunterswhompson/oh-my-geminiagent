---
description: Build modern real-time applications with Phoenix LiveView 1.1+ features
agent: elixir-specific/elixir-liveview-1_1-specialist
subtask: true
---

Comprehensive LiveView 1.1+ patterns including streaming, colocated hooks, function components, and performance optimization for production-ready real-time applications.

!`ls -la ./lib/*_web/live/ 2>/dev/null || echo "No live directory"`
!`grep -r "stream\|phx-hook\|ColocatedHook" ./lib/*_web/live/ 2>/dev/null | head -5`

1. **LiveView Streaming**:
   - Use stream/3 for large collections (>20 items)
   - Configure stream rendering with phx-update="stream"
   - Implement stream operations (insert, delete, reset)
   - Handle empty states with Tailwind's only: pseudo-class

2. **Colocated JavaScript Hooks**:
   - Create colocated hooks with :type={Phoenix.LiveView.ColocatedHook}
   - Follow .HookName convention (names MUST start with '.')
   - Implement lifecycle callbacks (mounted, updated, destroyed)
   - Use push_event and handleEvent for bidirectional communication

3. **Function Components**:
   - Build reusable components with attr and slot
   - Design flexible slot APIs
   - Extract to core_components.ex for reusability
   - Document component APIs

4. **Form Handling**:
   - Use to_form/2 for all form assigns
   - Handle validation with phx-change
   - Implement robust form submission
   - Support file uploads with allow_upload

5. **Performance Optimization**:
   - Use temporary assigns for large data
   - Implement debouncing for expensive operations
   - Use phx-update="ignore" for third-party JS
   - Monitor LiveView metrics

6. **Real-Time Features**:
   - Subscribe to PubSub topics
   - Handle broadcasts for updates
   - Broadcast changes after mutations
   - Implement Presence tracking


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
