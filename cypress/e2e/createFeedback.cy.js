describe('Create Feedback Functionality', () => {

  let baseUrl;

  before(() => {
    cy.task('startServer').then((url) => {
      baseUrl = url + "/createFeedback.html"; // Store the base URL
      cy.visit(baseUrl);
    });
  });

  after(() => {
    return cy.task('stopServer'); // Stop the server after the report is done
  });

  it('should display the feedback form', () => {
    cy.visit(baseUrl);

    cy.get('form#createFeedbackForm').should('exist');
    cy.get('#email').should('exist');
    cy.get('#feedback').should('exist');
    cy.get('button').contains('Submit Feedback').should('exist');
  });

  it('should validate empty fields', () => {
    cy.visit(baseUrl);

    cy.get('button').contains('Submit Feedback').click();
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Both email and feedback are required.');
    });
  });

  it('should validate invalid email format', () => {
    cy.visit(baseUrl);

    cy.get('#email').type('invalid-email');
    cy.get('#feedback').type('Valid feedback');
    cy.get('button').contains('Submit Feedback').click();
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Please enter a valid email address.');
    });
  });


  it('should show email exist', () => {
    cy.visit(baseUrl);

    cy.get('#email').type('unique-test@example.com');
    cy.get('#feedback').type('Valid feedback');
    cy.get('button').contains('Submit Feedback').click();
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Feedback already exists for this email. Redirecting to update page.');
    });
  });

  it('should handle server errors gracefully', () => {
    cy.visit(baseUrl);

    cy.intercept('POST', '/create-feedback', {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('serverError');

    cy.get('#email').type('servererror@example.com');
    cy.get('#feedback').type('Server error simulation.');
    cy.get('button').contains('Submit Feedback').click();

    cy.on('window:alert', (text) => {
      expect(text).to.equal('Failed to submit feedback.');
    });

    cy.wait('@serverError');
  });
});
