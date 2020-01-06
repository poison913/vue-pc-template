/*作者: 陈凯歌 
开发日期: 2019-04-15 
页面描述：首页工程运行状态下面的列表组件   
修改人员：****  修改日期：****  */

<template>
  <el-row :gutter="10">
    <!-- 服务对象 -->
    <el-col :span="24">
      <h4 class="newTitle">{{info.ADMIN_DIV_NAME}}</h4>
      <div class="prjLists">
        <div class="listLeft">
          <i class="listIcon fwdx"></i>
          <h5 class="listTitle">服务对象</h5>
        </div>
        <div class="listRight">
          <h5>农饮水工程有{{info.PROJECT_COUNT|spaceX}}个</h5>
          <h5>供水覆盖人口{{info.POPULATION_COUNT|countW}}万人</h5>
        </div>
      </div>
      <div class="prjLists">
        <div class="listLeft m-t-10">
          <i class="listIcon sylx"></i>
          <h5 class="listTitle">水源类型</h5>
        </div>
        <div class="listRight">
          <h5>山塘：{{info.SOURCE_POOL|spaceX}}座&nbsp;河流湖泊：{{info.SOURCE_RIVER|spaceX}}条&nbsp;地下水：{{info.SOURCE_GROUNDWATER|spaceX}}座</h5>
          <h5>水库：{{info.SOURCE_RESERVOIR|spaceX}}座&nbsp;沟渠偃坝：{{info.SOURCE_CANAL|spaceX}}座&nbsp;海水淡水：{{info.SOURCE_SEAWATER|spaceX}}条&nbsp;其他：{{info.SOURCE_OTHER|spaceX}}座</h5>
        </div>
      </div>
      <div class="prjLists">
        <div class="listLeft">
          <i class="listIcon gsgk"></i>
          <h5 class="listTitle">供水概况</h5>
        </div>
        <div class="listRight">
          <h5>今日供水量：{{info.SUPPLY_QUANTITY_YEAR|spaceX}}万吨</h5>
          <h5>今年累计供水量：{{info.SUPPLY_QUANTITY_DAY|spaceX}}万吨</h5>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import request from "@/utils/requestDC"; //http请求
export default {
  name: "prjCountList",
  data() {
    return {
      adcd: "",
      info: {
        ADMIN_DIV_NAME: "",
        PROJECT_COUNT:"",
        POPULATION_COUNT: "",
        SOURCE_POOL: "",
        SOURCE_RIVER: "",
        SOURCE_GROUNDWATER: "",
        SOURCE_RESERVOIR: "",
        SOURCE_CANAL: "",
        SOURCE_SEAWATER: "",
        SOURCE_OTHER: "",
        SUPPLY_QUANTITY_YEAR: "",
        SUPPLY_QUANTITY_DAY: ""
      }
    };
  },

  components: {},

  created() {},

  mounted() {
    //先赋值adcd
    this.$nextTick(_ => {
      this.getCountInfo();
    });
  },

  methods: {
    getCountInfo() {
      request({
        url: "SuperWaterQuality/GetProvinceWaterSourceStatistics",
        method: "post",
        data: {
          adcd: this.prjAdcd
        }
      }).then(({ message }) => {
        for (let key in this.info) {
          this.info[key] = message[key];
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
.prjLists {
  width: 100%;
  padding: 5px 10px;
  border-bottom: 1px dashed #ddd;
  &:last-child {
    border-bottom: none;
  }
  float: left;
  .listLeft {
    width: 80px;
    float: left;
    .listIcon {
      width: 24px;
      height: 24px;
      display: block;
      margin: 0 auto;
      &.fwdx {
        background: url("../../../assets/01.png") no-repeat;
        background-size: 100% 100%;
      }
      &.sylx {
        background: url("../../../assets/02.png") no-repeat;
        background-size: 100% 100%;
      }
      &.gsgk {
        background: url("../../../assets/03.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .listTitle {
      font-size: 14px;
      text-align: center;
      margin: 0;
      line-height: 24px;
      display: block;
      width: 100%;
    }
  }
  .listRight {
    h5 {
      margin: 0;
      line-height: 24px;
      font-weight: 500;
    }
  }
}
.newTitle {
  font-size: 14px;
  border-bottom: 1px dashed #ddd;
  line-height: 32px;
  margin: 0;
}
</style>