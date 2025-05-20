require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const { connectDB } = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const parkingRoutes = require("./routes/parkingRoutes")
const registerCarRoutes = require("./routes/registerCarRoutes")
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json'); // adjust path

const app = express()

// Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)

app.use(express.json())

// Connect to database
connectDB()

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/parkings", parkingRoutes)
app.use("/api/v1/registercars", registerCarRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/dashboard", dashboardRoutes)

//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))