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
  it;
});
