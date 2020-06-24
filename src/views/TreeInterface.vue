<template>
<div id="treeInterface">
    <controls />
    <button id="debug_button" @click='showStoreState = !showStoreState'>showStoreState</button><!-- FCG: WARNING/REMOVE for debugging. -->
    <pre id="debug_pre" v-if='showStoreState'>{{wholeState}}</pre><!-- FCG: WARNING/REMOVE for debugging. -->
    <div id="treeContainer">
        <subTreesRow v-bind:subTreesRow='subTreesRow' v-bind:style="{ transform: 'scale('+treeZoom+')', transformOrigin: 'left top', width: 'calc(100%/'+treeZoom+')', height: 'calc(100%/'+treeZoom+')' }" />
    </div>
</div>
</template>

<script>
import controls from '@/components/controls.vue'
import subTreesRow from '@/components/subTreesRow.vue'

export default {
    name: 'TreeInterface',
    components: {
        controls,
        subTreesRow
    },
    props: [],
    computed: {
        subTreesRow() {
            this.$store.commit('assignId'); /* FCG: WARNING/REVIEW This might not be the way to do it, probably must be done in an action after loading the processTree from file. */
            return this.$store.state.processTree;
        },
        treeZoom() {
            return this.$store.state.processTreeZoom;
        },
        wholeState() {
            return this.$store.state;
        }
    },
    methods: {},
    watch: {},
    data() {
        return {
            showStoreState: false /* FCG: WARNING/REMOVE To show a <pre> processTree. */
        }
    },
    beforeCreate: function() {
        // this.$store.commit('assignId') /* FCG: WARNING/REVIEW This might not be the way to do it, probably must be done in an action after loading the processTree from file. */
        this.$store.commit('assignOriginalID');
    }
}
</script>

<style lang="scss">
#treeInterface {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    text-align: center;

    // Used to make the interface fixed to that nothing moves from its place
    display: flex;
    flex-direction: column;
    height: 100%;
}

#treeContainer {
    font-size: 12px;
    overflow: hidden; // Used to make the interface fixed to that nothing moves from its place and for zoom.
    flex-grow: 2; // When the content is small this allows the block to grow and take al available space.

    // When displaying hierarchy lines this hides the lines for the first row elements and removes unnecessary space before.
    > .subTreesRow {
        padding: 0;
        &:after,
        &:before {
            border: 0;
        }
        > .subTree {
            &:after,
            &:before {
                border: 0;
            }
        }
    }
}

#debug_button {
    display: block;
    margin: 0 auto;
}

#debug_pre {
    overflow: auto;
    text-align: left;
    font-size: 8px;
    flex-shrink: 2;
}
</style>
