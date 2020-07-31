import objTools from '@/lib/objTools.js'

/**
 * This string is used for the tree and is converted when used to avoid using an object an have some test change it.
 * @type {String}
 */
const treeString = '[{"value":"a_value","tree":[{"value":"a_value","tree":[{"value":"a_value","tree":[],"id":"_0_0_0"}],"id":"_0_0"},{"value":"a_value","tree":[{"value":"a_value","tree":[{"value":"a_value","tree":[],"id":"_0_1_0_0"},{"value":"a_value","tree":[],"id":"_0_1_0_1"}],"id":"_0_1_0"}],"id":"_0_1"}],"id":"_0"},{},{"tree":{},"id":"_2"},{"tree":[],"id":"_3"},{"tree":[{}],"id":"_4"}]';

/**
 * Testing objTools.findPath
 *
 * Signature:
 * function findPath(obj, value)
 */
test('objTools.findPath', () => {
    // Mandatory params, throws
    expect(() => objTools.findPath()).toThrow(/^obj is mandatory.$/);
    expect(() => objTools.findPath('hello')).toThrow(/^value is mandatory.$/);
    // Throw 'value cannod be an object.'
    expect(() => objTools.findPath('hello', {})).toThrow(/^value cannod be an object.$/);
    expect(() => objTools.findPath('hello', [])).toThrow(/^value cannod be an object.$/);
    // Valid input multiple tests
    expect(objTools.findPath('hello', 'hello')).toBe(true);
    expect(objTools.findPath('hello', 'bye')).toBe(false);
    expect(objTools.findPath(JSON.parse(treeString), '_0_1_0_0'))
        .toStrictEqual(["0", "tree", "1", "tree", "0", "tree", "0", "id"]);
    expect(objTools.findPath(JSON.parse(treeString), '_0_1'))
        .toStrictEqual(["0", "tree", "1", "id"]);
    expect(objTools.findPath(JSON.parse(treeString), '_3'))
        .toStrictEqual(["3", "id"]);
    expect(objTools.findPath(JSON.parse(treeString), '_99'))
        .toBe(false);
    expect(objTools.findPath({
        true: 1,
        false: 2
    }, '1')).toStrictEqual(["true"]);
});

/**
 * Testing objTools.nodeExists
 *
 * Signature:
 * function nodeExists(obj, path)
 */
test(`objTools.nodeExists`, () => {
    // throw 'obj must be an object.'
    expect(() => objTools.nodeExists()).toThrow(/^obj must be an object.$/);
    expect(() => objTools.nodeExists(false)).toThrow(/^obj must be an object.$/);
    expect(() => objTools.nodeExists('string')).toThrow(/^obj must be an object.$/);
    expect(() => objTools.nodeExists(1)).toThrow(/^obj must be an object.$/);

    // throw 'path must be an array.'
    expect(() => objTools.nodeExists({})).toThrow(/^path must be an array.$/);
    expect(() => objTools.nodeExists({}, 'string')).toThrow(/^path must be an array.$/);
    expect(() => objTools.nodeExists({}, 1)).toThrow(/^path must be an array.$/);
    expect(() => objTools.nodeExists({}, {})).toThrow(/^path must be an array.$/);

    // If path is empty array return true as path should point to obj
    expect(objTools.nodeExists(JSON.parse(treeString), [])).toBe(true);
    expect(objTools.nodeExists({}, [])).toBe(true);

    // If obj is empty object and path is non-empty array return false
    expect(objTools.nodeExists({}, [1, 2, 3])).toBe(false);

    // Valid input, found node
    expect(objTools.nodeExists(JSON.parse(treeString), [0, 'tree', 1, 'tree', 0, 'tree', 1])).toBe(true);

    // Valid input, not found node
    expect(objTools.nodeExists(JSON.parse(treeString), [0, 'tree', 1, 'tree', 0, 'tree', 99])).toBe(false);
});

/**
 * Testing objTools.getNode
 *
 * Signature:
 * function getNode(obj, path, createPathIfNotFound = false)
 */
