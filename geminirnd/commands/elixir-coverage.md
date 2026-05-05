---
description: Configure comprehensive code coverage analysis with ExCoveralls and CI/CD integration
agent: elixir-specific/elixir-coverage-specialist
subtask: true
---

Configure comprehensive test coverage measurement, analysis, and enforcement using ExCoveralls with CI/CD integration for quality assurance.

!`cat mix.exs 2>/dev/null | grep -E "(excoveralls|test_coverage)"`
!`ls -la cover/ 2>/dev/null`
!`cat .github/workflows/*.yml 2>/dev/null | grep -i coverage`

1. **Coverage Tool Setup**:
   - Add ExCoveralls dependency to mix.exs
   - Configure test_coverage options and CLI environments
   - Set up minimum coverage thresholds
   - Configure HTML and JSON output formats

2. **Coverage Analysis**:
   - Run `mix coveralls` for terminal output
   - Generate HTML reports with `mix coveralls.html`
   - Analyze uncovered lines and critical paths
   - Identify coverage gaps in business logic

3. **CI/CD Integration**:
   - Configure GitHub Actions/GitLab CI coverage upload
   - Set up Coveralls.io or Codecov integration
   - Implement coverage gates (fail on threshold miss)
   - Add coverage badges to README

4. **Coverage Strategy**:
   - Target 90%+ for critical business logic
   - Use :nocov comments sparingly for generated code
   - Track coverage trends over time
   - Prioritize meaningful coverage over percentage

5. **Umbrella Project Support**:
   - Configure coverage for umbrella apps
   - Aggregate coverage across apps
   - Set per-app coverage thresholds

Run `mix coveralls.html` and open cover/excoveralls.html to view detailed coverage report.
