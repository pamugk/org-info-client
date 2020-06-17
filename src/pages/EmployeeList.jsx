import React from 'react';
import { getEmployeeList } from '../api/api'
import SearchableTable from '../components/SearchableTable';

const EmployeeList = () => {
    const disassembleEmployee = employee => [employee.id, employee.name, employee.organization, employee.chief];
    const employeeKey = (employee) => employee.id;

    return <SearchableTable
        disassemble = {disassembleEmployee}
        elementProvider = {getEmployeeList}
        fetchCount = {10}
        header = {["ID", "Имя сотрудника", "Организация", "Руководитель"]}
        keyProvider = {employeeKey}
    />;
};

export default EmployeeList;