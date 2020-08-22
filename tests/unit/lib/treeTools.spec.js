import treeTools from '@/lib/treeTools.js'

/**
 * This string is used for the tree and is converted when used to avoid using an object an have some test change it.
 * @type {String}
 */
const treeString = '[{"value":"a_value","tree":[{"value":"a_value","tree":[{"value":"a_value","tree":[],"id":"_0_0_0"}],"id":"_0_0"},{"value":"a_value","tree":[{"value":"a_value","tree":[{"value":"a_value","tree":[],"id":"_0_1_0_0"},{"value":"a_value","tree":[],"id":"_0_1_0_1"}],"id":"_0_1_0"}],"id":"_0_1"}],"id":"_0"},{},{"tree":{},"id":"_2"},{"tree":[],"id":"_3"},{"tree":[{}],"id":"_4"}]';

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
      - Maybe this function should validate the input as other functions do (AKA replicate validation). If so implement the needed tests.
     */
    // throw 'tree must be an object.'
    expect(() => treeTools.moveNodeNextToNode(1)).toThrow(/^tree must be an object.$/);
    expect(() => treeTools.moveNodeNextToNode(false)).toThrow(/^tree must be an object.$/);
    expect(() => treeTools.moveNodeNextToNode('string')).toThrow(/^tree must be an object.$/);

    // throw `movedNodePathStr must be a string containing the path of the given node, this path must be separated by a pathDelimiter.`
    expect(() => treeTools.moveNodeNextToNode([]))
        .toThrow(/^movedNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.moveNodeNextToNode([], 1))
        .toThrow(/^movedNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.moveNodeNextToNode([], false))
        .toThrow(/^movedNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.moveNodeNextToNode([], {}))
        .toThrow(/^movedNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.moveNodeNextToNode([], []))
        .toThrow(/^movedNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.moveNodeNextToNode([], ''))
        .toThrow(/^movedNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);

    // throw `nextToNodePathStr must be a string containing the path of the given node, this path must be separated by a pathDelimiter.`
    expect(() => treeTools.moveNodeNextToNode([], '_0_0'))
        .toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.moveNodeNextToNode([], '_0_0', 1))
        .toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.moveNodeNextToNode([], '_0_0', false))
        .toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.moveNodeNextToNode([], '_0_0', {}))
        .toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.moveNodeNextToNode([], '_0_0', []))
        .toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.moveNodeNextToNode([], '_0_0', ''))
        .toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);

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

    // throw 'idDelimiter must be a non-empty string.'
    expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', 'before', 'tree', 1))
        .toThrow(/^idDelimiter must be a non-empty string.$/);
    expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', 'before', 'tree', null))
        .toThrow(/^idDelimiter must be a non-empty string.$/);
    expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', 'before', 'tree', true))
        .toThrow(/^idDelimiter must be a non-empty string.$/);

    // throw 'idDelimiter cannot contain numbers.'
    expect(() => treeTools.moveNodeNextToNode([], '_0_0', '_0_0', 'before', 'tree', ',2'))
        .toThrow(/^idDelimiter cannot contain numbers.$/);

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

    function test_moveNodeNextToNode_correctMovement(
        movedNodePathStr, nextToNodePathStr, position, subTreeKey, idDelimiter,
        originalTreeString, changedCorrectTreeString
    ) {
        // Test if the returned tree is correct and that there was no copy
        let treeForNoCopy = JSON.parse(originalTreeString);
        let treeReturnedNoCopy = treeTools.moveNodeNextToNode(treeForNoCopy, movedNodePathStr, nextToNodePathStr, position, subTreeKey, idDelimiter);
        expect(treeForNoCopy == treeReturnedNoCopy).toBe(true);
        expect(treeReturnedNoCopy).toStrictEqual(JSON.parse(changedCorrectTreeString));

        // Test if the returned tree is correct and that there was copy
        let treeForCopy = JSON.parse(originalTreeString);
        let treeReturnedCopy = treeTools.moveNodeNextToNode(treeForCopy, movedNodePathStr, nextToNodePathStr, position, subTreeKey, idDelimiter, true);
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

/**
 * Testing treeTools.createNodeNextToNode
 *
 * Signature:
 * function createNodeNextToNode(tree, nextToNodePathStr, insertedNode, position, subTreeKey, idDelimiter = '_', copyTree = false)
 */
test('treeTools.createNodeNextToNode', () => {
    // throw 'tree must be an object.'
    expect(() => treeTools.createNodeNextToNode(1)).toThrow(/^tree must be an object.$/);
    expect(() => treeTools.createNodeNextToNode(false)).toThrow(/^tree must be an object.$/);
    expect(() => treeTools.createNodeNextToNode('string')).toThrow(/^tree must be an object.$/);

    // throw `nextToNodePathStr must be a string containing the path of the given node, this path must be separated by a pathDelimiter.`
    expect(() => treeTools.createNodeNextToNode([]))
        .toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.createNodeNextToNode([], 1))
        .toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.createNodeNextToNode([], false))
        .toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.createNodeNextToNode([], {}))
        .toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.createNodeNextToNode([], []))
        .toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);
    expect(() => treeTools.createNodeNextToNode([], ''))
        .toThrow(/^nextToNodePathStr must be a string containing the path of the given node, this path must be separated by idDelimiter.$/);

    // throw 'insertedNode is mandatory.'
    expect(() => treeTools.createNodeNextToNode([], '_0_0')).toThrow(/^insertedNode is mandatory.$/);

    //   throw `position must be a string, possible values: 'before'|'after'|'below'.`
    let positionThrow = `position must be a string, possible values: 'before'|'after'|'below'.`;
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {})).toThrow(new Error(positionThrow));
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, 1)).toThrow(new Error(positionThrow));
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, false)).toThrow(new Error(positionThrow));
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, {})).toThrow(new Error(positionThrow));
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, [])).toThrow(new Error(positionThrow));
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, '')).toThrow(new Error(positionThrow));
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, 'string')).toThrow(new Error(positionThrow));

    // throw 'subTreeKey must be a non-empty string.'
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, 'before'))
        .toThrow(/^subTreeKey must be a non-empty string.$/);
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, 'before', 1))
        .toThrow(/^subTreeKey must be a non-empty string.$/);
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, 'before', false))
        .toThrow(/^subTreeKey must be a non-empty string.$/);
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, 'before', {}))
        .toThrow(/^subTreeKey must be a non-empty string.$/);
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, 'before', []))
        .toThrow(/^subTreeKey must be a non-empty string.$/);
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, 'before', ''))
        .toThrow(/^subTreeKey must be a non-empty string.$/);

    // throw 'idDelimiter must be a non-empty string.'
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, 'before', 'tree', 1))
        .toThrow(/^idDelimiter must be a non-empty string.$/);
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, 'before', 'tree', null))
        .toThrow(/^idDelimiter must be a non-empty string.$/);
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, 'before', 'tree', true))
        .toThrow(/^idDelimiter must be a non-empty string.$/);

    // throw 'idDelimiter cannot contain numbers.'
    expect(() => treeTools.createNodeNextToNode([], '_0_0', {}, 'before', 'tree', ',2'))
        .toThrow(/^idDelimiter cannot contain numbers.$/);

    // throw `nextToNode doesn't exist (nextToNodePathStr[${nextToNodePathStr}]).`;
    expect(() => treeTools.createNodeNextToNode(JSON.parse(treeString), '_99', {}, 'before', 'tree'))
        .toThrow(new Error(`nextToNode node doesn't exist (nextToNodePathStr[_99]).`));
    expect(() => treeTools.createNodeNextToNode(JSON.parse(treeString), '_99_0', {}, 'before', 'tree'))
        .toThrow(new Error(`nextToNode node doesn't exist (nextToNodePathStr[_99_0]).`));

    function test_createNodeNextToNode_correctMovement(
        nextToNodePathStr, insertedNode, position, subTreeKey, idDelimiter,
        originalTreeString, changedCorrectTreeString
    ) {
        // Test if the returned tree is correct and that there was no copy
        let treeForNoCopy = JSON.parse(originalTreeString);
        let treeReturnedNoCopy = treeTools.createNodeNextToNode(treeForNoCopy, nextToNodePathStr, insertedNode, position, subTreeKey, idDelimiter);
        expect(treeForNoCopy == treeReturnedNoCopy).toBe(true);
        expect(treeReturnedNoCopy).toStrictEqual(JSON.parse(changedCorrectTreeString));

        // Test if the returned tree is correct and that there was copy
        let treeForCopy = JSON.parse(originalTreeString);
        let treeReturnedCopy = treeTools.createNodeNextToNode(treeForCopy, nextToNodePathStr, insertedNode, position, subTreeKey, idDelimiter, true);
        expect(treeForCopy == treeReturnedCopy).toBe(false);
        expect(treeReturnedCopy).toStrictEqual(JSON.parse(changedCorrectTreeString));
    }
    /* FCG: DELETEME next line. */
    // function createNodeNextToNode(tree, nextToNodePathStr, insertedNode, position, subTreeKey, idDelimiter = '_', copyTree = false)

    // insert a node where another node exists (_0), position=before
    { // Forced scope {}
        let treeNewCorrect = JSON.parse(treeString);
        treeNewCorrect.splice(0, 0, {});
        test_createNodeNextToNode_correctMovement(
            '_0', // nextToNodePathStr
            {}, // insertedNode
            'before', // position
            'tree', // subTreeKey
            '_', // idDelimiter = '_'
            treeString, // originalTreeString
            JSON.stringify(treeNewCorrect), // changedCorrectTreeString
        );
    }
    // insert a node where another node exists (_0), position=after
    { // Forced scope {}
        let treeNewCorrect = JSON.parse(treeString);
        treeNewCorrect.splice(1, 0, {});
        test_createNodeNextToNode_correctMovement(
            '_0', // nextToNodePathStr
            {}, // insertedNode
            'after', // position
            'tree', // subTreeKey
            '_', // idDelimiter = '_'
            treeString, // originalTreeString
            JSON.stringify(treeNewCorrect), // changedCorrectTreeString
        );
    }
    // insert a node where another node exists (_0_1_0), position=before
    { // Forced scope {}
        let treeNewCorrect = JSON.parse(treeString);
        treeNewCorrect[0]['tree'][1]['tree'].splice(0, 0, {});
        test_createNodeNextToNode_correctMovement(
            '_0_1_0', // nextToNodePathStr
            {}, // insertedNode
            'before', // position
            'tree', // subTreeKey
            '_', // idDelimiter = '_'
            treeString, // originalTreeString
            JSON.stringify(treeNewCorrect), // changedCorrectTreeString
        );
    }
    // insert a node where another node exists (_0_1_0), position=after
    { // Forced scope {}
        let treeNewCorrect = JSON.parse(treeString);
        treeNewCorrect[0]['tree'][1]['tree'].splice(1, 0, {});
        test_createNodeNextToNode_correctMovement(
            '_0_1_0', // nextToNodePathStr
            {}, // insertedNode
            'after', // position
            'tree', // subTreeKey
            '_', // idDelimiter = '_'
            treeString, // originalTreeString
            JSON.stringify(treeNewCorrect), // changedCorrectTreeString
        );
    }
    // insert a node where the existing node is last in array (_4), position=before
    { // Forced scope {}
        let treeNewCorrect = JSON.parse(treeString);
        treeNewCorrect.splice(4, 0, {});
        test_createNodeNextToNode_correctMovement(
            '_4', // nextToNodePathStr
            {}, // insertedNode
            'before', // position
            'tree', // subTreeKey
            '_', // idDelimiter = '_'
            treeString, // originalTreeString
            JSON.stringify(treeNewCorrect), // changedCorrectTreeString
        );
    }
    // insert a node where the existing node is last in array (_4), position=after
    { // Forced scope {}
        let treeNewCorrect = JSON.parse(treeString);
        treeNewCorrect.splice(5, 0, {});
        test_createNodeNextToNode_correctMovement(
            '_4', // nextToNodePathStr
            {}, // insertedNode
            'after', // position
            'tree', // subTreeKey
            '_', // idDelimiter = '_'
            treeString, // originalTreeString
            JSON.stringify(treeNewCorrect), // changedCorrectTreeString
        );
    }
    // insert a node where the existing node is last in array (_0_1_0_1), position=before
    { // Forced scope {}
        let treeNewCorrect = JSON.parse(treeString);
        treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(1, 0, {});
        test_createNodeNextToNode_correctMovement(
            '_0_1_0_1', // nextToNodePathStr
            {}, // insertedNode
            'before', // position
            'tree', // subTreeKey
            '_', // idDelimiter = '_'
            treeString, // originalTreeString
            JSON.stringify(treeNewCorrect), // changedCorrectTreeString
        );
    }
    // insert a node where the existing node is last in array (_0_1_0_1), position=after
    { // Forced scope {}
        let treeNewCorrect = JSON.parse(treeString);
        treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].splice(2, 0, {});
        test_createNodeNextToNode_correctMovement(
            '_0_1_0_1', // nextToNodePathStr
            {}, // insertedNode
            'after', // position
            'tree', // subTreeKey
            '_', // idDelimiter = '_'
            treeString, // originalTreeString
            JSON.stringify(treeNewCorrect), // changedCorrectTreeString
        );
    }
    // insert a node below an node without sub nodes (_0_0_0), position=below
    { // Forced scope {}
        let treeNewCorrect = JSON.parse(treeString);
        treeNewCorrect[0]['tree'][0]['tree'][0]['tree'].push({})
        test_createNodeNextToNode_correctMovement(
            '_0_0_0', // nextToNodePathStr
            {}, // insertedNode
            'below', // position
            'tree', // subTreeKey
            '_', // idDelimiter = '_'
            treeString, // originalTreeString
            JSON.stringify(treeNewCorrect), // changedCorrectTreeString
        );
    }
    // insert a node below an node without sub nodes (_0_1_0_1), position=below
    { // Forced scope {}
        let treeNewCorrect = JSON.parse(treeString);
        treeNewCorrect[0]['tree'][1]['tree'][0]['tree'][1]['tree'].push({})
        test_createNodeNextToNode_correctMovement(
            '_0_1_0_1', // nextToNodePathStr
            {}, // insertedNode
            'below', // position
            'tree', // subTreeKey
            '_', // idDelimiter = '_'
            treeString, // originalTreeString
            JSON.stringify(treeNewCorrect), // changedCorrectTreeString
        );
    }
    // insert a node below an node with existing sub nodes (_0), position=below
    { // Forced scope {}
        let treeNewCorrect = JSON.parse(treeString);
        treeNewCorrect[0]['tree'].push({})
        test_createNodeNextToNode_correctMovement(
            '_0', // nextToNodePathStr
            {}, // insertedNode
            'below', // position
            'tree', // subTreeKey
            '_', // idDelimiter = '_'
            treeString, // originalTreeString
            JSON.stringify(treeNewCorrect), // changedCorrectTreeString
        );
    }
    // insert a node below an node with existing sub nodes (_0_1_0), position=below
    { // Forced scope {}
        let treeNewCorrect = JSON.parse(treeString);
        treeNewCorrect[0]['tree'][1]['tree'][0]['tree'].push({})
        test_createNodeNextToNode_correctMovement(
            '_0_1_0', // nextToNodePathStr
            {}, // insertedNode
            'below', // position
            'tree', // subTreeKey
            '_', // idDelimiter = '_'
            treeString, // originalTreeString
            JSON.stringify(treeNewCorrect), // changedCorrectTreeString
        );
    }
});

/**
 * Testing treeTools.listNodes
 *
 * Signature:
 * function listNodes(tree, subTreeKey, mode = 'breadth', copyTree = false)
 */
test('treeTools.listNodes', () => {
    throw 'treeTools.listNodes: tests pending.';
    // expect(true).toBe(false);
});

/**
 * Testing treeTools.removeNode
 *
 * Signature:
 * function listNodes(tree, subTreeKey, mode = 'breadth', copyTree = false)
 */
test('treeTools.removeNode', () => {
    throw 'treeTools.removeNode: tests pending.';
    // expect(true).toBe(false);
});
