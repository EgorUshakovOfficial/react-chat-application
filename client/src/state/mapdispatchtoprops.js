import {
    addMessage,
    addLogout,
    addLoading,
    updateAuthToken
} from './actions';

import { fetchLogin } from './fetchLogin';

export const mapDispatchToProps = dispatch => {
    return {
        submitNewMessage: message => {
            dispatch(addMessage(message))
        },
        
        updateToken: authToken => {
            dispatch(updateAuthToken(authToken))
        },

        logout: () => {
            dispatch(addLogout())
        },

        load: () => {
            dispatch(addLoading())
        },

        fetchLogin: authToken => {
            dispatch(fetchLogin(authToken))
        }

    };
}

export default mapDispatchToProps; 


