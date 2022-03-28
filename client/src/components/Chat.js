import { useEffect, useState, useContext } from 'react';
import { Connection } from '../context/socket'; 
import Messages from './Messages';
import Users from './Users';
import ChatHeader from './ChatHeader';
import chat from '../styles/chat.css';

const Chat = ({ user, submitNewMessage, logout }) => {
    //let [socket, setSocket] = useState(null);
    //const [messages, setMessages] = useState([]);
    //const [activeUsers, setActiveUsers] = useState([]);
    //let socket = socketIo.connect('https://friends-book1.herokuapp.com', {
    //    withCredentials: true,
    //    reconnectionAttempts: "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
    //    timeout: 10000, //before connect_error and connect_timeout are emitted.
    //    transports: ['websocket']
    //});

    //socket.on('connect', () => console.log("User connected to the server..."))
    /*console.log("executed this time....")*/
    //useEffect(() => { 
    //    // New connection 
    //    let socket = io();

    //    //setSocket(socket)

    //    //// Active users
    //    //socket.on("user joined", users => {
    //    //    setActiveUsers(users); 
    //    //})

    //    //// Disconnected users 
    //    //socket.on("user left", users => {
    //    //    setActiveUsers(users);
    //    //})

    //    //// Messages
    //    //socket.on("message", data => {
    //    //    setMessages(messages => [...messages, data]); 
    //    //})

    //    // Clean up
    //   /* return () => socket.disconnect();*/

    //}, [])
    return (
        <div id="chat">
            {/*<Users activeUsers={activeUsers} />*/}
            {/*<div id="right-panel">*/}
            {/*    <ChatHeader logout={logout} user={user} />*/}
            {/*    <Messages socket={socket} messages={messages}/>*/}
            {/*</div>*/}
        </div>
    );
}

export default Chat; 
