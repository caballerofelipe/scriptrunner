<template>
	<div class='nodeRow'>
		<node
			:node='node'
			:key='node.id'
			v-for='node in nodeRow'
		/>
	</div>
</template>

<script>
/*
Circular reference note: To avoid a circular reference do not import here.
Read: https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
*/
// import node from './node.vue'

export default {
	name: 'nodeRow',
	components: {
		node: () => import('@/components/node.vue') /* Read 'Circular reference note' above. */
	},
	props: [
		'nodeRow'
	],
	computed: {},
	methods: {}
}
</script>

<style lang="scss">
@import '@/sass/config.scss';

.nodeRow {
	background-color: rgba(100,100,255,0.2); /* This is a transluscent color, it is used to see the tree hierarchy. */

	/* For tree creation. */
	/* To create tree, .node must be inline-block, see the docs. */
	white-space: nowrap; /* Whithout this the tree is unordered when there is not enough space. */
	overflow: auto;

	/* To create hierarchy lines, this is the vertical line from .nodeRow to its parent. */
	padding-top: $nodeRow_padding;
	position: relative;
	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: calc(50% - #{$hierarchy_line_width/2});
		width: 0;
		height: $nodeRow_padding;
		border-left: $hierarchy_line_width solid $hierarchy_line_color;
	}
	&:after {
		content: '';
	}

	/* To create tree using flex see https://github.com/caballerofelipe/vuejs_tree/blob/master/README.md#using-css-for-the-tree. */
}
</style>
