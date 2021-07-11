import {
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Theme,
  Tooltip,
} from '@material-ui/core';
import * as React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { BoardItem } from './BoardItem';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AddCircleOutlineSharp } from '@material-ui/icons';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { Menu, Item, contextMenu } from 'react-contexify';
import { DatabaseTypes } from '../../database/types';

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    fontWeight: 'bold',
    paddingBottom: '15px',
    color: theme.palette.text.primary,
    background: theme.palette.primary[700],
    textAlign: 'left',
    paddingLeft: 8,
    maxWidth: 192,
    overflowWrap: 'break-word',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: 250,
  },
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: theme.palette.secondary[500],
    borderRadius: 4,
    marginLeft: 24,
  },
  column: {
    minHeight: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 4,
    width: 250,
  },
}));

type BoardColumnProps = {
  column: DatabaseTypes.BoardColumnProps;
  items: DatabaseTypes.BoardItemProps;
  index: number;
  deleteColumn: Function;
  addNewItem: Function;
  deleteItem: Function;
  updateItem: Function;
};

export const BoardColumn = (props: BoardColumnProps): React.ReactElement => {
  const classes = useStyles();
  const [open, setOpen] = React.useState<boolean>(false);

  const [value, setValue] = React.useState<string>('');

  const theme = useTheme();

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? theme.palette.primary[500] : 'lightgrey',
    padding: 8,
  });

  const addItem = (): void => {
    setOpen(false);
    props.addNewItem(value, props.column.id);
    setValue('');
  };

  const displayMenu = (e) => {
    contextMenu.show({
      id: props.column.title + props.index,
      event: e,
    });
    e.stopPropagation();
  };

  return (
    <>
      <div onContextMenu={displayMenu}>
        <Draggable draggableId={props.column.id} index={props.index}>
          {(provided) => {
            return (
              <div
                className={classes.container}
                ref={provided.innerRef}
                {...provided.draggableProps}
              >
                <div ref={provided.innerRef} {...provided.dragHandleProps}>
                  <div className={classes.row}>
                    <Typography variant="body1" className={classes.header}>
                      {props.column.title}
                    </Typography>
                  </div>

                  <Droppable droppableId={props.column.id} type="ITEM">
                    {(provided, snapshot) => (
                      <div
                        style={getListStyle(snapshot.isDraggingOver)}
                        className={classes.column}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {props.items.map(
                          (
                            item: DatabaseTypes.BoardItemProps,
                            index: number
                          ) => (
                            <BoardItem
                              key={item.id}
                              item={item}
                              index={index}
                              column={props.column.title}
                              columnId={props.column.id}
                              deleteColumn={props.deleteColumn}
                              deleteItem={props.deleteItem}
                              updateItem={props.updateItem}
                            />
                          )
                        )}
                        {provided.placeholder}
                        <Card>
                          <CardContent>
                            {!open ? (
                              <Button
                                color="inherit"
                                variant="outlined"
                                fullWidth
                                onClick={() => setOpen(true)}
                              >
                                +
                              </Button>
                            ) : (
                              <>
                                <TextField
                                  multiline
                                  label="Add Item"
                                  value={value}
                                  variant="outlined"
                                  fullWidth
                                  onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                      setOpen(false);
                                      setValue('');
                                    }
                                    if (e.key === 'Backspace' && value === '') {
                                      setOpen(false);
                                    }
                                  }}
                                  style={{
                                    marginBottom: 10,
                                  }}
                                  onChange={(e) => setValue(e.target.value)}
                                ></TextField>
                                <Tooltip title="Add">
                                  <Button onClick={() => addItem()}>
                                    <AddCircleOutlineSharp />
                                  </Button>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <Button
                                    onClick={() => {
                                      setOpen(false);
                                      setValue('');
                                    }}
                                  >
                                    <RemoveCircleOutlineIcon color="secondary" />
                                  </Button>
                                </Tooltip>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            );
          }}
        </Draggable>
      </div>
      <Menu id={props.column.title + props.index} theme={theme.palette.type}>
        <Item onClick={() => props.deleteColumn(props.column.id)}>
          Delete Column
        </Item>
      </Menu>
    </>
  );
};
