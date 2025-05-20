const express = require("express")
const { protect } = require("../middleware/authMiddleware")

const {
    registerUser,
    loginUser,
    getUserInfo,
} = require("../controllers/authController")

const router = express.Router()

router.post("/signup", registerUser)
router.post("/login", loginUser)
router.get("/me", protect, getUserInfo)

module.exports = router