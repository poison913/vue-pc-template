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
  name: "adcdMapWater",
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
    initMap(geoJson, waterData) {
      this.$echarts.registerMap("zhejiang", geoJson);
      this.renderMap(waterData);
    },
    renderMap(data) {
      //配置地图显示项
      this.option = {
        visualMap: {
          min: 0,
          max: 100,
          left: 0,
          itemWidth: 10,
          text: ["达标率"],
          realtime: false,
          calculable: true,
          inRange: {
            color: ["#c6d3f6", "#3156ba"]
          },
          formatter: value => {
            return value.toFixed(0) + "%";
          }
        },
        room: 1,
        tooltip: {
          //数据提示框
          position: [10, 10],
          trigger: "item",
          formatter: params => {
            //debugger;
            return (
              '<span style="color:#0059ff">' +
              params.name +
              "</span><br>" +
              "工程总数：" +
              params.data.PROJECTS_TOTAL +
              "<br>" +
              "合格数：" +
              params.data.PROJECTS_UNFAIL +
              "<br>不合格数：" +
              params.data.PROJECTS_FAIL +
              "<br>合格率：" +
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
            zoom: 1.2,//初始化缩放
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
        console.log(params);
        const num = params.data.ADCD.length - getUserInfo().ADCD.length;
        if (num > 0 && params.data.ADCD.length <= 6 && num < 4) {
          if (params.data.ADCD.length > getUserInfo().ADCD.length)
            this.btnShow = true; //只有往下钻取的时候才显示
          this.userAdcd = params.data.ADCD;
          this.countMapData();
          this.$emit('tellFatherAdcdChanged2',params.data.ADCD);
        }
        /* const h = this.$createElement;
        this.$notify({
          title: "标题名称",
          message: h("i", { style: "color: teal" }, params.name)
        }); */
      });
    },
    //获取实时水质的统计信息
    getNowWaterQualityLists() {
      return new Promise((resolve, reject) => {
        requestDC({
          url: "SuperWaterQuality/ListWaterQualityRealtimeCountInfo",
          method: "post",
          data: {
            adcd: this.userAdcd
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
    async countMapData() {
      this.loading = true;
      let mapData = []; //地图数据
      let waterData = []; //水质数据
      //debugger
      try {
        mapData = await this.getMapData();
      } catch (error) {
        mapData = [];
      }
      try {
        waterData = await this.getNowWaterQualityLists();
      } catch (error) {
        waterData = [];
      }
      console.log(mapData, waterData);
      for (let obj of waterData) {
        obj.name = obj.ADNM;
        obj.value = obj.QUALITY_RATE * 100;
      }
      this.initMap(mapDataMethod(mapData), waterData);
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
      this.$emit('tellFatherAdcdChanged2',this.userAdcd);
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
    this.mapStyle.height = this.childHeight + 40 + "px";
    //this.chart = echarts.init(this.$refs.adcdMap1);
  },
  mounted() {
    //请求地图的数据来源
    this.$nextTick(_ => {
      this.chart = this.$echarts.init(this.$refs.adcdMap1);
      this.countMapData(); //执行异步函数生成地图
    });
    //debugger
    /* request({
      url: "api/AdminDivisions/GetAdminDivisionsCoordinates",
      method: "post",
      data: { userID: "", parentCode: this.adcdCode }
    }).then(res => {
      console.log(res);
      //对数据进行处理，满足v-charts地图的数据格式
      //this.chartSettings.mapOrigin = mapDataMethod(res.message);
      //console.log(this.chartSettings.mapOrigin);
      //数据处理完成后，渲染地图
      this.chart = echarts.init(this.$refs.adcdMap1);
      //debugger;
      this.initMap(mapDataMethod(res.message));
    }); */
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