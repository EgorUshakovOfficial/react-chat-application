import { useEffect, useState, useContext } from 'react';
import { Connection } from '../context/socket'; 
import Messages from './Messages';
import Users from './Users';
import ChatHeader from './ChatHeader';
import chat from '../styles/chat.css';

const Chat = ({ user, submitNewMessage, logout }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]); 
    useEffect(() => { 
        const options = {
            "force new connection": true,
            reconnectionAttempts: "Infinity",
            timeout: 10000,
            transports: ["websocket"]
        }

        // New connection 
        const socket = io("http://friends-book1.herokuapp.com/", options);
        setSocket(socket);

        // Active users
        socket.on("user joined", users => {
            setActiveUsers(users); 
        })

        // Disconnected users 
        socket.on("user left", users => {
            setActiveUsers(users);
        })

        // Messages
        socket.on("message", data => {
            setMessages(messages => [...messages, data]); 
        })

        // Clean up
        return () => socket.disconnect();

    }, [])
    return (
        <div id="chat">
            <Users activeUsers={activeUsers} />
            <div id="right-panel">
                <ChatHeader logout={logout} user={user} />
                <Messages socket={socket} messages={messages}/>
            </div>
        </div>
    );
}

export default Chat; 
