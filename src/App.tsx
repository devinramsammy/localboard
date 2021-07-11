import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Board } from './components/utilities/Board';
import Database from './database/db';
import path from 'path';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import BoardCalendar from './components/Calendar';
import { Menu, Item, contextMenu, Separator } from 'react-contexify';
import { LinearProgress } from '@material-ui/core';

const setupDatabase = (): void => {
  if (global.database === undefined) {
    let newDatabase = new Database();
    newDatabase.setupDatabase(
      path.normalize(path.join(__dirname) + '/../assets/board.db')
    );
    global.database = newDatabase;
  }
};

export default function App(): React.ReactElement {
  setupDatabase();
  const [mode, setMode] = React.useState<String>('Dark');
  const DARKMODE = createMuiTheme({
    palette: {
      type: 'dark',
    },
    overrides: {
      // @ts-ignore
      MuiPickersYear: {
        yearSelected: {
          color: 'black',
        },
        root: {
          '&:focus': {
            color: 'white',
          },
        },
      },
      MuiPickersDay: {
        current: {
          color: 'white',
        },
        daySelected: {
          backgroundColor: 'black',
          '&:hover': {
            backgroundColor: 'black',
          },
        },
      },
      MuiButton: {
        textPrimary: {
          color: 'white',
        },
      },
      MuiOutlinedInput: {
        root: {
          '&$focused $notchedOutline': {
            borderColor: 'white',
          },
        },
      },
      MuiFormLabel: {
        root: {
          '&$focused': {
            color: 'white',
          },
        },
      },
    },
  });

  const LIGHTMODE = createMuiTheme({
    palette: {
      type: 'light',
    },
    overrides: {
      // @ts-ignore
      MuiPickersYear: {
        yearSelected: {
          color: 'black',
        },
        root: {
          '&:focus': {
            color: 'grey',
          },
        },
      },
      MuiPickersToolbar: {
        toolbar: {
          backgroundColor: 'white',
        },
      },
      MuiPickersToolbarText: {
        toolbarTxt: {
          color: 'black',
        },
        toolbarBtnSelected: {
          color: 'black',
        },
      },
      MuiPickersDay: {
        current: {
          color: 'black',
        },
        daySelected: {
          backgroundColor: 'black',
          '&:hover': {
            backgroundColor: 'black',
          },
        },
      },
      MuiButton: {
        textPrimary: {
          color: 'black',
        },
      },
      MuiOutlinedInput: {
        root: {
          '&$focused $notchedOutline': {
            borderColor: 'black',
          },
        },
      },
      MuiFormLabel: {
        root: {
          '&$focused': {
            color: 'black',
          },
        },
      },
    },
  });

  const switchMode = () => {
    if (mode === 'Light') {
      setMode('Dark');
    } else {
      setMode('Light');
    }
  };

  const displayMenu = (e) => {
    contextMenu.show({
      id: 'main',
      event: e,
    });
  };

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ThemeProvider theme={mode === 'Light' ? LIGHTMODE : DARKMODE}>
          {global.database === undefined && <LinearProgress />}
          <CssBaseline />
          <div className="global" onContextMenu={displayMenu}>
            <Router>
              <Navbar switchMode={switchMode} mode={mode}>
                {global.database !== undefined && (
                  <Switch>
                    <Route path="/boards/:id" component={Board} />
                    <Route path="/calendar" component={BoardCalendar} />
                    <Route path="/" component={LandingPage} />
                  </Switch>
                )}
              </Navbar>
            </Router>
          </div>
          <Menu id={'main'} theme={mode.toLowerCase()} style={{ zIndex: 1600 }}>
            <Item
              onClick={() =>
                window.open(
                  'https://github.com/devinramsammy/localboard',
                  '_blank',
                  'top=500,left=200,frame=false,nodeIntegration=no'
                )
              }
            >
              About this App
            </Item>
            <Separator></Separator>
            <Item disabled>Created By Devin Ramsammy</Item>
          </Menu>
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    </>
  );
}
