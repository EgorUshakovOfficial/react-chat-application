import { combineReducers } from 'redux';

// Default state
const defaultState = {
    authToken: "",
    messages: [],
    loading: true,
    user: false,
    fetchedAuthToken: false
};

// Auth token reducer 
const updateAuthTokenReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "UPDATE_AUTH_TOKEN":
            return Object.assign({}, state, { authToken: action.authToken, fetchedAuthToken:true});
        case "LOGOUT":
            return Object.assign({}, state, {authToken:""})
        default:
            return state; 
    }
}

// User reducer
const userReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "REQUESTING_USER":
            return Object.assign({}, state, { user: []})
        case "USER_SUCCESS":
            return Object.assign({}, state, { user: [action.user]})
        case "USER_FAILURE":
            return Object.assign({}, state, { user: [] })
        case "LOGOUT":
            return Object.assign({}, state, {user: false })
        default:
            return state; 
    }
}

// Message reducer 
const messageReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "ADD_MESSAGE":
            return Object.assign({}, state, { messages: [...state, action.message] });
        default:
            return state; 
    }; 
}

// Loading reducer 
const loadReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "LOADING":
            return Object.assign({}, state, { loading: false })
        default:
            return state;
    }
}

// Logout reducer 

// Root reducer 
export const rootReducer = combineReducers({
    user: userReducer,
    authToken: updateAuthTokenReducer,
    message: messageReducer,
    load: loadReducer
})

export default rootReducer;






