<template>
  <div class="web-header">
    <div class="web-name">
      <img src="@/assets/BgHeader.png" class="bg-img" alt>
      <div class="bg-titile">
        <img src="@/assets/BgLogo.png" class="sys-logo" alt>
        <h5 class="cn" >{{title}}</h5>
        <!-- <h5 class="en">Yuyao Rural Drinking Water Safety Management Platform</h5> -->
      </div>
      <!-- <div class="bg-img">

      </div>-->
    </div>
  </div>
</template>

<script>
import { getUserInfo } from "@/utils/auth"; //获取userInfo
export default {
  data() {
    const title = getUserInfo().PLATFORM_NAME;
    //debugger;
    return {
      title: title
    };
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

  // background: url(../../../assets/BgHeader.png) no-repeat  100% 100%;
  .web-name {
    color: #fff;
    // line-height: @header_height;
    font-size: 1.5em;
    // padding-left: 1.1em;
    letter-spacing: 0;
    .sys-logo {
      width: 30px;
      height: 40px;
      float: left;
      display: block;
    }
  }
}
.bg-img {
  // background: url(../../../assets/BgHeader.png) no-repeat  100% 100%;
  position: absolute;
  left: 50%;
  width: 1200px;
  margin-left: -600px;
  height: 60px;
}
.bg-titile {
  position: absolute;
  left: 50%;
  width: 380px;
  margin-left: -190px;
  margin-top: 8px;
  h5 {
    padding: 0px;
    margin: 0px;
  }
  .cn {
    font-size: 24px;
    line-height: 40px;
  }
  .en {
    font-size: 13px;
    font-weight: inherit;
  }
}
</style>
