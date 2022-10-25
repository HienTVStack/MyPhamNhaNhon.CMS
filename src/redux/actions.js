export const loadPostStart = () => ({
    type: "LOAD_POST_START",
});

export const loadPostSuccess = (posts) => ({
    type: "LOAD_POST_SUCCESS",
    payload: posts,
});

export const loadPostFail = (errors) => ({
    type: "LOAD_POST_FAIL",
    payload: errors,
});

export const removePost = (posts) => ({
    type: "REMOVE_POST",
    payload: posts,
});
