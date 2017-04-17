import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createReducer  from './reducers/combineReducer';

function configureStore(initialState) {
	const createStoreWithMiddleware = compose(applyMiddleware(thunk));
	return createStoreWithMiddleware(createReducer(), initialState);
}

module.exports = configureStore;
