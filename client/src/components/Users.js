import { useState } from 'react'; 
import users from '../styles/users.css'
const Users = ({ activeUsers }) => {
    const [search, setSearch] = useState("");

    const handleChange = e => {
        setSearch(e.target.value);

    }

    return (
        <div id="left-panel">
            <div id="user-search-div">
                <input type="text" id="user-search-bar" placeholder="Search Chat" value={search} onChange={handleChange} />
             </div>
            <div id="users">
                {activeUsers.map(user => {
                    const { firstName, lastName } = user; 
                    return (
                        <div className="user">
                            <a href="#">
                                <div className="user-profile-pic">
                                    <img src="https://cdn4.vectorstock.com/i/thumb-large/28/63/profile-placeholder-image-gray-silhouette-vector-21542863.jpg" placeholder="Picture of user" />
                                </div>
                                <div className="user-info">
                                    <div className="user-name">{firstName} {lastName}</div>
                                </div>
                            </a>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Users;
