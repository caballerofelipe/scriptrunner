<template>
<div id="treeInterface">
    <controls />
    <input type="button" id="debug_button" value="showStoreState" @click='showStoreState = !showStoreState'><!-- FCG: WARNING/REMOVE for debugging. -->
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
    }
}
</script>

<style lang="scss">
@import '@/sass/config.scss';

#treeInterface {
    font-family: $treeInterface_font_family;
    text-align: center;

    // Used to make the interface fixed to that nothing moves from its place
    display: flex;
    flex-direction: column;
    height: 100%;
}

#treeContainer {
    font-size: $treeContainer_font_size;
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

button,
input[type=button] {
    border: 1px solid lightgray;
    border-radius: 3px;
    background: white;
    margin: 1px;
    color: #333;
    outline: 0;

    &:hover {
        background: #eee;
        // color: white;
    }
    &:active {
        background: lightgray;
        color: black;
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
