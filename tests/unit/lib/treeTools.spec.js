import treeTools from '@/lib/treeTools.js'

/**
 * This string is used for the tree and is converted when used to avoid using an object an have some test change it.
 * @type {String}
 */
const treeString = '[{"value":"a_value","tree":[{"value":"a_value","tree":[{"value":"a_value","tree":[],"id":"_0_0_0"}],"id":"_0_0"},{"value":"a_value","tree":[{"value":"a_value","tree":[{"value":"a_value","tree":[],"id":"_0_1_0_0"},{"value":"a_value","tree":[],"id":"_0_1_0_1"}],"id":"_0_1_0"}],"id":"_0_1"}],"id":"_0"},{},{"tree":{},"id":"_2"},{"tree":[],"id":"_3"},{"tree":[{}],"id":"_4"}]';

/**
 * Testing treeTools.findPath
 *
 * Signature:
 * function findPath(obj, value)
 */
test('treeTools.findPath', () => {
  // Mandatory params, throws
  expect(() => treeTools.findPath()).toThrow(/^obj is mandatory.$/);
  expect(() => treeTools.findPath('hello')).toThrow(/^value is mandatory.$/);
  // Throw 'value cannod be an object.'
  expect(() => treeTools.findPath('hello', {})).toThrow(/^value cannod be an object.$/);
  expect(() => treeTools.findPath('hello', [])).toThrow(/^value cannod be an object.$/);
  // Valid input multiple tests
  expect(treeTools.findPath('hello', 'hello')).toBe(true);
  expect(treeTools.findPath('hello', 'bye')).toBe(false);
  expect(treeTools.findPath(JSON.parse(treeString), '_0_1_0_0'))
    .toStrictEqual(["0", "tree", "1", "tree", "0", "tree", "0", "id"]);
  expect(treeTools.findPath(JSON.parse(treeString), '_0_1'))
    .toStrictEqual(["0", "tree", "1", "id"]);
  expect(treeTools.findPath(JSON.parse(treeString), '_3'))
    .toStrictEqual(["3", "id"]);
  expect(treeTools.findPath(JSON.parse(treeString), '_99'))
    .toBe(false);
  expect(treeTools.findPath({
    true: 1,
    false: 2
  }, '1')).toStrictEqual(["true"]);
});

/**
 * Testing treeTools.nodeExists
 *
 * Signature:
 * function nodeExists(obj, path)
 */
test(`treeTools.nodeExists`, () => {
  // throw 'obj must be an object.'
  expect(() => treeTools.nodeExists()).toThrow(/^obj must be an object.$/);
  expect(() => treeTools.nodeExists(false)).toThrow(/^obj must be an object.$/);
  expect(() => treeTools.nodeExists('string')).toThrow(/^obj must be an object.$/);
  expect(() => treeTools.nodeExists(1)).toThrow(/^obj must be an object.$/);

  // throw 'path must be an array.'
  expect(() => treeTools.nodeExists({})).toThrow(/^path must be an array.$/);
  expect(() => treeTools.nodeExists({}, 'string')).toThrow(/^path must be an array.$/);
  expect(() => treeTools.nodeExists({}, 1)).toThrow(/^path must be an array.$/);
  expect(() => treeTools.nodeExists({}, {})).toThrow(/^path must be an array.$/);

  // If path is empty array return true as path should point to obj
  expect(treeTools.nodeExists(JSON.parse(treeString), [])).toBe(true);
  expect(treeTools.nodeExists({}, [])).toBe(true);

  // If obj is empty object and path is non-empty array return false
  expect(treeTools.nodeExists({}, [1, 2, 3])).toBe(false);

  // Valid input, found node
  expect(treeTools.nodeExists(JSON.parse(treeString), [0, 'tree', 1, 'tree', 0, 'tree', 1])).toBe(true);

  // Valid input, not found node
  expect(treeTools.nodeExists(JSON.parse(treeString), [0, 'tree', 1, 'tree', 0, 'tree', 99])).toBe(false);
});

/**
 * Testing treeTools.getNode
 *
 * Signature:
 * function getNode(obj, path, createPathIfNotFound = false)
 */
