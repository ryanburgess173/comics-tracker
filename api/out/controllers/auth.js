"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Example route: GET /auth/test
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route works!' });
});
exports.default = router;
