# Pending list
The idea is to have some thoughts here of things that might get done.
1. ASAP
1. Near future
1. Pool

## ASAP
- [ ] ...

## Near future
- [ ] ...

## Pool
- [ ] MAYBE, Parameterize stuff like: processTree, idDelimiter (treeTools)
- [ ] MAYBE, for treeTools, change function signatures to use JSON
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
- [ ] MAYBE, for treeTools, if using a class
    Possible signature for a class
    	let th = new treeHandler(tree, subTreeKey='tree', idDemilimter='_');
    	th.moveNodeNextToNode(movedNodePathStr, nextToNodePathStr, position, copyTree = false);
