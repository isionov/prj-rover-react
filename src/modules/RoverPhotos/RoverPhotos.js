// Реализуйте редьюсер
// Файл с тестами RoverPhotos.test.js поможет вам в этом

import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import {
  changeSol,
  fetchPhotosRequest,
  fetchPhotosSuccess,
  fetchPhotosFailure
} from './actions';
import { createSelector } from 'reselect';
import path from 'ramda/src/path';

const sol = handleActions(
  {
    [changeSol]: (state, action) => ({ ...state, current: action.payload })
  },
  { current: 1, min: 1, max: 100 }
);

const photos = handleActions(
  {
    [fetchPhotosRequest]: (state, action) => {
      const { name, sol } = action.payload;
      const rover = state[name];
      return {
        ...state,
        [name]: {
          ...rover,
          [sol]: { isLoading: true, isLoaded: false, photos: [] }
        }
      };
    },
    [fetchPhotosSuccess]: (state, action) => {
      const { name, sol, photos } = action.payload;
      const rover = state[name];
      return {
        ...state,
        [name]: {
          ...rover,
          [sol]: {
            isLoading: false,
            isLoaded: true,
            photos: photos
          }
        }
      };
    },
    [fetchPhotosFailure]: (state, action) => {
      const { name, sol, error } = action.payload;
      const rover = state[name];
      return {
        ...state,
        [name]: {
          ...rover,
          [sol]: {
            isLoading: false,
            isLoaded: true,
            error: error
          }
        }
      };
    }
  },
  {}
);

export default combineReducers({ sol, photos });

export const getSol = createSelector(
  [state => state.roverPhotos.sol],
  sol => sol
);
export const getPhotos = createSelector(
  [state => state.roverPhotos.photos],
  photos => photos
);

export const getErrorCurry = state => rover => sol =>
  path([rover, `${sol}`, 'error']);
export const getIsLoadedCurry = state => rover => sol =>
  path([rover, `${sol}`, 'isLoaded']);
