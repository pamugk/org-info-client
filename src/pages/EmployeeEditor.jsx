import React from 'react';
import { Redirect, withRouter } from "react-router-dom";

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import SearchableTable from '../components/SearchableTable';
import TextField from '@material-ui/core/TextField';

import { 
    createEmployee, getOrganizationList, getEmployeeList, 
    fetchEmployeeInfo, fetchOrganizationInfo, updateEmployee
} from '../api/api';
import { DialogTitle } from '@material-ui/core';

class EmployeeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.updating = typeof props.match.params.id != 'undefined';
        this.state = {
            chief: null,
            employee: { 
                id: this.updating ? props.match.params.id: null, name: "",
                organization:null, chief:null
            },
            madeChanges: false,
            openChiefDialog: false,
            openOrgDialog: false,
            organization: null,
            redirect: false,
            waitingResponse: this.updating,
            wrongName: true,
            wrongOrg: true
        }
        this.handleResponseOnInfoRequest = this.handleResponseOnInfoRequest.bind(this);
        this.handleResponseOnOrgInfo = this.handleResponseOnOrgInfo.bind(this);
        this.handleResponseOnChiefInfo = this.handleResponseOnChiefInfo.bind(this);
        this.handleResponseOnSubmitRequest = this.handleResponseOnSubmitRequest.bind(this);
        this.selectedOrganizationChanged = this.selectedOrganizationChanged.bind(this);
        this.selectedChiefChanged = this.selectedChiefChanged.bind(this);
        this.onOrgDialogClose = this.onOrgDialogClose.bind(this);
        this.onChiefDialogClose = this.onChiefDialogClose.bind(this);
    }

    componentDidMount() {
        if (this.updating)
            fetchEmployeeInfo(this.state.employee.id)
            .then(this.handleResponseOnInfoRequest)
            .catch(error => this.setState({criticalError: "Нет соединения с сервером, попробуйте позднее", waitingResponse:false}));
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.employee.organization !== this.state.employee.organization
            && this.state.employee.organization)
            this.requestOrgInfo();
        if (prevState.employee.chief !== this.state.employee.chief
            && this.state.employee.chief)
            this.requestChiefInfo();
    }

    requestOrgInfo = () => 
        fetchOrganizationInfo(this.state.employee.organization)
            .then(this.handleResponseOnOrgInfo)
            .catch(error => this.setState({error: "Соединение с сервером потеряно на неопределённое время"}));

    handleResponseOnOrgInfo(response) {
        switch(response.status) {
            case 200: {
                response.json().then(json => this.setState({organization: json.data.name}));
                break;
            }
            case 404: {
                this.setState({organization: undefined});
                break;
            }
            default: this.requestParentInfo();
        }
    }

    requestChiefInfo = () => 
        fetchOrganizationInfo(this.state.employee.chief)
            .then(this.handleResponseOnChiefInfo)
            .catch(error => this.setState({error: "Соединение с сервером потеряно на неопределённое время"}));

    handleResponseOnChiefInfo(response) {
        switch(response.status) {
            case 200: {
                response.json().then(json => this.setState({chief: json.data.name}));
                break;
            }
            case 404: {
                this.setState({chief: undefined});
                break;
            }
            default: this.requestParentInfo();
        }
    }

    nameChangeHandler = (event) =>
        this.setState({
            employee: { 
                ...this.state.employee, name: event.target.value},
            madeChanges: true,
            wrongName: !event.target.value
        });

    handleResponseOnInfoRequest(response) {
        switch(response.status) {
            case 200: {
                response.json().then(json => {
                    this.tempChief = json.data.chief;
                    this.tempOrganization = json.data.organization;
                    this.setState({employee: json.data, waitingResponse:false, wrongName: false, wrongOrg: false});
                });
                break;
            }
            case 404: {
                this.setState({criticalError: "Изменяемый сотрудник не найден", waitingResponse:false});
                break;
            }
            default:
                this.setState({criticalError: "При получении информации о сотруднике что-то пошло не так", waitingResponse:false});
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
                this.setState({criticalError: "Редактируемый сотрудник уже удален кем-то ещё, советуем вам заняться чем-нибудь другим"});
                break;
            }
            case 406: {
                response.json().then(json => this.setState({error: json.data, waitingResponse:false}));
                break;
            }
            default:
                this.setState({error: "Попробуйте отправить запрос ещё разок :)", waitingResponse:false});
        }
    }

    tempChief = null;
    tempOrganization = null;

    selectedChiefChanged = (selection) => this.tempChief = selection;
    selectedOrganizationChanged = (selection) => this.tempOrganization = selection;

    onOrgDialogClose() {
        this.setState(
            {
                employee: {
                    ...this.state.employee,
                    chief: this.state.employee.organization === this.tempOrganization ? this.state.employee.chief : null, 
                    organization: this.tempOrganization === '' ? null : this.tempOrganization
                }, 
                madeChanges: true,
                openOrgDialog:false,
                wrongOrg: !this.tempOrganization
            });
    }

    onChiefDialogClose() {
        this.setState(
            {
                employee: {
                    ...this.state.employee, chief: this.tempChief === '' ? null : this.tempChief
                },
                madeChanges: true,
                openChiefDialog:false
            });
    }

    orgBtnClicked = () => this.setState({openOrgDialog: true});
    chiefBtnClicked = () => this.setState({openChiefDialog: true});

    submit = () => 
        (this.updating ? updateEmployee : createEmployee)(this.state.employee)
            .then(this.handleResponseOnSubmitRequest)
            .catch(error => this.setState({error: "Нет соединения с сервером, попробуйте позднее", waitingResponse:false}));
    
    static orgHeader = [
        {id:"id", label:"ID"}, {id:"name", label:"Название организации"}, {id:"parent", label:"Головная организация"}];
    static disassembleOrganization = organization => [organization.id, organization.name, organization.parentName];
    static organizationKey = (organization) => organization.id;
    
    static empHeader = [{id:"id", label:"ID"}, {id:"name", label:"Имя сотрудника"}, {id:"chief", label:"Руководитель"}];
    static disassembleEmployee = employee =>  [
        {id: "id", value:employee.id}, {id: "name", value: employee.name}, {id:"chief", value:employee.chief}
    ];
    static employeeKey = (employee) => employee.id;

    render = () => this.state.redirect ?
        <Redirect to="/employees/list" /> : (
            <Box margin="auto">
                {
                    this.state.criticalError ? <p>{this.state.criticalError}</p> :
                    this.waitingResponse ? <CircularProgress /> :
                    <>
                        <FormControl>
                            { typeof this.state.error == "undefined" ? null : <p>{this.state.error}</p>}
                            <TextField
                                error={this.state.wrongName}
                                helperText={this.state.wrongName ? "Название не может быть пустым" : null }
                                label="Название организации"
                                onChange={this.nameChangeHandler}
                                value={this.state.organization.name}
                            />
                            <Button
                                onClick={this.orgBtnClicked}
                            >
                                {
                                    !this.state.employee.organization ? "Для сотрудника не выбрано организации" :
                                    typeof this.state.organization === "undefined" ?
                                    "Выбранная организация была кем-то удалена. Советуем поменять ваш выбор" :
                                    <>
                                        {`Идентификатор организации: ${this.state.employee.organization}.`}<br/>
                                        {`Название ${this.state.parent ? `'${this.state.parent}'` : "пока загружается"}`}
                                    </>
                                }
                            </Button>
                            <Button
                                onClick={this.chiefBtnClicked}
                            >
                                {
                                    !this.state.employee.organization ? "Для сотрудника не выбрано руководителя" :
                                    typeof this.state.chief === "undefined" ?
                                    "Выбранный вами в качестве руководителя сотрудник был кем-то удалена. Советуем поменять ваш выбор" :
                                    <>
                                        {`Идентификатор руководителя: ${this.state.employee.organization}.`}<br/>
                                        {`Имя ${this.state.parent ? `'${this.state.parent}'` : "пока загружается"}`}
                                    </>
                                }
                            </Button>
                            <Button
                                disabled={!this.madeChanges || this.state.wrongName || this.state.wrongOrg}
                                onClick={this.submit}
                            >
                                Сохранить
                            </Button>
                        </FormControl>
                        <Dialog onClose={this.onOrgDialogClose} open={this.state.openOrgDialog}>
                            <DialogTitle>Выберите организацию</DialogTitle>
                            <SearchableTable
                                deletion={false}
                                disassemble={EmployeeEditor.disassembleOrganization}
                                elementProvider={getOrganizationList}
                                fetchCount={5}
                                header={EmployeeEditor.orgHeader}
                                keyProvider={EmployeeEditor.organizationKey}
                                selected={this.state.employee.organization}
                                selection={true}
                                onSelectionChanged={this.selectedOrganizationChanged}
                            />
                        </Dialog>
                        <Dialog onClose={this.onChiefDialogClose} open={this.state.openChiefDialog}>
                            <DialogTitle>Выберите руководителя</DialogTitle>
                            <SearchableTable
                                deletion={false}
                                disassemble={EmployeeEditor.disassembleEmployee}
                                elementProvider={getEmployeeList}
                                exclude={[this.state.employee.id, this.state.employee.organization]}
                                fetchCount={5}
                                header={EmployeeEditor.empHeader}
                                keyProvider={EmployeeEditor.employeeKey}
                                selected={this.state.employee.chief}
                                selection={true}
                                onSelectionChanged={this.selectedChiefChanged}
                            />
                        </Dialog>
                    </>
                }
            </Box>
        );
};

export default withRouter(EmployeeEditor);