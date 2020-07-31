/**
 * Returns a path to the value. The path is an array of keys in obj.
 * Example: for obj['a'][1]['b'] the path returned is ['a',1,'b'].
 * @param  {object} obj           Tree to search in, an object with keys.
 * @param  {immutable-type} value The searched value, immutable type.
 * @return {array|boolean}        An array of keys (as strings) to get to the value inside obj (see example above) or [true|false] depending on value==obj when obj is not an object.
 */
function findPath(obj, value) {
    if(typeof(obj) == 'undefined')
        throw 'obj is mandatory.';
    if(typeof(value) == 'undefined')
        throw 'value is mandatory.';
    if(typeof(value) == 'object')
        throw 'value cannod be an object.';
    if(typeof(obj) == 'object') {
        for(const key in obj) {
            let foundPath = findPath(obj[key], value);
            if(foundPath === true) {
                return [key];
            } else if(foundPath instanceof Array) {
                return [key, ...foundPath];
            }
        }
        return false;
    } else {
        return value == obj;
    }
}

/**
 * Checks whether a given path reaches a node inside an object.
 * @param  {object} obj   The object where the path should be searched.
 * @param  {array} path   The way to reach the node. Example: ['a',1,'b'] means getting obj['a'][1]['b']. <b>Note:</b> an empty array returns true.
 * @return {boolean}      [true|false] True if path reached a valid node.
 */
function nodeExists(obj, path) {
    if(typeof(obj) != 'object')
        throw 'obj must be an object.';
    if(!(path instanceof Array))
        throw 'path must be an array.';
    for(const index of path) {
        if(!Object.keys(obj).includes(String(index))) {
            return false;
        }
        obj = obj[index];
    }
    return true;
}

/**
 * Returns a node in an object travelling a given path.
 * <b>Note</b>: If the found node is immutable a copy is returned, else a reference is returned.
 * @param  {object} obj                    An object where a given path will be traversed to return a node.
 * @param  {Array} path                    The path that will be traversed, an array that should be equivalent to keys in the obj . <b>Note:</b> an empty array returns obj.
 * @param  {Boolean} createPathIfNotFound  [default=false] If path doesn't exist, create it. <b>Note</b>: each missing key creates an object.
 * @return {object|immutable-type}         If the found node is immutable a copy is returned, else a reference is returned. If createPathIfNotFound is true and the path doesn't exist, {} (empty object) is returned.
 */
function getNode(obj, path, createPathIfNotFound = false) {
    if(typeof(obj) != 'object')
        throw 'obj must be an object.';
    if(!(path instanceof Array))
        throw 'path must be an array.';
    let node = obj;
    let traversedPath = []; // Used for error throwing
    let index = null;
    for(const pos in path) {
        if(typeof(node) != 'object') {
            throw `part of path is not an object, not an object in path: ${JSON.stringify(traversedPath)}`;
        }
        if(!Object.keys(node).includes(String(path[pos]))) {
            if(createPathIfNotFound) {
                if(node instanceof Array) {
                    if(isNaN(path[pos]) || parseInt(path[pos]) != path[pos]) {
                        let errorMessage = `Trying to add a non integer key inside an array:`;
                        errorMessage += `\n\tarray in path: ${JSON.stringify(traversedPath)}`;
                        errorMessage += `\n\ttrying to add key: ${path[pos]}.`;
                        throw errorMessage;
                    }
                    if(path[pos] > node.length) {
                        throw `Trying to add an index greater than array length in array in path: ${JSON.stringify(traversedPath)}`;
                    }
                }
                node[path[pos]] = {};
            } else {
                let notFoundPath = traversedPath.slice();
                notFoundPath.push(`${path[pos]}`);
                let errorMessage = `obj's path not reachable`;
                errorMessage += `\n\tsuccessful path: ${JSON.stringify(traversedPath)}`;
                errorMessage += `\n\tnot found path: ${JSON.stringify(notFoundPath)}`;
                throw errorMessage;
            }
        }
        traversedPath.push(`${path[pos]}`);
        index = path[pos];
        node = node[index];
    }
    return node;
}

/**
 * Checks if subArray is actually a sub array of superArray.
 * This is true if they are the same or if superArray starts exactly like subArray.
 * @param  {Array}  subArray   An array.
 * @param  {Array}  superArray An array.
 * @return {Boolean}           Returns true if superArray starts exactly like subArray or if superArray equals subArray.
 */
