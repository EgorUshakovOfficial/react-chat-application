import { rootReducer as reducer } from './reducers.js';
import { createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

// Create store 
export const store = createStore(reducer, applyMiddleware(thunk));


export default store; 

