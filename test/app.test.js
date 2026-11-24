"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../src/app");

test("health reports the number of pipelines", async () => {
  const res = await request(createApp()).get("/health").expect(200);
  assert.deepEqual(res.body, { status: "ok", pipelines: 3 });
});

test("pipelines can be filtered by status", async () => {
  const res = await request(createApp()).get("/api/pipelines?status=passed").expect(200);
  assert.ok(res.body.items.every((p) => p.status === "passed"));
  assert.equal(res.body.count, 2);
});

test("unknown pipeline is a 404", async () => {
  await request(createApp()).get("/api/pipelines/nope").expect(404);
});

test("a valid run is recorded and an invalid one is rejected", async () => {
  const app = createApp();
  const ok = await request(app).post("/api/pipelines/web/runs").send({ status: "passed", durationSec: 280, commit: "abc1234", triggeredBy: "push" }).expect(201);
  assert.equal(ok.body.id, "web-4");
  const bad = await request(app).post("/api/pipelines/web/runs").send({ status: "exploded", durationSec: -1, commit: "zz", triggeredBy: "" }).expect(400);
  assert.equal(bad.body.error, "invalid run");
});

test("security headers are set", async () => {
  const res = await request(createApp()).get("/health");
  assert.equal(res.headers["x-content-type-options"], "nosniff");
  assert.equal(res.headers["x-powered-by"], undefined);
});
