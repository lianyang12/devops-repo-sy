describe("BeaconStudio Frontend", () => {
  let baseUrl;
  before(() => {
    cy.task("startServer").then((url) => {
      baseUrl = url; // Store the base URL
      cy.visit(baseUrl + "/add-game"); // Visit the page
    });
  });
  after(() => {
    return cy.task("stopServer"); // Stop the server after the report is done
  });
  it("should add a new resource", () => {
    cy.get("#name").type("Test Resource 1");
    cy.get("#price").type("100");
    cy.get("#image").type("https://example.com/image.jpg");
    cy.get("#submit").click();
    cy.get("#result").should("contain", "Resource added successfully");
  });
});
