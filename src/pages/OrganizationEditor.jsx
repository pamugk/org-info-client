import React from 'react';
import { Redirect, withRouter } from "react-router-dom";

import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import { createOrganization, fetchOrganizationInfo, updateOrganization } from '../api/api';
import { DialogTitle } from '@material-ui/core';
import OrganizationTable from '../components/OrganizationTable';

class OrganizationEditor extends React.Component {
    constructor(props) {
        super(props);
        this.updating = typeof props.match.params.id != 'undefined';
        this.state = {
            madeChanges: false,
            openOrgDialog: false,
            organization: { id: this.updating ? props.match.params.id: null, name: "", parent: null },
            parent: null,
            redirect: false,
            waitingResponse: this.updating,
            wrongInput: true
        }
        this.handleResponseOnInfoRequest = this.handleResponseOnInfoRequest.bind(this);
        this.handleResponseOnSubmitRequest = this.handleResponseOnSubmitRequest.bind(this);
        this.selectedParentChanged = this.selectedParentChanged.bind(this);
        this.onOrgDialogClose = this.onOrgDialogClose.bind(this);
        this.handleResponseOnParentInfo = this.handleResponseOnParentInfo.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        if (this.updating)
            fetchOrganizationInfo(this.state.organization.id)
            .then(this.handleResponseOnInfoRequest)
            .catch(error => this.setState({criticalError: "Нет соединения с сервером, попробуйте позднее", waitingResponse:false}));
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.organization.parent !== this.state.organization.parent
            && this.state.organization.parent)
            this.requestParentInfo();
    }

    requestParentInfo = () => 
        fetchOrganizationInfo(this.state.organization.parent)
            .then(this.handleResponseOnParentInfo)
            .catch(error => this.setState({error: "Соединение с сервером потеряно на неопределённое время"}));

    handleResponseOnParentInfo(response) {
        switch(response.status) {
            case 200: {
                response.json().then(json => this.setState({parent: json.data.name, wrongInput:false}));
                break;
            }
            case 404: {
                this.setState({parent: undefined});
                break;
            }
            default: this.requestParentInfo();
        }
    }

    nameChangeHandler = (event) =>
        this.setState({organization: { ...this.state.organization, name: event.target.value}, madeChanges:true, wrongInput: !event.target.value});

    handleResponseOnInfoRequest(response) {
        switch(response.status) {
            case 200: {
                response.json().then(json => {
                    this.tempParent = json.data.parent;
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
        switch(response.status) {
            case 200:
            case 201: {
                this.setState({redirect: true});
                break;
            }
            case 404: {
                this.setState({criticalError: "Редактируемая организация уже удалена кем-то ещё, советуем вам заняться чем-нибудь другим"})
                break;
            }
            case 406: {
                response.json().then(json => this.setState({error: json.data, waitingResponse:false, wrongInput:true}));
                break;
            }
            default:
                this.setState({error: 'Попробуйте отправить запрос ещё разок :)', waitingResponse:false});
        }
    }

    tempParent = null;

    selectedParentChanged(selection) {
        this.tempParent = selection;
    }

    onOrgDialogClose() {
        this.setState({organization: {...this.state.organization, parent: this.tempParent !== '' ? this.tempParent : null}, madeChanges:true, openOrgDialog:false});
    }

    parentBtnClicked = () => this.setState({openOrgDialog: true})

    submit() {
        this.setState({waitingResponse: true});
        (this.updating ? updateOrganization : createOrganization)(this.state.organization)
            .then(this.handleResponseOnSubmitRequest)
            .catch(error => this.setState({error: 'Нет соединения с сервером, попробуйте позднее', waitingResponse:false}));
    }
    
    static header = [
        {id:"id", label:"ID"}, {id:"name", label:"Название организации"},
        {id:"parentId", label:"ID головной организации"},{id:"parent", label:"Головная организация"}];
    static disassembleOrganization = organization =>  [
        {id:"id",value:organization.id}, {id:"name", value:organization.name}, 
        {id:"parentId", value: organization.parentId},{id:"parentName", value: organization.parentName}
    ];

    render = () => this.state.redirect ?
        <Redirect to="/organizations/list" /> : (
            <Box margin="auto">
                {
                    this.state.criticalError ? <Alert severity="error">{this.state.criticalError}</Alert> :
                    this.state.waitingResponse ? <CircularProgress /> :
                    <>
                        <FormControl>
                            { 
                                typeof this.state.error == "undefined" ? null :
                                <Alert severity="warning">{this.state.error}</Alert>
                            }
                            <TextField
                                error={this.state.wrongInput}
                                helperText={this.state.wrongInput ? "Название не может быть пустым" : null }
                                label="Название организации"
                                onChange={this.nameChangeHandler}
                                value={this.state.organization.name}
                            />
                            <Button
                                onClick={this.parentBtnClicked}
                            >
                                {
                                    !this.state.organization.parent ? "Головная организация не выбрана" :
                                    typeof this.state.parent === "undefined" ?
                                    "Выбранная вами в качестве головной организация была кем-то удалена. Советуем поменять ваш выбор" :
                                    <>
                                        {`Идентификатор головной организации: ${this.state.organization.parent}.`}<br/>
                                        {`Название ${this.state.parent ? `'${this.state.parent}'` : "пока загружается"}`}
                                    </>
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
                            <DialogTitle>Выберите головную организацию</DialogTitle>
                            <DialogContent>
                                <OrganizationTable
                                    deletion={false}
                                    disassemble={OrganizationEditor.disassembleOrganization}
                                    exclude={!this.state.organization.id ? undefined : this.state.organization.id}
                                    header={OrganizationEditor.header}
                                    selected={this.state.organization.parent}
                                    selection={true}
                                    onSelectionChanged={this.selectedParentChanged}
                                />
                            </DialogContent>
                        </Dialog>
                    </>
                }
            </Box>
        );
};

export default withRouter(OrganizationEditor);