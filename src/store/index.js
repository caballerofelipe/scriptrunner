import Vue from 'vue'
import Vuex from 'vuex'
// Change between large and small processTree, use processTree.{small,small.oneParent,large,large.oneParent}
import processTree from './processTree/processTree.small.oneParent'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        processTree,
        processTreeZoom: 1
    },
    mutations: {
        /* Used to assign an ID to every node in the tree so that Vue can use one when adding multiple elements */
        assignId(state) {
            window.theProcessTree = state.processTree; /* FCG: WARNING for debugging purposes. */

            let parentName = '';
            let mapWithParent = (processTree, parentName) => {
                processTree.map((node, index) => {
                    node.id = `${parentName}_${index}`;
                    mapWithParent(node.processTree, `${parentName}_${index}`)
                })
            }
            mapWithParent(state.processTree, parentName);
        },
        assignOriginalID(state) { /* FCG: REMOVE DEBUG: Use to keep track of original elements position. */
            let parentName = '';
            let mapWithParent = (processTree, parentName) => {
                processTree.map((node, index) => {
                    node.originalID = `${parentName}_${index}`; // OID: used to avoid collision between id and originalID
                    mapWithParent(node.processTree, `${parentName}_${index}`)
                })
            }
            mapWithParent(state.processTree, parentName);
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
