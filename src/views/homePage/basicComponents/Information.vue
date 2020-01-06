<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="homePage-box">
          <titleStyle :title="'运行管理状态'"></titleStyle>
          <work-status :code='code' :userType='userType'></work-status>
        </div>
        <div class="homePage-box m-t-10">
          <titleStyle :title="'供水情况'"></titleStyle>
          <provide-info :code='code' :userType='userType'></provide-info>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="homePage-box">
          <titleStyle :title="'本年水费收缴情况'"></titleStyle>
          <rate-info :code='code'></rate-info>
        </div>
        <div class="homePage-box m-t-10" ref="btbox" :style="{'height':this._height}">
          <titleStyle :title="'出厂水水质检测情况'"></titleStyle>
          <water-status :code='code' :tableH='tableH'></water-status>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        
      </el-col>
      <el-col :span="12">
        
      </el-col>
    </el-row>
  </div>
</template>
<script>
import titleStyle from "@/components/Title/index"; //标题栏组件
import rateInfo from "./components/rateinfo"; // 本年水费收缴
import workStatus from "./components/workingStatus"; // 运行管理状态
import provideInfo from "./components/provideInfo"; // 供水情况
import waterStatus from "./components/waterStatus"; // 出厂水水质监测
import { getUserInfo } from "@/utils/auth";
import $http from "@/utils/requestDC"; //http请求
export default {
  components: { titleStyle, rateInfo, workStatus,provideInfo,waterStatus},
  props:{code:{ type: String }} ,
  created(){
    const _h = window.innerHeight - 300;
    this._height = _h+"px";
    let type = getUserInfo().USER_TYPE ==9?true:false;// true 是监管 false 运管
    this.userType = type;
  },
  mounted(){
  },
  data() {
    return {
        projectCode:'',
        _height:'',
        userType:'',
        tableH:''
    };
  }
};
</script>
<style lang="less" scoped>
.homePage-container {
  padding: 10px;
  font-family: "microsoft-yahei";
}
.homePage-box {
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 10px;
  background: #fff;
  float: left;
  width: 100%;
  .three-gray-box {
    background: #f8f8f8;
    border-radius: 3px;
    width: 32%;
    float: left;
    margin-right: 1%;
    padding: 10px;
    h5 {
      line-height: 24px;
      text-align: center;
    }
  }
  .homepage-paragraf {
    text-indent: 2em;
    line-height: 23px;
    font-weight: 400;
    font-size: 0.9em;
    margin: 0;
    text-align: justify;
  }
}
</style>

