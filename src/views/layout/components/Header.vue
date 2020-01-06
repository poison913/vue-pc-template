<template>
  <div class="web-header">
    <div class="web-name">
      <img src="@/assets/logo.png" class="sys-logo" alt>
      {{webName}}
    </div>
    <div class="index-header-navs">
      <div
        class="navs-item"
        :class="item.className"
        v-for="item in topNavItems"
        :key="item.MODULE_ID"
        @click="handleSelect(item.MODULE_ID,item.MODULE_URL,item)"
      >
        <span class="item-icon" :class="item.IMAGE_URL"></span>
        <span class="item-name">{{item.MODULE_NAME}}</span>
      </div>
    </div>
    <!-- <el-menu
      :default-active="activeIndex"
      class="el-menu-demo index-header-navs"
      text-color="#fff"
      active-text-color="yellow"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item class="navs-item" index="1">
        <span class="item-icon shouye"></span>
        <span class="item-name">首页</span>
      </el-menu-item>
      <el-menu-item class="navs-item" index="2">导航二</el-menu-item>
    </el-menu>-->
    <el-menu mode="horizontal" class="user-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <div class="user-icon-name">
            <img src="@/assets/user.jpg" class="user-avatar">
            <span class="user-name" :title="userName">{{userName}}</span>
          </div>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link class="inlineBlock" to="/">
            <el-dropdown-item>Home</el-dropdown-item>
          </router-link>-->
          <el-dropdown-item divided>
            <span style="display:block;" @click="changePSW">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
    <el-dialog
      title="修改密码"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="formVisible"
      :custom-class="'DCDialog'"
      width="400px"
    >
      <el-form :model="formData" :rules="rules" ref="pswForm" label-width="120px" :inline="true">
        <el-form-item label="输入旧密码" prop="oldPassword">
          <el-input v-model="formData.oldPassword" type="password" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="输入新密码" prop="newPassword">
          <el-input v-model="formData.newPassword" type="password" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码" prop="newPasswordAgain">
          <el-input
            v-model="formData.newPasswordAgain"
            type="password"
            autocomplete="off"
            size="mini"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPSWForm('pswForm')" size="mini">取消</el-button>
        <el-button @click="submitNewPassword('pswForm')" type="primary" size="mini">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getUserInfo } from "@/utils/auth";
