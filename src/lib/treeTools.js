/**
 * Returns a path to the value. The path is an array of keys in obj.
 * Example: for obj['a'][1]['b'] the path returned is ['a',1,'b'].
 * @param  {object} obj           Tree to search in, an object with keys.
 * @param  {immutable type} value The searched value, immutable type.
 * @return {array|boolean}        An array of keys (as strings) to get to the value inside obj (see example above) or [true|false] depending on value==obj when obj is not an object.
 */
function findPath(obj, value) {
  if (typeof(obj) == 'undefined')
    throw 'obj is mandatory.';
  if (typeof(value) == 'undefined')
    throw 'value is mandatory.';
  if (typeof(value) == 'object')
    throw 'value cannod be an object.';
  if (typeof(obj) == 'object') {
    for (const key in obj) {
      let foundPath = findPath(obj[key], value);
      if (foundPath === true) {
        return [key];
      } else if (foundPath instanceof Array) {
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
  if (typeof(obj) != 'object')
    throw 'obj must be an object.';
  if (!(path instanceof Array))
    throw 'path must be an array.';
  for (const index of path) {
    if (!Object.keys(obj).includes(String(index))) {
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
 * @return {object|immutable type}         If the found node is immutable a copy is returned, else a reference is returned. If createPathIfNotFound is true and the path doesn't exist, {} (empty object) is returned.
 */
function getNode(obj, path, createPathIfNotFound = false) {
  if (typeof(obj) != 'object')
    throw 'obj must be an object.';
  if (!(path instanceof Array))
    throw 'path must be an array.';
  let node = obj;
  let traversedPath = []; // Used for error throwing
  let index = null;
  for (const pos in path) {
    if (typeof(node) != 'object') {
      throw `part of path is not an object, not an object in path: ${JSON.stringify(traversedPath)}`;
    }
    if (!Object.keys(node).includes(String(path[pos]))) {
      if (createPathIfNotFound) {
        if (node instanceof Array) {
          if (isNaN(path[pos]) || parseInt(path[pos]) != path[pos]) {
            let errorMessage = `Trying to add a non integer key inside an array.`;
            errorMessage += `\n\tarray in path: ${JSON.stringify(traversedPath)}`;
            errorMessage += `\n\ttrying to add key: ${path[pos]}`;
            throw errorMessage;
          }
          if (path[pos] > node.length) {
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
  if (!(subArray instanceof Array))
    throw 'subArray must be an array.';
  if (!(superArray instanceof Array))
    throw 'superArray must be an array.';
  for (const index in subArray) {
    if (subArray[index] != superArray[index]) {
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
  if (typeof(obj) != 'object')
    throw 'obj must be an object.';
  if (!(initialPath instanceof Array))
    throw 'initialPath must be an array.';
  if (initialPath.length == 0)
    throw 'initialPath must be non-empty array.';
  if (!nodeExists(obj, initialPath))
    throw `initialPath doesn't point to an existing node.`;
  if (!(finalPath instanceof Array))
    throw 'finalPath must be an array.';
  if (finalPath.length == 0)
    throw 'finalPath must be non-empty array.';
  let isSubArrayResult = isSubArray(initialPath, finalPath);
  if (isSubArrayResult && initialPath.length < finalPath.length)
    throw 'The object to be moved cannot be moved inside a child object.';

  if (copyObj === true)
    obj = JSON.parse(JSON.stringify(obj));

  // Copy paths to avoid unexpected results
  initialPath = JSON.parse(JSON.stringify(initialPath));
  finalPath = JSON.parse(JSON.stringify(finalPath));

  // When initialPath and finalPath are the same, do nothing
  if (isSubArrayResult && initialPath.length == finalPath.length)
    return obj;

  let movedNodeContainer = getNode(obj, initialPath.slice(0, -1));
  let initialPathLastKey = initialPath.length - 1;
  let movedNodePosInContainer = initialPath[initialPathLastKey];
  let movedNode = getNode(obj, initialPath);
  let newLocationContainer = getNode(obj, finalPath.slice(0, -1), true);

  if (newLocationContainer instanceof Array) {
    const newLocationPos = finalPath[finalPath.length - 1];
    if (isNaN(newLocationPos) || parseInt(newLocationPos) != newLocationPos) {
      let errorMessage;
      errorMessage = `Trying to add a non integer key inside an array.`;
      errorMessage += `\n\tarray in path: ${JSON.stringify(finalPath.slice(0, -1))}`;
      errorMessage += `\n\ttrying to add key: ${newLocationPos}`;
      throw errorMessage;
    }
    if (newLocationPos > newLocationContainer.length) {
      throw `Trying to add an index (${newLocationPos}) greater than array length (${newLocationContainer.length}) in array in path: ${JSON.stringify(finalPath.slice(0, -1))}`;
    }
  } else {
    const newLocationPos = finalPath[finalPath.length - 1];
    if (throwOnExistingDestination && Object.keys(newLocationContainer).includes(String(newLocationPos))) {
      throw 'The object to be moved would overwrite an existing key.';
    }
  }

  // ****
  // The actual movement
  // ****
  // If the moved node is inside an array
  if (movedNodeContainer instanceof Array) {
    // The movement cannot be done straight away because removing the moved node will make finalPath invalid.
    if (isSubArray(initialPath.slice(0, -1), finalPath) &&
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
    // This is not necessarily the same as the one define above as it is might be change when doing:
    //  `finalPath[initialPathLastKey]--;`
    const newLocationPos = finalPath[finalPath.length - 1];
    if (newLocationContainer instanceof Array) {
      newLocationContainer.splice(newLocationPos, 0, movedNode);
    } else {
      newLocationContainer[newLocationPos] = movedNode;
    }
  }
  return obj;
}

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
  if (!nodeExists(tree, path))
    throw `path doesn't point to an existing node.`;
  if (typeof(position) != 'string' || position.length == 0 ||
    (position != 'before' && position != 'after' && position != 'below'))
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
      if (!nodeExists(tree, newPath)) {
        let tmpNode = getNode(tree, path);
        tmpNode[subTreeKey] = [];
        newPath.push('0');
        return newPath;
      } else {
        let tmpParentNode = getNode(tree, newPath);
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

  if (copyTree === true) {
    tree = JSON.parse(JSON.stringify(tree));
  }
  /* FCG: REVIEW: maybe do same validations as used functions and throw same message before calling used functions. */
  let movedNodePath = getPathByID(movedNodePathStr, subTreeKey, idDelimiter);
  if (!nodeExists(tree, movedNodePath)) {
    throw `movedNode node doesn't exist (movedNodePathStr[${movedNodePathStr}]).`;
  }
  let nextToNodePath = getPathByID(nextToNodePathStr, subTreeKey, idDelimiter);
  if (!nodeExists(tree, nextToNodePath)) {
    throw `nextToNode node doesn't exist (nextToNodePathStr[${nextToNodePathStr}]).`;
  }
  // Create an array for the new path: newPath. This is the new location for the moved node.
  // At this point newPath doesn't take into consideration that the moved node will be moved.
  let newPath = newPathByPosition(tree, nextToNodePath, position, subTreeKey);
  // Move the node and return the processed tree
  return moveNode(tree, movedNodePath, newPath);
}


export default {
  findPath,
  nodeExists,
  getNode,
  isSubArray,
  moveNode,
  getPathByID,
  newPathByPosition,
  moveNodeNextToNode
}

/* FCG: REVIEW PENDING:
  - Parameterize idDemilimter - '_'
  - MAYBE, change function signatures to use JSON
    Instead of
      moveNodeNextToNode([{},{}], '_0_0', '_0_0', 'below', 'tree', '_');
    Use
      moveNodeNextToNode({
        tree: [{}, {}],
        movedNodePathStr: '_0_0',
        nextToNodePathStr: '_0_0',
        position: 'below',
        subTreeKey: 'tree',
        idDelimiter: '_',
        copyTree: false
      });
  - MAYBE Change parameter validation for external function like:
    isObject_orThrow(tree, 'tree');
    or
    throwIfNot_object(tree, 'tree');
    This would:
      - DRY:
          - only one message
          - only calling a function and no reimplementing validation
  - If using a class
    Possible signature for a class
    let th = new treeHandler(tree, subTreeKey='processTree', idDemilimter='_');
    th.moveNodeNextToNode(movedNodePathStr, nextToNodePathStr, position, copyTree = false);
*/
