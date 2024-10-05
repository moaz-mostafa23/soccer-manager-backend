"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController"); // Import the controller functions
const router = (0, express_1.Router)();
router.post('/register', async (req, res, next) => {
    try {
        const user = await (0, userController_1.registerUser)({ ...req.body.user });
        res.status(201).json({ user });
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', async (req, res, next) => {
    try {
        const user = await (0, userController_1.loginUser)(req.body);
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
