const initialState = {
    categoryList: [],
    tagList: [],
    user: {},
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOAD_CATEGORY": {
            return {
                ...state,
                categoryList: action.payload,
            };
        }
        case "LOAD_TAG": {
            return {
                ...state,
                tagList: action.payload,
            };
        }
        case "ADD_TAG":
            return [...state, { tagList: action.payload }];
        default:
            return state;
    }
};

export default appReducer;
