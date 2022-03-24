const Registration = (props) => {
    return (
        <form id="register-form" action="/register" method="post">
            <div className="name">
                <input id="first-name" name="firstName" placeholder="Enter first name" required/>
                <input id="last-name" name="lastName" placeholder="Enter last name" required />
            </div>
            <input type="email" id="email" name="email" placeholder="Enter email" required />
            <input id="username" name="username" placeholder="User name" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default Registration; 