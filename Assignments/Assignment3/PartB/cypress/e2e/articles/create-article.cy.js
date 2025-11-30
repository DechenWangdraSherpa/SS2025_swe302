describe('Article Creation', () => {
  beforeEach(() => {
    // Login before each test
    const timestamp = Date.now();
    const email = `testuser${timestamp}@example.com`;
    const username = `testuser${timestamp}`;
    
    cy.register(email, username, 'Password123!');
    cy.visit('/editor');
  });

  it('should display article editor form', () => {
    cy.contains('New Article').should('be.visible');
    cy.get('input[placeholder="Article Title"]').should('be.visible');
    cy.get('input[placeholder="What\'s this article about?"]').should('be.visible');
    cy.get('textarea[placeholder="Write your article (in markdown)"]').should('be.visible');
    cy.get('input[placeholder="Enter tags"]').should('be.visible');
  });

  it('should create a new article successfully', () => {
    const articleTitle = `Test Article ${Date.now()}`;
    
    cy.get('input[placeholder="Article Title"]').type(articleTitle);
    cy.get('input[placeholder="What\'s this article about?"]').type('Test article description');
    cy.get('textarea[placeholder="Write your article (in markdown)"]').type('This is the article content in **markdown** format.');
    cy.get('input[placeholder="Enter tags"]').type('test{enter}cypress{enter}');
    cy.get('button[type="submit"]').contains('Publish Article').click();

    // Should redirect to article page and display the article
    cy.url().should('include', '/article/');
    cy.contains(articleTitle).should('be.visible');
    cy.contains('Test article description').should('be.visible');
    cy.contains('This is the article content').should('be.visible');
  });

  it('should show validation for required fields', () => {
    cy.get('button[type="submit"]').click();
    
    // Should remain on editor page due to validation
    cy.url().should('include', '/editor');
  });

  it('should allow adding and removing tags', () => {
    cy.get('input[placeholder="Enter tags"]').type('tag1{enter}');
    cy.get('input[placeholder="Enter tags"]').type('tag2{enter}');
    
    // Should show both tags
    cy.contains('tag1').should('be.visible');
    cy.contains('tag2').should('be.visible');
    
    // Remove first tag
    cy.get('.tag-list .tag-default').first().find('.tag-remove').click();
    
    // Should only show second tag
    cy.contains('tag1').should('not.exist');
    cy.contains('tag2').should('be.visible');
  });
});