import React, { useCallback } from 'react'
import IconButton from '@material-ui/core/IconButton'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate'
import { makeStyles } from '@material-ui/styles'
import { storage } from '../../firebase'
import ImagePreview from './ImagePreview'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles({
  icon: {
    height: 48,
    width: 48
  }
})

const ImageArea = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const deleteImage = useCallback(async (id) => {
    const ret = window.confirm('この画像を削除しますか？')
    if (!ret) {
        return;
    } else {
        const newImages = props.images.filter(image => image.id !== id)
        props.setImages(newImages);
        return storage.ref('images').child(id).delete()
    }
  }, [props.images])

  const uploadImage = useCallback((event) => {
    // dispatch(showLoadingAction("uploading..."))
    const file = event.target.files;
    let blob = new Blob(file, { type: "image/jpeg" });

    // Generate random 16 digits strings
    const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N=16;
    const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n)=>S[n%S.length]).join('')

    const uploadRef = storage.ref('images').child(fileName);
    const uploadTask = uploadRef.put(blob);

    uploadTask.then(() => {
        // Handle successful uploads on complete
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            const newImage = {id: fileName, path: downloadURL};
            props.setImages((prevState => [...prevState, newImage]))
        });
    })
  }, [props.setImages])

  return (
    <div>
      <div className="p-grid__list-images">
        {(props.images.length) > 0 && (
          props.images.map(image => <ImagePreview delete={deleteImage} id={image.id} path={image.path} key={image.id} />)
        )}
      </div>
      <div className="u-text-right">
        <span>商品画像を登録する</span>
        <IconButton className={classes.icon}>
          <label>
            <AddPhotoAlternateIcon />
            <input className="u-display-none" type="file" id="image" onChange={uploadImage}/>
          </label>
        </IconButton>
      </div>
    </div>
  )
}

export default ImageArea

