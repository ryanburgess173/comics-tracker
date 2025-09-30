"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    defaultMeta: { service: 'comics-tracker-api' },
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple())
        })
    ]
});
exports.default = logger;
