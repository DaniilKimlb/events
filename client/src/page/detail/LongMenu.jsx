import React, { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { EditEvent } from './EditEvent'
import DeleteEvent from './DeleteEvent'

export function LongMenu({ event }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                    },
                }}
            >
                <MenuItem onClick={handleClose}>
                    <EditEvent event={event} />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <DeleteEvent />
                </MenuItem>
            </Menu>
        </div>
    )
}
