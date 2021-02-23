<template>
  <div>
    <div style="width:200rpx;height:200rpx;">
      <open-data  type="userAvatarUrl" />
    </div>
    <div class="cu-btn bg-yellow" @click="onCode">getCode</div>
    <button open-type="getUserInfo" class="cu-btn bg-blue" @getuserinfo="onInfo">userInfo</button>
    <button open-type="getPhoneNumber" class="cu-btn bg-red" @getphonenumber="onPhone">phone-number</button>
    <div>
      <div class="cu-btn lg bg-pink" @click="onHttp">http</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  onLoad() {
    // wx.checkSession()
    //   .then(r => {
    //     console.log(r)
    //   })
    //   .catch(e => {
    //     console.log(e)
    //   })
  },
  methods: {
    ...mapActions('user', ['getSessionKey']),
    async onInfo(e) {
      let {errMsg, iv, encryptedData} = e.detail
      console.log(e.detail)
      await this.getSessionKey()
      this.$post('auth/parseUserInfo', { iv, encryptedData })
        .then(r => {

        })
        .catch(e => {

        })
    },
    onPhone(e) {
      console.log(e.detail)
    },
    onCode() {
      // wx.login()
      //   .then(r => {
      //     console.log(r)
      //     // let { code } = r
      //     // this.$get('auth/code', {code})
      //     //   .then(r => {})
      //   })
      //   .catch(e => {
      //     console.log(e)
      //   })
    },
    onHttp() {
      this.$get('http://www.baidu.com')
        .then(r => {
          console.log(r)
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>

<style>

</style>