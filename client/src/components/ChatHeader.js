import chatheader from '../styles/chatheader.css';

const ChatHeader = ({ logout, user}) => {
    const handleLogout = () => {
        fetch('http://localhost:3001/logout', {
            method: "POST",
            headers: {
                'Content-type': "application/json",
                'Control-Length': 0
            },
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            // Disconnect socket when signing out 
            logout();
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <div id="chat-header">
            <div id="chat-header-name">
                {user.firstName} {user.lastName}
            </div>
            <div id="chat-header-leave" >
                <button onClick={handleLogout}>Sign out</button>
            </div>
        </div>
    );
}

export default ChatHeader
