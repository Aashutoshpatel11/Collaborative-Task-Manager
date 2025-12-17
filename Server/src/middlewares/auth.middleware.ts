import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction  } from "express";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const authJwt = asyncHandler( async(req:Request, resizeBy:Response, next:NextFunction) => {
    const accessToken = req.cookies.accessToken
    if(!accessToken){
        throw new ApiError(
            404,
            "Unauthorised Request"
        )
    }

    const decodedToken = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET||"")
    if(!decodedToken){
        throw new ApiError(
            404,
            "Invalid Token"
        )
    }

    const user = await User.findById(decodedToken._id).select('-password')
    if(!user){
        throw new ApiError(
            400,
            "User not found"
        )
    }
    req.user = user
    next()
} )

export {authJwt}