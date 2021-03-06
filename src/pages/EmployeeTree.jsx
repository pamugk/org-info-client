import React from 'react';

import TreeView from '../components/TreeView';

import {getEmployeeTree} from '../api/api';

const EmployeeTree = () => 
    <TreeView
        elementProvider={getEmployeeTree}
        elementStringifier={(employee) => employee.name}
        itemPathProvider={(id) => `/employees/${id}`}
        keyProvider={(employee) => employee.id} 
        limit={5}
        root="Сотрудники"
    />;

export default EmployeeTree;