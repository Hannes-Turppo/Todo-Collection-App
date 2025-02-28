import { Request, Response, Router } from "express"
import { Result, ValidationError, validationResult } from "express-validator"
import { Collection, ICollection } from "../models/Collection"
import { Article, IArticle } from "../models/Article"
import { userRequest, validateUser } from "../middleware/validateToken"
import { articleValidators, collectionValidators } from "../validators/apiValidators"
import { IUser } from "../models/User"
import { Types } from "mongoose"


// init router
const apiRouter: Router = Router()



// Create new collection
// req.body: {
//     owner: string
//     title: string
// }
// req.headers: {
//     auth: JWT
// }
// req.user: {
//     id: string
//     isAdmin: boolean
// }
apiRouter.post("/collection", validateUser, collectionValidators(), async ( req: userRequest, res: Response ) =>{
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad request`})
    }


    // create new collection
    try {
        const user: any = req.user
        // if collection already exists, return 500.
        const existingBoard: ICollection[] | null = await Collection.find({title: req.body.title})
        existingBoard.map((collection) => {

            if (collection.owner === user._id) {
                return void res.status(500).json({message: `Collection with title ${req.body.title} already exists.`})
            }
        })
            
        // If collection not found in DB, create collection and return 200:
        Collection.create({
            owner: user._id,
            title: req.body.title,
        })

        return void res.status(200).json({message: `Collection ${req.body.title} created.`})

    } catch (error: any) {// handle errors
        console.error(`Error while creating collection: ${error}`)
        return void res.status(400).json({message: "Error while creating collection"})
    }
})


// Get user's Board
// req.body: {}
// req.headers: {
//     auth: JWT
// }
// req.headers: {
//     auth: JWT
// }
// req.user: {
//     id: string
//     isAdmin: boolean
// }
apiRouter.get("/Board", validateUser, async ( req: userRequest, res: Response ) =>{
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad request`})
    }


    try {
        const user: any = req.user
        // get user's Board from db
        const Board: ICollection[] | null = await Collection.find({owner: user._id})
        if (!Board) { // If no Board are found
            return void res.status(404).json({message: `No Board found`})
        }

        // return found Board
        return void res.status(200).json(Board)

    } catch (error: any) {
        console.error(`Error while fetching Board: ${error}`)
        return void res.status(500).json({message: `Error while fetching Board.`})
    }
})


// Create new article
// req.body: {
//     owner: id of owner user (string)
//     parent: id of parent collection (string)
//     color: string
//     header: string
//     content: string
//     tags: string[]
// }
// req.headers: {
//     auth: JWT
// }
apiRouter.post("/article/create", validateUser, articleValidators(), async ( req: userRequest, res: Response) => {
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad request`})
    }

    try{
        const user: any = req.user

        await Article.create({
            owner: user._id,
            parent: req.body.parent,
            color: req.body.color,
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags
        })

        return void res.status(200).json({message: `Article '${req.body.title}' created.`})

    } catch (error: any) {
        console.error(`Error while creating article ${error}`)
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
        console.log(req.body)
        // get article from db
        const oldArticle = await Article.findOne({_id: req.body._id})
        await Article.updateOne({_id: req.body._id as Types.ObjectId}, {
            title: req.body.title,
            content: req.body.content,
        })
        return void res.status(200).json({message: "article saved"})

    } catch (error: any) {
        console.error(error)
        return void res.status(500).json({message: "server error while saving article"})
    }
})


// get user's articles
// req.user: {
//     id: string
//     isAdmin: boolean
// }
apiRouter.get("/get/board", validateUser, async (req: userRequest, res: Response) =>{
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad request`})
    }

    // get and construct user's board element (ICollection[])
    try {
        const user: any = req.user
        // fetch user's board from DB
        const collections: ICollection[] = await Collection.find({owner: user._id})
        const articles: IArticle[] = await Article.find({owner: user._id})

        // construct board element
        const constructBoard = (collections: ICollection[], articles: IArticle[]) => {
            const board = collections.map((collection) => 
            ({
                _id: collection._id,
                title: collection.title,
                owner: collection.owner,
                articles: articles.filter((article) => (article.parent == collection._id))
            }))
            return board
        }
        const board = constructBoard(collections, articles)

        // return board to client
        return void res.status(200).json(board)

    } catch (error: any) {
        console.error(`Error while fetcing user's articles: ${error}`);
        return void res.status(500).json({message: "Server error while fetching articles."})
    }
})


// Delete single article
// req.body: {
//     id: string
// }
// req.user: {
//     id: string
//     isAdmin: boolean
// }
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
        if (existingArticle && ( user._id === existingArticle.owner || user.isAdmin)) {
            Article.deleteOne({id: existingArticle.id})

            return void res.status(200).json({message: `Article '${existingArticle.id}' deleted.`})
        }
        return void res.status(404).json({message: `Article not found`})

    } catch (error: any) {
        console.error(`Error while deleting article: ${error}`);
        return void res.status(500).json({message: "Server error while deleting article."})
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
