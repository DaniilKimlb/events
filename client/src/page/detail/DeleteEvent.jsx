import React, { useCallback, useContext } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import { useHttp } from '../../hooks/http.hook'
import { useHistory, useParams } from 'react-router-dom'
import { AuthContext } from '../../Context/auth.context'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export default function DeleteEvent() {
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }
    const { request } = useHttp()
    const history = useHistory()
    const params = useParams()
    const { token } = useContext(AuthContext)
    const handleClose = () => {
        setOpen(false)
    }
    const deleteEvent = useCallback(async () => {
        await request('api/event/' + params.id, 'delete', null, {
            Authorization: 'Bearer ' + token,
        })
        setOpen(false)
        history.push('/events')
    }, [params.id, token, request, history])

    return (
        <div>
            <p color="primary" onClick={handleClickOpen}>
                Удалить
            </p>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {'Вы уверены что хотите удалить это мероприятие?'}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Нет
                    </Button>
                    <Button onClick={deleteEvent} color="primary">
                        Да
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