test('treeTools.getNode', () => {
  // throw 'obj must be an object.'
  expect(() => treeTools.getNode()).toThrow(/^obj must be an object.$/);
  expect(() => treeTools.getNode(false)).toThrow(/^obj must be an object.$/);
  expect(() => treeTools.getNode('string')).toThrow(/^obj must be an object.$/);
  expect(() => treeTools.getNode(1)).toThrow(/^obj must be an object.$/);

  // throw 'path must be an array.'
  expect(() => treeTools.getNode({})).toThrow(/^path must be an array.$/);
  expect(() => treeTools.getNode({}, 'string')).toThrow(/^path must be an array.$/);
  expect(() => treeTools.getNode({}, 1)).toThrow(/^path must be an array.$/);
  expect(() => treeTools.getNode({}, {})).toThrow(/^path must be an array.$/);

  // Throw Not found error and check error
  function getNotFoundThrow(obj, path, successfulPath, notFoundPath) {
    let notFoundErrorTpl = `obj's path not reachable\n\tsuccessful path: %SUCCESSFUL_PATH%\n\tnot found path: %NOTFOUND_PATH%`;
    let notFoundErrorMsg = '';
    notFoundErrorMsg = notFoundErrorTpl;
    notFoundErrorMsg = notFoundErrorMsg.replace(/%SUCCESSFUL_PATH%/, JSON.stringify(successfulPath))
    notFoundErrorMsg = notFoundErrorMsg.replace(/%NOTFOUND_PATH%/, JSON.stringify(notFoundPath))
    expect(() => treeTools.getNode(obj, path))
      .toThrow(new Error(notFoundErrorMsg));
  }
  getNotFoundThrow(
    JSON.parse(treeString), // tree
    [0, 'tree', 1, 99], // path
    ['0', 'tree', '1'], // successfulPath (found object in path)
    ['0', 'tree', '1', '99'] // notFoundPath
  );
  getNotFoundThrow(
    JSON.parse(treeString), // tree
    [0, 1, 2], // path
    ['0'], // successfulPath (found object in path)
    ['0', '1'] // notFoundPath
  );
  getNotFoundThrow(
    JSON.parse(treeString), // tree
    ['a', 'b', 'c'], // path
    [], // successfulPath (found object in path)
    ['a'] // notFoundPath
  );

  // Throw 'part of path is not an object, not an object in path: []'
  expect(() => treeTools.getNode(JSON.parse(treeString), [0, 'value', 1]))
    .toThrow(new Error(`part of path is not an object, not an object in path: ${JSON.stringify(['0', 'value'])}`));

  // Throw 'Trying to add a non integer key inside an array.'
  let objWhenPathNotFoundNonIntegerKeyInsideArray = JSON.parse(treeString);
  expect(() => treeTools.getNode(objWhenPathNotFoundNonIntegerKeyInsideArray, ['a', 'b', 'c'], true))
    .toThrow(new Error(`Trying to add a non integer key inside an array.\n\tarray in path: []\n\ttrying to add key: a`));

  // Throw 'Trying to add an index greater than array length in array in path: (...)'
  expect(() => treeTools.getNode(JSON.parse(treeString), [99, 'b', 'c'], true))
    .toThrow(new Error(`Trying to add an index greater than array length in array in path: []`));

  // Valid input, found node
  expect(treeTools.getNode(JSON.parse(treeString), [2, 'id'])).toBe('_2');
  expect(treeTools.getNode(JSON.parse(treeString), ['2', 'id'])).toBe('_2'); // Same as above but numbers as string.
  expect(treeTools.getNode(JSON.parse(treeString), [0, 'tree', 1]))
    .toStrictEqual(JSON.parse('{"value":"a_value","tree":[{"value":"a_value","tree":[{"value":"a_value","tree":[],"id":"_0_1_0_0"},{"value":"a_value","tree":[],"id":"_0_1_0_1"}],"id":"_0_1_0"}],"id":"_0_1"}'));
  expect(treeTools.getNode(JSON.parse(treeString), ['0', 'tree', '1'])) // Same as above but numbers as string.
    .toStrictEqual(JSON.parse('{"value":"a_value","tree":[{"value":"a_value","tree":[{"value":"a_value","tree":[],"id":"_0_1_0_0"},{"value":"a_value","tree":[],"id":"_0_1_0_1"}],"id":"_0_1_0"}],"id":"_0_1"}'));
  expect(treeTools.getNode(JSON.parse(treeString), [])).toStrictEqual(JSON.parse(treeString));

  // Create path when path doesn't exist using createPathIfNotFound=true
  { // Forced scope {}
    let tree = JSON.parse(treeString);
    expect(treeTools.getNode(tree, [4, 'b', 'c'], true)).toStrictEqual({});
    // Since last pos before adding was 3, the inserted  object first path will be 4
    expect(tree[4]['b']['c']).toStrictEqual({});
  }
});

/**
 * Testing treeTools.isSubArray
 *
 * Signature:
 * function isSubArray(subArray, superArray)
 */
test('treeTools.isSubArray', () => {
  // throw 'subArray must be an array.'
  expect(() => treeTools.isSubArray()).toThrow(/^subArray must be an array.$/);
  // throw 'superArray must be an array.'
  expect(() => treeTools.isSubArray([])).toThrow(/^superArray must be an array.$/);
  expect(treeTools.isSubArray([], [])).toBe(true);

  function isSubArraySubTest(a1, a2, a3) {
    expect(treeTools.isSubArray(a1, a1)).toBe(true);
    expect(treeTools.isSubArray([], a1)).toBe(true);
    expect(treeTools.isSubArray(a1, [])).toBe(false);
    expect(treeTools.isSubArray(a1, a2)).toBe(false);
    expect(treeTools.isSubArray(a1, a3)).toBe(true);
    expect(treeTools.isSubArray(a2, a3)).toBe(false);
  }

  isSubArraySubTest(
    ['0', 'tree', '1', 'tree'],
    ['0', 'tree', '2', 'tree'],
    ['0', 'tree', '1', 'tree', '0', 'tree'],
  );
  isSubArraySubTest(
    [1, 2, 3],
    [1, 4, 3],
    [1, 2, 3, 4, 5, 6],
  );
  isSubArraySubTest(
    [true, false, true],
    [true, true, true],
    [true, false, true, false, true],
  );
  isSubArraySubTest(
    [1, true, 'true'],
    [1, false, 'true'],
    [1, true, 'true', 0, false, 'false'],
  );
  isSubArraySubTest(
    [1, true, 'true'],
    [1, false, 'true'],
    ['1', true, 'true', 0, false, 'false'], // Using 1 as a string
  );
});

/**
 * Testing treeTools.moveNode
 *
 * Signature:
 * function moveNode(obj, initialPath, finalPath, copyObj = false)
 */
