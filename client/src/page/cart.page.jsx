import * as React from 'react'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../Context/auth.context'
import Loader from '../components/Loader'
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { toCurrency } from '../utility/toCurrency'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { useHistory } from 'react-router-dom'
import { ModalUnauthorized } from '../components/ModalUnauthorized'

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
}))

export function Cart() {
    const classes = useStyles()
    const { request, loader, error } = useHttp()
    const history = useHistory()
    const { token } = useContext(AuthContext)
    const [rows, setRows] = useState(null)
    useEffect(() => {
        async function fetchCart() {
            try {
                const data = await request(`/api/cart`, 'get', null, {
                    Authorization: 'Bearer ' + token,
                })
                console.log(data)
                setRows(data)
            } catch (e) {}
        }

        fetchCart()
    }, [request, token])
    const handleClickRemove = useCallback(
        async (e, id) => {
            try {
                await request('/api/cart/remove/' + id, 'delete', null, {
                    Authorization: 'Bearer ' + token,
                })
                let items = { ...rows }
                const idx = items.event.findIndex(
                    (c) => c._id.toString() === id.toString()
                )
                if (items.event[idx].count === 1) {
                    items.event = items.event.filter(
                        (e) => e._id.toString() !== id.toString()
                    )
                } else {
                    items.event[idx].count--
                    items.price = items.price - items.event[idx].price
                }
                setRows(items)
            } catch (e) {}
        },
        [request, token, rows]
    )
    const handlerAddOrder = useCallback(async () => {
        await request(
            '/api/order/',
            'post',
            { price: rows.price, order: rows.event },
            { Authorization: 'Bearer ' + token }
        )
        history.push('/purchases')
    }, [request, token, rows, history])
    if (loader) {
        return <Loader />
    }

    return (
        <main>
            <ModalUnauthorized error={error.status} />
            {rows?.event?.length ? (
                <TableContainer component={Paper}>
                    <Table
                        className={classes.table}
                        size="small"
                        aria-label="a dense table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="center">
                                    Название мероприятия
                                </TableCell>
                                <TableCell align="center">Цена</TableCell>
                                <TableCell align="center">Действие</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows?.event?.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell component="th" scope="row">
                                        {idx + 1}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.title}
                                    </TableCell>
                                    <TableCell align="center">
                                        {toCurrency(row.price * row.count)}(x
                                        {row.count})
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            onClick={(e) =>
                                                handleClickRemove(e, row._id)
                                            }
                                        >
                                            Удалить
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Typography variant="body1" style={{ paddingLeft: 7 }}>
                        <strong> Общая сумма:</strong> {toCurrency(rows.price)}
                    </Typography>
                    <Button onClick={handlerAddOrder}>Сделать заказ</Button>
                </TableContainer>
            ) : (
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography
                            variant="h5"
                            align="center"
                            color="textSecondary"
                            paragraph
                        >
                            Ваша корзина пуста
                        </Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button
                                        onClick={() => history.push('/events')}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Перейти в список мероприятий
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>
            )}
        </main>
    )
}
