import {FETCH_USER} from "../actions/types";


export default function(state=null,action) {
    console.log(action);
    switch (action.type) {
        case FETCH_USER:
            return action.payload || false; // to make sure we only return user model, otherwise '' || false
        default:
            return state;
    }
}