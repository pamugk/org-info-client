import React, { useState } from 'react';
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import { AppBar, Box, Button, Toolbar } from '@material-ui/core';

import EmployeeCreator from '../pages/EmployeeCreator';
import EmployeeList from '../pages/EmployeeList';
import EmployeeTree from '../pages/EmployeeTree';
import OrganizationCreator from '../pages/OrganizationCreator';
import OrganizationList from '../pages/OrganizationList';
import OrganizationTree from '../pages/OrganizationTree';

const useStyles = makeStyles((theme) => ({
  createBtn: {
    marginLeft: "auto"
  }
}));

const App = () => {
  const CreateBtnStates = Object.freeze({ "createEmployee" : 0, "createOrg" : 1, "hide" : 2 });

  const classes = useStyles();
  const [createBtnState, setCreationBtnState] = useState(CreateBtnStates.createEmployee);

  const hideCreationBtn = () => setCreationBtnState(CreateBtnStates.hide);
  const setEmpCreation = () => setCreationBtnState(CreateBtnStates.createEmployee);
  const setOrgCreation = () => setCreationBtnState(CreateBtnStates.createOrg);

  const selectCreationLink = () => {
    switch(createBtnState) {
      case CreateBtnStates.createEmployee: return "/employees/add";
      case CreateBtnStates.createOrg: return "/organizations/add";
      default: return "#";
    };
  }

  return (
    <>
      <AppBar position="sticky">
          <Toolbar>
            <Button color="inherit" component={NavLink} onClick={setEmpCreation} to="/employees/list">Список сотрудников</Button>
            <Button color="inherit" component={NavLink} onClick={setOrgCreation} to="/organizations/list">Список организаций</Button>
            <Button color="inherit" component={NavLink} onClick={hideCreationBtn} to="/employees/tree">Дерево сотрудников</Button>
            <Button color="inherit" component={NavLink} onClick={hideCreationBtn} to="/organizations/tree">Дерево организаций</Button>
            {
              createBtnState !== CreateBtnStates.hide ? 
              <Button classes={{ root: classes.createBtn}} color="inherit" component={NavLink} to={selectCreationLink()}>Создать</Button> : null  
            }
          </Toolbar>
        </AppBar>
        <Box margin="auto">
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
            <Redirect from="/" to="/employees/list"/>
          </Switch>
        </Box>
      </>
  );
}

export default App;
