import { ReactReduxContext } from 'react-redux';
import { useContext, useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';
import Home from './Home';
import Chat from './Chat';

const Presentational = ({ updateToken, submitNewMessage, logout, load, fetchLogin}) => {
    const { store } = useContext(ReactReduxContext);

    // Current states
    let authToken  = store.getState().authToken.authToken;
    let user       = store.getState().user.user;
    let loading = store.getState().load.loading;
    let fetchedAuthToken = store.getState().authToken.fetchedAuthToken;

    useEffect(() => {
        if (!authToken && fetchedAuthToken === false) {
            fetch('https://chat-application-v8vu.onrender.com/refreshToken', {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Content-Length": 0
                },
                credentials: "include"
            })
                .then(async res => {
                    if (res.ok && res.status === 200) {
                        const data = await res.json();
                        updateToken(data.authToken);
                    } else {
                        updateToken("");
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }

        else if (authToken && user === false) {
            fetchLogin(authToken);
        }
        else if (loading) {
            load();
        }
    })

    return (
        <Router>
            <Routes>
                {loading && < Route path="/" element={<div>loading...</div>} />}
                {(!loading && !user) && < Route path="/" element={<Home updateToken={updateToken} />} />}
                {(!loading && (user.length === 1)) && <Route path="/" element={<Chat authToken={authToken} user={user[0]} logout={logout} submitNewMessage={submitNewMessage} />} />}
                <Route path="*" element={<p>There's nothing here: 404!</p>} />
            </Routes>
        </Router>
    );
}

export default Presentational;
