<template>
  <div :style="{width:'100%'}" class="pieChart" ref="pieMoreChart"></div>
</template>

<script>
//import echarts from "echarts";
import request from "@/utils/requestDC"; //http请求
export default {
  name: "supHomePieMore",
  components: {},
  props: {
    pieData: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chart: null,
      option: {},
      chartData: {}
    };
  },
  watch: {},
  computed: {},
  methods: {
    renderChart(data) {
      this.option = {
        title:{
            show:true,
            text:data.name,
            left:'center',
            top:'center',
            textStyle:{
              color:'#ffffff',
              fontWeight:600,
              fontSize:14,
            }
        },
        color: ["#2d7af3", "#ff7308", "#ff0000", "#0b5196"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          position: function(point, params, dom, rect, size) {
            return [point[0], point[1]];
          }
        },
        legend: {
          show: true,
          orient: "horizontal",
          left: "center",
          textStyle:{
              color:'#ffffff',
            },
          top:'bottom'
        },
        series: [
          {
            name: data.name,
            type: "pie",
            radius: ["35%", "65%"],
            labelLine: {
              length: 8,
              length2: 8
            },
            label: {
              normal: {
                position: "outside",
                formatter: function(params) {
                  return (
                    params.name +
                    ",\n" +
                    params.percent.toFixed(1) +
                    "%\n" +
                    params.value +
                    "个"
                  );
                }
              }
            },
            data: data.data1
          }
        ]
      };
      this.chart.setOption(this.option); //完成渲染
    },
    //获取实时消毒情况
    getRealXDFCCount() {
      let url = "";
      if (!this.pieData) {
        url = "RunStatue/ListWaterDisinfectionCount"; //消毒
      } else {
        url = "RunStatue/ListWaterBackwashCount"; //反冲
      }
      request({
        url: url,
        method: "post",
        data: {}
      }).then(({ message }) => {
        if (!this.pieData) {
          this.chartData = {
            name: "消毒设备",
            data1: [
              { name: "正常", value: message[1] },
              { name: "异常", value: message[0] }
            ]
          };
        } else {
          this.chartData = {
            name: "反冲设备",
            data1: [
              { name: "正常", value: message[1] },
              { name: "异常", value: message[0] }
            ]
          };
        }
        this.renderChart(this.chartData);
      });
    }
  },
  created() {},
  mounted() {
    this.chart = this.$echarts.init(this.$refs.pieMoreChart); //初始化
    this.$nextTick(_ => {
      this.getRealXDFCCount();
    });
  }
};
</script>
<style lang="less" scoped>
</style>