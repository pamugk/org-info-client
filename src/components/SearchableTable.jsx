import React from 'react';
import Link from 'react-router-dom';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import SearchBar from './SearchBar';
import { Radio } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';

class SearchableTable extends React.Component {
    static propTypes = {
        disassemble: PropTypes.func.isRequired,
        editRedirection: PropTypes.func,
        elementProvider: PropTypes.func.isRequired,
        exclude: PropTypes.string,
        fetchCount: PropTypes.number.isRequired,
        header: PropTypes.array.isRequired,
        keyProvider: PropTypes.func.isRequired,
        selection: PropTypes.bool.isRequired,
        selected: PropTypes.string,
        onSelectionChanged: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            search: "",
            selected: props.selected
        };
        this.keyHandler = this.keyHandler.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }

    componentDidMount = () => this.sendRequest(); 

    componentDidUpdate(prevProps) {
        if (typeof this.state.elements == "undefined")
            this.sendRequest();
    }

    sendRequest() {
        this.props.elementProvider(
            {
                offset: this.state.page * this.props.fetchCount, limit: this.props.fetchCount,
                search: this.state.search, exclude: this.props.exclude
            })
                .then(this.handleResponse)
                .catch(error => this.setState({elements: false}));
    } 
    
    handleResponse(response) {
        switch(response.status) {
            case 200: 
                response.json().then(json => this.setState({elements: json.data}));
                break;
            default:
                this.setState({elements: false});
                break;
        }
    }

    changeHandler = (event) => this.setState({search: event.target.value});

    keyHandler(event) {
        if (event.key === "Enter")
            this.setState({page: 0, elements: undefined});
    }
    
    pageChanged = (event, newPage) => this.setState({page: newPage, elements: undefined})

    selectionChanged(event) {
        const newSelection = event.target.value;
        this.props.onSelectionChanged(newSelection);
        this.setState({selected: newSelection});
    }

    render = () =>
    <>
        <SearchBar onChange={this.changeHandler} onKeyPress={this.keyHandler} value={this.state.search} />
        {
            typeof this.state.elements == 'undefined' ? <Box margin="auto"><CircularProgress /></Box> :
            this.state.elements === false ? <Box component={Paper} margin="auto" padding="1rem"><p>При загрузsке элементов что-то пошло не так</p></Box> :
            this.state.elements.dataChunk.length === 0 ? <Box component={Paper} margin="auto" padding="1rem"><p>Ничего не найдено</p></Box> :
            <TableContainer component={Box} display="flex" flexDirection="column" flexGrow="1">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                { 
                                    this.props.selection ? 
                                    <Radio
                                        checked={!this.state.selected}
                                        onChange={this.selectionChanged}
                                        value={null}
                                    />:
                                    null
                                }
                            </TableCell>
                            { this.props.header.map(column => <TableCell align="center" key={column.id}>{column.label}</TableCell>) }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.elements.dataChunk.map(element =>
                                <TableRow key={this.props.keyProvider(element)}>
                                    <TableCell align="center">
                                        { 
                                            this.props.selection ? 
                                            <Radio
                                                checked={this.state.selection === this.props.keyProvider(element)}
                                                onChange={this.selectionChanged}
                                                value={this.props.keyProvider(element)}
                                            />:
                                            <IconButton component={Link} to={this.props.editRedirection(element)}>
                                                <EditIcon />
                                            </IconButton>
                                        }
                                    </TableCell>
                                    { this.props.disassemble(element).map(prop => <TableCell align="center">{prop}</TableCell>) }
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
                <TablePagination
                    component={Box}
                    count={this.state.elements.totalCount}
                    marginTop="auto"
                    onChangePage={this.pageChanged}
                    page={this.state.page} 
                    rowsPerPage={this.props.fetchCount}
                    rowsPerPageOptions={[this.props.fetchCount]} 
                />
            </TableContainer>
        }
    </>
};

export default SearchableTable;