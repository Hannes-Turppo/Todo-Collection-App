import { Request, Response, Router } from "express"
import { Result, ValidationError, validationResult } from "express-validator"
import { Collection, ICollection } from "../models/Collection"
import { Article, IArticle } from "../models/Article"
import { userRequest, validateUser } from "../middleware/validateToken"
import { articleValidators, collectionValidators } from "../validators/apiValidators"
import { IUser, User } from "../models/User"
import { Types } from "mongoose"

// init router
const apiRouter: Router = Router()



// Create new article
apiRouter.post("/article/create", validateUser, async ( req: userRequest, res: Response) => {
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad request`})
    }

    try{
        // create new article
        const user: any = req.user
        const article: IArticle = await Article.create({
            owner: user._id,
            parent: req.body.parent,
            id: new Types.ObjectId(),
            title: req.body.title,
            content: req.body.content,
            color: req.body.color,
            due: req.body.due,
            editedAt: new Date(),
            usedTime: req.body.usedTime,
            comments: [],
        })

        // return constructed article
        const newArticle: IArticle | null = await Article.findOne({_id: article._id})

        return void res.status(200).json(newArticle)
    } catch (error: any) {
        console.error(`Error while creating article: ${error}`)
        return void res.status(500).json({message: "server error while creating article"})
    }
})

// update and existing article
apiRouter.post("/article/save", validateUser, async ( req: userRequest, res: Response ) => {
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad request`})
    }

    try {
        // update article in db
        await Article.updateOne({_id: req.body._id as Types.ObjectId}, {
            title: req.body.title,
            content: req.body.content,
            color: req.body.color,
            due: req.body.due,
            editedAt: new Date(),
            usedTime: req.body.usedTime,
            comments: req.body.comments,
        })

        // return the updated article
        const savedArticle = await Article.findOne({_id: req.body._id})
        return void res.status(200).json(savedArticle)

    } catch (error: any) {
        console.error(error)
        return void res.status(500).json({message: "server error while saving article"})
    }
})


// add comment to article
apiRouter.post("/article/addComment", validateUser, async ( req: userRequest, res: Response ) => {
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad request`})
    }

    try {
        const newComment = {
            id: new Types.ObjectId(),
            content: req.body.comment,
            createdAt: new Date(),
        }

        await Article.updateOne(
            {_id: req.body.articleId},
            {$addToSet: {comments: newComment}
        })

        return void res.status(200).json(newComment)

    } catch (error: any) {
        console.log(error)
        return void res.json("Error while saving comment to article")
    }
})


// Delete single article
apiRouter.delete("/article", validateUser, async (req: userRequest, res: Response) => {
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad request`})
    }

    try {
        const user: any = req.user
        const existingArticle: IArticle | null = await Article.findById(req.body._id)

        // if article existis and user has authority to remove it, delete article
        if (existingArticle && ( user._id == existingArticle.owner || user.isAdmin)) {

            // delete from articles
            await Article.deleteOne({_id: existingArticle._id})

            return void res.status(200).json({message: `Article '${existingArticle.title}' deleted.`})
        }
        return void res.status(404).json({message: `Article not found`})

    } catch (error: any) {
        console.error(`Error while deleting article: ${error}`);
        return void res.status(500).json({message: "Server error while deleting article."})
    }
})


// Create new collection
apiRouter.post("/collection/create", validateUser, async ( req: userRequest, res: Response ) =>{
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad request`})
    }

    // create new collection
    try {
        console.log(req.body)
        const user: any = req.user
        const newCollection: ICollection = await Collection.create({
            owner: user._id,
            title: req.body.title,
        })
        return void res.status(200).json(newCollection)

    } catch (error: any) {// handle errors
        console.error(`Error while creating collection: ${error}`)
        return void res.status(500).json({message: "Error while creating collection"})
    }
})


// Edit collection
apiRouter.post("/collection/edit", validateUser, async ( req: userRequest, res: Response ) => {
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad request`})
    }

    try {
        const user: any = req.user 
        const collection: ICollection | null = await Collection.findOne({_id: req.body._id})
        if (collection && (user._id == collection?.owner || user.isAdmin)) {

            await Collection.updateOne(
                {_id: req.body._id},
                {$set: {title: req.body.title}}
            )
            return void res.status(200).json({message: `Title '${req.body.title}' set`})
        }

    } catch (error: any) {
        console.log(error)
        return void res.status(500).json({message: "Server error while editing collection."})
    }
})


// delete collection
apiRouter.delete("/collection", validateUser, async ( req: userRequest, res: Response ) => {
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad request`})
    }

    try {
        const user: any = req.user
        const collection: ICollection | null = await Collection.findOne({_id: req.body._id})
        if (collection && ( user._id == collection.owner || user.isAdmin)) {
            await Collection.deleteOne({_id: collection._id})
            await Article.deleteMany({parent: collection._id})
            return void res.status(200).json({message: `Collection '${collection.title}' deleted.`})
        }
        return void res.status(404).json({message: "Collection not found"})

    } catch (error: any) {
        console.error(error)
        return void res.status(500).json({message: "server error while deleting collection."})
    }
})

// get user's board
apiRouter.get("/get/board", validateUser, async (req: userRequest, res: Response) =>{
    // get and construct user's board element (ICollection[])
    try {
        const user: any = req.user
        // fetch items from DB
        const collections: ICollection[] = await Collection.find({owner: user._id})
        const articles: IArticle[] = await Article.find({owner: user._id})

        // compose board element
        const board = {
            collections: collections,
            articles: articles,
        }


        // return board to client
        return void res.status(200).json(board)

    } catch (error: any) {
        console.error(`Error while fetcing user's articles: ${error}`);
        return void res.status(500).json({message: "Server error while fetching articles."})
    }
})


// validate user's provided token authenticity
apiRouter.get("/validateToken", validateUser, async (req: Request, res: Response) => {
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad token or no token`})
    }
    // If user's token is valid, return 200.
    return void res.status(200).json({message: "valid token"})
})

export default apiRouter
