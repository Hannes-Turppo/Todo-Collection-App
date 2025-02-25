import { Request, Response, Router } from "express"
import { Result, ValidationError, validationResult } from "express-validator"
import { Collection, ICollection } from "../models/Collection"
import { Article, IArticle } from "../models/Article"
import { userRequest, validateUser } from "../middleware/validateToken"
import { articleValidators, collectionValidators } from "../validators/apiValidators"
import { IUser } from "../models/User"


// init router
const apiRouter: Router = Router()



// Create new collection
// req.body: {
//     owner: string
//     name: string
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
        const existingCollections: ICollection[] | null = await Collection.find({name: req.body.name})
        existingCollections.map((collection) => {

            if (collection.owner === user.id) {
                return void res.status(500).json({message: `Collection with name ${req.body.name} already exists.`})
            }
        })
            
        // If collection not found in DB, create collection and return 200:
        Collection.create({
            owner: user.id,
            name: req.body.name,
        })

        return void res.status(200).json({message: `Collection ${req.body.name} created.`})

    } catch (error: any) {// handle errors
        console.error(`Error while creating collection: ${error}`)
        return void res.status(400).json({message: "Error while creating collection"})
    }
})


// Get user's collections
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
apiRouter.get("/collections", validateUser, async ( req: userRequest, res: Response ) =>{
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad request`})
    }


    try {
        const user: any = req.user

        // get user's collections from db
        const collections: ICollection[] | null = await Collection.find({owner: user.id})
        if (!collections) { // If no collections are found
            return void res.status(404).json({message: `No collections found`})
        }

        // return found collections
        return void res.status(200).json(collections)

    } catch (error: any) {
        console.error(`Error while fetching collections: ${error}`)
        return void res.status(500).json({message: `Error while fetching collections.`})
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
apiRouter.post("/article", validateUser, articleValidators(), async ( req: userRequest, res: Response) => {
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad request`})
    }

    try{
        const user: any = req.user

        await Article.create({
            owner: user.id,
            parent: req.body.parent,
            color: req.body.color,
            header: req.body.header,
            content: req.body.content,
            tags: req.body.tags
        })

        return void res.status(200).json({message: `Article '${req.body.header}' created.`})

    } catch (error: any) {
        console.error(`Error while creating article ${error}`)
        return void res.status(500).json({message: "server error while creating article"})
    }
})


// get user's articles
// req.user: {
//     id: string
//     isAdmin: boolean
// }
apiRouter.get("/articles", validateUser, async (req: userRequest, res: Response) =>{
    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(403).json({message: `Bad request`})
    }


    try {
        const user: any = req.user

        // fetch user's articles from DB
        const articles: IArticle[] | null = await Article.find({owner: user.id})
        if(!articles) {
            return void res.status(404).json({message: "Articles not found"})
        }

        return void res.status(200).json(articles)

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

        const existingArticle: IArticle | null = await Article.findById(req.body.id)

        // if article existis and user has authority to remove it, delete article
        if (existingArticle && ( user.id === existingArticle.owner || user.isAdmin)) {
            Article.deleteOne({id: existingArticle.id})

            return void res.status(200).json({message: `Article '${existingArticle.id}' deleted.`})
        }
        return void res.status(404).json({message: `Article not found`})

    } catch (error: any) {
        console.error(`Error while deleting article: ${error}`);
        return void res.status(500).json({message: "Server error while deleting article."})
    }
})

export default apiRouter
