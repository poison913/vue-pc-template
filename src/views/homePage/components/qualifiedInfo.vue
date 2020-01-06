<template>
  <div>
    <el-row>
      <el-col>
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
        <el-button type="warning" @click="search" size="mini" class="m-l-10" v-loading="loading">
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
      </el-col>
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
            <template slot-scope="scope">{{scope.row.CITY|spaceX}}</template>
          </el-table-column>
          <el-table-column align="center" prop="COUNTY" label="县" width="80" fixed>
            <template slot-scope="scope">{{scope.row.COUNTY|spaceX}}</template>
          </el-table-column>
          <el-table-column align="center" prop="PROJECT_NAME" label="工程名称" width="200" fixed>
            <template slot-scope="scope">{{scope.row.PROJECT_NAME|spaceX}}</template>
          </el-table-column>
          <el-table-column align="center" prop="YEAR_MONITOR_COUNT" label="本年检测总数" width="140">
            <template slot-scope="scope">{{scope.row.YEAR_MONITOR_COUNT|spaceX}}</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="YEAR_NORMAL_MONITOR_COUNT"
            label="本年检测合格次数"
            width="140"
          >
            <template slot-scope="scope">
              <span class="success">{{scope.row.YEAR_NORMAL_MONITOR_COUNT|spaceX}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="RECENT_SUCCESSIVE_ABNORMAL_COUNT"
            label="最近检测连续不合格次数"
            width="180"
          >
            <template slot-scope="scope">
              <span class="danger">{{scope.row.RECENT_SUCCESSIVE_ABNORMAL_COUNT|spaceX}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="LAST_MONITOR_TIME" label="最近检测时间" width="140">
            <template slot-scope="scope">
              <div :title="scope.row.LAST_MONITOR_TIME">{{scope.row.LAST_MONITOR_TIME|spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="WATER_QUALITY_RESULT" width="100" label="最近检测成果">
            <template slot-scope="scope">
              <span
                :class="Number(scope.row.WATER_QUALITY_RESULT)?'success':'danger'"
              >{{Number(scope.row.WATER_QUALITY_RESULT)?'合格':'不合格'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text blue" size="mini" @click="viewInfo(scope.row)">检测报告</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total,sizes, prev, pager, next,jumper"
          :total="totalNum"
          class="m-t-10 pull-right"
          v-if="pagShow"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 水质报告详情的弹窗 -->
    <el-dialog
      title="水质报告详细信息"
      :visible.sync="dialogVisable"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :modal="false"
      :top="'50px'"
      :custom-class="'DCDialog'"
      :lock-scroll="true"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <span class="demonstration">工程名称：{{prjBasicInfo.PROJECT_NAME}}</span>
        </el-col>
        <el-col :span="12" class="m-t-10">
          <span class="demonstration">检测时间：{{prjBasicInfo.COLLECTION_TIME}}</span>
        </el-col>
        <el-col :span="12" class="m-t-10">
          <span class="demonstration">
            检测成果：
            <span
              :class="Number(prjBasicInfo.MONITOR_RESULT)?'success':'danger'"
            >{{prjBasicInfo.MONITOR_RESULT_NAME}}</span>
          </span>
        </el-col>
        <el-col :span="24" class="m-t-10">
          <h4 class="text-center">检测指标</h4>
        </el-col>
        <el-col :span="24">
          <el-table
            :data="tableData1"
            stripe
            style="width:100%"
            size="mini"
            header-row-class-name="with_bac"
          >
            <el-table-column prop="ORDER_ID" label="代号" width></el-table-column>
            <el-table-column prop="INDEX_NAME" label="指标名称"></el-table-column>
            <el-table-column prop="MONITOR_RESULT" label="结果">
              <template slot-scope="scope">
                <div
                  :title="scope.row.MONITOR_RESULT"
                >{{scope.row.MONITOR_RESULT?scope.row.MONITOR_RESULT:'-'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="参考值">
              <template slot-scope="scope">
                <span>
                  {{scope.row.INDEX_LOWER_VALUE}}
                  <span v-if="!!scope.row.INDEX_UPPER_VALUE">~</span>
                  {{scope.row.INDEX_UPPER_VALUE}}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import ThreeTrash from "@/components/select"; //三级联动下拉框
import request from "@/utils/requestDC"; //http请求
import { getUserInfo } from "@/utils/auth";
export default {
  name: "qualifiedInfo", //合格详情
  components: { ThreeTrash },
  props: {
    info: {
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
      tableData1: [],
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
      dialogVisable: false, //默认弹窗关闭
      adcdSel: userInfos.ADCD,
      totalNum: 0, //表格总数据量
      pageSize: 10,
      pageNumber: 1,
      loading: false,
      tableLoading: false,
      exportLoading: false,
      pagShow: false,
      prjBasicInfo: {},
      auth: []
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
      this.$refs.select1.initBuildThree(); //刷新级联组件
      this.adcdSel = userInfos.ADCD; //初始化三级联动框
    },
    getChildAdcd: function(adcd) {
      const Num = adcd.length;
      console.log("来自子页面的" + adcd[Num - 1]); //定义了sendAdcd接收组件的值
      if (Num >= 1) this.adcdSel = adcd[Num - 1];
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          //debugger
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else if (j === "WATER_QUALITY_RESULT") {
            let result = "";
            Number(v[j]) ? (result = "合格") : (result = "不合格");
            return result;
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
        const theader = [
          "市",
          "县",
          "工程名称",
          "本年检测总数",
          "本年检测合格次数",
          "最近检测连续不合格数",
          "最近检测时间",
          "最近检测成果"
        ];
        const filterVal = [
          "CITY",
          "COUNTY",
          "PROJECT_NAME",
          "YEAR_MONITOR_COUNT",
          "YEAR_NORMAL_MONITOR_COUNT",
          "RECENT_SUCCESSIVE_ABNORMAL_COUNT",
          "LAST_MONITOR_TIME",
          "WATER_QUALITY_RESULT"
        ];
        const data = this.formatJson(filterVal, this.tableData);
        let fileTitle = "";
        this.info.resultType ? (fileTitle = "合格") : (fileTitle = "不合格");
        excel.export_json_to_excel({
          header: theader,
          data,
          filename:
            fileTitle +
            "工程列表" +
            this.$moment().format("YYYY_MM_DD_HH_mm_ss"),
          autoWidth: true,
          bookType: "xlsx"
        });
        this.exportLoading = false;
      });
    },
    //分页点击切换事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
    },
    //
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getTableData();
    },
    //点击查看详情
    viewInfo({ MONITOR_MAIN_CODE }) {
      this.dialogVisable = true;
      this.$nextTick(_ => {
        this.getPrjInfo(MONITOR_MAIN_CODE);
      });
    },
    getPrjInfo(code) {
      request({
        url: "WaterQuality/GetWaterQualityIndex",
        method: "post",
        data: {
          monitorMainCode: code
        }
      })
        .then(({ message }) => {
          console.log(message);
          this.prjBasicInfo = message.basicInfo;
          this.tableData1 = message.indexResult;
        })
        .catch(err => {});
    },
    //获取表格列表
    getTableData() {
      this.tableLoading = true;
      request({
        url: "SuperviseRunStatue/ListWaterQuality",
        method: "post",
        data: {
          ADCD: this.adcdSel,
          isQuality: this.info.resultType,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          projectName:this.stopWaterSel.prjName
        }
      })
        .then(({ message }) => {
          this.loading = false;
          this.tableLoading = false;
          console.log(message);
          this.tableData = message.rows;
          this.totalNum = message.total;
        })
        .catch(err => {});
    },
    search() {
      this.loading = true;
      this.pageNumber = 1;
      this.getTableData();
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
      this.stopWaterSel.prjName = "";
      this.$nextTick(_ => {
        this.pagShow = true; //销毁一次分页后再显示
      });
    }
  },
  created() {
    this.auth = this.$route.meta.auth;
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
</style>