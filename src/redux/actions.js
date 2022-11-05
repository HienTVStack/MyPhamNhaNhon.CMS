export const loadCategory = (data) => ({
    type: "LOAD_CATEGORY",
    payload: data,
});
export const loadTag = (data) => ({
    type: "LOAD_TAG",
    payload: data,
});
export const addTag = (data) => ({
    type: "ADD_TAG",
    payload: data,
});
// Product actions
export const loadProductStart = () => ({
    type: "LOAD_PRODUCT_START",
});

export const loadProductSuccess = (products) => ({
    type: "LOAD_PRODUCT_SUCCESS",
    payload: products,
});

export const loadProductFail = (errors) => ({
    type: "LOAD_PRODUCT_FAIL",
    payload: errors,
});
//
export const loadProduct = (data) => ({
    type: "LOAD_PRODUCT",
    payload: data,
});

export const addProduct = (data) => ({
    type: "ADD_PRODUCT",
    payload: data,
});

export const loadProductTrash = (data) => ({
    type: "LOAD_PRODUCT_TRASH",
    payload: data,
});

export const addProductTrash = (data) => ({
    type: "ADD_PRODUCT_TRASH",
    payload: data,
});

export const removeProduct = (id) => ({
    type: "REMOVE_PRODUCT",
    payload: id,
});

// Saga
export const removeProductItemStart = () => ({
    type: "REMOVE_PRODUCT_START",
});

export const removerProductItemSuccess = (id) => ({
    type: "REMOVE_PRODUCT_SUCCESS",
    payload: id,
});

export const removeProductItemFail = (errors) => ({
    type: "REMOVE_PRODUCT_FAIL",
    payload: errors,
});
