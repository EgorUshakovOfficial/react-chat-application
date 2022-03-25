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

    // Cookie
    let cookieRegex = /(refreshToken=\w+;?)/gi;
    const refreshTokenExist = cookieRegex
        .test(document.cookie);

    useEffect(() => {
        if (refreshTokenExist && !authToken) {
            fetch('https://friends-book1.herokuapp.com/refreshToken', {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Content-Length": 0
                },
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    updateToken(data.authToken);
                })
                .catch(err => {
                    // Do something here...
                })
        }

        else if (refreshTokenExist && authToken && user === false) {
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
                {(!loading && user) && <Route path="/" element={<Chat user={user} logout={logout} submitNewMessage={submitNewMessage} />} />}
                <Route path="*" element={<p>There's nothing here: 404!</p>} />
            </Routes>
        </Router>
    );
}

export default Presentational;
