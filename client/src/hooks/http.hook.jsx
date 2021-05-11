import { useCallback, useState } from 'react'
import axios from 'axios'

export const useHttp = () => {
    const [error, setError] = useState({ status: null, message: null })
    const [loader, setLoader] = useState(false)
    const request = useCallback(
        async (url, method = 'get', body = null, headers = {}) => {
            setLoader(true)
            try {
                const instance = axios.create({
                    headers,
                    baseURL: 'http://localhost:3000/',
                })
                const response = await instance[method](url, body)
                const data = response.data
                setLoader(false)
                return data
            } catch (e) {
                setLoader(false)
                setError({
                    status: e.response.status,
                    message: e.response.data.message,
                })
                throw e.message
            }
        },
        []
    )
    const clearError = useCallback(() => setError(null), [])
    return { error, loader, request, clearError }
}
