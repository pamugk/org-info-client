const API = "http://localhost:8081/api";

const getList = (entity, offset, limit, search) => {
    var url = new URL(`${API}/${entity}/list`);
    url.search = new URLSearchParams({offset: offset, limit: limit, search: search}).toString();
    return fetch(url, { mode: 'cors' });
};

export const getEmployeeList = (offset, limit, search) => getList('employees', offset, limit, search);
export const getOrganizationList = (offset, limit, search) => getList('organizations', offset, limit, search);
