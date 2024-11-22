

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
  it("should prompt with an alert saying price must be more than 0", () => {
    cy.get("#name").type("Test frontend resource 1")
    cy.get("#price").type('-100')
    cy.get('button[type=submit]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Price must be a number greater than 0!');
    });
  });
  it("should add a new data", () => {
    cy.get("#name").type("Test frontend resource 1")
    cy.get("#price").type(10)
    cy.get('button[type=submit]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Resource added successfully!');
    });
  });
  it("should return network error", () => {
    cy.intercept("POST", "/add-game", {
      forceNetworkError: true,
    });
    cy.get("#name").type("Network error test")
    cy.get("#price").type(20)
    cy.get('button[type=submit]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Network error. Please try again later.');
    });
  });
  it("should return unexpected error", () => {
    cy.get("#name").type("Unexpected error test")
    cy.get("#price").type(20)
    cy.get('button[type=submit]').click();
    cy.intercept("POST", "/add-game", {
      forceNetworkError: true,
    });
    cy.on('window:alert', (str) => {
      expect(str).to.equal('An unexpected error occurred.');
    });
  });
  it("should return response error", () => {
    cy.get("#name").type("Response error test")
    cy.get("#price").type(20)
    cy.intercept("POST", "/add-game", {
      body: { message: "Simulated response error" },
    });
    cy.get('button[type=submit]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Error: Simulated response error');
    });
  });
});
