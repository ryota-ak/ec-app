import React, { useCallback, useEffect, useState } from 'react'
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

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.down('sm')]: {
      flexShrink: 0,
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

  const inputKeyword = useCallback((e) => {
    setKeyword(e.target.value);
  }, [setKeyword]);

  const logout = (e) => {
    dispatch(signOut());
    props.onClose(e);
  }

  const selectMenu = (e, path) => {
    dispatch(push(path));
    props.onClose(e);
  }

  const searchKeyword = (e) => {
      selectMenu(e, `/?search=${keyword}`);
      setKeyword('');
  }

  const [filters, setFilters] = useState([
    {func: selectMenu, label: "すべて", id: "all", value: "/"},
    {func: selectMenu, label: "メンズ", id: "male", value: "/?gender=male"},
    {func: selectMenu, label: "レディース", id: "female", value: "/?gender=female"},
  ]);

  const menus = [
    {func: selectMenu, label: "商品登録", icon: <AddCircleIcon />, id: "register", value: "/product/edit"},
    {func: selectMenu, label: "注文履歴", icon: <HistoryIcon />, id: "history", value: "/order/history"},
    {func: selectMenu, label: "プロフィール", icon: <PesonIcon />, id: "profile", value: "/user/mypage"}
  ];

  useEffect(() => {
    db.collection('categories')
      .orderBy('order', 'asc')
      .get()
      .then(snapshots => {
        const list = [];
        snapshots.forEach(snapshot => {
          const category = snapshot.data();
          list.push({func: selectMenu, label: category.name, id: category.id, value: `/?category=${category.id}`});
        })
        setFilters(prevState => [...prevState, ...list])
      })
  }, []);

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Drawer
        container={container}
        variant="temporary"
        anchor="right"
        open={props.open}
        onClose={(e) => props.onClose(e)}
        classes={{paper: classes.drawerPaper}}
        ModalProps={{keepMounted: true}}
        >
        <div
          // onClose={(e) => props.onClose(e)}
          // onKeyDown={(e) => props.onClose(e)}
        >
          <div className={classes.serchField}>
            <TextInput
              fullWidth={false} label={"キーワードを入力"} multiline={false} required={false} rows={1} value={keyword} type={"text"} onChange={inputKeyword}
            />
            <IconButton
            onClick={searchKeyword}>
              <SerchIcon />
            </IconButton>
          </div>
          <Divider />
          <List onKeyDown={(e) => props.onClose(e)} >
            {menus.map( menu => (
              <ListItem button key={menu.id} onClick={(e)=>menu.func(e, menu.value)}>
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
              <ListItem button key={filter.id} onClick={(e) => filter.func(e, filter.value)}>
                <ListItemText primary={filter.label} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </nav>
  )
}

export default ClosableDrawer

