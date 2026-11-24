"use strict";
const pino = require("pino");
const { createApp } = require("./app");

const logger = pino({ level: process.env.LOG_LEVEL || "info" });
const port = Number(process.env.PORT || 3000);

createApp({ logger }).listen(port, () => logger.info({ port }, "ShipLog listening"));
