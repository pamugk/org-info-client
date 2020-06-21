import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import SearchBar from './SearchBar';
import { Radio } from '@material-ui/core';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';

class SearchableTable extends React.Component {
    static propTypes = {
        deletion: PropTypes.bool.isRequired,
        disassemble: PropTypes.func.isRequired,
        editRedirection: PropTypes.func,
        elementProvider: PropTypes.func.isRequired,
        exclude: PropTypes.string,
        fetchCount: PropTypes.number.isRequired,
        header: PropTypes.array.isRequired,
        keyProvider: PropTypes.func.isRequired,
        removator: PropTypes.func,
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
        this.handleDeletionResponse = this.handleDeletionResponse.bind(this);
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
                search: this.state.search ? this.state.search : undefined, exclude: this.props.exclude
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

    deleteItem(id) {
        this.setState({deleting: true});
        this.props.removator(id)
            .then(this.handleDeletionResponse)
            .catch(error => this.setState({}));
    }

    handleDeletionResponse(response) {
        switch (response.status) {
            case 200: {
                this.setState({deleting: {success: true, message: "Элемент успешно удалён", reload: true}});
                break;
            }
            case 404: {
                response.json().then(json => this.setState({deleting: {success: false, message: json.data, reload: true}}));
                break;
            }
            case 422: {
                response.json().then(json => this.setState({deleting: {success: false, message: json.data}}));
                break;
            }
            default: {
                this.setState({deleting: {success: false, message: "При удалении элемента что-то внезапно пошло не так"}});
                break;
            }
        }
    }

    render = () =>
    <>
        <SearchBar onChange={this.changeHandler} onKeyPress={this.keyHandler} value={this.state.search} />
        {
            typeof this.state.elements == 'undefined' ? <Box margin="auto"><CircularProgress /></Box> :
            this.state.elements === false ? 
            <Alert component={Box} margin="auto" severity="error">
                При загрузке элементов что-то пошло не так
            </Alert> :
            this.state.elements.dataChunk.length === 0 ? 
            <Alert component={Box} margin="auto" severity="info">
                Ничего не найдено
            </Alert> :
            <TableContainer component={Box} display="flex" flexDirection="column" flexGrow="1">
                {
                    typeof this.state.deleting == "undefined" ? null:
                    this.state.deleting === true ? <Box margin="auto"><CircularProgress /></Box> :
                    <Dialog
                        onClose={() => this.setState({deleting: undefined, elements: this.state.deleting.reload ? undefined : this.state.elements})}
                        open={true}
                    >
                        <DialogContent>
                            <DialogContentText>
                                {this.state.deleting.message}
                            </DialogContentText>
                        </DialogContent>
                    </Dialog>
                }
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" key="tools">
                                { 
                                    this.props.selection ? 
                                    <Radio
                                        checked={!this.state.selected}
                                        onChange={this.selectionChanged}
                                        value=""
                                    />:
                                    null
                                }
                            </TableCell>
                            { this.props.header.map(column => <TableCell align="center" key={column.id}>{column.label}</TableCell>) }
                            { this.props.deletion ? <TableCell align="center" key="deletion" /> : null }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.elements.dataChunk.map(element =>
                                <TableRow key={this.props.keyProvider(element)}>
                                    <TableCell align="center" key="tools">
                                        { 
                                            this.props.selection ? 
                                            <Radio
                                                checked={this.state.selected === this.props.keyProvider(element)}
                                                onChange={this.selectionChanged}
                                                value={this.props.keyProvider(element)}
                                            />:
                                            <IconButton component={Link} to={this.props.editRedirection(element)}>
                                                <EditIcon />
                                            </IconButton>
                                        }
                                    </TableCell>
                                    { this.props.disassemble(element).map(prop => <TableCell align="center" key={prop.id}>{prop.value}</TableCell>) }
                                    { 
                                        this.props.deletion ? 
                                        <TableCell align="center" key="deletion">
                                            <IconButton onClick={() => this.deleteItem(this.props.keyProvider(element))}>
                                                <DeleteForeverIcon />
                                            </IconButton>
                                        </TableCell> : 
                                        null 
                                    }
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