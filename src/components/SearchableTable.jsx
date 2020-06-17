import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import SearchBar from './SearchBar';

class SearchableTable extends React.Component {
    static propTypes = {
        disassemble: PropTypes.func.isRequired,
        elementProvider: PropTypes.func.isRequired,
        fetchCount: PropTypes.number.isRequired,
        header: PropTypes.array.isRequired,
        keyProvider: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            search: ""
        };
        this.keyHandler = this.keyHandler.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }

    componentDidMount() {
        if (typeof this.state.organizations == 'undefined')
            this.props.elementProvider(this.state.page * this.props.fetchCount, this.props.fetchCount, this.state.search)
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

    render = () =>
    <>
        <SearchBar onChange={this.changeHandler} onKeyPress={this.keyHandler} value={this.state.search} />
        {
            typeof elements == 'undefined' ? <Box margin="auto"><CircularProgress /></Box> :
            this.state.elements === false ? <Box component={Paper} margin="auto" padding="1rem"><p>При загрузке элементов что-то пошло не так</p></Box> :
            this.state.elements.dataChunk.length === 0 ? <Box component={Paper} margin="auto" padding="1rem"><p>Ничего не найдено</p></Box> :
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            { this.props.header.map(column => <TableCell align="center">{column}</TableCell>) }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.props.elements.dataChunk.map(element =>
                                <TableRow key={this.props.keyProvider(element)}>
                                    { this.props.disassemble(element).map(prop => <TableCell align="center">{prop}</TableCell>) }
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
                <TablePagination
                    count={this.state.elements.totalCount}
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