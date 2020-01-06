/* 作者：陈凯歌  开发日期：2019-03-01
   页面描述：监管首页
   修改人员：****  修改日期：****
 */
<template>
  <div class="homePage-container">
    <el-row :gutter="10">
      <el-col :span="9">
        <div class="homePage-box" style="padding-bottom:0">
          <el-button
            round
            size="mini"
            v-show="prjBox1"
            type="primary"
            @click="viewLightingRule()"
            class="viewLightBtn"
          >查看亮灯规则</el-button>
          <titleStyle :title="'工程运行状态'">
            <el-button
              round
              size="mini"
              type="primary"
              @click="viewPrjInfo()"
              class="pull-right"
              slot="btn"
              v-show="!prjBox1"
            >查看运行状态</el-button>
            <el-button
              round
              size="mini"
              type="default"
              @click="viewPrjInfo()"
              class="pull-right"
              slot="btn"
              v-show="prjBox1"
            >
              <span class="fa fa-arrow-left m-r-5"></span>返回
            </el-button>
          </titleStyle>
          <adcdMapPrj
            @tellFatherAdcdChanged="tellFatherAdcdChanged"
            @getPrjNum="getPrjNum"
            :childHeight="top_h-100"
            :adcdCode="userCode"
          />
          <el-row v-show="prjBox1" :gutter="10" class="m-t-10">
            <el-col :span="8">
              <div class="box-three green">
                <div class="img"></div>
                <div class="title m-t-10">
                  {{newInfoValues.greenValue}}
                  <span class="title-label">个</span>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="box-three yellow">
                <div class="img"></div>
                <div class="title m-t-10">
                  {{newInfoValues.yellowValue}}
                  <span class="title-label">个</span>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="box-three red">
                <div class="img"></div>
                <div class="title m-t-10">
                  {{newInfoValues.redValue}}
                  <span class="title-label">个</span>
                </div>
              </div>
            </el-col>
          </el-row>
          <waterQualityChart
            ref="waterQualityChart1"
            v-show="!prjBox1"
            :prjAdcd="prjAdcdSel"
            :type="0"
          />
          <el-row :gutter="10">
            <el-col :span="24">
              <prjCountList :prjAdcd="prjAdcdSel"/>
            </el-col>
          </el-row>
          <!-- <div class="box-three-labels">
            <div class="box-item green">{{newInfoValues.greenValue}}个</div>
            <div class="box-item yellow">{{newInfoValues.yellowValue}}个</div>
            <div class="box-item red">{{newInfoValues.redValue}}个</div>
          </div>-->
        </div>
      </el-col>
      <el-col :span="15">
        <el-col :span="14">
          <div class="homePage-box">
            <titleStyle :title="'水质情况'"></titleStyle>
            <adcdMapWater
              @tellFatherAdcdChanged2="tellFatherAdcdChanged2"
              :childHeight="top_h-140"
              :adcdCode="userCode"
            />
            <waterQualityChart ref="waterQualityChart2" :prjAdcd="prjAdcdSel2" :type="1"/>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="homePage-box">
            <titleStyle :title="'综合情况'"></titleStyle>
            <div :style="paragraghStyle">
              <el-tag size="small" class="m-t-5">概况</el-tag>
              <div class="homepage-paragraf">
                {{sysADNM}}共有
                <span class="warning">{{newInfoValues.PROJECT_COUNT}}</span>座农村供水工程，
                其中，I 型水厂
                <span class="warning">{{newInfoValues.SCALE1}}</span>座，
                II型水厂
                <span class="warning">{{newInfoValues.SCALE2}}</span>座，III 型水厂
                <span class="warning">{{newInfoValues.SCALE3}}</span>座，
                IV型水厂
                <span class="warning">{{newInfoValues.SCALE4}}</span>座，
                V型水厂
                <span class="warning">{{newInfoValues.SCALE5}}</span>座。
                亮绿灯
                <span class="warning">{{newInfoValues.GREEN_COUNT}}</span>座，亮黄灯
                <span class="warning">{{newInfoValues.YELLOW_COUNT}}</span>座，亮红灯
                <span class="warning">{{newInfoValues.RED_COUNT}}</span>座。
                水质检测出厂水合格工程数
                <span
                  class="warning"
                >{{newInfoValues.WATER_QUALITY_COUNT}}</span>座，
                合格率达到
                <span
                  class="warning"
                >{{(newInfoValues.WATER_QUALITY_RATE*100).toFixed(2)}}%</span>；
                当前正常开展水质检测的工程
                <span class="warning">{{newInfoValues.DONE_COUNT}}</span>座，未正常开展水质检测
                <span class="warning">{{newInfoValues.UNDONE_COUNT}}</span>座，合格占比
                <span class="warning">{{(newInfoValues.PROJECT_DONE_RATE*100).toFixed(2)}}%</span>。
              </div>
              <el-tag size="small" class="m-t-5">运行状态</el-tag>
              <div class="homepage-paragraf">
                当前农村供水工程中，停止供水
                <a class="blue" @click="stopWater(0)">{{newInfoValues.stopWater}}</a>座，正在供水
                <a class="blue" @click="stopWater(1)">{{newInfoValues.nowWater}}</a>座；
                水质检测合格数
                <a
                  class="blue"
                  @click="qualifyWater(1)"
                >{{newInfoValues.waterCheckQuality}}</a>座，检测不合格数
                <a
                  class="blue"
                  @click="qualifyWater(0)"
                >{{newInfoValues.waterCheckUnquality}}</a>座。
              </div>
              <el-tag size="small" class="m-t-5">管理动态</el-tag>
              <div class="homepage-paragraf">
                I-III型出厂水水质日常检测：按要求开展数
                <a
                  class="blue"
                  @click="viewManageTable(0)"
                >{{newInfoValues.manageValue1}}</a>座，未按要求开展数
                <a
                  class="blue"
                  @click="viewManageTable(1)"
                >{{newInfoValues.manageValue1Not}}</a>座。
              </div>
              <div class="homepage-paragraf">
                I-III型出厂水水质季度检测：按要求开展数
                <a
                  class="blue"
                  @click="viewManageTable(2)"
                >{{newInfoValues.manageValue2}}</a>座，未按要求开展数
                <a
                  class="blue"
                  @click="viewManageTable(3)"
                >{{newInfoValues.manageValue2Not}}</a>座。
                <br>
              </div>
              <div class="homepage-paragraf">
                IV-V型出厂水水质丰枯水期检测：按要求开展数
                <a
                  class="blue"
                  @click="viewManageTable(4)"
                >{{newInfoValues.manageValue3}}</a>座，未按要求开展数
                <a
                  class="blue"
                  @click="viewManageTable(5)"
                >{{newInfoValues.manageValue3Not}}</a>座。
              </div>
              <el-tag size="small" class="m-t-5">工程隐患</el-tag>
              <div class="homepage-paragraf">
                逾期未治理的工程有
                <a class="blue" @click="viewHideInfo(4)">{{newInfoValues.SUM_OVER_COUNT}}</a>座，待治理的工程
                <a class="blue" @click="viewHideInfo(3)">{{newInfoValues.SUM_WAIT_COUNT}}</a>座，治理中的工程
                <a class="blue" @click="viewHideInfo(2)">{{newInfoValues.SUM_ON_COUNT}}</a>座，已治理工程
                <a class="blue" @click="viewHideInfo(1)">{{newInfoValues.SUM_HAS_COUNT}}</a>座。
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="homePage-box m-t-10">
            <titleStyle :title="'达标统计情况'">
              <el-button-group slot="btn" class="m-l-10">
                <el-button size="mini" :type="btn1Class" @click="tabBtnSel(0)">统计图</el-button>
                <el-button size="mini" :type="btn2Class" @click="tabBtnSel(1)">统计表</el-button>
              </el-button-group>
            </titleStyle>
            <lineBarChart
              :style="{'height':this.bottom_h-102+'px'}"
              :lineBarData="lineBarData"
              v-show="lineBarIf"
              class="m-t-5"
              ref="TJLineBar"
            />
            <homeTable
              :tableHeight="this.bottom_h-102"
              :tableInsertData="homeTableData"
              v-show="!lineBarIf"
              ref="homeTable"
              class="m-t-5"
              style="width:100%"
            />
            <!-- <el-tabs
              :tab-position="'top'"
              v-model="activeName"
              @tab-click="tabHandle"
              style="margin-bottom:0"
            >
              <el-tab-pane label="统计图" name="tjt">
                <lineBarChart
                  :style="{'height':this.bottom_h-100+'px'}"
                  :lineBarData="lineBarData"
                  ref="TJLineBar"
                />
              </el-tab-pane>
              <el-tab-pane label="统计表" name="tjb">
                <homeTable
                  :tableHeight="this.bottom_h-100"
                  :tableInsertData="homeTableData"
                  ref="homeTable"
                  style="width:100%"
                />
              </el-tab-pane>
            </el-tabs>-->
          </div>
        </el-col>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="10" class="m-t-10">
      <el-col :span="6">
        <div class="homePage-box">
          <titleStyle :title="'近一个月水质合格情况'"></titleStyle>
          <pieChart
            :style="{'height':this.bottom_h+'px'}"
            style="width:100%"
            ref="leftPie"
            :pieData="leftPieData"
          />
        </div>
      </el-col>
      <el-col :span="6">
        <div class="homePage-box">
          <titleStyle :title="'当前水质检测开展情况'"></titleStyle>
          <pieChart
            :style="{'height':this.bottom_h+'px'}"
            style="width:100%"
            ref="rightPie"
            :pieData="rightPieData"
          />
        </div>
      </el-col>
    </el-row>-->
    <!-- 停止供水的弹窗 -->
    <el-dialog
      title="停止供水详情"
      :visible.sync="dialogVisable1"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <span slot="title">{{stopWaterInfo.resultType?'正在供水':'停止供水'}}工程列表</span>
      <stopWater :stopWaterInfo="stopWaterInfo" ref="stopWaterTable"/>
    </el-dialog>
    <!-- 管理动态 -->
    <el-dialog
      title
      :visible.sync="dialogVisable2"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <span slot="title">{{manageInfo.title}}工程列表</span>
      <waterCheckTable :manageInfo="manageInfo" ref="manageTable"/>
    </el-dialog>
    <!-- 查看水质检测合格数的弹窗 -->
    <el-dialog
      :visible.sync="dialogVisable3"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :width="'70%'"
    >
      <span slot="title">{{qulifiedInfo.resultType?'合格':'不合格'}}工程列表</span>
      <qualifiedInfo :info="qulifiedInfo" ref="qualifyDia"/>
    </el-dialog>
    <!-- 查看隐患列表的弹窗 -->
    <el-dialog
      :visible.sync="dialogVisable4"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :width="'70%'"
    >
      <span slot="title">隐患{{hideDangerInfo.title}}</span>
      <!-- <hideDanger :dangerInfo="hideDangerInfo" ref="hideDangerDia"/> -->
      <prjDangerLists :dangerInfo="hideDangerInfo" ref="hideDangerDia"/>
    </el-dialog>
    <!-- 查看亮灯规则的弹窗 -->
    <el-dialog
      :visible.sync="dialogVisable5"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :width="'1200px'"
    >
      <span slot="title">查看亮灯规则</span>
      <lightingRule/>
    </el-dialog>
  </div>