test('treeTools.moveNode', () => {
  // throw 'obj must be an object.'
  expect(() => treeTools.moveNode()).toThrow(/^obj must be an object.$/);
  expect(() => treeTools.moveNode(false)).toThrow(/^obj must be an object.$/);
  expect(() => treeTools.moveNode('string')).toThrow(/^obj must be an object.$/);
  expect(() => treeTools.moveNode(1)).toThrow(/^obj must be an object.$/);

  // throw 'initialPath must be an array.'
  expect(() => treeTools.moveNode({})).toThrow(/^initialPath must be an array.$/);
  expect(() => treeTools.moveNode({}, 'string')).toThrow(/^initialPath must be an array.$/);
  expect(() => treeTools.moveNode({}, 1)).toThrow(/^initialPath must be an array.$/);
  expect(() => treeTools.moveNode({}, {})).toThrow(/^initialPath must be an array.$/);

  // throw 'initialPath must be non-empty array.'
  expect(() => treeTools.moveNode({}, [])).toThrow(/^initialPath must be non-empty array.$/);

  // throw `initialPath doesn't point to an existing node.`
  expect(() => treeTools.moveNode(JSON.parse(treeString), [100], [])).toThrow(/^initialPath doesn't point to an existing node.$/);

  // throw 'finalPath must be an array.'
  expect(() => treeTools.moveNode(JSON.parse(treeString), [0])).toThrow(/^finalPath must be an array.$/);
  expect(() => treeTools.moveNode(JSON.parse(treeString), [0], 'string')).toThrow(/^finalPath must be an array.$/);
  expect(() => treeTools.moveNode(JSON.parse(treeString), [0], 1)).toThrow(/^finalPath must be an array.$/);
  expect(() => treeTools.moveNode(JSON.parse(treeString), [0], {})).toThrow(/^finalPath must be an array.$/);

  // throw 'finalPath must be non-empty array.'
  expect(() => treeTools.moveNode(JSON.parse(treeString), [0], [])).toThrow(/^finalPath must be non-empty array.$/);

  // throw 'The object to be moved cannot be moved inside a child object.'
  expect(() => treeTools.moveNode(JSON.parse(treeString), [0], [0, 'tree', 0])).toThrow(/^The object to be moved cannot be moved inside a child object.$/)

  // throw 'Trying to add a non integer key inside an array. (...)'
  expect(() => treeTools.moveNode(JSON.parse(treeString), [0], [99.99]))
    .toThrow(
      new Error(`Trying to add a non integer key inside an array.\n\tarray in path: []\n\ttrying to add key: 99.99`)
    );
  expect(() => treeTools.moveNode(JSON.parse(treeString), [0], ['new_node']))
    .toThrow(
      new Error(`Trying to add a non integer key inside an array.\n\tarray in path: []\n\ttrying to add key: new_node`)
    );

  // throw 'Trying to add an index (...)'
  expect(() => treeTools.moveNode(JSON.parse(treeString), [0], [6]))
    .toThrow(
      new Error(`Trying to add an index (6) greater than array length (5) in array in path: []`)
    );

  // throw 'The object to be moved would overwrite an existing key.'
  { // Forced scope {}
    let originalTree = {
      0: {
        id: '_0'
      },
      new_node: 'this is a new node'
    };
    expect(() => treeTools.moveNode(originalTree, ['0', 'id'], ['new_node']))
      .toThrow(/^The object to be moved would overwrite an existing key.$/);
  } { // Forced scope {}
    let originalTree = {
      0: {
        id: '_0'
      },
      new_node: 'this is a new node'
    };
    expect(() => treeTools.moveNode(originalTree, ['0', 'id'], ['new_node'], true)) // Explicitly tell to throw
      .toThrow(/^The object to be moved would overwrite an existing key.$/);
  }

  function test_moveNode_correctMovement(initialPath, finalPath, originalTreeString, changedCorrectTreeString) {
    // Test if the returned tree is correct and that there was no copy
    let treeForNoCopy = JSON.parse(originalTreeString);
    let treeReturnedNoCopy = treeTools.moveNode(treeForNoCopy, initialPath, finalPath);
    expect(treeForNoCopy == treeReturnedNoCopy).toBe(true);
    expect(treeReturnedNoCopy).toStrictEqual(JSON.parse(changedCorrectTreeString));

    // Test if the returned tree is correct and that there was copy
    let treeForCopy = JSON.parse(originalTreeString);
    let treeReturnedCopy = treeTools.moveNode(treeForCopy, initialPath, finalPath, true, true);
    expect(treeForCopy == treeReturnedCopy).toBe(false);
    expect(treeReturnedCopy).toStrictEqual(JSON.parse(changedCorrectTreeString));
  }

  // initialPath and finalPath are the same, return initial obj (without changes)
  { // Forced scope {}
    test_moveNode_correctMovement(
      [0, 'tree', 1, 'tree', 0, 'id'], // initialPath
      [0, 'tree', 1, 'tree', 0, 'id'], // finalPath
      treeString, // originalTree
      treeString, // changedCorrectTree
    );
  }
  // initialPath container is object, finalPath doesn't exist, finalPath has only 1 key as text
  { // Forced scope {}
    let originalTree = {
      0: {
        id: '_0'
      }
    };
    let treeNewCorrect = {
      0: {},
      new_node: '_0'
    };
    test_moveNode_correctMovement(
      [0, 'id'], // initialPath
      ['new_node'], // finalPath
      JSON.stringify(originalTree), // originalTree
      JSON.stringify(treeNewCorrect), // changedCorrectTree
    );
  }
  // initialPath container is object, finalPath doesn't exist, finalPath has only 3 key as text
  { // Forced scope {}
    let originalTree = {
      0: {
        id: '_0'
      }
    };
    let treeNewCorrect = {
      0: {},
      new_node: {
        new_node: {
          new_node: '_0'
        }
      }
    };
    test_moveNode_correctMovement(
      [0, 'id'], // initialPath
      ['new_node', 'new_node', 'new_node'], // finalPath
      JSON.stringify(originalTree), // originalTree
      JSON.stringify(treeNewCorrect), // changedCorrectTree
    );
  }
  // initialPath container is object, finalPath doesn't exist, finalPath has only 1 key as decimal
  { // Forced scope {}
    let originalTree = {
      0: {
        id: '_0'
      }
    };
    let treeNewCorrect = {
      0: {},
      99.99: '_0'
    };
    test_moveNode_correctMovement(
      [0, 'id'], // initialPath
      [99.99], // finalPath
      JSON.stringify(originalTree), // originalTree
      JSON.stringify(treeNewCorrect), // changedCorrectTree
    );
  }
  // initialPath container is array, finalPath exist, finalPath has only 1 key as integer
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[5] = treeNewCorrect[4];
    treeNewCorrect[4] = treeNewCorrect[3];
    treeNewCorrect[3] = treeNewCorrect[0];
    treeNewCorrect.splice(0, 1);
    test_moveNode_correctMovement(
      [0], // initialPath
      [3], // finalPath
      treeString, // originalTree
      JSON.stringify(treeNewCorrect), // changedCorrectTree
    );
  }
  // initialPath container is array, finalPath doesn't exist, finalPath has only 1 key as integer
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[5] = treeNewCorrect[0];
    treeNewCorrect.splice(0, 1);
    test_moveNode_correctMovement(
      [0], // initialPath
      [5], // finalPath
      treeString, // originalTree
      JSON.stringify(treeNewCorrect), // changedCorrectTree
    );
  }
});

