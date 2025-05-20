import React, { createContext, useState, useEffect } from "react"

export const UserContext = createContext()

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const initializeAuth = () => {
            const storedUser = sessionStorage.getItem("user")
            const token = sessionStorage.getItem("token")

            if (storedUser && token) {
                try {
                    const parsedUser = JSON.parse(storedUser)
                    setUser(parsedUser)
                } catch (error) {
                    console.error("Error parsing stored user:", error)
                    sessionStorage.removeItem("user")
                    sessionStorage.removeItem("token")
                }
            }
            setIsLoading(false)
        }

        initializeAuth()
    }, [])

    const updateUser = (userData) => {
        setUser(userData)
        sessionStorage.setItem("user", JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        sessionStorage.removeItem("user")
        sessionStorage.removeItem("token")
        window.location.replace("/login")
    }

    return (
        <UserContext.Provider value={{ user, updateUser, logout, isLoading }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider
