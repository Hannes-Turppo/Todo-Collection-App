"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userValidators_1 = require("../validators/userValidators");
const express_validator_1 = require("express-validator");
const validateToken_1 = require("../middleware/validateToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const userRouter = (0, express_1.Router)();
userRouter.get("/", validateToken_1.validateUser, async (req, res) => {
    try {
        if (req.user) {
            const user = await User_1.User.findById(req.user._id);
            if (user) {
                return void res.status(200).json({
                    userId: user._id,
                    email: user.email,
                    username: user.username,
                    isAdmin: user.isAdmin || false,
                });
            }
            return void res.status(404).json({ message: "User not found." });
        }
        return void res.status(404).json({ message: "User not found." });
    }
    catch (error) {
        console.error(error);
        return void res.status(500).json({ message: "Server error while fetching user data." });
    }
});
userRouter.post("/register", (0, userValidators_1.registerValidators)(), async (req, res) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.log(`Validation errors: ${validationErrors}`);
        return void res.status(401).json(validationErrors);
    }
    try {
        const existingUser = await User_1.User.findOne({ email: req.body.email });
        if (existingUser) {
            return void res.status(403).json({ message: `Email ${req.body.email} already exists.` });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hash = await bcrypt_1.default.hash(req.body.password, salt);
        await User_1.User.create({
            email: req.body.email,
            username: req.body.username,
            password: hash,
            isAdmin: false,
        });
        return void res.status(200).json({ message: `User ${req.body.email} created.` });
    }
    catch (error) {
        console.error(`Error while creating user: ${error}`);
        return void res.status(500).json({ message: "Error while creating user." });
    }
});
userRouter.post("/login", (0, userValidators_1.loginValidators)(), async (req, res) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`);
        return void res.status(401).json(validationErrors);
    }
    try {
        const user = await User_1.User.findOne({ email: req.body.email });
        if (!user) {
            return void res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
        }
        if (bcrypt_1.default.compareSync(req.body.password, user.password)) {
            const jwtPayload = {
                _id: user.id,
                isAdmin: user.isAdmin
            };
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: "1h" });
            return void res.status(200).json({ success: true, token });
        }
        return void res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }
    catch (error) {
        console.error(`Error while logging in: ${error}`);
        return void res.status(500).json({ message: `Server error while logging in.` });
    }
});
userRouter.post("/delete", validateToken_1.validateUser, async (req, res) => {
    try {
        const user = req.user;
        const existingUser = await User_1.User.findById(req.body.id);
        if (!existingUser) {
            return void res.status(400).json({ message: `Bad request` });
        }
        if (existingUser && (user.id === req.body.id || user.isAdmin)) {
            await mongoose_1.Collection.deleteMany({ parent: req.body.id });
            await User_1.User.deleteOne({ id: req.body.id });
            return void res.status(200).json({ message: `User ${req.body.id} succesfully deleted.` });
        }
        else {
            console.log(`User ${user.id} blocked from deleting user ${req.body.id}`);
            return void res.status(401).json({ message: `Unauthorized` });
        }
    }
    catch (error) {
        console.error(`Error while deleting user: ${error}`);
        return void res.status(500).json({ message: `Error while deleting Board` });
    }
});
exports.default = userRouter;
