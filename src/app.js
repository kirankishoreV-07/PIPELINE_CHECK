"use strict";
const express = require("express");
const helmet = require("helmet");
const path = require("node:path");
const { z } = require("zod");
const { load, summary } = require("./store");
const { evaluate } = require("./alerts");

const RunInput = z.object({
  status: z.enum(["passed", "failed", "running", "cancelled"]),
  durationSec: z.number().int().nonnegative().max(86400),
  commit: z.string().regex(/^[0-9a-f]{7,40}$/),
  triggeredBy: z.string().min(1).max(64),
});

function createApp({ store = load(), logger } = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(express.json({ limit: "16kb" }));
  if (logger) app.use((req, _res, next) => { logger.info({ method: req.method, url: req.url }, "request"); next(); });

  app.get("/health", (_req, res) => res.json({ status: "ok", pipelines: store.size }));

  app.get("/api/pipelines", (req, res) => {
    const status = typeof req.query.status === "string" ? req.query.status : null;
    const items = [...store.values()].map(summary).filter((p) => !status || p.status === status);
    res.json({ count: items.length, items });
  });

  app.get("/api/alerts", async (_req, res) => {
    res.json({ alerts: await evaluate([...store.values()].map(summary)) });
  });

  app.get("/api/pipelines/:id", (req, res) => {
    const p = store.get(req.params.id);
    if (!p) return res.status(404).json({ error: "pipeline not found" });
    res.json({ ...summary(p), runs: p.runs.slice(-20).reverse() });
  });

  app.post("/api/pipelines/:id/runs", (req, res) => {
    const p = store.get(req.params.id);
    if (!p) return res.status(404).json({ error: "pipeline not found" });
    const parsed = RunInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "invalid run", issues: parsed.error.issues.map((i) => i.message) });
    const run = { id: `${p.id}-${p.runs.length + 1}`, startedAt: new Date().toISOString(), ...parsed.data };
    p.runs.push(run);
    res.status(201).json(run);
  });

  app.use(express.static(path.join(__dirname, "..", "public")));
  return app;
}

module.exports = { createApp, RunInput };
