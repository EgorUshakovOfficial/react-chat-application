import { useState} from 'react'; 
import messages from '../styles/messages.css';

const Messages = ({ socket, messages }) => {
    // State
    const [message, setMessage] = useState("");

    // Event handler
    const handleSubmit = e => {
        e.preventDefault();

        if (message) {
            socket.emit("message", { message, id: socket.id });
            setMessage("");
        }
    }

    return (<div id="messages">
        <ul id="messages-display">
            {messages.map((data, i) => {
                if (data.id === socket.id) {
                    return <li className="blue-message" key={i}>{data.message}</li>
                }
                return <li className="gray-message" key={i}>{data.message}</li>
            })}
        </ul>
        <form action="/" method="post" onSubmit={handleSubmit} id="messages-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Aa" id="message" value={message} onChange={e => setMessage(e.target.value)} />
            <button className="btn-primary" type="submit" id="messages-submit">Send</button>
        </form>
    </div>)
}

export default Messages; 