<template>
  <div>
    <el-col :span="24" v-if="userType">
      <!-- <div class="three-gray-box m-t-10" v-for="(item,index) in testData" :key="index">
              <h5 class="h5-less-margin">{{item.name}}</h5>
              <h5 class="h5-less-margin blue">{{item.value}}</h5>
      </div>-->
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">水质状态</h5>
        <h5 class="h5-less-margin" :class="runInfo.waterQualityStatus==null?'':runInfo.waterQualityStatus==0?'danger':runInfo.waterQualityStatus==1?'blue':''" >{{runInfo.waterQualityStatus==null?"-":runInfo.waterQualityStatus==0?'不合格':runInfo.waterQualityStatus==1?'合格':''}}</h5>
      </div>
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">反冲状态</h5>
        <h5 class="h5-less-margin" 
        :class="runInfo.backWashStatus==null?'-':runInfo.backWashStatus==0?'danger':runInfo.backWashStatus==1?'blue':''"
        >{{runInfo.backWashStatus==null?"-":runInfo.backWashStatus==0?'异常':runInfo.backWashStatus==1?'正常':''}}</h5>
      </div>
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">消毒状态</h5>
        <h5 class="h5-less-margin" 
        :class="runInfo.disinfectionStatus==null?'-':runInfo.disinfectionStatus==0?'danger':runInfo.disinfectionStatus==1?'blue':''"
        >{{runInfo.disinfectionStatus==null?"-":runInfo.disinfectionStatus==0?'异常':runInfo.disinfectionStatus==1?'正常':''}}</h5>
      </div>
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">设备状态</h5>
        <h5 class="h5-less-margin" 
        :class="runInfo.equipmentStatus==null?'-':runInfo.equipmentStatus==0?'danger':runInfo.equipmentStatus==1?'blue':''"
        >{{runInfo.equipmentStatus==null?"-":runInfo.equipmentStatus==0?'异常':runInfo.equipmentStatus==1?'正常':'无设备'}}</h5>
      </div>
    </el-col>
    <el-col :span="24">
      <!-- <div class="three-gray-box m-t-10" v-for="(item,index) in testData" :key="index">
              <h5 class="h5-less-margin">{{item.name}}</h5>
              <h5 class="h5-less-margin blue">{{item.value}}</h5>
      </div>-->
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">供水状态</h5>
        <h5
          class="h5-less-margin blue"
          :class="runInfo.waterSupplyStatus==null?'-':runInfo.waterSupplyStatus==0?'danger':runInfo.waterSupplyStatus==1?'blue':''"
        >{{runInfo.waterSupplyStatus==null?"-":runInfo.waterSupplyStatus==0?'异常':runInfo.waterSupplyStatus==1?'正常':''}}</h5>
      </div>
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">水质日常检测</h5>
        <h5 class="h5-less-margin blue"
        :class="runInfo.wqDayTestStatus==null?'-':runInfo.wqDayTestStatus=='1'?'blue':'danger'"
        >{{runInfo.wqDayTestStatus==null?'-':runInfo.wqDayTestStatus=='1'?'按规定开展日常检测':"不按规定开展日常检测"}}</h5>
      </div>
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">水质季度检测</h5>
        <h5
          class="h5-less-margin blue"
          :class="runInfo.wqQuarterTestStatus==null?'-':runInfo.wqQuarterTestStatus=='1'?'blue':'danger'"
        >{{runInfo.wqQuarterTestStatus==null?"-":runInfo.wqQuarterTestStatus=='1'?'按规定开展季度检测':"不按规定开展季度检测"}}</h5>
      </div>
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">待处理隐患</h5>
        <h5 class="h5-less-margin blue cursor" @click="linkTrouble">{{runInfo.dangerCount}}个</h5>
      </div>
    </el-col>
  </div>
</template>
<script>
import $http from "@/utils/requestDC"; //http请求
export default {
  data() {
    return {
      runInfo: {},
      projectName:''
    };
  },
  props: { code: { type: String },userType:{ type:Boolean}},
  created() {
    this.getRunStatus();
    this.getProjectInfo();
  },
  methods: {
    getProjectInfo(){
        $http({
            url:"ProjectInfo/GetProjectRuralWaterSupplyBaseInfos",
            method: "post",
        data: { projectCode: this.code }
      }).then(res => {
          this.projectName = res.message.RURAL_WATER_SUPPLY_NAME;
        console.log("工程信息", res);
      });
    },
    getRunStatus() {
      $http({
        url: "ProjectSynthesize/GetProjectRunStatus",
        method: "post",
        data: { projectCode: this.code }
      }).then(res => {
        if(res.message.length!=0){
          this.runInfo = res.message[0];
        }
        console.log("运行状态", res);
      });
    },
    //跳转
    linkTrouble(){
        window.open('#/supTroubleManage?projectName='+this.projectName)
    }
  }
};
</script>
<style lang="less" scoped>
.three-gray-box {
  background: #f8f8f8;
  border-radius: 3px;
  width: 24%;
  float: left;
  margin-right: 1%;
  padding: 10px;
  h5 {
    line-height: 24px;
    text-align: center;
  }
}
.cursor{
    cursor: pointer;
}
</style>