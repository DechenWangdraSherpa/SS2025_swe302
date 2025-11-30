describe('User Profile', () => {
  let username;

  before(() => {
    const timestamp = Date.now();
    const email = `testuser${timestamp}@example.com`;
    username = `testuser${timestamp}`;
    
    cy.register(email, username, 'Password123!');
    
    // Create some articles for the user
    cy.createArticle('My First Article', 'First article description', 'Content of first article', ['personal']);
    cy.createArticle('My Second Article', 'Second article description', 'Content of second article', ['tech']);
  });

  beforeEach(() => {
    cy.visit(`/@${username}`);
  });

  it('should display user profile page', () => {
    cy.contains(username).should('be.visible');
    cy.contains('My Articles').should('be.visible');
  });

  it('should display user articles in profile', () => {
    cy.contains('My First Article').should('be.visible');
    cy.contains('My Second Article').should('be.visible');
  });

  it('should navigate to article from profile', () => {
    cy.contains('My First Article').click();
    cy.url().should('include', '/article/');
    cy.contains('My First Article').should('be.visible');
  });

  it('should show edit profile settings link', () => {
    cy.contains('Edit Profile Settings').should('be.visible');
  });

  it('should navigate to settings page', () => {
    cy.contains('Edit Profile Settings').click();
    cy.url().should('include', '/settings');
  });
});