---
description: Expert guidance on Phoenix LiveView 1.1+ features (streaming, colocated hooks, function components, slots)
agent: elixir-liveview-1_1-specialist
subtask: true
---

# Phoenix LiveView 1.1+ Specialist Command

Expert assistance for building modern Phoenix LiveView 1.1+ applications with streaming, colocated hooks, function components with slots, and performance patterns. Get comprehensive guidance on real-time features, component architecture, and migration from LiveView 1.0.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

Before invoking this command, gather relevant context about your LiveView implementation:

**Current LiveView Version:**
```bash
!`grep 'phoenix_live_view' mix.exs`
!`grep -r 'phx-update="append"\|phx-update="prepend"' lib/`
```

**Existing LiveView Modules:**
```bash
!`find lib -name '*_live.ex' -o -name '*_component.ex' | head -10`
!`grep -r 'use Phoenix.LiveView\|use Phoenix.Component' lib/`
```

**Performance Analysis:**
```bash
!`grep -r 'assign.*Repo.all\|assign.*list_' lib/ | head -10`
!`find lib -name '*.ex' -exec grep -l 'phx-hook' {} \;`
```

## Usage Examples

### 1. Implement Streaming for Large Collections

**When to use:**
- Displaying lists with >20 items
- Real-time updates to collections
- Infinite scroll or pagination
- Preventing full re-renders on updates

**Example:**
```bash
/elixir-liveview-1-1 implement streaming for our blog post list. Requirements:
- Display posts with infinite scroll
- Real-time updates when new posts are created
- Delete posts from stream when user clicks delete
- Limit stream to 100 items to prevent memory bloat
```

**What you'll get:**
- **LiveView Module** with stream/3 setup:
  ```elixir
  def mount(_params, _session, socket) do
    {:ok,
      socket
      |> assign(:page, 1, :per_page, 20, :end_of_timeline?, false)
      |> stream(:posts, Blog.list_posts(limit: 20))}
  end
  
  def handle_event("load-more", _, socket) do
    posts = Blog.list_posts(offset: socket.assigns.page * 20, limit: 20)
    
    socket =
      if Enum.empty?(posts) do
        assign(socket, end_of_timeline?: true)
      else
        socket
        |> update(:page, &(&1 + 1))
        |> stream(:posts, posts, at: -1, limit: -100)
      end
    
    {:noreply, socket}
  end
  
  def handle_info({:post_created, post}, socket) do
    {:noreply, stream_insert(socket, :posts, post, at: 0)}
  end
  
  def handle_event("delete-post", %{"id" => id}, socket) do
    post = Blog.get_post!(id)
    Blog.delete_post(post)
    {:noreply, stream_delete(socket, :posts, post)}
  end
  ```
- **Template** with phx-update="stream":
  ```heex
  <div id="posts" phx-update="stream" phx-viewport-bottom={!@end_of_timeline? && "load-more"}>
    <article :for={{id, post} <- @streams.posts} id={id}>
      <h2>{post.title}</h2>
      <button phx-click="delete-post" phx-value-id={post.id}>Delete</button>
    </article>
  </div>
  ```
- **PubSub Integration** for real-time updates
- **Tests** validating stream operations

**Timeline**: 3 hours

### 2. Create Colocated JavaScript Hooks

**When to use:**
- Input formatting (phone numbers, credit cards, dates)
- Integrating external JavaScript libraries
- Client-side interactivity (drag-and-drop, animations)
- DOM manipulation that doesn't need server round-trips

**Example:**
```bash
/elixir-liveview-1-1 create colocated hook for phone number input formatting. Format should be:
- User types: "1234567890"
- Displayed as: "123-456-7890"
- Hook should format on input event
- Preserve cursor position during formatting
```

