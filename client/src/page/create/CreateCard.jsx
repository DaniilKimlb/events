import React, { useCallback, useContext, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useForm } from 'react-hook-form'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../Context/auth.context'
import { useHistory } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAlert } from '../../hooks/message.hook'
import { ModalUnauthorized } from '../../components/ModalUnauthorized'
import { toFormData } from '../../utility/toFormData'

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
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}))
export default function CreateCard() {
    let date = new Date()
    const schema = yup.object().shape({
        title: yup
            .string('Поле "Название" должна быть строкой')
            .required('Поле "Название" является обязательным полем')
            .min(3),
        price: yup
            .number('Поле "Цена" должна быть числового типа')
            .required('Поле "Цена" является обязательным полем')
            .min(1, 'Минимальная цена 1'),
        description: yup
            .string('Поле "Описание" должна быть строкой')
            .required('Поле "Описание" является обязательным полем')
            .max(145),
        dateStart: yup
            .date()
            .required('Поле "Время начала" является обязательным полем')
            .min(date, 'Мероприятие не может начаться в прошлом'),
    })
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) })
    const classes = useStyles()
    const [img, setImg] = useState(null)
    const { error, request, loader } = useHttp()
    const [nameFile, setNameFile] = useState(null)
    const { token } = useContext(AuthContext)
    const fileSelectHandler = useCallback((e) => {
        const file = e.target.files[0]
        setNameFile(file?.name)
        setImg(file)
    }, [])
    const alert = useAlert(errors, true)
    const history = useHistory()
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
                await request('/api/event/add', 'post', formData, {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data',
                })

                setNameFile(null)
                history.push('/events')
            } catch (e) {}
        },
        [request, token, img, history]
    )
    return (
        <React.Fragment>
            {alert}
            <ModalUnauthorized error={error.status} />
            <form
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form-data"
                noValidate
            >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            {...register('title')}
                            required
                            id="title"
                            label="Название"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            {...register('price')}
                            id="Price"
                            label="Цена в тенге"
                            required
                            fullWidth
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            {...register('description')}
                            required
                            id="description"
                            label="Описание"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            {...register('detailedDescription')}
                            id="standard-multiline-static"
                            label="Подробное описание"
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
                            required
                            fullWidth
                            type="datetime-local"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            required
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
                                Добавить фото мероприятия
                            </Button>
                        </label>
                    </Grid>
                    {nameFile}
                </Grid>
                <div className={classes.buttons}>
                    <Button
                        className={classes.button}
                        type="submit"
                        disabled={loader}
                    >
                        Создать
                    </Button>
                </div>
            </form>
        </React.Fragment>
    )
}
