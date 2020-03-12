<template>
	<div class="node"
		@dragstart.stop='dragstart'
		@dragend.stop='dragend'
		@dragenter.stop='dragenter'
		>
		<div class="nodeBubble" title="Incomplete drag and drop features... see the docs.">
			{{node.nodeValue}}<br>(id: {{node.id}})
		</div>
		<nodeRow
			v-if='node.processTree && node.processTree.length'
			v-bind:nodeRow='node.processTree'
		/>
	</div>
</template>

<script>
import nodeRow from '@/components/nodeRow.vue'

export default {
	name: 'node',
	components: {
		nodeRow
	},
	props: [
		'node'
	],
	computed: {
	},
	methods: {
		dragstart(){
			/* FCG: WARNING only works if window.FCG_DEBUG, set it manually in the console. */
			let theElement = this.$el;
			if(window.FCG_DEBUG){
				window.console.log('dragstart()')
				window.console.log(theElement);
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
		dragenter(){
			/* FCG: WARNING only works if window.FCG_DEBUG, set it manually in the console. */
			let theElement = this.$el;
			if(window.FCG_DEBUG){
				window.console.log('dragenter()')
				window.console.log(this.node.id)
				window.console.log(theElement)
			}
		}
	},
	mounted(){
		let theElement = this.$el;
		theElement.draggable = true;
	}
}
</script>

<style lang="scss">
@import '@/sass/config.scss';

.node {
	padding: $node_padding;
	font-size:12px;

	/* For tree creation. */
	display: inline-block;
	vertical-align: top;

	/* To show hierarchy lines. */
	/* To create hierarchy lines, these are the lines from element to horizontal connecting line and the vertical connecting line. */
	position: relative;
	&:before, &:after {
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
		width: 0px; /* Necessary to avoid nodeRow horizontal scrolling. */
	}

}
.nodeBubble {
	background-color: rgba(200,130,210);
	color: white;
	border-radius: 100%;
	width: 120px;
	height: 120px;
	padding: 5px;
	cursor: move;

	/* To center bubble and content. */
	display: inline-flex;
	flex-direction: column;
	justify-content: center;
}
</style>
