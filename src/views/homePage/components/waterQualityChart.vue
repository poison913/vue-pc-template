/*作者: 陈凯歌 
开发日期: 2019-04-15 
页面描述： 首页水质情况下方的柱状图  
修改人员：****  修改日期：****  */

<template>
  <el-row :gutter="10">
    <el-col :span="24">
      <h4 class="newTitle">
        {{title}}
        <span class="pull-right">单位：个</span>
      </h4>
      <div v-show="chartShow" v-loading="loading" ref="BarChart" style="width:100%;height:90px"></div>
      <div v-show="!chartShow" class="chartNoData">
        <i class="fa fa-info-circle"></i>暂无数据
      </div>
    </el-col>
  </el-row>
</template>

<script>
import request from "@/utils/requestDC"; //http请求
export default {
  name: "waterQualityChart",
  data() {
    return {
      adcd: "",
      title: "",
      loading: false,
      chartShow: true
    };
  },
  props: {
    prjAdcd: {
      type: String,
      default: null
    },
    type: {
      type: Number,
      default: null
    }
  },

  components: {},

  created() {},

  mounted() {
    this.$nextTick(_ => {
      //console.log(this.prjAdcd);
      this.chart = this.$echarts.init(this.$refs.BarChart); //初始化
      this.httpType(this.prjAdcd);
    });
  },

  methods: {
    httpType(adcd) {
      this.loading = true;
      if (this.type === 0) {
        //查询工程分布
        this.findGCFB();
      } else {
        this.getQualityPrjLists();
      }
    },
    //获取合格工程分布
    getQualityPrjLists() {
      //console.log(this.prjAdcd2);
      request({
        url: "SuperWaterQuality/GetProvinceSupplyStatisticsCorrect",
        method: "post",
        data: {
          adcd: this.prjAdcd
        }
      })
        .then(({ message }) => {
          this.loading = false;
          this.title = message.ADMIN_DIV_NAME + "水质合格的工程分布";
          let chartData = [
            message.SUPPLY_CITY,
            message.SUPPLY_TOWN,
            message.SUPPLY_MUTIVILLAGE,
            message.SUPPLY_SINGLEVILLAGE
          ];
          //console.log(chartData);
          let allIsNull = true;
          for (let key in chartData) {
            if (chartData[key]) {
              allIsNull = false;
            }
          }
          if (!allIsNull) {
            this.chartShow = true;
            this.renderChart(chartData); //数组都不为Null
          } else {
            this.chartShow = false;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //获取工程列表
    findGCFB() {
      request({
        url: "SuperWaterQuality/GetProvinceSupplyStatistics",
        method: "post",
        data: {
          adcd: this.prjAdcd
        }
      })
        .then(({ message }) => {
          this.loading = false;
          this.title = message.ADMIN_DIV_NAME + "工程分布";
          let chartData = [
            message.SUPPLY_CITY,
            message.SUPPLY_TOWN,
            message.SUPPLY_MUTIVILLAGE,
            message.SUPPLY_SINGLEVILLAGE
          ];
          this.renderChart(chartData);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    renderChart(data) {
      this.option = {
        grid: {
          //调整目标区域填充
          left: "30px",
          right: "20px",
          top: "20px",
          bottom: "20px"
        },
        color: [
          "#6c87d0",
          "#4dd29b",
          "#ff000d",
          "#6c87d0",
          "#ff9602",
          "#3156ba"
        ],
        xAxis: {
          type: "category",
          data: ["城镇管网延伸", "乡镇", "联村", "单村"]
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          splitLine: {
            show: false
          }
        },
        series: [
          {
            data: data,
            type: "bar",
            barMaxWidth: 30,
            itemStyle: {
              normal: {
                barBorderRadius: [30, 30, 0, 0]
              }
            },
            label: {
              show: true
            }
          }
        ]
      };
      this.chart.setOption(this.option); //完成渲染
    }
  }
};
</script>
<style lang='less' scoped>
.newTitle {
  font-size: 14px;
  border-bottom: 1px dashed #ddd;
  line-height: 32px;
  margin: 0;
}
.chartNoData {
  height: 100px;
  text-align: center;
  line-height: 100px;
  color:rgb(94, 119, 167);
}
</style>