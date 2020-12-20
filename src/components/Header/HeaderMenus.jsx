import { Badge, IconButton } from '@material-ui/core'
import { Menu, ShoppingCart } from '@material-ui/icons'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import React from 'react'


const HeaderMenus = (props) => {
  return (
    <>
      <IconButton>
        <Badge badgeContent={3} color="secondary">
          <ShoppingCart/>
        </Badge>
      </IconButton>
      <IconButton>
        <FavoriteBorder/>
      </IconButton>
      <IconButton onClick={props.handleDrawerToggle}>
        <Menu/>
      </IconButton>
    </>
  )
}

export default HeaderMenus

