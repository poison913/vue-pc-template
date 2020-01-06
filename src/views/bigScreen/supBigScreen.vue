<template>
  <div class="homePage-container">
    <el-row :gutter="10">
      <!-- 左中右三个块 -->
      <el-col :span="8">
        <div class="homePage-box">
          <titleStyle class="c-white" :title="'实时消毒反冲情况'">
            <a @click="more(0)" target="_blank" class="white pull-right" slot="btn">更多</a>
          </titleStyle>
          <el-col :span="12">
            <supHomePieMore :style="{'height':this.leftH+'px'}" :pieData="PieChartData1"/>
          </el-col>
          <el-col :span="12">
            <supHomePieMore :style="{'height':this.leftH+'px'}" :pieData="PieChartData2"/>
          </el-col>
        </div>
        <div class="homePage-box m-t-10">
          <titleStyle :title="'供水和水费收缴情况'">
            <a @click="more(1)" class="white pull-right" slot="btn">更多</a>
          </titleStyle>
          <el-col :span="24">
            <h5 class="h5-less-margin blue">{{this.indexInfo.nowYear}}年水费收缴情况</h5>
          </el-col>
          <el-col :span="24">
            <div class="three-gray-box m-t-10">
              <h5 class="h5-less-margin white">应收水费</h5>
              <h5 class="h5-less-margin blue">{{indexInfo.planMoney}}万元</h5>
            </div>
            <div class="three-gray-box m-t-10">
              <h5 class="h5-less-margin white">已收水费</h5>
              <h5 class="h5-less-margin blue">{{indexInfo.realMoney}}万元</h5>
            </div>
            <div class="three-gray-box m-t-10">
              <h5 class="h5-less-margin white">缴费率</h5>
              <h5 class="h5-less-margin blue">{{indexInfo.moneyPer}}</h5>
            </div>
          </el-col>
          <el-col :span="24">
            <el-tabs v-model="activeName" @tab-click="tabClickEvent">
              <el-tab-pane :label="this.indexInfo.nowYear+'年供水情况'" name="0"></el-tab-pane>
              <el-tab-pane label="近12个月供水情况" name="1"></el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="24">
            <subHomeBarChart
              :tabStatus="tabStatus"
              ref="subHomeBar"
              :style="{'height':this.leftH+'px'}"
              style="height:300px;width:100%"
            />
          </el-col>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="homePage-box">
          <titleStyle :title="'工程运行状态'"></titleStyle>
          <el-col :span="24" class="m-t-10 pull-left">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="box-three green">
                  <div class="img"></div>
                  <div class="title m-t-10">
                    {{indexInfo.greenCount}}
                    <span class="title-label">个</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="box-three yellow">
                  <div class="img"></div>
                  <div class="title m-t-10">
                    {{indexInfo.yellowCount}}
                    <span class="title-label">个</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="box-three red">
                  <div class="img"></div>
                  <div class="title m-t-10">
                    {{indexInfo.redCount}}
                    <span class="title-label">个</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24">
            <subHomeMap :adcdCode="userCode"/>
          </el-col>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="homePage-box">
          <titleStyle :title="'达标统计'">
            <strong slot="btn" class="pull-right">数据更新时间：{{thisMoment}}</strong>
          </titleStyle>
          <div class="three-gray-box m-t-10">
            <h5 class="h5-less-margin white">达标人口覆盖率</h5>
            <h5 class="h5-less-margin blue">{{indexInfo.posulationCover}}%</h5>
          </div>
          <div class="three-gray-box m-t-10">
            <h5 class="h5-less-margin white">供水保证率</h5>
            <h5 class="h5-less-margin blue">{{indexInfo.waterSupplyStandard}}%</h5>
          </div>
          <div class="three-gray-box m-t-10">
            <h5 class="h5-less-margin white">水质达标率</h5>
            <h5 class="h5-less-margin blue">{{indexInfo.waterQualityStandard}}%</h5>
          </div>
          <!-- <el-col :span="24" class="m-t-10">
            <h5 class="h5-less-margin"></h5>
          </el-col>-->
        </div>
        <div class="homePage-box m-t-10">
          <titleStyle :title="'实时水质'">
            <a @click="more(2)" class="white pull-right" slot="btn">更多</a>
          </titleStyle>
          <el-col :span="24">
            <h5 class="h5-less-margin white">水质监测点共{{indexInfo.WaterAllCount}}个</h5>
          </el-col>
          <el-col :span="12" class="m-t-10">
            <div class="two-box color-green">
              <el-col :span="12">
                <div class="green">合格</div>
                <div class="greenNum white">{{indexInfo.SUM_NORMAL_PROJECT_TODAY}}</div>
              </el-col>
              <el-col :span="12"></el-col>
              <h5 class="h5-less-margin right-name white">较昨日变化</h5>
              <el-tag size="small" class="right-label white">
                <strong>{{indexInfo.SUM_NORMAL_PROJECT_TODAY_Last}}</strong>
              </el-tag>
            </div>
          </el-col>
          <el-col :span="12" class="m-t-10">
            <div class="two-box color-red" >
              <el-col :span="12">
                <div class="red">不合格</div>
                <div class="redNum white">{{indexInfo.SUM_ABNOMAL_PROJECT_TODAY}}</div>
              </el-col>
              <el-col :span="12"></el-col>
              <h5 class="h5-less-margin right-name white">较昨日变化</h5>
              <el-tag type="white" size="small" class="right-label white">
                <strong>{{indexInfo.SUM_ABNOMAL_PROJECT_TODAY_Last}}</strong>
              </el-tag>
            </div>
          </el-col>
        </div>
        <div class="homePage-box m-t-10">
          <titleStyle :title="'监测设备运行情况'">
            <a @click="more(3)" class="white pull-right" slot="btn">更多</a>
          </titleStyle>
          <el-col :span="24">
            <monitorPie
              :style="{'height':this.rH/2+'px'}"
              style="width:100%"
              ref="leftPie"
              :pieData="leftPieData"
            />
          </el-col>
          <el-col :span="24">
            <monitorPie
              :style="{'height':this.rH/2+'px'}"
              style="width:100%"
              ref="rightPie"
              :pieData="rightPieData"
            />
          </el-col>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import titleStyle from "@/components/BigTitle/index"; //标题栏组件
