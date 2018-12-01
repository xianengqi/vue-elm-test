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
                  <span class="category_num" v-if="categoryNum[index]&&item.type==1">{{ categoryNum[index] }}</span>
                </li>
              </ul>
            </section>
            <section class="menu_right" ref="menuFoodList">
              <ul>
                <li v-for="(item, index) in menuList" :key="index">
                  <header class="menu_detail_header">
                    <section class="menu_detail_header_left">
                      <strong class="menu_item_title">{{ item.name }}</strong>
                      <span class="menu_item_description">{{ item.description }}</span>
                    </section>
                    <span class="menu_detail_header_right" @click="showTitleDetail(index)"></span>
                    <p class="description_tip" v-if="index == TitleDetailIndex">
                      <span>{{ item.name }}</span>
                      {{ item.description }}
                    </p>
                  </header>
                  <section v-for="(foods, foodindex) in item.foods" :key="foodindex" class="menu_detail_list">
                    <router-link :to="{path: 'shop/foodDetail', query:{image_path:foods.image_path, description: foods.description, month_sales: foods.month_sales, name: foods.name, rating: foods.rating, rating_count: foods.rating_count, satisfy_rate: foods.satisfy_rate, foods, shopId}}" tag="div" class="menu_detail_link">
                      <section class="menu_food_img">
                        <img :src="imgBaseUrl + foods.image_path">
                      </section>
                      <section class="menu_food_description">
                        <h3 class="food_description_head">
                          <strong class="description_foodname">{{ foods.name }}</strong>
                          <ul v-if="foods.attributes.length" class="attributes_ul">
                            <li v-if="attribute" v-for="(attribute, foodindex) in foods.attributes" :key="foodindex" :style="{color: '#' + attribute.icon_color, borderColor: '#' + attribute.icon_color}" :class="{attribute_new: attribute.icon_name == '新'}">
                              <p :style="{color: attribute.icon_name == '新'? '#fff' : '#' + attribute.icon_color}">{{attribute.icon_name == '新' ? '新品' : attribute.icon_name}}</p>
                            </li>
                          </ul>
                        </h3>
                        <p class="food_description_content">{{ foods.description }}</p>
                        <p class='food_description_sale_rating'>
                          <span>月售{{ foods.month_sales }}份</span>
                          <span>好评率{{ foods.satisfy_rate }}%</span>
                        </p>
                        <p v-if="foods.activity" class="food_activity">
                        <span :style="{color: '#' + foods.activity.image_text_color, borderColor: '#' + foods.activity.icon_color}">{{ foods.activity.image_text }}</span>
                        </p>
                      </section>
                    </router-link>
                    <footer class="menu_detail_footer">
                      <section class="food_price">
                        <span>¥</span>
                        <span>{{ foods.specfoods[0].price }}</span>
                        <span v-if="foods.specifications.length">起</span>
                      </section>
                      <buy-cart :shopId="shopId" :foods="foods" @moveInCart="listenInCart" @showChooseList="showChooseList" @showReduceTip="showReduceTip" @showMoveDot="showMoveDotFun"></buy-cart>
                    </footer>
                  </section>
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
import { msiteAddress, shopDetails, foodMenu, getRatingList, ratingScores, ratingTags } from '../../api/getData'
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
      categoryNum: [], // 商品类型右上角已加入购物车的数量
      TitleDetailIndex: null, // 点击展示列表头部详情
      receiveInCart: false, // 购物车组件下落的圆点是否到达目标位置
      totalPrice: 0, // 总共价钱
      ratingOffset: 0, // 评论获取数据offset值
      cartFoodList: [], // 购物车商品列表
      showCartList: false, // 显示购物车列表
      imgBaseUrl
    }
  },
  components: {
    buyCart,
    loading,
    ratingStar
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
    },
    // 配送费
    deliveryFee () {
      if (this.shopDetailData) {
        return this.shopDetailData.float_delivery_fee
      } else {
        return null
      }
    },
    // 还差多少元起送，为负数时显示去结算按钮
    minimunOrderAmount () {
      if (this.shopDetailData) {
        return this.shopDetailData.float_minimum_order_amount - this.totalPrice
      } else {
        return null
      }
    },
    // 当前商店购物信息
    shopCart () {
      return { ...this.cartList[this.shopId] }
    },
    // 购物车中总共商品的数量
    totalNum () {
      let num = 0
      this.cartFoodList.forEach(item => {
        num += item.num
      })
      return num
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
      'RECORD_SHOPDETAIL',
      'ADD_CART',
      'REDUCE_CART',
      'INIT_BUYCART',
      'CLEAR_CART',
      'RECORD_SHOPDETAIL'
    ]),
    // 初始化时获取基本数据
    async initData () {
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
      // 评论列表
      this.ratingList = await getRatingList(this.shopId, this.ratingOffset)
      // 商铺评论详情
      this.ratingScoresData = await ratingScores(this.shopId)
      // 评论Tag列表
      this.ratingTagsList = await ratingTags(this.shopId)
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
    showTitleDetail (index) {
      if (this.TitleDetailIndex === index) {
        this.TitleDetailIndex = null
      } else {
        this.TitleDetailIndex = index
      }
    },
    // 加入购物车， 所需7个参数，商铺id, 食品分类id, 食品id, 食品规格id, 食品名字，食品价格，食品规格
    addToCart (category_id, item_id, food_id, name, price, specs) {
      this.ADD_CART({ shopid: this.shopId, category_id, item_id, food_id, name, price, specs })
    },
    // 移出购物车，所需要7个参数，商铺id,食品分类id, 食品id,食品规格id,食品名字，食品价格，食品规格
    removeOutCart (category_id, item_id, food_id, name, price, specs) {
      this.REDUCE_CART({ shopid: this.shopId, category_id, item_id, food_id, name, price, specs })
    },
    /**
     * 初始化和shopCart变化时,重新获取购物车改变过的数据，赋值 categoryNum, totalPrice, cartFoodList，整个数据流是自上而下的形式，所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，使整个数据更加清晰
     *
     */
    initCategoryNum () {
      let newArr = []
      let cartFoodNum = 0
      this.totalPric = 0
      this.cartFoodList = []
      this.menuList.forEach((item, index) => {
        if (this.shopCart && this.shopCart[item.foods[0].category_id]) {
          let num = 0
          Object.keys(this.shopCart[item.foods[0].category_id]).forEach(itemid => {
            Object.keys(this.shopCart[item.foods[0].category_id][itemid]).forEach(foodid => {
              let foodItem = this.shopCart[item.foods[0].category_id][itemid][foodid]
              num += foodItem.num
              if (item.type === 1) {
                this.totalPrice += foodItem.num * foodItem.price
                if (foodItem.num > 0) {
                  this.cartFoodList[cartFoodNum] = {}
                  this.cartFoodList[cartFoodNum].category_id = item.foods[0].category_id
                  this.cartFoodList[cartFoodNum].item_id = itemid
                  this.cartFoodList[cartFoodNum].food_id = foodid
                  this.cartFoodList[cartFoodNum].num = foodItem.num
                  this.cartFoodList[cartFoodNum].price = foodItem.price
                  this.cartFoodList[cartFoodNum].name = foodItem.name
                  this.cartFoodList[cartFoodNum].specs = foodItem.specs
                  cartFoodNum++
                }
              }
            })
          })
          newArr[index] = num
        } else {
          newArr[index] = 0
        }
      })
      this.totalPrice = this.totalPrice.toFixed(2)
      this.categoryNum = [...newArr]
    },
    // 控制购物车列表是否显示
    toggleCartList () {
      this.cartFoodList.length ? this.showCartList = !this.showCartList : true
    },
    // 清楚购物车
    clearCart () {
      this.toggleCartList()
      this.CLEAR_CART(this.shopId)
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
        .category_num{
          position: absolute;
          top: .1rem;
          right: .1rem;
          background-color: #ff461d;
          line-height: .6rem;
          text-align: center;
          border-radius: 50%;
          border: 0.025rem solid #ff461d;
          min-width: .6rem;
          height: .6rem;
          @include sc(.5rem, #fff);
          font-family: Helvetica Neue,Tahoma,Arial;
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
    .menu_right{
      flex: 4;
      overflow-y: auto;
      .menu_detail_header{
        width: 100%;
        padding: .4rem;
        position: relative;
        @include fj;
        align-items: center;
        .menu_detail_header_left{
          width: 11rem;
          white-space: nowrap;
          overflow: hidden;
          .menu_item_title{
            @include sc(.7rem, #666);
            font-weight: bold;
            margin-right: .3rem;
          }
          .menu_item_description{
            @include sc(.5rem, #999);
            width: 30%;
            overflow: hidden;
          }
        }
        .menu_detail_header_right{
          @include wh(.5rem, 1rem);
          display: block;
          @include bis('../../images/icon_point.png');
          background-size: 100% .4rem;
          background-position: left center;
        }
        .description_tip{
          background-color: #39373a;
          opacity: 0.95;
          @include sc(.5rem, #fff);
          position: absolute;
          top: 1.5rem;
          z-index: 14;
          width: 8rem;
          right: .2rem;
          padding: .5rem .4rem;
          border: 1px;
          border-radius: .2rem;
          span{
            color: #fff;
            line-height: .6rem;
            font-size: .55rem;
          }
        }
        .description_tip::after{
          content: '';
          position: absolute;
          @include wh(.4rem, .4rem);
          background-color: #39373a;
          top: -.5rem;
          right: .7rem;
          transform: rotate(-45deg) translateY(.41rem);
        }
      }
      .menu_detail_list{
        background-color: #fff;
        padding: .6rem .4rem;
        border-bottom: 1px solid #f8f8f8;
        position: relative;
        overflow: hidden;
        .menu_detail_link{
          display: flex;
          .menu_food_img{
            margin-right: .4rem;
            img{
              @include wh(2rem, 2rem);
              display: block;
            }
          }
          .menu_food_description{
            width: 100%;
            .food_description_head{
              @include fj;
              margin-bottom: .2rem;
              .description_foodname{
                @include sc(.7rem, #333);
              }
              .attributes_ul{
                display: flex;
                li{
                  font-size: .3rem;
                  height: .6rem;
                  line-height: .35rem;
                  padding: .1rem;
                  border: 1px solid #666;
                  border-radius: 0.3rem;
                  margin-right: .1rem;
                  transform: scale(.8);
                  p{
                    white-space: nowrap;
                  }
                }
                .attribute_new{
                  position: absolute;
                  top: 0;
                  left: 0;
                  background-color: #4cd964;
                  @include wh(2rem, 2rem);
                  display: flex;
                  align-items: flex-end;
                  transform: rotate(-45deg) translate(-.1rem, -1.5rem);
                  border: none;
                  border-radius: 0;
                  p{
                    @include sc(.4rem, #fff);
                    text-align: center;
                    flex: 1;
                    transform: scale(0.8) translate(0.1rem, -.1rem);
                  }
                }
              }
            }
            .food_description_content{
              @include sc(.5rem, #999);
              line-height: .6rem;
            }
            .food_description_sale_rating{
              line-height: .8rem;
              span:nth-of-type(1){
                @include sc(.5rem, #333);
                margin-right: .3rem;
              }
              span:nth-of-type(2){
                @include sc(.5rem, #333);
              }
            }
            .food_activity{
              line-height: .4rem;
              span{
                font-size: .3rem;
                border: 1px solid currentColor;
                border-radius: 0.3rem;
                padding: .08rem;
                display: inline-block;
                transform: scale(.8);
                margin-left: -0.35rem;
              }
            }
          }
        }
        .menu_detail_footer{
          margin-left: 2.54rem;
          font-size: 0;
          margin-top: .3rem;
          @include fj;
          .food_price{
            span{
              font-family: 'Helvetica Neue', Tahoma, Arial;
            }
            span:nth-of-type(1){
              @include sc(.5rem, #f60);
              margin-right: .05rem;
            }
            span:nth-of-type(2){
              @include sc(.7rem, #f60);
              font-weight: bold;
              margin-right: .3rem;
            }
            span:nth-of-type(3){
              @include sc(.5rem, #666);
            }
          }
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
