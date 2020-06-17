import React from 'react';
import { getOrganizationList } from '../api/api';
import SearchableTable from '../components/SearchableTable';

const OrganizationList = () => {
    const disassembleOrganization = organization => [organization.id, organization.name, organization.parentName];
    const organizationKey = (organization) => organization.id;

    return <SearchableTable
        disassemble = {disassembleOrganization}
        elementProvider = {getOrganizationList}
        fetchCount = {1}
        header = {["ID", "Название организации", "Головная организация"]}
        keyProvider = {organizationKey}
    />;
};

export default OrganizationList;