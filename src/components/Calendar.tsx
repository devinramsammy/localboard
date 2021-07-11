import * as React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Backdrop } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { DatabaseTypes } from '../database/types';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const useStyles = makeStyles(() => ({
  root: {
    minHeight: `calc(100vh - 128px)`,
  },
}));

export default function BoardCalendar(): React.ReactElement {
  const classes = useStyles();
  const history = useHistory();

  const [events, setEvents] = React.useState<DatabaseTypes.Calendar[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect((): void => {
    async function grabData() {
      try {
        setLoading(true);
        const items = await global.database.translateAllItems();
        setEvents(items);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    grabData();
  }, []);

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 10000 }}>
        <CircularProgress />
      </Backdrop>
      <Calendar
        events={events}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        className={classes.root}
        onSelectEvent={(e) => history.push(`/boards/${e.boardId}`)}
      />
    </>
  );
}
