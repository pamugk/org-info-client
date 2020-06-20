import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import Alert from '@material-ui/lab/Alert';
import TreeItem from '@material-ui/lab/TreeItem';
import MuiTreeView from '@material-ui/lab/TreeView';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

class TreeView extends React.Component {
    static propTypes = {
        elementProvider: PropTypes.func.isRequired,
        elementStringifier: PropTypes.func.isRequired,
        keyProvider: PropTypes.func.isRequired,
        root: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            expandedNodes: [],
            nodes: new Map([[null, { label: props.root }]]),
            selectedNodes: []
        }
        this.handleChildrenResponse = this.handleChildrenResponse.bind(this);
        this.updateNode = this.updateNode.bind(this);
    }
    
    handleChildrenResponse (id, response) {
        switch (response.status) {
            case 200: {
                response.json().then(json => this.updateNode(id, json.data));
                break;
            }
            case 404: {
                response.json().then(json => this.updateNodeError(id, json.data));
                break;
            }
            default: {
                this.updateNodeError(id, "При получении дочерних элементов что-то пошло не так");
                break;
            }
        }
    };

    handleSelection = (event, nodeIds) => this.setState({selectedNodes: nodeIds});
    handleToggle = (event, nodeIds) => this.setState({expandedNodes: nodeIds});

    requestNodeChildren(id) {
        if (typeof this.state.nodes.get(id).children == "undefined") {
            this.updateNodeError(null);
            this.props.elementProvider(id)
            .then((response) => this.handleChildrenResponse(id, response))
            .catch(error => this.updateNodeError(id, "Нет соединения с сервером"));
        }
    }

    traverseNode = (id) =>
        <TreeItem
            label = {this.state.nodes.get(id).label}
            nodeId = {id ? id : ''}
            onIconClick = { () => { this.requestNodeChildren(id)}}
        >
            {
                this.state.nodes.get(id).error ?  
                <Alert component={Box} margin="auto" severity="info">{this.state.nodes.get(id).error}</Alert> :
                typeof this.state.nodes.get(id).children == "undefined" ?
                <Box margin="auto"><CircularProgress /></Box> :
                this.state.nodes.get(id).children.length === 0 ?
                <Alert component={Box} margin="auto" severity="info">Ничего не найдено</Alert> :
                this.state.nodes.get(id).children.map(childId => this.traverseNode(childId))
            }
        </TreeItem>;

    traverseNodeIds = (id) =>
        [id, ...(
            typeof this.state.nodes.get(id).children == undefined ? [] : 
            this.state.nodes.get(id).children.map(key => this.traverseNodeIds(key))
        )];

    updateNode(id, data) {
        if (!this.state.nodes.has(id))
            return;
        if (data.length === 0)
            this.setState(
                {
                    nodes: new Map(
                        ...this.state.nodes.entries(), 
                        [id, {...this.state.nodes.get(id), children: []}]
                    )
                }
            );
        const newChildren = data.map(element => this.props.keyProvider(element.value));
        const redundantNodeIds = 
            new Set(typeof this.state.nodes.get(id).children == "undefined" ? [] :
            [...this.state.nodes.get(id).children.filter(key => !newChildren.includes(key))
            .map(key => this.traverseNodeIds(key))]);
        this.setState(
            {
                selectedNodes: this.state.selectedNodes.filter(node => !redundantNodeIds.has(node)),
                expandedNodes: this.state.expandedNodes.filter(node => !redundantNodeIds.has(node)),
                nodes: new Map([
                    ...[...this.state.nodes].filter(pair => !redundantNodeIds.has(pair.key)),
                    ...newChildren.map(
                        child => [
                            this.props.keyProvider(child.value),
                            this.state.nodes.has(this.props.keyProvider(child.value)) ? {
                                ...this.state.nodes.get(id), 
                                label: this.props.elementStringifier(child.value),
                                children: child.hasChildren ? this.state.nodes.get(id).children : []
                            } : {
                                label: this.props.elementStringifier(child.value),
                                children: child.hasChildren ? undefined : []
                            }
                        ]
                    )])
            }
        );
    };

    updateNodeError = (id, error) => this.setState({
        nodes: new Map([
            ...this.state.nodes, 
            [id, {...this.state.nodes.get(id),  error: error}]
        ])
    });

    render = () => (
        <MuiTreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            expanded = {this.state.expandedNodes}
            selected = {this.state.selectedNodes}
            onNodeSelect = {this.handleSelection}
            onNodeToggle = {this.handleToggle}
        >
            {this.traverseNode(null)}
        </MuiTreeView>
    )
}

export default TreeView;