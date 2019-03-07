// Реализуйте саги
import { takeEvery, call, put, select, fork } from 'redux-saga/effects';
import {
  fetchPhotosRequest,
  fetchPhotosSuccess,
  fetchPhotosFailure,
  changeSol
} from './actions';
import { getPhotos as fetchPhotos } from './api';
import { getPhotos } from './RoverPhotos';
import path from 'ramda/src/path';
import { getKey } from '../Auth';

function* fetchWatcher() {
  yield takeEvery(fetchPhotosRequest, fetchWorker);
}

function* fetchWorker(action) {
  const { name, sol } = action.payload;
  const photos = yield select(getPhotos);
  const loaded = path([name, `${sol}`, 'isLoaded']);
  const error = path([name, `${sol}`, 'error']);
  const key = yield select(getKey);

  if (!loaded(photos) || error(photos)) {
    try {
      const res = yield call(fetchPhotos, key, name, sol);
      yield put(
        fetchPhotosSuccess({ photos: res.photos, name: name, sol: sol })
      );
    } catch (error) {
      yield put(fetchPhotosFailure({ error: error, name: name, sol: sol }));
    }
  }
}

function* solWorker(action) {
  const rovers = ['curiosity', 'opportunity', 'spirit'];
  const sol = action.payload;
  const loaded = path([`${sol}`, 'isLoaded']);
  const error = path([`${sol}`, 'error']);

  for (let i = 0; i < rovers.length; i++) {
    if (!loaded(rovers[i]) || error(rovers[i])) {
      yield fork(fetchWorker, { payload: { name: rovers[i], sol: sol } });
    }
  }
}

function* solWatcher() {
  yield takeEvery(changeSol, solWorker);
}

function* rootSaga() {
  yield fork(fetchWatcher);
  yield fork(solWatcher);
}

export default rootSaga;
