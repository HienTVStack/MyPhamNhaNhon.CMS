import { put, takeLatest } from "redux-saga/effects";
import productApi from "src/api/productApi";
import { loadProductFail, loadProductSuccess } from "./actions";

export function* onLoadProductStart() {
    try {
        const res = yield productApi.getAll();
        yield put(loadProductSuccess(res.products));
    } catch (error) {
        yield put(loadProductFail(error));
    }
}

export function* onLoadProduct() {
    yield takeLatest("LOAD_PRODUCT_START", onLoadProductStart);
}
