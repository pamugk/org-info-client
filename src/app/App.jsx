import React, { useState } from 'react';
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import EmployeeCreator from '../pages/EmployeeCreator';
import EmployeeList from '../pages/EmployeeList';
import EmployeeTree from '../pages/EmployeeTree';
import OrganizationCreator from '../pages/OrganizationCreator';
import OrganizationList from '../pages/OrganizationList';
import OrganizationTree from '../pages/OrganizationTree';
import { Toolbar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  createBtn: {
    marginLeft: "auto"
  }
}));

const App = () => {
  const classes = useStyles();
  const [createBtnState, setCreationBtnState] = useState(0);
  const [showCreateBtn, isShowingCreateBtn] = useState(true);

  const hideCreationBtn = () => isShowingCreateBtn(false);

  const setEmpCreation = () => {
    setCreationBtnState(0);
    isShowingCreateBtn(true);
  }
  const setOrgCreation = () => {
    setCreationBtnState(1);
    isShowingCreateBtn(true);
  }

  const selectCreationLink = () => {
    switch(createBtnState) {
      case 0: return "/employees/add";
      case 1: return "/organizations/add";
      default: return "#";
    };
  }

  return (
    <Box display="flex" flexDirection="column" flexGrow="1">
        <AppBar position="sticky">
          <Toolbar>
            <Button color="inherit" component={NavLink} onClick={setEmpCreation} to="/employees/list">Список сотрудников</Button>
            <Button color="inherit" component={NavLink} onClick={setOrgCreation} to="/organizations/list">Список организаций</Button>
            <Button color="inherit" component={NavLink} onClick={hideCreationBtn} to="/employees/tree">Дерево сотрудников</Button>
            <Button color="inherit" component={NavLink} onClick={hideCreationBtn} to="/organizations/tree">Дерево организаций</Button>
            { showCreateBtn ? <Button classes={{ root: classes.createBtn}} color="inherit" component={NavLink} to={selectCreationLink()}>Создать</Button> : null  }
            
          </Toolbar>
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
          <Redirect from="/" to="/employees/list"/>
        </Switch>
      </Box>
  );
}

export default App;
