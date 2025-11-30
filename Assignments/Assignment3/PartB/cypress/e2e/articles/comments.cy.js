describe('Article Comments', () => {
  let articleSlug;

  before(() => {
    // Create an article for comment testing
    const timestamp = Date.now();
    const email = `testuser${timestamp}@example.com`;
    const username = `testuser${timestamp}`;
    
    cy.register(email, username, 'Password123!');
    
    cy.createArticle(
      'Article for Comment Testing',
      'Testing comments functionality',
      'This article is for testing comment features.',
      ['comments', 'testing']
    ).then((response) => {
      articleSlug = response.body.article.slug;
    });
  });

  beforeEach(() => {
    cy.visit(`/article/${articleSlug}`);
  });

  it('should display comment form when logged in', () => {
    cy.get('form').contains('Post Comment').should('be.visible');
    cy.get('textarea[placeholder="Write a comment..."]').should('be.visible');
  });

  it('should add a comment successfully', () => {
    const commentText = `Test comment ${Date.now()}`;
    
    cy.get('textarea[placeholder="Write a comment..."]').type(commentText);
    cy.contains('Post Comment').click();
    
    // Comment should appear in the comments list
    cy.contains(commentText).should('be.visible');
  });

  it('should display multiple comments', () => {
    const comment1 = `First comment ${Date.now()}`;
    const comment2 = `Second comment ${Date.now()}`;
    
    // Add first comment
    cy.get('textarea').type(comment1);
    cy.contains('Post Comment').click();
    cy.wait(1000);
    
    // Add second comment
    cy.get('textarea').type(comment2);
    cy.contains('Post Comment').click();
    
    // Both comments should be visible
    cy.contains(comment1).should('be.visible');
    cy.contains(comment2).should('be.visible');
  });
});