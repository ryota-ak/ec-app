import React, {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import List from "@material-ui/core/List";
import {makeStyles} from "@material-ui/core/styles";
import {FavoriteListItem} from "../components/Products";
import {GreyButton} from "../components/UIkit";
import {push} from "connected-react-router";
import {getProductsInFavorite} from '../reducks/users/selectors';


const useStyles = makeStyles((theme) => ({
  root: {
      margin: '0 auto',
      maxWidth: 512,
      width: '100%'
  },
}));


const FavoriteList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  const productsInFavorite = getProductsInFavorite(selector);

  const backToTop = useCallback(() => {
      dispatch(push('/'));
  }, []);

  return (
      <section className="c-section-wrapin">
          <h2 className="u-text__headline">お気に入りリスト</h2>
          <List className={classes.root}>
              {productsInFavorite.length > 0 && (
                  productsInFavorite.map(product => <FavoriteListItem product={product} key={product.favoriteId} />)
              )}
          </List>
          <div className="module-spacer--medium" />
          <div className="p-grid__column">
              <GreyButton label={"ショッピングを続ける"} onClick={backToTop} />
          </div>
      </section>
  );


}

export default FavoriteList

