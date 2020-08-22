<template>
<div id="control">
    <input type="button" value="Run">
    <input type="button" value="Stop">
    <input type="button" value="+zoom" @click='treeZoomIn'>
    <input type="button" value="=zoom" @click='treeZoomReset'>
    <input type="button" value="-zoom" @click='treeZoomOut'>
    <div class="node nodeNew" draggable="true" @dragstart.stop='new_dragstart' @dragend.stop.prevent='new_dragend'>+</div>
</div>
</template>

<script>
import eventsBus from '@/lib/eventsBus.js';

export default {
    name: 'Controls',
    methods: {
        new_dragstart(event) {
            eventsBus.setEventData('node', 'creation');
            event.target.style.opacity = 0.2;
        },
        new_dragend(event) {
            event.target.style.opacity = 1;
            document.querySelectorAll('.dnd_placeholder').forEach((e) => e.remove()) // Remove placeholders
            eventsBus.getEventData(true); // Clear eventsBus
        },
        treeZoomIn() {
            this.$store.commit({
                type: 'processTreeZoomBy',
                zoomBy: '0.1'
            });
        },
        treeZoomOut() {
            this.$store.commit({
                type: 'processTreeZoomBy',
                zoomBy: '-0.1'
            });
        },
        treeZoomReset() {
            this.$store.commit({
                type: 'processTreeZoomReset',
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.nodeNew {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 5px;
    top: 5px;
}
</style>
