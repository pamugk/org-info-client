import React, { useState } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { getOrganizationList } from '../api/api';

const OrganizationList = () => {
    const [page, setPage] = useState(1);
    const [organizations, setOrganizations] = useState(undefined);
    const [search, setSearch] = useState("");
    const fetchCount = 10;

    if (typeof organizations == 'undefined')
        getOrganizationList(1, fetchCount, "")
        .then(
            (response) => {
                switch(response.status) {
                    case 200: 
                        response.json().then(json => setOrganizations(json.data));
                        break;
                    default:
                        setOrganizations(false);
                        break;
                }
            } 
        )
        .catch( error => {
            console.log(error);
            setOrganizations(false)
        });
        

    return<>
        {
            typeof organizations == 'undefined' ? <CircularProgress /> :
            organizations === false ? <p>Что-то пошло не так</p> :
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Имя организации</TableCell>
                            <TableCell>Головная организация</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            organizations.dataChunk.map((organization) => (
                                <TableRow key={organization.id}>
                                    <TableCell>{organization.id}</TableCell>
                                    <TableCell>{organization.name}</TableCell>
                                    <TableCell>{organization.parentName}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        }
    </>;
};

export default OrganizationList;