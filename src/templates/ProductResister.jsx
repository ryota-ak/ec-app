import React, {useCallback, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ImageArea, SetSizeArea } from '../components/Products'
import { PrimaryButton, SelectBox, TextInput } from '../components/UIkit'
import { db } from '../firebase'
import { saveProduct } from '../reducks/products/operations'

const ProductResister = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState(""),
        [description, setDescription] = useState(""),
        [category, setCategory] = useState(""),
        [categories, setCategories] = useState([]),
        [gender, setGender] = useState(""),
        [images, setImages] = useState([]),
        [price, setPrice] = useState(""),
        [sizes, setSizes] = useState([]);

  const inputName = useCallback((e) => {
    setName(e.target.value);
  }, [setName]);

  const inputDescription = useCallback((e) => {
    setDescription(e.target.value);
  }, [setDescription]);

  const inputPrice = useCallback((e) => {
    setPrice(e.target.value);
  }, [setPrice]);

  // const categories = [
  //   {id: "tops" , name: "トップス"},
  //   {id: "shirts" , name: "シャツ"},
  //   {id: "pants" , name: "パンツ"},
  // ];

  const genders = [
    {id: "all" , name: "すべて"},
    {id: "male" , name: "メンズ"},
    {id: "female" , name: "レディース"},
  ];

  useEffect(() => {
    db.collection('categories')
      .orderBy('order', 'asc')
      .get()
      .then(snapshots => {
        const list = [];
        snapshots.forEach(snapshot => {
          const data = snapshot.data();
          list.push({
            id: data.id,
            name: data.name
          });
        })
        setCategories(list);
      })
  }, [])

  return (
    <section>
      <h2 className="u-text__headline u-text-center">商品の登録・編集</h2>
      <div className="c-section-container">
        <ImageArea images={images} setImages={setImages} />
        <TextInput
          fullWidth={true} label={"商品名"} multiline={false} required={true}
          rows={1} value={name} type={"text"} onChange={inputName}
        />
        <TextInput
          fullWidth={true} label={"商品説明"} multiline={true} required={true}
          rows={5} value={description} type={"text"} onChange={inputDescription}
        />
        <SelectBox
          label={"カテゴリー"} required={true} options={categories} select={setCategory} value={category}
        />
        <SelectBox
          label={"性別"} required={true} options={genders} select={setGender} value={gender}
        />
        <TextInput
          fullWidth={true} label={"価格"} multiline={false} required={true}
          rows={1} value={price} type={"number"} onChange={inputPrice}
        />
        <div className="module-spacer--small"></div>
        <SetSizeArea sizes={sizes} setSizes={setSizes}/>
        <div className="module-spacer--small"></div>
        <div className="center">
          <PrimaryButton
            label={"商品情報を保存"}
            onClick={() => dispatch(saveProduct(name, description, category, gender, price, images, sizes))}
          />
        </div>
      </div>
    </section>
  )
}

export default ProductResister

