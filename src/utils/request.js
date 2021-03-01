const BASE_URL = 'http://localhost:3000'
import store from '@/store'

function getUrl(url) {
  if (url.startsWith('http')) {
    return url
  }

  return url.startsWith('/') ? `${BASE_URL}${url}` : `${BASE_URL}/${url}`
}

export const http = (url, data, method = 'post', showErrToast = true) => {
  return new Promise((resolve, reject) => {
    let header = {
      // version: 'v1',
      // channel: 'wechat',
      // 'X-Requested-With': 'XMLHttpRequest',
    }
    let token = store.state.user.token
    token && (header.Authorization = `Bearer ${token}`)
    let session_key = store.state.user.session_key
    session_key && (header.session_key = session_key)
    uni
      .request({
        url: getUrl(url),
        data,
        method: method.toUpperCase(),
        header,
        timeout: 10 * 1000,
      })
      .then((r) => {
        let [err, data] = r
        if (err) {
          reject(err)
          return
        }
        let status = data.statusCode
        switch (status) {
          case 200:
          case 201:
            // if (data.data.code === 1000) {
            //   resolve(data.data)
            // } else {
            //   reject(data.data)
            //   if (showErrToast) {
            //     uni.showToast({
            //       title: `${data.data.data}`,
            //       icon: 'none'
            //     })
            //   }
            // }
            resolve(data.data)
            break
          case 500:
            uni.showModal({
              title: '温馨提示',
              content: '对不起,服务器离家出走了,稍等片刻~~~'
            })
            reject(new Error(`${getUrl(url)}`))
            break
          default:
            uni.showModal({
              title: '温馨提示',
              content: '对不起,服务器离家出走了,稍等片刻~~~'
            })
            reject(new Error(`${getUrl(url)}`))
        }
      })
  })
}
