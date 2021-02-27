import { Modal } from "@material-ui/core"
import {makeStyles} from "@material-ui/styles"
import HTMLReactParser from 'html-react-parser'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ImageSwiper, SizeTable } from "../components/Products"
import { db, FirebaseTimestamp } from '../firebase'
import { addProductToCart, addProductToFavorite } from "../reducks/users/operations"

// function getModalStyle() {
//   const top = 50;
//   const left = 50;

//   return {
//     top: `${top}%`,
//     left: `${left}%`,
//     transform: `translate(-${top}%, -${left}%)`,
//   };
// }

const useStyles = makeStyles((theme) => ({
  sliderBox: {
      [theme.breakpoints.down('sm')]: {
          margin: '0 auto 24px',
          height: 320,
          width: 320
      },
      [theme.breakpoints.up('sm')]: {
          margin: '0 auto',
          height: 400,
          width: 400
      },
  },
  detail: {
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto 16px',
      height: 'auto',
      width: 320
    },
    [theme.breakpoints.up('sm')]: {
      margin: '0 auto',
      height: 'auto',
      width: 400
    }
  },
  price: {
    fontSize: 36
  },
  // modal: {
  //   outline: "none",
  //   position: "absolute",
  //   width: 400,
  //   borderRadius: 10,
  //   backgroundColor: "white",
  //   boxShadow: theme.shadows[5],
  //   padding: theme.spacing(10),
  // },
  // text:{
  //   fontSize:24,
  //   // fontWeight:"bold"
  // }
}));

const returnCodeToBr = (text) => {
  if (text === "") {
      return text;
  } else {
      return HTMLReactParser(text.replace(/\r?\n/g, '<br/>'));
  }
};

const ProductDetail = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  // const selector = useSelector((state) => state);
  // const path = selector.router.location.pathname;
  // const path = window.location.pathname;
  // const id = path.split('/product/')[1];
  // console.log(id);
  // console.log(props.match);
  const id = props.match.params.id;

  const [product, setProduct] = useState(null);

  //modal用state
  // const [openModal, setOpenModal] = useState(false);
  // const [text, setText] = useState("");

  useEffect(() => {
    db.collection('products').doc(id).get()
    .then(doc => {
      const data = doc.data();
      setProduct(data);
    })
  }, []);

  const addProduct = useCallback((selectedSize) => {
    const timestamp = FirebaseTimestamp.now();
    dispatch(addProductToCart({
      added_at: timestamp,
      description: product.description,
      gender: product.gender,
      images: product.images,
      name: product.name,
      price: product.price,
      productId: product.id,
      quantity: 1,
      size: selectedSize
  }))
  }, [product]);

  const addFavorite = useCallback((selectedSize) => {
    const timestamp = FirebaseTimestamp.now();
    dispatch(addProductToFavorite({
      added_at: timestamp,
      description: product.description,
      gender: product.gender,
      images: product.images,
      name: product.name,
      price: product.price,
      productId: product.id,
      quantity: 1,
      size: selectedSize
    }))
  }, [product]);

  // /product/editの時はこのコンポーネントは表示しない
  if(id === 'edit'){
    return null;
  }

  return (
    <section className="c-section-wrapin">
      {product && (
        <div className="p-grid__row">
          <div className={classes.sliderBox}>
            <ImageSwiper images={product.images}/>
          </div>
          <div className={classes.detail}>
            <h2 className="u-text__headline">{product.name}</h2>
            <p className={classes.price}>¥{product.price.toLocaleString()}</p>
            <div className="module-spacer--small" />
            <SizeTable addProduct={addProduct} sizes={product.sizes} addFavorite={addFavorite} />
            <div className="module-spacer--small" />
            <p>{returnCodeToBr(product.description)}</p>
            {/* <p>{product.description}</p> */}
          </div>
        </div>
      )}

      {/* <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div style={getModalStyle()} className={classes.modal}>
          <h1 className={classes.text}>{text}</h1>
        </div>
      </Modal> */}

    </section>
  )


}

export default ProductDetail

