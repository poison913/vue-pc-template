<template>
  <div class="lineBarChart" v-loading="loading" ref="lineBarChart" style="width:100%"></div>
</template>

<script>
//import echarts from "echarts";
import { getUserInfo } from "@/utils/auth";
export default {
  name: "lineBarChart",
  components: {},
  props: {
    lineBarData: {
      type: Object,
      default: {}
    }
  },
  data() {
    const userInfos = getUserInfo();
    return {
      chart: null,
      option: {},
      adcdName: userInfos.ADMIN_DIV_NAME,
      loading: false
    };
  },
  watch: {},
  computed: {},
  methods: {
    renderChart(
      xAxis,
      RKFGLAverage,
      GSBZLAverage,
      SZDBLAverage,
      RKFGL,
      GSBZL,
      SZDBL
    ) {
      this.option = {
        tooltip: {
          position: function(point, params, dom, rect, size) {
            return { right: "20px", top: "20px" };
          },
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          },
          textStyle:{
             fontSize:12
          },
          formatter: params => {
            //debugger;
            let tooltipDom = params[0].axisValue +
                "：<br>";
            params.map((obj, index) => {
              tooltipDom +=
                params[index].seriesName +
                ":" +
                params[index].value +
                "%<br>";
            });
            return (
              tooltipDom
            );
          }
        },
        color: [
          "#6c87d0",
          "#4dd29b",
          "#ff000d",
          "#6c87d0",
          "#ff9602",
          "#3156ba"
        ],
        grid: {
          //调整目标区域填充
          left: "40px",
          right: "5px",
          top: "10px",
          bottom: "40px"
        },
        toolbox: {
          feature: {
            dataView: { show: false, readOnly: false },
            magicType: { show: false, type: ["line", "bar"] },
            restore: { show: false },
            saveAsImage: { show: false }
          }
        },
        legend: {
          bottom: 0,
          x: "center",
          data: [
            this.adcdName + "达标人口覆盖率",
            this.adcdName + "供水保证率",
            this.adcdName + "水质达标率",
            "达标人口覆盖率",
            "水质达标率",
            "供水保证率"
          ],
          itemGap: 5,
          itemWidth: 10,
          itemHeight: 5
        },
        xAxis: [
          {
            type: "category",
            data: xAxis,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            min: 0,
            max: 100,
            interval: 50,
            axisLabel: {
              formatter: "{value} %"
            }
          }
        ],
        series: [
          {
            name: this.adcdName + "达标人口覆盖率",
            type: "line",
            lineStyle: {
              type: "dotted"
            },
            symbolSize: [0, 0],
            yAxisIndex: 0,
            data: RKFGLAverage
          },
          {
            name: this.adcdName + "供水保证率",
            type: "line",
            lineStyle: {
              type: "dotted"
            },
            symbolSize: [0, 0],
            yAxisIndex: 0,
            data: GSBZLAverage
          },
          {
            name: this.adcdName + "水质达标率",
            type: "line",
            lineStyle: {
              type: "dotted"
            },
            symbolSize: [0, 0],
            yAxisIndex: 0,
            data: SZDBLAverage
          },
          {
            name: "达标人口覆盖率",
            type: "bar",
            yAxisIndex: 0,
            data: RKFGL,
            itemStyle: {
              normal: {
                barBorderRadius: [30, 30, 0, 0]
              }
            },
            barMaxWidth: 30
          },
          {
            name: "水质达标率",
            type: "bar",
            yAxisIndex: 0,
            data: SZDBL,
            itemStyle: {
              normal: {
                barBorderRadius: [30, 30, 0, 0]
              }
            },
            barMaxWidth: 30
          },
          {
            name: "供水保证率",
            type: "bar",
            yAxisIndex: 0,
            data: GSBZL,
            itemStyle: {
              normal: {
                barBorderRadius: [30, 30, 0, 0]
              }
            },
            barMaxWidth: 30
          }
        ]
      };
      this.chart.setOption(this.option); //完成渲染
    },
    dealChartData() {
      let xAxis = [];
      let RKFGLAverage = [];
      let GSBZLAverage = [];
      let SZDBLAverage = [];
      let RKFGL = [];
      let GSBZL = [];
      let SZDBL = [];
      for (let obj of this.lineBarData.LISTADMINDIV) {
        xAxis.push(obj.ADMIN_DIV_NAME);
        RKFGLAverage.push(this.lineBarData.AVG_POPULATION_STANDARD_RATE);
        GSBZLAverage.push(this.lineBarData.AVG_SUPPLY_STANDARD_RATE);
        SZDBLAverage.push(this.lineBarData.AVG_WQ_STANDARD_RATE);
        RKFGL.push(obj.POPULATION_STANDARD_RATE);
        GSBZL.push(obj.SUPPLY_STANDARD_RATE);
        SZDBL.push(obj.WQ_STANDARD_RATE);
      }
      this.renderChart(
        xAxis,
        RKFGLAverage,
        GSBZLAverage,
        SZDBLAverage,
        RKFGL,
        GSBZL,
        SZDBL
      ); //渲染地图
    }
  },
  created() {
    //this.loading = true;
  },
  mounted() {
    /* setTimeout(() => {
      //this.renderChart(this.lineBarData);
    }, 200); */
    this.$nextTick(_ => {
      this.loading = true;
      this.chart = this.$echarts.init(this.$refs.lineBarChart); //初始化
      //this.dealChartData();
    });
    /*     this.chart = echarts.init(this.$refs.lineBarChart); //初始化
    this.renderChart(this.lineBarData); */
  }
};
</script>
<style lang="less" scoped>
</style>