import supHomePieMore from "./components/supHomePieMore"; //多层嵌套饼图
import subHomeBarChart from "./components/subHomeBarChart"; //平均供水量柱状图
import subHomeMap from "./components/subHomeMap"; //首页地图
import pieChart from "./components/pieChart"; //饼图组件
import request from "@/utils/requestDC"; //http请求
import monitorPie from "./components/monitorPie"; //监测设备运行饼图
export default {
  name: "supHomePage",
  components: {
    titleStyle,
    supHomePieMore,
    subHomeBarChart,
    subHomeMap,
    pieChart,
    monitorPie
  },
  props: {},
  data() {
    const thisYear = this.$moment().format("YYYY");
    const thisMonth = this.$moment().format("MM");
    const thisMoment = this.$moment().format("YYYY-MM-DD HH:mm:ss");
    return {
      PieChartData1: 0,
      PieChartData2: 1, //多级饼图数据初始化
      activeName: "0", //默认显示第一个tab
      top_h: 0,
      userCode: 33,
      leftPieData: 0,
      rightPieData: 1,
      leftH: "",
      midH: "",
      rH: "",
      tabStatus: 0, //当年水费收缴情况还是按月份查询水费收缴情况，0当年，1按年份+月份
      indexInfo: {
        nowYear: thisYear,
        nowMonth: thisMonth,
        planMoney: 0,
        realMoney: 0,
        moneyPer: "", //应收水费、已收水费、缴费率
        redCount: 0,
        greenCount: 0,
        yellowCount: 0, //红绿黄灯工程数量
        posulationCover: 0, //达标人口覆盖率
        waterSupplyStandard: 0, //供水保证率
        waterQualityStandard: 0, //水质达标率
        WaterAllCount: 0,
        SUM_NORMAL_PROJECT_TODAY: 0, //今日合格监测点
        SUM_ABNOMAL_PROJECT_TODAY: 0, //今日未合格监测点
        SUM_NORMAL_PROJECT_TODAY_Last: "", //较昨日变化
        SUM_ABNOMAL_PROJECT_TODAY_Last: "" //较昨日变化
      }, //首页数据统一放到这里
      thisMoment: thisMoment
    };
  },
  watch: {},
  computed: {},
  methods: {
    //各个窗口的跳转情况
    more(type) {
      switch (type) {
        case 0: //消毒反冲监测
          this.$router.push({ path: "/monitor/supDisinfectMonitor" });
          //window.open(href,'_blank');
          break;
        case 1: //供水监测
          this.$router.push({ path: "/monitor/supProvideMonitor" });
          break;
        case 2: //水质监测
          this.$router.push({ path: "/monitor/supWaterMonitor" });
          break;
        case 3: //监测设备
          this.$router.push({ path: "/monitor/supFacilityMonitor" });
          break;
        default:
          break;
      }
    },
    //供水和水费收缴情况统计
    getMoneyCount() {
      request({
        url: "Index/ListWaterFeeInfoByYear",
        method: "post",
        data: {
          time: this.indexInfo.nowYear
        }
      }).then(({ message }) => {
        this.indexInfo.planMoney = message.SUM_WATER_CHARGES_PAYABLE;
        this.indexInfo.realMoney = message.SUM_HAS_COLLECTED_WATER_CHARGES;
        this.indexInfo.moneyPer = message.SUM_HAS_COLLECTED_WATER_CHARGES == 0?'-%':
          (
            (message.SUM_HAS_COLLECTED_WATER_CHARGES /
              message.SUM_WATER_CHARGES_PAYABLE) *
            100
          ).toFixed(2) + "%";
      });
    },
    //tab切换事件
    tabClickEvent(tab, event) {
      //debugger
      this.tabStatus = Number(tab.name); //切换tab传值
      this.$nextTick(_ => {
        this.$refs.subHomeBar.getListWaterSupplyInfoByYear(); //刷新表格
      });
    },
    //获取工程运行状态的红绿灯个数
    getRedGreenCount() {
      request({
        url: "ProjectInfoMap/GetMapProjectStatistics",
        method: "post",
        data: {
          time: this.indexInfo.nowYear
        }
      }).then(({ message }) => {
        this.indexInfo.redCount = message.Red_Count;
        this.indexInfo.greenCount = message.Green_Count;
        this.indexInfo.yellowCount = message.Yellow_Count;
      });
    },
    //获取达标统计
    getStandardSituationStatistic() {
      request({
        url: "Index/StandardSituationStatistic",
        method: "post",
        data: {}
      }).then(({ message }) => {
        for (let key in message) {
          this.indexInfo[key] = message[key];
        }
        /* this.indexInfo.posulationCover = message.posulationCover;
        this.indexInfo.waterSupplyStandard = message.waterSupplyStandard;
        this.indexInfo.waterQualityStandard = message.waterQualityStandard; */
      });
    },
    //获取实时水质统计
    getListWaterQualityRealTimeInfo() {
      request({
        url: "Index/ListWaterQualityRealTimeInfo",
        method: "post",
        data: {}
      }).then(({ message }) => {
        this.indexInfo.WaterAllCount =
          message.SUM_NORMAL_PROJECT_TODAY + message.SUM_ABNOMAL_PROJECT_TODAY;
        this.indexInfo.SUM_NORMAL_PROJECT_TODAY =
          message.SUM_NORMAL_PROJECT_TODAY;
        this.indexInfo.SUM_ABNOMAL_PROJECT_TODAY =
          message.SUM_ABNOMAL_PROJECT_TODAY;
        const count1 =
          message.SUM_NORMAL_PROJECT_TODAY -
          message.SUM_NORMAL_PROJECT_YESTODAY;
        const count2 =
          message.SUM_ABNOMAL_PROJECT_TODAY -
          message.SUM_ABNOMAL_PROJECT_YESTODAY;
        count1 > 0
          ? (this.indexInfo.SUM_NORMAL_PROJECT_TODAY_Last = "+" + count1)
          : (this.indexInfo.SUM_NORMAL_PROJECT_TODAY_Last = count1);
        count2 > 0
          ? (this.indexInfo.SUM_ABNOMAL_PROJECT_TODAY_Last = "+" + count2)
          : (this.indexInfo.SUM_ABNOMAL_PROJECT_TODAY_Last = count2);
      });
    }
  },
  created() {
    this.getMoneyCount(); //获取当年水费收缴情况数据
    this.getStandardSituationStatistic(); //获取达标统计
    this.getListWaterQualityRealTimeInfo(); //获取实时水质统计
    this.getRedGreenCount(); //获取红绿灯个数
    //先计算一下屏幕的高度，左侧的饼图和柱状图的赋值
    const _H = window.innerHeight - 320;
    const _LeftH = parseInt(_H / 2);
    this.leftH = _LeftH;
    const _HM = window.innerHeight - 235;
    this.midH = _HM;
    const _HR = window.innerHeight - 430;
    this.rH = _HR;
    console.log(this.leftH);
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.homePage-container {
  padding: 10px;
  font-family: "microsoft yahei";
}
.homePage-box {
  // border: 1px solid #ddd;
  border-radius: 3px;
  padding: 10px;
  background: #091846 ;
  float: left;
  width: 100%;
  .three-gray-box {
    background: #0B0D26;
    border-radius: 3px;
    width: 32%;
    float: left;
    margin-right: 1%;
    padding: 10px;
    h5 {
      line-height: 24px;
      // color: #fff;
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
.box-three-labels {
  height: 40px;
  padding: 5px;
  .box-item {
    height: 30px;
    width: 30%;
    margin-right: 3%;
    line-height: 30px;
    border-radius: 20px;
    color: #fff;
    text-align: center;
    float: left;
    &.green {
      background: #4dd29b;
    }
    &.yellow {
      background: #ffd000;
    }
    &.red {
      background: #ff000d;
    }
  }
}
.box-three {
  background: #0B0D26;
  border-radius: 3px;
  padding: 10px;
  &.green {
    .img {
      background: url("../../assets/green.png");
      height: 54px;
      width: 40px;
      margin: 0 auto;
    }
    .title {
      color: #4dd29b;
      font-size: 1.2em;
      text-align: center;
      font-weight: 600;
    }
  }
  &.yellow {
    .img {
      background: url("../../assets/yellow.png");
      height: 54px;
      width: 40px;
      margin: 0 auto;
    }
    .title {
      color: #ffd000;
      font-size: 1.2em;
      text-align: center;
      font-weight: 600;
    }
  }
  &.red {
    .img {
      background: url("../../assets/red.png");
      height: 54px;
      width: 40px;
      margin: 0 auto;
    }
    .title {
      color: #ff0000;
      font-size: 1.2em;
      text-align: center;
      font-weight: 600;
    }
  }
  .title-label {
    color: #fff;
    background: lighten(#0062ff, 20%);
    border-radius: 3px;
    padding: 0 4px;
  }
}
.two-box {
  padding: 10px;
  border-radius: 3px;
  text-align: center;
  color: #333;
  line-height: 24px;
  background: #f5f5f5;
  height: 92px;
  .green {
    height: 50px;
    width: 50px;
    border-radius: 30px;
    background: #3ec53e;
    text-align: center;
    vertical-align: center;
    line-height: 50px;
    color: #fff;
    font-weight: 600;
    float: left;
    margin: 10px 0 0 0;
    font-size: 14px;
  }
  .greenNum {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    line-height: 72px;
  }
  .red {
    height: 50px;
    width: 50px;
    border-radius: 30px;
    background: #e70c0c;
    text-align: center;
    vertical-align: center;
    line-height: 50px;
    color: #fff;
    font-weight: 600;
    float: left;
    margin: 10px 0 0 0;
    font-size: 14px;
  }
  .redNum {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    line-height: 72px;
  }
  .right-name {
    line-height: 40px;
  }
  /*   &.green {
    background: #4dd29b;
  }
  &.red {
    background: #ff000d;
  } */
}
.color-green{
  background-color: #3ec53e;

}.color-red{
  background-color:#e70c0c;
  
}
.el-tag{
  background-color: #0B0D26

}
</style>
