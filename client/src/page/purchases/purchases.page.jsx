import Grid from '@material-ui/core/Grid'
import React, { useContext, useEffect, useState } from 'react'
import { PurchasesCard } from './PurchasesCard'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../Context/auth.context'
import Loader from '../../components/Loader'

export function Purchases() {
    const { token } = useContext(AuthContext)
    const { request } = useHttp()
    const [orders, setOrders] = useState(null)
    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await request('/api/order/', 'get', null, {
                    Authorization: 'Bearer ' + token,
                })
                setOrders(data.orders)
            } catch (e) {}
        }
        fetchOrders()
    }, [request, token])
    if (!orders) {
        return <Loader />
    }
    return (
        <Grid container spacing={4}>
            <PurchasesCard orders={orders} />
        </Grid>
    )
}
