<template>
  <div>
    <map class="map" name=""></map>
  </div>
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

    this.$showModal({
      content: `打卡功能3月19日上线, 先去首页看看吧~~~`,
      successCb: _ => {
        this.$go(`/pages/home/index`)
      }
    })
  },
}
</script>

<style>
.map{
  width: 100vw;
  height: 100vh;
}
</style>