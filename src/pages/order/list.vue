<template>
  <div>
    <scroll-view scroll-x class="bg-green nav text-center">
      <div class="flex text-center">
        <view class="cu-item flex-sub" v-for="(i,inx) in tab" :key="inx" :class="inx==curInx?'text-white cur':''" @click="tabSelect(inx)" >
          {{i.title}}
        </view>
      </div>
		</scroll-view>

    <div class="cu-card article" v-for="(i,inx) in list" :key="inx">
      <view class="cu-item shadow">
        <view class="title flex align-center">
          <div class="cu-tag radius light" :class="true?'bg-green':'bg-red'">{{'个人'}}</div>
          <div class="flex-sub text-sm margin-left-xs" >订单号:{{i.order_no}}</div>
          <div class="text-gray text-sm">{{i.status_name}}</div>
        </view>
        <view class="content">
          <image :src="i.project_image"
          mode="aspectFill"></image>
          <view class="desc">
            <view class="text-content">{{i.project_name}}</view>
            <view>
              <view class="cu-tag bg-red light round">{{i.game_address}}</view>
            </view>
          </view>
        </view>
        <div class="flex "></div>
        <view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">报名信息</button>
						<button class="cu-btn line-green text-green margin-left" @tap="hideModal">取消订单</button>
						<button class="cu-btn bg-green margin-left" @tap="hideModal">立即支付</button>
					</view>
				</view>
      </view>
    </div>
  </div>
</template>

<script>
export default {
  onLoad(opt) {
    this.getData()
  },
  data() {
    return {
      tab: [
        {
          title: '待支付',
          status: 1
        },
        {
          title: '已报名',
          status: 2,
        },
        {
          title: '交易关闭',
          status: -1
        }
      ],
      curInx: 0,

      list: [],
      page: 1,
      isEnd: false,
      isLoading: false,
      isLoaded: false,
    }
  },
  methods: {
    tabSelect(inx) {
      if (inx != this.curInx) {
        this.curInx = inx
        this.getData(true)
      }
    },
    getData(reset=false) {
      if (reset) {
        this.page = 1
        this.isEnd = false
        this.isLoaded = false
        this.list = []
      }
      let d = {
        page: this.page,
        status: this.tab[this.curInx].status
      }
      this.$get(`api/v1/order/index`, d)
        .then(r => {
          this.list.push(...r.data.data)
        })
    }
  }
}
</script>

<style>

</style>