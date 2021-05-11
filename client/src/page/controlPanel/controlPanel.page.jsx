import React, { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Schedule from './Schedule'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../Context/auth.context'
import Loader from '../../components/Loader'
import Typography from '@material-ui/core/Typography'
import { toCurrency } from '../../utility/toCurrency'
import { toDate } from '../../utility/toDate'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Table from '@material-ui/core/Table'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24,
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    depositContext: {
        flex: 1,
    },
}))

export default function ControlPanelPage() {
    const classes = useStyles()
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)
    const { request, loader } = useHttp()
    const { token } = useContext(AuthContext)
    const [dataOrder, setDataOrder] = useState(null)
    useEffect(() => {
        async function fetchPurchases() {
            try {
                const data = await request(`/api/order/all`, 'get', null, {
                    Authorization: 'Bearer ' + token,
                })
                setDataOrder(data.orders)
            } catch (e) {}
        }

        fetchPurchases()
    }, [request, token])

    if (loader) {
        return <Loader />
    }
    const totalAmount = dataOrder?.reduce((acc, el) => {
        return acc + +el.price
    }, 0)
    const orders = dataOrder?.map((el, idx) => {
        return {
            id: idx,
            date: toDate(el.date),
            firstName: el.customer.firstName,
            lastName: el.customer.lastName,
            email: el.customer.email,
            sum: el.price,
        }
    })
    return (
        <div className={classes.root}>
            <CssBaseline />
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper className={fixedHeightPaper}>
                                <Schedule data={dataOrder} />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper className={fixedHeightPaper}>
                                <Typography component="p" variant="h6">
                                    {toCurrency(totalAmount)}
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    className={classes.depositContext}
                                >
                                    на {toDate(Date.now())}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Дата</TableCell>
                                            <TableCell>Имя</TableCell>
                                            <TableCell>Фамилия</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Сумма заказа</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orders?.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell>
                                                    {row.date}
                                                </TableCell>
                                                <TableCell>
                                                    {row.firstName}
                                                </TableCell>
                                                <TableCell>
                                                    {row.lastName}
                                                </TableCell>
                                                <TableCell>
                                                    {row.email}
                                                </TableCell>
                                                <TableCell>
                                                    {toCurrency(row.sum)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    )
}
