import React from 'react';
import Redirect from "react-router-dom/Redirect";

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import SearchableTable from '../components/SearchableTable';
import TextField from '@material-ui/core/TextField';

import { createOrganization, getOrganizationList, fetchOrganizationInfo, updateOrganization } from '../api/api';

class OrganizationEditor extends React.Component {
    constructor(props) {
        super(props);
        this.updating = typeof props.match.params.id != 'undefined';
        this.state = {
            openOrgDialog: false,
            organization: { id: props.match.params.id, name: "", parent: null },
            toMainPage: false,
            waitingResponse: this.updating,
            wrongInput: true
        }
        this.handleResponseOnInfoRequest = this.handleResponseOnInfoRequest.bind(this);
        this.handleResponseOnSubmitRequest = this.handleResponseOnSubmitRequest.bind(this);
        this.selectedParentChanged = this.selectedParentChanged.bind(this);
        this.onOrgDialogClose = this.onOrgDialogClose.bind(this);
    }

    componentDidMount() {
        if (this.updating)
            fetchOrganizationInfo(this.state.organization.id)
            .then(this.handleResponseOnInfoRequest)
            .catch(error => this.setState({criticalError: 'Нет соединения с сервером, попробуйте позднее', waitingResponse:false}));
    }

    nameChangeHandler = (event) =>
        this.setState({organization: { ...this.state.organization, name: event.target.value}, wrongInput: !event.target.value});

    handleResponseOnInfoRequest(response) {
        switch(response.code) {
            case 200: {
                response.json().then(json => {
                    this.selectedParent = json.data.parent;
                    this.setState({organization: json.data, waitingResponse:false});
                });
                break;
            }
            case 404: {
                this.setState({criticalError: 'Изменяемая организация не найдена', waitingResponse:false});
                break;
            }
            default:
                this.setState({criticalError: 'При получении информации об организации что-то пошло не так', waitingResponse:false});
        }
    };

    handleResponseOnSubmitRequest(response) {
        switch(response.code) {
            case 200:
            case 201: {
                this.setState({toMainPage: true});
                break;
            }
            case 404:
            case 406: {
                response.json().then(json => this.setState({error: json.data, waitingResponse:false}));
                break;
            }
            default:
                this.setState({error: 'Попробуйте отправить запрос ещё разок :)', waitingResponse:false});
        }
    }

    tempParent = null;

    selectedParentChanged = (selection) => this.tempParent = selection;

    onOrgDialogClose() {
        this.setState({organization: {...this.state.organization, parent: this.tempParent}, openOrgDialog:false});
    }

    parentBtnClicked = () => this.setState({openOrgDialog: true})

    submit = () => 
        (this.updating ? updateOrganization : createOrganization)(this.state.organization)
            .then(this.handleResponseOnSubmitRequest)
            .catch(error => this.setState({error: 'Нет соединения с сервером, попробуйте позднее', waitingResponse:false}));
    
    static header = [
        {id:"id", label:"ID"}, {id:"name", label:"Название организации"},
        {id:"parent", label:"Головная организация"}];
    static disassembleOrganization = organization => [organization.id, organization.name, organization.parentName];
    static organizationKey = (organization) => organization.id;

    render = () => this.state.toMainPage ?
        <Redirect to="/" /> : (
            <Box margin="auto">
                {
                    this.state.criticalError ? <p>{this.state.criticalError}</p> :
                    this.waitingResponse ? <CircularProgress /> :
                    <>
                        <FormControl>
                            { typeof this.state.error == "undefined" ? null : <p>{this.state.error}</p>}
                            <TextField
                                error={this.state.wrongInput}
                                helperText={!this.state.error ? null : "Название не может быть пустым"}
                                label="Название организации"
                                onChange={this.nameChangeHandler}
                                value={this.state.organization.name}
                            />
                            <Button
                                onClick={this.parentBtnClicked}
                            >
                                {
                                    this.state.organization.parent ?
                                    `В качестве головной выбрана организация с идентификатором ${this.state.organization.parent}` :
                                    "Головной организации нет"
                                }
                            </Button>
                            <Button
                                disabled={this.state.wrongInput}
                                onClick={this.submit}
                            >
                                Сохранить
                            </Button>
                        </FormControl>
                        <Dialog onClose={this.onOrgDialogClose} open={this.state.openOrgDialog}>
                            <SearchableTable
                                disassemble={OrganizationEditor.disassembleOrganization}
                                elementProvider={getOrganizationList}
                                exclude={this.state.organization.id}
                                fetchCount={5}
                                header={OrganizationEditor.header}
                                selection={false}
                                onSelectionChanged={this.selectedParentChanged}
                            />
                        </Dialog>
                    </>
                }
            </Box>
        );
};

export default OrganizationEditor;