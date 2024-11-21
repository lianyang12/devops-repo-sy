describe("BeaconStudio Frontend", () => {
  let baseUrl;
  beforeEach(() => {
    cy.task("startServer").then((url) => {
      baseUrl = url; // Store the base URL
      cy.visit(baseUrl + "/add-product.html"); // Visit the page
    });
  });
  after(() => {
    return cy.task("stopServer"); // Stop the server after the report is done
  });
  it("should prompt with an alert", () => {
    cy.get('button[type=submit]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Name and Price are required!');
    });
  });
  it("should prompt with an alert without price filled", () => {
    cy.get("#name").type("Test frontend resource 1")
    cy.get('button[type=submit]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Name and Price are required!');
    });
  });
  it("should prompt with an alert without name filled", () => {
    cy.get("#price").type(100)
    cy.get('button[type=submit]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Name and Price are required!');
    });
  });
  it("should prompt with an alert without name filled", () => {
    cy.get("#price").type(100)
    cy.get('button[type=submit]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Name and Price are required!');
    });
  });
});
