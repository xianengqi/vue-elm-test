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
          <router-link to="/shop/shopDetail" class="description_top">
            <section class="description_left">
              <img :src="imgBaseUrl + shopDetailData.image_path">
            </section>
            <section class="description_right">
              <h4 class="description_title ellipsis">{{shopDetailData.name}}</h4>
              <p class="description_text">商家配送 / {{ shopDetailData.order_lead_time }}分钟送达 / 配送费¥{{ shopDetailData.float_delivery_fee }}</p>
              <p class="description_promotion ellipsis">公告：{{ promotionInfo }}</p>
            </section>
            <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description_arrow" >
              <path d="M0 0 L8 7 L0 14"  stroke="#fff" stroke-width="1" fill="none"/>
            </svg>
          </router-link>
          <footer class="description_footer" v-if="shopDetailData.activities.length" @click="showActivitiesFun">
            <p class="ellipsis">
              <span class="tip_icon" :style="{backgroundColor: '#' + shopDetailData.activities[0].icon_color, borderColor: '#' + shopDetailData.activities[0].icon_color}">{{ shopDetailData.activities[0].icon_name }}</span>
              <span>{{ shopDetailData.activities[0].description }} (APP专享) </span>
            </p>
            <p>{{ shopDetailData.activities.length }}个活动</p>
            <svg class="footer_arrow">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-left"></use>
            </svg>
          </footer>
        </section>
      </header>
      <transition name="fade">
        <section class="activities_details" v-if="showActivities">
          <h2 class="activities_shoptitle">{{ shopDetailData.name }}</h2>
          <h3 class="activities_ratingstar">
            <rating-star :rating="shopDetailData.rating"></rating-star>
          </h3>
          <section class="activities_list">
            <header class="activities_title_style"><span>优惠信息</span></header>
            <ul>
              <li v-for="item in shopDetailData.activities" :key='item.id'>
                <span class="activities_icon" :style="{backgroundColor: '#' + item.icon_color, borderColor: '#' + item.icon_color}">{{ item.icon_name }}</span>
                <span>{{ item.description }} (APP专享) </span>
              </li>
            </ul>
          </section>
          <section class="activities_shopinfo">
            <header class="activities_title_style"><span>商家公告</span></header>
            <p>{{ promotionInfo }}</p>
          </section>
          <svg width="60" height="60" class="close_activities" @click.stop="showActivitiesFun">
            <circle cx="30" cy="30" r="25" stroke="#555" stroke-width="1" fill="none"/>
            <line x1="22" y1="38" x2="38" y2="22" style="stroke:#999;stroke-width:2"/>
            <line x1="22" y1="22" x2="38" y2="38" style="stroke:#999;stroke-width:2"/>
          </svg>
        </section>
      </transition>
      <section class="change_show_type" ref="chooseType">
        <div>
          <span :class="{activity_show: changeShowType == 'food'}" @click="changeShowType='food'">商品</span>
        </div>
        <div>
          <span :class="{activity_show: changeShowType == 'rating'}" @click="changeShowType='rating'">评价</span>
        </div>
      </section>
      <transition name="fade-choose">
        <section v-show="changeShowType == 'food'" class="food_container">
          <section class="menu_container">
            <section class="menu_left" id="wrapper_menu" ref="wrapperMenu">
              <ul>
                <li v-for="(item, index) in menuList" :key="index" class="menu_left_li" :class="{activity_menu: index == menuIndex}" @click="chooseMenu(index)">
                  <img :src="getImgPath(item.icon_url)" v-if="item.icon_url">
                  <span>{{ item.name }}</span>
                </li>
              </ul>
            </section>
          </section>
        </section>
      </transition>
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
      showActivities: false, // 是否显示活动详情
      changeShowType: 'food', // 切换显示商品或者评价
      ratingScroll: null, // 评论页Scroll
      menuList: [], // 食品列表
      shopListTop: [], // 商品列表的高度集合
      menuIndex: 0, // 已选菜单索引值，默认为0
      menuIndexChange: true, // 解决选中index时，scroll监听事件重复判断设置index的bug
      foodScroll: null, // 食品列表scroll
      imgBaseUrl
    }
  },
  created () {
    this.geohash = this.$route.query.geohash
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
    ]),
    promotionInfo () {
      return this.shopDetailData.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。'
    }
  },
  watch: {
    // showLoading变化时说明组件已经获取初始化数据，在下一贞nextTick进行后续操作
    showLoading (value) {
      if (!value) {
        this.$nextTick(() => {
          // this.
        })
      }
    },
    // 商品，评价切换状态
    changeShowType (value) {
      if (value === 'rating') {
        this.$nextTick(() => {
          this.ratingScroll = new BScroll('#ratingContainer', {
            probeType: 3,
            deceleration: 0.003,
            bounce: false,
            swipeTime: 2000,
            click: true
          })
          this.ratingScroll.on('scroll', (pos) => {
            if (Math.abs(Math.round(pos.y)) >= Math.abs(Math.round(this.ratingScroll.maxScrollY))) {
              this.loaderMoreRating()
              this.ratingScroll.refresh()
            }
          })
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
      if (!this.latitude) {
        // 获取位置信息
        let res = await msiteAddress(this.geohash)
        // 记录当前经度纬度进入vuex
        this.RECORD_ADDRESS(res)
      }
      // 获取商铺信息
      this.shopDetailData = await shopDetails(this.shopId, this.latitude, this.longitude)
      // 获取商铺食品列表
      this.menuList = await foodMenu(this.shopId)
      // 评论Tag列表
      this.RECORD_SHOPDETAIL(this.shopDetailData)
      // 隐藏动画
      this.hideLodaing()
    },
    // 获取食品列表的高度，存入shopListTop
    getFoodListHeight () {
      const listContainer = this.$refs.menuFoodList
      if (listContainer) {
        const listArr = Array.from(listContainer.children[0].children)
        listArr.forEach((item, index) => {
          this.shopListTop[index] = item.offsetTop
        })
        this.listenScroll(listContainer)
      }
    },
    // 当滑动食品列表时，监听其scrollTop值来设置对应的食品列表标题的样式
    listenScroll (element) {
      this.foodScroll = new BScroll(element, {
        probeType: 3,
        deceleration: 0.001,
        bounce: false,
        swipeTime: 2000,
        click: true
      })

      const wrapperMenu = new BScroll('#wrapper_menu', {
        click: true
      })

      const wrapMenuHeight = this.$refs.wrapperMenu.clientHeight
      this.foodScroll.on('scroll', (pos) => {
        if (!this.$refs.wrapperMenu) {
          return
        }
        this.shopListTop.forEach((item, index) => {
          if (this.menuIndexChange && Math.abs(Math.round(pos.y)) >= item) {
            this.menuIndex = index
            const menuList = this.$refs.wrapperMenu.querySelectorAll('.activity_menu')
            const el = menuList[0]
            wrapperMenu.scrollToElement(el, 800, 0, -(wrapMenuHeight / 2 - 50))
          }
        })
      })
    },
    hideLodaing () {
      this.showLoading = false
    },
    // 控制活动详情页的显示隐藏
    showActivitiesFun () {
      this.showActivities = !this.showActivities
    },
    // 点击左侧食品列表标题，相应列表一栋到最顶层
    chooseMenu (index) {
      this.menuIndex = index
      // menuIndexChange解决运动时listenScroll依然监听的bug
      this.menuIndexChange = false
      this.foodScroll.scrollTo(0, -this.shopListTop[index], 400)
      this.foodScroll.on('scrollEnd', () => {
        this.menuIndexChange = true
      })
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
        .description_right{
          flex: 1;
          .description_title{
            @include sc(.8rem, #fff);
            font-weight: bold;
            width: 100%;
            margin-bottom: 0.3rem;
          }
          .description_text{
            @include sc(.5rem, #fff);
            margin-bottom: 0.3rem;
          }
          .description_promotion{
            @include sc(.5rem, #fff);
            width: 11.5rem;
          }
        }
        .description_arrow{
          @include ct;
          right: 0.3rem;
          z-index: 11;
        }
      }
      .description_footer{
        @include fj;
        margin-top: 0.5rem;
        padding-right: 1rem;
        p{
          @include sc(.5rem, #fff);
          span{
            color: #fff;
          }
          .tip_icon{
            padding: 0 .04rem;
            border: 0.025rem solid #fff;
            border-radius: 0.1rem;
            font-size: .4rem;
            display: inline-block;
          }
        }
        .ellipsis{
          width: 84%;
        }
        .footer_arrow{
          @include wh(.45rem, .45rem);
          position: absolute;
          right: .3rem;
        }
      }
    }
  }
  .activities_details{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #262626;
    z-index: 200;
    padding: 1.25rem;
    .activities_shoptitle{
      text-align: center;
      @include sc(.8rem, #fff);
    }
    .activities_ratingstar{
      display: flex;
      justify-content: center;
      transform: scale(2.2);
      margin-top: .7rem;
    }
    .activities_list{
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      @include sc(.5rem, #fff);
      li{
        margin-bottom: .2rem;
        .activities_icon{
          padding: 0 .02rem;
          display: inline-block;
          border: 0.025rem solid #fff;
          border-radius: 0.1rem;
        }
        span{
          color: #fff;
          line-height: .6rem;
        }
      }
    }
    .activities_shopinfo{
      p{
        line-height: .7rem;
        @include sc(.5rem, #fff);
      }
    }
    .activities_title_style{
      text-align: center;
      margin-bottom: 1rem;
      span{
        @include sc(.5rem, #fff);
        border: 0.025rem solid #555;
        padding: .2rem .4rem;
        border-radius: 0.5rem;
      }
    }
    .close_activities{
      position: absolute;
      bottom: 1rem;
      @include cl;
    }
  }
  .food_container{
    display: flex;
    flex: 1;
    padding-bottom: 2rem;
  }
  .menu_container{
    display: flex;
    flex: 1;
    overflow-y: hidden;
    position: relative;
    .menu_left{
      width: 3.8rem;
      .menu_left_li{
        padding: .7rem .3rem;
        border-bottom: 0.025rem solid #ededed;
        box-sizing: border-box;
        border-left: 0.15rem solid #f8f8f8;
        position: relative;
        img{
          @include wh(.5rem, .6rem);
        }
        span{
          @include sc(.6rem, #666);
        }
      }
      .activity_menu{
        border-left: 0.15rem solid #3190e8;
        background-color: #fff;
        span:nth-of-type(1) {
          font-weight: bold;
        }
      }
    }
  }
  .change_show_type{
    display: flex;
    background-color: #fff;
    padding: .3rem 0 .6rem;
    border-bottom: 1px solid #ebebeb;
    div{
      flex: 1;
      text-align: center;
      span{
        @include sc(.65rem, #666);
        padding: .2rem .1rem;
        border-bottom: 0.12rem solid #fff;
      }
      .activity_show{
        color: #3190e8;
        border-color: #3190e8;
      }
    }
  }
  .fade-enter-active,
  .fade-leave-active{
    transition: opacity .5s;
  }
  .fade-enter,
  .fade-leave-active{
    opacity: 0;
  }
</style>
