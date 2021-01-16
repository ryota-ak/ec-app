import { fetchOrdersHistoryAction, fetchProductsInCartAction, fetchProductsInFavoriteAction, signInAction, signOutAction } from "./actions"
import {push} from 'connected-react-router'
import {auth, db, FirebaseTimestamp} from '../../firebase/index'
import { isValidEmailFormat, isValidRequiredInput } from "../../function/common";

const usersRef = db.collection('users');

export const addProductToCart = (addedProduct) => {
  return async (dispatch, getState) => {
      const uid = getState().users.uid;
      const cartRef = usersRef.doc(uid).collection('cart').doc();
      addedProduct['cartId'] = cartRef.id;
      await cartRef.set(addedProduct);
      dispatch(push('/'));
  }
}

export const addProductToFavorite = (addedProduct) => {
  return async (dispatch, getState) => {
      const uid = getState().users.uid;
      const favoriteRef = usersRef.doc(uid).collection('favorite').doc();
      addedProduct['favoriteId'] = favoriteRef.id;
      await favoriteRef.set(addedProduct);
      dispatch(push('/'));
  }
}

export const fetchOrdersHistory = () => {
  return async (dispatch, getState) => {
      const uid = getState().users.uid;
      const list = [];

      usersRef.doc(uid).collection('orders')
          .orderBy('updated_at', "desc").get()
          .then(snapshots => {
              snapshots.forEach(snapshot => {
                  const data = snapshot.data();
                  list.push(data)
              });
              dispatch(fetchOrdersHistoryAction(list))
          })
  }
}

export const fetchProductsInCart = (products) => {
  return async (dispatch) => {
      dispatch(fetchProductsInCartAction(products))
  }
}

export const fetchProductsInFavorite = (products) => {
  return async (dispatch) => {
      dispatch(fetchProductsInFavoriteAction(products))
  }
}

export const listenAuthState = () => {
  return async (dispatch) => {
    return auth.onAuthStateChanged(user => {
      if(user){
        const uid = user.uid;

        //storeを更新
        usersRef.doc(uid).get()
          .then(snapshot => {
            const data = snapshot.data();
            dispatch(signInAction({
              isSignedIn: true,
              role: data.role,
              uid: uid,
              username: data.username
            }))
          })
      }else{
        dispatch(push('/signin'));
      }
    })
  }
}

export const resetPassword = (email) => {
  return async (dispatch) => {
    if(!isValidEmailFormat(email)){
      alert("必須項目が未入力です");
      return;
    } else {
      auth.sendPasswordResetEmail(email)
      .then(() => {
        alert('入力されたアドレスにはパスワードリセット用のメールをお送りしました。');
        dispatch(push('/signin'));
      }).catch(() => {
        alert('登録されていないメールアドレスです。もう一度ご確認ください。');
      })
    }
  }
}

export const signIn = (email, password) => {
  return async (dispatch) => {
    //Validation
    if (!isValidRequiredInput(email, password)) {
      alert('メールアドレスかパスワードが未入力です。');
      return;
  }
  if (!isValidEmailFormat(email)) {
      alert('メールアドレスの形式が不正です。');
      return;
  }

  return auth.signInWithEmailAndPassword(email, password)
    .then(result => {
      const user = result.user;
      if (!user) {
        throw new Error('ユーザーIDを取得できません');
      }

      const uid = user.uid;

      return usersRef.doc(uid).get()
        .then(snapshot => {
          const data = snapshot.data();
          if (!data) {
            throw new Error('ユーザーデータが存在しません');
          }

          dispatch(signInAction({
            isSignedIn: true,
            role: data.role,
            uid: uid,
            username: data.username
          }))

          dispatch(push('/'));
        })
    })
  }
}

export const signUp = (username, email, password, confirmPassword) => {
  return async (dispatch) => {
    // Validations
    if(!isValidRequiredInput(email, password, confirmPassword)) {
      alert('必須項目が未入力です。');
      return;
  }

  if(!isValidEmailFormat(email)) {
      alert('メールアドレスの形式が不正です。もう1度お試しください。')
      return;
  }
  if (password !== confirmPassword) {
      alert('パスワードが一致しません。もう1度お試しください。')
      return;
  }
  if (password.length < 6) {
      alert('パスワードは6文字以上で入力してください。')
      return;
  }

    return auth.createUserWithEmailAndPassword(email, password)
      .then(result => {
        const user = result.user;

        if(user){
          const uid = user.uid;
          const timestamp = FirebaseTimestamp.now();

          const userInitialData = {
            created_at: timestamp,
            email: email,
            role: "customer",
            uid: uid,
            updated_at: timestamp,
            username: username
          }

          usersRef.doc(uid).set(userInitialData)
            .then(() => {
              dispatch(push('/'));
            })
        }
      })
      .catch((error) => {
        alert('アカウント登録に失敗しました。もう1度お試しください。');
        throw new Error(error);
      })
  }
}

export const signOut = () => {
  return async (dispatch) => {
    auth.signOut()
      .then(() => {
      dispatch(signOutAction());
      dispatch(push('/signin'));
    })
  }
}



