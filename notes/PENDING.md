# Pending list
The idea is to have some thoughts here of things that might get done.
1. ASAP
1. Near future
1. Pool

## ASAP
- Test:
	- [ ] treeTools.listNodes
	- [ ] treeTools.removeNode

## Near future
- [ ] Review
	- if `FCG: WARNING` (or `WARNING`) should be removed
	- if window.(...) should be removed
- [ ] Revisar style guide: https://vuejs.org/v2/style-guide/ .

## Pool
- [ ] MAYBE, Parameterize stuff like: processTree, idDelimiter (treeTools), possibly see [Adding Configuration](https://github.com/caballerofelipe/scriptrunner/blob/master/notes/USEFUL%20LEARNED%20INFO.md#adding-configuration)
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
- [ ] MAYBE Agregar menu contextual, right click for node options such as:
	- Run
	- Delete (quitar x)
	- Edit (although this could be done when clicking or double clicking maybe)
