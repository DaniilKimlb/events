import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../Context/auth.context'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export function ModalUnauthorized({ status, error }) {
    const history = useHistory()
    const { logout } = useContext(AuthContext)
    const [open, setOpen] = useState(false)
    useEffect(() => {
        if (error === 401) {
            setOpen(true)
        }
    }, [error])
    const AgreeHandler = () => {
        setOpen(false)
        logout()
        history.push('/login')
    }
    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    Вы не авторизованы!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Время сеанса истекло. Перезайдите!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={AgreeHandler} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
