<template>
  <div style="position:relative">
    <div :style="mapStyle" v-loading="loading" class="adcdMap" ref="adcdMap1"></div>
    <el-button class="mapButton" round size="mini" v-show="btnShow" @click="reloadMap">
      <span class="fa fa-arrow-left m-r-5"></span>返回
    </el-button>
  </div>
</template>

<script>
import request from "@/utils/adcdRequest"; //请求地图的行政区划数据
import requestDC from "@/utils/requestDC";
import { mapDataMethod } from "@/api/GeoMapDataMethod";
//import echarts from "echarts";
import { getUserInfo } from "@/utils/auth";
export default {
  name: "adcdMapPrj",
  components: {},
  props: {
    adcdCode: {
      type: Number,
      defalut: 33
    },
    childHeight: {
      type: Number,
      defalut: 400
    }
  },
  data() {
    const userInfos = getUserInfo();
    return {
      chart: null,
      option: {},
      mapStyle: {
        height: "400px",
        width: "100%"
      },
      userAdcd: userInfos.ADCD,
      loading: false,
      btnShow: false //地图的返回按钮显示隐藏
    };
  },
  watch: {},
  computed: {},
  methods: {
    initMap(geoJson, prjData) {
      this.$echarts.registerMap("zhejiang", geoJson);
      this.renderMap(prjData);
    },
    renderMap(data) {
      //配置地图显示项
      this.option = {
        visualMap: {
          min: 0,
          max: 100,
          text: ["绿灯占比"],//
          realtime: false,
          calculable: true,
          //align:'top',
          left:0,
          itemWidth:10,
          inRange: {
            color: ["#ff000d", "#ff9900", "#4dd29b"]
          },
          formatter: value => {
            return value.toFixed(0) + "%";
          }
        },
        tooltip: {
          //数据提示框
          position: function(point, params, dom, rect, size) {
            return [point[0], point[1]];
          },
          trigger: "item",
          alwaysShowContent: false, //永远显示提示框
          enterable: true, //鼠标是否可以进入提示框
          formatter: params => {
            //debugger;
            const total =
              Number(params.data.green) +
              Number(params.data.red) +
              Number(params.data.yellow);
            return (
              '<span style="color:#0059ff">' +
              params.name +
              "</span><br>" +
              "工程总数：" +
              total +
              "<br>" +
              "亮绿灯：" +
              params.data.green +
              "<br>亮黄灯：<a class='warning' target='_blank' href='#/supMap'>" +
              params.data.yellow +
              "</a><br>亮红灯：<a class='danger' target='_blank' href='#/supMap'>" +
              params.data.red +
              "</a><br>绿灯占比：" +
              params.value +
              "%"
            );
          },
          backgroundColor: "#ffffff",
          textStyle: {
            color: "#333",
            fontWeight: "500",
            fontSize: 14
          },
          extraCssText: "box-shadow:0 0 5px rgba(0,0,0,.3)"
        },
        series: [
          {
            name: "工程运行状态",
            type: "map",
            mapType: "zhejiang", // 自定义扩展图表类型
            aspectScale: 1, //不变形
            roam: false,
            zoom:1.2,
            scaleLimit:{
               min:0.7,
               max:3
            },
            label: {
              show: true,
              //params.name+'\n'+'工程总数：'+params.data.green+params.data.red+params.data.yellow+'\n'+'亮绿灯：'+params.data.green+'\n亮黄灯'+params.data.yellow+'\n亮红灯'+params.data.red+'\n绿灯占比：'+params.value+'%'
              formatter: params => {
                //debugger
                return (
                  params.name.substring(0, 2) + params.value.toFixed(1) + "%"
                );
              },
              color: "#fff",
              textBorderColor: "#fff",
              textBorderWidth: 0,
              fontSize: 12,
              fontWeight: "500",
              shadowColor: "rgba(0,0,0,.3)",
              shadowBlur: 1,
              shadowOffsetX: 1,
              shadowOffsetY: 1,
              backgroundColor: "rgba(0,0,0,.4)",
              borderRadius: 20,
              padding: [4, 4]
            },
            itemStyle: {
              normal: {
                areaColor: "#0098ff",
                borderColor: "#ddd",
                borderWidth: 1,
                borderType: "dashed"
              }
            },
            emphasis: {
              //鼠标hover的区块的样式
              label: { show: true },
              itemStyle: {
                areaColor: "#33ffff"
              }
            },
            data: data
          }
        ]
      };
      this.chart.setOption(this.option);
      this.chart.off("click"); //先关闭点击事件避免bug
      this.chart.on("click", params => {
        const num = params.data.adcd.length - getUserInfo().ADCD.length;
        if (num > 0 && params.data.adcd.length <= 6 && num < 4) {
          if (params.data.adcd.length > getUserInfo().ADCD.length)
            this.btnShow = true; //只有往下钻取的时候才显示
          this.userAdcd = params.data.adcd;
          this.countMapData();
          this.$emit('tellFatherAdcdChanged',params.data.adcd);
        }
      });
    },
    prjView() {
      alert("来自提示框");
    },
    getMapData() {
      return new Promise((resolve, reject) => {
        requestDC({
          url: "Adcd/ListSubAdcdCoordinates",
          method: "post",
          data: { parentAdcd: this.userAdcd }
        })
          .then(res => {
            resolve(res.message);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    //获取工程运行状态
    getPrjStatus() {
      return new Promise((resolve, reject) => {
        requestDC({
          url: "SuperviseRunStatue/ListProjectMapCount",
          method: "post",
          data: {
            ADCD: this.userAdcd
          }
        })
          .then(res => {
            resolve(res.message);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async countMapData() {
      this.loading = true;
      let mapData = []; //地图数据
      let prjData = []; //工程运行数据
      //debugger
      try {
        mapData = await this.getMapData();
      } catch (error) {
        mapData = [];
      }
      try {
        prjData = await this.getPrjStatus();
      } catch (error) {
        prjData = [];
      }
      //debugger
      console.log(mapData, prjData);
      this.$emit("getPrjNum", prjData.total);
      for (let obj of prjData.list) {
        obj.name = obj.name;
        obj.value = Number((obj.greenRate * 100).toFixed(1));
        obj.red = obj.redNum;
        obj.yellow = obj.yellowNum;
        obj.green = obj.greenNum;
      }
      //debugger
      this.initMap(mapDataMethod(mapData), prjData.list);
      this.loading = false;
      //this.initMap(mapDataMethod(res.message));
      /* debugger
      let mapData=await this.getMapData();
      let waterData = await this.getNowWaterQualityLists();
      
      console.log(mapData,waterData) */
    },
    //地图按钮点击返回事件
    reloadMap() {
      this.userAdcd = getUserInfo().ADCD;
      this.$emit('tellFatherAdcdChanged',getUserInfo().ADCD);
      this.countMapData()
        .then(res => {
          this.btnShow = false;
        })
        .catch(error => {
          this.$message.error(
            "返回上级地图出错了，请再次点击返回或者刷新下看看!"
          );
        });
    }
  },
  created() {
    //父页面赋高度值给子组件
    this.mapStyle.height = this.childHeight + "px";
  },
  mounted() {
    this.$nextTick(_ => {
      this.chart = this.$echarts.init(this.$refs.adcdMap1);
      this.countMapData(); //执行异步函数生成地图
    });
  }
};
</script>
<style lang="less" scoped>
.mapButton {
  position: absolute;
  right: 0;
  top: 10px;
}
</style>