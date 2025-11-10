import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/prismaClient";

beforeAll(async () => {
  // optionally reset DB
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Auth", () => {
  it("registers a user and prevents duplicate email", async () => {
    const payload = { username: "testuser", email: "t@a.com", password: "Aa1!aaaa" };
    const res = await request(app).post("/auth/register").send(payload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    // duplicate email should fail
    const res2 = await request(app).post("/auth/register").send({ username: "u2", email: "t@a.com", password: "Aa1!aaaa" });
    expect(res2.status).toBe(400);
  });
});
