import SERVER from '../setup';

const API = `${SERVER}/api`;

const cleanUp = obj => Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : {});

const sendObject = (entity, method, obj) => fetch(`${API}/${entity}`, {
    body: JSON.stringify(obj),
    headers: { 'Content-Type': 'application/json' },
    method: method,
    mode: 'cors'
});

const sendParamsRequest = (entity, method, params) => {
    var url = new URL(`${API}/${entity}`);
    cleanUp(params);
    url.search = new URLSearchParams(params).toString();
    return fetch(url, { method: method, mode: 'cors' });
};

export const createEmployee = (employee) => sendObject('employees', 'POST', employee);
export const createOrganization = (organization) => sendObject('organizations', 'POST', organization);

export const deleteEmployee = (id) => sendParamsRequest('employees', 'DELETE', {id:id});
export const deleteOrganization = (id) => sendParamsRequest('organizations', 'DELETE', {id:id});

export const fetchEmployeeInfo = (id) => sendParamsRequest('employees', 'GET', {id:id});
export const fetchOrganizationInfo = (id) => sendParamsRequest('organizations', 'GET', {id:id});

export const getEmployeeList = (params) => sendParamsRequest('employees/list', 'GET', params);
export const getOrganizationList = (params) => sendParamsRequest('organizations/list', 'GET', params);

export const getEmployeeTree = (params) => sendParamsRequest('employees/tree', 'GET', params);
export const getOrganizationTree = (params) => sendParamsRequest('organizations/tree', 'GET', params);

export const updateEmployee = (employee) => sendObject('employees', 'PUT', employee);
export const updateOrganization = (organization) => sendObject('organizations', 'PUT', organization);