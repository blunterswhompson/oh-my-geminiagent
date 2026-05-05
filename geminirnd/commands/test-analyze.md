---
description: Transform test results into actionable insights - failure patterns, flaky tests, trends, coverage gaps, and quality metrics
agent: testing/test-results-analyzer
subtask: true
---

# Test Results Analyzer Command

Analyze test execution results to identify failure patterns, detect flaky tests, track quality trends, find coverage gaps, and generate executive-ready reports with data-driven recommendations.

## Context Gathering

# Detect JavaScript/TypeScript
!`[ -f package.json ] && echo "FOUND: package.json" && cat package.json | grep -E "(next|typescript|zod|vitest)"`
# Detect Elixir
!`[ -f mix.exs ] && echo "FOUND: mix.exs" && cat mix.exs | grep -E "(phoenix|ash|oban)"`
# Detect Rust
!`[ -f Cargo.toml ] && echo "FOUND: Cargo.toml" && cat Cargo.toml | head -20`

```bash
!`find test-results -name '*.xml' -o -name '*.json' -o -name '*.tap' 2>/dev/null | head -20`
!`find coverage -name '*.json' -o -name 'coverage-summary.json' 2>/dev/null | head -10`
!`ls -lah test-results/ coverage/ 2>/dev/null || echo 'No test results found'`
!`cat playwright.config.js | grep reporter || cat jest.config.js | grep reporters || echo 'No config'`
```

## What This Command Does

The Test Results Analyzer provides:
- **Failure Pattern Analysis**: Group failures by type, identify root causes
- **Flaky Test Detection**: Calculate pass rates, score flakiness, prioritize fixes
- **Trend Analysis**: Track pass rates, execution time, quality metrics over time
- **Coverage Gap Analysis**: Identify untested code paths, prioritize test additions
- **Quality Metrics**: Calculate defect escape rate, test effectiveness, ROI
- **Executive Reporting**: Generate dashboards with visualizations and recommendations

## When to Use This Command

✅ **Use Test Analyzer For**:
- Analyzing test suite failures and identifying patterns
- Detecting and investigating flaky test patterns
- Generating quality metrics reports for stakeholders
- Tracking test suite health trends over time
- Identifying coverage gaps and prioritizing tests
- Creating executive dashboards for sprint retrospectives
- Investigating CI/CD pipeline test failures

❌ **Don't Use For**:
- Running tests (use test frameworks directly)
- Writing new tests (use `qa-engineer`)
- Debugging individual test failures (use `playwright-help`)

## Usage Examples

### Example 1: Analyze Recent Test Failures
```bash
test-analyze "Analyze failures from our latest CI run - identify patterns and root causes"
```

**What you'll get**:
1. **Failure Pattern Analysis**:
   ```markdown
   ## Test Failures Analysis
   
   ### Summary
   - Total Tests: 487
   - Passed: 452 (92.8%)
   - Failed: 35 (7.2%)
   
   ### Failure Patterns
   
   #### 1. TIMEOUT (18 tests - 51% of failures)
   **Description**: Tests exceeded time limit
   **Root Cause**: Async operations not completing or slow execution
   **Affected Tests**:
   - checkout_flow_test: 30.2s timeout
   - api_integration_test: 30.1s timeout
   - dashboard_load_test: 30.0s timeout
   
   **Recommendation**: 
   - Increase timeout for slow operations
   - Add explicit waits for async content
   - Optimize slow database queries
   - Check for deadlocks or race conditions
   
   #### 2. ASSERTION (12 tests - 34% of failures)
   **Root Cause**: Actual values don't match expectations
   **Common Issue**: Recent API response format change
   **Fix**: Update test expectations to match new API contract
   
   #### 3. ELEMENT_NOT_FOUND (5 tests - 14% of failures)
   **Root Cause**: Selectors changed in recent UI refactor
   **Fix**: Update selectors to match new DOM structure
   ```

2. **Root Cause Map**:
   ```markdown
   ### Common Failure Points (from stack traces)
   
   1. `lib/api/client.js:45` - 12 failures
      Issue: API timeout
      Fix: Add retry logic with exponential backoff
   
   2. `tests/helpers/wait.js:23` - 8 failures
      Issue: Insufficient wait time
      Fix: Increase default timeout from 5s to 10s
   ```

3. **Action Items** (prioritized):
   - HIGH: Fix timeout issues (18 tests affected)
   - MEDIUM: Update assertions for new API format (12 tests)
   - LOW: Update selectors post-refactor (5 tests)

**Timeline**: 30 minutes

### Example 2: Detect Flaky Tests
```bash
test-analyze "Find flaky tests from the last 10 CI runs and prioritize which ones to fix first"
```