import Base64 from "@/utils/base64"; //base64转换
import req from "@/utils/requestDC"; //公共http请求方法
export default {
  name: "Header",
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  data() {
    let passAgainRule = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.formData.newPassword) {
        callback(new Error("两次输入密码不一致！"));
      } else {
        callback();
      }
    };
    let newPassFirst = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码，新密码不能为空"));
      } else if (value !== "" && value === this.formData.oldPassword) {
        callback(new Error("新密码不能与旧密码一样"));
      } else {
        callback();
      }
    };
    return {
      webName: "",
      activeIndex: "1",
      formVisible: false,
      userName: "",
      formData: {
        oldPassword: "",
        newPassword: "",
        newPasswordAgain: ""
      },
      formLabelWidth: "180px",
      topNavItems: [], //顶部导航遍历数组
      testNav:[{
        IMAGE_URL: 'shouye', //点击进入的第一个页面url，默认为子菜单的第一个
        MODULE_ID: 'B191C9D1-8D6C-412C-B4C0-8190AE39CE02',
        MODULE_NAME: '首页',
        MODULE_URL: '/supHomePage',
        className: 'active'
      },{
        IMAGE_URL: 'jiankongjiance', 
        MODULE_ID: "58B1C406-5B0B-4AAA-AE57-2207CC36EA3F",
        MODULE_NAME: '监测监控',
        MODULE_URL: "/monitor/supWaterMonitor",
        className: ""
      },{
        IMAGE_URL: 'xitongguanli', 
        MODULE_ID: "1BEFE7A2-9374-49A1-A601-4D6D0E93C2E1",
        MODULE_NAME: '系统管理',
        MODULE_URL: "/supSym/supUserManage",
        className: ''
      }],
      rules: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度在6~16个字符之间",
            trigger: "blur"
          }
        ],
        newPassword: [
          { required: true, validator: newPassFirst, trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度在6~16个字符之间",
            trigger: "blur"
          }
        ],
        newPasswordAgain: [
          { required: true, validator: passAgainRule, trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  mounted() {
    this.activeIndex = localStorage.getItem("indexID");
    let navArray = eval("(" + localStorage.getItem("userModule") + ")");
    console.log(`navArray`,navArray.menu)
    //debugger;
    for (let obj of navArray.menu) {
      //有子页面才显示，无子页面不显示
      let url = "/error"; //无赋值会跳转至404页面
      if (obj.MODULE_URL.length > 0) {
        url = obj.MODULE_URL;
      } else {
        if (obj.subs.length > 0) {
          url = obj.subs[0].MODULE_URL;
        }
      }
      //导航是否选中
      let className = "";
      if (obj.MODULE_ID === this.activeIndex) className = "active";
      else className = "";

      let newObj = {
        MODULE_URL: url, //点击进入的第一个页面url，默认为子菜单的第一个
        MODULE_ID: obj.MODULE_ID,
        MODULE_NAME: obj.MODULE_NAME,
        IMAGE_URL: obj.IMAGE_URL,
        className: className
      };
      //obj.MODULE_URL = obj.subs[0].MODULE_URL; //点击进入的第一个页面url，默认为子菜单的第一个
      this.topNavItems.push(newObj);
    }
    
      // this.topNavItems = this.testNav; // 换成测试菜单
    // debugger
    const userInfos = getUserInfo();
    console.log(userInfos);
    // this.webName = userInfos.PLATFORM_NAME; //使用服务返回的网站名称
    this.webName = '这里是标题'
    // this.userName = userInfos.TRUE_NAME; //用户真实姓名
  },
  methods: {
    logout() {
      this.$store.dispatch("FedLogOut").then(() => {
        this.$router.push({ path: "/login" });
        //location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    handleSelect(key, keyPath) {
      //debugger
      for (let obj of this.topNavItems) {
        if (obj.MODULE_ID === key) {
          obj.className = "active";
        } else {
          obj.className = "";
        }
      }
      console.log(`key${key}`);
      localStorage.setItem("indexID", key);
      this.$emit("pathShift", key); //向父组件传递任务
      this.$router.push({ path: keyPath || "/error" });
    },
    //修改密码
    changePSW() {
      this.formVisible = true;
    },
    //确定提交
    submitNewPassword(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //alert("通过验证");
          const oldPSW = Base64(this.formData.oldPassword);
          const newPSW = Base64(this.formData.newPassword);
          console.log(oldPSW, newPSW);
          req({
            url: "Login/ChangePassword",
            method: "post",
            data: {
              oldPassword: oldPSW,
              newPassword: newPSW
            }
          }).then(res => {
            this.formVisible = false; //对话框关闭
            this.$message({
              message: "恭喜您，密码修改成功!",
              type: "success"
            });
          });
        } else {
          console.log("验证失败");
          return false;
        }
      });
    },
    //点击取消按钮
    resetPSWForm(formName) {
      this.formVisible = false;
      this.$refs[formName].resetFields();
    },
    //刷新顶部导航样式
    refleshTopActive() {
      const indexID = localStorage.getItem("indexID");
      for (let obj of this.topNavItems) {
        if (obj.MODULE_ID === indexID) {
          obj.className = "active";
        } else {
          obj.className = "";
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
@header_height: 50px; //header的高
.web-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  //background: transparent;
  background-image: -moz-linear-gradient(
    90deg,
    rgb(4, 82, 152) 0%,
    rgb(11, 81, 150) 0%,
    rgb(10, 76, 147) 100%
  );
  background-image: linear-gradient(
    90deg,
    rgb(4, 82, 152) 0%,
    rgb(11, 81, 150) 0%,
    rgb(10, 76, 147) 100%
  );
  background-image: -webkit-linear-gradient(
    90deg,
    rgb(4, 82, 152) 0%,
    rgb(11, 81, 150) 0%,
    rgb(10, 76, 147) 100%
  );
  background-image: -ms-linear-gradient(
    90deg,
    rgb(4, 82, 152) 0%,
    rgb(11, 81, 150) 0%,
    rgb(10, 76, 147) 100%
  );
  .web-name {
    color: #fff;
    line-height: @header_height;
    font-size: 1.5em;
    padding-left: 1.1em;
    letter-spacing: 0;
    .sys-logo {
      width: 40px;
      height: 40px;
      margin: 5px;
      float: left;
      display: block;
      margin-right: 20px;
    }
  }
  .user-menu {
    position: absolute;
    top: 0;
    right: 0;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;
      .el-icon-caret-bottom {
        color: #fff;
      }
      .user-avatar {
        width: 24px;
        height: 24px;
        border-radius: 20px;
      }
      .user-icon-name {
        width: 50px;
        text-align: center;
        .user-name {
          font-size: 8px;
          color: #fff;
          text-align: center;
          font-family: "Microsoft Yahei";
          display: block;
          width: 50px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -15px;
        top: 15px;
        font-size: 14px;
      }
    }
  }
}
.index-header-navs {
  position: absolute;
  top: 0;
  right: 100px;
  background: transparent;
  .navs-item {
    height: 50px;
    width: 60px;
    float: left;
    cursor: pointer;
    &.active {
      background: rgba(0, 0, 0, 0.3);
    }
    &:hover,
    &:focus {
      background: rgba(0, 0, 0, 0.3);
    }
    .item-icon {
      display: block;
      width: 22px;
      height: 22px;
      margin: 5px auto 0 auto;
      display: block;
      &.shouye {
        background: url("../../../assets/shouye.png");
        background-size: 100% 100%;
      }
      &.dituliulan {
        background: url("../../../assets/dituliulan.png");
        background-size: 100% 100%;
      }
      &.gongchengxinxi {
        background: url("../../../assets/gongchengxinxi.png");
        background-size: 100% 100%;
      }
      &.jianchaxuncha {
        background: url("../../../assets/jianchaxuncha.png");
        background-size: 100% 100%;
      }
      &.tongjibaobiao {
        background: url("../../../assets/tongjibaobiao.png");
        background-size: 100% 100%;
      }
      &.jiankongjiance {
        background: url("../../../assets/jiankongjiance.png");
        background-size: 100% 100%;
      }
      &.shixiangjiandu {
        background: url("../../../assets/shixiangjiandu.png");
        background-size: 100% 100%;
      }
      &.weixiuyanghu {
        background: url("../../../assets/weixiuyanghu.png");
        background-size: 100% 100%;
      }
      &.xitongguanli {
        background: url("../../../assets/xitongguanli.png");
        background-size: 100% 100%;
      }
      &.yinhuanguanli {
        background: url("../../../assets/yinhuanguanli.png");
        background-size: 100% 100%;
      }
      &.zongheditu {
        background: url("../../../assets/zongheditu.png");
        background-size: 100% 100%;
      }
      &.zuzhijigou {
        background: url("../../../assets/zuzhijigou.png");
        background-size: 100% 100%;
      }
    }
    .item-name {
      font-size: 12px;
      color: #fff;
      text-align: center;
      font-weight: 400;
      display: block;
      width: 100%;
      line-height: 28px;
    }
  }
}
</style>
