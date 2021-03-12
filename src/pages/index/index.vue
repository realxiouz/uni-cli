<template>
	<div></div>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {
			this.getData()
		},
		methods: {
			getData() {
				Promise.all([
					this.$post('/api/ygame/ad/index'),
					this.$post('/api/ygame/project/index')
				])
					.then(a => {
						
					})
			}
		}
	}
</script>

<style>

</style>
