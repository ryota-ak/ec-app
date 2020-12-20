import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import logo from '../../assets/img/icons/logo.png'
import { useDispatch, useSelector } from 'react-redux'
import { getIsSignedIn } from '../../reducks/users/selectors'
import { push } from 'connected-react-router'
import { HeaderMenus ,ClosableDrawer} from '.'

const useStyles = makeStyles({
  root: {
    flexGrow:1,
  },
  menuBar: {
    backgroundColor: "#fff",
    color: "#444"
  },
  toolBar:{
    margin:'0 auto',
    maxWidth: 1024,
    width: '100%'
  },
  iconButtons: {
    margin: '0 0 0 auto',
  }
});

const Header = () => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const isSignedIn = getIsSignedIn(selector);

  const [sideBarOpen, setSideBarOpen] = useState(false);

  const handleDrawerToggle = useCallback((e) => {
    if(e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
        return;
      }
      setSideBarOpen(sideBarOpen => !sideBarOpen);
      //なぜダメなのか
      // setSideBarOpen(!sideBarOpen);
    }, [setSideBarOpen])

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.menuBar}>
        <Toolbar className={classes.toolBar}>
          <img
            src={logo} alt="Torahack Logo" width="128px"
            onClick={() => dispatch(push('/'))}
          />
          {isSignedIn && (
            <div className={classes.iconButtons}>
              <HeaderMenus handleDrawerToggle={handleDrawerToggle} />
            </div>
          )}
        </Toolbar>
      </AppBar>
      <ClosableDrawer open={sideBarOpen} onClose={handleDrawerToggle} />
    </div>
  )
}

export default Header

