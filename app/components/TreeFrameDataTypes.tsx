"use client"


import { Tree, TreeEventNodeEvent, TreeExpandedKeysType } from 'primereact/tree'
import { TreeNode } from 'primereact/treenode';
import React, { useContext, useEffect, useState } from 'react'
import { getDataFromDataType, getDataTypes } from '../public/connectionDataTypes';
import { remove_quotes, updateTreeNode } from '../public/utils';
import { get_caption } from '../public/connection';
import { SubjectContext } from './SubjectProvider';


function TreeFrameDataTypes() {
    const { changeSelectedSubject } = useContext(SubjectContext);

    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<TreeExpandedKeysType>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        getDataTypes().then((datatypes:Array<[string, string|null, string|null, boolean]>) => {
            let currentNodes:TreeNode[] = [];

            // get root node
            for (let i = 0; i < datatypes.length; i++) {
                if (datatypes[i][2] == null) {
                    const root = datatypes[i];

                    currentNodes.push({
                        id: root[0],
                        key: root[0],
                        label: root[1]? remove_quotes(root[1] as string): root[0],
                        expanded: true,
                        style: {marginLeft: 4, padding: "0px 0px 0px 8px", cursor: "pointer"},
                        leaf: false,
                        children: []
                    });
                    break;
                }
            }

            let next_nodes:TreeNode[] = [currentNodes[0]];
            let toBeExpanded:TreeExpandedKeysType = {};

            while (next_nodes.length > 0) {
                const curr_node =  next_nodes.shift() as TreeNode;

                for (let i = 0; i < datatypes.length; i++) {
                    if (datatypes[i][2] && datatypes[i][2] == curr_node.id && curr_node.children) {
                        //curr_node.expanded = true;
                        toBeExpanded[curr_node.id] = true;

                        curr_node.children.push({
                            id: datatypes[i][0],
                            key: datatypes[i][0],
                            label: datatypes[i][1]? remove_quotes(datatypes[i][1] as string): datatypes[i][0],
                            style: {marginLeft: 4, padding: "0px 0px 0px 8px", cursor: "pointer"},
                            leaf: false,
                            children: []
                        });

                        next_nodes.push(curr_node.children[curr_node.children.length -1]);
                    }
                }
            }

            setNodes(currentNodes);
            setExpandedKeys(toBeExpanded);
            setLoading(false);
        })
    }, []);

    const handleExpand = async (event:TreeEventNodeEvent) => {
        loadDataFromDatatype(event.node);
    }

    async function loadDataFromDatatype(node: TreeNode) {
        if (!node.id) {
            console.log("Missing ID on node", node);
            return;
        }

        setLoading(true);
        const data:Array<[string, string|null]> = await getDataFromDataType(node.id);
        let node_copy = { ...node };
        if (!node_copy.children) {
            node_copy.children = [];
        }

        let datasourceCaptionMap:Record<string, string|null> = {};
        for (let i = 0; i < data.length; i++) {
            const namespace = data[i][0].substring(0, data[i][0].indexOf(":"));
            if (!datasourceCaptionMap[namespace]) {
                datasourceCaptionMap[namespace] = await get_caption(`${namespace}:${namespace}`);
            }

            let child_label = data[i][1]? remove_quotes(data[i][1] as string): data[i][0];
            child_label += ` (${datasourceCaptionMap[namespace]})`;

            node_copy.children.push({
                id: data[i][0],
                key: data[i][0],
                label: child_label,
                style: {marginLeft: 4, padding: "0px 0px 0px 8px", cursor: "pointer"},
                leaf: true,
            });
        }

        const updatedNodes = updateTreeNode(nodes[0], node_copy);
        setNodes([updatedNodes]);
        setLoading(false);
    }

    const selectNode = async (event:TreeEventNodeEvent) => {
        if (!event.node.id) return;

        changeSelectedSubject(event.node.id);
    }

    return (
        <Tree 
        expandedKeys={expandedKeys} 
        onToggle={(e) => setExpandedKeys(e.value)} 
        onNodeClick={selectNode} // show on 
        //header={headerTemplate} 
        value={nodes} 
        filter 
        filterMode="lenient" 
        onExpand={handleExpand} 
        loading={loading} 
        className="frame" />
    )
}

export default TreeFrameDataTypes