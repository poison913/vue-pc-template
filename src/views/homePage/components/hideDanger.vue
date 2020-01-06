<template>
  <div>
    <el-row>
      <!-- <el-col>
        <ThreeTrash
          ref="select1"
          :options="adcd"
          :init-adcd="initAdcd"
          @sendAdcd="getChildAdcd"
          class="dialogAdcd pull-left"
        />
        <el-form ref="form1" label-width="80px" :model="stopWaterSel" size="mini" class="pull-left">
          <el-form-item label="工程名称">
            <el-input v-model="stopWaterSel.prjName" style="width:180px" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" @click="search" v-loading="loading" size="mini" class="m-l-10">
          <span class="fa fa-search m-r-5"></span>搜索
        </el-button>
        <el-button
          type="primary"
          size="mini"
          class="pull-right"
          @click="exportTable"
          v-loading="exportLoading"
          v-show="auth.indexOf(16)!==-1"
        >
          <span class="fa fa-download m-r-5"></span>导出
        </el-button>
      </el-col>-->
      <el-col :span="24">
        <el-table
          :data="tableData"
          border
          stripe
          style="width:100%"
          size="mini"
          header-row-class-name="with_bac"
          v-loading="tableLoading"
        >
          <el-table-column align="center" type="index" :index="indexMethod" label="序号" fixed="left"></el-table-column>
          <el-table-column align="center" prop="CITY" label="市" width="80" fixed>
            <template slot-scope="scope">
              <div>{{scope.row.CITY|spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="COUNTY" label="县" width="80" fixed>
            <template slot-scope="scope">
              <div>{{scope.row.COUNTY|spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="PROJECT_NAME" label="工程名称" width="200" fixed>
            <template slot-scope="scope">
              <div
                class="overtext"
                :title="scope.row.PROJECT_NAME|spaceX"
              >{{scope.row.PROJECT_NAME|spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="DANGER_NAME" label="隐患简称" width="120">
            <template slot-scope="scope">
              <div class="overtext" :title="scope.row.DANGER_NAME">{{scope.row.DANGER_NAME|spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="DISCOVER_PART" label="发现部位" width="100">
            <template slot-scope="scope">
              <div class="overtext" :title="scope.row.DISCOVER_PART">{{scope.row.DISCOVER_PART|spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="DISCOVER_TIME" label="发现时间" width="150"></el-table-column>
          <el-table-column align="center" prop="DEAL_MODE" label="处置方式">
            <template slot-scope="scope">
              <div :title="scope.row.DEAL_MODE">{{scope.row.DEAL_MODE|spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="PLAN_FINISH_TIME" label="计划完成时间" width="150">
            <template slot-scope="scope">
              <div
                class="overflow-text"
                :title="scope.row.PLAN_FINISH_TIME"
              >{{scope.row.PLAN_FINISH_TIME|spaceX}}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="DANGER_FILE_COUNT" label="处理前照片" width="200">
            <template slot-scope="scope">
              <a class="blue">{{scope.row.DANGER_FILE_COUNT}}</a>
            </template>
          </el-table-column>-->
          <el-table-column
            align="center"
            prop="ACTUAL_FINISH_TIME"
            label="实际完成时间"
            width="150"
            v-if="dangerInfo.dangerType=='1'||dangerInfo.dangerType==''"
          >
            <template slot-scope="scope">
              <div
                class="overflow-text"
                :title="scope.row.ACTUAL_FINISH_TIME"
              >{{scope.row.ACTUAL_FINISH_TIME|spaceX}}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="DANGER_DEAL_FILE_COUNT"
            label="治理后照片"
            width="200"
            v-if="dangerInfo.dangerType=='1'"
          >
            <template slot-scope="scope">
              <a class="blue">{{scope.row.DANGER_DEAL_FILE_COUNT}}</a>
            </template>
          </el-table-column>-->
          <el-table-column align="center" label="操作" width="70" fixed="right">
            <template slot-scope="scope">
              <el-button type="text blue" size="mini" @click="viewInfo(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="10"
          layout="total,sizes, prev, pager, next,jumper"
          :total="totalNum"
          class="m-t-10 pull-right"
          v-if="pagShow"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 水质报告详情的弹窗 -->
  </div>
</template>

<script>
//import ThreeTrash from "@/components/select"; //三级联动下拉框
import request from "@/utils/requestDC"; //http请求
import { getUserInfo } from "@/utils/auth";
export default {
  name: "hideDanger", //隐患列表系列
  components: {},
  props: {
    dangerInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    const userInfos = getUserInfo();
    let step = 2; //级联选择器的跨级数，根据用户的adcd来判断
    if (userInfos.ADCD.length === 2) step = 3;
    else step = 2;
    return {
      tableData: [],
      adcd: [
        {
          ADCD: userInfos.ADCD, //顶级政区编码
          ADMIN_DIV_NAME: userInfos.ADMIN_DIV_NAME, //顶级政区名
          children: [], //固定传空
          level: 1 //顶级所在位置，固定为1
        } // 初始化传入当前行政区划的顶级
      ],
      initAdcd: {
        adcd: userInfos.ADCD, //选择绑定的值
        level: 1, //绑定值所在政区的级别
        step: step, //允许选择的最大级别
        isClear: false //是否可清除值
      },
      stopWaterSel: { prjName: "" }, //停止供水模态框内容
      adcdSel: userInfos.ADCD,
      totalNum: 0, //表格总数据量
      pageSize: 10,
      pageNumber: 1,
      loading: false,
      exportLoading: false,
      tableLoading: false,
      pagShow: false, //分页显示
      auth: [] //页面权限
    };
  },
  watch: {},
  computed: {},
  filters: {
    spaceX(value) {
      if (value === undefined || value === null) {
        return "-";
      } else {
        return value;
      }
    }
  },
  methods: {
    //恢复三级联动组件的绑定值
    refleshThreeTrash() {
      //debugger
      const userInfos = getUserInfo();
      //this.$refs.select1.initBuildThree(); //刷新级联组件
      //this.adcdSel = userInfos.ADCD; //初始化三级联动框
    },
    getChildAdcd: function(adcd) {
      const Num = adcd.length;
      console.log("来自子页面的" + adcd[Num - 1]); //定义了sendAdcd接收组件的值
      if (Num >= 1) this.adcdSel = adcd[Num - 1];
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    //导出表格
    exportTable() {
      this.exportLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        let theader = [];
        let filterVal = [];
        let fileName = "";
        switch (this.dangerInfo.dangerType) {
          case "1":
            fileName = "已治理";
            break;
          case "2":
            fileName = "治理中";
            break;
          case "3":
            fileName = "待治理";
            break;
          case "4":
            fileName = "逾期未治理";
            break;
          default:
            break;
        }
        if (this.dangerInfo.dangerType == 1) {
          theader = [
            "市",
            "县",
            "工程名称",
            "隐患简称",
            "发现部位",
            "发现时间",
            "处置方式",
            "计划完成时间",
            "实际完成时间"
          ];
          filterVal = [
            "CITY",
            "COUNTY",
            "PROJECT_NAME",
            "DANGER_NAME",
            "DISCOVER_PART",
            "DISCOVER_TIME",
            "DEAL_MODE",
            "PLAN_FINISH_TIME",
            "ACTUAL_FINISH_TIME"
          ];
        } else {
          theader = [
            "市",
            "县",
            "工程名称",
            "隐患简称",
            "发现部位",
            "发现时间",
            "处置方式",
            "计划完成时间"
          ];
          filterVal = [
            "CITY",
            "COUNTY",
            "PROJECT_NAME",
            "DANGER_NAME",
            "DISCOVER_PART",
            "DISCOVER_TIME",
            "DEAL_MODE",
            "PLAN_FINISH_TIME"
          ];
        }
        const data = this.formatJson(filterVal, this.tableData);
        this.exportLoading = false;
        excel.export_json_to_excel({
          header: theader,
          data,
          filename:
            fileName +
            "工程列表" +
            this.$moment().format("YYYY_MM_DD_HH_mm_ss"),
          autoWidth: true,
          bookType: "xlsx"
        });
      });
    },
    //分页点击切换事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPrjLists();
    },
    //
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getPrjLists();
    },
    //点击查看详情
    viewInfo(info) {
      console.log(info)
      // this.$router.push({
      //   name: "隐患处理",
      //   path: "/analysis/troubleSituation",
      //   params: {
      //     projectName: info.PROJECT_NAME
      //   }
      // });
      this.$router.push({
        path:"/analysis/troubleSituationView",
        query: {
          dangerCode: info.DANGER_CODE
        }
      })
    },
    //根据传入的prop获取列表信息
    getPrjLists() {
      this.tableLoading = true;
      request({
        url: "SuperTrouble/ListDangerInfoSuper",
        method: "post",
        data: {
          status: this.dangerInfo.dangerType, //this.dangerInfo.dangerType
          projCode: this.dangerInfo.prjCode,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          adcd: this.dangerInfo.adcd
        }
      })
        .then(({ message }) => {
          this.loading = false;
          this.tableLoading = false;
          this.totalNum = message.total;
          this.tableData = message.rows;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //点击搜索
    search() {
      this.loading = true;
      this.getPrjLists();
    },
    //index索引方法
    indexMethod(index) {
      //debugger
      return index + (this.pageNumber - 1) * this.pageSize + 1;
    },
    //初始化页数
    initPage() {
      this.pagShow = false;
      this.pageSize = 10;
      this.pageNumber = 1;
      this.$nextTick(_ => {
        this.pagShow = true; //销毁一次分页后再显示
      });
    }
  },
  created() {
    this.auth = this.$route.meta.auth; //读取用户权限数组
    console.log(this.auth);
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.overflow-text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>