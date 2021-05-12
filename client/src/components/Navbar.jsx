import React, { useContext } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import MenuIcon from '@material-ui/icons/Menu'
import AddBoxIcon from '@material-ui/icons/AddBox'
import ShopIcon from '@material-ui/icons/Shop'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../Context/auth.context'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'

const useStyles = makeStyles({
    list: {
        width: 250,
        color: '#fff',
        '& a': {
            color: '#000',
            textDecoration: 'none',
        },
    },
    fullList: {
        width: 'auto',
    },
})

export default function Navbar() {
    const classes = useStyles()
    const { isAdmin } = useContext(AuthContext)
    const [state, setState] = React.useState({
        left: false,
    })

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return
        }

        setState({ ...state, [anchor]: open })
    }

    const list = (anchor) => (
        <div
            className={clsx(classes.list)}
            style={classes.root}
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {[
                    {
                        text: 'Все мероприятия',
                        icons: CalendarTodayIcon,
                        url: '/events',
                    },
                    {
                        text: 'Создать мероприятие',
                        icons: AddBoxIcon,
                        url: '/create',
                    },
                    { text: 'Корзина', icons: ShoppingCartIcon, url: '/cart' },
                    { text: 'Покупки', icons: ShopIcon, url: '/purchases' },
                ].map((n, index) => (
                    <NavLink to={n.url} key={index}>
                        <ListItem button>
                            <ListItemIcon>
                                <n.icons />
                            </ListItemIcon>
                            <ListItemText primary={n.text} />
                        </ListItem>
                    </NavLink>
                ))}
                {isAdmin && (
                    <NavLink to={'/controlPanel'}>
                        <ListItem button>
                            <ListItemIcon>
                                <SupervisorAccountIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Панель управления'} />
                        </ListItem>
                    </NavLink>
                )}
            </List>
        </div>
    )

    return (
        <div>
            <>
                <MenuIcon onClick={toggleDrawer('left', true)} />
                <Drawer
                    anchor={'left'}
                    open={state['left']}
                    onClose={toggleDrawer('left', false)}
                >
                    {list('left')}
                </Drawer>
            </>
        </div>
    )
}
