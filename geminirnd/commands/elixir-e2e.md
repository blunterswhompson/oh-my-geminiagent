---
description: Create end-to-end tests with Wallaby for browser automation and user workflow validation
agent: elixir-specific/elixir-wallaby-specialist
subtask: true
---

Implement comprehensive end-to-end testing using Wallaby for browser automation to validate complete user workflows and system integrations.

!`cat mix.exs 2>/dev/null | grep -E "(wallaby)"`
!`ls -la test/e2e/ test/features/ 2>/dev/null`
!`cat config/test.exs 2>/dev/null | grep -A5 "wallaby"`

1. **Wallaby Setup**:
   - Add wallaby dependency to mix.exs
   - Configure Wallaby driver (Chrome/ChromeDriver)
   - Set up screenshot_on_failure for debugging
   - Configure endpoint for feature tests

2. **Feature Test Structure**:
   - Create test/e2e/ directory for feature tests
   - Implement page object pattern for reusability
   - Use Wallaby.Browser for navigation and assertions
   - Handle async updates with wait_for assertions

3. **Test Patterns**:
   - Test complete user workflows (signup, login, checkout)
   - Validate form submissions and validations
   - Test JavaScript interactions and LiveView updates
   - Handle modals, dropdowns, and dynamic content

4. **Advanced Features**:
   - Upload file testing
   - Multi-session testing (concurrent users)
   - Screenshot comparisons for visual regression
   - Integration with CI/CD pipelines

5. **Best Practices**:
   - Keep E2E tests focused on critical paths
   - Use data-test attributes for stable selectors
   - Implement retry logic for flaky assertions
   - Run E2E tests separately from unit tests

Run E2E tests: `mix test --only feature`
View screenshots in screenshots/ directory on failure.
