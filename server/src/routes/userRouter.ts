import { Request, Response, Router } from "express"
import { IUser, User } from "../models/User"
import bcrypt from "bcrypt"
import { registerValidators, loginValidators } from "../validators/userValidators"
import { Result, ValidationError, validationResult } from "express-validator"
import { validateUser, userRequest } from "../middleware/validateToken"
import jwt, { JwtPayload } from "jsonwebtoken"
import { Collection } from "mongoose"


// declare router
const userRouter: Router = Router()


// router functionality

// get user information base on token
userRouter.get("/", validateUser, async (req: userRequest, res: Response) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id)
            if (user) {
                return void res.status(200).json({
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    isAdmin: user.isAdmin || false,
                })
            }
            return void res.status(404).json({message: "User not found."})                
        }
        return void res.status(404).json({message: "User not found."})
    } catch (error: any) {
        console.error(error)
        return void res.status(500).json({message: "Server error while fetching user data."})
    }
})

// create new user
userRouter.post("/register", registerValidators(), async (req: Request, res: Response) => {
    // check for errors in user input
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.log(`Validation errors: ${validationErrors}`)
        return void res.status(401).json(validationErrors)
    }

    try {
        // check if user exists:
        const existingUser: IUser | null = await User.findOne({email: req.body.email})
        if (existingUser) {
            return void res.status(403).json({message: `Email ${req.body.email} already exists.`})
        }
        // encrypt password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt)

        // create user
        await User.create({
            email: req.body.email,
            username: req.body.username,
            password: hash,
            isAdmin: false,
        })

        return void res.status(200).json({message: `User ${req.body.email} created.`})

    } catch (error: any) {
        console.error(`Error while creating user: ${error}`)
        return void res.status(500).json({message: "Error while creating user."})
    }
})


// login
userRouter.post("/login", loginValidators(),  async (req: Request, res: Response) => {

    // Check validation errors. If errors, return 403
    const validationErrors: Result<ValidationError> = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.error(`ValidationErrors ${validationErrors}`)
        return void res.status(401).json(validationErrors)
    }

    // handle login
    try {
        // find user:
        const user: IUser | null = await User.findOne({email: req.body.email})
        if (!user) {
            return void res.status(401).json({errors:[{msg:"Invalid credentials"}]})
        }

        // check for correct password if the user exists. If correct, create and return JWT
        if (bcrypt.compareSync(req.body.password, user.password as string)) {

            // JWT payload
            const jwtPayload: JwtPayload = {
                _id: user._id,
                isAdmin: user.isAdmin
            }

            // Create JWT
            const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {expiresIn: "1h"})

            return void res.status(200).json({success: true, token})
        }
        return void res.status(401).json({errors:[{msg:"Invalid credentials"}]})


    } catch (error: any) {
        console.error(`Error while logging in: ${error}`)
        return void res.status(500).json({message: `Server error while logging in.`})
    }
})


// delete user
userRouter.post("/delete", validateUser, async ( req: userRequest, res: Response ) => {
    try {
        // check if user exists
        const user: any = req.user
        const existingUser: IUser | null = await User.findById(req.body.id)

        if (!existingUser) {
            return void res.status(400).json({message: `Bad request`})
        }

        // if user deletes itself or is admin deleting another user, delete user's Board and then the user itself.
        if ( existingUser && ( user.id === req.body.id || user.isAdmin )) {

            // Delete user's Board
            await Collection.deleteMany({parent: req.body.id})

            // Delete user
            await User.deleteOne({id: req.body.id})
            return void res.status(200).json({message: `User ${req.body.id} succesfully deleted.`})


        // If non-admin user tries to delete someone else, return 401
        } else {
            console.log(`User ${user.id} blocked from deleting user ${req.body.id}`)
            return void res.status(401).json({message: `Unauthorized`})
        }


    // Error handling
    } catch (error: any) {
        console.error(`Error while deleting user: ${error}`)
        return void res.status(500).json({message: `Error while deleting Board`})
    }
})


export default userRouter
