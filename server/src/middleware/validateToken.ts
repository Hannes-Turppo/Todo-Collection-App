// This is from my week8 exercises

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

interface userRequest extends Request {
    user?: JwtPayload
}

const validateUser = (req: userRequest, res: Response, next: NextFunction) => {

    const token: string | undefined = req.header("authorization")?.split(" ")[1]

    if (!token) {
        res.status(401).json({message: "Token not found"})
        return
    }

    try {
        const verified: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload;
        req.user = verified;
        next();

    } catch (error: any) {
        res.status(401).json({message: "Token not found"})
        return
    }
}

export { validateUser, userRequest }
