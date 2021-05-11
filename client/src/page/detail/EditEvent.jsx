import React, { useCallback, useContext, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import List from '@material-ui/core/List'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { useHttp } from '../../hooks/http.hook'
import { useForm } from 'react-hook-form'
import { ModalUnauthorized } from '../../components/ModalUnauthorized'
import { toFormData } from '../../utility/toFormData'
import { AuthContext } from '../../Context/auth.context'
import { useParams } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAlert } from '../../hooks/message.hook'
import { Alert } from '@material-ui/lab'

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    root: {
        textAlign: 'center',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    form: {
        padding: '2rem',
    },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export function EditEvent({ event }) {
    let date = new Date()
    const schema = yup.object().shape({
        title: yup.string('Поле "Название" должна быть строкой').min(3),
        price: yup
            .number('Поле "Цена" должна быть числового типа')
            .min(1, 'Минимальная цена 1'),
        description: yup.string('Поле "Описание" должна быть строкой').max(145),
        dateStart: yup
            .date()
            .min(date, 'Мероприятие не может начаться в прошлом'),
    })
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) })
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }
    const [img, setImg] = useState(null)
    const { error, request, loader } = useHttp()
    const [nameFile, setNameFile] = useState(null)
    const { token } = useContext(AuthContext)
    const fileSelectHandler = useCallback((e) => {
        const file = e.target.files[0]
        setNameFile(file?.name)
        setImg(file)
    }, [])
    const param = useParams()
    const handleClose = () => {
        setOpen(false)
    }
    const [complete, setComplete] = useState(false)
    const alert = useAlert(errors, true)
    const onSubmit = useCallback(
        async (formObj) => {
            try {
                const {
                    title,
                    price,
                    description,
                    detailedDescription,
                    dateStart,
                } = formObj
                const formData = toFormData({
                    title,
                    price,
                    description,
                    detailedDescription,
                    dateStart,
                    img,
                })
                await request('api/event/change/' + param.id, 'put', formData, {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data',
                })
                setComplete(true)
            } catch (e) {}
        },
        [img, request, token, param.id]
    )
    return (
        <div>
            <ModalUnauthorized error={error.status} />
            <p color="primary" onClick={handleClickOpen}>
                Редактировать
            </p>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Редактировать мероприятие {event?.title}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <List>
                    {alert}

                    {complete && (
                        <Alert style={{ margin: '1rem 0' }} severity="success">
                            Изменения внесены! Чтобы их увидеть обновите
                            страницу
                        </Alert>
                    )}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className={classes.form}
                        id="update-event"
                        encType="multipart/form-data"
                        noValidate
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    {...register('title')}
                                    id="title"
                                    defaultValue={event?.title}
                                    label="Название"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    {...register('price')}
                                    id="Price"
                                    defaultValue={event?.price}
                                    label="Цена в тенге"
                                    fullWidth
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    {...register('description')}
                                    id="description"
                                    defaultValue={event?.description}
                                    label="Описание"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    {...register('detailedDescription')}
                                    id="standard-multiline-static"
                                    label="Подробное описание"
                                    defaultValue={event?.detailedDescription}
                                    multiline
                                    fullWidth
                                    rows={4}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    {...register('dateStart')}
                                    id="dateStart"
                                    label="Время начала"
                                    fullWidth
                                    type="datetime-local"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <input
                                    {...register('img')}
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
                                        Изменить фото мероприятия
                                    </Button>
                                </label>
                            </Grid>
                            {nameFile ||
                                event?.img?.slice(7, event?.img.length)}
                        </Grid>
                        <div className={classes.buttons}>
                            <Button
                                className={classes.button}
                                type="submit"
                                disabled={loader}
                            >
                                Сохранить
                            </Button>
                        </div>
                    </form>
                </List>
            </Dialog>
        </div>
    )
}