**What you'll get**:
1. **Flaky Test Report**:
   ```markdown
   ## Flaky Tests Analysis (10 runs)
   
   ### Summary
   - Total Tests: 487
   - Flaky Tests: 23 (4.7%)
   - Target: <5% ✅
   
   ### High Priority Flaky Tests
   
   #### 1. login_flow_test ⚠️
   - **Pass Rate**: 60% (6/10 runs)
   - **Flakiness Score**: 96/100 (VERY FLAKY)
   - **Priority**: 48.2 (HIGH)
   - **Impact**: Blocks authentication testing
   
   **Failure Pattern**:
   - Fails more often in CI (80% failure) than locally (10% failure)
   - Timing variance: 2.3s ± 1.8s (78% coefficient of variation)
   
   **Root Cause**: Race condition in session creation
   
   **Recommendation**:
   ```javascript
   // BEFORE (flaky)
   await page.click('button[type="submit"]');
   await expect(page).toHaveURL('/dashboard');
   
   // AFTER (stable)
   await page.click('button[type="submit"]');
   await page.waitForURL('/dashboard', { timeout: 10000 });
   await page.waitForLoadState('networkidle');
   await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
   ```
   
   #### 2. checkout_flow_test
   - **Pass Rate**: 82% (8.2/10 runs)
   - **Flakiness Score**: 36/100 (MODERATE)
   - **Trigger**: Network dependency (external payment API)
   
   **Recommendation**: Mock payment API calls in tests
   ```

2. **Flakiness Trend**: Chart showing flaky test count over time
3. **Fix Priority Matrix**: Impact vs Effort grid

**Timeline**: 1 hour

### Example 3: Generate Quality Metrics Dashboard
```bash
test-analyze "Create an executive dashboard with quality metrics for our sprint retrospective"
```

**What you'll get**:
1. **Executive Dashboard**:
   ```markdown
   # Test Quality Dashboard - Sprint 15
   
   ## Overall Health Score: 87/100 🟢
   
   ### Key Metrics
   
   | Metric | Current | Target | Status | Trend |
   |--------|---------|--------|--------|-------|
   | Pass Rate | 92.8% | >90% | 🟢 Good | ↑ Improving |
   | Flakiness | 4.7% | <5% | 🟢 Good | ↓ Improving |
   | Execution Time | 3m 42s | <5min | 🟢 Good | → Stable |
   | Coverage | 88.3% | >85% | 🟢 Good | ↑ Improving |
   | Defect Escape Rate | 8.1% | <10% | 🟢 Good | ↓ Improving |
   
   ### Trend Analysis (Last 10 Sprints)
   
   ```
   Pass Rate Trend:
   Sprint 6  █████████░ 89.2%
   Sprint 7  █████████░ 89.5%
   Sprint 8  █████████░ 90.1%
   Sprint 9  █████████░ 90.8%
   Sprint 10 ██████████ 91.2%
   Sprint 11 ██████████ 91.5%
   Sprint 12 ██████████ 91.8%
   Sprint 13 ██████████ 92.1%
   Sprint 14 ██████████ 92.5%
   Sprint 15 ██████████ 92.8% ✓
   ```
   
   ### Highlights
   - ✅ Pass rate improved 3.6% over last 10 sprints
   - ✅ Flakiness reduced from 6.2% to 4.7%
   - ⚠️ 35 tests currently failing (action required)
   - ✅ Test execution time under 5-minute target
   
   ### Action Items
   1. **HIGH**: Fix 18 timeout failures (blocking)
   2. **MEDIUM**: Stabilize 3 high-priority flaky tests
   3. **LOW**: Update selectors for 5 tests post-refactor
   ```

2. **Visualizations**: Charts for trends (JSON data for charting)
3. **Historical Comparison**: Sprint-over-sprint comparison

**Timeline**: 45 minutes

### Example 4: Analyze Test Execution Performance
```bash
test-analyze "Find slow tests that are slowing down our CI pipeline"
```

**What you'll get**:
1. **Performance Analysis**:
   ```markdown
   ## Test Execution Performance
   
   ### Summary
   - Total Duration: 3m 42s (222s)
   - Average per Test: 0.46s
   - Target: <5min ✅
   
   ### Slowest Tests (Top 10)
   
   1. **e2e_checkout_flow** - 12.3s (5.5% of total time)
      - Type: E2E
      - Recommendation: Parallelize with other E2E tests
   
   2. **integration_api_bulk_import** - 8.7s (3.9%)
      - Type: Integration
      - Recommendation: Use smaller test dataset
   
   3. **unit_report_generation** - 6.2s (2.8%)
      - Type: Unit (unusually slow)
      - Recommendation: Mock database, avoid I/O operations
   
   ### Distribution
   - Unit Tests: 125s (56%) - 425 tests - 0.29s avg
   - Integration Tests: 68s (31%) - 52 tests - 1.31s avg
   - E2E Tests: 29s (13%) - 10 tests - 2.90s avg
   
   ### Recommendations
   1. Move slow unit tests to integration category
   2. Parallelize E2E tests (currently sequential)
   3. Reduce integration test data setup overhead
   4. Target: Reduce total time from 3m 42s → 2m 30s
   ```

