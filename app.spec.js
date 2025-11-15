import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test("GET / returns API working", async ({ request }) => {
  const res = await request.get(`${BASE_URL}/`);
  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(body.message).toBe("API working");
});

test("POST /sum returns correct result", async ({ request }) => {
  const res = await request.post(`${BASE_URL}/sum`, {
    data: { a: 5, b: 8 }
  });

  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(body.result).toBe(13);
});
