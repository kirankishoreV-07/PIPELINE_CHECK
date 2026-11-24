"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { evaluate } = require("../src/alerts");
const { load, summary } = require("../src/store");

test("alert rules flag the flaky web and infra pipelines", async () => {
  const alerts = await evaluate([...load().values()].map(summary));
  const keys = alerts.map((a) => `${a.pipeline}:${a.rule}`);
  assert.ok(keys.includes("web:flaky"));
  assert.ok(keys.includes("infra:flaky"));
  assert.ok(!keys.includes("api:flaky"));
});