2. **Optimization Opportunities**: Specific tests to optimize
3. **Parallelization Strategy**: How to split tests for parallel execution

**Timeline**: 30 minutes

### Example 5: Coverage Gap Analysis
```bash
test-analyze "Identify untested code paths and suggest high-value tests to add"
```

**What you'll get**:
1. **Coverage Report**:
   ```markdown
   ## Coverage Gap Analysis
   
   ### Summary
   - Overall Coverage: 88.3%
   - Target: >85% ✅
   - Uncovered Lines: 1,247
   
   ### Gaps by Module
   
   #### 1. lib/payment/processor.js - 67.2% ❌
   **Uncovered Lines**: 45-67, 82-95
   **Recommended Tests**:
   - Test payment failure handling (lines 45-67)
   - Test refund processing edge cases (lines 82-95)
   - **Priority**: HIGH (payment is critical)
   
   #### 2. lib/api/rate-limiter.js - 72.1% ⚠️
   **Uncovered Lines**: 34-42
   **Recommended Tests**:
   - Test rate limit exceeded scenario
   - **Priority**: MEDIUM (affects API reliability)
   
   #### 3. lib/utils/date-formatter.js - 91.5% ✅
   **Uncovered Lines**: 78-82
   **Recommended Tests**:
   - Test timezone edge case (line 78-82)
   - **Priority**: LOW (low risk, high coverage)
   ```

2. **Test Suggestions**:
   ```javascript
   // Suggested test for payment processor
   test('handles payment gateway timeout', async () => {
     // Mock timeout
     paymentGateway.charge.mockRejectedValue(new TimeoutError());
     
     // Attempt payment
     const result = await PaymentProcessor.charge(100, 'usd');
     
     // Should retry and eventually fail gracefully
     expect(result.status).toBe('failed');
     expect(result.reason).toBe('timeout');
     expect(paymentGateway.charge).toHaveBeenCalledTimes(3); // 3 retries
   });
   ```

**Timeline**: 1 hour

### Example 6: Compare Test Results Across Branches
```bash
test-analyze "Compare test results between main branch and feature/new-checkout to see if new tests are needed"
```

**What you'll get**:
1. **Comparison Report**:
   ```markdown
   ## Branch Comparison: main vs feature/new-checkout
   
   ### Test Count Changes
   - main: 487 tests
   - feature/new-checkout: 492 tests (+5 new)
   
   ### New Tests Added
   1. checkout_v2_happy_path
   2. checkout_v2_payment_failure
   3. checkout_v2_address_validation
   4. checkout_v2_discount_code
   5. checkout_v2_guest_checkout
   
   ### Test Health Comparison
   
   | Metric | main | feature/new-checkout | Change |
   |--------|------|----------------------|--------|
   | Pass Rate | 92.8% | 94.1% | +1.3% ✅ |
   | Failed | 35 | 29 | -6 ✅ |
   | Execution Time | 3m 42s | 3m 58s | +16s ⚠️ |
   
   ### Coverage Changes
   - Overall: 88.3% → 91.2% (+2.9%) ✅
   - lib/checkout/: 85.1% → 94.3% (+9.2%) ✅
   
   ### Recommendations
   - ✅ New feature well-tested (5 new tests)
   - ✅ Coverage improved significantly
   - ⚠️ Watch execution time (approaching 5min limit)
   - Consider: Parallelize new E2E tests
   ```

**Timeline**: 30 minutes

### Example 7: Defect Escape Rate Analysis
```bash
test-analyze "Calculate our defect escape rate - how many bugs make it to production vs caught in testing"
```

**What you'll get**:
1. **Defect Analysis**:
   ```markdown
   ## Defect Escape Rate Analysis
   
   ### Formula
   Defect Escape Rate = (Production Bugs / Total Bugs) × 100
   
   ### Sprint 15 Data
   - Bugs Found in Testing: 37
   - Bugs Found in Production: 3
   - **Total Bugs**: 40
   - **Defect Escape Rate**: 7.5%
   - **Target**: <10% ✅
   
   ### Trend (Last 6 Sprints)
   
   Sprint 10: 12.3% 🔴
   Sprint 11: 11.1% 🟡
   Sprint 12: 9.8% 🟢
   Sprint 13: 8.9% 🟢
   Sprint 14: 8.2% 🟢
   Sprint 15: 7.5% 🟢 ✓
   
   ### Production Bugs Breakdown
   
   1. **Payment processing edge case** (Severity: High)
      - Why missed: Rare combination of discount + gift card
      - Prevention: Add combinatorial testing
   
   2. **Date formatting in non-US locale** (Severity: Low)
      - Why missed: Only tested en-US locale
      - Prevention: Add multi-locale test suite
   
   3. **Mobile layout issue on iOS 16** (Severity: Medium)
      - Why missed: Tested only on iOS 15
      - Prevention: Update device matrix
   
   ### Recommendations
   1. Add combinatorial testing for payment scenarios
   2. Expand locale test coverage
   3. Update mobile device testing matrix
   4. Target: Reduce escape rate to <5%
   ```

