import { combineReducers } from "redux";

import appReducer from "./reducers";

const rootReducer = combineReducers({
    posts: appReducer,
});

export default rootReducer;
