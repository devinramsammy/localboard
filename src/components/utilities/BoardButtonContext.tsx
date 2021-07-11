import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { Menu, Item, contextMenu } from 'react-contexify';
import { useTheme } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  button: {
    width: 250,
    height: 125,
    marginBottom: 10,
    textTransform: 'none',
    fontSize: '15pt',
  },
}));

interface ContextProps {
  id?: string;
  title: string;
  index: number;
  deleteBoard: Function;
}

export default function BoardButtonContext(
  props: ContextProps
): React.ReactElement {
  const classes = useStyles();
  const theme = useTheme();
  const displayMenu = (e) => {
    contextMenu.show({
      id: String(props.index),
      event: e,
    });
    e.stopPropagation();
  };

  return (
    <div>
      <div onContextMenu={displayMenu}>
        <Button
          component={NavLink}
          color="inherit"
          variant="outlined"
          className={classes.button}
          to={`/boards/${props.id}`}
        >
          {props.title}
        </Button>
      </div>

      <Menu id={String(props.index)} theme={theme.palette.type}>
        <Item onClick={() => props.deleteBoard(props.id)}>Delete Board</Item>
      </Menu>
    </div>
  );
}
