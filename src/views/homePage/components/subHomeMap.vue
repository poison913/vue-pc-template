<template>
  <el-row>
    <el-col :span="24">
      <div :style="{'height':mapHeight+'px'}" class="adcdMap" ref="adcdMap1" v-loading="mapLoading"></div>
    </el-col>
    <el-col :span="24" style="height:200px">
      <el-table
        :data="tableData"
        border
        style="width:100%"
        max-height="200"
        size="mini"
        @row-click="rowClickEvent"
        v-loading="tableLoading"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="ADNM" label="政区">
          <template slot-scope="scope">
            <div class="overtext">{{scope.row.ADNM|spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="PROJECT_NAME" label="工程名称">
          <template slot-scope="scope">
            <div class="overtext" :title="scope.row.PROJECT_NAME">{{scope.row.PROJECT_NAME|spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="RUN_DESCRIPTION" label="红灯事项">
          <template slot-scope="scope">
            <el-tag
              class="overtext"
              type="danger"
              size="mini"
              :title="scope.row.RUN_DESCRIPTION"
            >{{scope.row.RUN_DESCRIPTION|spaceX}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
import request from "@/utils/adcdRequest"; //请求地图的行政区划数据
import { mapDataMethod } from "@/api/GeoMapDataMethod";
//import echarts from "echarts";
import { getUserInfo } from "@/utils/auth";
import requestDC from "@/utils/requestDC";
export default {
  name: "subHomeMap",
  components: {},
  props: {
    adcdCode: {
      type: Number,
      defalut: 33
    }
  },
  data() {
    const userInfos = getUserInfo();
    const _H = window.innerHeight;
    return {
      userAdcd: userInfos.ADCD,
      chart: null,
      option: {},
      /* mapStyle: {
        height:'400px',
        width: "100%"
      }, */
      mapPoints: [
        {
          name: "XXX工程",
          value: [120.119, 30.274],
          type: "red",
          typeName: "红灯",
          info: "当前亮红灯的工程为XXX",
          prjName: "XXX工程"
        },
        {
          name: "XXX工程",
          value: [120.222, 30.789],
          type: "yellow",
          typeName: "黄灯",
          info: "当前亮黄灯的工程为XXX",
          prjName: "XXX工程"
        }
      ],
      tableData: [],
      mapHeight: _H - 435,
      mapLoading: false,
      tableLoading: false,
      homeAuth:''
    };
  },
  watch: {},
  computed: {},
  methods: {
    initMap(geoJson, finalMapPoints) {
      //debugger
      this.$echarts.registerMap("浙江", geoJson);
      //debugger
      this.renderMap(finalMapPoints);
    },
    renderMap(data) {
      //debugger
      //配置地图显示项
      this.option = {
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        geo: {
          map: "浙江", //series多个时必须配置
          show: true,
          aspectScale: 1 //不变形
        },
        /* visualMap: {
          min: 0,
          max: 100,
          text: ["达标率"],
          realtime: false,
          calculable: true,
          inRange: {
            color: ["#c6d3f6", "#3156ba"]
          },
          formatter: value => {
            return value + "%";
          }
        }, */
        tooltip: {
          show: true,
          hideDelay: 1000,
          alwaysShowContent: false, //永远显示提示框
          enterable: true //鼠标是否可以进入提示框
        },
        series: [
          {
            name: "工程运行状态",
            type: "map",
            mapType: "浙江", // 自定义扩展图表类型
            aspectScale: 1, //不变形
            label: {
              show: true,
              //params.name+'\n'+'工程总数：'+params.data.green+params.data.red+params.data.yellow+'\n'+'亮绿灯：'+params.data.green+'\n亮黄灯'+params.data.yellow+'\n亮红灯'+params.data.red+'\n绿灯占比：'+params.value+'%'
              formatter: params => {
                //debugger
                return params.name.substring(0, 2);
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
              areaColor: "#3156ba",
              borderColor: "#fff",
              borderWidth: 2,
              borderType: "dashed"
            },
            tooltip: {
              show: false,
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
                  params.data.green +
                  params.data.red +
                  params.data.yellow +
                  "<br>" +
                  "合格数：" +
                  params.data.green +
                  "<br>不合格数" +
                  params.data.yellow +
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
            emphasis: {
              //鼠标hover的区块的样式
              label: { show: true },
              itemStyle: {
                areaColor: "#33ffff"
              }
            },
            data: []
            /* markPoint: {
              symbol: "circle",
              symbolSize: 15,
              itemStyle: {
                normal: {
                  color: function(params) {
                    debugger
                    if (params.data.type == "red") {
                      return "#ff0000";
                    }
                  }
                }
              },
              data:this.mapPoints
            } */
          },
          {
            name: "工程",
            type: "scatter",
            coordinateSystem: "geo",
            data: data,
            symbol: "circle",
            symbolSize: 15,
            zlevel: 9,
            label: {
              show: false,
              normal: {
                formatter: "{b}",
                position: "bottom",
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: function(params) {
                  //debugger
                  if (params.data.type == "red") {
                    return "#ff000d";
                  } else if (params.data.type == "yellow") {
                    return "#ff9900";
                  } else {
                    return "#4dd29b";
                  }
                },
                borderColor: "#fff",
                borderWidth: 2,
                opacity: 1
              }
            },
            tooltip: {
              show: true,
              //position: "inside",
              position: function(point, params, dom, rect, size) {
                return [point[0], point[1]];
              },
              trigger: "item",
              triggerOn: "click",
              hideDelay: 1000,
              alwaysShowContent: true, //永远显示提示框
              enterable: true, //鼠标是否可以进入提示框
              formatter: params => {
                //debugger;
                return (
                  '<span style="color:#0059ff">' +
                  params.data.prjName +
                  "</span><br>" +
                  "<div class='tooltip-prag'>红灯事项:" +
                  params.data.info +
                  "</div>" +
                  "<a class='blue' target='_blank' href='#/basicinfo?projectCode="+params.data.PROJECT_CODE+'&auth='+this.homeAuth+"'>查看详情<a/>"
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
            hoverAnimation: true //鼠标滑过提示动画
          }
        ]
      };
      this.chart.setOption(this.option);
      this.chart.on("click", params => {
        /* const h = this.$createElement;
        this.$notify({
          title: "标题名称",
          message: h("i", { style: "color: teal" }, params.name)
        }); */
      });
    },
    //获取亮红灯工程
    getRedPrjLists() {
      return new Promise((resolve, reject) => {
        requestDC({
          url: "RedMap/ListRedMap",
          method: "post",
          data: {}
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
      this.mapLoading = true;
      this.tableLoading = true; //菊花滚动
      let mapData = []; //地图数据
      let mapPoints = []; //亮红灯工程数据
      let finalMapPoints = []; //最后生成所用的数据
      //debugger
      try {
        mapData = await this.getMapData();
      } catch (error) {
        mapData = [];
      }
      try {
        mapPoints = await this.getRedPrjLists();
      } catch (error) {
        mapPoints = [];
      }
      this.tableData = mapPoints;
      //console.log(mapData, waterData);
      //debugger
      for (let obj of mapPoints) {
        finalMapPoints.push({
          name: obj.PROJECT_NAME,
          value: [obj.LONGITUDE, obj.LATITUDE],
          type: "red",
          typeName: "红灯工程",
          info: obj.RUN_DESCRIPTION,
          prjName: obj.PROJECT_NAME,
          PROJECT_CODE:obj.PROJECT_CODE
        });
      }
      this.initMap(mapDataMethod(mapData), finalMapPoints);
      this.mapLoading = false;
      this.tableLoading = false;
      //this.initMap(mapDataMethod(mapData), waterData);
      //this.initMap(mapDataMethod(res.message));
      /* debugger
      let mapData=await this.getMapData();
      let waterData = await this.getNowWaterQualityLists();
      
      console.log(mapData,waterData) */
    },
    //行点击事件
    rowClickEvent(row, column, event) {
      console.log(row);
    }
  },
  created() {
    this.homeAuth = this.$route.meta.auth.toString();
    
    console.log(`auth`,this.homeAuth)
    //父页面赋高度值给子组件
  },
  mounted() {
    this.chart = this.$echarts.init(this.$refs.adcdMap1);
    this.$nextTick(_ => {
      //debugger
      //this.childHeight = this.childHeight - 200 + "px";
      this.countMapData();
    });
    //请求地图的数据来源
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
.overtext {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>