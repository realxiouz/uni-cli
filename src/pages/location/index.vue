<template>
  <div>location</div>
</template>

<script>
export default {
  onShow() {
    const page = this.$mp.page
    if (typeof page.getTabBar === 'function' &&  page.getTabBar()) {  
      page.getTabBar().setData({  
          selInx: 1
      })  
    }
  },
}
</script>

<style>

</style>