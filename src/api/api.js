const API = "http://localhost:8081/api";

const getList = (entity, page, count, search) => {
    var url = new URL(`${API}/${entity}/list`);
    url.search = new URLSearchParams({page: page, count: count, search: search}).toString();
    return fetch(url, { mode: 'cors' });
};

export const getEmployeeList = (page, count, search) => getList('employees', page, count, search);
export const getOrganizationList = (page, count, search) => getList('organizations', page, count, search);
