import React, { useCallback, useContext } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { useForm } from 'react-hook-form'
import { useHttp } from '../../hooks/http.hook'
import { Link, useHistory } from 'react-router-dom'
import { AuthContext } from '../../Context/auth.context'
import { useAlert } from '../../hooks/message.hook'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
        '& a': {
            color: '#3F51B5',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    alert: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
    },
}))

export default function LoginPage() {
    const auth = useContext(AuthContext)
    const classes = useStyles()
    const { handleSubmit, register, reset } = useForm()
    const { request, error, loader } = useHttp()
    const history = useHistory()

    const onSubmit = useCallback(
        async (dataForm) => {
            try {
                const { email, password } = dataForm
                const data = await request('api/auth/login', 'post', {
                    email,
                    password,
                })
                auth.login(data?.token, data?.userId, data?.status)
                history.push('/events')
                reset()
            } catch (e) {}
        },
        [auth, history, reset, request]
    )
    let alert = useAlert(error.message)
    return (
        <Container component="main" maxWidth="xs">
            {alert}
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Войти
                </Typography>
                <form
                    className={classes.form}
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <TextField
                        {...register('email')}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        {...register('password')}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={loader}
                    >
                        Войти
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link to="/registration">
                                {'Нет учетной записи?'}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}
