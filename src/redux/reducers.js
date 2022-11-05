const initialState = {
    categoryList: [],
    tagList: [],
    productList: [],
    productTrash: [],
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
        // Product
        case "LOAD_PRODUCT_START":
            return {
                ...state,
            };
        case "LOAD_PRODUCT_SUCCESS":
            return {
                ...state,
                productList: action.payload,
            };
        case "LOAD_PRODUCT_FAIL":
            return {
                ...state,
                productList: [],
            };
        //
        case "REMOVE_PRODUCT_START":
            return {
                ...state,
            };
        case "REMOVE_PRODUCT_SUCCESS":
            return {
                ...state,
                productList: [...state.productList.filter((product) => product.id !== action.payload)],
            };
        //
        case "LOAD_PRODUCT":
            return {
                ...state,
                productList: action.payload,
            };
        case "ADD_PRODUCT":
            return {
                ...state,
                productList: [...state.productList, action.payload],
            };
        // Product trash
        case "LOAD_PRODUCT_TRASH":
            return {
                ...state,
                productTrash: action.payload,
            };
        case "ADD_PRODUCT_TRASH":
            return {
                ...state,
                productTrash: [...state.productTrash, action.payload],
            };
        case "REMOVE_PRODUCT":
            return {
                // ...state,
                productList: state.productList.filter((product) => product.id !== action.payload.id),
                productTrash: [...state.productTrash, action.payload],
            };

        default:
            return state;
    }
};

export default appReducer;
