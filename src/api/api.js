const API = "http://localhost:8081/api";

const getList = (entity, params) => {
    var url = new URL(`${API}/${entity}/list`);
    url.search = new URLSearchParams(params).toString();
    return fetch(url, { mode: 'cors' });
};

const sendObject = (entity, method, obj) => fetch(`${API}/${entity}`, {
    body: JSON.stringify(obj),
    headers: { 'Content-Type': 'application/json' },
    method: method,
    mode: 'cors'
});

const sendParamsRequest = (entity, method, id) => {
    var url = new URL(`${API}/${entity}`);
    url.search = new URLSearchParams({id: id}).toString();
    return fetch(url, { method: method, mode: 'cors' });
};

export const createEmployee = (employee) => sendObject('employees', 'POST', employee);
export const createOrganization = (organization) => sendObject('organizations', 'POST', organization);
export const deleteEmployee = (id) => sendParamsRequest('employees', 'DELETE', id);
export const deleteOrganization = (id) => sendParamsRequest('organizations', 'DELETE', id);
export const fetchEmployeeInfo = (id) => sendParamsRequest('employees', 'GET', id);
export const fetchOrganizationInfo = (id) => sendParamsRequest('employees', 'GET', id);
export const getEmployeeList = (params) => getList('employees', params);
export const getOrganizationList = (params) => getList('organizations', params);
export const updateEmployee = (employee) => sendObject('employees', 'PUT', employee);
export const updateOrganization = (organization) => sendObject('organizations', 'PUT', organization);