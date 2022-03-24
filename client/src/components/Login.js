import { useState } from 'react';
import { Link } from 'react-router-dom'; 

const Login = ({ updateToken }) => {
    // State 
    const [error, setError] = useState(""); 
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    // Submit handler
    const handleLogin = e => {
        e.preventDefault();

        // Header options
        const headers = {
            "Content-type": "application/json"
        }

        fetch('http://localhost:3001/login', {
            method: "POST",
            headers,
            body: JSON.stringify({
                email: loginEmail,
                password: loginPassword
            }),
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                const {authToken} = data; 
                if (authToken === "") {
                    setError("Wrong user name or password. Try again or click Forgot Password? to reset password")
                }
                else {
                    const { authToken } = data; 
                    updateToken(authToken);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    return (
        <form id="login-form" action="/login" method="post" className="container" onSubmit={handleLogin}>
            {error
                &&
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>{error}</strong>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setError("")}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            }
            <div className="form-group">
                <input type="email" className="form-control" id="loginEmail" name="loginEmail" placeholder="Email" onChange={e => setLoginEmail(e.target.value)} required/>
                <input type="password" className="form-control" id="loginPassword" name="loginPassword" placeholder="Password" onChange={e => setLoginPassword(e.target.value)} required/>
            </div>
            <button className="btn btn-primary btn-block" type="submit" id="submit">Log In</button>
            <div className="text-center links-wrapper">
                <a href="#" id="forget-password">Forgot Password?</a>
                <hr />
                <button type="button" id="create-account" className="btn btn-success" data-toggle="modal" data-target="#register-form" >
                    Create new account
                </button>
            </div>
        </form>
     );
}
export default Login; 
