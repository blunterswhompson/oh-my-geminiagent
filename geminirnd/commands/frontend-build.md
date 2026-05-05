---
description: Build accessible, performant, responsive UI components with modern frontend practices
agent: core/frontend-ux-specialist
subtask: true
---

Comprehensive frontend development focusing on user experience, accessibility (WCAG 2.1 AA), performance optimization, and responsive mobile-first design.

!`find ./assets -name "*.js" -o -name "*.ts" -o -name "*.css" 2>/dev/null | head -20`
!`find ./lib -name "*.heex" 2>/dev/null | head -10`
!`cat package.json 2>/dev/null | grep -E "(react|vue|tailwind)" || echo "No frontend framework found"`

1. **UI Component Development**:
   - Use semantic HTML (article, nav, header, footer, section)
   - Implement loading, error, and empty states for async operations
   - Add ARIA attributes for accessibility (aria-label, aria-describedby, role)
   - Support keyboard navigation (Arrow keys, Enter, Escape, Tab)
   - Use TypeScript interfaces for type safety

2. **Accessibility Compliance (WCAG 2.1 AA)**:
   - Validate color contrast (4.5:1 normal text, 3:1 large text)
   - Provide alt text for images or role="presentation" for decorative
   - Implement focus management for modals/dialogs
   - Test with screen readers (VoiceOver, NVDA, JAWS)
   - Run automated tools (axe, pa11y, Lighthouse)

3. **Performance Optimization**:
   - Lazy load routes/components (React.lazy, defineAsyncComponent)
   - Optimize images (WebP/AVIF, srcset, loading="lazy")
   - Code-split bundles and analyze size (<200KB gzipped)
   - Use React.memo/useMemo/useCallback for render optimization
   - Monitor Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)

4. **Responsive Design (Mobile-First)**:
   - Write mobile-first CSS with min-width media queries
   - Use fluid typography with clamp() or viewport units
   - Implement flexible layouts (CSS Grid, Flexbox)
   - Ensure touch targets are minimum 44x44px
   - Test on real iOS and Android devices

5. **Phoenix LiveView UX Patterns**:
   - Add loading states with phx-disable-with
   - Implement optimistic UI updates for instant feedback
   - Use CSS transitions with phx-* classes
   - Handle connection states (phx-connected, phx-disconnected)
   - Use streams for efficient list rendering


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
