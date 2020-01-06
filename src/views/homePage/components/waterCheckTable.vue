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
          <el-table-column align="center" prop="CITY" label="市" fixed="left">
            <template slot-scope="scope">
              <div>{{scope.row.CITY|spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="COUNTY" label="县" fixed="left">
            <template slot-scope="scope">
              <div>{{scope.row.COUNTY|spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="PROJECT_NAME"
            label="工程名称"
            width="230px"
            fixed="left"
          >
            <template slot-scope="scope">
              <div
                class="overtext"
                :title="scope.row.PROJECT_NAME|spaceX"
              >{{scope.row.PROJECT_NAME|spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="LAST_MONITOR_TIME" label="上次检测时间" width="150px">
            <template slot-scope="scope">
              <div class="overtext">{{scope.row.LAST_MONITOR_TIME|spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="NEED_MONITOR_TIME" label="应检测时间" width="150px">
            <template slot-scope="scope">
              <div>{{scope.row.NEED_MONITOR_TIME|spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="OVERDUE_DAYS" label="超期(天)" v-if="!isQuality">
            <template slot-scope="scope">
              <div class="danger">{{!!scope.row.OVERDUE_DAYS?scope.row.OVERDUE_DAYS:'-'}}</div>
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
  </div>
</template>

<script>
import ThreeTrash from "@/components/select"; //三级联动下拉框
import request from "@/utils/requestDC"; //http请求
import { getUserInfo } from "@/utils/auth";
export default {
  name: "waterCheckTable", //隐患列表系列
  components: { ThreeTrash },
  props: {
    manageInfo: {
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
      tableLoading: false,
      exportLoading: false, //导出加载
      isQuality: 0, //判断是开展还是未开展
      pagShow: false, //导航显示
      auth: [] //权限列表
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
        let fileName = ""; //根据不同类别导出对应名称的excel
        switch (this.manageInfo.resultType) {
          case 0:
            fileName = "按要求开展日常检测I-III型出厂列表";
            break;
          case 1:
            fileName = "未按要求开展日常检测I-III型出厂列表";
            break;
          case 2:
            fileName = "按要求开展季度检测I-III型出厂列表";
            break;
          case 3:
            fileName = "未按要求开展季度检测I-III型出厂列表";
            break;
          case 4:
            fileName = "按要求开展丰枯水期检测IV-V型出厂列表";
            break;
          case 5:
            fileName = "未按要求开展丰枯水期检测IV-V型出厂列表";
            break;
          default:
            break;
        }
        if (this.isQuality) {
          theader = ["市", "县", "工程名称", "上次检测时间", "应检测时间"];
          filterVal = [
            "CITY",
            "COUNTY",
            "PROJECT_NAME",
            "LAST_MONITOR_TIME",
            "NEED_MONITOR_TIME"
          ];
        } else {
          theader = [
            "市",
            "县",
            "工程名称",
            "上次检测时间",
            "应检测时间",
            "超期"
          ];
          filterVal = [
            "CITY",
            "COUNTY",
            "PROJECT_NAME",
            "LAST_MONITOR_TIME",
            "NEED_MONITOR_TIME",
            "OVERDUE_DAYS"
          ];
        }
        const data = this.formatJson(filterVal, this.tableData);
        this.exportLoading = false;
        excel.export_json_to_excel({
          header: theader,
          data,
          filename: fileName + this.$moment().format("YYYY_MM_DD_HH_mm_ss"),
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
      this.dialogVisable = true;
    },
    //根据传入的prop获取列表信息
    getPrjLists() {
      this.tableLoading = true;
      let url = "";
      switch (this.manageInfo.resultType) {
        case 0:
          url = "SuperviseRunStatue/ListWaterQualityReach";
          this.isQuality = 1;
          break;
        case 1:
          url = "SuperviseRunStatue/ListWaterQualityReach";
          this.isQuality = 0;
          break;
        case 2:
          url = "SuperviseRunStatue/ListWaterQuarterQualityReach";
          this.isQuality = 1;
          break;
        case 3:
          url = "SuperviseRunStatue/ListWaterQuarterQualityReach";
          this.isQuality = 0;
          break;
        case 4:
          url = "SuperviseRunStatue/ListWaterDryInfo";
          this.isQuality = 1;
          break;
        case 5:
          url = "SuperviseRunStatue/ListWaterDryInfo";
          this.isQuality = 0;
          break;
        default:
          break;
      }
      request({
        url: url,
        method: "post",
        data: {
          ADCD: this.adcdSel,
          isQuality: this.isQuality,
          projectName: this.stopWaterSel.prjName,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
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
      this.pageNumber = 1; //回归到1
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
.overflow-text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>