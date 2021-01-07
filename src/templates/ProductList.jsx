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
  //count per page
  const perPage = 6;

  //pagination
  const handleChange = (event, value) => {
    if(/^\?gender=/.test(query)){
      dispatch(push(`/?gender=${gender}&p=${value}`));
    }else if(/^\?category=/.test(query)){
      dispatch(push(`/?category=${category}&p=${value}`));
    }else if(/^\?search=/.test(query)){
      dispatch(push(`/?search=${keyword}&p=${value}`));
    }else{
      dispatch(push(`/?p=${value}`));
    }
  };

  //get query
  const query = selector.router.location.search;

  //page query
  let page = /^\?p=/.test(query) ? parseInt(query.split('?p=')[1], 10) : 1;

  //gender query
  let gender = /^\?gender=/.test(query) ? query.split('?gender=')[1] : "";
  if(/&p=/.test(gender)){
    page = parseInt(gender.split('&p=')[1],10);
    gender = gender.split('&p=')[0];
  }

  //category query
  let category = /^\?category=/.test(query) ? query.split('?category=')[1] : "";
  if(/&p=/.test(category)){
    page = parseInt(category.split('&p=')[1],10);
    category = category.split('&p=')[0];
  }

  //keyword query
  let keyword = /^\?search=/.test(query) ? query.split('?search=')[1] : "";
  if(/&p=/.test(keyword)){
    page = parseInt(keyword.split('&p=')[1],10);
    keyword = keyword.split('&p=')[0];
  }


  const productCards = products.map(product => (
      <ProductCard
          key={product.id} id={product.id} images={product.images}
          price={product.price} name={product.name}
      />
  ));
  // console.log(products);

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

