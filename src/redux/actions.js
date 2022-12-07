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

export const setUser = (data) => ({
    type: "SET_USER",
    payload: data,
});
export const setSupplier = (data) => ({
    type: "SET_SUPPLIER",
    payload: data,
});

export const setProduct = (data) => ({
    type: "SET_PRODUCT",
    payload: data,
});
