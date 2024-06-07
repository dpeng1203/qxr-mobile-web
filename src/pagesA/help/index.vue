<template>
  <view class="pay">
    <view class="tabs">
      <uni-segmented-control
        :current="current"
        :values="items"
        style-type="text"
        :active-color="activeColor"
        @clickItem="onClickItem"
      />
    </view>
    <div class="wrap">
      <div class="list" v-if="current == 0">
        <uni-collapse accordion v-model="accordionVal">
          <uni-collapse-item
            v-for="item in question"
            :key="item.title"
            :title="item.title"
          >
            <view class="content">
              <text class="text">{{ item.text }}</text>
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </div>
      <div class="list" v-if="current == 1">
        <uni-collapse accordion v-model="accordionVal">
          <uni-collapse-item
            v-for="item in question1"
            :key="item.title"
            :title="item.title"
          >
            <view class="content">
              <text class="text">{{ item.text }}</text>
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </div>
      <div class="list" v-if="current == 2">
        <uni-collapse accordion v-model="accordionVal">
          <uni-collapse-item
            v-for="item in question2"
            :key="item.title"
            :title="item.title"
          >
            <view class="content">
              <text class="text">{{ item.text }}</text>
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </div>
      <div class="list" v-if="current == 3">
        <uni-collapse accordion v-model="accordionVal">
          <uni-collapse-item
            v-for="item in question3"
            :key="item.title"
            :title="item.title"
          >
            <view class="content">
              <text class="text">{{ item.text }}</text>
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </div>
    </div>
  </view>
</template>

<script>
import { onShareAppMessage, onShareTimeline } from '@/utils/share.js'
import { primaryColor } from '@/utils/theme.js'
export default {
  data() {
    return {
      items: ['常见问题', '开立问题', '流转问题', '融资问题'],
      question: [
        {
          title: '使用平台有什么要求吗？',
          text: '操作平台请使用win7及以上系统、IE10及以上浏览器或360兼容模式。',
        },
        {
          title: '平台对手机号码有什么要求吗？',
          text: '手机号码必须是中国大陆地区电信运营商支持的号段且不支持小灵通。',
        },
        {
          title: '注册时，提示号码已被绑定，该怎么办？',
          text: '请确认您以及认识的人是否曾使用该手机号码在确信融供应链金融平台进行过注册。如果确实注册过，您可以通过找回密码获得该账号的登录密码。',
        },
        {
          title: '无法收到手机验证码，该怎么办？',
          text: '短信收发过程中会存在延迟，请耐心等待；请确认手机是否安装短信拦截或过滤软件；请确认手机是否能够正常接收短信（未处于停机或欠费状态）。',
        },
        {
          title: '个人信息可以变更吗？',
          text: '个人用户信息可以将鼠标放置在右上方个人头像上，点击个人中心菜单中"用户信息"进行修改。',
        },
        {
          title: '登录后提示无访问权限怎么办？',
          text: '请联系贵司管理员登录系统，为您的用户进行角色赋权。',
        },
        {
          title: '如何切换企业？',
          text: '登录账号后，点击企业名称右侧“切换企业”按钮，选择您要切换的企业。',
        },
        {
          title: '企业信息可以变更吗？',
          text: '企业一般信息可在"企业信息"页面修改，企业关键信息需要点击"信息变更"进行变更。',
        },
        {
          title: '什么是管理员权限？',
          text: '企业用户分为管理员用户和普通用户，管理员用户可以设置企业用户权限、控制用户状态 、绑定企业Ukey。',
        },
        {
          title: '如何成为管理员？',
          text: '系统默认创建企业并认证成功的用户为该企业的管理员用户。管理员用户可以在“管理”-“企业用户”-“用户管理”界面中点击“管理员移交”按钮，将管理员权限移交给其他普通用户。',
        },
        {
          title: '如何添加用户？',
          text: '管理员用户可以在“管理”-“企业用户”-“用户管理”界面中点击“邀请用户”按钮，系统将向被邀请的用户发送邀请码，该用户可注册并登录确信融供应链金融平台使用邀请码加入企业。',
        },
      ],
      question1: [
        {
          title: '确信额度是什么？',
          text: '确信额度由平台增信方分配、调整，是企业用户可以确信确权的总值。可用额度是当前用户可以确权的确信值，可用额度动态变动，确信确权后减少，还款后增加。已用额度是当前已经确权未还款的确信总值，随确权和还款动态变动。',
        },
        {
          title: '确信的承诺付款日和到期日有何区别？',
          text: '承诺付款日指确权方对于确信确权还款截止日；由于银行结算和节假日等因素，到期日为承诺付款日延后一至三个工作日。',
        },
        {
          title: '如何确信确权？',
          text: '在拥有额度的前提下，在平台“确信开立”模块中，企业可为其他企业确信确权，确信确权需要三个主要要素：金额、承诺还款期限及接收方，选择/确认后即可开出确信。',
        },
        {
          title: '确信确权后如何还款？',
          text: '用户有已确权确信临近承诺付款日时，系统会自动向用户发送信息进行还款提示。用户可提前将备付还款的资金存放到还款账户中，也可绑定在平台确权的一般结算户自动还款功能，在确信承诺付款日当天，系统将自动从用户的一般结算户余额中划扣还款资金，请用户确保一般结算户在自动扣款当日的余额满足还款要求。',
        },
        {
          title: '确信确权时，确信期限有何限制？',
          text: '确信期限为确信到期日减去确信确权日所得天数，确信期限的限制为一年以内。',
        },
      ],
      question2: [
        {
          title: '什么是确信支付/流转？',
          text: '企业接收到确信后，将持有的确信转让给有交易背景的其他企业，结转应付账款，即确信的支付或称流转。',
        },
        {
          title: '确信支付/流转有何费用？',
          text: '确信支付/流转对支付方和接收方均无任何费用。',
        },
        {
          title: '确信支付/流转多久到账？',
          text: '确信支付/流转实时到账，无需等待。',
        },
        {
          title: '确信支付/流转的流程？',
          text: '确信支付/流转仅需填写接收方（接收方必须是平台认证的企业用户），再需要经办人和审核人Ukey确认，确保您账户内确信安全划转。',
        },
      ],
      question3: [
        {
          title: '如何融资？',
          text: '用户在“确信流转—可用确信“界面中选定进行融资的确信，根据用户实际融资需求填写融资金额（融资金额应小于等于确信金额），并上传真实发票信息和贸易合同，通过审核Ukey确认完成融资申请。由于确信融资基于真实贸易背景，所以请您确认上传的发票和贸易合同真实有效，这有助于您的融资申请快速顺利的通过审核，完成确信融资。',
        },
        {
          title: '融资天数如何计算？',
          text: '确信融资天数为确信到期日减去确信融资日所得天数。确信融资日以最终确信放款日为准。',
        },
        {
          title: '确信融资利率是固定的么？',
          text: '确信融资利率根据融资市场行情，参考各方因素，保持一定期间的稳定。',
        },
      ],
      current: 0,
      activeColor: primaryColor,
      accordionVal: '0',
    }
  },
  onShareAppMessage,
  onShareTimeline,
  onLoad() {},
  methods: {
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex
        this.accordionVal = '0'
      }
    },
  },
}
</script>

<style lang="less" scoped>
.pay {
  background: #f2f2f2;
  min-height: 100vh;
}
.tabs {
  background: #fff;
  border-top: 1px solid #f2f2f2;
}
.wrap {
  margin-top: 20rpx;
  .list {
    .content {
      padding: 0 30rpx 30rpx;
      color: #999;
      // font-size: 26rpx;
    }
  }
}
</style>
