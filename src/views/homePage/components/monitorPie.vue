<template>
  <div :style="{width:'100%'}" class="pieChart" ref="pieChart"></div>
</template>

<script>
//import echarts from "echarts";
import request from "@/utils/requestDC"; //http请求
export default {
  name: "monitorPie",
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
      option: {}
    };
  },
  watch: {},
  computed: {},
  methods: {
    renderChart(data) {
      this.option = {
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        title: {
          show: true,
          text: data.name,
          right: 0,
          top: "center",
          textStyle: {
            color: "#333",
            fontWeight: 600,
            fontSize: 14,
            lineHeight: 22
          },
          backgroundColor: "#f1f1f1",
          borderRadius: 3,
          padding: 10
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ["#2d7af3", "#ff7308"],
        legend: {
          show: true,
          orient: "horizontal",
          bottom: 0,
          x: "center"
        },
        series: [
          {
            name: data.name,
            type: "pie",
            radius: ["20%", "65%"],
            label: {
              normal: {
                formatter: function(params) {
                  return (
                    params.name +
                    ",\n" +
                    params.percent.toFixed(1) +
                    "%\n" +
                    params.value +
                    "个"
                  );
                },
                //backgroundColor: "rgba(0,0,0,.5)",
                //borderColor: "#fff",
                //borderWidth: 1,
                //borderRadius: 4,
                fontSize: 12,
                position: "outer",
                // shadowBlur:3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: '#999',
                padding: [0, 7],
                rich: {
                  a: {
                    color: "#fff",
                    lineHeight: 22,
                    align: "center"
                  },
                  // abg: {
                  //     backgroundColor: '#333',
                  //     width: '100%',
                  //     align: 'right',
                  //     height: 22,
                  //     borderRadius: [4, 4, 0, 0]
                  // },
                  hr: {
                    borderColor: "#fff",
                    width: "100%",
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 12,
                    lineHeight: 22
                  },
                  per: {
                    color: "#eee",
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            labelLine: {
              length: 5,
              length2: 5
            },
            data: data.data
          }
        ]
      };
      this.chart.setOption(this.option); //完成渲染
    },
    getMonitorCount() {
      request({
        url: "Index/GetManagementUnitEquipmentRunStateStat",
        method: "post",
        data: {}
      }).then(({ message }) => {
        let leftPieData = {
          twoName: ["正常", "异常"],
          name: "RTU设备\n共" + message.RtuTotalCount + "套",
          data: [
            { name: "正常", value: message.RtuNormakCount },
            { name: "异常", value: message.RtuAbNormakCount }
          ]
        };
        let rightPieData = {
          twoName: ["正常", "异常"],
          name: "水质设备\n共" + message.WqTotalCount + "套",
          data: [
            { name: "正常", value: message.WqNormakCount },
            { name: "异常", value: message.WqAbNormakCount }
          ]
        };
        if (!this.pieData) {
          this.renderChart(leftPieData);
        } else {
          this.renderChart(rightPieData);
        }
      });
    }
  },
  created() {},
  mounted() {
    this.chart = this.$echarts.init(this.$refs.pieChart); //初始化
    this.$nextTick(_ => {
      this.getMonitorCount();
    });
  }
};
</script>
<style lang="less" scoped>
</style>