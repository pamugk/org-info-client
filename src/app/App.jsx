import React from 'react';
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import { AppBar, Box, Button, Toolbar, Card } from '@material-ui/core';

import EmployeeEditor from '../pages/EmployeeEditor';
import EmployeeList from '../pages/EmployeeList';
import EmployeeTree from '../pages/EmployeeTree';
import OrganizationEditor from '../pages/OrganizationEditor';
import OrganizationList from '../pages/OrganizationList';
import OrganizationTree from '../pages/OrganizationTree';

const useStyles = makeStyles((theme) => ({
  createBtn: {
    marginLeft: "auto"
  }
}));

const App = () => {
  const classes = useStyles();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Button color="inherit" component={NavLink} to="/employees/list">Список сотрудников</Button>
          <Button color="inherit" component={NavLink} to="/organizations/list">Список организаций</Button>
          <Button color="inherit" component={NavLink} to="/employees/tree">Дерево сотрудников</Button>
          <Button color="inherit" component={NavLink} to="/organizations/tree">Дерево организаций</Button>
          <Switch>
            <Route path="/employees/list">
              <Button classes={{ root: classes.createBtn}} color="inherit" component={NavLink} to="/employees/add">Создать</Button>
            </Route>
            <Route path="/organizations/list">
              <Button classes={{ root: classes.createBtn}} color="inherit" component={NavLink} to="/organizations/add">Создать</Button>
            </Route> from="/" 
          </Switch>
        </Toolbar>
      </AppBar>
      <Box component={Card} display="flex" flexDirection="column" margin="auto" minHeight="50%" minWidth="50%">
        <Switch>
          <Route path="/employees/:id">
            <EmployeeEditor />
          </Route>
          <Route path="/employees/add">
            <EmployeeEditor />
          </Route>
          <Route path="/employees/list">
            <EmployeeList />
          </Route>
          <Route path="/employees/tree">
            <EmployeeTree />
          </Route>
          <Route path="/organizations/:id">
            <OrganizationEditor />
          </Route>
          <Route path="/organizations/add">
            <OrganizationEditor />
          </Route>
          <Route path="/organizations/list">
            <OrganizationList />
          </Route>
          <Route path="/organizations/tree">
            <OrganizationTree />
          </Route>
          <Redirect to="/employees/list"/>
        </Switch>
      </Box>
    </>
  );
}

export default App;
