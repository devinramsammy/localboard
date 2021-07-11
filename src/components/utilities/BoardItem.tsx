import * as React from 'react';
import {
  Card,
  CardContent,
  Theme,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import { Draggable } from 'react-beautiful-dnd';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { DatePicker } from '@material-ui/pickers';
import { Menu, Item, contextMenu } from 'react-contexify';
import { DatabaseTypes } from '../../database/types';

type BoardItemProps = {
  index: number;
  item: DatabaseTypes.BoardItemProps;
  column: string;
  columnId: string;
  deleteColumn: Function;
  deleteItem: Function;
  updateItem: Function;
};

const useStyles = makeStyles((theme: Theme) => ({
  cardContent: {
    position: 'relative',
  },
  actions: { position: 'absolute', right: '0px', top: '0px' },
  text: {
    overflowWrap: 'break-word',
    textAlign: 'left',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export const BoardItem = (props: BoardItemProps): React.ReactElement => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState<boolean>(false);
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  const [selectedDate, handleDateChange] = React.useState<
    Date | string | number
  >(props.item.date);
  const [value, setValue] = React.useState<string>(props.item.description);
  const [content, setContent] = React.useState<string>(props.item.content);

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const getItemStyle = (isDragging, draggableStyle) => {
    draggableStyle['opacity'] = isDragging ? 0.8 : 1;
    return {
      userSelect: 'none',
      margin: `0 0 ${8}px 0`,
      background: theme.palette.primary[500],
      ...draggableStyle,
    };
  };

  const handleDelete = (): void => {
    setOpen(false);
    props.deleteItem(props.item.id, props.columnId);
    setValue('');
    handleDateChange('');
  };

  const handleUpdate = (): void => {
    setOpen(false);
    let updatedItem = {
      ...props.item,
      description: value,
      date: selectedDate,
      content: content,
    };
    props.updateItem(updatedItem);
  };

  const displayMenu = (e) => {
    contextMenu.show({
      id: props.item.content + props.index,
      event: e,
    });
    e.stopPropagation();
  };

  return (
    <div onContextMenu={displayMenu}>
      <Draggable draggableId={props.item.id} index={props.index}>
        {(provided, snapshot) => (
          <Card
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            elevation={
              snapshot.isDragging && !snapshot.isDropAnimating ? 10 : 2
            }
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
          >
            <CardContent className={classes.cardContent}>
              <div className={classes.text}>{props.item.content}</div>
            </CardContent>
          </Card>
        )}
      </Draggable>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={'body'}
        maxWidth={'sm'}
        fullWidth
      >
        <DialogTitle disableTypography>
          <Typography variant="h5">{props.item.content}</Typography>
          <Typography variant="caption">in list {props.column}</Typography>
          <IconButton onClick={handleClose} className={classes.closeButton}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            ref={descriptionElementRef}
            tabIndex={-1}
          ></DialogContentText>
          <TextField
            multiline
            label="Item Content"
            variant="outlined"
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            InputLabelProps={{ shrink: true }}
          ></TextField>
          <DatePicker
            label="Expected Due Date"
            color="primary"
            value={selectedDate}
            onChange={(date) =>
              date !== null ? handleDateChange(date) : console.log(date)
            }
            style={{
              marginTop: 20,
            }}
            animateYearScrolling
            inputVariant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            minDate={new Date()}
          />
          <TextField
            multiline
            label="Item Description"
            variant="outlined"
            rows={8}
            fullWidth
            style={{
              marginTop: 20,
            }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            InputLabelProps={{ shrink: true }}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate} color="inherit">
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>
      <Menu id={props.item.content + props.index} theme={theme.palette.type}>
        <Item onClick={() => props.deleteColumn(props.columnId)}>
          Delete Column
        </Item>
        <Item onClick={() => setOpen(true)}>Edit Item</Item>
        <Item onClick={handleDelete}>Delete Item</Item>
      </Menu>
    </div>
  );
};
