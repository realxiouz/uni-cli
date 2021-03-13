<template>
  <div>
    <img :src="image" style="width:100%;" mdoe="widthFix">
    <view class="cu-card article">
      <view class="cu-item shadow">
        <view class="title text-center"><view class="text-cut">{{project_name}}</view></view>
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
    <view class="cu-bar bg-white tabbar border foot">
      <!-- <div class="flex-sub">
      </div> -->
      <view class="cu-avatar-group">
        <view class="cu-avatar round" v-for="(item,index) in orderMembers.slice(0,3)" :key="index" :style="[{ backgroundImage:'url(' + item + ')' }]"></view>
      </view>
      <div class="font14 flex-sub">共<span class="text-green">{{orderMembers.length}}</span>人报名</div>
      <view class="bg-green text-center" style="width:200rpx;line-height:100rpx;" @click="onConfirm">立即报名</view>
    </view>
  </div>
</template>

<script>
export default {
  onLoad(opt) {
    this.opt = opt
    this.getData()
  },
  data() {
    return {
      image: '',
      project_name: '',
      orderMembers: [],
    }
  },
  methods: {
    getData() {
      let d = {
        id: this.opt.id
      }
      this.$get('api/v1/project/info', d)
        .then(r => {
          console.log(r.data)
          let { image, project_name, orderMembers} = r.data
          this.image = image
          this.project_name = project_name
          this.orderMembers = orderMembers.map(i => i.avatar)
        })
    },
    onConfirm() {
      this.$go(`/pages/race/form`)
    }
  }
}
</script>

<style>

</style>