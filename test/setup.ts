// tests/setup.ts
import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";


jest.mock("../src/prismaClient", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));


import prisma from "../src/prismaClient";
const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;


beforeEach(() => {
  mockReset(prismaMock);
});

export { prismaMock };
