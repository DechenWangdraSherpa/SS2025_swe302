describe('Complete User Journey', () => {
  it('should complete full user registration and content creation flow', () => {
    const timestamp = Date.now();
    const username = `journeyuser${timestamp}`;
    const email = `journeyuser${timestamp}@example.com`;
    const password = 'Password123!';

    // 1. Register new user
    cy.visit('/register');
    cy.get('input[placeholder="Your Name"]').type(username);
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('input[placeholder="Password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Verify registration successful
    cy.url().should('eq', 'http://localhost:4100/');
    cy.get('.nav-link').contains(username).should('be.visible');

    // 2. Create a new article
    cy.contains('New Article').click();
    cy.url().should('include', '/editor');

    const articleTitle = `Journey Article ${timestamp}`;
    cy.get('input[placeholder="Article Title"]').type(articleTitle);
    cy.get('input[placeholder="What\'s this article about?"]').type('Article created during user journey');
    cy.get('textarea[placeholder="Write your article (in markdown)"]').type('This article was created as part of a complete user journey test.');
    cy.get('input[placeholder="Enter tags"]').type('journey{enter}test{enter}');
    cy.get('button[type="submit"]').click();

    // Verify article created
    cy.url().should('include', '/article/');
    cy.contains(articleTitle).should('be.visible');
    cy.contains('Article created during user journey').should('be.visible');

    // 3. Add a comment to the article
    const commentText = `Great article! ${timestamp}`;
    cy.get('textarea[placeholder="Write a comment..."]').type(commentText);
    cy.contains('Post Comment').click();
    cy.contains(commentText).should('be.visible');

    // 4. Favorite the article
    cy.get('.btn-outline-primary').contains('Favorite Article').click();
    cy.get('.btn-primary').contains('Unfavorite Article').should('be.visible');

    // 5. Visit user profile
    cy.get('.nav-link').contains(username).click();
    cy.url().should('include', `/@${username}`);

    // Verify article appears in profile
    cy.contains(articleTitle).should('be.visible');

    // 6. Update profile settings
    cy.contains('Edit Profile Settings').click();
    cy.url().should('include', '/settings');
    
    cy.get('textarea[placeholder="Short bio about you"]').clear().type('E2E testing enthusiast and software developer');
    cy.contains('Update Settings').click();

    // Verify settings updated
    cy.url().should('include', `/@${username}`);
    cy.contains('E2E testing enthusiast').should('be.visible');

    // 7. Logout
    cy.contains('Settings').click();
    cy.contains('Or click here to logout.').click();

    // Verify logout successful
    cy.contains('Sign in').should('be.visible');
    cy.contains('Sign up').should('be.visible');
  });
});