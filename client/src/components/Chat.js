import { useEffect, useState, useContext } from 'react';
import { Connection } from '../context/socket'; 
import { io } from 'socket.io-client';
import Messages from './Messages';
import Users from './Users';
import ChatHeader from './ChatHeader';
import chat from '../styles/chat.css';

const Chat = ({ user, submitNewMessage, logout }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]); 
    useEffect(() => {
        // New connection 
        const socket = io("https://friends-book1.herokuapp.com", {
            transports: ["websocket", "polling"]
        });
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
