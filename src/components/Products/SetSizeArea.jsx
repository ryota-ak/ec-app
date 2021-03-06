import React, { useEffect, useState } from 'react'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import { IconButton, makeStyles, Modal, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { TextInput } from '../UIkit'
import { theme } from '../../assets/theme'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles({
  checkIcon: {
    float: 'right'
  },
  iconCell: {
    padding:0,
    height: 48,
    width: 48
  },
  modal: {
    outline: "none",
    position: "absolute",
    width: 400,
    borderRadius: 10,
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
  },
  text:{
    fontSize:24,
    // fontWeight:"bold"
  }
})

const SetSizeArea = (props) => {
  const classes = useStyles();

  //modal用state
  const [openModal, setOpenModal] = useState(false);
  const [text, setText] = useState("");

  const [index, setIndex] = useState(0),//sizestableのindex
        [size, setSize] = useState(""),//入力フォーム
        [quantity, setQuantity] = useState(0);//入力フォーム

  // const sizesCategory = ["XS","S","M","L","XL","XXL"];
  const [sizesCategory,setSizesCategory] = useState([]);
  // const [sizesCategory,setSizesCategory] = useState(new Set());

  const inputSize = (e) => {
    setSize(e.target.value);
  };

  const inputQuantity = (e) => {
    setQuantity(e.target.value);
  };

  const addSize = (index, size, quantity) => {
    if(size === "" || quantity === 0){
      // Required input is blank
      //modal
      setOpenModal(true);
      setText('必須事項を入力してください');

      return;
    } else {
      //サイズを大文字に
      size = size.toUpperCase();
      //先頭0削除,小数点は切り捨て
      quantity = Math.floor(quantity);

      if(index === props.sizes.length){
        //newSize

        //サイズの重複をチェック
        if(sizesCategory.includes(size)){
          // modal
          setOpenModal(true);
          setText('サイズが重複しています');
          return;
        }

        props.setSizes(prevState => [...prevState, {size: size, quantity: quantity}]);
        setSizesCategory(prevState => [...prevState, size]);
        // setIndex(index + 1);
      }else{
        //editSizes

        //edit中のsize以外のsizeを抽出
        const newArray = sizesCategory.filter((item) => item !== props.sizes[index].size);

        // //サイズの重複をチェック
        if(newArray.includes(size)){
          // modal
          setOpenModal(true);
          setText('サイズが重複しています');
          return;
        }

        const newSizes = props.sizes;
        newSizes[index] = {size: size, quantity: quantity};
        props.setSizes(newSizes);
        setIndex(newSizes.length);
      }
      setSize("");
      setQuantity(0);
    }
  };

  const editSize = (index, size, quantity) => {
    setIndex(index);
    setSize(size);
    setQuantity(quantity);
    //一旦sizesCategoryからsizeを削除
    // const tmpArray = sizesCategory.filter(value => value !== size)
    // setSizesCategory(tmpArray);
    // console.log(tmpArray);
  };

  const deleteSize = (deleteIndex, size) => {
    const newSizes = props.sizes.filter((item, index) => index !== deleteIndex);
    props.setSizes(newSizes);

    //サイズの種類の配列を更新["S","M",...]
    const tmpArray = sizesCategory.filter(value => value !== size)
    setSizesCategory(tmpArray);
  }

  useEffect(() => {
    setIndex(props.sizes.length);

    //サイズの種類の配列を作成["S","M",...]
    const tmpArray = [];
    props.sizes.forEach(sizeItem => {
    tmpArray.push(sizeItem.size);
    });
    setSizesCategory(tmpArray);
    // console.log(tmpArray);

  }, [props.sizes.length]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>サイズ</TableCell>
              <TableCell>数量</TableCell>
              <TableCell className={classes.iconCell}/>
              <TableCell className={classes.iconCell}/>
            </TableRow>
          </TableHead>
          <TableBody>
            {(props.sizes.length > 0) && (
              props.sizes.map((item, index) => (
                <TableRow key={index.toString()}>
                  <TableCell component="th" scope="row">{item.size}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className={classes.iconCell}>
                      <IconButton className={classes.iconCell} onClick={() => {editSize(index, item.size, item.quantity)}}>
                          <EditIcon />
                      </IconButton>
                  </TableCell>
                  <TableCell className={classes.iconCell}>
                      <IconButton className={classes.iconCell} onClick={() => deleteSize(index, item.size)}>
                          <DeleteIcon />
                      </IconButton>
                  </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <div>
          <TextInput
              fullWidth={false} label={"サイズ"} multiline={false} required={true}
              onChange={inputSize} rows={1} value={size} type={"text"}
          />
          <TextInput
              fullWidth={false} label={"数量"} multiline={false} required={true}
              onChange={inputQuantity} rows={1} value={quantity} type={"number"}
          />
        </div>
        <IconButton className={classes.checkIcon}  onClick={() => addSize(index, size, quantity)}>
          <CheckCircleIcon />
        </IconButton>
      </TableContainer>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div style={getModalStyle()} className={classes.modal}>
          <h1 className={classes.text}>{text}</h1>
        </div>
      </Modal>

    </div>
  )
}

export default SetSizeArea

