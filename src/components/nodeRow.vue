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
		node: () => import('@/components/node.vue') /*  Read 'Circular reference note' above.  */
	},
	props: [
		'nodeRow'
	],
	computed: {},
	methods: {}
}
</script>

<style lang="scss">
$nodeRowPadding: 10px;

.nodeRow {
	background-color: rgba(100,100,255,0.2); /* This is a transluscent color, it is used to see the tree hierarchy. */

	/* For tree creation. */
	/* To create tree, .node must be inline-block, see the docs. */
	white-space: nowrap; /* Whithout this the tree is unordered when there is not enough space. */
	overflow: auto;

	/* To create tree using flex see the docs. */
}
</style>
