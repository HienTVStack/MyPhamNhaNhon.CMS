import { takeLatest, put } from "redux-saga/effects";
import { loadPostFail, loadPostSuccess } from "./actions";
import userApi from "../api/userApi";

export function* onLoadPostStart() {
    try {
        const res = yield userApi.getAll();
        yield put(loadPostSuccess(res));
    } catch (err) {
        yield put(loadPostFail(err));
    }
}

export function* onLoadPost() {
    yield takeLatest("LOAD_POST_START", onLoadPostStart);
}
