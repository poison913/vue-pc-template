<template>
  <div>
    <el-col :span="24">
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">本年累计供水量
          <span class="blue">{{provideInfo.thisYearCount}}万m³</span>
        </h5>
        <h5 class="h5-less-margin">较去年同比
          <span class="blue">{{provideInfo.incrYearCount}}万m³</span>
        </h5>
        <h5 class="h5-less-margin">月均供水
          <span class="blue">{{provideInfo.avgMonthCount}}万m³</span>
        </h5>
      </div>
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">本月累计供水量
          <span class="blue">{{provideInfo.thisMonthCount}}万m³</span>
        </h5>
        <h5 class="h5-less-margin">较上月同比
          <span class="blue">{{provideInfo.incrMonthCount}}万m³</span>
        </h5>
        <h5 class="h5-less-margin">日均供水
          <span class="blue">{{provideInfo.avgDayCount}}万m³</span>
        </h5>
      </div>
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">今日累计供水量
          <span class="blue">{{provideInfo.todayCount}}万m³</span>
        </h5>
        <h5 class="h5-less-margin">较昨日变化
          <span class="blue">{{provideInfo.incrDayCount}}万m³</span>
        </h5>
        <h5 class="h5-less-margin">实时供水流量
          <span class="blue">{{provideInfo.avgSecondCount}}m³/s</span>
        </h5>
      </div>
    </el-col>
    <el-col :span="24">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="近十二个月" name="first"></el-tab-pane>
        <el-tab-pane label="本年" name="second"></el-tab-pane>
        <el-col :span="24">
          <subHomeBarChart
            :tabStatus="tabStatus"
            :code ='code'
            ref="subHomeBar"
            :style="{'height':this.leftH+'px'}"
            style="height:300px;width:100%"
          />
        </el-col>
      </el-tabs>
    </el-col>
  </div>
</template>
<script>
import $http from "@/utils/requestDC"; //http请求
import subHomeBarChart from "./subHomeBarChart";
export default {
  components: { subHomeBarChart },
  data() {
    return {
      activeName: "first",
      leftH:"",
      tabStatus:0,
      testData: [
        {
          name: "供水状态",
          value: "121"
        },
        {
          name: "水质日常检测",
          value: "121"
        },
        {
          name: "水质季度检测",
          value: "121"
        },
        {
          name: "待处理隐患",
          value: "121"
        }
      ],
      provideInfo: {}
    };
  },
  props: { code: { type: String },userType:{type:Boolean} },
  created() {
      const _H = this.userType==false? window.innerHeight - 500: window.innerHeight - 580;
    const _LeftH = _H;
    this.leftH = _LeftH;
    this.getStatistics();
  },
  methods: {
    getStatistics() {
      //工程供水情况统计
      $http({
        url: "ProjectSynthesize/GetProjectWaterSupplyStatistics",
        method: "post",
        data: { projectCode: this.code }
      }).then(res => {
        if (res.message.length != 0) {
          this.provideInfo = res.message[0];
        }
        console.log("供水统计", res);
      });
    },
    handleClick(tab, event) {
        if(tab.name=='second'){
            this.tabStatus = 1;
        }else{
            this.tabStatus = 0;
        }
        this.$nextTick(_ => {
            this.$refs.subHomeBar.getListWaterSupplyInfoByYear(); //刷新表格
        });
      console.log(tab, event);
    }
  }
};
</script>
<style lang="less" scoped>
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
</style>

