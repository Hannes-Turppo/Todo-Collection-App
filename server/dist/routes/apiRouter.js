"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const Collection_1 = require("../models/Collection");
const Article_1 = require("../models/Article");
const validateToken_1 = require("../middleware/validateToken");
const apiValidators_1 = require("../validators/apiValidators");
const apiRouter = (0, express_1.Router)();
apiRouter.post("/collection", validateToken_1.validateUser, (0, apiValidators_1.collectionValidators)(), async (req, res) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`);
        return void res.status(403).json({ message: `Bad request` });
    }
    try {
        const user = req.user;
        const existingBoard = await Collection_1.Collection.find({ title: req.body.title });
        existingBoard.map((collection) => {
            if (collection.owner === user._id) {
                return void res.status(500).json({ message: `Collection with title ${req.body.title} already exists.` });
            }
        });
        Collection_1.Collection.create({
            owner: user._id,
            title: req.body.title,
        });
        return void res.status(200).json({ message: `Collection ${req.body.title} created.` });
    }
    catch (error) {
        console.error(`Error while creating collection: ${error}`);
        return void res.status(400).json({ message: "Error while creating collection" });
    }
});
apiRouter.get("/Board", validateToken_1.validateUser, async (req, res) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`);
        return void res.status(403).json({ message: `Bad request` });
    }
    try {
        const user = req.user;
        const Board = await Collection_1.Collection.find({ owner: user._id });
        if (!Board) {
            return void res.status(404).json({ message: `No Board found` });
        }
        return void res.status(200).json(Board);
    }
    catch (error) {
        console.error(`Error while fetching Board: ${error}`);
        return void res.status(500).json({ message: `Error while fetching Board.` });
    }
});
apiRouter.post("/article/create", validateToken_1.validateUser, (0, apiValidators_1.articleValidators)(), async (req, res) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`);
        return void res.status(403).json({ message: `Bad request` });
    }
    try {
        const user = req.user;
        await Article_1.Article.create({
            owner: user._id,
            parent: req.body.parent,
            color: req.body.color,
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags
        });
        return void res.status(200).json({ message: `Article '${req.body.title}' created.` });
    }
    catch (error) {
        console.error(`Error while creating article ${error}`);
        return void res.status(500).json({ message: "server error while creating article" });
    }
});
apiRouter.post("/article/save", validateToken_1.validateUser, async (req, res) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`);
        return void res.status(403).json({ message: `Bad request` });
    }
    try {
        console.log(req.body);
        const oldArticle = await Article_1.Article.findOne({ _id: req.body._id });
        await Article_1.Article.updateOne({ _id: req.body._id }, {
            title: req.body.title,
            content: req.body.content,
        });
        return void res.status(200).json({ message: "article saved" });
    }
    catch (error) {
        console.error(error);
        return void res.status(500).json({ message: "server error while saving article" });
    }
});
apiRouter.get("/get/board", validateToken_1.validateUser, async (req, res) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`);
        return void res.status(403).json({ message: `Bad request` });
    }
    try {
        const user = req.user;
        const collections = await Collection_1.Collection.find({ owner: user._id });
        const articles = await Article_1.Article.find({ owner: user._id });
        const constructBoard = (collections, articles) => {
            const board = collections.map((collection) => ({
                _id: collection._id,
                title: collection.title,
                owner: collection.owner,
                articles: articles.filter((article) => (article.parent == collection._id))
            }));
            return board;
        };
        const board = constructBoard(collections, articles);
        return void res.status(200).json(board);
    }
    catch (error) {
        console.error(`Error while fetcing user's articles: ${error}`);
        return void res.status(500).json({ message: "Server error while fetching articles." });
    }
});
apiRouter.delete("/article", validateToken_1.validateUser, async (req, res) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`);
        return void res.status(403).json({ message: `Bad request` });
    }
    try {
        const user = req.user;
        const existingArticle = await Article_1.Article.findById(req.body._id);
        if (existingArticle && (user._id === existingArticle.owner || user.isAdmin)) {
            Article_1.Article.deleteOne({ id: existingArticle.id });
            return void res.status(200).json({ message: `Article '${existingArticle.id}' deleted.` });
        }
        return void res.status(404).json({ message: `Article not found` });
    }
    catch (error) {
        console.error(`Error while deleting article: ${error}`);
        return void res.status(500).json({ message: "Server error while deleting article." });
    }
});
apiRouter.get("/validateToken", validateToken_1.validateUser, async (req, res) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`);
        return void res.status(403).json({ message: `Bad token or no token` });
    }
    return void res.status(200).json({ message: "valid token" });
});
exports.default = apiRouter;
