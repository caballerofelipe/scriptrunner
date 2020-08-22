import objTools from './objTools';

/**
 * Get a path in a recursive tree structure.
 * <b>Note</b>: Uses <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split">split</a> for dividing the string (str).
 *
 * This supposes a tree, a recursive structure. An array of nodes, in which a tree key exists pointing to an array of nodes.
 * Example: tree=[{'tree':[{node,node}]},{'tree':[{node,node}]}]
 * Visualization:
 * [node         , node]
 * 'tree'        | 'tree'
 * [node, node]  | [node, node]
 * @param  {string} str         A delimited string to extract a path divided by the delimiter. str must be integers delimited by delimiter.
 * @param  {string} subTreeKey  The key used to express that the refered object is a subtree.
 * @param  {string} delimiter   A delimiter to create the path, must be a string. When empty-string it splits every character in str. Uses split for dividing the string (str), see <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split">split</a>.
 * @return {array}                 An array of strings representing a path.
 */
function getPathByID(str, subTreeKey, delimiter) {
    if (typeof(str) != 'string' || str.length == 0)
        throw 'str must be a non-empty string.';
    if (typeof(subTreeKey) != 'string' || subTreeKey.length == 0)
        throw 'subTreeKey must be a non-empty string.';
    if (typeof(delimiter) != 'string' || /[0-9]/.test(delimiter))
        throw 'delimiter must be a string without numbers.';
    let incompletePath = str.split(delimiter).filter(e => e.length > 0);
    // Only integers allowed in return for incompletePath parts
    for (const part of incompletePath) {
        if (!/^[0-9]+$/.test(part))
            throw `When splitting str the results should always be numbers, received: ${JSON.stringify(incompletePath)}.`;
    }
    let path = [incompletePath.splice(0, 1)[0]];
    while (incompletePath.length > 0) {
        path.push(subTreeKey);
        path.push(incompletePath.splice(0, 1)[0]);
    }
    return path;
}

/**
 * Returns a path  array. It used the given path and creates the new path based on the position relative to path.
 *
 * This supposes a tree, a recursive structure. An array of nodes, in which a tree key exists pointing to an array of nodes.
 * Example: tree=[{'tree':[{node,node}]},{'tree':[{node,node}]}]
 * Visualization:
 * [node         , node]
 * 'tree'        | 'tree'
 * [node, node]  | [node, node]
 * @param  {object} tree        A tree object, following the structured mentioned in the function description.
 * @param  {array}  path        A given path used as a relative point, this must point to an existing object.
 * @param  {string} position    ['before'|'after'|'below'] The position the new path should point in relation to the path.
 * @param  {string} subTreeKey  The key used to express that the refered object is a subtree.
 * @return {array}              An array describing the new path, all elements are converted to strings.
 */
function newPathByPosition(tree, path, position, subTreeKey) {
    /* Notes on possible future additions:
        - tree might be invalid, wrong structure
        - path might be invalid:
          - it might use an array where an object is needed
          - it might use an object where an array is needed
    */
    if (typeof(tree) != 'object')
        throw 'tree must be an object.';
    if (!(path instanceof Array) || path.length == 0)
        throw 'path must be a non-empty array.';
    if (!objTools.nodeExists(tree, path))
        throw `path doesn't point to an existing node.`;
    if (typeof(position) != 'string' || position.length == 0 || (position != 'before' && position != 'after' && position != 'below'))
        throw `position must be a string, possible values: 'before'|'after'|'below'.`;
    if (typeof(subTreeKey) != 'string' || subTreeKey.length == 0)
        throw 'subTreeKey must be a non-empty string.';

    let newPath = path.map(element => String(element)); // Copy to avoid changing original object and parse as string
    switch (position) {
        case 'before':
            return newPath;
        case 'after':
            { // { Forced scope to avoid declaration errors }
                let lastPosition = newPath.length - 1;
                newPath[lastPosition] = String(Number(newPath[lastPosition]) + 1);
                return newPath;
            }
        case 'below':
            newPath.push(subTreeKey);
            if (!objTools.nodeExists(tree, newPath)) {
                let tmpNode = objTools.getNode(tree, path);
                tmpNode[subTreeKey] = [];
                newPath.push('0');
                return newPath;
            } else {
                let tmpParentNode = objTools.getNode(tree, newPath);
                if (!(tmpParentNode instanceof Array)) {
                    throw `In the tree the path ${JSON.stringify(newPath)} doesn't point to an array but it should.`;
                }
                if (tmpParentNode.length == 0) {
                    newPath.push('0');
                    return newPath;
                } else {
                    newPath.push(`${tmpParentNode.length}`);
                    return newPath;
                }
            }
    }
}

