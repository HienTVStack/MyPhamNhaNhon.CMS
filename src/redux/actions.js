export const setCategories = (data) => ({
    type: "LOAD_CATEGORY",
    payload: data,
});
export const setTags = (data) => ({
    type: "LOAD_TAG",
    payload: data,
});
export const addTag = (data) => ({
    type: "ADD_TAG",
    payload: data,
});
