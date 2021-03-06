import fetch from '../config/fetch'
import { getStore } from '../config/mUtils'

/**
 * @description 获取用户信息
 * @param user_id
 */
export const getUser = () => fetch('/v1/user', { user_id: getStore('user_id') })

/**
 * 获取首页默认地址
 * @param {type: 'guess'} 定位城市
 */
export const cityGuess = () => fetch('/v1/cities', {
  type: 'guess'
})

/**
 * 获取首页热门城市
 * @param {type: 'hot'} 热门城市
 */
export const hotcity = () => fetch('/v1/cities', {
  type: 'hot'
})

/**
 * 获取首页所有城市
 * @param {type: 'group'} 所有城市
 */
export const groupcity = () => fetch('/v1/cities', {
  type: 'group'
})

/**
 * 获取当前所在城市
 * @param {id}
 */
export const currentcity = number => fetch('/v1/cities/' + number)

/**
 * 获取搜索地址
 * @param {type: 'search', city_id, keyword}
 */
export const searchplace = (cityid, value) => fetch('/v1/pois', {
  type: 'search',
  city_id: cityid,
  keyword: value
})

/**
 * 获取msite商铺列表
 *
 */
export const shopList = (latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', delivery_mode = '', support_ids = []) => {
  let supportStr = ''
  support_ids.forEach(item => {
    if (item.status) {
      supportStr += '&support_ids[]=' + item.id
    }
  })
  let data = {
    latitude,
    longitude,
    offset,
    limit: '20',
    'extras[]': 'activities',
    keyword: '',
    restaurant_category_id,
    'restaurant_category_ids[]': restaurant_category_ids,
    order_by,
    'delivery_mode[]': delivery_mode + supportStr
  }
  return fetch('/shopping/restaurants', data)
}

/**
 * 获取msite页面地址信息
 * @param {geohash}
 */

export const msiteAddress = geohash => fetch('/v2/pois/' + geohash)

/**
 * 获取msite页面食品分类列表
 */

export const msiteFoodTypes = geohash => fetch('/v2/index_entry', {
  geohash,
  group_type: '1',
  'flags[]': 'F'
})

/**
 * 获取food页面的category 种类列表
 * @param {latitude}  纬度
 * @param {longitude} 经度
 */
export const foodCategory = (latitude, longitude) => fetch('/shopping/v2/restaurant/category', {
  latitude,
  longitude
})

/**
 * 获取food页面的配送方式
 * @param {latitude}  纬度
 * @param {longitude} 经度
 */

export const foodDelivery = (latitude, longitude) => fetch('/shopping/v1/restaurants/delivery_modes', {
  latitude,
  longitude,
  kw: ''
})

/**
 * 获取food页面的商家属性活动列表
 * @param {latitude}  纬度
 * @param {longitude} 经度
 */
export const foodActivity = (latitude, longitude) => fetch('/shopping/v1/restaurants/activity_attributes', {
  latitude,
  longitude,
  kw: ''
})

/**
 * 获取shop页面商铺详情
 * @param {shopid}
 */
export const shopDetails = (shopid, latitude, longitude) => fetch('/shopping/restaurant/' + shopid, {
  latitude,
  longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
})

/**
 * 获取shop页面菜单列表
 * @param {restaurant_id} 餐馆ID
 */
export const foodMenu = restaurant_id => fetch('/shopping/v2/menu', {
  restaurant_id
})

/**
 * 获取商铺评价列表
 * @param {restaurant_id, tag_name, offset, limit}
 */
export const getRatingList = (shopid, offset, tag_name = '') => fetch('/ugc/v2/restaurants/' + shopid + '/ratings', {
  has_content: true,
  offset,
  tag_name
})

/**
 * 获取商铺评价分数
 * @param {restaurant_id} 餐馆ID
 */
export const ratingScores = shopid => fetch('/ugc/v2/restaurants/' + shopid + '/ratings/scores')

/**
 * 获取商铺评价分类
 * @param {restaurant_id}
 */
export const ratingTags = shopid => fetch('/ugc/v2/restaurants/' + shopid + '/ratings/tags')