**What you'll get:**
- **Function Component** with colocated hook:
  ```elixir
  attr :name, :string, required: true
  attr :id, :string, required: true
  attr :class, :string, default: ""
  
  def phone_input(assigns) do
    ~H"""
    <input
      type="text"
      name={@name}
      id={@id}
      phx-hook=".PhoneNumber"
      class={@class}
    />
    <script :type={Phoenix.LiveView.ColocatedHook} name=".PhoneNumber">
      export default {
        mounted() {
          this.el.addEventListener("input", e => {
            let value = this.el.value.replace(/\D/g, "")
            let match = value.match(/^(\d{3})(\d{3})(\d{4})$/)
            if(match) {
              this.el.value = `${match[1]}-${match[2]}-${match[3]}`
            }
          })
        }
      }
    </script>
    """
  end
  ```
- **app.js Integration**:
  ```javascript
  import {hooks as colocatedHooks} from "phoenix-colocated/my_app"
  const liveSocket = new LiveSocket("/live", Socket, {
    hooks: {...colocatedHooks}
  })
  ```
- **Usage Examples** in LiveView templates
- **Tests** for component rendering

**Timeline**: 2 hours

### 3. Design Function Components with Slots

**When to use:**
- Building reusable UI components (cards, modals, forms)
- Composing complex layouts
- Creating component libraries
- Implementing design systems

**Example:**
```bash
/elixir-liveview-1-1 create modal component with multiple slots. Requirements:
- Header slot (optional) with close button
- Body slot (required) for content
- Footer slot (optional) for actions
- Title attribute
- Show/hide state controlled by parent
```

**What you'll get:**
- **Modal Component**:
  ```elixir
  attr :show, :boolean, default: false
  attr :title, :string, required: true
  attr :id, :string, required: true
  slot :header
  slot :footer
  slot :inner_block, required: true
  
  def modal(assigns) do
    ~H"""
    <div class={["modal", @show && "modal-open"]}>
      <%= if @header != [] do %>
        <div class="modal-header">
          {render_slot(@header)}
        </div>
      <% end %>
      
      <div class="modal-body">
        <h2>{@title}</h2>
        {render_slot(@inner_block)}
      </div>
      
      <%= if @footer != [] do %>
        <div class="modal-footer">
          {render_slot(@footer)}
        </div>
      <% end %>
    </div>
    """
  end
  ```
- **Usage Examples**:
  ```heex
  <.modal show={@show_modal} title="Confirm Action" id="confirm-modal">
    <:header>
      <button phx-click="close-modal">×</button>
    </:header>
    
    Are you sure you want to proceed?
    
    <:footer>
      <button phx-click="cancel">Cancel</button>
      <button phx-click="confirm">Confirm</button>
    </:footer>
  </.modal>
  ```
- **Component Documentation** with @doc
- **Tests** for component rendering with slots

**Timeline**: 2 hours

### 4. Optimize LiveView Performance

**When to use:**
- LiveView feels sluggish or slow
- Socket assigns growing too large
- Experiencing memory issues
- Many database queries per render

**Example:**
```bash
/elixir-liveview-1-1 optimize our dashboard LiveView. Current issues:
- Loads 500 users on mount (slow initial render)
- Socket assigns are 150KB
- N+1 query problem with user associations
- Form submit takes 2+ seconds
```

**What you'll get:**
- **Optimized Mount**:
  ```elixir
  # Before: Store entire structs
  def mount(_params, _session, socket) do
    users = Repo.all(User)  # 150KB of data
    {:ok, assign(socket, :users, users)}
  end
  
  # After: Select only needed fields + stream
  def mount(_params, _session, socket) do
    users =
      from(u in User,
        select: %{id: u.id, name: u.name, avatar_url: u.avatar_url},
        order_by: [desc: u.inserted_at],
        limit: 50
      )
      |> Repo.all()
    
    {:ok,
      socket
      |> stream(:users, users, limit: 100)
      |> assign(:users_count, Repo.aggregate(User, :count))}
  end
  ```
- **Query Optimization**:
  ```elixir
  # Fix N+1 with preload
  def list_users_with_stats do
    from(u in User,
      left_join: p in assoc(u, :posts),
      group_by: u.id,
      select: %{
        id: u.id,
        name: u.name,
        post_count: count(p.id)
      }
    )
    |> Repo.all()
  end
  ```
- **Debounce Configuration**:
  ```heex
  <input phx-debounce="300" phx-change="search" />
  ```
