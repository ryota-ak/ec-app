import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProductCard } from '../components/Products'
import { fetchProducts } from '../reducks/products/operations';
import { getProducts } from '../reducks/products/selectors';
import { makeStyles } from '@material-ui/core/styles'
import Pagination from '@material-ui/lab/Pagination'
import { push } from 'connected-react-router';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
      '& > *': {
        justifyContent: 'center'
      }
    },
  },
}));

const ProductList = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const products = getProducts(selector);
  const classes = useStyles();

  //pagination
  const handleChange = (event, value) => {
    dispatch(push(`/?p=${value}`))
  };
  const perPage = 6;

  const query = selector.router.location.search;
  const gender = /^\?gender=/.test(query) ? query.split('?gender=')[1] : "";
  const category = /^\?category=/.test(query) ? query.split('?category=')[1] : "";
  const keyword = /^\?search=/.test(query) ? query.split('?search=')[1] : "";
  const page = /^\?p=/.test(query) ? parseInt(query.split('?p=')[1], 10) : 1;


  const productCards = products.map(product => (
      <ProductCard
          key={product.id} id={product.id} images={product.images}
          price={product.price} name={product.name}
      />
  ));

  useEffect(() => {
    dispatch(fetchProducts(gender, category, keyword));
  }, [query]);
  //[query]なしでも動きそう

  return (
    <section className="c-section-wrapin">
      <div className="p-grid__row">
        {productCards.slice(perPage * (page - 1), perPage * page)}
      </div>
      <div className={classes.root}>
        <Pagination
          count={Math.ceil(products.length/perPage)}
          page={page}
          onChange={handleChange}
          variant="outlined"
          color="primary" />
      </div>
    </section>
  )
}

export default ProductList

