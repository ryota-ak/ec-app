import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProductCard } from '../components/Products'
import { fetchProducts } from '../reducks/products/operations';
import { getProducts } from '../reducks/products/selectors';

const ProductList = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const products = getProducts(selector);

  const query = selector.router.location.search;
  const gender = /^\?gender=/.test(query) ? query.split('?gender=')[1] : "";
  const category = /^\?category=/.test(query) ? query.split('?category=')[1] : "";

  // const query = window.location.search;
  // const gender = /^\?gender=/.test(query) ? query.split('?gender=')[1] : "";
  // const category = /^\?category=/.test(query) ? query.split('?category=')[1] : "";
  // console.log(query,gender, category);


  useEffect(() => {
    dispatch(fetchProducts(gender, category));
  }, [query]);
  //[query]なしでも動きそう

  return (
    <section className="c-section-wrapin">
      <div className="p-grid__row">
        {(products.length > 0) && (
          products.map(product => (
            <ProductCard
                key={product.id} id={product.id} images={product.images}
                price={product.price} name={product.name}
            />
          ))
        )}
      </div>
    </section>
  )
}

export default ProductList

