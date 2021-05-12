import React, { useCallback, useContext, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { Avatar, Button, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ModalUnauthorized } from '../components/ModalUnauthorized'
import { AuthContext } from '../Context/auth.context'
import { useHttp } from '../hooks/http.hook'
import Loader from '../components/Loader'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import { Alert } from '@material-ui/lab'

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: 'center',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
    red: {
        fontSize: 100,
        backgroundColor: 'red',
        height: 140,
        width: 140,
        margin: 10,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
}))
export default function Profile() {
    const classes = useStyles()
    const { error, request, loader } = useHttp()
    const { token } = useContext(AuthContext)
    const [complete, setComplete] = useState(false)
    const fileSelectHandler = useCallback(
        async (e) => {
            const file = e.target.files[0]
            try {
                const formData = new FormData()
                formData.append('img', file)
                await request('/api/profile/avatar/', 'put', formData, {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data',
                })
                setComplete(true)
            } catch (e) {}
        },
        [request, token]
    )
    const [profile, setProfile] = useState(null)
    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await request('/api/profile/', 'get', null, {
                    Authorization: 'Bearer ' + token,
                })
                setProfile(data.user)
            } catch (e) {}
        }

        fetchProfile()
    }, [request, token])
    if (loader && !profile) {
        return <Loader />
    }
    return (
        <>
            <CssBaseline />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    {complete && (
                        <Alert style={{ margin: '1rem 0' }} severity="success">
                            Изменения внесены! Чтобы их увидеть обновите
                            страницу
                        </Alert>
                    )}
                    <Typography component="h1" variant="h4" align="center">
                        Профиль
                    </Typography>
                    <React.Fragment>
                        <ModalUnauthorized error={error.status} />
                        <Grid
                            container
                            spacing={3}
                            justify={'center'}
                            alignItems={'center'}
                        >
                            <Grid item xs={6}>
                                {profile?.avatar ? (
                                    <Avatar
                                        alt={profile?.firstName}
                                        src={profile?.avatar}
                                        className={classes.red}
                                    />
                                ) : (
                                    <Avatar className={classes.red}>
                                        {profile?.firstName?.charAt(0)}
                                    </Avatar>
                                )}
                                <input
                                    required
                                    className={classes.input}
                                    id="contained-button-file"
                                    accept=".png, .jpg, .jpeg"
                                    type="file"
                                    onChange={fileSelectHandler}
                                />
                                <label htmlFor="contained-button-file">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component="span"
                                    >
                                        Обновить аватар
                                    </Button>
                                </label>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="h6"
                                    color="textSecondary"
                                    component="p"
                                >
                                    <strong> Имя:</strong> {profile?.firstName}
                                </Typography>
                                <Typography
                                    variant={'h6'}
                                    color="textSecondary"
                                    component="p"
                                >
                                    <strong>Фамилия:</strong>{' '}
                                    {profile?.lastName}
                                </Typography>
                                <Typography
                                    variant={'h6'}
                                    color="textSecondary"
                                    component="p"
                                >
                                    <strong>Email:</strong> {profile?.email}
                                </Typography>
                                <Typography
                                    variant={'h6'}
                                    color="textSecondary"
                                    component="p"
                                >
                                    <strong>Ваш статус:</strong>{' '}
                                    {profile?.status}
                                </Typography>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                </Paper>
            </main>
        </>
    )
}
