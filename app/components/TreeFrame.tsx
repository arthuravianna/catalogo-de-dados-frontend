
"use client"


import React, { useState, useEffect, useContext } from 'react';
import { Tree, TreeEventNodeEvent, TreeExpandedKeysType, TreeHeaderTemplateOptions } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import { SubjectContext } from './SubjectProvider';
import { IoList } from "react-icons/io5";
import { BsDot } from "react-icons/bs";
import { remove_quotes, updateTreeNode } from '../public/utils';
import { query_namespace_roots, query_subject_info, query_relation_predicates } from '@api/catalogo/connectionDataSources';

const ICONS_MAP:Record<string, React.JSX.Element> = {
    "ds:listof": <IoList />,
    "ds:field": <BsDot />
}



function TreeFrame() {
    const { view, root, changeSelectedSubject } = useContext(SubjectContext);
    
    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<TreeExpandedKeysType>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!root) return;

        const namespace_root = async() => {
            setLoading(true);

            let data = (await query_namespace_roots(root.name)).result

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
                label: data[rootPosition][rootLabelPosition]? remove_quotes(data[rootPosition][rootLabelPosition]): data[rootPosition][rootPosition],
                expanded: true,
                style: {marginLeft: 4, padding: "0px 0px 0px 8px", cursor: "pointer"},
                children: []
            };
        
            for (let i = 0; i < data.length; i++) {
                node.children?.push(
                    {
                        id: data[i][rootChildPosition],
                        key: data[i][rootChildPosition],
                        label: data[i][rootChildLabelPosition]? remove_quotes(data[i][rootChildLabelPosition]): data[i][rootChildPosition],
                        leaf: false,
                        style: {marginLeft: 4, padding: "0px 0px 0px 8px", cursor: "pointer"}
                    }
                );
            }
        
            setNodes([node]);
            setExpandedKeys({});
            setLoading(false);
        }
        if (root.isNamespace) namespace_root();

    }, [root]);

    const getSubjectInfo = async (name:string) => {
        const relations = await query_subject_info(name, view);
        if (relations) {
            const subject = {name: name, relations: relations};
            return subject;
        }

        return null;
    }

    const loadNewSubject = async (currNode:TreeNode, isRoot:boolean = false) => {
        if (!currNode.id || currNode.children) return;

        setLoading(true);
        const subjectInfo = await getSubjectInfo(currNode.id);
        if (!subjectInfo) return;
        
        const predicates = await query_relation_predicates(view);
        if (!predicates) return;

        let node = { ...currNode };
        node.children = [];
        let toBeExpanded:TreeExpandedKeysType = {}
        if (node.id) toBeExpanded[node.id] = true;

        for (let i = 0; i < predicates.length; i++) {
            if (!subjectInfo.relations.hasOwnProperty(predicates[i])) continue;

            // let predicateNode:TreeNode = {
            //     id: `${node.id}-${predicates[i]}`,
            //     key: `${node.id}-${predicates[i]}`,
            //     label: predicates[i],
            //     style: {marginLeft: 4, padding: "0px 0px 0px 8px"},
            //     children: []
            // }
            // toBeExpanded[`${node.id}-${predicates[i]}`] = true;

            const icon = ICONS_MAP[(predicates[i] as string).toLowerCase()];

            for (let j = 0; j < subjectInfo.relations[predicates[i]].length; j++) {
                const obj = subjectInfo.relations[predicates[i]][j];

                const child:TreeNode = {
                    id: obj.object,
                    key: obj.object,
                    icon: icon,
                    label: obj.caption? remove_quotes(obj.caption): obj.object,
                    leaf: obj.terminal,
                    style: {marginLeft: 4, padding: "0px 0px 0px 8px", cursor: "pointer"}
                }

                if (obj.terminal) {
                    //predicateNode.children = [child, ...predicateNode.children!]
                    node.children = [child, ...node.children];
                } else {
                    //predicateNode.children!.push(child);
                    node.children.push(child);
                }
            }
            // node.children.push(predicateNode);
        }

        if (isRoot) {
            setNodes([node]);
            setExpandedKeys(toBeExpanded);
        } else {
            let currNodes = updateTreeNode(nodes[0], node);
            setNodes([currNodes]);
            setExpandedKeys({...expandedKeys, ...toBeExpanded});    
        }
        setLoading(false);
    }

    const handleExpand = async (event:TreeEventNodeEvent) => {
        loadNewSubject(event.node);
    }

    const selectNode = async (event:TreeEventNodeEvent) => {
        if (!event.node.id) return;

        changeSelectedSubject(event.node.id);
    }

    const headerTemplate = (options: TreeHeaderTemplateOptions) => {
        return (
            <div className="border border-black rounded-lg h-7" data-pc-section="filtercontainer">
                {options.filterElement}
            </div>
        );
    }

    return (
        <Tree 
        expandedKeys={expandedKeys} 
        onToggle={(e) => setExpandedKeys(e.value)} 
        onNodeClick={selectNode} 
        emptyMessage={"Select a data source."} 
        header={headerTemplate} 
        value={nodes} 
        filter 
        filterMode="lenient" 
        onExpand={handleExpand} 
        loading={loading} 
        className="w-full md:w-30rem h-full overflow-auto" />
    )
}

export default TreeFrame