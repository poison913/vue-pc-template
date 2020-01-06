<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="logo"></div>
      <h3 class="title">{{sysTitle}}</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" style="color:#fff"/>
        </span>
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          auto-complete="on"
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" style="color:#fff"/>
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
      </el-form-item>
      <div class="tips">
        <!-- <span style="margin-right:20px;">username: admin</span>
        <span> password: admin</span>-->
        <el-checkbox v-model="rememberPsw">记住密码</el-checkbox>
        <!-- <el-checkbox v-model="sevenDaysNoLogin" class="pull-right">7天内免登陆</el-checkbox> -->
      </div>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >登录</el-button>
      </el-form-item>
      <!-- <div class="tips">
        <a href="#" class="miss-psw">忘记密码？</a>
      </div> -->
    </el-form>
    <div class="footer-title">{{footerTitle}}</div>
    <!-- 二维码 -->
    <div class="qrcodeArea">
      <el-popover placement="right" :width="qrCodeStyle.outerWidth" trigger="hover" content="弹窗">
        <img
          :src="QRIos"
          :style="qrCodeStyle"
          @mouseenter="qrCodeOver"
          @mouseleave="qrCodeLeave"
          alt
        >
        <div class="qrcodeList with-line" slot="reference">
          <span class="fa fa-qrcode qrIcon"></span>
          <span class="qrName">IOS</span>
        </div>
      </el-popover>
      <el-popover placement="right" :width="qrCodeStyle.outerWidth" trigger="hover" content="弹窗">
        <img
          :src="QRAndroid"
          :style="qrCodeStyle"
          @mouseenter="qrCodeOver"
          @mouseleave="qrCodeLeave"
          alt
        >
        <div class="qrcodeList" slot="reference">
          <span class="fa fa-qrcode qrIcon"></span>
          <span class="qrName">Android</span>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
//import { mapActions } from "vuex";
import { getUserInfo } from "@/utils/auth";
import request from "@/utils/requestDC"; //http请求公用
import { sysConfig } from "@/json/sysConfig"; //系统配置信息

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined,
      sysTitle: "浙江省农村饮用水安全管理平台",
      footerTitle: "",
      rememberPsw: false,
      sevenDaysNoLogin: false, //记住密码与7天内免登陆
      qrCodeStyle: {
        height: "150px",
        width: "150px",
        outerWidth: "200px"
      },
      QRAndroid: "",
      QRIos: "" //二维码链接
    };
  },
  created() {
    //debugger
    let year = this.$moment().format("YYYY");
    this.footerTitle = year + "  Copyright © 杭州定川信息技术有限公司";
    this.getQRImg();
  },
  mounted() {
    //此时先检查一下是否之前勾选了7天免登陆
    const userInfos = getUserInfo();
    if (userInfos) {
      const isSevenDays = userInfos.isSevenDays;
      if (!!isSevenDays) {
        //存在这个值
        this.sevenDaysNoLogin = isSevenDays;
        //如果已经勾选了7天免登陆，自动执行登陆函数，自动填充表单
        if (isSevenDays) {
          this.loginForm.username = userInfos.username;
          this.loginForm.password = userInfos.password;
          this.handleLogin();
        }
      }
    }
    //是否勾选了记住密码选项
    if (localStorage.getItem("username")) {
      if (localStorage.getItem("username").length > 0) {
        this.rememberPsw = true;
        this.loginForm.username = localStorage.getItem("username");
        this.loginForm.password = localStorage.getItem("password");
      } else {
        this.rememberPsw = false;
      }
    } else {
      this.rememberPsw = false;
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        //debugger
        this.redirect = route.query && route.query.redirect;
        //debugger
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          //记住密码或7天内免登陆勾选
          console.log(this.rememberPsw, this.sevenDaysNoLogin);
          request({
                url: "../src/json/testAuth.json",
                method: "get"
              }).then(res => {
                console.log(res);
                localStorage.setItem("userModule", JSON.stringify(res.message));
                //存储当前的顶部导航的状态
                localStorage.setItem("indexID", res.message.menu[0].MODULE_ID);
                //debugger
                this.$router.push({
                  path: res.message.menu[0].MODULE_URL || "/error"
                }); //重新定向到退出之前的页面，没有定向则默认进入主页
              });
          this.loginForm.isSevenDays = this.sevenDaysNoLogin; //添加是否7天有效期的字段
          //debugger
          this.$store
            .dispatch("Login", this.loginForm)
            .then(res => {
              console.log(res);
              //debugger
              this.loading = false;
              if (this.rememberPsw) {
                localStorage.setItem("username", this.loginForm.username);
                localStorage.setItem("password", this.loginForm.password);
              } else {
                localStorage.removeItem("username");
                localStorage.removeItem("password");
              }
              //请求获取当前用户的routers列表存入localstorage
              
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //二维码鼠标移入事件
    qrCodeOver() {
      this.qrCodeStyle = {
        height: "200px",
        width: "200px",
        outerWidth: "240px"
      };
    },
    qrCodeLeave() {
      this.qrCodeStyle = {
        height: "150px",
        width: "150px",
        outerWidth: "180px"
      };
    },
    getQRImg() {
      /* const url = "src/json/sysConfig.json";
      fetch(url, {
        method: "get"
      })
        .then(res => {
          return res.json();
        })
        .catch(err => {
          this.$message.error(err);
        })
        .then(data => {
          console.log(data);
          this.QRAndroid=data.message.QRImgAndroid;
          this.QRIos=data.message.QRIMGIos;
        }); */
      const sysInfos = sysConfig();
      this.QRAndroid = sysInfos.QRImgAndroid;
      this.QRIos = sysInfos.QRIMGIos;
    },
    //...mapActions("app", ["changeIndexID"])
  }
};
</script>

<style rel="stylesheet/less" lang="less">
@bg: #2d3a4b;
@light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: @light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px @bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .qrcodeArea {
    position: absolute;
    left: 0;
    top: 50%;
    height: 161px;
    margin-top: -80px;
    width: 80px;
    cursor: pointer;
    .qrcodeList {
      width: 80px;
      height: 80px;
      padding: 10px;
      .qrIcon {
        font-size: 50px;
        color: #fff;
        text-align: center;
        display: block;
        margin: 0 auto;
        width: 50px;
        height: 50px;
      }
      .qrName {
        color: #fff;
        font-size: 12px;
        width: 100%;
        display: block;
        text-align: center;
        line-height: 16px;
      }
      &.with-line {
        border-bottom: 1px solid #fff;
      }
      background: rgba(0, 0, 0, 0.4);
    }
  }
}
</style>

<style rel="stylesheet/less" lang="less" scoped>
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
    margin: 0 auto 20px auto;
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
</style>
