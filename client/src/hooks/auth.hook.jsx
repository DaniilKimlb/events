import { useCallback, useEffect, useState } from 'react'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [complete, setComplete] = useState(null)
    const [status, setStatus] = useState(null)
    const storageName = 'userData'
    const login = useCallback((jsw, id, stat) => {
        setToken(jsw)
        setUserId(id)
        setStatus(stat)
        localStorage.setItem(
            storageName,
            JSON.stringify({ token: jsw, userId: id, status: stat })
        )
    }, [])
    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        localStorage.removeItem(storageName)
    }, [])
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        login(data?.token, data?.userId, data?.status)
        setComplete(true)
    }, [login])
    return { token, userId, logout, login, complete, status }
}
