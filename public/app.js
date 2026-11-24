"use strict";
const fmt = (s) => (s == null ? "—" : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`);
fetch("/api/pipelines").then((r) => r.json()).then(({ items }) => {
  const body = document.querySelector("#pipelines tbody");
  for (const p of items) {
    const tr = document.createElement("tr");
    for (const [text, cls] of [[p.name], [p.status, `s-${p.status}`], [p.successRate == null ? "—" : `${p.successRate}%`], [fmt(p.medianDurationSec)], [p.lastRunAt ? new Date(p.lastRunAt).toLocaleString() : "—"]]) {
      const td = document.createElement("td");
      td.textContent = text;
      if (cls) td.className = cls;
      tr.appendChild(td);
    }
    body.appendChild(tr);
  }
});
