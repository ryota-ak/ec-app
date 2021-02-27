import { Badge, IconButton } from '@material-ui/core'
import { Menu, ShoppingCart } from '@material-ui/icons'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import { push } from 'connected-react-router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../../firebase'
import { fetchProductsInCart, fetchProductsInFavorite } from '../../reducks/users/operations'
import { getProductsInCart, getProductsInFavorite, getUserId } from '../../reducks/users/selectors'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { yellow } from '@material-ui/core/colors'
import { SimpleModal } from '../UIkit'


const HeaderMenus = (props) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const userId = getUserId(selector);
  let productsInCart = getProductsInCart(selector);
  let productsInFavorite = getProductsInFavorite(selector);

  //modal用
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const getToCart = () => {
    if(productsInCart.length === 0){
      setText("カート内が空です");
      setOpen(true);
      return;
    }
    dispatch(push('/cart'));
  }

  const getToFavorite = () => {
    if(productsInFavorite.length === 0){
      setText("お気に入りが空です");
      setOpen(true);
      return;
    }
    dispatch(push('/favorite'));
  }

  // Listen products in user's cart
  // storeの状態を更新する
  useEffect(() => {
    const unsubscribe = db.collection('users').doc(userId).collection('cart')
        .onSnapshot(snapshots => {
            snapshots.docChanges().forEach(change => {
                const product = change.doc.data();
                const changeType = change.type;
                // console.log(product, changeType);

                switch (changeType) {
                    case 'added':
                        productsInCart.push(product);
                        break;
                    // case 'modified':
                    //     const index = productsInCart.findIndex(product => product.cartId === change.doc.id)
                    //     productsInCart[index] = product;
                    //     break;
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
  }, [userId]);

  useEffect(() => {
  //  Listen products in user's favorite
    const unsubscribe2 = db.collection('users').doc(userId).collection('favorite')
      .onSnapshot(snapshots => {

        snapshots.docChanges().forEach(change => {
          const product = change.doc.data();
          const changeType = change.type;

          switch (changeType) {
            case 'added':
                productsInFavorite.push(product);
                break;
            case 'modified':
                const index = productsInFavorite.findIndex(product => product.favoriteId === change.doc.id);
                productsInFavorite[index] = product;
                break;
            case 'removed':
                productsInFavorite = productsInFavorite.filter(product => product.favoriteId !== change.doc.id);
                break;
            default:
                break;
          }
        });
        // console.log(productsInFavorite);
        dispatch(fetchProductsInFavorite(productsInFavorite))
      });

      return () => {
        // unsubscribe();
        unsubscribe2();
      }
  }, [userId]);

  return (
    <>
      <IconButton onClick={getToCart} >
        <Badge badgeContent={productsInCart.length} color="secondary">
          <ShoppingCart/>
        </Badge>
      </IconButton>
      <IconButton onClick={getToFavorite} >
        <Badge badgeContent={productsInFavorite.length} color="secondary">
          {(productsInFavorite.length > 0) ? <FavoriteIcon style={{ color: yellow[500] }} /> : <FavoriteBorder />}
        </Badge>
      </IconButton>
      <IconButton onClick={(e) => props.handleDrawerToggle(e)}>
        <Menu/>
      </IconButton>
      <SimpleModal text={text} open={open} setOpen={setOpen} />
    </>
  )
}

export default HeaderMenus

