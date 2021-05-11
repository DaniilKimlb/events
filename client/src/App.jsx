import { routes } from './routes'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './Context/auth.context'
import Header from './components/Header'
import React from 'react'
import Loader from './components/Loader'
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
}))
function App() {
    const classes = useStyles()

    const { login, logout, userId, token, complete, status } = useAuth()
    const isAuthorized = !!token
    const isAdmin = status === 'admin'
    const Route = routes(isAuthorized, isAdmin)
    return !complete ? (
        <Loader />
    ) : (
        <AuthContext.Provider
            value={{ login, logout, userId, token, isAuthorized, isAdmin }}
        >
            <Router>
                {isAuthorized && <Header />}
                <Container className={classes.cardGrid} maxWidth="md">
                    <div className={'container'}>{Route}</div>
                </Container>
            </Router>
        </AuthContext.Provider>
    )
}

export default App
