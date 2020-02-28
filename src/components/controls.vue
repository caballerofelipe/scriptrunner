<template>
	<div id="control">
		<input type="button" value="+zoom" @click='treeZoomIn'>
		<input type="button" value="=zoom" @click='treeZoomReset'>
		<input type="button" value="-zoom" @click='treeZoomOut'>
	</div>
</template>

<script>
export default {
	name: 'Controls',
	components: {},
	props: {},
	computed: {},
	methods: {
		treeZoomIn(){
			this.$store.commit({
				type: 'processTreeZoomBy',
				zoomBy: '0.1'
			})
		},
		treeZoomOut(){
			this.$store.commit({
				type: 'processTreeZoomBy',
				zoomBy: '-0.1'
			})
		},
		treeZoomReset(){
			this.$store.commit({
				type: 'processTreeZoomReset',
			})
		}
	}
}
</script>

<style lang="css" scoped>
</style>
