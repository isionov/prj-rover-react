// Реализуйте редьюсер
import { addKey } from './actions';
import { handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export default handleActions(
  {
    [addKey]: (state, action) => ({
      apiKey: action.payload
    })
  },
  { apiKey: null }
);

export const getIsAuthorized = createSelector(
  [state => state.auth.apiKey],
  apiKey => (apiKey ? true : false)
);

export const getKey = createSelector(
  [state => state.auth],
  auth => auth.apiKey
);
