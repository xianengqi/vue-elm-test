/**
 * imgBaseUrl: 图片所在域名地址
 */

let imgBaseUrl = ''
let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
  imgBaseUrl = '//elm.cangdu.org/img/'
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = '//elm.cangdu.org'
  imgBaseUrl = '//elm.cangdu.org/img/'
}

export {
  imgBaseUrl,
  baseUrl
}
