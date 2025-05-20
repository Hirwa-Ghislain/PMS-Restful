const User = require('../models/User')
const jwt = require("jsonwebtoken")

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" })
}

// Register User
exports.registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    // Validation 
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }
    try {
        //Check if email already exists
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" })
        }

        // Create the user
        const user = await User.create({
            fullName,
            email,
            password
        })

        // Remove password from response
        const userResponse = user.toJSON()
        delete userResponse.password

        res.status(201).json({
            user: userResponse,
            token: generateToken(user.id),
        })
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error registering user", error: err.message })
    }
}

// Login User
exports.loginUser = async (req, res) => { 
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }
    try {
        const user = await User.findOne({ where: { email } })
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // Remove password from response
        const userResponse = user.toJSON()
        delete userResponse.password

        res.status(200).json({
            user: userResponse,
            token: generateToken(user.id)
        })
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error logging in user", error: err.message })
    }
}

// Get User Info
exports.getUserInfo = async (req, res) => { 
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json(user)
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error fetching user info", error: err.message })
    }
}