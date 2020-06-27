import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import Alert from '@material-ui/lab/Alert';
import TreeItem from '@material-ui/lab/TreeItem';
import MuiTreeView from '@material-ui/lab/TreeView';

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RefreshIcon from '@material-ui/icons/Refresh';

class TreeView extends React.Component {
    static propTypes = {
        elementProvider: PropTypes.func.isRequired,
        elementStringifier: PropTypes.func.isRequired,
        itemPathProvider: PropTypes.func.isRequired,
        keyProvider: PropTypes.func.isRequired,
        limit: PropTypes.number,
        root: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            expandedNodes: [],
            nodes: new Map([[null, { label: props.root, page: 0 }]]),
            selectedNodes: []
        }
        this.expansionStates = new Map();
        this.handleChildrenResponse = this.handleChildrenResponse.bind(this);
        this.refreshNodeChildren = this.refreshNodeChildren.bind(this);
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
    handleToggle = (event, nodeIds) => {
        nodeIds.forEach(nodeId => this.nodeExpanded(nodeId === "" ? null : nodeId));
        this.setState({expandedNodes: nodeIds});
    }

    nodeExpanded(id) {
        this.expansionStates.set(id, !this.expansionStates.has(id) || !this.expansionStates.get(id));
        if (this.expansionStates.get(id) && typeof this.state.nodes.get(id).children == "undefined")
            this.requestNodeChildren(id, this.state.nodes.get(id).page);
    }

    redirectToItem = (id) => this.setState({redirect: this.props.itemPathProvider(id)});

    refreshNodeChildren(id, page) {
        this.setState({
            nodes: new Map([
                ...this.state.nodes, 
                [id, {
                    ...this.state.nodes.get(id), 
                    children: undefined, 
                    error: null, 
                    page: page, 
                    prevChildren: this.state.nodes.get(id).children, 
                    totalCount: undefined
                }]
            ])
        });
        this.requestNodeChildren(id, page);
    }

    requestNodeChildren(id, page) {
        if (this.state.nodes.get(id).error)
            this.updateNodeError(null);
        this.props.elementProvider({
                id:id?id:undefined, 
                limit:this.props.limit, 
                offset: typeof this.props.limit == "undefined" ? undefined : this.props.limit * page
            })
            .then((response) => this.handleChildrenResponse(id, response))
            .catch(error => this.updateNodeError(id, "Нет соединения с сервером"));
    }

    traverseNode = (id) =>
        <TreeItem
            key={id ? id : ''}
            label = {this.state.nodes.get(id).label}
            nodeId = {id ? id : ''}
        >
            <Box>
                {
                    id ?
                    <IconButton onClick={() => this.redirectToItem(id)} size="small">
                        <EditIcon />
                    </IconButton> : null
                }
                {
                    typeof this.state.nodes.get(id).children != "undefined" ||
                    this.state.nodes.get(id).error ?
                    <IconButton onClick={() => this.refreshNodeChildren(id, 0)} size="small">
                        <RefreshIcon />
                    </IconButton> : 
                    null
                }
            </Box>
            {
                typeof this.props.limit != "undefined" && this.state.nodes.get(id).page > 0 ?
                <IconButton onClick={() => this.refreshNodeChildren(id, this.state.nodes.get(id).page - 1)}>
                    <ArrowUpward />
                </IconButton> : 
                null
            }
            {
                this.state.nodes.get(id).error ?  
                <Alert component={Box} margin="auto" severity="info">{this.state.nodes.get(id).error}</Alert> :
                typeof this.state.nodes.get(id).children == "undefined" ?
                <Box margin="auto"><CircularProgress /></Box> :
                this.state.nodes.get(id).children.length === 0 ?
                <Alert component={Box} margin="auto" severity="info">Ничего не найдено</Alert> :
                this.state.nodes.get(id).children.map(childId => this.traverseNode(childId))
            }
            {
                typeof this.props.limit != "undefined" &&
                    (this.state.nodes.get(id).page + 1) * this.props.limit < this.state.nodes.get(id).totalCount ?
                <IconButton onClick={() => this.refreshNodeChildren(id, this.state.nodes.get(id).page + 1)}>
                    <ArrowDownward />
                </IconButton> : null
            }
        </TreeItem>;

    traverseNodeIds = (id) =>
        [id, ...(
            typeof this.state.nodes.get(id).children == "undefined" ? [] : 
            this.state.nodes.get(id).children.reduce((result, key) => [...result, ...this.traverseNodeIds(key)], [])
        )];

    updateNode(id, data) {
        if (!this.state.nodes.has(id))
            return;
        const newChildren = data.nodes.map(element => this.props.keyProvider(element.value));
        const redundantNodeIds = 
            new Set(typeof this.state.nodes.get(id).prevChildren == "undefined" ? [] :
            [...this.state.nodes.get(id).prevChildren.filter(key => !newChildren.includes(key))
            .reduce((result, key) => [...result, ...this.traverseNodeIds(key)], [])]);
        this.expansionStates = new Map([...this.expansionStates].filter(pair => !redundantNodeIds.has(pair.key)));
        this.setState(
            {
                selectedNodes: [...this.state.selectedNodes].filter(node => !redundantNodeIds.has(node)),
                expandedNodes: [...this.state.expandedNodes].filter(node => !redundantNodeIds.has(node)),
                nodes: new Map([
                    ...[...this.state.nodes].filter(pair => !redundantNodeIds.has(pair[0])),
                    [id, {
                        ...this.state.nodes.get(id),
                        page: typeof this.state.nodes.get(id).page == "undefined" ? 0 : this.state.nodes.get(id).page,
                        totalCount: data.totalCount,
                        children: newChildren
                    }],
                    ...data.nodes.map(
                        child => [
                            this.props.keyProvider(child.value), {
                                label: this.props.elementStringifier(child.value),
                                children: child.hasChildren ? undefined : [],
                                page: 0
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

    render = () => this.state.redirect ? 
        <Redirect to={this.state.redirect} />: (
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