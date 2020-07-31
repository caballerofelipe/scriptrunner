import Vue from 'vue'
import Vuex from 'vuex'
import treeTools from '@/lib/treeTools.js'
// Change between large and small processTree, use processTree.{small,small.oneParent,large,large.oneParent}
import processTree from './processTree/processTree.small.oneParent'

Vue.use(Vuex)

/**
 * Sets a node's id as a string using the parent's id as a base string.
 * Used to assign an ID to every node in the tree, using the parent's id as a base string. Reasons:
 * - We need a key to add multiple elements in vue, this key is used.
 * - We use this id as path identifier when moving or creating nodes.
 * @param  {object} processTree     The processTree.
 * @param  {String} parentName      [default=''] Initial parent's name is empty by default.
 */
function recursiveAssignID(processTree, parentName = '') {
    processTree.map((node, index) => {
        node.id = `${parentName}_${index}`;
        recursiveAssignID(node.processTree, `${parentName}_${index}`)
    })
}

/**
 * Debug function. Use to keep track of original elements position by an ID string. Sets a node's id as a string using the parent's id as a base string.
 * Used to assign an ID to every node in the tree, using the parent's id as a base string. Reasons:
 * - Allows to track the original position for every node.
 * @param  {object} processTree     The processTree.
 * @param  {String} parentName      [default=''] Initial parent's name is empty by default.
 */
function recursiveAssignOriginalID(processTree, parentName = '') {
    processTree.map((node, index) => {
        node.originalID = `${parentName}_${index}`;
        recursiveAssignOriginalID(node.processTree, `${parentName}_${index}`)
    })
}

/**
 * Initializes a processTree IDs.
 * @param  {processTree} processTree  The processTree.
 * @return {processTree}              The processTree.
 */
function processTree_initializeIDs(processTree) {
    recursiveAssignID(processTree);
    recursiveAssignOriginalID(processTree);
    return processTree;
}

export default new Vuex.Store({
    state: {
        processTree: processTree_initializeIDs(processTree),
        processTreeZoom: 1
    },
    mutations: {
        // Moves a node next to another using treeTools.moveNodeNextToNode
        // Payload must include:
        // - payload.movedNodePathStr
        // - payload.nextToNodePathStr
        // - payload.position
        moveNodeNextToNode(state, payload) {
            treeTools.moveNodeNextToNode(
                state.processTree, // tree
                payload.movedNodePathStr, // movedNodePathStr
                payload.nextToNodePathStr, // nextToNodePathStr
                payload.position, // position
                'processTree' // subTreeKey
            );
            recursiveAssignID(state.processTree); // Updates processTree IDs according to changes in it
        },
        // Creates a new node next to an existing one using treeTools.createNodeNextToNode
        // Payload must include:
        // - payload.nextToNodePathStr
        // - payload.newNode, containing the object that represents the node
        // - payload.position
        createNodeNextToNode(state, payload) {
            let processTreeTMP = treeTools.createNodeNextToNode(
                state.processTree, // tree
                payload.nextToNodePathStr, // nextToNodePathStr
                payload.newNode, // insertedNode
                payload.position, // position
                'processTree', // subTreeKey

                '_', // idDelimiter
                true // copyTree
            );
            state.processTree = processTreeTMP;
            recursiveAssignID(state.processTree); // Updates processTree IDs according to changes in it
        },
        processTreeZoomBy(state, payload) {
            state.processTreeZoom += 1 * payload.zoomBy;
        },
        processTreeZoomReset(state) {
            state.processTreeZoom = 1;
        }
    },
    actions: {},
    modules: {}
})
