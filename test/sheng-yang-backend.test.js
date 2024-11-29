const { describe, it } = require("mocha");
const { expect } = require("chai");
const { assert } = require("chai");
const { app, server } = require("../index");
const fs = require("fs/promises");
const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
chai.use(chaiHttp); 

let baseUrl;
let readStub;
let writeStub;

describe("BeaconStudio API", () => {
  before(async () => {
    const { address, port } = await server.address();
    baseUrl = `http://${address == "::" ? "localhost" : address}:${port}`;
  });

  beforeEach(async () => {
    readStub = sinon.stub(fs, "readFile");
    errorAddStub = sinon.stub(fs, "writeFile");
  });

  afterEach(() => {
    sinon.restore();
  });

  after(() => {
    return new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });

  describe("POST /add-game", () => {
    it("should return 400 for validation errors", (done) => {
      sinon.restore();
      chai
        .request(baseUrl)
        .post("/add-game")
        .send({
          name: "Test Resource 1",
          price: "Test price",
          image: "https://example.com/image.jpg",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it("Should add a new resource", (done) => {
      sinon.restore();
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
          assert.isArray(res.body);
          expect(res.body[1].image).to.equal("https://example.com/image.jpg");
          done();
        });
    });

    it("should add a new resource with placeholder image", (done) => {
      sinon.restore();
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
          assert.isArray(res.body);
          expect(res.body[2].image).to.equal("https://via.placeholder.com/150");
          done();
        });
    });

    it("should return 400 for same data in database", (done) => {
      sinon.restore();
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

    it("should return 500 for database error with write & read error", (done) => {
      readStub.throws(new Error("Simulated Read Error"));
      errorAddStub.throws(new Error("Simulated Write & Read Error"));
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
            .that.equals("Simulated Write & Read Error");
          done();
        });
    });
  });
});
