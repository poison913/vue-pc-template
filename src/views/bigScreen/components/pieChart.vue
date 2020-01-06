<template>
  <div :style="{width:'100%'}" class="pieChart" ref="pieChart"></div>
</template>

<script>
//import echarts from "echarts";
export default {
  name: "pieChart",
  components: {},
  props: {
    pieData: {
      type: Object,
      default: {}
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
    renderChart() {
      this.option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ["#4dd29b", "#ff9602"],
        legend: {
          orient: "horizontal",
          bottom: 0,
          x: "center",
          data: this.pieData.twoName
        },
        series: [
          {
            name: this.pieData.name,
            type: "pie",
            radius: ["20%", "55%"],
            label: {
              normal: {
                formatter: function(params) {
                  return (
                    params.name +
                    "," +
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
                position: "inner",
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
              length: 0,
              length2: 0
            },
            data: this.pieData.data
          }
        ]
      };
      this.chart.setOption(this.option); //完成渲染
    }
  },
  created() {},
  mounted() {
    this.chart = this.$echarts.init(this.$refs.pieChart); //初始化
    this.renderChart();
  }
};
</script>
<style lang="less" scoped>
</style>