/**
 * Move a node to a new position. movedNodePathStr points to the node being moved. nextToNodePathStr points to a position next to the new position. position is the relative position in relation to nextToNodePathStr.
 *
 * This supposes a tree, a recursive structure. An array of nodes, in which a tree key exists pointing to an array of nodes.
 * Example: tree=[{'tree':[{node,node}]},{'tree':[{node,node}]}]
 * Visualization:
 * [node         , node]
 * 'tree'        | 'tree'
 * [node, node]  | [node, node]
 * @param  {object}  tree               A tree object, following the structured mentioned in the function description.
 * @param  {string}  movedNodePathStr   Structured string path for the node that will change position.
 * @param  {string}  nextToNodePathStr  Structured string path for the node next to which the moved node will be positioned.
 * @param  {string}  position           ['before'|'after'|'below'] Where to position the movedNode in relation to the nextToNode.
 * @param  {string}  subTreeKey         The key used to express that the refered object is a subtree.
 * @param  {String}  idDelimiter        [dafault='_'] A string delimiting movedNodePathStr and nextToNodePathStr paths. This cannot contain any number.
 * @param  {Boolean} copyTree           [default:false] Whether the tree modified is the original object or a copy.
 * @return {object}                     The tree with the modifications. See copyTree param.
 */
function moveNodeNextToNode(tree, movedNodePathStr, nextToNodePathStr, position, subTreeKey, idDelimiter = '_', copyTree = false) {
    if (typeof(tree) != 'object')
        throw 'tree must be an object.';
    if (typeof(movedNodePathStr) != 'string' || movedNodePathStr.length == 0)
        throw `movedNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.`;
    if (typeof(nextToNodePathStr) != 'string' || nextToNodePathStr.length == 0)
        throw `nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.`;
    if (typeof(position) != 'string' || position.length == 0 ||
        (position != 'before' && position != 'after' && position != 'below'))
        throw `position must be a string, possible values: 'before'|'after'|'below'.`;
    if (typeof(subTreeKey) != 'string' || subTreeKey.length == 0)
        throw 'subTreeKey must be a non-empty string.';
    if (typeof(idDelimiter) != 'string' || idDelimiter.length == 0)
        throw 'idDelimiter must be a non-empty string.';
    if (/[0-9]+/.test(idDelimiter))
        throw 'idDelimiter cannot contain numbers.';

    if (copyTree === true) {
        tree = JSON.parse(JSON.stringify(tree));
    }
    let movedNodePath = getPathByID(movedNodePathStr, subTreeKey, idDelimiter);
    if (!objTools.nodeExists(tree, movedNodePath)) {
        throw `movedNode node doesn't exist (movedNodePathStr[${movedNodePathStr}]).`;
    }
    let nextToNodePath = getPathByID(nextToNodePathStr, subTreeKey, idDelimiter);
    if (!objTools.nodeExists(tree, nextToNodePath)) {
        throw `nextToNode node doesn't exist (nextToNodePathStr[${nextToNodePathStr}]).`;
    }
    // Create an array for the new path: newPath. This is the new location for the moved node.
    // At this point newPath doesn't take into consideration that the moved node will be moved.
    let newPath = newPathByPosition(tree, nextToNodePath, position, subTreeKey);
    // Move the node and return the processed tree
    return objTools.moveNode(tree, movedNodePath, newPath);
}

/**
 * Creates a node next to where nextToNodePathStr points.
 *
 * This supposes a tree, a recursive structure. An array of nodes, in which a tree key exists pointing to an array of nodes.
 * Example: tree=[{'tree':[{node,node}]},{'tree':[{node,node}]}]
 * Visualization:
 * [node         , node]
 * 'tree'        | 'tree'
 * [node, node]  | [node, node]
 * @param  {object}  tree               A tree object, following the structured mentioned in the function description.
 * @param  {string}  nextToNodePathStr  Structured string path for the node next to which the moved node will be positioned.
 * @param  {object}  insertedNode       The node to be inserted.
 * @param  {string}  position           ['before'|'after'|'below'] Where to position the movedNode in relation to the nextToNode.
 * @param  {string}  subTreeKey         The key used to express that the refered object is a subtree.
 * @param  {String}  idDelimiter        [dafault='_'] A string delimiting movedNodePathStr and nextToNodePathStr paths. This cannot contain any number.
 * @param  {Boolean} copyTree           [default:false] Whether the tree modified is the original object or a copy.
 * @return {object}                     The tree with the modifications. See copyTree param.
 */
function createNodeNextToNode(tree, nextToNodePathStr, insertedNode, position, subTreeKey, idDelimiter = '_', copyTree = false) {
    if (typeof(tree) != 'object')
        throw 'tree must be an object.';
    if (typeof(nextToNodePathStr) != 'string' || nextToNodePathStr.length == 0)
        throw `nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.`;
    if (typeof(insertedNode) == 'undefined')
        throw 'insertedNode is mandatory.';
    if (typeof(position) != 'string' || position.length == 0 ||
        (position != 'before' && position != 'after' && position != 'below'))
        throw `position must be a string, possible values: 'before'|'after'|'below'.`;
    if (typeof(subTreeKey) != 'string' || subTreeKey.length == 0)
        throw 'subTreeKey must be a non-empty string.';
    if (typeof(idDelimiter) != 'string' || idDelimiter.length == 0)
        throw 'idDelimiter must be a non-empty string.';
    if (/[0-9]+/.test(idDelimiter))
        throw 'idDelimiter cannot contain numbers.';

    if (copyTree === true) {
        tree = JSON.parse(JSON.stringify(tree));
    }
    let nextToNodePath = getPathByID(nextToNodePathStr, subTreeKey, idDelimiter);
    if (!objTools.nodeExists(tree, nextToNodePath)) {
        throw `nextToNode node doesn't exist (nextToNodePathStr[${nextToNodePathStr}]).`;
    }
    // Create an array for the new path: newPath. This is the new location for the inserted node.
    let newPath = newPathByPosition(tree, nextToNodePath, position, subTreeKey);
    objTools.addNode(tree, newPath, insertedNode, 'insert');
    return tree;
}

