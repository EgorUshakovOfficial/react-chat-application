// Action creators
export const addMessage = message => ({ type: "ADD_MESSAGE", message });
export const updateAuthToken = authToken => ({ type: "UPDATE_AUTH_TOKEN", authToken });
export const addLogin = () => ({ type: "LOGIN" });
export const addLogout = () => ({ type: "LOGOUT", authToken: "" });
export const requestingUser = () => ({ type: "REQUESTING_USER"});
export const userSuccess = user => ({ type: "USER_SUCCESS", user });
export const userError = () => ({ type: "USER_FAILURE", user: [] });
export const addLoading = () => ({ type: "LOADING" }); 


export default {
    addMessage,
    updateAuthToken,
    addLogin,
    addLogout,
    requestingUser,
    userSuccess,
    userError,
    addLoading
}
