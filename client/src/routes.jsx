import { Route, Switch, Redirect } from 'react-router-dom'
import RegistrationPage from './page/auth/registration.page'
import LoginPage from './page/auth/login.page'
import { Cart } from './page/cart.page'
import { Detail } from './page/detail/detail.page'
import { Create } from './page/create/create.page'
import { Events } from './page/events/events.page'
import { Purchases } from './page/purchases/purchases.page'
import ControlPanelPage from './page/controlPanel/controlPanel.page'
import Profile from './page/profile.page'

export const routes = (isAuthorized, isAdmin) => {
    if (isAuthorized) {
        return (
            <Switch>
                <Route path="/events" exact>
                    <Events />
                </Route>
                <Route path="/create" exact>
                    <Create />
                </Route>
                <Route path="/detail/:id">
                    {' '}
                    <Detail />
                </Route>
                <Route path="/cart/" exact>
                    {' '}
                    <Cart />
                </Route>
                <Route path="/purchases" exact>
                    <Purchases />
                </Route>
                <Route path="/profile" exact>
                    <Profile />
                </Route>
                {isAdmin && (
                    <Route path="/controlPanel" exact>
                        <ControlPanelPage />
                    </Route>
                )}
                <Redirect to="/events" exact>
                    {' '}
                    <Cart />
                </Redirect>
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path="/registration" exact>
                <RegistrationPage />
            </Route>
            <Route path="/login" exact>
                <LoginPage />
            </Route>
            <Redirect to="/login" />
        </Switch>
    )
}
