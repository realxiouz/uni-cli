<template>
  <div>

    <view class="cu-list menu" :class="[true?'sm-border':'',true?'card-menu margin-top':'']">
      <view class="cu-item arrow" @click="$toast('即将开放...')">
        <view class="content">
          <text class="cuIcon-location text-green"></text>
          <text class="text-grey">我的打卡</text>
        </view>
      </view>
      <view class="cu-item arrow" @click="$go('/pages/order/list')">
        <view class="content">
          <text class="cuIcon-present text-red"></text>
          <text class="text-grey">我的卡券</text>
        </view>
      </view>
      <view class="cu-item arrow" @click="$toast('即将开放...')">
        <view class="content">
          <text class="cuIcon-selection text-yellow"></text>
          <text class="text-grey">打卡积分榜</text>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  onShow() {
    const page = this.$mp.page
    if (typeof page.getTabBar === 'function' &&  page.getTabBar()) {  
      page.getTabBar().setData({  
          selInx: 2
      })  
    }

    if (!this.token) {
      this.$showModal({
        content: '您还未登录,无法使用该功能,点击确定去登录~~~',
        successCb: _ => {
          this.$go(`/pages/auth/login`)
        }
      })
    }
  },

  computed: {
    ...mapState('user', ['token'])
  }
}
</script>

<style>

</style>