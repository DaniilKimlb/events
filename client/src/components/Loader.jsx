import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        padding: '0 2rem',
        justifyContent: 'center',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}))

export default function Loader() {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <CircularProgress />
        </div>
    )
}
