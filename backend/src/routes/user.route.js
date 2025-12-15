import { Router } from "express";

const userRoute = Router()

// ROUTE IMPORTS
import { register } from "../controllers/user.controller.ts";

userRoute.route('/register').post(register)

export default userRoute