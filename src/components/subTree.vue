<template>
<div class="subTree">
    <div class="nodeAndSubTree" draggable="true" @dragstart.stop='nodeAndSubTree_dragstart' @dragend.stop.prevent='nodeAndSubTree_dragend'>
        <div class="node" @dragenter.prevent.stop='node_dragenter'>
            <div class="nodeRemove" @click="node_remove">X</div>
            <!-- FCG to keep text inside, should be max 33 char -->
            <!-- {{node.nodeValue}} -->
            <div style="font-size: 8px; color: lightgreen;">
                <textarea v-model="node.nodeValue" placeholder="Python file to be run"></textarea>
                <!-- DEBUG -->
                (id: <b>{{node.id}}</b><br>initial:<br><b>{{node.originalID}}</b>)
            </div>
        </div>
        <!-- subTreesRow should always be created as it's used to insert the drop placeholder. -->
        <subTreesRow v-bind:subTreesRow='node.processTree' />
    </div>
</div>
</template>

<script>
import subTreesRow from '@/components/subTreesRow.vue';
import eventsBus from '@/lib/eventsBus.js';

export default {
    name: 'subTree',
    components: {
        subTreesRow
    },
    props: [
        'node'
    ],
    computed: {},
    methods: {
        nodeAndSubTree_dragstart(event) {
            eventsBus.setEventData('node', 'movement', {
                id: this.node.id
            });
            event.target.style.opacity = 0.2; // Inadvertently: this solves the issue with the hierarchy lines
        },
        nodeAndSubTree_dragend(event) {
            event.target.style.opacity = 1;
            document.querySelectorAll('.dnd_placeholder').forEach((e) => e.remove());
            eventsBus.getEventData(true);
        },
        node_dragenter() {
            // Basic validations
            if (this == null || !this.node || !this.node.id) {
                return
            }
            let eventData = eventsBus.getEventData(false);

            // If not a node event
            if (!eventData || eventData.element != 'node') {
                return;
            }

            // If entering dragged element remove placeholders
            if (eventData.eventType == 'movement' && eventData.payload &&
                this.node.id.startsWith(eventData.payload.id) // The dragged over element is itself or a child
            ) {
                let newEventData = eventsBus.getEventData(true);
                let newMetadata = { ...newEventData.metadata,
                    ...{
                        currentHoveredSubTree: null
                    }
                };
                eventsBus.setEventData(newEventData.element, newEventData.eventType, newEventData.payload, newMetadata);
                document.querySelectorAll('.dnd_placeholder').forEach((e) => e.remove());
                return;
            }
            let hoveredSubTree = this.$el;

            // Avoid redoing work and creating an infinite loop of adding/removing/adding/...
            if (eventData && eventData.metadata && eventData.metadata.currentHoveredSubTree == hoveredSubTree) {
                return;
            }

            // Reset currentHoveredSubTree
            let newEventData = eventsBus.getEventData(true);
            let newMetadata = { ...newEventData.metadata,
                ...{
                    currentHoveredSubTree: hoveredSubTree
                }
            };
            eventsBus.setEventData(newEventData.element, newEventData.eventType, newEventData.payload, newMetadata);
            document.querySelectorAll('.dnd_placeholder').forEach((e) => e.remove());

            let newdivs = [];
            let elementToAdd = document.createElement('div');

            elementToAdd.className = 'subTree dnd_placeholder';
            elementToAdd.innerHTML = '<div class="nodeAndSubTree"><div class="node">Drop</div></div>';

            newdivs[0] = elementToAdd.cloneNode(true);
            newdivs[0].action = 'before';
            newdivs[1] = elementToAdd.cloneNode(true);
            newdivs[1].action = 'after';
            newdivs[2] = elementToAdd.cloneNode(true);
            newdivs[2].action = 'below';
            let dropOnElements = [];
            let dropOnElements_before = hoveredSubTree.parentNode.insertBefore(newdivs[0], hoveredSubTree);
            dropOnElements.push(dropOnElements_before);
            let dropOnElements_after = hoveredSubTree.parentNode.insertBefore(newdivs[1], hoveredSubTree.nextSibling);
            dropOnElements.push(dropOnElements_after);
            // If the hovered element doesn't have any child
            if (this.node.processTree.length == 0) {
                let dropOnElements_below = hoveredSubTree.querySelector('.subTreesRow').appendChild(newdivs[2])
                dropOnElements.push(dropOnElements_below);
            }
            let that = this;
            dropOnElements.forEach(element => {
                let placeHolderNode = element.querySelector('.node');
                placeHolderNode.addEventListener('dragover', function(event) {
                    event.target.style.background = 'lightgreen';
                    event.preventDefault();
                    event.stopPropagation();
                }, false);
                placeHolderNode.addEventListener('dragleave', function(event) {
                    event.target.style.background = 'lightgray';
                    event.preventDefault();
                    event.stopPropagation();
                }, false);
                placeHolderNode.addEventListener('drop', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    document.querySelectorAll('.dnd_placeholder').forEach((e) => e.remove());
                    let eventData = eventsBus.getEventData(true);
                    if (eventData.element == 'node') {
                        switch (eventData.eventType) {
                            case 'movement':
                                that.$store.commit({
                                    type: 'moveNodeNextToNode',
                                    movedNodePathStr: eventData.payload.id,
                                    nextToNodePathStr: that.node.id,
                                    position: element.action
                                });
                                break;
                            case 'creation':
                                that.$store.commit({
                                    type: 'createNodeNextToNode',
                                    nextToNodePathStr: that.node.id,
                                    position: element.action
                                });
                                break;
                            default:
                                break;
                        }
                    }
                }, false);
            })
        },
        node_remove() {
            this.$store.commit({
                type: 'removeNode',
                nodePathStr: this.node.id
            });
        }
    },
    mounted() {}
}
</script>

<style lang="scss">
@import '@/sass/config.scss';

.subTree {
    // For tree creation.
    display: inline-block;
    vertical-align: top;

    // To show hierarchy lines.
    // To create hierarchy lines, these are the lines from element to horizontal connecting line and the vertical connecting line.
    position: relative;
    &:after,
    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: $node_padding;
    }
    &:after {
        left: calc(50% - #{$hierarchy_line_width/2});
        border-left: $hierarchy_line_width solid $hierarchy_line_color;
    }
    &:not(:first-child):before,
    &:not(:last-child):after {
        border-top: $hierarchy_line_width solid $hierarchy_line_color;
        height: calc(#{$node_padding} - #{$hierarchy_line_width}); // To avoid having the line on top of the node.
    }
    &:last-child:after {
        width: 0; // Necessary to avoid subTreesRow horizontal scrolling.
    }
}

.nodeAndSubTree {
    padding: $node_padding;
}
.node {
    background-color: #8284d2;
    color: white;
    border-radius: 100%;
    width: $node_width;
    height: $node_height;
    padding: 5px;
    white-space: normal;
    word-wrap: break-word;
    cursor: move;
    position: relative;

    // To center bubble and content.
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
}
.nodeRemove {
    background: #8284d2aa;
    color: white;
    border-radius: 100%;
    width: 10px;
    height: 10px;
    padding: 5px;
    white-space: normal;
    word-wrap: break-word;
    position: absolute;
    top: 0;
    right: 0;
    cursor: default;
    border: 1px solid #ffffffaa;

    // To center bubble and content.
    display: inline-flex;
    flex-direction: column;
    justify-content: center;

    &:hover {
        background: #8284d2dd;
        border: 1px solid #ffffffdd;
    }
}

.dnd_placeholder {
    .node {
        color: #333;
        background-color: lightgray;
    }
}
</style>
