import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import EmployeeCreator from '../pages/EmployeeCreator'
import EmployeeList from '../pages/EmployeeList';
import EmployeeTree from '../pages/EmployeeTree';
import OrganizationCreator from '../pages/OrganizationCreator'
import OrganizationList from '../pages/OrganizationList';
import OrganizationTree from '../pages/OrganizationTree';

const theme = createMuiTheme({
  overrides: {
    MuiAppBar: {
      root: {
        flexDirection: "row"
      }
    }
  }
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection="column" flexGrow="1">
        <AppBar position="sticky">
          <Tabs>
            <Tab label="Список сотрудников" />
            <Tab label="Список организаций" />
            <Tab label="Дерево сотрудников" />
            <Tab label="Дерево организаций" />
          </Tabs>
          <Button color="inherit">Создать</Button>
        </AppBar>
        <Switch>
          <Route path="/employees/add">
            <EmployeeCreator />
          </Route>
          <Route path="/employees/list">
            <EmployeeList />
          </Route>
          <Route path="/employees/tree">
            <EmployeeTree />
          </Route>
          <Route path="/organizations/add">
            <OrganizationCreator />
          </Route>
          <Route path="/organizations/list">
            <OrganizationList />
          </Route>
          <Route path="/organizations/tree">
            <OrganizationTree />
          </Route>
        </Switch>
      </Box>
    </ThemeProvider>
  );
}

export default App;
