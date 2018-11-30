<template>
  <div>
    <section v-if="!showLoading" class="shop_container">
      <nav class="goback" @click="goback">
        <svg width="4rem" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:3"/>
        </svg>
      </nav>
      <header class="shop_detail_header" ref="shopheader" :style="{ zIndex: showActivities ? '14':'10' }">
        <img :src="imgBaseUrl + shopDetailData.image_path" class="header_cover_img">
        <section class="description_header">
          <router-link tp="/shop/shopDetail" class="description_top">
            <section class="description_left">
              <img :src="imgBaseUrl + shopDetailData.image_path">
            </section>
          </router-link>
        </section>
      </header>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { msiteAddress, shopDetails, foodMenu, getRatingList, ratingScores, ratingtags } from '../../api/getData'
import loading from '../../components/common/loading'
import buyCart from '../../components/common/buyCart'
import ratingStar from '../../components/common/ratingStar'
import { loadMore, getImgPath } from '../../components/common/mixin'
import { imgBaseUrl } from '../../config/imgBase'
import BScroll from 'better-scroll'

export default {
  data () {
    return {
      geohash: '', // geohash位置信息
      showLoading: true, // 显示加载动画
      shopDetailData: null, // 商铺详情
      shopId: null, // 商店id值
      imgBaseUrl
    }
  },
  created () {
    this.shopId = this.$route.query.id
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapState([
      'latitude',
      'longitude',
      'cartList'
    ])
  },
  watch: {
    // showLoading变化时说明组件已经获取初始化数据，在下一贞nextTick进行后续操作
    showLoading (value) {
      if (!value) {
        this.$nextTick(() => {
          // this.
        })
      }
    }
  },
  methods: {
    ...mapMutations([
      'RECORD_ADDRESS',
      'RECORD_SHOPDETAIL'
    ]),
    async initData () {
      // 我先设为true，待会等有了坐标后设为false
      if (this.latitude) {
        // 获取位置信息
        let res = await msiteAddress(this.geohash)
        // 记录当前经度纬度进入vuex
        this.RECORD_ADDRESS(res)
      }
      // 获取商铺信息
      this.shopDetailData = await shopDetails(this.shopId, this.latitude, this.longitude)
      // 评论Tag列表
      this.RECORD_SHOPDETAIL(this.shopDetailData)
      // 隐藏动画
      this.hideLodaing()
    },
    hideLodaing () {
      this.showLoading = false
    },
    goback () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  @keyframes mymove{
    0%    { transform: scale(1) }
    25%   { transform: scale(.8) }
    50%   { transform: scale(1.1) }
    75%   { transform: scale(.9) }
    100%   { transform: scale(1) }
  }
  @-moz-keyframes mymove{
    0%    { transform: scale(1) }
    25%   { transform: scale(.8) }
    50%   { transform: scale(1.1) }
    75%   { transform: scale(.9) }
    100%  { transform: scale(1) }
  }
  @-webkit-keyframes mymove{
    0%    { transform: scale(1) }
    25%   { transform: scale(.8) }
    50%   { transform: scale(1.1) }
    75%   { transform: scale(.9) }
    100%  { transform: scale(1) }
  }
  @-o-keyframes mymove{
    0%    { transform: scale(1) }
    25%   { transform: scale(.8) }
    50%   { transform: scale(1.1) }
    75%   { transform: scale(.9) }
    100%  { transform: scale(1) }
  }
  .shop_container{
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    left: 0;
    height: 100%;
  }
  .goback{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2rem;
    z-index: 11;
    padding-top: 0.2rem;
    padding-left: 0.2rem;
  }
  .shop_detail_header{
    overflow: hidden;
    position: relative;
    .header_cover_img{
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
      filter: blur(10px);
    }
    .description_header{
      position: relative;
      z-index: 10;
      background-color: rgba(119, 103, 137, .43);
      padding: 0.4rem 0 0.4rem 0.4rem;
      width: 100%;
      overflow: hidden;
      .description_top{
        display: flex;
        .description_left{
          margin-right: 0.3rem;
          img{
            @include wh(2.9rem, 2.9rem);
            display: block;
            border-radius: 0.15rem;
          }
        }
      }
    }
  }
</style>
