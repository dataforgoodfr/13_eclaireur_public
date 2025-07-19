# Playwright Tests

This directory contains end-to-end tests for the ÉCLAIREUR PUBLIC frontend application using Playwright.

## Setup

Playwright has been configured and installed. The tests will automatically start the development server before running.

## Running Tests

### Run all tests (headless)
```bash
bun run test
```

### Run tests with UI mode (interactive)
```bash
bun run test:ui
```

### Run tests in headed mode (see browser)
```bash
bun run test:headed
```

### Run specific test file
```bash
bunx playwright test homepage.spec.ts
```

## Test Structure

### `homepage.spec.ts`
Tests the main homepage functionality:
- ✅ Loads homepage and displays main elements
- ✅ Verifies correct page title
- ✅ Tests search functionality
- ✅ Checks responsive layout elements

## Configuration

The Playwright configuration is in `playwright.config.ts` and includes:
- Tests run against Chromium, Firefox, and WebKit
- Automatic dev server startup
- Base URL set to `http://localhost:3000`
- HTML reporter for test results
- Trace collection on test retry

## Adding New Tests

1. Create new `.spec.ts` files in the `tests/` directory
2. Use the Playwright test API with `test()` and `expect()`
3. Follow the existing patterns for page navigation and element selection

## Test Reports

After running tests, view the HTML report:
```bash
bunx playwright show-report
