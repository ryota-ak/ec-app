import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware
} from 'redux';
import {connectRouter,routerMiddleware} from 'connected-react-router';
// import { ProductsReducer} from '../products/reducer';
import { UsersReducer } from '../users/reducers';

export default function createStore(history){
  return reduxCreateStore(
    combineReducers({
      router: connectRouter(history),
      // products: ProductsReducer,
      users: UsersReducer
    }),
    applyMiddleware(
      routerMiddleware(history)
    )
  );
}