- **temporary_assigns** for ephemeral data
- **Performance Measurements** with benchmarks
- **WebSocket Compression** config for production

**Timeline**: 4 hours

### 5. Migrate from LiveView 1.0 to 1.1+

**When to use:**
- Upgrading existing Phoenix LiveView app
- Want to use new streaming features
- Need colocated hooks
- Deprecation warnings from phx-update="append/prepend"

**Example:**
```bash
/elixir-liveview-1-1 migrate our app from LiveView 1.0 to 1.1+. We have:
- 15 LiveView modules using phx-update="append"
- 5 external hooks in assets/js/hooks/
- Phoenix 1.7, Elixir 1.15
- No custom compilers or build tools
```

**What you'll get:**
- **Dependency Updates** (mix.exs):
  ```elixir
  def deps do
    [
      {:phoenix_live_view, "~> 1.1"},
      {:lazy_html, ">= 0.0.0", only: :test}
    ]
  end
  
  def project do
    [
      compilers: [:phoenix_live_view] ++ Mix.compilers()
    ]
  end
  ```
- **Config Updates** (config/dev.exs):
  ```elixir
  config :phoenix_live_view,
    debug_heex_annotations: true,
    enable_expensive_runtime_checks: true
  ```
- **Stream Migration** for all LiveViews:
  - Convert phx-update="append/prepend" to streams
  - Update templates with phx-update="stream"
  - Add stream operations (insert, delete)
- **Hook Migration**:
  - Convert external hooks to colocated
  - Update app.js imports
- **Test Updates**:
  - Fix stream-related test assertions
- **Migration Checklist** with validation steps

**Timeline**: 2 days for 15 LiveViews

### 6. Build Real-Time Features with PubSub

**When to use:**
- Chat applications
- Live notifications
- Collaborative editing
- Activity feeds

**Example:**
```bash
/elixir-liveview-1-1 implement real-time notifications with PubSub. Requirements:
- Users receive instant notifications
- Notifications stream in real-time (no page refresh)
- Mark notifications as read
- Show unread count in header
- Limit to 50 most recent notifications
```

**What you'll get:**
- **LiveView Module** with PubSub:
  ```elixir
  def mount(_params, session, socket) do
    user = session["current_user"]
    
    if connected?(socket) do
      Phoenix.PubSub.subscribe(MyApp.PubSub, "user:#{user.id}:notifications")
      Phoenix.Presence.track(self(), "users:online", user.id, %{})
    end
    
    notifications = Notifications.list_unread(user.id)
    
    {:ok,
      socket
      |> assign(:user, user)
      |> assign(:unread_count, length(notifications))
      |> stream(:notifications, notifications, limit: 50)}
  end
  
  def handle_info({:new_notification, notification}, socket) do
    {:noreply,
      socket
      |> stream_insert(:notifications, notification, at: 0)
      |> update(:unread_count, &(&1 + 1))}
  end
  
  def handle_event("mark_read", %{"id" => id}, socket) do
    Notifications.mark_read(id, socket.assigns.user.id)
    {:noreply, update(socket, :unread_count, &max(&1 - 1, 0))}
  end
  ```
- **PubSub Broadcasting** (context module)
- **Presence Tracking** for online users
- **Tests** for real-time updates

**Timeline**: 5 hours

### 7. Debug LiveView Performance Issues

**When to use:**
- LiveView is slow or unresponsive
- High memory usage
- Frequent timeouts
- Need to profile LiveView operations

**Example:**
```bash
/elixir-liveview-1-1 debug performance issues in our analytics dashboard. Problems:
- Initial load takes 5+ seconds
- Socket assigns are 300KB
- Browser freezes when filtering data
- Memory usage grows over time
```

**What you'll get:**
- **Performance Analysis**:
  - Profiling with :observer
  - Socket assign size measurement
  - Database query analysis
- **Optimization Recommendations**:
  - Replace large assigns with streams
  - Add database indexes
  - Implement query pagination
  - Use temporary_assigns
- **Before/After Benchmarks**
- **Monitoring Setup** for production

**Timeline**: 6 hours

### 8. Create Reusable Component Library

