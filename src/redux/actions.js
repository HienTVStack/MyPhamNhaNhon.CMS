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
