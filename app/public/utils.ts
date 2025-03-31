import { TreeNode } from "primereact/treenode";

export const RNP_BLUE = "#001EFF";
const INTERFACE_CONTENT_OPTIONS = ["datasources", "datatypes"] as const;
type INTERFACE_CONTENT = typeof INTERFACE_CONTENT_OPTIONS;        // type x = readonly ['op1', 'op2', ...]
export type INTERFACE_CONTENT_TYPE = INTERFACE_CONTENT[number]


export interface DataRequest {
    data:{id: string, caption:string},
    start_time:number,
    end_time:number,
    source:string,
    destination:string,
    email:string
}
const DATA_REQUESTS_LOCAL_STORAGE_KEY = "cartRequests"

export function remove_quotes(s:string) {
    const chars = ["'", "\""]

    if (chars.includes(s[0]) && chars.includes(s[s.length-1]) && s.length > 2)
        return s.substring(1, s.length-1);
    return s;
}

// search in the tree the node to be update
export function updateTreeNode(curr_node:TreeNode, node:TreeNode) {
    if (curr_node.key == node.key) {
        return node;
    }

    if (curr_node.children) {
        for (let i = 0; i < curr_node.children.length; i++) {
            const aux = curr_node.children[i];
            curr_node.children[i] = updateTreeNode(curr_node.children[i], node);

            if (curr_node.children[i].children?.length != aux.children?.length) break;
        }    
    }

    return curr_node;
}


// search in the tree the parent of the node and insert the node as its children
export function insertIntoTree(curr_node:TreeNode, node:TreeNode, parentKey:string|null) {
    if (!parentKey || curr_node.key == parentKey) {
        return node;
    }

    if (curr_node.children) {
        for (let i = 0; i < curr_node.children.length; i++) {
            const aux = curr_node.children[i];
            curr_node.children[i] = insertIntoTree(curr_node.children[i], node, parentKey);
            curr_node.leaf = false;

            if (curr_node.children[i].children?.length != aux.children?.length) break;
        }    
    }

    return curr_node;
}


export function addCartRequest(dataRequest:DataRequest) {
    if (typeof window !== "undefined") {
        let items = getCartRequests();
        items.push(dataRequest);

        localStorage.setItem(DATA_REQUESTS_LOCAL_STORAGE_KEY, JSON.stringify(items));    
    }
}

export function getCartRequests() {
    if (typeof window !== "undefined") {
      const storedCartItems = localStorage.getItem(DATA_REQUESTS_LOCAL_STORAGE_KEY);
      if (storedCartItems !== null) {
        try {
          const cartItems = JSON.parse(storedCartItems);
          return cartItems;
        } catch (error) {
          console.error(error);
        }
      }
    }
    return [];
  }
  
  
  