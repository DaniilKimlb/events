import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { toCurrency } from '../../utility/toCurrency'

const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        margin: 15,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
}))

export function PurchasesCard({ orders }) {
    const classes = useStyles()
    return orders.length ? (
        orders.map((e) => (
            <Card className={classes.root} key={e._id}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Заказ: <br /> <strong> {e._id}</strong>
                    </Typography>
                    <Typography variant="body2" component="h2">
                        Список покупок:
                    </Typography>
                    {e.order.map((o) => (
                        <Typography color="textSecondary" key={o._id}>
                            {o.title}
                        </Typography>
                    ))}
                    <Typography variant="body2" component="p">
                        Стоимость:
                        <br />
                        {toCurrency(e.price)}
                    </Typography>
                </CardContent>
            </Card>
        ))
    ) : (
        <div>
            <Container maxWidth="sm">
                <Typography
                    variant="h5"
                    align="center"
                    color="textSecondary"
                    paragraph
                >
                    Вы пока что ничего не купили
                </Typography>
            </Container>
        </div>
    )
}
