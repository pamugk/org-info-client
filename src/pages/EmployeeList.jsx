import React from 'react';
import EmployeeTable from '../components/EmployeeTable';

const EmployeeList = () => {
    const header = [
        {id: "id", label: "ID"}, {id: "name", label: "Имя сотрудника"},
        {id:"orgId", label: "ID организации"}, {id: "orgName", label:"Организация"},
        {id:"chiefId", label: "ID руководителя"}, {id:"chiefName", label: "Руководитель"}];
    const disassembleEmployee = employee => [
        {id: "id", value:employee.id}, {id: "name", value: employee.name},
        {id:"orgId",value:employee.organization}, {id:"organizationName", value: employee.organizationName}, 
        {id:"chiefId", value: employee.chief}, {id:"chiefName", value:employee.chiefName}
    ];

    return <EmployeeTable
        deletion={true}
        disassemble = {disassembleEmployee}
        fetchCount = {10}
        header = {header}
        selection = {false}
    />;
};

export default EmployeeList;