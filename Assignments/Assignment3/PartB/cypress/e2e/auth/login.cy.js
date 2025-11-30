describe('User Login', () => {
  beforeEach(() => {
    cy.clearAuth();
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.contains('Sign in').should('be.visible');
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    // First, ensure test user exists by registering
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `testuser${timestamp}@example.com`;
    const password = 'Password123!';

    // Register the user via API
    cy.register(email, username, password);
    
    // Now test login via UI
    cy.visit('/login');
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('input[placeholder="Password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Should redirect to home and show user as logged in
    cy.url().should('eq', 'http://localhost:4100/');
    cy.get('.nav-link').contains(username).should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[placeholder="Email"]').type('invalid@example.com');
    cy.get('input[placeholder="Password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Should show error and remain on login page
    cy.url().should('include', '/login');
    cy.contains('email or password is invalid').should('be.visible');
  });

  it('should navigate to registration page from login', () => {
    cy.contains('Need an account?').click();
    cy.url().should('include', '/register');
  });

  it('should persist login after page refresh', () => {
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `testuser${timestamp}@example.com`;
    const password = 'Password123!';

    // Register and login
    cy.register(email, username, password);
    cy.visit('/');
    
    // Verify user is logged in
    cy.get('.nav-link').contains(username).should('be.visible');
    
    // Refresh page
    cy.reload();
    
    // User should still be logged in
    cy.get('.nav-link').contains(username).should('be.visible');
  });
});