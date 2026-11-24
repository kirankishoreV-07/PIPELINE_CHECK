"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, summary, median } = require("../src/store");

test("median of odd and even lists", () => {
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([4, 1, 3, 2]), 2.5);
  assert.equal(median([]), null);
});

test("summary ignores running runs in rates and durations", () => {
  const api = load().get("api");
  const s = summary(api);
  assert.equal(s.status, "running");
  assert.equal(s.successRate, 100);
  assert.equal(s.medianDurationSec, 509.5);
});
