"use strict";
// In-memory pipeline store loaded from data/pipelines.json. Runs are appended at runtime.
const fs = require("node:fs");
const path = require("node:path");
const { formatDistanceToNowStrict } = require("date-fns");

const DATA = path.join(__dirname, "..", "data", "pipelines.json");

function load(file = DATA) {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  return new Map(raw.pipelines.map((p) => [p.id, { ...p, runs: [...p.runs] }]));
}

function summary(p) {
  const last = p.runs[p.runs.length - 1] || null;
  const finished = p.runs.filter((r) => r.status !== "running");
  const passed = finished.filter((r) => r.status === "passed").length;
  return {
    id: p.id, name: p.name, repo: p.repo, branch: p.branch,
    status: last ? last.status : "never_run",
    lastRunAt: last ? last.startedAt : null,
    lastRunAgo: last ? formatDistanceToNowStrict(new Date(last.startedAt), { addSuffix: true }) : null,
    successRate: finished.length ? Math.round((passed / finished.length) * 1000) / 10 : null,
    medianDurationSec: median(finished.map((r) => r.durationSec)),
  };
}

function median(xs) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

module.exports = { load, summary, median };
