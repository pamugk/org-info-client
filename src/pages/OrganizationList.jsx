import React from 'react';
import { getOrganizationList } from '../api/api';
import SearchableTable from '../components/SearchableTable';

const OrganizationList = () => {
    const header = [
        {id:"id", label:"ID"}, {id:"name", label:"Название организации"},
        {id:"parent", label:"Головная организация"}, {id:"countOfEmployees", label:"Количество сотрудников"}];
    const disassembleOrganization = organization => 
        [organization.id, organization.name, organization.parentName, organization.employeeCount];
    const organizationKey = (organization) => organization.id;
    const organizationEditRedirection = (organization) => `/organizations/${organization.id}`;

    return <SearchableTable
        disassemble = {disassembleOrganization}
        editRedirection={organizationEditRedirection}
        elementProvider = {getOrganizationList}
        fetchCount = {1}
        header = {header}
        keyProvider = {organizationKey}
        selection = {false}
    />;
};

export default OrganizationList;