/**
 * Testing treeTools.getPathByID
 *
 * Signature:
 * function getPathByID(str, subTreeKey, delimiter)
 */
test('treeTools.getPathByID', () => {
  // throw 'str must be a non-empty string.'
  expect(() => treeTools.getPathByID()).toThrow(/^str must be a non-empty string.$/);
  expect(() => treeTools.getPathByID('')).toThrow(/^str must be a non-empty string.$/);
  expect(() => treeTools.getPathByID(1)).toThrow(/^str must be a non-empty string.$/);
  expect(() => treeTools.getPathByID(false)).toThrow(/^str must be a non-empty string.$/);
  expect(() => treeTools.getPathByID({})).toThrow(/^str must be a non-empty string.$/);
  expect(() => treeTools.getPathByID([])).toThrow(/^str must be a non-empty string.$/);

  // throw 'subTreeKey must be a non-empty string.'
  expect(() => treeTools.getPathByID('string')).toThrow(/^subTreeKey must be a non-empty string.$/);
  expect(() => treeTools.getPathByID('string', '')).toThrow(/^subTreeKey must be a non-empty string.$/);
  expect(() => treeTools.getPathByID('string', 1)).toThrow(/^subTreeKey must be a non-empty string.$/);
  expect(() => treeTools.getPathByID('string', false)).toThrow(/^subTreeKey must be a non-empty string.$/);
  expect(() => treeTools.getPathByID('string', {})).toThrow(/^subTreeKey must be a non-empty string.$/);
  expect(() => treeTools.getPathByID('string', [])).toThrow(/^subTreeKey must be a non-empty string.$/);

  //   throw 'delimiter must be a string without numbers.'
  expect(() => treeTools.getPathByID('string', 'tree', 1))
    .toThrow(/^delimiter must be a string without numbers.$/);
  expect(() => treeTools.getPathByID('string', 'tree', false))
    .toThrow(/^delimiter must be a string without numbers.$/);
  expect(() => treeTools.getPathByID('string', 'tree', {}))
    .toThrow(/^delimiter must be a string without numbers.$/);
  expect(() => treeTools.getPathByID('string', 'tree', []))
    .toThrow(/^delimiter must be a string without numbers.$/);
  expect(() => treeTools.getPathByID('string', 'tree', 'string 1 string'))
    .toThrow(/^delimiter must be a string without numbers.$/);
  expect(() => treeTools.getPathByID('string', 'tree', '1'))
    .toThrow(/^delimiter must be a string without numbers.$/);
  expect(() => treeTools.getPathByID('string', 'tree', '_1_1_1_'))
    .toThrow(/^delimiter must be a string without numbers.$/);

  // throw 'When splitting str the results should always be numbers, received: [...]'
  expect(() => treeTools.getPathByID('a_b_c_d_e', 'tree', '_'))
    .toThrow(new Error(`When splitting str the results should always be numbers, received: ${JSON.stringify(['a','b','c','d','e',])}.`));
  expect(() => treeTools.getPathByID('0_1_c_d_e', 'tree', '_'))
    .toThrow(new Error(`When splitting str the results should always be numbers, received: ${JSON.stringify(['0','1','c','d','e',])}.`));
  expect(() => treeTools.getPathByID('0a_1b_c_d_e', 'tree', '_'))
    .toThrow(new Error(`When splitting str the results should always be numbers, received: ${JSON.stringify(['0a','1b','c','d','e',])}.`));

  // Valid inputs, valid outputs
  expect(treeTools.getPathByID('0', 'tree', ''))
    .toStrictEqual(['0']);
  expect(treeTools.getPathByID('99', 'tree', '_'))
    .toStrictEqual(['99']);
  expect(treeTools.getPathByID('_99_', 'tree', '_'))
    .toStrictEqual(['99']);
  expect(treeTools.getPathByID('01234', 'tree', ''))
    .toStrictEqual(['0', 'tree', '1', 'tree', '2', 'tree', '3', 'tree', '4']);
  expect(treeTools.getPathByID('0_1_2_3_4', 'tree', '_'))
    .toStrictEqual(['0', 'tree', '1', 'tree', '2', 'tree', '3', 'tree', '4']);
  expect(treeTools.getPathByID('_0_1_2_3_4_', 'tree', '_'))
    .toStrictEqual(['0', 'tree', '1', 'tree', '2', 'tree', '3', 'tree', '4']);
  expect(treeTools.getPathByID('0:o:1:o:2:o:3:o:4', 'tree', ':o:'))
    .toStrictEqual(['0', 'tree', '1', 'tree', '2', 'tree', '3', 'tree', '4']);
  expect(treeTools.getPathByID(':o:0:o:1:o:2:o:3:o:4:o:', 'tree', ':o:'))
    .toStrictEqual(['0', 'tree', '1', 'tree', '2', 'tree', '3', 'tree', '4']);
  expect(treeTools.getPathByID('0$$$1$$$2$$$3$$$4', 'tree', '$$$'))
    .toStrictEqual(['0', 'tree', '1', 'tree', '2', 'tree', '3', 'tree', '4']);
  expect(treeTools.getPathByID('$$$0$$$1$$$2$$$3$$$4$$$', 'tree', '$$$'))
    .toStrictEqual(['0', 'tree', '1', 'tree', '2', 'tree', '3', 'tree', '4']);
  expect(treeTools.getPathByID('43210', 'tree', ''))
    .toStrictEqual(['4', 'tree', '3', 'tree', '2', 'tree', '1', 'tree', '0']);
});

