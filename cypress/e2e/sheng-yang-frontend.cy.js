describe("BeaconStudio Frontend", () => {
  let baseUrl;
  before(() => {
    cy.task("startServer").then((url) => {
      baseUrl = url; // Store the base URL
      cy.visit(baseUrl);
    });
  });
  after(() => {
    return cy.task("stopServer"); // Stop the server after the report is done
  });
  it("should display the correct title", () => {
    cy.get("h1").should("have.text", "BeaconStudio");
  });
});
