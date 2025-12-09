# E2E Test Suite for Home Page

This directory contains comprehensive end-to-end tests for the home page (`src/app/page.tsx`) using Playwright.

## Test Files

### 1. `home-page.spec.ts`
Main E2E test suite covering:
- Page loading and basic functionality
- Component rendering verification
- User interactions
- Navigation testing
- Performance validation
- Mobile responsiveness

### 2. `home-page-integration.spec.ts`
Integration tests focusing on:
- Component data structure validation
- Content integrity
- Dynamic content loading
- Component boundaries
- Responsive layout testing

### 3. `home-page-accessibility.spec.ts`
Accessibility compliance tests:
- Heading hierarchy validation
- Alt text verification
- Keyboard navigation
- ARIA labels and roles
- Color contrast
- Semantic HTML structure
- Screen reader compatibility

## Test Coverage Areas

### Components Tested
- Hero Section
- Contact a Specialist section
- City carousel/LogoLoop
- Most Popular Treatments
- Regulatory compliance logos
- Trust section
- Service Providers section
- Latest Blogs
- FAQ accordion

### Functionality Tested
- Page load performance
- Navigation links
- Button interactions
- FAQ accordion behavior
- Image loading
- Responsive design
- Accessibility compliance

### Cross-browser Testing
- Chrome (Desktop)
- Firefox (Desktop)
- Safari (Desktop)
- Chrome (Mobile)
- Safari (Mobile)

## Running Tests

### Install Dependencies
```bash
npm install
```

### Install Playwright Browsers
```bash
npm run test:e2e:install
```

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Tests in UI Mode
```bash
npm run test:e2e:ui
```

### Debug Tests
```bash
npm run test:e2e:debug
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/home-page.spec.ts
```

### Run Tests on Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=webkit
npx playwright test --project=firefox
```

## Test Configuration

The Playwright configuration (`playwright.config.ts`) includes:
- Multiple browser testing
- Mobile device emulation
- Automatic server startup
- Screenshot/video capture on failure
- HTML test reports
- Parallel test execution

## Best Practices Followed

1. **Page Object Pattern**: Tests use locators for maintainable element selection
2. **Data-Driven Testing**: Tests validate actual data from components
3. **Accessibility First**: Comprehensive a11y testing included
4. **Cross-Platform**: Tests run on multiple browsers and devices
5. **Performance Monitoring**: Load time and performance validation
6. **Error Handling**: Graceful failure with detailed reporting

## Test Data Validation

The tests validate:
- Specialist names and images
- Treatment categories
- Blog post titles and links
- FAQ questions and answers
- Regulatory logo attributes
- City link structure
- Button functionality

## Continuous Integration

These tests are designed to run in CI/CD environments with:
- Headless browser execution
- Parallel test execution
- Automatic browser installation
- Detailed test reporting
- Failure screenshots/videos