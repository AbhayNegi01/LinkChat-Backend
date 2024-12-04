import { Router } from "express"
import { signup, login, logout, updateProfile, getCurrentUser, refreshAccessToken } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/signup").post(signup)

router.route("/login").post(login)

router.route("/logout").post(verifyJWT, logout)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/update-profile").patch(verifyJWT, updateProfile)

router.route("/current-user").get(verifyJWT, getCurrentUser)

export default router