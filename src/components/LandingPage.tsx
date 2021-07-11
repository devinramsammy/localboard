import * as React from 'react';
import {
  Button,
  TextField,
  Tooltip,
  Typography,
  CircularProgress,
  Backdrop,
} from '@material-ui/core';
import { AddCircleOutlineSharp } from '@material-ui/icons';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import { DatabaseTypes } from '../database/types';
import BoardButtonContext from './utilities/BoardButtonContext';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'left',
    flexWrap: 'wrap',
  },
  button: {
    width: 250,
    height: 125,
    marginBottom: 10,
    textTransform: 'none',
    fontSize: '15pt',
  },
  header: {
    fontSize: '20pt',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingBottom: '15px',
    paddingTop: '15px',
    paddingLeft: '1px',
  },
  date: {
    fontWeight: 'bolder',
  },
  cardText: {
    fontSize: '20pt',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: '15px',
    paddingTop: '15px',
    paddingLeft: '1px',
  },
}));

export default function LandingPage(): React.ReactElement {
  const [boards, setBoards] = React.useState<DatabaseTypes.DataRecord[]>([]);
  const [items, setItems] = React.useState<DatabaseTypes.BoardItemProps[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  const classes = useStyles();
  async function grabBoards() {
    try {
      const boards = await global.database.getBoards();
      setBoards(boards);
      const items = await global.database.getUpcomingItems(10);
      setItems(items);
    } catch (err) {
      console.log(err);
    }
  }
  async function grabItems() {
    try {
      const items = await global.database.getUpcomingItems(10);
      setItems(items);
    } catch (err) {
      console.log(err);
    }
  }
  React.useEffect((): void => {
    setLoading(true);
    grabBoards();
    grabItems();
    setLoading(false);
  }, []);

  const onClick = (): void => {
    setOpen(!open);
  };

  const addBoard = async () => {
    if (value !== '') {
      const res = await global.database.createBoard(value);
      let newBoards = boards;
      newBoards.push(res);
      setBoards(newBoards);
      setValue('');
      setOpen(false);
    }
  };

  const deleteBoard = async (id: string | undefined) => {
    if (id === undefined) {
      throw new Error('error');
    }
    await global.database.deleteBoard(id);
    let index = boards.findIndex((board) => board._id === id);
    let newBoards = [...boards];
    newBoards.splice(index, 1);
    setBoards(newBoards);
    await grabItems();
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 10000 }}>
        <CircularProgress />
      </Backdrop>
      <>
        <div className={classes.header}>My Boards</div>
        <div className={classes.container} style={{ gap: '20px' }}>
          {boards !== null &&
            boards.map((board, index) => (
              <BoardButtonContext
                id={board._id}
                title={board.title}
                index={index}
                deleteBoard={deleteBoard}
                key={index}
              />
            ))}
          {!open ? (
            <Tooltip title="Add New Board">
              <Button
                color="inherit"
                className={classes.button}
                variant="outlined"
                onClick={onClick}
                style={{ fontWeight: 'bolder' }}
              >
                Add New Board
              </Button>
            </Tooltip>
          ) : (
            <div>
              <TextField
                multiline
                value={value}
                label="Add New Board"
                variant="outlined"
                style={{
                  width: 250,
                  marginBottom: 10,
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setOpen(false);
                    setValue('');
                  }
                  if (e.key === 'Backspace' && value === '') {
                    setOpen(false);
                  }
                }}
                onChange={(e) => setValue(e.target.value)}
              ></TextField>
              <br></br>
              <Tooltip title="Add">
                <Button onClick={addBoard}>
                  <AddCircleOutlineSharp />
                </Button>
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  onClick={() => {
                    setOpen(false);
                    setValue('');
                  }}
                >
                  <RemoveCircleOutlineIcon color="secondary" />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
        <div className={classes.header}>Upcoming Tasks</div>
        <div className={classes.container} style={{ gap: '20px' }}>
          {items !== null &&
            items.map((item, index) => (
              <Button
                component={NavLink}
                color="inherit"
                variant="outlined"
                className={classes.button}
                key={index}
                to={`/boards/${item.boardId}`}
              >
                <Typography>
                  {item.content}
                  <br></br>
                  <div className={classes.date}>
                    Due: {new Date(item.date).toDateString()}
                  </div>
                </Typography>
              </Button>
            ))}
        </div>
      </>
    </>
  );
}
