import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CreateIcon from '@material-ui/icons/Create'
import { Link } from 'react-router-dom'

export const mainListItems = (
  <div>
    <ListItem button component={Link} to="/add-book">
      <ListItemIcon>
        <CreateIcon />
      </ListItemIcon>
      <ListItemText primary="Add new book" />
    </ListItem>
  </div>
)

export const secondaryListItems = <div></div>