function isSubArray(subArray, superArray) {
    if(!(subArray instanceof Array))
        throw 'subArray must be an array.';
    if(!(superArray instanceof Array))
        throw 'superArray must be an array.';
    for(const index in subArray) {
        if(subArray[index] != superArray[index]) {
            return false;
        }
    }
    return true;
}

/**
 * Move a node to a new location inside obj.
 * @param  {object}  obj         The object in which one node will be moved to another position.
 * @param  {array}  initialPath  The moved node's path, the way to reach the node. Example: ['a',1,'b'] means getting obj['a'][1]['b'].
 * @param  {array}  finalPath    The node's final location path. Example: ['a',1,'b'] means putting the node in obj['a'][1]['b'].
 * @param  {Boolean} copyObj     [default=false] Whether the object modified is the original object or a copy.
 * @return {object}              The modified obj. If copyObj=true a copy is returned, if copyObj=false the original obj is changed and returned.
 */
function moveNode(obj, initialPath, finalPath, throwOnExistingDestination = true, copyObj = false) {
    if(typeof(obj) != 'object')
        throw 'obj must be an object.';
    if(!(initialPath instanceof Array))
        throw 'initialPath must be an array.';
    if(initialPath.length == 0)
        throw 'initialPath must be non-empty array.';
    if(!nodeExists(obj, initialPath))
        throw `initialPath doesn't point to an existing node.`;
    if(!(finalPath instanceof Array))
        throw 'finalPath must be an array.';
    if(finalPath.length == 0)
        throw 'finalPath must be non-empty array.';
    let isSubArrayResult = isSubArray(initialPath, finalPath);
    if(isSubArrayResult && initialPath.length < finalPath.length)
        throw 'The object to be moved cannot be moved inside a child object.';

    if(copyObj === true)
        obj = JSON.parse(JSON.stringify(obj));

    // Copy paths to avoid unexpected results outside the function
    initialPath = JSON.parse(JSON.stringify(initialPath));
    finalPath = JSON.parse(JSON.stringify(finalPath));

    // When initialPath and finalPath are the same, do nothing
    if(isSubArrayResult && initialPath.length == finalPath.length)
        return obj;

    let movedNodeContainer = getNode(obj, initialPath.slice(0, -1));
    let initialPathLastKey = initialPath.length - 1;
    let movedNodePosInContainer = initialPath[initialPathLastKey];
    let movedNode = getNode(obj, initialPath);
    let newLocationContainer = getNode(obj, finalPath.slice(0, -1), true);

    if(newLocationContainer instanceof Array) {
        const newLocationPos = finalPath[finalPath.length - 1];
        if(isNaN(newLocationPos) || parseInt(newLocationPos) != newLocationPos) {
            let errorMessage;
            errorMessage = `Trying to add a non integer key inside an array:`;
            errorMessage += `\n\tarray in path: ${JSON.stringify(finalPath.slice(0, -1))}`;
            errorMessage += `\n\ttrying to add key: ${newLocationPos}.`;
            throw errorMessage;
        }
        if(newLocationPos > newLocationContainer.length) {
            throw `Trying to add an index (${newLocationPos}) greater than array length (${newLocationContainer.length}) in array in path: ${JSON.stringify(finalPath.slice(0, -1))}`;
        }
    } else {
        const newLocationPos = finalPath[finalPath.length - 1];
        if(throwOnExistingDestination && Object.keys(newLocationContainer).includes(String(newLocationPos))) {
            throw 'The object to be moved would overwrite an existing key.';
        }
    }

    /****** The actual movement ******/
    // If the moved node is inside an array
    if(movedNodeContainer instanceof Array) {
        // The movement cannot be done straight away because removing the moved node will make finalPath invalid.
        if(isSubArray(initialPath.slice(0, -1), finalPath) &&
            !isNaN(finalPath[initialPathLastKey]) && parseInt(finalPath[initialPathLastKey]) == finalPath[initialPathLastKey] &&
            movedNodePosInContainer < finalPath[initialPathLastKey]) {
            finalPath[initialPathLastKey]--;
        }
        movedNodeContainer.splice(movedNodePosInContainer, 1)[0];
    } else {
        delete movedNodeContainer[movedNodePosInContainer];
    }
    // If the final location is inside an array
    {
        // WARNING: This is not necessarily the same as the one define above as it is might be change when doing:
        //  `finalPath[initialPathLastKey]--;`
        const newLocationPos = finalPath[finalPath.length - 1];
        if(newLocationContainer instanceof Array) {
            newLocationContainer.splice(newLocationPos, 0, movedNode);
        } else {
            newLocationContainer[newLocationPos] = movedNode;
        }
    }
    return obj;
}