/**
 * Testing treeTools.newPathByPosition
 *
 * Signature:
 * function newPathByPosition(tree, path, position, subTreeKey)
 */
test('treeTools.newPathByPosition', () => {
  /*
    Notes on possible future tests:
    - Try creating a new path using a faulty structure
   */
  // throw 'tree must be an object.'
  expect(() => treeTools.newPathByPosition(1)).toThrow(/^tree must be an object.$/);
  expect(() => treeTools.newPathByPosition(false)).toThrow(/^tree must be an object.$/);
  expect(() => treeTools.newPathByPosition('string')).toThrow(/^tree must be an object.$/);

  // throw 'path must be a non-empty array.'
  expect(() => treeTools.newPathByPosition([], 1)).toThrow(/^path must be a non-empty array.$/);
  expect(() => treeTools.newPathByPosition([], false)).toThrow(/^path must be a non-empty array.$/);
  expect(() => treeTools.newPathByPosition([], 'string')).toThrow(/^path must be a non-empty array.$/);
  expect(() => treeTools.newPathByPosition([], {})).toThrow(/^path must be a non-empty array.$/);
  expect(() => treeTools.newPathByPosition([], [])).toThrow(/^path must be a non-empty array.$/);

  // throw `path doesn't point to an existing node.`
  expect(() => treeTools.newPathByPosition([], [0])).toThrow(new Error(`path doesn't point to an existing node.`))
  expect(() => treeTools.newPathByPosition([], ['0'])).toThrow(new Error(`path doesn't point to an existing node.`))
  expect(() => treeTools.newPathByPosition([], ['string'])).toThrow(new Error(`path doesn't point to an existing node.`))

  // throw `position must be a string, possible values: 'before'|'after'|'below'.`
  let positionThrow = `position must be a string, possible values: 'before'|'after'|'below'.`;
  expect(() => treeTools.newPathByPosition([{}], [0])).toThrow(new Error(positionThrow));
  expect(() => treeTools.newPathByPosition([{}], [0], 1)).toThrow(new Error(positionThrow));
  expect(() => treeTools.newPathByPosition([{}], [0], false)).toThrow(new Error(positionThrow));
  expect(() => treeTools.newPathByPosition([{}], [0], {})).toThrow(new Error(positionThrow));
  expect(() => treeTools.newPathByPosition([{}], [0], [])).toThrow(new Error(positionThrow));
  expect(() => treeTools.newPathByPosition([{}], [0], '')).toThrow(new Error(positionThrow));
  expect(() => treeTools.newPathByPosition([{}], [0], 'string')).toThrow(new Error(positionThrow));

  // throw 'subTreeKey must be a non-empty string.'
  expect(() => treeTools.newPathByPosition([{}], [0], 'before')).toThrow(/^subTreeKey must be a non-empty string.$/);
  expect(() => treeTools.newPathByPosition([{}], [0], 'before', 1)).toThrow(/^subTreeKey must be a non-empty string.$/);
  expect(() => treeTools.newPathByPosition([{}], [0], 'before', false)).toThrow(/^subTreeKey must be a non-empty string.$/);
  expect(() => treeTools.newPathByPosition([{}], [0], 'before', {})).toThrow(/^subTreeKey must be a non-empty string.$/);
  expect(() => treeTools.newPathByPosition([{}], [0], 'before', [])).toThrow(/^subTreeKey must be a non-empty string.$/);

  // throw `newPath doesn't point to an array [...]`
  //  valid inputs, position=below, 'tree' key points to something other than array
  expect(() => treeTools.newPathByPosition(JSON.parse(treeString), [2], 'below', 'tree'))
    .toThrow(new Error(`In the tree the path ${[JSON.stringify(['2','tree'])]} doesn't point to an array but it should.`));

  // valid inputs, position=before
  expect(treeTools.newPathByPosition(JSON.parse(treeString), [0], 'before', 'tree'))
    .toStrictEqual(['0']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), ['0'], 'before', 'tree'))
    .toStrictEqual(['0']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), [0, 'tree', 1, 'tree', 0, 'tree', 1], 'before', 'tree'))
    .toStrictEqual(['0', 'tree', '1', 'tree', '0', 'tree', '1']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), ['0', 'tree', '1', 'tree', '0', 'tree', '1'], 'before', 'tree'))
    .toStrictEqual(['0', 'tree', '1', 'tree', '0', 'tree', '1']);

  // valid inputs, position=after
  expect(treeTools.newPathByPosition(JSON.parse(treeString), [0], 'after', 'tree'))
    .toStrictEqual(['1']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), ['0'], 'after', 'tree'))
    .toStrictEqual(['1']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), [0, 'tree', 1, 'tree', 0, 'tree', 1], 'after', 'tree'))
    .toStrictEqual(['0', 'tree', '1', 'tree', '0', 'tree', '2']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), ['0', 'tree', '1', 'tree', '0', 'tree', '1'], 'after', 'tree'))
    .toStrictEqual(['0', 'tree', '1', 'tree', '0', 'tree', '2']);

  // valid inputs, position=below, 'tree' key doesn't exist
  expect(treeTools.newPathByPosition(JSON.parse(treeString), [1], 'below', 'tree'))
    .toStrictEqual(['1', 'tree', '0']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), ['1'], 'below', 'tree'))
    .toStrictEqual(['1', 'tree', '0']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), [4, 'tree', 0], 'below', 'tree'))
    .toStrictEqual(['4', 'tree', '0', 'tree', '0']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), ['4', 'tree', '0'], 'below', 'tree'))
    .toStrictEqual(['4', 'tree', '0', 'tree', '0']);

  // valid inputs, position=below, 'tree' key points to an empty array
  expect(treeTools.newPathByPosition(JSON.parse(treeString), [3], 'below', 'tree'))
    .toStrictEqual(['3', 'tree', '0']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), ['3'], 'below', 'tree'))
    .toStrictEqual(['3', 'tree', '0']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), [0, 'tree', 1, 'tree', 0, 'tree', 1], 'below', 'tree'))
    .toStrictEqual(['0', 'tree', '1', 'tree', '0', 'tree', '1', 'tree', '0']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), ['0', 'tree', '1', 'tree', '0', 'tree', '1'], 'below', 'tree'))
    .toStrictEqual(['0', 'tree', '1', 'tree', '0', 'tree', '1', 'tree', '0']);

  // valid inputs, position=below, 'tree' key points to an array with elements
  expect(treeTools.newPathByPosition(JSON.parse(treeString), [0], 'below', 'tree'))
    .toStrictEqual(['0', 'tree', '2']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), ['0'], 'below', 'tree'))
    .toStrictEqual(['0', 'tree', '2']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), [0, 'tree', 1, 'tree', 0], 'below', 'tree'))
    .toStrictEqual(['0', 'tree', '1', 'tree', '0', 'tree', '2']);
  expect(treeTools.newPathByPosition(JSON.parse(treeString), ['0', 'tree', '1', 'tree', '0'], 'below', 'tree'))
    .toStrictEqual(['0', 'tree', '1', 'tree', '0', 'tree', '2']);
});

