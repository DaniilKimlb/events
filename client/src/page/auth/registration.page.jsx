import React, { useCallback } from 'react'
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
import { useHistory, Link } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
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
        marginTop: theme.spacing(3),
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

export default function RegistrationPage() {
    const classes = useStyles()
    const history = useHistory()
    const { request, loader, error } = useHttp()
    const schema = yup.object().shape({
        firstName: yup
            .string('Поле "Имя" должна быть строкой')
            .required('Поле "Имя" является обязательным полем')
            .min(3, 'Имя должно содержать более 3 символов'),
        lastName: yup
            .string('Поле "Фамилия" должна быть строкой')
            .required('Поле "Фамилия" является обязательным полем')
            .min(3, 'Фамилия должна содержать более 3 символов'),
        email: yup
            .string('Поле "Email" должна быть строкой')
            .required('Поле "Email" является обязательным полем')
            .email('Email некорректный'),
        password: yup
            .string()
            .required('Поле "Пароль" является обязательным полем')
            .min(6, 'Пароль должен содержать более 6 символов'),
    })
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) })
    const onSubmit = useCallback(
        async (dataForm) => {
            try {
                const { firstName, lastName, email, password } = dataForm
                await request('api/auth/registration', 'post', {
                    firstName,
                    lastName,
                    email,
                    password,
                })
                history.push('/login')
                reset()
            } catch (e) {
                console.log(e)
            }
        },
        [request, history, reset]
    )
    let alert = useAlert(error.message || errors)
    return (
        <Container component="main" maxWidth="xs">
            {alert}
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Зарегистрироваться
                </Typography>
                <form
                    className={classes.form}
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                {...register('firstName')}
                                autoComplete="fname"
                                variant="outlined"
                                required
                                fullWidth
                                name={'firstName'}
                                id="firstName"
                                label="Имя"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                {...register('lastName')}
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                name={'lastName'}
                                label="Фамилия"
                                autoComplete="lname"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register('email')}
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name={'email'}
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register('password')}
                                variant="outlined"
                                required
                                fullWidth
                                label="Пароль"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={loader}
                    >
                        Зарегистрироваться
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link to="/login">{'Уже есть аккаунт?'}</Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}