/**
 * Insert a node into a given path inside obj.
 * @param  {object}  obj            The object in which a new node will be inserted at a given position.
 * @param  {array}  destinationPath The inserted node's location path. Example: ['a',1,'b'] means putting the node in obj['a'][1]['b'].
 * @param  {any}  insertedNode      The node to be inserted, must not be undefined.
 * @param  {string} onNodeExists    ['throw'|'overwrite'|'insert'] *Only* if the destinationPath points to an existing node this is taken into consideration. If the node doesn't exist it gets created using the destinationPath, every node in the path that is created is created as an object ({}), even if onNodeExists=='insert'.
 * @param  {Boolean} copyObj        [default=false] Whether the object modified is the original object or a copy.
 * @return {object}                 The modified obj. If copyObj=true a copy is returned, if copyObj=false the original obj is changed and returned.
 */
function addNode(obj, destinationPath, insertedNode, onNodeExists = 'throw', copyObj = false) {
    if(typeof(obj) != 'object')
        throw 'obj must be an object.';
    if(!(destinationPath instanceof Array))
        throw 'destinationPath must be an array.';
    if(destinationPath.length == 0)
        throw 'destinationPath must be non-empty array.';
    if(typeof(insertedNode) == 'undefined')
        throw 'insertedNode is mandatory.'
    if(typeof(onNodeExists) != 'string' || onNodeExists.length == 0 ||
        (onNodeExists != 'throw' && onNodeExists != 'overwrite' && onNodeExists != 'insert')) {
        throw `onNodeExists must be a string, possible values: 'throw'|'insert'|'overwrite'.`;
    }

    if(copyObj === true)
        obj = JSON.parse(JSON.stringify(obj));

    // Copy path to avoid unexpected results outside the function
    destinationPath = JSON.parse(JSON.stringify(destinationPath));

    if(nodeExists(obj, destinationPath)) {
        if(onNodeExists == 'throw')
            throw `Trying to add a node where a node already exists with onNodeExists='throw'.`
        if(onNodeExists == 'insert') {
            let locationContainer = getNode(obj, destinationPath.slice(0, -1));
            if(!(locationContainer instanceof Array)) {
                throw `With onNodeExists='insert', destinationPath must point to a position inside an array.`;
            }
            const locationPos = destinationPath[destinationPath.length - 1];
            /****** The actual insertion ******/
            locationContainer.splice(locationPos, 0, insertedNode);
        }
        if(onNodeExists == 'overwrite') {
            let locationContainer = getNode(obj, destinationPath.slice(0, -1), true);
            const locationPos = destinationPath[destinationPath.length - 1];
            /****** The actual insertion ******/
            locationContainer[locationPos] = insertedNode;
        }
    } else { // !nodeExists(obj, destinationPath)
        let locationContainer = getNode(obj, destinationPath.slice(0, -1), true);
        const locationPos = destinationPath[destinationPath.length - 1];
        if(locationContainer instanceof Array) {
            if(isNaN(locationPos) || parseInt(locationPos) != locationPos) {
                let errorMessage;
                errorMessage = `Trying to add a non integer key inside an array:`;
                errorMessage += `\n\tarray in path: ${JSON.stringify(destinationPath.slice(0, -1))}`;
                errorMessage += `\n\ttrying to add key: ${locationPos}.`;
                throw errorMessage;
            }
            if(locationPos > locationContainer.length) {
                throw `Trying to add an index (${locationPos}) greater than array length (${locationContainer.length}) in array in path: ${JSON.stringify(destinationPath.slice(0, -1))}.`;
            }
        }
        /****** The actual insertion ******/
        locationContainer[locationPos] = insertedNode;
    }
    return obj;
}


export default {
    findPath,
    nodeExists,
    getNode,
    isSubArray,
    moveNode,
    addNode,
}