/**
 * Testing treeTools.moveNodeNextToNode
 *
 * Signature:
 * function moveNodeNextToNode(tree, movedNodePathStr, nextToNodePathStr, position, subTreeKey, idDelimiter = '_', copyTree = false)
 */
test('treeTools.moveNodeNextToNode', () => {
  /*
    Notes on possible future tests:
    - Maybe this function should validate the input as other functions do. If so -> test.
   */
  // throw 'tree must be an object.'
  expect(() => treeTools.moveNodeNextToNode(1)).toThrow(/^tree must be an object.$/);
  expect(() => treeTools.moveNodeNextToNode(false)).toThrow(/^tree must be an object.$/);
  expect(() => treeTools.moveNodeNextToNode('string')).toThrow(/^tree must be an object.$/);

  // throw `movedNodePathStr must be a string containing the path of the given node, this path must be separated by a pathDelimiter.`
  expect(() => treeTools.moveNodeNextToNode([])).toThrow(/^movedNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
  expect(() => treeTools.moveNodeNextToNode([], 1)).toThrow(/^movedNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
  expect(() => treeTools.moveNodeNextToNode([], false)).toThrow(/^movedNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
  expect(() => treeTools.moveNodeNextToNode([], {})).toThrow(/^movedNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
  expect(() => treeTools.moveNodeNextToNode([], [])).toThrow(/^movedNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
  expect(() => treeTools.moveNodeNextToNode([], '')).toThrow(/^movedNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);

  // throw `nextToNodePathStr must be a string containing the path of the given node, this path must be separated by a pathDelimiter.`
  expect(() => treeTools.moveNodeNextToNode([], '_0_0')).toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', 1)).toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', false)).toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', {})).toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', [])).toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', '')).toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);

  //   throw `position must be a string, possible values: 'before'|'after'|'below'.`
  let positionThrow = `position must be a string, possible values: 'before'|'after'|'below'.`;
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0')).toThrow(new Error(positionThrow));
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', 1)).toThrow(new Error(positionThrow));
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', false)).toThrow(new Error(positionThrow));
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', {})).toThrow(new Error(positionThrow));
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', [])).toThrow(new Error(positionThrow));
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', '')).toThrow(new Error(positionThrow));
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', 'string')).toThrow(new Error(positionThrow));

  // throw 'subTreeKey must be a non-empty string.'
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', 'before'))
    .toThrow(/^subTreeKey must be a non-empty string.$/);
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', 'before', 1))
    .toThrow(/^subTreeKey must be a non-empty string.$/);
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', 'before', false))
    .toThrow(/^subTreeKey must be a non-empty string.$/);
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', 'before', {}))
    .toThrow(/^subTreeKey must be a non-empty string.$/);
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', 'before', []))
    .toThrow(/^subTreeKey must be a non-empty string.$/);
  expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', 'before', ''))
    .toThrow(/^subTreeKey must be a non-empty string.$/);

  // throw `moved node doesn't exist with (movedNodePathStr[${movedNodePathStr}]).`
  expect(() => treeTools.moveNodeNextToNode(JSON.parse(treeString), '_99_0', '_0_0', 'before', 'tree'))
    .toThrow(new Error(`movedNode node doesn't exist (movedNodePathStr[_99_0]).`));
  expect(() => treeTools.moveNodeNextToNode(JSON.parse(treeString), '_99', '_0_0', 'before', 'tree'))
    .toThrow(new Error(`movedNode node doesn't exist (movedNodePathStr[_99]).`));

  // throw `nextToNode doesn't exist (nextToNodePathStr[${nextToNodePathStr}]).`;
  expect(() => treeTools.moveNodeNextToNode(JSON.parse(treeString), '_0_0', '_99', 'before', 'tree'))
    .toThrow(new Error(`nextToNode node doesn't exist (nextToNodePathStr[_99]).`));
  expect(() => treeTools.moveNodeNextToNode(JSON.parse(treeString), '_0_0', '_99_0', 'before', 'tree'))
    .toThrow(new Error(`nextToNode node doesn't exist (nextToNodePathStr[_99_0]).`));

  // throw 'The object to be moved cannot be moved inside a child object.'
  expect(() => treeTools.moveNodeNextToNode(JSON.parse(treeString), '_0', '_0_0', 'before', 'tree'))
    .toThrow(/^The object to be moved cannot be moved inside a child object.$/);
  expect(() => treeTools.moveNodeNextToNode(JSON.parse(treeString), '_0_1_0', '_0_1_0_0', 'before', 'tree'))
    .toThrow(/^The object to be moved cannot be moved inside a child object.$/);

  // moveNodeNextToNode(tree, movedNodePathStr, nextToNodePathStr, position, subTreeKey, idDelimiter = '_', copyTree = false)
  function test_moveNodeNextToNode_correctMovement(
    movedNodePathStr, nextToNodePathStr, position, subTreeKey, idDelimiter,
    originalTreeString, changedCorrectTreeString
  ) {
    // Test if the returned tree is correct and that there was no copy
    let treeForNoCopy = JSON.parse(originalTreeString);
    let treeReturnedNoCopy = treeTools.moveNodeNextToNode(
      treeForNoCopy, movedNodePathStr, nextToNodePathStr, position, subTreeKey, idDelimiter);
    expect(treeForNoCopy == treeReturnedNoCopy).toBe(true);
    expect(treeReturnedNoCopy).toStrictEqual(JSON.parse(changedCorrectTreeString));

    // Test if the returned tree is correct and that there was copy
    let treeForCopy = JSON.parse(originalTreeString);
    let treeReturnedCopy = treeTools.moveNodeNextToNode(
      treeForCopy, movedNodePathStr, nextToNodePathStr, position, subTreeKey, idDelimiter, true);
    expect(treeForCopy == treeReturnedCopy).toBe(false);
    expect(treeReturnedCopy).toStrictEqual(JSON.parse(changedCorrectTreeString));
  }

  // movedNodePathStr and nextToNodePathStr are the same, position=before, return initial obj (without changes)
  { // Forced scope {}
    test_moveNodeNextToNode_correctMovement(
      '_0', // movedNodePathStr
      '_0', // nextToNodePathStr
      'before', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      treeString, // changedCorrectTreeString
    );
  }
  // movedNodePathStr and nextToNodePathStr are the same, position=before, return initial obj (without changes)
  { // Forced scope {}
    test_moveNodeNextToNode_correctMovement(
      '_0_1_0_1', // movedNodePathStr
      '_0_1_0_1', // nextToNodePathStr
      'before', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      treeString, // changedCorrectTreeString
    );
  }
  // movedNodePathStr and nextToNodePathStr are the same, position=after, return initial obj (without changes)
  { // Forced scope {}
    test_moveNodeNextToNode_correctMovement(
      '_0', // movedNodePathStr
      '_0', // nextToNodePathStr
      'after', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      treeString, // changedCorrectTreeString
    );
  }
  // movedNodePathStr and nextToNodePathStr are the same, position=after, return initial obj (without changes)
  { // Forced scope {}
    test_moveNodeNextToNode_correctMovement(
      '_0_1_0_1', // movedNodePathStr
      '_0_1_0_1', // nextToNodePathStr
      'after', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      treeString, // changedCorrectTreeString
    );
  }

  // Valid movement, position=before, top level to top level
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[5] = treeNewCorrect[4];
    treeNewCorrect[4] = treeNewCorrect[0];
    treeNewCorrect.splice(0, 1);
    test_moveNodeNextToNode_correctMovement(
      '_0', // movedNodePathStr
      '_4', // nextToNodePathStr
      'before', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }
  // Valid movement, position=after, top level to top level
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[5] = treeNewCorrect[0];
    treeNewCorrect.splice(0, 1);
    test_moveNodeNextToNode_correctMovement(
      '_0', // movedNodePathStr
      '_4', // nextToNodePathStr
      'after', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }

  // Valid movement, position=before, deep level to deep level, nextToNode doesn't have any siblings
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][0]['tree'].splice(0, 0, treeNewCorrect[0]['tree'][1]['tree'][0]['tree'][1]);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(1, 1);
    test_moveNodeNextToNode_correctMovement(
      '_0_1_0_1', // movedNodePathStr
      '_0_0_0', // nextToNodePathStr
      'before', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }
  // Valid movement, position=after, deep level to deep level, nextToNode doesn't have any siblings
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][0]['tree'].splice(1, 0, treeNewCorrect[0]['tree'][1]['tree'][0]['tree'][1]);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(1, 1);
    test_moveNodeNextToNode_correctMovement(
      '_0_1_0_1', // movedNodePathStr
      '_0_0_0', // nextToNodePathStr
      'after', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }

  // Valid movement, position=before, deep level to deep level,
  //  nextToNode has one sibling, nextToNode is first in array
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(0, 0, treeNewCorrect[0]['tree'][0]['tree'][0]);
    treeNewCorrect[0]['tree'][0]['tree'].splice(0, 1);
    test_moveNodeNextToNode_correctMovement(
      '_0_0_0', // movedNodePathStr
      '_0_1_0_0', // nextToNodePathStr
      'before', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }
  // Valid movement, position=after, deep level to deep level,
  //  nextToNode has one sibling, nextToNode is first in array
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(1, 0, treeNewCorrect[0]['tree'][0]['tree'][0]);
    treeNewCorrect[0]['tree'][0]['tree'].splice(0, 1);
    test_moveNodeNextToNode_correctMovement(
      '_0_0_0', // movedNodePathStr
      '_0_1_0_0', // nextToNodePathStr
      'after', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }

  // Valid movement, position=before, deep level to deep level,
  //  nextToNode has one sibling, nextToNode is last in array
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(1, 0, treeNewCorrect[0]['tree'][0]['tree'][0]);
    treeNewCorrect[0]['tree'][0]['tree'].splice(0, 1);
    test_moveNodeNextToNode_correctMovement(
      '_0_0_0', // movedNodePathStr
      '_0_1_0_1', // nextToNodePathStr
      'before', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }
  // Valid movement, position=after, deep level to deep level,
  //  nextToNode has one sibling, nextToNode is last in array
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(2, 0, treeNewCorrect[0]['tree'][0]['tree'][0]);
    treeNewCorrect[0]['tree'][0]['tree'].splice(0, 1);
    test_moveNodeNextToNode_correctMovement(
      '_0_0_0', // movedNodePathStr
      '_0_1_0_1', // nextToNodePathStr
      'after', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }

  // Valid movement, position=below, top level to top level, destination tree is empty
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[3]['tree'].splice(0, 0, treeNewCorrect[0]);
    treeNewCorrect.splice(0, 1);
    test_moveNodeNextToNode_correctMovement(
      '_0', // movedNodePathStr
      '_3', // nextToNodePathStr
      'below', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }
  // Valid movement, position=below, top level to deep level, destination tree is empty
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'][0]['tree'].splice(0, 0, treeNewCorrect[1]);
    treeNewCorrect.splice(1, 1);
    test_moveNodeNextToNode_correctMovement(
      '_1', // movedNodePathStr
      '_0_1_0_0', // nextToNodePathStr
      'below', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }
  // Valid movement, position=below, deep level to deep level, destination tree is empty
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[3]['tree'].splice(0, 0, treeNewCorrect[0]['tree'][1]['tree'][0]['tree'][0]);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(0, 1);
    test_moveNodeNextToNode_correctMovement(
      '_0_1_0_0', // movedNodePathStr
      '_3', // nextToNodePathStr
      'below', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }

  // Valid movement, position=below, top level to top level, destination tree has children
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'].splice(2, 0, treeNewCorrect[4]);
    treeNewCorrect.splice(4, 1);
    test_moveNodeNextToNode_correctMovement(
      '_4', // movedNodePathStr
      '_0', // nextToNodePathStr
      'below', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }
  // Valid movement, position=below, top level to deep level, destination tree has children
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(2, 0, treeNewCorrect[4]);
    treeNewCorrect.splice(4, 1);
    test_moveNodeNextToNode_correctMovement(
      '_4', // movedNodePathStr
      '_0_1_0', // nextToNodePathStr
      'below', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }

  // Valid movement, position=below, top level to top level, destination tree doesn't exist
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[1]['tree'] = [treeNewCorrect[0]];
    treeNewCorrect.splice(0, 1);
    test_moveNodeNextToNode_correctMovement(
      '_0', // movedNodePathStr
      '_1', // nextToNodePathStr
      'below', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }

  // Valid movement, position=below, moving a node that affects order for destination
  // When removing _0_0 the path for _0_1_0_1 would change to _0_0_0_1.
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'][1]['tree'] = [treeNewCorrect[0]['tree'][0]];
    treeNewCorrect[0]['tree'].splice(0, 1);
    test_moveNodeNextToNode_correctMovement(
      '_0_0', // movedNodePathStr
      '_0_1_0_1', // nextToNodePathStr
      'below', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }

  // Valid movement, position=before, movedNodePathStr and nextToNodePathStr written in different ways, without delimiter on borders
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][0]['tree'].splice(0, 0, treeNewCorrect[0]['tree'][1]['tree'][0]['tree'][1]);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(1, 1);
    test_moveNodeNextToNode_correctMovement(
      '0_1_0_1', // movedNodePathStr
      '0_0_0', // nextToNodePathStr
      'before', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }
  // Valid movement, position=before, movedNodePathStr and nextToNodePathStr written in different ways, delimiter on beginning
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][0]['tree'].splice(0, 0, treeNewCorrect[0]['tree'][1]['tree'][0]['tree'][1]);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(1, 1);
    test_moveNodeNextToNode_correctMovement(
      '_0_1_0_1', // movedNodePathStr
      '_0_0_0', // nextToNodePathStr
      'before', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }
  // Valid movement, position=before, movedNodePathStr and nextToNodePathStr written in different ways, delimiter on end
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][0]['tree'].splice(0, 0, treeNewCorrect[0]['tree'][1]['tree'][0]['tree'][1]);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(1, 1);
    test_moveNodeNextToNode_correctMovement(
      '0_1_0_1_', // movedNodePathStr
      '0_0_0_', // nextToNodePathStr
      'before', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }
  // Valid movement, position=before, movedNodePathStr and nextToNodePathStr written in different ways, delimiter on both sides
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][0]['tree'].splice(0, 0, treeNewCorrect[0]['tree'][1]['tree'][0]['tree'][1]);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(1, 1);
    test_moveNodeNextToNode_correctMovement(
      '_0_1_0_1_', // movedNodePathStr
      '_0_0_0_', // nextToNodePathStr
      'before', // position
      'tree', // subTreeKey
      '_', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }

  // Valid movement, position=before, movedNodePathStr and nextToNodePathStr written in different ways, $$$ as delimiter
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][0]['tree'].splice(0, 0, treeNewCorrect[0]['tree'][1]['tree'][0]['tree'][1]);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(1, 1);
    test_moveNodeNextToNode_correctMovement(
      '$$$0$$$1$$$0$$$1$$$', // movedNodePathStr
      '$$$0$$$0$$$0$$$', // nextToNodePathStr
      'before', // position
      'tree', // subTreeKey
      '$$$', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }
  // Valid movement, position=before, movedNodePathStr and nextToNodePathStr written in different ways, ~ as delimiter
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][0]['tree'].splice(0, 0, treeNewCorrect[0]['tree'][1]['tree'][0]['tree'][1]);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(1, 1);
    test_moveNodeNextToNode_correctMovement(
      '~0~1~0~1~', // movedNodePathStr
      '~0~0~0~', // nextToNodePathStr
      'before', // position
      'tree', // subTreeKey
      '~', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }
  // Valid movement, position=before, movedNodePathStr and nextToNodePathStr written in different ways, 'hola esto es un string ' as delimiter
  { // Forced scope {}
    let treeNewCorrect = JSON.parse(treeString);
    treeNewCorrect[0]['tree'][0]['tree'].splice(0, 0, treeNewCorrect[0]['tree'][1]['tree'][0]['tree'][1]);
    treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(1, 1);
    test_moveNodeNextToNode_correctMovement(
      'hola esto es un string 0hola esto es un string 1hola esto es un string 0hola esto es un string 1hola esto es un string ', // movedNodePathStr
      'hola esto es un string 0hola esto es un string 0hola esto es un string 0hola esto es un string ', // nextToNodePathStr
      'before', // position
      'tree', // subTreeKey
      'hola esto es un string ', // idDelimiter = '_'
      treeString, // originalTreeString
      JSON.stringify(treeNewCorrect), // changedCorrectTreeString
    );
  }
});
