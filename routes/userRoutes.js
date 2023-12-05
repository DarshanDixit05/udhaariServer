import express from "express"
const router = express.Router()

// import controllers
import {createUser, authUser, getProfile, updateProfile} from "../controllers/userController.js"
import {jwtToken} from "../middlewares/jwtToken.js";

router.route("/createUser").post(createUser)
router.route("/authUser").post(authUser)
router.route("/getProfile").get(jwtToken, getProfile)
router.route("/updateProfile").put(jwtToken, updateProfile)

export default router;