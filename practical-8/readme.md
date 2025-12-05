# Practical 08: Automated GUI Testing with Cypress

## Repository
### **Source Code**: The complete source code for this practical is available in the GitHub repository:  
#### **Repository Link**: https://github.com/DechenWangdraSherpa/swe302-practical8

## Overview

This practical implements end-to-en

## Objectives

- Master Cypress framework for end-to-end GUI testing
- Develop and organize scalable test suites
- Implement fixtures, custom commands, and Page Object Model
- Mock and validate API responses
- Perform accessibility and load testing
- Analyze test results for quality assurance

## Installation & Setup

Navigate to the project directory and install Cypress:

```bash
cd practicals/practical_08/gui-testing
pnpm add -D cypress
pnpm exec cypress --version
pnpm exec cypress open
```

Launch Cypress, select "E2E Testing," choose a browser (Chrome recommended), and close it to configure properly.

## Test Structure

- **Test Files**: `cypress/e2e/` - organized by feature
- **Fixtures**: `cypress/fixtures/` - mock data for API responses
- **Custom Commands**: `cypress/support/commands.ts` - reusable test functions
- **Page Objects**: `cypress/support/page-objects/` - maintainable selectors
- **Element Selection**: Uses `data-testid` attributes for reliability

## Sample Test

```typescript
describe("Dog Image Browser - Homepage", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the page title and subtitle", () => {
    cy.get('[data-testid="page-title"]').should("be.visible");
    cy.get('[data-testid="page-subtitle"]').should("be.visible");
  });
});
```

## Challenges
- Advanced Cypress features (API mocking, custom commands) required careful implementation
- Test organization and scalability needed thoughtful architectural design

## Screenshots

![Homepage](images/1.homepage.png) - Main application interface
![Homepage Test](images/2.homepagetest.png) - Test execution results
![Fetch Test](images/3.fetchtest.png) - Dog image retrieval workflow
![All Tests](images/4.alltest.png) - Complete test suite passing

## Test Results

| Category          | Tests  | Status      |
| ----------------- | ------ | ----------- |
| UI Display        | 5      | ✅ Pass     |
| User Interactions | 6      | ✅ Pass     |
| API Integration   | 7      | ✅ Pass     |
| Error Handling    | 4      | ✅ Pass     |
| Accessibility     | 2      | ✅ Pass     |
| **Total**         | **24** | **✅ Pass** |

**Key Findings:**

- All tests passed in both interactive and headless modes
- API mocking ensures reliable, reproducible test runs
- No major accessibility violations detected
- Performance: Tests complete within acceptable time thresholds

## Test Coverage

1. **Homepage Display** - Title, subtitle, breed selector, and fetch button visibility
2. **Dog Fetching** - Random image loading, loading states, multiple fetches
3. **Breed Selection** - API population, filtering, switching, name capitalization
4. **API Integration** - Mocked responses (success/failure), timeout handling, query validation
5. **Error Handling** - Error messages, recovery mechanisms
6. **Accessibility** - No violations, proper focus indicators

## Custom Commands

```typescript
cy.fetchDog(); // Fetch a random dog image
cy.selectBreedAndFetch(breed); // Select breed and fetch image
cy.waitForDogImage(); // Wait for image loading
cy.checkError(message); // Validate error message
```

## Obstacles and Implementation Challenges

The practical implementation encountered the following technical and conceptual challenges:

- **Advanced Framework Capabilities**: Comprehension and effective implementation of sophisticated Cypress features, including API mocking mechanisms and custom command development, required significant study and iteration.
- **Test Code Scalability and Organization**: Structuring and maintaining test specifications for optimal scalability and long-term maintainability presented architectural considerations requiring thoughtful design decisions.

## Conclusion

This practical provided hands-on experience implementing comprehensive GUI testing using Cypress. The implementation covered the complete testing workflow: setup, test writing, API mocking, custom commands, Page Object Model pattern, and accessibility validation. Through systematic testing of user interactions, API integrations, and error handling, the application's reliability and quality were verified. This practical emphasized the importance of automated testing in software development and delivered industry-standard techniques for scalable and maintainable test frameworks.GUI testing using **Cypress** for a web application. The objective is to develop, organize, and execute comprehensive automated tests to ensure application reliability and quality.
