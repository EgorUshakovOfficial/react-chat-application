import Login from './Login';
import Registration from './Registration'; 
import { useState, useEffect } from 'react';
import '../styles/Home.css';

const Home = ({ updateToken}) => {
    const [error, setError] = useState("");  
    return (
        <div id="home">
            <h1 style={{ textAlign: "center", fontWeight: 600 }}>FriendsBook</h1>
            <p style={{ textAlign: "center" }}>Connect with friends and the world around you on Friendsbook</p>
            <Login error={error} updateToken={updateToken}/>
            <Registration />
        </div>); 
}

export default Home;
