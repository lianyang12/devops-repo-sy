const { describe, it } = require("mocha");
const { expect } = require("chai");
const { app, server } = require("../index");
const fs = require("fs/promises");
const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
let baseUrl;
describe("BeaconStudio API", () => {
  before(async () => {
    const { address, port } = await server.address();
    baseUrl = `http://${address == "::" ? "localhost" : address}:${port}`;
  });
  after(() => {
    return new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });
  describe("POST /add-game", () => {
    it("should return 201 for validation errors", (done) => {
      chai
        .request(baseUrl)
        .post("/add-game")
        .send({
          name: "Test Resource 1",
          price: "Test price",
          image: "https://example.com/image.jpg",
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          done();
        });
    });
    it("Should add a new resource", (done) => {
      chai
        .request(baseUrl)
        .post("/add-game")
        .send({
          name: "Test Resource 2",
          price: "100",
          image: "https://example.com/image.jpg",
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("array");
          done();
        });
    });it("should add a new resource with placeholder image", (done) => {
      chai
        .request(baseUrl)
        .post("/add-game")
        .send({
          name: "Test Resource 3",
          price: "1.20",
          image: "",
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("array");
          done();
        });
    });
    it("should return 400 for same data", (done) => {
      chai
        .request(baseUrl)
        .post("/add-game")
        .send({
          name: "Test Resource 2",
          price: "100",
          image: "https://example.com/image.jpg",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("Game already exists");
          done();
        });
    });
    it("should return 500 for database error with read error", (done) => {
      // Mock fs.writeFile to throw an error for this specific test
      const writeStub = sinon
        .stub(fs, "readFile")
        .throws(new Error("Simulated Read Error"));

      chai
        .request(baseUrl)
        .post("/add-game")
        .send({
          name: "Test Resource",
          price: "100",
          image: "https://example.com/image.jpg",
        })
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body)
            .to.have.property("message")
            .that.equals("Simulated Read Error");

          // Restore the original method after this test
          writeStub.restore();
          done();
        });
    });
    it("should return 500 for database error with write error", (done) => {
      // Mock fs.writeFile to throw an error for this specific test
      const writeStub = sinon
        .stub(fs, "writeFile")
        .throws(new Error("Simulated Write Error"));

      chai
        .request(baseUrl)
        .post("/add-game")
        .send({
          name: "Test Resource",
          price: "100",
          image: "https://example.com/image.jpg",
        })
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body)
            .to.have.property("message")
            .that.equals("Simulated Write Error");

          // Restore the original method after this test
          writeStub.restore();
          done();
        });
    });
  });
});
