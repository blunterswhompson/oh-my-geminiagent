---
description: Create test data factories with ExMachina for efficient and maintainable test setup
agent: elixir-specific/elixir-exmachina-specialist
subtask: true
---

Implement comprehensive test data factories using ExMachina to streamline test setup and improve test maintainability for Ecto and Ash resources.

!`cat mix.exs 2>/dev/null | grep -E "(ex_machina)"`
!`ls -la test/support/factory.ex test/support/factories/ 2>/dev/null`
!`grep -r "use ExMachina" test/ 2>/dev/null`

1. **ExMachina Setup**:
   - Add ex_machina dependency to mix.exs
   - Create test/support/factory.ex module
   - Configure with Ecto or Ash adapter
   - Import factory in test_helper.exs

2. **Factory Definitions**:
   - Define factories for core domain models
   - Use sequences for unique values (emails, usernames)
   - Create traits for common variations
   - Build factory hierarchies for complex models

3. **Relationship Handling**:
   - Set up associations with build_assoc
   - Handle many_to_many relationships
   - Implement recursive factories for trees
   - Manage circular dependencies safely

4. **Ash Integration** (if using Ash Framework):
   - Use insert/2 with Ash actions
   - Handle multi-tenancy in factories
   - Respect Ash policies in test data
   - Generate data for Ash calculations/aggregates

5. **Best Practices**:
   - Keep factories minimal (only required fields)
   - Use params_for/1 for changeset testing
   - Build transient attributes for computed values
   - Create factory helpers for common patterns

Example: Define user factory with traits and sequences for email uniqueness.
Use build/2, insert/2, and params_for/2 in tests as needed.
