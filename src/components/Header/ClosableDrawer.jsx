import React, { useEffect, useState } from 'react'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import SerchIcon from '@material-ui/icons/Search'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import HistoryIcon from '@material-ui/icons/History'
import PesonIcon from '@material-ui/icons/Person'
import ExitToIcon from '@material-ui/icons/ExitToApp'
import { TextInput } from '../UIkit'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import { signOut } from '../../reducks/users/operations'
import { db } from '../../firebase'
import { Paper } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.down('sm')]: {
      // flexShrink: 0,
      width: 256
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 256
  },
  serchField: {
    alignItems: 'center',
    display: 'flex',
    marginLeft: 32

  }
}));

const ClosableDrawer = (props) => {
  const classes = useStyles();
  const {container} = props;
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");

  const inputKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const logout = (e) => {
    dispatch(signOut());
    props.onClose(e);
  }

  const selectMenu = (e, path) => {
    dispatch(push(path));
    props.onClose(e);
  }

  const searchKeyword = (e) => {
    e.preventDefault();
    selectMenu(e, `/?search=${keyword}`);
    setKeyword('');
  }

  // const [filters, setFilters] = useState([
  //   {func: selectMenu, label: "すべて", id: "all", value: "/"},
  //   {func: selectMenu, label: "メンズ", id: "male", value: "/?gender=male"},
  //   {func: selectMenu, label: "レディース", id: "female", value: "/?gender=female"},
  // ]);

  // const menus = [
  //   {func: selectMenu, label: "商品登録", icon: <AddCircleIcon />, id: "register", value: "/product/edit"},
  //   {func: selectMenu, label: "注文履歴", icon: <HistoryIcon />, id: "history", value: "/order/history"},
  //   {func: selectMenu, label: "プロフィール", icon: <PesonIcon />, id: "profile", value: "/user/mypage"}
  // ];

  const [filters, setFilters] = useState([
    {label: "すべて", id: "all", value: "/"},
    {label: "メンズ", id: "male", value: "/?gender=male"},
    {label: "レディース", id: "female", value: "/?gender=female"},
  ]);

  const menus = [
    {label: "商品登録", icon: <AddCircleIcon />, id: "register", value: "/product/edit"},
    {label: "注文履歴", icon: <HistoryIcon />, id: "history", value: "/order/history"},
    {label: "プロフィール", icon: <PesonIcon />, id: "profile", value: "/user/mypage"}
  ];

  useEffect(() => {
    db.collection('categories')
      .orderBy('order', 'asc')
      .get()
      .then(snapshots => {
        const list = [];
        snapshots.forEach(snapshot => {
          const category = snapshot.data();
          // list.push({func: selectMenu, label: category.name, id: category.id, value: `/?category=${category.id}`});
          list.push({label: category.name, id: category.id, value: `/?category=${category.id}`});
        })
        setFilters(prevState => [...prevState, ...list])
      })
  }, []);

  return (
    <nav className={classes.drawer}>
      <Drawer
        container={container}
        variant="temporary"
        anchor="right"
        open={props.open}
        onClose={(e) => props.onClose(e)}
        classes={{paper: classes.drawerPaper}}
        ModalProps={{keepMounted: true}}
        onKeyDown={(e) => props.onClose(e)}
        >
        {/* <div
          // onClose={(e) => props.onClose(e)}
          // onKeyDown={(e) => props.onClose(e)}
        > */}
          <Paper className={classes.serchField} component="form" onSubmit={searchKeyword}>
            <TextInput
              fullWidth={false} label={"キーワードを入力"} multiline={false} required={false} rows={1} value={keyword} type={"text"} onChange={inputKeyword} />
            <IconButton onClick={searchKeyword} type="submit" >
              <SerchIcon />
            </IconButton>
          </Paper>
          <Divider />
          <List onKeyDown={(e) => props.onClose(e)} >
            {menus.map( menu => (
              // <ListItem button key={menu.id} onClick={(e)=>menu.func(e, menu.value)}>
              <ListItem button key={menu.id} onClick={(e)=>selectMenu(e, menu.value)}>
                <ListItemIcon>
                  {menu.icon}
                </ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItem>
            ))}
            <ListItem button key="logout" onClick={logout}>
              <ListItemIcon>
                <ExitToIcon/>
              </ListItemIcon>
              <ListItemText primary={"ログアウト"}/>
            </ListItem>
          </List>
          <Divider/>
          <List>
            {filters.map(filter => (
              // <ListItem button key={filter.id} onClick={(e) => filter.func(e, filter.value)}>
              <ListItem button key={filter.id} onClick={(e) => selectMenu(e, filter.value)}>
                <ListItemText primary={filter.label} />
              </ListItem>
            ))}
          </List>
        {/* </div> */}
      </Drawer>
    </nav>
  )
}

export default ClosableDrawer

