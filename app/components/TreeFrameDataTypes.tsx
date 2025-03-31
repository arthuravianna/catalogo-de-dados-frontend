"use client"


import { Tree, TreeEventNodeEvent, TreeExpandedKeysType } from 'primereact/tree'
import { TreeNode } from 'primereact/treenode';
import React, { useContext, useEffect, useState } from 'react'
import { getDatatypeAndMetrics, getDataTypesRoots } from '@api/catalogo/connectionDataTypes';
import { remove_quotes, updateTreeNode } from '../public/utils';
import { get_caption } from '@api/catalogo/connection';
import { SubjectContext } from './SubjectProvider';


function TreeFrameDataTypes() {
    const { changeSelectedSubject } = useContext(SubjectContext);

    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<TreeExpandedKeysType>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        getDataTypesRoots().then((roots: Array<[string, string|null]>) => {
            let currentNodes:TreeNode[] = [];
            for (let i = 0; i < roots.length; i++) {
                currentNodes.push({
                    id: roots[i][0],
                    key: roots[i][0],
                    label: roots[i][1]? remove_quotes(roots[i][1] as string): roots[i][0],
                    expanded: false,
                    style: {marginLeft: 4, padding: "0px 0px 0px 8px", cursor: "pointer"},
                    leaf: false,
                    children: []
                });
            }

            setNodes(currentNodes);
            setExpandedKeys({});
            setLoading(false);
        })
        // getDataTypes().then((datatypes:Array<[string, string|null, string|null, boolean]>) => {
        //     let currentNodes:TreeNode[] = [];

        //     // get root node
        //     for (let i = 0; i < datatypes.length; i++) {
        //         if (datatypes[i][2] == null) {
        //             const root = datatypes[i];

        //             currentNodes.push({
        //                 id: root[0],
        //                 key: root[0],
        //                 label: root[1]? remove_quotes(root[1] as string): root[0],
        //                 expanded: true,
        //                 style: {marginLeft: 4, padding: "0px 0px 0px 8px", cursor: "pointer"},
        //                 leaf: false,
        //                 children: []
        //             });
        //             break;
        //         }
        //     }

        //     let next_nodes:TreeNode[] = [currentNodes[0]];
        //     let toBeExpanded:TreeExpandedKeysType = {};

        //     while (next_nodes.length > 0) {
        //         const curr_node =  next_nodes.shift() as TreeNode;

        //         for (let i = 0; i < datatypes.length; i++) {
        //             if (datatypes[i][2] && datatypes[i][2] == curr_node.id && curr_node.children) {
        //                 //curr_node.expanded = true;
        //                 toBeExpanded[curr_node.id] = true;

        //                 curr_node.children.push({
        //                     id: datatypes[i][0],
        //                     key: datatypes[i][0],
        //                     label: datatypes[i][1]? remove_quotes(datatypes[i][1] as string): datatypes[i][0],
        //                     style: {marginLeft: 4, padding: "0px 0px 0px 8px", cursor: "pointer"},
        //                     leaf: false,
        //                     children: []
        //                 });

        //                 next_nodes.push(curr_node.children[curr_node.children.length -1]);
        //             }
        //         }
        //     }

        //     setNodes(currentNodes);
        //     setExpandedKeys(toBeExpanded);
        //     setLoading(false);
        // })
    }, []);

    const handleExpand = async (event:TreeEventNodeEvent) => {
        loadDataFromDatatype(event.node);
    }

    async function loadDataFromDatatype(node: TreeNode) {
        if (!node.id) {
            console.log("Missing ID on node", node);
            return;
        }

        if (node.children && node.children.length > 0) return;

        setLoading(true);
        let node_copy = { ...node };
        const data:Array<[string, string|null, boolean]> = await getDatatypeAndMetrics(node.id);

        if (!node_copy.children) {
            node_copy.children = [];
        }

        let datasourceCaptionMap:Record<string, string|null> = {};
        for (let i = 0; i < data.length; i++) {
            let child_label = data[i][1]? remove_quotes(data[i][1] as string): data[i][0];
            let is_metric:boolean = data[i][2];

            if (is_metric) {
                const namespace = data[i][0].substring(0, data[i][0].indexOf(":"));
                if (!datasourceCaptionMap[namespace]) {
                    datasourceCaptionMap[namespace] = await get_caption(`${namespace}:${namespace}`);
                }    

                child_label += ` (${datasourceCaptionMap[namespace]})`;
            }

            node_copy.children.push({
                id: data[i][0],
                key: data[i][0],
                label: child_label,
                style: {marginLeft: 4, padding: "0px 0px 0px 8px", cursor: "pointer"},
                leaf: is_metric,
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