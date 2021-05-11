import React, { useCallback, useContext, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { red } from '@material-ui/core/colors'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useHistory, useParams } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../Context/auth.context'
import { Rating } from '@material-ui/lab'
import { toDate } from '../../utility/toDate'
import { toCurrency } from '../../utility/toCurrency'
import { Button, ButtonGroup } from '@material-ui/core'
import { ModalUnauthorized } from '../../components/ModalUnauthorized'
import Loader from '../../components/Loader'
import { LongMenu } from './LongMenu'

const useStyles = makeStyles((theme) => ({
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}))

export function Detail() {
    const classes = useStyles()
    const [expanded, setExpanded] = React.useState(false)
    const params = useParams()
    const [event, setEvent] = useState(null)
    const { token, userId, isAdmin } = useContext(AuthContext)
    const { request, loader, error } = useHttp()
    const history = useHistory()

    const checkAccess =
        isAdmin || event?.creator?._id?.toString() === userId?.toString()
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await request(
                    `/api/event/` + params.id,
                    'get',
                    null,
                    { Authorization: 'Bearer ' + token }
                )
                setEvent(data)
                setRating(data.rating.averageRating)
            } catch (e) {}
        }
        fetchEvent()
    }, [params.id, token, request])
    const handlerAddCart = useCallback(async () => {
        await request(
            `/api/cart/add`,
            'post',
            { eventId: event?._id },
            { Authorization: 'Bearer ' + token }
        )
        history.push('/cart')
    }, [request, history, token, event?._id])
    const [rating, setRating] = useState(null)
    const ratingChanged = useCallback(
        async (e, newValue) => {
            try {
                await request(
                    `/api/event/rating`,
                    'put',
                    { rating: newValue, id: event._id },
                    {
                        Authorization: 'Bearer ' + token,
                    }
                )
                setRating(newValue)
            } catch (e) {}
        },
        [request, event, token]
    )
    if (loader && !event) {
        return <Loader />
    }
    const toImg = (img) => 'http://localhost:3000/' + img
    const handleExpandClick = () => {
        setExpanded(!expanded)
    }
    const lengthRatingArr = event?.rating.appreciated.length
    return (
        <Card>
            <ModalUnauthorized error={error.status} />
            <CardHeader
                avatar={
                    event?.creator?.avatar ? (
                        <Avatar
                            aria-label="recipe"
                            src={toImg(event?.creator?.avatar)}
                            className={classes.avatar}
                        />
                    ) : (
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            {event?.creator?.firstName.charAt(0)}
                        </Avatar>
                    )
                }
                action={checkAccess && <LongMenu event={event} />}
                title={
                    event?.creator?.firstName + ' ' + event?.creator?.lastName
                }
                subheader={toDate(event?.date)}
            />
            {event?.img && (
                <CardMedia
                    component="img"
                    alt={event?.title}
                    height="500"
                    image={toImg(event?.img)}
                    title={event?.title}
                />
            )}
            <CardContent>
                <Typography gutterBottom variant="h3" component="h2">
                    {event?.title}
                </Typography>
                <Typography color="textSecondary" component="p">
                    <Typography component="legend">Рейтинг</Typography>
                    <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={ratingChanged}
                        disabled={loader}
                        title={
                            lengthRatingArr > 1
                                ? `Оценило ${lengthRatingArr} пользователя`
                                : lengthRatingArr === 1
                                ? 'Оценил 1 пользователь'
                                : 'Это мероприятие пока что никто не оценил'
                        }
                    />
                </Typography>
                <Typography variant="h6" color="textSecondary" component="p">
                    <strong>Дата начала: </strong>
                    {toDate(event?.dateStart)}
                </Typography>
                <Typography variant="h6" color="textSecondary" component="p">
                    <strong>Описание:</strong> {event?.description}
                </Typography>
                <Typography variant="h5" color="textSecondary" component="p">
                    <strong>Цена:</strong> {toCurrency(event?.price)}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <ButtonGroup
                    size="large"
                    color="primary"
                    aria-label="large outlined primary button group"
                >
                    <Button onClick={handlerAddCart}>Добавить в корзину</Button>
                </ButtonGroup>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography
                        variant="h6"
                        color="textSecondary"
                        component="p"
                    >
                        <strong>Подробное описание: </strong>{' '}
                        {event?.detailedDescription}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}
