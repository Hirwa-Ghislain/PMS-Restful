import { useEffect, useContext } from "react"
import { UserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"

export const useUserAuth = () => {
    const { user, isLoading } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login", { replace: true })
        }
    }, [user, isLoading, navigate])

    return { user, isLoading }
}
