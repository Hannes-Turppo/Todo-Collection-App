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
        const existingCollections = await Collection_1.Collection.find({ name: req.body.name });
        existingCollections.map((collection) => {
            if (collection.owner === user.id) {
                return void res.status(500).json({ message: `Collection with name ${req.body.name} already exists.` });
            }
        });
        Collection_1.Collection.create({
            owner: user.id,
            name: req.body.name,
        });
        return void res.status(200).json({ message: `Collection ${req.body.name} created.` });
    }
    catch (error) {
        console.error(`Error while creating collection: ${error}`);
        return void res.status(400).json({ message: "Error while creating collection" });
    }
});
apiRouter.get("/collections", validateToken_1.validateUser, async (req, res) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`);
        return void res.status(403).json({ message: `Bad request` });
    }
    try {
        const user = req.user;
        const collections = await Collection_1.Collection.find({ owner: user.id });
        if (!collections) {
            return void res.status(404).json({ message: `No collections found` });
        }
        return void res.status(200).json(collections);
    }
    catch (error) {
        console.error(`Error while fetching collections: ${error}`);
        return void res.status(500).json({ message: `Error while fetching collections.` });
    }
});
apiRouter.post("/article", validateToken_1.validateUser, (0, apiValidators_1.articleValidators)(), async (req, res) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`);
        return void res.status(403).json({ message: `Bad request` });
    }
    try {
        const user = req.user;
        await Article_1.Article.create({
            owner: user.id,
            parent: req.body.parent,
            color: req.body.color,
            header: req.body.header,
            content: req.body.content,
            tags: req.body.tags
        });
        return void res.status(200).json({ message: `Article '${req.body.header}' created.` });
    }
    catch (error) {
        console.error(`Error while creating article ${error}`);
        return void res.status(500).json({ message: "server error while creating article" });
    }
});
apiRouter.get("/articles", validateToken_1.validateUser, async (req, res) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`);
        return void res.status(403).json({ message: `Bad request` });
    }
    try {
        const user = req.user;
        const articles = await Article_1.Article.find({ owner: user.id });
        if (!articles) {
            return void res.status(404).json({ message: "Articles not found" });
        }
        return void res.status(200).json(articles);
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
        const existingArticle = await Article_1.Article.findById(req.body.id);
        if (existingArticle && (user.id === existingArticle.owner || user.isAdmin)) {
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
exports.default = apiRouter;
