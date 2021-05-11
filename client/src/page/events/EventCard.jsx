import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import { CardActionArea } from '@material-ui/core'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { Rating } from '@material-ui/lab'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { toDate } from '../../utility/toDate'
import { toCurrency } from '../../utility/toCurrency'
import noPhoto from '../../assets/img/1.png'

const useStyles = makeStyles((theme) => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
}))

export function EventCard({ events }) {
    const classes = useStyles()
    const history = useHistory()
    return [...events].reverse().map((card) => (
        <Grid item key={card._id} xs={12} sm={6} md={4}>
            <Card className={classes.card}>
                <CardActionArea
                    onClick={() => history.push('/detail/' + card._id)}
                >
                    <CardMedia
                        component="img"
                        alt="Contemplative Reptile"
                        height="140"
                        image={card.img || noPhoto}
                        title="Contemplative Reptile"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {card.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            <Typography component="legend">Рейтинг</Typography>
                            <Rating
                                name="simple-controlled"
                                value={card.rating.averageRating}
                                disabled
                            />
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            <strong>Цена:</strong> {toCurrency(card.price)}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            <strong>Дата начала:</strong>{' '}
                            {toDate(card.dateStart)}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            <strong>Описание:</strong> {card.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button
                        size="small"
                        color="primary"
                        onClick={() => history.push('/detail/' + card._id)}
                    >
                        Подробнее
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    ))
}