**Timeline**: 1 hour

### Example 8: Track Test Effectiveness
```bash
test-analyze "Measure how effective our tests are at catching bugs - are we testing the right things?"
```

**What you'll get**:
1. **Effectiveness Metrics**:
   ```markdown
   ## Test Effectiveness Analysis
   
   ### Metrics
   
   **Bug Detection Rate**: 92.5% ✅
   - Bugs caught by automated tests: 37/40
   - Manual QA: 0
   - Production: 3
   
   **Test Coverage vs Bug Density**:
   - High coverage modules (>90%): 2 bugs
   - Medium coverage modules (70-90%): 15 bugs
   - Low coverage modules (<70%): 23 bugs
   - **Correlation**: High (low coverage = more bugs)
   
   **Test Type Effectiveness**:
   - Unit Tests: Caught 18 bugs (48.6%)
   - Integration Tests: Caught 14 bugs (37.8%)
   - E2E Tests: Caught 5 bugs (13.5%)
   - **Pyramid Compliance**: Good (unit tests most effective)
   
   ### ROI Analysis
   - Time writing tests: 120 hours
   - Time debugging production issues: 8 hours
   - **ROI**: Prevented ~200 hours of production debugging
   - **Multiplier**: 1.67x (every hour testing saves 1.67 hours debugging)
   
   ### Recommendations
   1. ✅ Keep testing strategy (effective at catching bugs)
   2. Focus test additions on low-coverage modules
   3. Add more unit tests (highest ROI)
   4. Consider mutation testing to verify test quality
   ```

**Timeline**: 1-2 hours

## What You'll Get

Every response includes:

### 1. **Failure Analysis**
   - Patterns grouped by error type
   - Root cause identification
   - Stack trace analysis
   - Prioritized recommendations

### 2. **Flaky Test Detection**
   - Pass rates calculated
   - Flakiness scores (0-100)
   - Trigger analysis (timing, environment, etc.)
   - Fix priority matrix

### 3. **Quality Metrics**
   - Pass rate trends
   - Execution time trends
   - Coverage analysis
   - Defect escape rate
   - Test effectiveness

### 4. **Executive Reports**
   - Health score calculation
   - Trend visualizations (JSON data)
   - KPI tracking
   - Actionable recommendations
   - Sprint-over-sprint comparison

### 5. **Coverage Gaps**
   - Untested code paths
   - Suggested tests
   - Priority ranking
   - Module-level breakdown

## Related Commands

- `/qa-engineer` - Write comprehensive test suites
- `/playwright-help` - Debug individual test failures
- `/playwright-a11y` - Accessibility testing
- `/code-review` - Review test code quality

## Key Capabilities

This command leverages the test-results-analyzer agent:

- **Multi-Format Parsing**: JUnit XML, TAP, JSON, pytest, Jest
- **Pattern Recognition**: Group failures by type, identify trends
- **Flakiness Detection**: Calculate scores, prioritize fixes
- **Trend Analysis**: Track metrics over time, detect degradation
- **Coverage Analysis**: Find gaps, suggest high-value tests
- **Executive Reporting**: Dashboards, visualizations, KPIs
- **Root Cause Analysis**: Stack trace analysis, correlation detection
- **Recommendation Engine**: Data-driven, prioritized action items

## Tips for Best Results

1. **Provide Historical Data**: Analyzer works best with 5-10 runs minimum
2. **Specify Format**: Mention if using JUnit, TAP, Jest JSON, etc.
3. **Include Context**: Code changes, environment, timing
4. **Define Goals**: Coverage target, acceptable flakiness rate, etc.
5. **Share Constraints**: CI time budget, team capacity

## Technical Details

**Powered by:** `.opencode/agent/testing/test-results-analyzer.md`  
**MCP Servers:** context7 (testing docs), neo4j (pattern storage), sequential-thinking (analysis), supabase (metrics storage)  
**Knowledge Graph:** Stores failure patterns, flaky test insights, quality trends

---

**Note:** This command analyzes test results to provide insights. It does not run tests or write new tests - use appropriate tools/commands for those tasks.

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
