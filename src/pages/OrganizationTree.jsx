import React from 'react';

import TreeView from '../components/TreeView';

import {getOrganizationTree} from '../api/api';

const OrganizationTree = () =>
    <TreeView
        elementProvider={getOrganizationTree}
        elementStringifier={(organization) => organization.name}
        itemPathProvider={(id) => `/organizations/${id}`}
        keyProvider={(organization) => organization.id}
        root="Организации"
    />;

export default OrganizationTree;