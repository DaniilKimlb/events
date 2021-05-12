import React, { useContext, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import AddIcon from '@material-ui/icons/Add'
import { EventCard } from './EventCard'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../Context/auth.context'
import Loader from '../../components/Loader'
import { Fab, Tooltip } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { ModalUnauthorized } from '../../components/ModalUnauthorized'
import { Pagination } from '@material-ui/lab'

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    absolute: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
    },
    pagination: {
        '& > *': {
            marginTop: theme.spacing(4),
        },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}))

export function Events() {
    const classes = useStyles()
    const history = useHistory()
    const { request, loader, error } = useHttp()
    const { token } = useContext(AuthContext)
    const [events, setEvents] = useState(null)
    const [countPaginator, setCountPaginator] = useState(null)
    const [page, setPage] = useState(null)
    useEffect(() => {
        async function fetchEvents() {
            try {
                const data = await request(
                    `/api/event?page=${page || 0}&count=9`,
                    'get',
                    null,
                    { Authorization: 'Bearer ' + token }
                )
                setCountPaginator(data.count)
                setEvents(data.events)
            } catch (e) {}
        }

        fetchEvents()
    }, [request, token, page])

    const handlerPageChange = (e, value) => {
        setPage(value - 1)
    }

    if (loader) {
        return <Loader />
    }

    return (
        <>
            <main>
                <ModalUnauthorized error={error.status} />
                {!events?.length ? (
                    <div className={classes.heroContent}>
                        <Typography
                            variant="h5"
                            align="center"
                            color="textSecondary"
                            paragraph
                        >
                            Мероприятий пока нету
                        </Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button
                                        onClick={() => history.push('/create')}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Создать?
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                ) : (
                    <Container maxWidth="md">
                        <Grid container spacing={4}>
                            <EventCard events={events} />
                        </Grid>
                        <Tooltip title="Add" aria-label="add">
                            <Fab
                                color="primary"
                                onClick={() => history.push('/create')}
                                className={classes.absolute}
                            >
                                <AddIcon />
                            </Fab>
                        </Tooltip>
                        <div className={classes.pagination}>
                            <Pagination
                                count={countPaginator}
                                page={page + 1}
                                onChange={handlerPageChange}
                                shape="rounded"
                            />
                        </div>
                    </Container>
                )}
            </main>
        </>
    )
}
