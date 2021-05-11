import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    alert: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
    },
    alertCR: {
        margin: '1rem 0',
    },
}))

export const useAlert = (err, s) => {
    const classes = useStyles()
    const [message, setMassage] = useState(null)
    useEffect(() => {
        if (!err) {
            return
        }
        if (typeof err === 'object') {
            setMassage(err[Object.keys(err)[0]]?.message)
        } else {
            setMassage(err)
        }
    }, [err])
    return (
        message && (
            <Alert
                severity="error"
                className={!s ? classes.alert : classes.alertCR}
            >
                {message}
            </Alert>
        )
    )
}
