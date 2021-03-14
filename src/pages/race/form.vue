<template>
  <div>
    <view class="cu-form-group margin-top">
      <view class="title">姓名</view>
      <input placeholder="填写您的姓名" maxlength="10" v-model="name" name="input"></input>
    </view>
    <view class="cu-form-group">
      <view class="title">身份证号</view>
      <input placeholder="填写正确的身份证号" v-model="idcard" name="input"></input>
    </view>
    <view class="cu-form-group">
      <view class="title">手机号码</view>
      <input placeholder="填写您的手机号码" maxlength="11"  v-model="mobile" name="number"></input>
    </view>

    <modal :show.sync="showConfirm" :is-bottom="false" :click-out="false">
      <div class="">
        <view class="cu-bar bg-white justify-end">
					<view class="content">确认报名信息</view>
					<view class="action" @tap="showConfirm=false">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
        <view class="cu-list menu text-left">
          <view class="cu-item">
            <view class="content">
              <text class="cuIcon-friendadd text-grey"></text>
              <text class="text-grey">姓名</text>
            </view>
            <div class="action">
              {{name}}
            </div>
          </view>
          <view class="cu-item">
            <view class="content">
              <text class="cuIcon-mobile text-grey"></text>
              <text class="text-grey">手机号</text>
            </view>
            <div class="action">
              {{mobile}}
            </div>
          </view>
          <view class="cu-item">
            <view class="content">
              <text class="cuIcon-vipcard text-grey"></text>
              <text class="text-grey">身份证号</text>
            </view>
            <div class="action">
              {{idcard}}
            </div>
          </view>
          <view class="cu-item">
            <view class="content">
              <text class="cuIcon-recharge text-grey"></text>
              <text class="text-grey">支付费用</text>
            </view>
            <div class="action text-red">
              ¥{{'100.00'}}
            </div>
          </view>
        </view>
        <view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-gray " @tap="showConfirm=false">取消</view>
					<view class="action margin-0 flex-sub text-green solid-left" @tap="onPay">
						<text class="cuIcon-moneybag"></text>微信支付
          </view>
				</view>
      </div>
    </modal>

    <view class="cu-bar bg-white btn-group foot">
      <button @click="onPre" class="cu-btn bg-green shadow-blur round">上一步</button>
      <button @click="onNext" class="cu-btn bg-blue shadow-blur round">下一步</button>
    </view>
  </div>
</template>

<script>
export default {
  onLoad(opt) {
    this.project_id = opt.pId
  },
  data() {
    return {
      showConfirm: false,

      name: '',
      mobile: '',
      idcard: '',
      group_id: '1',
      project_id: '',
    }
  },
  methods: {
    onPay() {
      let d = {
        name: this.name,
        mobile: this.mobile,
        idcard: this.idcard,
        group_id: this.group_id,
        project_id: this.project_id
      }
      this.$post('api/v1/project/submit',d)
        .then(r => {
          this.$showModal({
            content: '订单创建成功,去报名列表看看吧~~~',
            successCb: _ => {
              this.$go('/pages/order/list', 'redirect')
            }
          })
        })
    },
    onPre() {
      if (this.name || this.idcard || this.mobile) {
        this.$showModal({
          content: `确定要取消报名么?`,
          successCb: _ => {
            this.$go(1, 'back')
          }
        })
      } else {
        this.$go(1, 'back')
      }
    },
    onNext() {
      if (!this.name.trim()) {
        this.$toast('请填写姓名')
        return
      }
      if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.idcard)) {
        this.$toast('请填写正确的十八位身份证')
        return
      }
      if (!/^1\d{10}$/.test(this.mobile)) {
        this.$toast('请填写正确的手机号码')
        return
      }
      this.showConfirm=true
    }
  }
}
</script>

<style>
.title{
  min-width: calc(4em + 15px);
}
</style>