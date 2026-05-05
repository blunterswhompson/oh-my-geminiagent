---
description: Create Phoenix LiveView hooks for JavaScript integration with proper lifecycle management
agent: elixir-specific/elixir-hooks-specialist
subtask: true
---

# Phoenix LiveView Hooks Implementation

Create production-ready Phoenix LiveView hooks using the modern colocated hooks pattern (Phoenix 1.8+) for seamless JavaScript integration and custom lifecycle management.

## What This Command Does

This command invokes the **Elixir Hooks Specialist** agent to help you:
- Implement colocated hooks with proper lifecycle methods
- Integrate third-party JavaScript libraries (Chart.js, Sortable.js, Monaco, etc.)
- Create bi-directional communication between JavaScript and Elixir
- Build production-ready patterns (infinite scroll, modals, debounced inputs, drag-and-drop)
- Add TypeScript support for type-safe hooks
- Debug lifecycle issues and prevent memory leaks

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

Before invoking this command, gather the following information using shell commands:

**Check Phoenix LiveView Version:**
```bash
!`grep phoenix_live_view mix.exs`
```

**Check ESBuild Configuration:**
```bash
!`grep -A 10 "config :esbuild" config/config.exs`
```

**Check Current Hook Imports:**
```bash
!`grep -n "colocatedHooks\|phx-hook" assets/js/app.js`
```

**Find Existing Hooks:**
```bash
!`rg "phx-hook=\"\\..*?\"" lib/ --only-matching | sort -u`
```

**List Components That Might Need Hooks:**
```bash
!`rg "def.*_component\\(assigns\\)" lib/ -A 5 | grep -E "(def|phx-)"`
```

## When to Use This Command

Use `/elixir-hooks` when you need to:

### Basic JavaScript Integration
- Format input fields (phone numbers, currency, dates)
- Copy text to clipboard
- Add keyboard shortcuts or hotkeys
- Implement focus management and accessibility

### Third-Party Library Integration
- Integrate Chart.js for data visualization
- Add Sortable.js for drag-and-drop functionality
- Embed Monaco Editor for code editing
- Use any JavaScript library within LiveView

### Advanced Interactive Features
- Create infinite scroll pagination
- Build accessible modal dialogs with focus traps
- Implement debounced search inputs
- Add real-time timers and counters
- Create form validation with instant feedback

### Communication Patterns
- Send events from server to client hooks (`push_event`)
- Send events from client hooks to server (`pushEvent`)
- Handle bi-directional data synchronization
- Manage hook state across LiveView updates

### Performance Optimization
- Prevent memory leaks with proper cleanup
- Optimize expensive operations with debouncing
- Use IntersectionObserver for lazy loading
- Cache DOM references and minimize queries

### TypeScript Integration
- Add type safety to hook implementations
- Use ViewHook types for autocomplete
- Define custom interfaces for complex state
- Ensure compile-time type checking

## Usage Examples

### Example 1: Create a Simple Phone Number Formatter Hook
```
/elixir-hooks create a colocated hook for phone number input formatting that formats as users type in (XXX) XXX-XXXX format
```

### Example 2: Integrate Chart.js for Dashboard
```
/elixir-hooks integrate Chart.js into my dashboard component to display line charts that update when server data changes
```

### Example 3: Add Infinite Scroll
```
/elixir-hooks implement infinite scroll for the posts list using IntersectionObserver with proper cleanup
```

### Example 4: Create Modal with Accessibility
```
/elixir-hooks build an accessible modal hook with escape key support, focus trap, and click-outside-to-close functionality
```

### Example 5: Debug Existing Hook
```
/elixir-hooks my .SortableList hook isn't cleaning up properly and causing memory leaks - help me debug the lifecycle
```

### Example 6: Add TypeScript Types
```
/elixir-hooks convert my existing JavaScript hooks to TypeScript with proper ViewHook types and interfaces
```

## Common Patterns Provided

The agent will help you implement these production-ready patterns:

1. **Clipboard Copy** - Async clipboard API with error handling
2. **Infinite Scroll** - IntersectionObserver-based lazy loading
3. **Modal Dialog** - Focus trap, escape key, accessibility
4. **Debounced Search** - Performance-optimized search input
5. **Chart Integration** - Chart.js with live data updates
6. **Drag and Drop** - Sortable.js with server synchronization
7. **Code Editor** - Monaco Editor with proper DOM isolation
8. **Form Validation** - Client-side validation with server confirmation
9. **Timer/Counter** - Real-time elapsed time display
10. **WebSocket Integration** - Direct Phoenix channel communication

## Critical Rules

The agent follows these critical constraints:

1. **Lifecycle Management**
   - ALWAYS implement `destroyed()` for cleanup
   - NEVER use async operations in `beforeUpdate()`
   - ALWAYS use dot (.) prefix for colocated hook names

2. **Memory Safety**
   - ALWAYS remove event listeners in `destroyed()`
   - ALWAYS destroy third-party library instances
   - ALWAYS clear intervals and timeouts

3. **DOM Management**
   - ALWAYS use `phx-update="ignore"` when hook manages DOM
   - ALWAYS match `phx-hook` value exactly with script `name`
   - CACHE DOM element references, don't query repeatedly

4. **Communication**
   - ALWAYS validate data before `pushEvent`
   - ALWAYS return or rebind socket after `push_event`
   - IMPLEMENT error handling for all events

5. **Security**
   - VALIDATE all incoming data on server side
   - SANITIZE user input before sending to server
   - NEVER execute arbitrary JavaScript from server

## What You'll Get

The agent will provide:

1. **Complete Hook Implementation**
   - HEEx component with proper attributes
   - Colocated hook script with all lifecycle methods
   - Server-side event handlers if needed
   - Comprehensive error handling

2. **Configuration Guidance**
   - ESBuild setup for hook compilation
   - Import statements for app.js
   - TypeScript configuration if requested
   - Vendor library installation instructions

3. **Testing Recommendations**
   - Playwright/Wallaby test examples
   - Lifecycle verification tests
   - Memory leak detection strategies
   - End-to-end interaction tests

4. **Best Practices**
   - Performance optimization tips
   - Security considerations
   - Maintainability guidelines
   - Debugging techniques

## Related Resources

- Phoenix LiveView Colocated Hooks: https://hexdocs.pm/phoenix_live_view/js-interop.html#colocated-hooks
- JavaScript Interoperability: https://hexdocs.pm/phoenix_live_view/js-interop.html
- Phoenix.LiveView.ColocatedHook: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.ColocatedHook.html

---

**See Also:**
- `/elixir-test` - For testing LiveView hook interactions
- `/frontend-ux` - For UI/UX integration with hooks
- `/performance-optimization` - For optimizing hook performance

---

This command loads the comprehensive JSON prompt from:

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