</template>

<script>
import titleStyle from "@/components/Title/index"; //标题栏组件
import adcdMapPrj from "./components/adcdMapPrj"; //工程运行状态地图
import adcdMapWater from "./components/adcdMapWater"; //水质情况地图
import pieChart from "./components/pieChart"; //饼图组件
import lineBarChart from "./components/lineBarChart"; //柱状图组件
import homeTable from "./components/homeTable"; //表格组件
import stopWater from "./components/stopWater"; //供水弹窗的内容
import qualifiedInfo from "./components/qualifiedInfo"; //水质检测合格与不合格
//import hideDanger from "./components/hideDanger"; //隐患列表
import prjDangerLists from "./components/prjDangerLists"; //隐患列表展示
import waterCheckTable from "./components/waterCheckTable"; //开展水质检测工程列表
import { getUserInfo } from "@/utils/auth"; //获取userInfo
import request from "@/utils/requestDC"; //http请求
import prjCountList from "./components/prjCountList";
import waterQualityChart from "./components/waterQualityChart";
import lightingRule from "./components/lightingRule"; //亮灯规则表格

export default {
  name: "homePage",
  components: {
    titleStyle,
    adcdMapPrj,
    adcdMapWater,
    pieChart,
    lineBarChart,
    homeTable,
    stopWater,
    qualifiedInfo,
    //hideDanger,
    waterCheckTable,
    prjDangerLists,
    prjCountList,
    waterQualityChart,
    lightingRule
  },
  props: {},
  data() {
    const userInfos = getUserInfo();
    return {
      userCode: 33,
      sysADNM: userInfos.ADMIN_DIV_NAME,
      prjAdcdSel: userInfos.ADCD,
      prjAdcdSel2: userInfos.ADCD,
      leftPieData: {
        twoName: ["合格", "不合格"],
        name: "水质合格情况",
        data: [{ name: "合格", value: 0 }, { name: "不合格", value: 0 }]
      },
      rightPieData: {
        twoName: ["正常检测", "非正常检测"],
        name: "水质检测开展情况",
        data: [{ name: "正常检测", value: 0 }, { name: "非正常检测", value: 0 }]
      },
      activeName: "tjt", //默认统计图
      lineBarData: {},
      dialogVisable1: false, //停止供水弹窗显示与否
      dialogVisable2: false, //正在供水弹窗显示与否
      dialogVisable3: false, //合格弹窗显示
      dialogVisable4: false, //隐患处理弹窗
      dialogVisable5: false, //亮灯规则弹窗
      qulifiedInfo: { resultType: 0 }, //resultType代表合格与不合格的区别，1是合格，0是不合格
      hideDangerInfo: { title: "", dangerType: 0 }, //隐患处理信息
      stopWaterInfo: { resultType: 0 }, //正在供水停止供水prop
      waterCheckData: { resultType: 0 }, //水质监测合格与不合格
      manageInfo: { title: "", resultType: 0 }, //管理动态传入prop
      homeTableData: {}, //表格传入数据
      top_h: "", //顶部地图高度
      bottom_h: "", //底部饼图等高度
      paragraghStyle: { overflowY: "auto", height: "" },
      userAdcd: userInfos.ADCD,
      prjBox1: false, //工程运行状态下方的柱状图
      lineBarIf: true, //默认显示统计图
      btn1Class: "primary",
      btn2Class: "default",
      newInfoValues: {
        waterCheckQuality: 0, //当前水质合格数
        waterCheckUnquality: 0, //当前水质不合格数
        SUM_OVER_COUNT: 0, //当前逾期未治理工程数
        SUM_WAIT_COUNT: 0, //当前待治理的工程数
        SUM_ON_COUNT: 0, //当前治理中的工程数
        SUM_HAS_COUNT: 0, //当前已治理的工程数
        stopWater: 0,
        nowWater: 0, //停止供水正在供水数量
        manageValue1: 0,
        manageValue1Not: 0,
        manageValue2: 0,
        manageValue2Not: 0,
        manageValue3: 0,
        manageValue3Not: 0, //管理动态的六个数字
        greenValue: 0,
        yellowValue: 0,
        redValue: 0, //红绿灯个数
        PROJECT_COUNT: 0,
        SCALE1: 0,
        SCALE2: 0,
        SCALE3: 0,
        SCALE4: 0,
        SCALE5: 0,
        SCALE_NULL: 0,
        RED_COUNT: 0,
        YELLOW_COUNT: 0,
        GREEN_COUNT: 0,
        WATER_QUALITY_COUNT: 0,
        WATER_QUALITY_RATE: 0,
        DONE_COUNT: 0,
        UNDONE_COUNT: 0,
        PROJECT_DONE_RATE: 0 //综合信息的统计数字从上到下对应相应的文本
      } //简报的统计数字存在这里
    };
  },
  watch: {},
  computed: {},
  methods: {
    //定时刷新
    setTimeReload(){
       setInterval(_=>{
          location.reload();
       },300000);//五分钟刷新一次
    },
    //切换达标统计情况
    tabBtnSel(type) {
      if (!type) {
        this.lineBarIf = true;
        this.btn1Class = "primary";
        this.btn2Class = "default";
      } else {
        this.lineBarIf = false;
        this.btn1Class = "default";
        this.btn2Class = "primary";
      }
    },
    //点击查看亮灯规则弹窗
    viewLightingRule() {
      this.dialogVisable5 = true;
    },
    //点击工程运行状态的按钮
    viewPrjInfo() {
      this.prjBox1 = !this.prjBox1; //
    },
    //tab切换事件
    tabHandle() {
      console.log(this.activeName);
    },
    //点击停止供水或正在供水的数字显示弹窗
    stopWater(type) {
      this.dialogVisable1 = true;
      this.stopWaterInfo.resultType = type;
      this.$nextTick(_ => {
        this.$refs.stopWaterTable.initPage(); //初始化分页
        this.$refs.stopWaterTable.refleshThreeTrash(); //刷新三级联动
        this.$refs.stopWaterTable.getTableData();
      });
    },
    //管理动态弹窗
    viewManageTable(type) {
      switch (type) {
        case 0:
        case 2:
        case 4:
          this.manageInfo.title = "按要求开展";
          break;
        case 1:
        case 3:
        case 5:
          this.manageInfo.title = "未按要求开展";
          break;
        default:
          break;
      }
      this.dialogVisable2 = true;
      this.manageInfo.resultType = type;
      this.$nextTick(_ => {
        this.$refs.manageTable.refleshThreeTrash();
        this.$refs.manageTable.initPage(); //重置table页码等内容
        this.$refs.manageTable.getPrjLists();
      });
    },
    //点击合格数
    qualifyWater(type) {
      this.qulifiedInfo.resultType = type;
      this.dialogVisable3 = true;
      this.$nextTick(_ => {
        this.$refs.qualifyDia.initPage(); //初始化一下pag
        this.$refs.qualifyDia.refleshThreeTrash(); //先刷新adcd
        this.$refs.qualifyDia.getTableData();
      });
    },
    //点击工程隐患
    viewHideInfo(type) {
      /* type代表四个类型,0逾期，1待治理，2治理中，3已治理 */
      switch (type) {
        case 4:
          this.hideDangerInfo.title = "逾期未治理工程列表";
          break;
        case 2:
          this.hideDangerInfo.title = "治理中工程列表";
          break;
        case 3:
          this.hideDangerInfo.title = "待治理工程列表";
          break;
        case 1:
          this.hideDangerInfo.title = "已治理工程列表";
          break;
        default:
          break;
      }
      this.hideDangerInfo.dangerType = String(type);
      this.dialogVisable4 = true;
      this.$nextTick(_ => {
        this.$refs.hideDangerDia.initPage(); //刷新pag
        this.$refs.hideDangerDia.refleshThreeTrash(); //先刷新adcd
        this.$refs.hideDangerDia.getPrjLists(); //加载表格数据
      });
    },
    //获取近一个月水质合格情况
    getNearlyMonthWaterQuality() {
      request({
        url: "SuperviseIndex/ListWaterQualityMonthCountInfo",
        method: "post",
        data: {
          adcd: this.userAdcd
        }
      }).then(({ message }) => {
        console.log(message);
        //计算水质合格与不合格的个数统计
        //leftPieData数据修改
        this.leftPieData.data = [
          { name: "合格", value: message.SUM_NORMAL_PROJECT },
          { name: "不合格", value: message.SUM_ABNOMAL_PROJECT }
        ];
        this.$refs.leftPie.renderChart();
      });
    },
    //获取当前水质检测开展情况
    getNowCheckCount() {
      request({
        url: "SuperviseIndex/ListWaterQualityUndoneCountInfo",
        method: "post",
        data: {
          adcd: this.userAdcd
        }
      }).then(({ message }) => {
        console.log(message);
        //leftPieData数据修改
        this.rightPieData.data = [
          { name: "正常检测", value: message.SUM_NORMAL_PROJECT },
          { name: "非正常检测", value: message.SUM_ABNOMAL_PROJECT }
        ];
        this.$refs.rightPie.renderChart();
      });
    },
    //实时水质合格情况
    getNowWaterQuality() {
      request({
        url: "SuperviseRunStatue/ListWaterQualityCount",
        method: "post",
        data: {
          adcd: this.userAdcd
        }
      }).then(({ message }) => {
        //this.newInfoValues.waterCheckQuality=message.
        /* console.log(message);
        let quality = 0;
        let unQuality = 0;
        for (let obj of message) {
          if (obj.PROJECTS_UNFAIL) {
            quality += obj.PROJECTS_UNFAIL;
          } else {
            obj.PROJECTS_UNFAIL = 0; //null情况下赋值为0
          }
          if (obj.PROJECTS_FAIL) {
            unQuality += obj.PROJECTS_FAIL;
          } else {
            obj.PROJECTS_FAIL = 0;
          }
        } */
        this.newInfoValues.waterCheckQuality = message[1];
        this.newInfoValues.waterCheckUnquality = message[0];
      });
    },
    //查询工程隐患统计信息
    getListDangerProjectCount() {
      request({
        url: "SuperviseIndex/ListDangerProjectCountInfo",
        method: "post",
        data: {
          adcd: this.userAdcd
        }
      }).then(({ message }) => {
        for (let key in message) {
          this.newInfoValues[key] = message[key];
        }
        /* this.newInfoValues.SUM_OVER_COUNT = message.SUM_OVER_COUNT;
        this.newInfoValues.SUM_WAIT_COUNT = message.SUM_WAIT_COUNT;
        this.newInfoValues.SUM_ON_COUNT = message.SUM_ON_COUNT;
        this.newInfoValues.SUM_HAS_COUNT = message.SUM_HAS_COUNT; */
      });
    },
    //查询正在供水，停止供水统计信息
    getStopWaterCount() {
      request({
        url: "SuperviseRunStatue/ListWaterSupplyCount",
        method: "post",
        data: {
          ADCD: this.userAdcd
        }
      }).then(({ message }) => {
        this.newInfoValues.stopWater = message[0];
        this.newInfoValues.nowWater = message[1];
      });
    },
    //查询管理动态通用promise
    getManageInfo(url) {
      return new Promise((resolve, reject) => {
        request({
          url: url,
          method: "post",
          data: {
            ADCD: this.userAdcd
          }
        })
          .then(({ message }) => {
            resolve(message);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async getManageCount() {
      let ItoIIIDaily = [];
      let ItoIIIMonth = [];
      let IIIItoV = [];
      try {
        ItoIIIDaily = await this.getManageInfo(
          "SuperviseRunStatue/ListWaterQualityReachCount"
        );
      } catch (error) {}
      try {
        ItoIIIMonth = await this.getManageInfo(
          "SuperviseRunStatue/ListWaterQuarterQualityReachCount"
        );
      } catch (error) {}
      try {
        IIIItoV = await this.getManageInfo(
          "SuperviseRunStatue/ListManageWaterDryCount"
        );
      } catch (error) {}
      //阻塞式查询结束后存储统计信息
      this.newInfoValues.manageValue1Not = ItoIIIDaily[0];
      this.newInfoValues.manageValue1 = ItoIIIDaily[1];
      this.newInfoValues.manageValue2Not = ItoIIIMonth[0];
      this.newInfoValues.manageValue2 = ItoIIIMonth[1];
      this.newInfoValues.manageValue3Not = IIIItoV[0];
      this.newInfoValues.manageValue3 = IIIItoV[1];
    },
    //查询达标统计情况
    getStandardCount() {
      this.TJLoading = true;
      request({
        url: "SuperviseIndex/StandardSituationStatistic",
        method: "post",
        data: {
          adcd: this.userAdcd
        }
      })
        .then(({ message }) => {
          console.log(message);
          this.lineBarData = message; //prop传值修改
          this.homeTableData = message; //表格prop传值
          this.$nextTick(_ => {
            this.$refs.TJLineBar.dealChartData();
            this.$refs.homeTable.calTableData();
            this.$refs.TJLineBar.loading = false;
          });
        })
        .catch(error => {});
    },
    //获取红绿灯个数
    getPrjNum(array) {
      this.newInfoValues.redValue = array[0];
      this.newInfoValues.yellowValue = array[1];
      this.newInfoValues.greenValue = array[2];
    },
    //工程状态点击后传回新的adcd，父组件接收
    tellFatherAdcdChanged(adcd) {
      //debugger;
      this.prjAdcdSel = adcd;
      this.$nextTick(_ => {
        this.$refs.waterQualityChart1.findGCFB(); //刷新数据
      });
    },
    //水质地图点击后传回adcd
    tellFatherAdcdChanged2(adcd) {
      //debugger;
      this.prjAdcdSel2 = adcd;
      //debugger
      this.$nextTick(_ => {
        this.$refs.waterQualityChart2.getQualityPrjLists(); //刷新数据
      });
    },
    //获取综合情况
    getMultyInfo() {
      request({
        url: "SuperviseProjectInfo/GetProvinceProjectStatistics",
        method: "post",
        data: {}
      }).then(({ message }) => {
        for (let key in message) {
          this.newInfoValues[key] = message[key]; //遍历赋值
        }
        console.log(this.newInfoValues);
      });
    }
  },
  created() {
    //先计算一下屏幕的高度，平均的赋值给上下容器
    const _W = window.innerHeight - 70;
    this.top_h = _W - 280; //地图的高度计算
    /* const TOP_H = Number(((_W * 20) / 33).toFixed(1));
    const BOTTOM_H = Number(((_W * 13) / 33).toFixed(1));
    this.top_h = TOP_H;
    this.bottom_h = BOTTOM_H; */
    this.paragraghStyle.height = _W - 255 + "px"; //综合情况的高度
    this.bottom_h = 250;
    //this.getNearlyMonthWaterQuality(); //获取近一个月水质合格情况
    //this.getNowCheckCount(); //当前水质检测开展情况
    this.getNowWaterQuality(); //查询当前的实时水质数据，用来绑定简报及地图
    this.getListDangerProjectCount(); //查询当前的工程隐患情况
    this.getStopWaterCount(); //查询停止供水正在供水情况
    this.getManageCount(); //查询管理动态的统计数字
    this.getStandardCount(); //查询达标统计情况
    this.getMultyInfo(); //查询综合信息统计
    this.setTimeReload();//定时刷新
  },
  mounted() {
    console.log(getUserInfo());
  }
};
</script>
<style lang="less" scoped>
.homePage-container {
  padding: 10px;
  font-family: "microsoft yahei";
}
.viewLightBtn {
  position: absolute;
  left: 130px;
  top: 10px;
}
.homePage-box {
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 10px;
  background: #fff;
  position: relative;
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
      background: #ff9900;
    }
    &.red {
      background: #ff000d;
    }
  }
}
.box-three {
  background: #f5f5f5;
  border-radius: 3px;
  padding: 10px;
  &.green {
    .img {
      background: url("../../assets/green.png");
      height: 51px;
      width: 38px;
      margin: 0 auto;
      background-size: 100% 100%;
    }
    .title {
      color: #4dd29b;
      font-size: 16px;
      text-align: center;
      font-weight: 600;
    }
  }
  &.yellow {
    .img {
      background: url("../../assets/yellow.png");
      height: 51px;
      width: 38px;
      margin: 0 auto;
      background-size: 100% 100%;
    }
    .title {
      color: #ffd000;
      font-size: 16px;
      text-align: center;
      font-weight: 600;
    }
  }
  &.red {
    .img {
      background: url("../../assets/red.png");
      height: 51px;
      width: 38px;
      margin: 0 auto;
      background-size: 100% 100%;
    }
    .title {
      color: #ff0000;
      font-size: 16px;
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
.dialogAdcd {
  width: 200px;
  margin-bottom: 10px;
}
.newTitle{
  font-size: 14px;
  border-bottom: 1px dashed #ddd;
  line-height: 32px;
  margin: 0;
}
</style>
