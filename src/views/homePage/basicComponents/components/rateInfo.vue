

<template>
  <div>
    <el-col :span="24">
      <!-- <div class="three-gray-box m-t-10" v-for="(item,index) in testData" :key="index">
              <h5 class="h5-less-margin">{{item.name}}</h5>
              <h5 class="h5-less-margin blue">{{item.value}}</h5>
      </div>-->
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">缴费周期</h5>
        <h5
          class="h5-less-margin blue"
        >{{rateInfo.PAYMENT_CYCLE==null?'-':rateInfo.PAYMENT_CYCLE}}</h5>
      </div>
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">应收水费</h5>
        <h5 class="h5-less-margin blue">{{rateInfo.WATER_CHARGES_PAYABLE==null?'-':rateInfo.WATER_CHARGES_PAYABLE+'万元'}}</h5>
      </div>
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">已收水费</h5>
        <h5
          class="h5-less-margin blue"
        >{{rateInfo.HAS_COLLECTED_WATER_CHARGES==null?'-':rateInfo.HAS_COLLECTED_WATER_CHARGES+"万元"}}</h5>
      </div>
      <div class="three-gray-box m-t-10">
        <h5 class="h5-less-margin">缴费率</h5>
        <h5 class="h5-less-margin blue">{{rateInfo.CHARGE_RATE==null?'-':rateInfo.CHARGE_RATE+"%"}}</h5>
      </div>
    </el-col>
  </div>
</template>
<script>
import $http from "@/utils/requestDC"; //http请求
export default {
  data() {
    return {
      rateInfo: {},
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
      ]
    };
  },
  props: { code: { type: String } },
  created() {
    this.getRunStatus();
  },
  methods: {
    getRunStatus() {
      $http({
        url: "ProjectSynthesize/ListWaterFeeCountByYearSuper",
        method: "post",
        data: { time:this.$moment().format("YYYY"), projCode: this.code }
      }).then(res => {
          if(res.message.length!=0){
        this.rateInfo = res.message[0];
          }
        console.log("水费收缴", res);
      });
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
</style>

