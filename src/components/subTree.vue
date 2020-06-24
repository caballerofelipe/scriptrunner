<template>
	<div class="subTree">
		<div class="nodeAndSubTree"
			draggable="true"
			>
			<div class="node" title="Incomplete drag and drop features... see the docs.">
				{{node.nodeValue}}
				<div style="font-size: 8px; color: lightgreen;"><!-- DEBUG -->
					(id: <b>{{node.id}}</b><br>initial:<br><b>{{node.originalID}}</b>)
				</div>
			</div>
			<subTreesRow
				v-if='node.processTree && node.processTree.length'
				v-bind:subTreesRow='node.processTree'
			/>
		</div>
	</div>
</template>

<script>
import subTreesRow from '@/components/subTreesRow.vue';

let draggedElement = null;

export default {
	name: 'node',
	components: {
		subTreesRow
	},
	props: [
		'node'
	],
	computed: {
	},
	methods: {
		dragstart(){
			/* FCG: IMPORTANT: use dragstart parameters to acces the right element. */

			/* FCG: WARNING only works if window.FCG_DEBUG, set it manually in the console. */
			let theElement = this.$el;
			draggedElement = this;
			if(window.FCG_DEBUG){
				window.console.log('dragstart()')
				window.console.log(theElement);
				window.theDraggableNodeContainer = theElement;
			}
			// theElement.transform = 'scale('+this.$store.state.processTreeZoom+')'; // Doesn't work
		},
		dragend(){
			/* FCG: WARNING only works if window.FCG_DEBUG, set it manually in the console. */
			let theElement = this.$el;
			if(window.FCG_DEBUG){
				window.console.log('dragend()')
				window.console.log(theElement)
			}
		},
		dragenter(event){
		// dragenter(){
			// Only use the event if the element is not itself or a child
			if(String(this.node.id).startsWith(draggedElement.node.id)){
				return;
			}
			/* FCG: WARNING only works if window.FCG_DEBUG, set it manually in the console. */
			let theElement = this.$el;
			if(window.FCG_DEBUG){
				window.console.log('dragenter()');
				window.console.log(event);
				window.console.log(this.node.id);
				window.console.log('theElement', theElement);
				window.console.log('this.node.id', this.node.id);
				window.console.log('draggedElement.node.id',draggedElement.node.id);
			}
		}
	},
	mounted(){}
}
</script>

<style lang="scss">
@import '@/sass/config.scss';

.subTree {
    /* For tree creation. */
    display: inline-block;
    vertical-align: top;

    /* To show hierarchy lines. */
    /* To create hierarchy lines, these are the lines from element to horizontal connecting line and the vertical connecting line. */
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
        height: calc(#{$node_padding} - #{$hierarchy_line_width}); /* To avoid having the line on top of the node. */
    }
    &:last-child:after {
        width: 0px; /* Necessary to avoid subTreesRow horizontal scrolling. */
    }
}

.nodeAndSubTree {
    padding: $node_padding;
    font-size:12px;
}
.node {
    background-color: rgba(200,130,210);
    color: white;
    border-radius: 100%;
    width: $node_width;
    height: $node_height;
    padding: 5px;
    cursor: move;

    /* To center bubble and content. */
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
}
</style>