/**
 * List nodes of tree.
 *
 * This supposes a tree, a recursive structure. An array of nodes, in which a tree key exists pointing to an array of nodes.
 * Example: tree=[{'tree':[{node,node}]},{'tree':[{node,node}]}]
 * Visualization:
 * [node         , node]
 * 'tree'        | 'tree'
 * [node, node]  | [node, node]
 * @param  {object}  tree               A tree object, following the structured mentioned in the function description.
 * @param  {string}  subTreeKey         The key used to express that the refered object is a subtree.
 * @param  {string}  mode               [default:'breadth'] Whether to list node in a breadth first or depth first fashion.
 * @param  {Boolean} copyTree           [default:false] Whether the tree modified is the original object or a copy.
 * @return {object}                     The tree with the modifications. See copyTree param.
 */
function listNodes(tree, subTreeKey, mode = 'breadth', copyTree = false) {
    if (typeof(tree) != 'object')
        throw 'tree must be an object.';
    if (typeof(subTreeKey) != 'string' || subTreeKey.length == 0)
        throw 'subTreeKey must be a non-empty string.';
    if (typeof(mode) != 'string' || mode.length == 0 ||
        (mode != 'breadth' && mode != 'depth'))
        throw `position must be a string, possible values: 'breadth'|'depth'.`;

    if (copyTree === true) {
        tree = JSON.parse(JSON.stringify(tree));
    }
    let theList = [];
    switch (mode) {
        case 'breadth':
            { // { Forced scope to avoid declaration errors }
                let nodeArray = tree;
                while (nodeArray.length) {
                    let nextLevelChildren = [];
                    theList = [...theList, ...nodeArray];
                    for (let node of nodeArray) {
                        nextLevelChildren = [...nextLevelChildren, ...node[subTreeKey]]
                    }
                    nodeArray = nextLevelChildren;
                }
                return theList;
            }
        case 'depth':
            {
                let parentPos = 0;
                theList = [...tree];
                while (parentPos < theList.length) {
                    let children = theList[parentPos][subTreeKey];
                    parentPos++;
                    theList.splice(parentPos, 0, ...children);
                }
                return theList;
            }
        default:

    }
}

/**
 * Remove a node using its path.
 *
 * This supposes a tree, a recursive structure. An array of nodes, in which a tree key exists pointing to an array of nodes.
 * Example: tree=[{'tree':[{node,node}]},{'tree':[{node,node}]}]
 * Visualization:
 * [node         , node]
 * 'tree'        | 'tree'
 * [node, node]  | [node, node]
 * @param  {object}  tree               A tree object, following the structured mentioned in the function description.
 * @param  {string}  nodePathStr        Structured string path for the node to be removed.
 * @param  {string}  subTreeKey         The key used to express that the refered object is a subtree.
 * @param  {String}  idDelimiter        [dafault='_'] A string delimiting movedNodePathStr and nextToNodePathStr paths. This cannot contain any number.
 * @param  {Boolean} copyTree           [default:false] Whether the tree modified is the original object or a copy.
 * @return {object}                     The tree with the modifications. See copyTree param.
 */
function removeNode(tree, nodePathStr, subTreeKey, idDelimiter = '_', copyTree = false) {
    if (typeof(tree) != 'object')
        throw 'tree must be an object.';
    if (typeof(nodePathStr) != 'string' || nodePathStr.length == 0)
        throw `nodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.`;
    if (typeof(subTreeKey) != 'string' || subTreeKey.length == 0)
        throw 'subTreeKey must be a non-empty string.';
    if (typeof(idDelimiter) != 'string' || idDelimiter.length == 0)
        throw 'idDelimiter must be a non-empty string.';
    if (/[0-9]+/.test(idDelimiter))
        throw 'idDelimiter cannot contain numbers.';

    if (copyTree === true) {
        tree = JSON.parse(JSON.stringify(tree));
    }
    let nodePath = getPathByID(nodePathStr, subTreeKey, idDelimiter);
    let container = objTools.getNode(tree, nodePath.slice(0, -1));
    container.splice(nodePath[nodePath.length - 1], 1)
    return tree
}


export default {
    getPathByID,
    newPathByPosition,
    moveNodeNextToNode,
    createNodeNextToNode,
    listNodes,
    removeNode
}