**When to use:**
- Building design system
- Sharing components across LiveViews
- Creating UI pattern library
- Team standardization

**Example:**
```bash
/elixir-liveview-1-1 create component library with:
- Card (with header, body, footer slots)
- Button (variants: primary, secondary, danger)
- Modal (with portal rendering)
- List (with :let binding for items)
- All components should be fully documented and tested
```

**What you'll get:**
- **Component Module** (`lib/my_app_web/components/ui.ex`)
- **Documentation** with @moduledoc and @doc
- **Usage Examples** for each component
- **Tests** (render_component/3)
- **Storybook** or demo LiveView
- **Design Tokens** (CSS variables)

**Timeline**: 1 day

## What You'll Get

Every response includes:

### 1. **Production-Ready Code**
   - Complete LiveView modules with streaming
   - Function components with proper attr/slot definitions
   - Colocated JavaScript hooks
   - Optimized database queries
   - Comprehensive error handling

### 2. **Performance Optimizations**
   - Minimal socket assigns (<100KB)
   - Stream limits to prevent memory bloat
   - Debounce/throttle for frequent events
   - Database query optimization
   - WebSocket compression configuration

### 3. **Testing Patterns**
   - LiveView tests with Phoenix.LiveViewTest
   - Component tests with render_component/3
   - Stream operation tests
   - PubSub integration tests
   - LazyHTML selector examples

### 4. **Best Practices**
   - Streaming for collections >20 items
   - Colocated hooks for component-specific JS
   - Proper navigation patterns (live_navigate vs patch)
   - temporary_assigns for ephemeral data
   - Neo4j knowledge graph updates

### 5. **Migration Support**
   - Step-by-step upgrade guide (1.0 → 1.1+)
   - Dependency configuration
   - Code migration patterns
   - Testing validation
   - Deprecation fixes

### 6. **Documentation**
   - Component usage examples
   - Module documentation (@moduledoc, @doc)
   - Architecture decision rationale
   - Team training materials

## Related Commands

- `/elixir-test` - General Elixir testing strategies
- `/elixir-wallaby` - E2E testing with Wallaby
- `/phoenix-channels` - WebSocket and Channel patterns
- `/elixir-ecto` - Database query optimization
- `/code-review` - Review LiveView code for best practices

## Key Capabilities

This command leverages the elixir-liveview-1_1-specialist agent, which provides:

- **Streaming Expertise**: Master stream/3, stream_insert/4, stream_delete/3 for efficient real-time updates
- **Colocated Hooks**: Design and implement JavaScript hooks with Phoenix.LiveView.ColocatedHook
- **Component Architecture**: Build reusable function components with slots and :let bindings
- **Performance Optimization**: Minimize assigns, optimize queries, configure compression
- **Real-Time Integration**: PubSub patterns, Presence tracking, live updates
- **Migration Guidance**: Upgrade from LiveView 1.0 to 1.1+ with deprecation fixes
- **Testing Patterns**: Comprehensive LiveView and component testing strategies
- **Neo4j Integration**: Store patterns and optimizations in knowledge graph

## Tips for Best Results

1. **Provide Context**: Share existing LiveView code, performance issues, or feature requirements
2. **Be Specific**: Describe exact streaming needs, hook behavior, or component slots
3. **Share Metrics**: Include performance measurements (load times, memory usage, query counts)
4. **Mention Version**: Specify current LiveView version (1.0 vs 1.1+)
5. **Clarify Goals**: Migration, new feature, optimization, or debugging?
6. **Include Constraints**: Team experience, browser support, production environment

## Technical Details

**Powered by:** `.opencode/agent/elixir-specific/elixir-liveview-1_1-specialist.md`  
**MCP Servers:** context7 (LiveView docs), neo4j (pattern storage), sequential-thinking (analysis), playwright (E2E testing)  
**Knowledge Graph:** Stores streaming patterns, colocated hook examples, performance optimizations, and component compositions

---

**Note:** This command specializes in LiveView 1.1+ features. For general Phoenix patterns use `/phoenix`, for channels use `/phoenix-channels`, and for E2E testing use `/elixir-wallaby`.

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