test('objTools.getNode', () => {
    // throw 'obj must be an object.'
    expect(() => objTools.getNode()).toThrow(/^obj must be an object.$/);
    expect(() => objTools.getNode(false)).toThrow(/^obj must be an object.$/);
    expect(() => objTools.getNode('string')).toThrow(/^obj must be an object.$/);
    expect(() => objTools.getNode(1)).toThrow(/^obj must be an object.$/);

    // throw 'path must be an array.'
    expect(() => objTools.getNode({})).toThrow(/^path must be an array.$/);
    expect(() => objTools.getNode({}, 'string')).toThrow(/^path must be an array.$/);
    expect(() => objTools.getNode({}, 1)).toThrow(/^path must be an array.$/);
    expect(() => objTools.getNode({}, {})).toThrow(/^path must be an array.$/);

    // Throw Not found error and check error
    function getNotFoundThrow(obj, path, successfulPath, notFoundPath) {
        let notFoundErrorTpl = `obj's path not reachable\n\tsuccessful path: %SUCCESSFUL_PATH%\n\tnot found path: %NOTFOUND_PATH%`;
        let notFoundErrorMsg = '';
        notFoundErrorMsg = notFoundErrorTpl;
        notFoundErrorMsg = notFoundErrorMsg.replace(/%SUCCESSFUL_PATH%/, JSON.stringify(successfulPath))
        notFoundErrorMsg = notFoundErrorMsg.replace(/%NOTFOUND_PATH%/, JSON.stringify(notFoundPath))
        expect(() => objTools.getNode(obj, path))
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
    expect(() => objTools.getNode(JSON.parse(treeString), [0, 'value', 1]))
        .toThrow(new Error(`part of path is not an object, not an object in path: ${JSON.stringify(['0', 'value'])}`));

    // Throw 'Trying to add a non integer key inside an array:'
    let objWhenPathNotFoundNonIntegerKeyInsideArray = JSON.parse(treeString);
    expect(() => objTools.getNode(objWhenPathNotFoundNonIntegerKeyInsideArray, ['a', 'b', 'c'], true))
        .toThrow(new Error(`Trying to add a non integer key inside an array:\n\tarray in path: []\n\ttrying to add key: a.`));

    // Throw 'Trying to add an index greater than array length in array in path: (...)'
    expect(() => objTools.getNode(JSON.parse(treeString), [99, 'b', 'c'], true))
        .toThrow(new Error(`Trying to add an index greater than array length in array in path: []`));

    // Valid input, found node
    expect(objTools.getNode(JSON.parse(treeString), [2, 'id'])).toBe('_2');
    expect(objTools.getNode(JSON.parse(treeString), ['2', 'id'])).toBe('_2'); // Same as above but numbers as string.
    expect(objTools.getNode(JSON.parse(treeString), [0, 'tree', 1]))
        .toStrictEqual(JSON.parse('{"value":"a_value","tree":[{"value":"a_value","tree":[{"value":"a_value","tree":[],"id":"_0_1_0_0"},{"value":"a_value","tree":[],"id":"_0_1_0_1"}],"id":"_0_1_0"}],"id":"_0_1"}'));
    expect(objTools.getNode(JSON.parse(treeString), ['0', 'tree', '1'])) // Same as above but numbers as string.
        .toStrictEqual(JSON.parse('{"value":"a_value","tree":[{"value":"a_value","tree":[{"value":"a_value","tree":[],"id":"_0_1_0_0"},{"value":"a_value","tree":[],"id":"_0_1_0_1"}],"id":"_0_1_0"}],"id":"_0_1"}'));
    expect(objTools.getNode(JSON.parse(treeString), [])).toStrictEqual(JSON.parse(treeString));

    // Create path when path doesn't exist using createPathIfNotFound=true
    { // Forced scope {}
        let tree = JSON.parse(treeString);
        expect(objTools.getNode(tree, [4, 'b', 'c'], true)).toStrictEqual({});
        // Since last pos before adding was 3, the inserted  object first path will be 4
        expect(tree[4]['b']['c']).toStrictEqual({});
    }
});

/**
 * Testing objTools.isSubArray
 *
 * Signature:
 * function isSubArray(subArray, superArray)
 */
test('objTools.isSubArray', () => {
    // throw 'subArray must be an array.'
    expect(() => objTools.isSubArray()).toThrow(/^subArray must be an array.$/);
    // throw 'superArray must be an array.'
    expect(() => objTools.isSubArray([])).toThrow(/^superArray must be an array.$/);
    expect(objTools.isSubArray([], [])).toBe(true);

    function isSubArraySubTest(a1, a2, a3) {
        expect(objTools.isSubArray(a1, a1)).toBe(true);
        expect(objTools.isSubArray([], a1)).toBe(true);
        expect(objTools.isSubArray(a1, [])).toBe(false);
        expect(objTools.isSubArray(a1, a2)).toBe(false);
        expect(objTools.isSubArray(a1, a3)).toBe(true);
        expect(objTools.isSubArray(a2, a3)).toBe(false);
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
 * Testing objTools.moveNode
 *
 * Signature:
 * function moveNode(obj, initialPath, finalPath, copyObj = false)
 */
test('objTools.moveNode', () => {
    // throw 'obj must be an object.'
    expect(() => objTools.moveNode()).toThrow(/^obj must be an object.$/);
    expect(() => objTools.moveNode(false)).toThrow(/^obj must be an object.$/);
    expect(() => objTools.moveNode('string')).toThrow(/^obj must be an object.$/);
    expect(() => objTools.moveNode(1)).toThrow(/^obj must be an object.$/);

    // throw 'initialPath must be an array.'
    expect(() => objTools.moveNode({})).toThrow(/^initialPath must be an array.$/);
    expect(() => objTools.moveNode({}, 'string')).toThrow(/^initialPath must be an array.$/);
    expect(() => objTools.moveNode({}, 1)).toThrow(/^initialPath must be an array.$/);
    expect(() => objTools.moveNode({}, {})).toThrow(/^initialPath must be an array.$/);

    // throw 'initialPath must be non-empty array.'
    expect(() => objTools.moveNode({}, [])).toThrow(/^initialPath must be non-empty array.$/);

    // throw `initialPath doesn't point to an existing node.`
    expect(() => objTools.moveNode(JSON.parse(treeString), [100], [])).toThrow(/^initialPath doesn't point to an existing node.$/);

    // throw 'finalPath must be an array.'
    expect(() => objTools.moveNode(JSON.parse(treeString), [0])).toThrow(/^finalPath must be an array.$/);
    expect(() => objTools.moveNode(JSON.parse(treeString), [0], 'string')).toThrow(/^finalPath must be an array.$/);
    expect(() => objTools.moveNode(JSON.parse(treeString), [0], 1)).toThrow(/^finalPath must be an array.$/);
    expect(() => objTools.moveNode(JSON.parse(treeString), [0], {})).toThrow(/^finalPath must be an array.$/);

    // throw 'finalPath must be non-empty array.'
    expect(() => objTools.moveNode(JSON.parse(treeString), [0], [])).toThrow(/^finalPath must be non-empty array.$/);

    // throw 'The object to be moved cannot be moved inside a child object.'
    expect(() => objTools.moveNode(JSON.parse(treeString), [0], [0, 'tree', 0])).toThrow(/^The object to be moved cannot be moved inside a child object.$/)

    // throw 'Trying to add a non integer key inside an array: (...)'
    expect(() => objTools.moveNode(JSON.parse(treeString), [0], [99.99]))
        .toThrow(
            new Error(`Trying to add a non integer key inside an array:\n\tarray in path: []\n\ttrying to add key: 99.99.`)
        );
    expect(() => objTools.moveNode(JSON.parse(treeString), [0], ['new_node']))
        .toThrow(
            new Error(`Trying to add a non integer key inside an array:\n\tarray in path: []\n\ttrying to add key: new_node.`)
        );

    // throw 'Trying to add an index (...)'
    expect(() => objTools.moveNode(JSON.parse(treeString), [0], [6]))
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
        expect(() => objTools.moveNode(originalTree, ['0', 'id'], ['new_node']))
            .toThrow(/^The object to be moved would overwrite an existing key.$/);
    } { // Forced scope {}
        let originalTree = {
            0: {
                id: '_0'
            },
            new_node: 'this is a new node'
        };
        expect(() => objTools.moveNode(originalTree, ['0', 'id'], ['new_node'], true)) // Explicitly tell to throw
            .toThrow(/^The object to be moved would overwrite an existing key.$/);
    }

    function test_moveNode_correctMovement(initialPath, finalPath, originalTreeString, changedCorrectTreeString) {
        // Test if the returned tree is correct and that there was no copy
        let treeForNoCopy = JSON.parse(originalTreeString);
        let treeReturnedNoCopy = objTools.moveNode(treeForNoCopy, initialPath, finalPath);
        expect(treeForNoCopy == treeReturnedNoCopy).toBe(true);
        expect(treeReturnedNoCopy).toStrictEqual(JSON.parse(changedCorrectTreeString));

        // Test if the returned tree is correct and that there was copy
        let treeForCopy = JSON.parse(originalTreeString);
        let treeReturnedCopy = objTools.moveNode(treeForCopy, initialPath, finalPath, true, true);
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
 * Testing objTools.addNode
 *
 * Signature:
 * function addNode(obj, destinationPath, insertedNode, onNodeExists = 'throw', copyObj = false)
 */
test('objTools.addNode', () => {
    let obj_str_1 = '{"a":{"b":{"an_array":[{"name":"a node"}]}}}';
    let obj_str_2 = '{"a":{"b":"a node"}}';

    // throw 'obj must be an object.'
    expect(() => objTools.addNode()).toThrow(/^obj must be an object.$/);
    expect(() => objTools.addNode(false)).toThrow(/^obj must be an object.$/);
    expect(() => objTools.addNode('string')).toThrow(/^obj must be an object.$/);
    expect(() => objTools.addNode(1)).toThrow(/^obj must be an object.$/);

    // throw 'destinationPath must be an array.';
    expect(() => objTools.addNode({})).toThrow(/^destinationPath must be an array.$/);
    expect(() => objTools.addNode({}, 'string')).toThrow(/^destinationPath must be an array.$/);
    expect(() => objTools.addNode({}, 1)).toThrow(/^destinationPath must be an array.$/);
    expect(() => objTools.addNode({}, {})).toThrow(/^destinationPath must be an array.$/);

    // throw 'destinationPath must be non-empty array.'
    expect(() => objTools.addNode({}, [])).toThrow(/^destinationPath must be non-empty array.$/);

    // throw 'insertedNode is mandatory.'
    expect(() => objTools.addNode({}, ['a', 'b'])).toThrow(/^insertedNode is mandatory.$/);

    // throw `Trying to add a node where a node already exists with onNodeExists='throw'.`
    expect(() => objTools.addNode(JSON.parse(obj_str_1), ['a', 'b'], {}))
        .toThrow(/^Trying to add a node where a node already exists with onNodeExists='throw'.$/);
    expect(() => objTools.addNode(JSON.parse(obj_str_1), ['a', 'b'], {}, 'throw'))
        .toThrow(/^Trying to add a node where a node already exists with onNodeExists='throw'.$/);

    // throw `onNodeExists must be a string, possible values: 'throw'|'overwrite'|'insert'.`
    let onNodeExists_valuesThrow = `onNodeExists must be a string, possible values: 'throw'|'insert'|'overwrite'.`;
    expect(() => objTools.addNode({}, ['a', 'b'], {}, '')).toThrow(new Error(onNodeExists_valuesThrow));
    expect(() => objTools.addNode({}, ['a', 'b'], {}, 'a different string')).toThrow(new Error(onNodeExists_valuesThrow));
    expect(() => objTools.addNode({}, ['a', 'b'], {}, [])).toThrow(new Error(onNodeExists_valuesThrow));
    expect(() => objTools.addNode({}, ['a', 'b'], {}, null)).toThrow(new Error(onNodeExists_valuesThrow));
    expect(() => objTools.addNode({}, ['a', 'b'], {}, 99)).toThrow(new Error(onNodeExists_valuesThrow));

    // throw `With onNodeExists='insert', destinationPath must point to a position inside an array.`
    expect(() => objTools.addNode(JSON.parse(obj_str_1), ['a', 'b'], {}, 'insert'))
        .toThrow(/^With onNodeExists='insert', destinationPath must point to a position inside an array.$/);

    // throw `Trying to add a non integer key inside an array:(...)
    expect(() => objTools.addNode(JSON.parse(obj_str_1), ['a', 'b', 'an_array', 'not a number'], {}, 'insert'))
        .toThrow(
            new Error(`Trying to add a non integer key inside an array:\n\tarray in path: ["a","b","an_array"]\n\ttrying to add key: not a number.`)
        );

    // throw `Trying to add an index(...)
    expect(() => objTools.addNode(JSON.parse(obj_str_1), ['a', 'b', 'an_array', 99], {}, 'insert'))
        .toThrow(
            new Error(`Trying to add an index (99) greater than array length (1) in array in path: ["a","b","an_array"].`)
        );

    function test_addNode_correct(onNodeExists, destinationPath, insertedNode, originalObjectString, changedCorrectObjectString) {
        // Test if the returned object is correct and that there was no copy
        let objectForNoCopy = JSON.parse(originalObjectString);
        let objectReturnedNoCopy = objTools.addNode(objectForNoCopy, destinationPath, insertedNode, onNodeExists);
        expect(objectForNoCopy == objectReturnedNoCopy).toBe(true);
        expect(objectReturnedNoCopy).toStrictEqual(JSON.parse(changedCorrectObjectString));

        // Test if the returned object is correct and that there was copy
        let objectForCopy = JSON.parse(originalObjectString);
        let objectReturnedCopy = objTools.addNode(objectForCopy, destinationPath, insertedNode, onNodeExists, true);
        expect(objectForCopy == objectReturnedCopy).toBe(false);
        expect(objectReturnedCopy).toStrictEqual(JSON.parse(changedCorrectObjectString));
    }
    // Adding node, insert in pos 0, new node is a string
    { // Forced scope {}
        let treeNewCorrect = {
            a: {
                b: {
                    an_array: ['new value', {
                        name: 'a node'
                    }]
                }
            }
        };
        test_addNode_correct(
            'insert',
            ['a', 'b', 'an_array', 0], // destinationPath
            'new value', // insertedNode
            obj_str_1, // originalObjectString
            JSON.stringify(treeNewCorrect) // changedCorrectObjectString
        );
    }
    // Adding node, insert in pos 0, new node is a number
    { // Forced scope {}
        let treeNewCorrect = {
            a: {
                b: {
                    an_array: [99, {
                        name: 'a node'
                    }]
                }
            }
        };
        test_addNode_correct(
            'insert',
            ['a', 'b', 'an_array', 0], // destinationPath
            99, // insertedNode
            obj_str_1, // originalObjectString
            JSON.stringify(treeNewCorrect) // changedCorrectObjectString
        );
    }
    // Adding node, insert in pos 0, new node is an object
    { // Forced scope {}
        let treeNewCorrect = {
            a: {
                b: {
                    an_array: [{
                        c: {
                            d: 'new string inside new node'
                        }
                    }, {
                        name: 'a node'
                    }]
                }
            }
        };
        let insertedNode = {
            c: {
                d: 'new string inside new node'
            }
        };
        test_addNode_correct(
            'insert',
            ['a', 'b', 'an_array', 0], // destinationPath
            insertedNode, // insertedNode
            obj_str_1, // originalObjectString
            JSON.stringify(treeNewCorrect) // changedCorrectObjectString
        );
    }

    // Adding node, insert in pos 1, new node is a string
    { // Forced scope {}
        let treeNewCorrect = {
            a: {
                b: {
                    an_array: [{
                        name: 'a node'
                    }, 'new value']
                }
            }
        };
        test_addNode_correct(
            'insert',
            ['a', 'b', 'an_array', 1], // destinationPath
            'new value', // insertedNode
            obj_str_1, // originalObjectString
            JSON.stringify(treeNewCorrect) // changedCorrectObjectString
        );
    }
    // Adding node, insert in pos 1, new node is a number
    { // Forced scope {}
        let treeNewCorrect = {
            a: {
                b: {
                    an_array: [{
                        name: 'a node'
                    }, 99]
                }
            }
        };
        test_addNode_correct(
            'insert',
            ['a', 'b', 'an_array', 1], // destinationPath
            99, // insertedNode
            obj_str_1, // originalObjectString
            JSON.stringify(treeNewCorrect) // changedCorrectObjectString
        );
    }
    // Adding node, insert in pos 1, new node is an object
    { // Forced scope {}
        let treeNewCorrect = {
            a: {
                b: {
                    an_array: [{
                        name: 'a node'
                    }, {
                        c: {
                            d: 'new string inside new node'
                        }
                    }]
                }
            }
        };
        let insertedNode = {
            c: {
                d: 'new string inside new node'
            }
        };
        test_addNode_correct(
            'insert',
            ['a', 'b', 'an_array', 1], // destinationPath
            insertedNode, // insertedNode
            obj_str_1, // originalObjectString
            JSON.stringify(treeNewCorrect) // changedCorrectObjectString
        );
    }

    // Adding node, overwrites, new node is a string
    { // Forced scope {}
        let treeNewCorrect = {
            a: {
                b: 'new value'
            }
        };
        test_addNode_correct(
            'overwrite', // onNodeExists
            ['a', 'b'], // destinationPath
            'new value', // insertedNode
            obj_str_2, // originalObjectString
            JSON.stringify(treeNewCorrect) // changedCorrectObjectString
        );
    }
    // Adding node, overwrites, new node is a number
    { // Forced scope {}
        let treeNewCorrect = {
            a: {
                b: 99
            }
        };
        test_addNode_correct(
            'overwrite', // onNodeExists
            ['a', 'b'], // destinationPath
            99, // insertedNode
            obj_str_2, // originalObjectString
            JSON.stringify(treeNewCorrect) // changedCorrectObjectString
        );
    }
    // Adding node, overwrites, new node is an object
    { // Forced scope {}
        let treeNewCorrect = {
            a: {
                b: {
                    c: {
                        d: 'new string inside new node'
                    }
                }
            }
        };
        let insertedNode = {
            c: {
                d: 'new string inside new node'
            }
        };
        test_addNode_correct(
            'overwrite', // onNodeExists
            ['a', 'b'], // destinationPath
            insertedNode, // insertedNode
            obj_str_2, // originalObjectString
            JSON.stringify(treeNewCorrect) // changedCorrectObjectString
        );
    }

    // expect(true).toBe(false);
    //*/
});
