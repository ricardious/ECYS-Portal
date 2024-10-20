import { Router } from "express";
import { login, logout, verifyToken, dashboard } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema } from "../schemas/auth.schema.js";

/**
 * Router instance to define authentication-related routes.
 * 
 * @type {Router}
 */
const router = Router()


router.post('/login', validateSchema(loginSchema), login)

router.get('/verify', verifyToken)

router.post('/logout', verifyToken, logout)


export default router

