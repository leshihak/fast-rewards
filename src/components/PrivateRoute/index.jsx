import React, { useContext } from 'react';
import { AuthContext } from '../AuthProvider';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: RouteComponent, path }) => {
    const currentUser = useContext(AuthContext);

    return (
        <Route
            path={path}
            render={(routerProps) =>
                currentUser ? <RouteComponent {...routerProps} /> : <Redirect to={'/login'} />
            }
        />
    );
};

export default PrivateRoute;
