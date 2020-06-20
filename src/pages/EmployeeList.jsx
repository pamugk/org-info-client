import React from 'react';
import { getEmployeeList } from '../api/api'
import SearchableTable from '../components/SearchableTable';

const EmployeeList = () => {
    const header = [
        {id: "id", label: "ID"}, {id: "name", label: "Имя сотрудника"}, 
        {id: "organization", label:"Организация"}, {id:"chief", label: "Руководитель"}];
    const disassembleEmployee = employee => [
        {id: "id", value:employee.id}, {id: "name", value: employee.name},
        {id:"organization", value: employee.organization}, {id:"chief", value:employee.chief}
    ];
    const employeeKey = (employee) => employee.id;
    const employeeEditRedirection = (employee) => `/employees/${employee.id}`;

    return <SearchableTable
        deletion={true}
        disassemble = {disassembleEmployee}
        editRedirection={employeeEditRedirection}
        elementProvider = {getEmployeeList}
        fetchCount = {10}
        header = {header}
        keyProvider = {employeeKey}
        selection = {false}
    />;
};

export default EmployeeList;