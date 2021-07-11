import * as React from 'react';
import {
  Button,
  TextField,
  Tooltip,
  CircularProgress,
  Backdrop,
} from '@material-ui/core';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import { BoardColumn } from './BoardColumn';
import { AddCircleOutlineSharp } from '@material-ui/icons';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';

interface BoardItemProps {
  id: string;
  content: string;
  description: string;
  date: Date | null;
}
interface BoardColumnProps {
  id: string;
  title: string;
  itemsIds: string[];
}

interface DataRecord {
  _id: string;
  items: {
    [key: string]: BoardItemProps;
  };
  columns: {
    [key: string]: BoardColumnProps;
  };
  columnsOrder: string[];
}

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

export const Board = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const classes = useStyles();
  const [data, setData] = React.useState<DataRecord | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect((): void => {
    async function grabData() {
      try {
        const res = await global.database.getBoard(id);
        setData(res[0]);
      } catch (err) {
        console.log(err);
      }
    }
    setLoading(true);
    grabData();
    setLoading(false);
  }, []);

  const onClick = (): void => {
    setOpen(!open);
  };

  const onDragEnd = async (result: any): Promise<void> => {
    if (data !== null) {
      const { source, destination, draggableId, type } = result;
      if (destination === null) {
        return;
      }

      let updatedBoard = data;
      if (type === 'ITEM') {
        if (
          destination.droppableId === source.droppableId &&
          destination.index === source.index
        ) {
          return;
        }
        const columnStart = data.columns[source.droppableId];
        const columnEnd = data.columns[destination.droppableId];
        if (columnStart === columnEnd) {
          const newItemsIds = Array.from(columnStart.itemsIds);
          newItemsIds.splice(source.index, 1);
          newItemsIds.splice(destination.index, 0, draggableId);
          const newColumnStart = {
            ...columnStart,
            itemsIds: newItemsIds,
          };
          updatedBoard = {
            ...data,
            columns: {
              ...data.columns,
              [newColumnStart.id]: newColumnStart,
            },
          };
        } else {
          const newStartItemsIds = Array.from(columnStart.itemsIds);
          newStartItemsIds.splice(source.index, 1);
          const newColumnStart = {
            ...columnStart,
            itemsIds: newStartItemsIds,
          };
          const newFinishItemsIds = Array.from(columnEnd.itemsIds);
          newFinishItemsIds.splice(destination.index, 0, draggableId);
          const newColumnFinish = {
            ...columnEnd,
            itemsIds: newFinishItemsIds,
          };
          updatedBoard = {
            ...data,
            columns: {
              ...data.columns,
              [newColumnStart.id]: newColumnStart,
              [newColumnFinish.id]: newColumnFinish,
            },
          };
        }

        setData(updatedBoard);
        setLoading(true);
        await global.database.updateBoard(updatedBoard);
        setLoading(false);
      } else if (type === 'COLUMN') {
        if (source.index === destination.index) {
          return;
        }
        let newOrder = data['columnsOrder'];
        newOrder.splice(source.index, 1);
        newOrder.splice(destination.index, 0, draggableId);
        updatedBoard = {
          ...data,
          columnsOrder: newOrder,
        };
        setData(updatedBoard);
        setLoading(true);
        await global.database.updateBoard(updatedBoard);
        setLoading(false);
      }
    }
  };

  const addNewColumn = async (): Promise<void> => {
    setOpen(false);
    if (data !== null && value !== '') {
      let newColumn = {
        id: uuidv4(),
        title: value,
        itemsIds: [],
      };
      let newOrder = data['columnsOrder'];
      let newColumns = data['columns'];
      newColumns[newColumn.id] = newColumn;
      newOrder.push(newColumn.id);
      let updatedBoard = {
        ...data,
        columns: newColumns,
        columnsOrder: newOrder,
      };
      setData(updatedBoard);
      setLoading(true);
      await global.database.updateBoard(updatedBoard);
      setLoading(false);
    }
    setValue('');
  };
  const deleteColumn = async (id: string): Promise<void> => {
    if (data !== null) {
      let itemsToDelete = data['columns'][id]['itemsIds'];
      let newItems = data['items'];
      let newColumns = data['columns'];
      let newOrder = data['columnsOrder'];

      for (let i = 0; i < itemsToDelete.length; i++) {
        delete newItems[itemsToDelete[i]];
      }
      delete newColumns[id];

      newOrder.splice(newOrder.indexOf(id), 1);

      let updatedBoard = {
        ...data,
        items: newItems,
        columns: newColumns,
        columnsOrder: newOrder,
      };
      setData(updatedBoard);
      setLoading(true);
      await global.database.updateBoard(updatedBoard);
      setLoading(false);
    }
  };

  const addNewItem = async (value: string, columnId: string): Promise<void> => {
    if (data !== null && value !== '') {
      let newItem = {
        id: uuidv4(),
        content: value,
        date: null,
        description: '',
      };

      let newColumn = data['columns'][columnId];
      let newItems = data['items'];
      let newColumns = data['columns'];
      newItems[newItem.id] = newItem;
      let newItemsIds = newColumn.itemsIds;
      newItemsIds.push(newItem.id);
      newColumns[columnId] = newColumn;

      let updatedBoard = {
        ...data,
        items: newItems,
        columns: newColumns,
      };

      setData(updatedBoard);
      setLoading(true);
      await global.database.updateBoard(updatedBoard);
      setLoading(false);
    }
  };

  const deleteItem = async (id: string, columnId: string): Promise<void> => {
    if (data !== null) {
      let newItems = data['items'];
      delete newItems[id];
      let updatedBoard = {
        ...data,
        items: newItems,
      };
      let index = data['columns'][columnId]['itemsIds'].indexOf(id);
      let newItemsIds = data['columns'][columnId]['itemsIds'];
      newItemsIds.splice(index, 1);
      updatedBoard['columns'][columnId]['itemsIds'] = newItemsIds;
      setData(updatedBoard);
      setLoading(true);
      await global.database.updateBoard(updatedBoard);
      setLoading(false);
    }
  };

  const updateItem = async (item: BoardItemProps): Promise<void> => {
    if (data !== null) {
      let updatedItems = data['items'];
      updatedItems[item.id] = item;
      let updatedBoard = {
        ...data,
        items: updatedItems,
      };
      setData(updatedBoard);
      setLoading(true);
      await global.database.updateItem(data._id, item);
      setLoading(false);
    }
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 10000 }}>
        <CircularProgress />
      </Backdrop>
      <div className={classes.root}>
        {data !== null && data.columnsOrder !== undefined && (
          <>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="board"
                type="COLUMN"
                direction="horizontal"
              >
                {(provided) => {
                  return (
                    <div
                      className={classes.container}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {data.columnsOrder.map((columnId, index) => {
                        const column = (data.columns as any)[columnId];
                        const items = column.itemsIds.map(
                          (itemId: string) => (data.items as any)[itemId]
                        );

                        return (
                          <BoardColumn
                            key={column.id}
                            column={column}
                            items={items}
                            deleteColumn={deleteColumn}
                            addNewItem={addNewItem}
                            deleteItem={deleteItem}
                            updateItem={updateItem}
                            index={index}
                          />
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </DragDropContext>

            <div style={{ paddingRight: 24, color: 'white' }}>&nbsp;</div>
            <div>
              {!open ? (
                <Button
                  color="inherit"
                  style={{
                    paddingLeft: '125px',
                    paddingRight: '125px',
                  }}
                  variant="outlined"
                  onClick={onClick}
                >
                  +
                </Button>
              ) : (
                <>
                  <TextField
                    multiline
                    value={value}
                    label="Add Column"
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
                    <Button onClick={() => addNewColumn()}>
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
            </div>
            <div style={{ paddingRight: 24, color: 'white' }}>&nbsp;</div>
          </>
        )}
      </div>
    </>
  );
};
