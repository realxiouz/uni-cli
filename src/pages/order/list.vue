<template>
  <div>
    <scroll-view scroll-x class="bg-green nav text-center" style="position:sticky;z-index:10;top:0;">
      <div class="flex text-center">
        <view class="cu-item flex-sub" v-for="(i,inx) in tab" :key="inx" :class="inx==curInx?'text-white cur':''" @click="tabSelect(inx)" >
          {{i.title}}
        </view>
      </div>
		</scroll-view>

    <div class="cu-card article" v-for="(i,inx) in list" :key="inx">
      <view class="cu-item shadow">
        <view class="title flex align-center">
          <div class="cu-tag radius light" :class="i.type==1?'bg-green':'bg-red'">{{i.type==1?'个人':'团队'}}</div>
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
						<button class="cu-btn line-green text-green" @tap="onMemberDetail(i)">报名信息</button>
						<button class="cu-btn line-green text-green margin-left" @tap="hideModal">取消订单</button>
						<!-- <button class="cu-btn bg-green margin-left" @tap="hideModal">立即支付</button> -->
					</view>
				</view>
      </view>
    </div>

    <modal :show.sync="showMember" :is-bottom="false">
      <view class="cu-bar bg-white justify-end">
        <view class="content">报名信息</view>
        <view class="action" @tap="onCloseMember">
          <text class="cuIcon-close text-red"></text>
        </view>
      </view>
      <scroll-view scroll-y style="height:500rpx;">
        <div v-for="(i,inx) in members" :key="inx">
          <view class="cu-list menu" :class="['sm-border','card-menu margin-top-sm']">
            <div class="cu-item">
              <view class="content padding-tb-sm">
                <view class="text-bold text-center text-cut justify-center">
                  {{i.group_name}}
                </view>
              </view>
            </div>
            <view class="cu-item" v-for="(item, index) in i.members" :key="index">
              <view class="content padding-tb-sm">
                <view>
                  <span class="text-bold margin-right-sm">{{item.name}}</span>
                  <span class="text-gray">{{item.mobile}}</span>
                </view>
                <view class="text-gray text-sm text-left">
                  {{item.idcard}}
                </view>
              </view>
            </view>
          </view>
        </div>
      </scroll-view>
    </modal>
  </div>
</template>

<script>
export default {
  onLoad(opt) {
    if (opt.status) {
      this.curInx = this.tab.findIndex(i => i.status == opt.status)
    }
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

      showMember: false,
      members: [],
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
      this.$showLoading()
      this.isLoading = true
      this.$get(`api/v1/order/index`, d)
        .then(r => {
          this.list.push(...r.data.data)
          if (this.list.length >= r.data.total) {
            this.isEnd = true
          }
        })
        .finally(_ => {
          this.isLoading = false
          this.isLoaded = true
          this.$hideLoading()
        })
    },
    onMemberDetail(i) {
      this.$get('api/v1/record/members', {
        order_id: i.id
      }).then(r => {
        this.members = r.data
        this.showMember = true
      })
    },
    onCloseMember() {
      this.showMember = false
    }
  },
  onReachBottom() {
    if (this.isLoading || this.isEnd) {
      return
    }
    this.page++
    this.getData()
  }
}
</script>

<style>

</style>