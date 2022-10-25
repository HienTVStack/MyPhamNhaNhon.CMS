import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "@redux-saga/core";
import { logger } from "redux-logger";
import rootReducer from "./root-reducer";

import { onLoadPost } from "./saga";

const sagaMiddleWare = createSagaMiddleware();
const middleware = [logger, sagaMiddleWare];

const store = createStore(rootReducer, applyMiddleware(...middleware));

sagaMiddleWare.run(onLoadPost);

export default store;
