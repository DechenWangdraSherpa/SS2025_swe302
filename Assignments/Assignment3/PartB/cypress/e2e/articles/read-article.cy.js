describe('Article Reading', () => {
  let articleSlug;

  before(() => {
    // Create an article to test with
    const timestamp = Date.now();
    const email = `testuser${timestamp}@example.com`;
    const username = `testuser${timestamp}`;
    
    cy.register(email, username, 'Password123!');
    
    // Create article via API
    cy.createArticle(
      'Test Article for Reading',
      'This is a test article description',
      'This is the body content of the test article for reading tests.',
      ['test', 'reading', 'cypress']
    ).then((response) => {
      articleSlug = response.body.article.slug;
    });
  });

  beforeEach(() => {
    cy.visit(`/article/${articleSlug}`);
  });

  it('should display article content', () => {
    cy.contains('Test Article for Reading').should('be.visible');
    cy.contains('This is a test article description').should('be.visible');
    cy.contains('This is the body content of the test article').should('be.visible');
  });

  it('should display article metadata', () => {
    cy.get('.article-meta').should('be.visible');
    cy.get('.article-meta .author').should('be.visible');
    cy.get('.article-meta .date').should('be.visible');
  });

  it('should display article tags', () => {
    cy.contains('test').should('be.visible');
    cy.contains('reading').should('be.visible');
    cy.contains('cypress').should('be.visible');
  });

  it('should allow favoriting article when logged in', () => {
    // User is already logged in from before() hook
    cy.get('.btn-outline-primary').contains('Favorite Article').click();
    
    // Button should change to unfavorite
    cy.get('.btn-primary').contains('Unfavorite Article').should('be.visible');
  });
});