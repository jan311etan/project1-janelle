describe('Create Feedback Functionality', () => {
  const baseUrl = 'http://localhost:5050/createFeedback.html'; // Base URL for your frontend page

  beforeEach(() => {
    // Visit the Create Feedback page before each test
    cy.visit(baseUrl);
  });

  // it('should submit feedback successfully', () => {
  //   // Reset or mock data to ensure no duplicate feedback issue
  //   cy.get('#email').type('unique-test@example.com'); // Use a unique email for the test
  //   cy.get('#feedback').type('This is a test feedback.');
  //   cy.get('button').contains('Submit Feedback').click();
  //   cy.on('window:alert', (text) => {
  //     expect(text).to.equal('Feedback submitted successfully!');
  //   });
  // });

  it('should display the feedback form', () => {
    // Check if the form and inputs are present
    cy.get('form#createFeedbackForm').should('exist');
    cy.get('#email').should('exist');
    cy.get('#feedback').should('exist');
    cy.get('button').contains('Submit Feedback').should('exist');
  });

  it('should validate empty fields', () => {
    // Click Submit without filling the form
    cy.get('button').contains('Submit Feedback').click();
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Both email and feedback are required.');
    });
  });

  it('should validate invalid email format', () => {
    // Enter invalid email and valid feedback, then click Submit
    cy.get('#email').type('invalid-email');
    cy.get('#feedback').type('Valid feedback');
    cy.get('button').contains('Submit Feedback').click();
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Please enter a valid email address.');
    });
  });

  // it('should handle duplicate feedback gracefully', () => {
  //   // Use an email that already exists in the mock or database
  //   cy.get('#email').type('existing@example.com');
  //   cy.get('#feedback').type('Duplicate feedback');
  //   cy.get('button').contains('Submit Feedback').click();
  //   cy.on('window:alert', (text) => {
  //     expect(text).to.equal('Feedback already exists for this email. Redirecting to update page.');
  //   });
  // });


  it('should handle server errors gracefully', () => {
    // Simulate server error during submission
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
