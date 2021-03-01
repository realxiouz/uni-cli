<script>
import '@/common/color-ui/main.css'
import '@/common/color-ui/icon.css'
import '@/common/color-ui/animate.css'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
	onLaunch() {
		this.getSessionKey()
			.then(r => {
				// this.$get('auth/loginByOpenId', { openid: this.openId})
				// 	.then(r => {

				// 	})
				this.$post('test/login', { openid: this.openId, password: '1'}).then(r => {
					this.setToken(r.token)
				}).catch(e => {})
			})
	},
	onShow() {
		console.log('App Show')
	},
	onHide() {
		console.log('App Hide')
	},
	computed: {
		...mapState('user', ['openId'])
	},
	methods: {
		...mapActions('user', ['getSessionKey']),
		...mapMutations('user', ['setToken'])
	}
}
</script>
