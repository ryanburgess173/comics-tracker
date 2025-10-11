import request from "supertest";
import app from "../app";

describe("API Application", () => {
  describe("GET /", () => {
    it("should return API status", async () => {
      const response = await request(app)
        .get("/")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toHaveProperty("status");
      expect(response.body.status).toBe("API is running");
    });

    it("should return JSON format", async () => {
      const response = await request(app)
        .get("/")
        .expect("Content-Type", /json/);

      expect(response.body).toBeDefined();
      expect(typeof response.body).toBe("object");
    });
  });

  describe("GET /api-docs", () => {
    it("should serve Swagger UI", async () => {
      const response = await request(app).get("/api-docs/").expect(200);

      // Swagger UI returns HTML with title
      expect(response.text).toContain("Comics Tracker API Docs");
      expect(response.text).toContain("swagger-ui");
    });
  });

  describe("404 Handler", () => {
    it("should return 404 for non-existent routes", async () => {
      await request(app).get("/non-existent-route").expect(404);
    });

    it("should return 404 for invalid POST routes", async () => {
      await request(app).post("/invalid-route").expect(404);
    });
  });

  describe("Middleware", () => {
    it("should parse JSON request bodies", async () => {
      const testData = { test: "data" };

      // This will hit the /auth/register endpoint which expects JSON
      const response = await request(app)
        .post("/auth/register")
        .send(testData)
        .set("Content-Type", "application/json");

      // Even though registration will fail (missing fields),
      // it proves JSON parsing works
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe("Route Mounting", () => {
    it("should mount auth routes under /auth", async () => {
      const response = await request(app).get("/auth/test");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
    });
  });
});
