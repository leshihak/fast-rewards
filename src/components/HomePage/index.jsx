import React from 'react';
import app from '../../firebase';

const HomePage = () => {
    const onLogOut = () => {
        app.auth().signOut();
    }

    return <button onClick={onLogOut}>Log Out</button>
}

export default HomePage;