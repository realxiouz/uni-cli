<template>
  <div>
    <scroll-view scroll-x class="bg-white nav text-center" style="position:sticky;z-index:10;top:0;">
      <div class="flex text-center">
        <view class="cu-item flex-sub" v-for="(i,inx) in tab" :key="inx" :class="inx==curInx?'text-green cur':''" @click="tabSelect(inx)" >
          {{i.title}}
        </view>
      </div>
		</scroll-view>

    <div style="margin:30rpx 20rpx;" v-for="(i,inx) in list" :key="inx">
      <coupon-item />
    </div>
  </div>
</template>

<script>
import CouponItem from './components/coupon-item'
export default {
  onLoad() {
    this.getData()
  },
  data() {
    return {
      tab: [
        {
          title: '领券中心,'
        },
        {
          title: '可使用'
        },
        {
          title: '已使用'
        },
        {
          title: '已失效'
        }
      ],
      curInx: 0,
      list: [1,1,],
    }
  },
  components: {
    CouponItem
  },
  methods: {
    tabSelect(inx) {
      if (this.curInx != inx) {
        this.curInx = inx
      }
    },
    getData(reset = false) {
      if (reset) {
        this.list = []
        this.page = 1
      }
      let d = {
        page: this.page
      }
      this.$get(`api/v1/coupons/index`,d)
        .then(r => {
          this.list
        })
    }
  },
  
}
</script>

<style>

</style>