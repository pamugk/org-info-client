import React, {useState} from 'react';
import PropTypes from 'prop-types';

import { deleteOrganization, getOrganizationList } from '../api/api';
import SearchableTable from './SearchableTable';
import SearchBar from './SearchBar';

const OrganizationTable = (props) => {
    const [search, setSearch] = useState({});
    const [searchName, setSearchName] = useState("");

    const organizationKey = (organization) => organization.id;
    const organizationRedirection = (organization) => `/organizations/${organization.id}`;

    const searchNameChanged = (event) => setSearchName(event.target.value);
    const searchKeyPressed = (event) => {
        if (event.key === "Enter")
            setSearch({search: searchName});
    }

    return <>
        <SearchBar
            onChange={searchNameChanged}
            onKeyPress={searchKeyPressed}
            placeholder="Поиск по названию..."
            value={searchName}
        />
        <SearchableTable
            countOptions={[5,10,15]}
            deletion={props.deletion}
            disassemble={props.disassemble}
            elementProvider={getOrganizationList}
            exclude={props.exclude}
            itemRedirection={organizationRedirection}
            header={props.header}
            keyProvider={organizationKey}
            onSelectionChanged={props.onSelectionChanged}
            selection={props.selection}
            selected={props.selected}
            search={search}
            startFetchCount = {10}
            removator={deleteOrganization}
        />
    </>;
};

OrganizationTable.propTypes = {
    deletion: PropTypes.bool.isRequired,
    disassemble: PropTypes.func.isRequired,
    exclude: PropTypes.string,
    header: PropTypes.array.isRequired,
    selection: PropTypes.bool.isRequired,
    selected: PropTypes.string,
    onSelectionChanged: PropTypes.func
};

export default OrganizationTable;