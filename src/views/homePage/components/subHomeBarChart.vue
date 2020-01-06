<template>
  <div class="lineBarChart" ref="lineBarChart"></div>
</template>

<script>
//import echarts from "echarts";
import request from "@/utils/requestDC";
export default {
  name: "subHomeBarChart",
  components: {},
  props: {
    tabStatus: {
      type: Number,
      default: 0 //年份查询还是按月份查询
    }
  },
  data() {
    const thisYear = this.$moment().format("YYYY");
    const thisMonth = this.$moment().format("MM");
    return {
      chart: null,
      option: {},
      indexInfo: {
        nowYear: thisYear,
        nowMonth: thisMonth
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    renderChart(aXis, Average, monthValues) {
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
          }
        },
        color: [
          "#2d7af3",
          "#ff0000",
          "#ff000d",
          "#6c87d0",
          "#ff9602",
          "#3156ba"
        ],
        grid: {
          //调整目标区域填充
          left: 50,
          right: "1%",
          top: 30,
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
          data: ["月供水量", "月平均供水量"]
        },
        xAxis: [
          {
            type: "category",
            data: aXis,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "月供水量(万m³)",
            nameLocation: "end",
            nameGap: 10,
            nameTextStyle: {
              color: "#333",
              fontSize: "12px"
            },
            min: 0,
            max: "dataMax",
            //interval: 50,
            axisLabel: {
              formatter: function(value, index) {
                return value.toFixed(0);
              }
            }
          }
        ],
        series: [
          {
            name: "月供水量",
            type: "bar",
            yAxisIndex: 0,
            data: Average,
            itemStyle: {
              normal: {
                barBorderRadius: [30,30,0,0]
              }
            },
            barMaxWidth:30,
          },
          {
            name: "月平均供水量",
            type: "line",
            lineStyle: {
              type: "dotted"
            },
            symbolSize: [2, 2],
            yAxisIndex: 0,
            data: monthValues
          }
        ]
      };
      this.chart.setOption(this.option); //完成渲染
    },
    //查询年度供水情况
    getListWaterSupplyInfoByYear() {
      let Average = [];
      let aXis = [];
      let monthValues = [];
      let requestObj = {};
      //debugger
      if (!this.tabStatus) {
        requestObj = {
          url: "Index/ListWaterSupplyInfoByYear",
          method: "post",
          data: {
            time: this.indexInfo.nowYear,
            month: this.indexInfo.nowMonth
          }
        };
      } else {
        requestObj = {
          url: "Index/ListWaterSupplyInfoByTime",
          method: "post",
          data: {
            time: this.$moment().format("YYYY-MM-DD")
          }
        };
      }
      request(requestObj).then(({ message }) => {
        for (let obj of message.TABLE) {
          aXis.push(obj.Key);
          Average.push(obj.Value);
          monthValues.push(message.AVG_SUPPLY_QUANTITY);
        }
        //debugger
        this.renderChart(aXis, Average, monthValues);
      });
    }
  },
  created() {},
  mounted() {
    this.chart = this.$echarts.init(this.$refs.lineBarChart); //初始化
    this.$nextTick(_ => {
      this.getListWaterSupplyInfoByYear();
    });
    /*     this.chart = echarts.init(this.$refs.lineBarChart); //初始化
    this.renderChart(this.lineBarData); */
  }
};
</script>
<style lang="less" scoped>
</style>