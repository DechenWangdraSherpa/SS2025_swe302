describe('User Registration', () => {
  beforeEach(() => {
    // Clear any existing authentication
    cy.clearAuth();
    cy.visit('/register');
  });

  it('should display registration form', () => {
    cy.contains('Sign up').should('be.visible');
    cy.get('input[placeholder="Your Name"]').should('be.visible');
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should successfully register a new user', () => {
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `testuser${timestamp}@example.com`;

    cy.get('input[placeholder="Your Name"]').type(username);
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('input[placeholder="Password"]').type('Password123!');
    cy.get('button[type="submit"]').click();

    // Should redirect to home page and show user as logged in
    cy.url().should('eq', 'http://localhost:4100/');
    cy.get('.nav-link').contains(username).should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    
    // Should show validation errors and stay on registration page
    cy.url().should('include', '/register');
  });

  it('should navigate to login page from registration', () => {
    cy.contains('Have an account?').click();
    cy.url().should('include', '/login');
  });
});