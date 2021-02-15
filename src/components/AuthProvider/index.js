import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import app from '../../firebase.js';

export const AuthContext = React.createContext(null);

export default function AuthProvider({ children })  {
    const history = useHistory();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        app.auth().onAuthStateChanged(setCurrentUser);
    }, []);

    useEffect(() => {
        console.log(history && history);
        if (currentUser && history) {
            console.log("here");
            history.push('/');
        }
    }, [currentUser, history])

    return <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>;
};
