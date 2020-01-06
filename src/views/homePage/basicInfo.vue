<template>
  <div class="homePage-container">
    <h4>{{projectName}}</h4>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="综合信息" name="seven">
        <transition mode="out-in">
          <information v-if="activeName =='seven'" :code="projectCode"></information>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="基础信息" name="first">
        <transition mode="out-in">
          <basic-info v-if="activeName =='first'" :auth="auth" :code="projectCode"></basic-info>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="管理机构" name="second">
        <manage-info v-if="activeName == 'second'" :auth="auth" :code="projectCode"></manage-info>
      </el-tab-pane>
      <el-tab-pane label="管护经费" name="third">
        <manage-fund v-if="activeName == 'third'" :auth="auth"  :code="projectCode"></manage-fund>
      </el-tab-pane>
      <el-tab-pane label="运行管理办法" name="fourth">
        <work-manage v-if="activeName == 'fourth'" :auth="auth"  :code="projectCode"></work-manage>
      </el-tab-pane>
      <el-tab-pane label="划界限权" name="five">
        <dema-info v-if="activeName == 'five'" :auth="auth"  :code="projectCode"></dema-info>
      </el-tab-pane>
      <el-tab-pane label="管网布设图（竣工）" name="six">
        <manage-pic v-if="activeName == 'six'" :auth="auth"  :code="projectCode"></manage-pic>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { judgeAuth } from '@/mixins/common';
import information from "./basicComponents/information";
import basicInfo from "./basicComponents/basicInfo";
import manageInfo from "./basicComponents/management";
import manageFund from "./basicComponents/manageFunds"; //管护经费
import workManage from "./basicComponents/workingManage"; //运行管理办法
import demaInfo from "./basicComponents/demarcation"; //划界限权
import managePic from "./basicComponents/managePic"; //管网不设图
import $http from "@/utils/requestDC";
export default {
  components: { information,basicInfo, manageInfo, manageFund, workManage,demaInfo,managePic },
  data() {
    return {
      activeName: "seven",
      projectCode:'',
      projectName:"",
      auth:[]
    };
  },
  created() {
    this.auth = judgeAuth("A0000");
    let code = this.$route.query.projectCode;
    this.projectCode = code;
    this.getProInfo();
    console.log(`projectCode：${code}`)
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getProInfo(){
      $http({
        url: "ProjectInfo/GetProjectRuralWaterSupplyBaseInfos",
        method: "post", 
        data: { projectCode: this.projectCode }
      }).then(res => {
        this.projectName = res.message.RURAL_WATER_SUPPLY_NAME;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.homePage-container {
  padding: 10px;
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
h4{
  margin: 0px!important;
}
</style>


