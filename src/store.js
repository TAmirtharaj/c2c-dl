import { createStore } from "redux";

import rootReducer from "./service/reducers";

const initialState = {};

const store = createStore(rootReducer, initialState);

export default store;
