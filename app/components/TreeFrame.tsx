
"use client"


import React, { useState, useEffect, useContext } from 'react';
import { Tree, TreeEventNodeEvent, TreeHeaderTemplateOptions } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import { SubjectContext } from './SubjectProvider';
import { query_namespace_roots, query_relation_predicates } from '../public/connection';

function format_string(s:string) {
    const chars = ["'", "\""]

    if (chars.includes(s[0]) && chars.includes(s[s.length-1]) && s.length > 2)
        return s.substring(1, s.length-1);
    return s;
}

function updateTreeNode(curr_node:TreeNode, node:TreeNode) {
    console.log(curr_node.key, node.key)
    if (curr_node.key == node.key) {
        console.log("found");
        return node;
    }
    if (!curr_node.children) return curr_node;

    for (let i = 0; i < curr_node.children.length; i++) {
        curr_node.children[i] = updateTreeNode(curr_node.children[i], node);
    }

    return curr_node;
}


function TreeFrame() {
    const { view, namespace, changeSubject } = useContext(SubjectContext);
    
    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!namespace) return;

        const namespace_root = async() => {
            setLoading(true);

            let data = (await query_namespace_roots(namespace.namespace)).result

            if (data.length == 0) {
                setLoading(false);
                return;
            }
        
            // [root, root_label, root_child, root_child_label]
            const rootPosition = 0
            const rootLabelPosition = 1
            const rootChildPosition = 2
            const rootChildLabelPosition = 3
        
            let node:TreeNode = {
                id: data[rootPosition][rootPosition],
                key: data[rootPosition][rootPosition],
                label: data[rootPosition][rootLabelPosition]? format_string(data[rootPosition][rootLabelPosition]): data[rootPosition][rootPosition],
                expanded: true,
                children: []
            };
        
            for (let i = 0; i < data.length; i++) {
                node.children?.push(
                    {
                        id: data[i][rootChildPosition],
                        key: data[i][rootChildPosition],
                        label: data[i][rootChildLabelPosition]? format_string(data[i][rootChildLabelPosition]): data[i][rootChildPosition],
                        leaf: false,
                        style: {marginLeft: 4, padding: "0px 0px 0px 8px"}
                    }
                );
            }
        
            setNodes([node]);
            setLoading(false);
        }

        namespace_root();
    }, [namespace]);


    const loadNewSubject = async (event:TreeEventNodeEvent) => {
        if (!event.node.id || event.node.children) return;

        setLoading(true);
        const subjectInfo = await changeSubject(event.node.id);
        
        const predicates = await query_relation_predicates(view);
        if (!predicates) return;

        let node = { ...event.node };
        node.children = [];
        for (let i = 0; i < predicates.length; i++) {
            if (!subjectInfo.relations.hasOwnProperty(predicates[i])) continue;

            for (let j = 0; j < subjectInfo.relations[predicates[i]].length; j++) {
                const obj = subjectInfo.relations[predicates[i]][j];

                const child = {
                    id: obj.object,
                    key: obj.object,
                    label: obj.caption? format_string(obj.caption): obj.object,
                    leaf: obj.terminal,
                    style: {marginLeft: 4, padding: "0px 0px 0px 8px"}
                }

                if (obj.terminal) {
                    node.children = [child, ...node.children]
                } else {
                    node.children.push(child);
                }
            }
        }

        let currNodes = updateTreeNode(nodes[0], node);
        setNodes([currNodes]);
        setLoading(false);
    }

    const headerTemplate = (options: TreeHeaderTemplateOptions) => {
        return (
            <div className="border border-black rounded-lg h-7" data-pc-section="filtercontainer">
                {options.filterElement}
            </div>
        );
    }

    return (
        <Tree header={headerTemplate} value={nodes} filter filterMode="lenient" onExpand={loadNewSubject} loading={loading} className="w-full md:w-30rem h-full overflow-auto" />
    )
}

export default TreeFrame