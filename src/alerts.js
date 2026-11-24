"use strict";
// Alert rules written as JSONata expressions over a pipeline summary, e.g. "successRate < 80".
const jsonata = require("jsonata");

const RULES = [
  { id: "flaky", expr: "successRate < 80", message: "Success rate below 80%" },
  { id: "slow", expr: "medianDurationSec > 600", message: "Median duration above 10 minutes" },
  { id: "red", expr: "status = 'failed'", message: "Last run failed" },
];

async function evaluate(summaries, rules = RULES) {
  const alerts = [];
  for (const p of summaries) {
    for (const r of rules) {
      if (await jsonata(r.expr).evaluate(p)) alerts.push({ pipeline: p.id, rule: r.id, message: r.message });
    }
  }
  return alerts;
}

module.exports = { evaluate, RULES };
