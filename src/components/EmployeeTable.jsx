import React, {useState}  from 'react';
import PropTypes from 'prop-types';

import { deleteEmployee, getEmployeeList } from '../api/api';
import SearchableTable from './SearchableTable';
import SearchBar from './SearchBar';

const EmployeeTable = (props) => {
    const [search, setSearch] = useState({orgId: props.orgId});
    const [searchName, setSearchName] = useState("");
    const [searchOrg, setSearchOrg] = useState("");

    const employeeKey = (employee) => employee.id;
    const employeeRedirection = (employee) => `/employees/${employee.id}`;

    const searchNameChanged = (event) => setSearchName(event.target.value);
    const searchOrgChanged = (event) => setSearchOrg(event.target.value);

    const searchKeyPressed = (event) => {
        if (event.key === "Enter")
            setSearch({search: searchName, organization: searchOrg, orgId: props.orgId});
    }

    return <>
        <SearchBar
            onChange={searchNameChanged}
            onKeyPress={searchKeyPressed}
            value={searchName}
        />
        {
            typeof props.orgId == "undefined" ?
            <SearchBar
                onChange={searchOrgChanged}
                onKeyPress={searchKeyPressed}
                value={searchOrg}
            /> : null
        }
        <SearchableTable
            countOptions={[5,10,15]}
            deletion={props.deletion}
            disassemble={props.disassemble}
            elementProvider={getEmployeeList}
            exclude={props.exclude}
            itemRedirection={employeeRedirection}
            header={props.header}
            keyProvider={employeeKey}
            onSelectionChanged={props.onSelectionChanged}
            selection={props.selection}
            selected={props.selected}
            search={search}
            startFetchCount = {10}
            removator={deleteEmployee}
        />
    </>;
} 

EmployeeTable.propTypes = {
    deletion: PropTypes.bool.isRequired,
    disassemble: PropTypes.func.isRequired,
    exclude: PropTypes.string,
    header: PropTypes.array.isRequired,
    orgId: PropTypes.string,
    selection: PropTypes.bool.isRequired,
    selected: PropTypes.string,
    onSelectionChanged: PropTypes.func
};  

export default EmployeeTable;