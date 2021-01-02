import { Badge, IconButton } from '@material-ui/core'
import { Menu, ShoppingCart } from '@material-ui/icons'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import { push } from 'connected-react-router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../../firebase'
import { fetchProductsInCart } from '../../reducks/users/operations'
import { getProductsInCart, getUserId } from '../../reducks/users/selectors'


const HeaderMenus = (props) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const userId = getUserId(selector);
  let productsInCart = getProductsInCart(selector);

   // Listen products in user's cart
   // storeの状態を更新する
   useEffect(() => {
    const unsubscribe = db.collection('users').doc(userId).collection('cart')
      .onSnapshot(snapshots => {

        snapshots.docChanges().forEach(change => {
          const product = change.doc.data();
          const changeType = change.type;

          switch (changeType) {
            case 'added':
                productsInCart.push(product);
                break;
            case 'modified':
                const index = productsInCart.findIndex(product => product.cartId === change.doc.id);
                productsInCart[index] = product;
                break;
            case 'removed':
                productsInCart = productsInCart.filter(product => product.cartId !== change.doc.id);
                break;
            default:
                break;
          }
        });

        dispatch(fetchProductsInCart(productsInCart))
      });

    return () => unsubscribe()
  }, []);

  return (
    <>
      <IconButton onClick={() => dispatch(push('/cart'))} >
        <Badge badgeContent={productsInCart.length} color="secondary">
          <ShoppingCart/>
        </Badge>
      </IconButton>
      <IconButton>
        <FavoriteBorder/>
      </IconButton>
      <IconButton onClick={(e) => props.handleDrawerToggle(e)}>
        <Menu/>
      </IconButton>
    </>
  )
}

export default HeaderMenus

