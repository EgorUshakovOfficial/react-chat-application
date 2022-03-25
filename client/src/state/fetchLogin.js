import {
    requestingUser,
    userSuccess,
    userError
} from './actions';

export const fetchLogin = authToken => dispatch => {

    // Requesting user data
    dispatch(requestingUser());

    return fetch('https://friends-book1.herokuapp.com/profile', {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `bearer ${authToken}`,
            credentials: "include"
        },

    })
    .then(res => res.json())
    .then(data => {
        const { user } = data;
        dispatch(userSuccess(user))
     })
    .catch(err => {
        console.log(err);
        dispatch(userError())
     })
}

export default fetchLogin; 
