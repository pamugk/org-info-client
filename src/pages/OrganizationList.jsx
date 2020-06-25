import React from 'react';
import OrganizationTable from '../components/OrganizationTable';

const OrganizationList = () => {
    const header = [
        {id:"id", label:"ID"}, {id:"name", label:"Название организации"}, {id:"parentId", label:"ID головной организации"},
        {id:"parentName", label:"Головная организация"}, {id:"countOfEmployees", label:"Количество сотрудников"}];
    const disassembleOrganization = organization => [
        {id:"id",value:organization.id}, {id:"name", value:organization.name},  {id:"parentId", value: organization.parentId},
        {id:"parentName", value: organization.parentName}, {id:"employeeCount", value:organization.employeeCount}
    ];

    return <OrganizationTable
        deletion={true}
        disassemble = {disassembleOrganization}
        header = {header}
        selection = {false}
    />;
};

export default OrganizationList;