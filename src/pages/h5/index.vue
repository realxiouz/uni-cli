<template>
  <web-view :src="src" @message="onMessage"/>
</template>

<script>
import { mapState } from 'vuex'
export default {
  onLoad(opt) {
    this.src = decodeURIComponent(opt.src)
  },
  data() {
    return {
      src: ''
    }
  },
  methods: {
    onMessage(e) {
      console.log(e)
      let [{title, path, imageUrl}] = e.detail.data
      this.title = title
      this.path = path
      this.imageUrl = imageUrl
    }
  },
  onShareAppMessage({from}) {
    if ( from == 'menu') {
      if (this.title) {
        let path = `/pages/h5/index?src=${this.path}`
        if (this.inviteCode) {
          path = `${path}&c=${this.inviteCode}`
        }
        console.log(this.title)
        console.log(this.path)
        console.log(this.imageUrl)
        return {
          path,
          title: this.title,
          imageUrl: this.imageUrl
        }
      }
    }
  },
  computed: {
    ...mapState('user', ['inviteCode']),
  }
}
</script>