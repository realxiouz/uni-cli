<template>
  <div>
    <view class="box">
			<view class="cu-bar search bg-white">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" placeholder="请输入赛事名称" confirm-type="search"></input>
				</view>
				<view class="action">
					<button class="cu-btn bg-green shadow-blur round">搜索</button>
				</view>
			</view>
      <swiper style="height:300rpx">
        <swiper-item v-for="(i,inx) in banner" :key="inx">
          <img style="width:100%;height:100%;" :src="i.image" alt="">
        </swiper-item>
      </swiper>
      <view class="cu-bar bg-white">
				<view class="action sub-title">
					<text class="text-xl text-bold text-green">最新赛事</text>
					<text class="bg-green"></text>
					<!-- last-child选择器-->
				</view>
			</view>
      <view class="cu-card article" v-for="(i, inx) in list" :key="inx">
        <view class="cu-item shadow">
          <view class="title"><view class="text-cut">{{i.project_name}}</view></view>
          <view class="content">
            <image :src="i.image"
            mode="aspectFill"></image>
            <view class="desc">
              <view class="text-content">{{i.content}}</view>
              <view>
                <view class="cu-tag bg-red light round">{{i.game_address}}</view>
                
              </view>
            </view>
          </view>
        </view>
      </view>

      <div style="height:100rpx;"></div>
		</view>
  </div>
</template>

<script>
export default {
  created() {
    this.getData()
  },
  data() {
    return {
      list: [],
      banner: []
    }
  },
  methods: {
    getData() {
      this.$showLoading()
      Promise.all([
				this.$post('/api/ygame/ad/index'),
				this.$post('/api/ygame/project/index')
			]).then(a => {
          this.banner = a[0].data.data
          this.list = a[1].data.data
				})
        .finally(_ => {
          this.$hideLoading()
        })
    }
  }
}
</script>

<style lang="less">

</style>