<template>
  <div class="login-container">
    <div class="logo"></div>
    <h3 class="title">{{sysTitle}}</h3>
    <div
      class="loading-content"
      v-loading="loading"
      element-loading-text="鉴权登录中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    ></div>
    <div class="footer-title">{{footerTitle}}</div>
  </div>
</template>

<script>
import { getUserInfo } from "@/utils/auth";
import request from "@/utils/requestDC"; //http请求公用
import { sysConfig } from "@/json/sysConfig"; //系统配置信息
export default {
  name: "singleLogin",
  data() {
    return {
      sysTitle: "浙江省农村饮用水安全管理平台",
      loading: true
    };
  },

  components: {},

  created() {
    let year = this.$moment().format("YYYY");
    this.footerTitle = year + "  Copyright © 杭州定川信息技术有限公司";
    this.urlQuery(); //进行url解析，接入免登录服务
  },

  mounted() {},

  methods: {
    urlQuery() {
      this.$store.dispatch("SingleFedLogOut").then(() => {
        const url = window.location.href; //当前页面的url
        let singleObj = {};
        singleObj.dataCenterTicket = getUrlParam(url, "dataCenterTicket");
        singleObj.isBindingsUser = getUrlParam(url, "isBindingsUser");
        singleObj.ticketVerifyInUrl = getUrlParam(url, "ticketVerifyInUrl"); //单点登录信息存储
        //debugger
        this.$store
          .dispatch("SingleLogin", singleObj)
          .then(res => {
            console.log(res);
            //请求获取当前用户的routers列表存入localstorage
            request({
              url: "RoleAuth/ListModAuthByUser",
              method: "post"
            }).then(res => {
              //console.log(res);
              localStorage.setItem("userModule", JSON.stringify(res.message));
              //存储当前的顶部导航的状态
              localStorage.setItem("indexID", res.message.menu[0].MODULE_ID);
              //debugger
              this.$router.push({
                path: res.message.menu[0].MODULE_URL || "/error"
              }); //重新定向到退出之前的页面，没有定向则默认进入主页
            });
          })
          .catch(err => {
            this.$message.error(err); //显示报错信息
          });
      });
      function getUrlParam(url, name) {
        var pattern = new RegExp("[?&]" + name + "=([^&]+)", "g");
        var matcher = pattern.exec(url);
        var items = null;
        if (null != matcher) {
          try {
            items = decodeURIComponent(decodeURIComponent(matcher[1]));
          } catch (e) {
            try {
              items = decodeURIComponent(matcher[1]);
            } catch (e) {
              items = matcher[1];
            }
          }
        }
        return items;
      }
    }
  }
};
</script>
<style lang='less' scoped>
@bg: #2d3a4b;
@dark_gray: #889aa4;
@light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  //background-color: @bg;
  background: url("../../assets/background.jpg");
  background-size: 100% 100%;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    .miss-psw {
      color: #fff;
    }
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: @dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .logo {
    height: 60px;
    width: 60px;
    margin: 100px auto 20px auto;
    background: url("../../assets/logo-80px.png");
    background-size: 100% 100%;
  }
  .title {
    font-size: 30px;
    font-weight: 400;
    color: @light_gray;
    margin: 0px auto 30px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: @dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.pull-right {
  float: right;
}
.footer-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: rgba(0, 0, 0, 0.3);
  line-height: 30px;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  color: #fff;
}
.loading-content {
  width: 150px;
  height: 150px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  margin: 30px auto 30px auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>