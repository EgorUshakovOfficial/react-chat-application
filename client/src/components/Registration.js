import { useContext, useState } from 'react';
import { useNavigate} from 'react-router-dom';
const Registration = (props) => {
    // States
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const handleRegistration = e => {
        e.preventDefault();
        setError("");
        fetch('https://chat-application-v8vu.onrender.com/register', {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                firstName,
                lastName,
                registerEmail,
                registerUsername,
                registerPassword
            }),
            credentials:"include"
        })
         .then(res => res.json())
         .then(data => {
             const { message } = data;
             setSuccess(message);
          })
         .catch(err => {
                setError(err);
            })
    }

    return (
        <form id="register-form" className="modal fade" action="/register" method="post" onSubmit={handleRegistration}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title">Registation</h2>
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>
                    {success
                        &&
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            <strong>{success}</strong>
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setSuccess("")}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    }
                    {error
                        &&
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <strong>{error}</strong>
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setError("")}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    }
                    <div className="modal-body">
                        <div className="name row">
                            <div className="col">
                                <input id="first-name" className="form-control" name="firstName" placeholder="Enter first name" onChange={e => setFirstName(e.target.value)}required />
                            </div>
                            <div className="col">
                                <input id="last-name" className="form-control" name="lastName" placeholder="Enter last name" onChange={e => setLastName(e.target.value)}required />
                            </div>
                        </div>
                        <div className="form-group">
                            <input type="email" id="registerEmail" className="form-control" name="registerEmail" placeholder="Enter email" onChange={e => setRegisterEmail(e.target.value)} required />
                            <input id="username" name="registerUsername" className="form-control" placeholder="User name" onChange={e => setRegisterUsername(e.target.value)}required />
                            <input type="password" name="registerPassword" className="form-control" placeholder="Password" onChange={e => setRegisterPassword(e.target.value)}required />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-success">Sign Up</button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default Registration;