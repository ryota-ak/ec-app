import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
  compose
} from 'redux';
import {connectRouter,routerMiddleware} from 'connected-react-router';
import thunk from 'redux-thunk';
import { ProductsReducer} from '../products/reducers';
import { UsersReducer } from '../users/reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function createStore(history){
  return reduxCreateStore(
    combineReducers({
      products: ProductsReducer,
      router: connectRouter(history),
      users: UsersReducer
    }),
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        thunk
      )
    )
  );
}
