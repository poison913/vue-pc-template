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
          <el-table-column align="center" prop="CITY_NAME" label="市" width="80" fixed>
            <template slot-scope="scope">
              <div>{{scope.row.CITY_NAME|spaceX}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="COUNTY_NAME" label="县" width="80" fixed>
            <template slot-scope="scope">
              <div>{{scope.row.COUNTY_NAME|spaceX}}</div>
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
          <el-table-column align="center" prop="SUM_COUNT" label="总数">
            <template slot-scope="scope">
              <a
                :class="scope.row.SUM_COUNT>0?'blue':'default'"
                @click="viewInfo('',scope.row)"
              >{{scope.row.SUM_COUNT|spaceX}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="HAS_COUNT" label="已治理">
            <template slot-scope="scope">
              <a
                :class="scope.row.HAS_COUNT>0?'success':'default'"
                @click="viewInfo(1,scope.row)"
              >{{scope.row.HAS_COUNT|spaceX}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="ON_COUNT" label="治理中">
            <template slot-scope="scope">
              <a
                :class="scope.row.ON_COUNT>0?'success':'default'"
                @click="viewInfo(2,scope.row)"
              >{{scope.row.ON_COUNT|spaceX}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="WAIT_COUNT" label="待治理">
            <template slot-scope="scope">
              <a
                :class="scope.row.WAIT_COUNT>0?'warning':'default'"
                @click="viewInfo(3,scope.row)"
              >{{scope.row.WAIT_COUNT|spaceX}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="OVER_COUNT" label="逾期未治理">
            <template slot-scope="scope">
              <a
                :class="scope.row.OVER_COUNT>0?'danger':'default'"
                @click="viewInfo(4,scope.row)"
              >{{scope.row.OVER_COUNT|spaceX}}</a>
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
    <!-- 具体的工程的历史详情 -->
    <el-dialog
      :visible.sync="dialogVisable"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :modal="false"
      :width="'70%'"
    >
      <span slot="title">{{hideDangerInfo.title}}</span>
      <hideDanger :dangerInfo="hideDangerInfo" ref="dangerInfoDia"/>
    </el-dialog>
  </div>
</template>

<script>
import ThreeTrash from "@/components/select"; //三级联动下拉框
import request from "@/utils/requestDC"; //http请求
import { getUserInfo } from "@/utils/auth";
import hideDanger from "./hideDanger"; //隐患详情
export default {
  name: "prjDangerLists", //隐患列表系列
  components: { ThreeTrash, hideDanger },
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
      auth: [], //页面权限
      hideDangerInfo: {
        title: "",
        dangerType: "",
        prjCode: "",
        adcd: userInfos.ADCD
      }, //隐患处理信息
      dialogVisable: false //详情弹窗
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
      if (Num >= 1) {
        this.adcdSel = adcd[Num - 1];
        this.hideDangerInfo.adcd = adcd[Num - 1];
      }
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
        theader = [
          "市",
          "县",
          "工程名称",
          "总数",
          "已治理",
          "治理中",
          "待治理",
          "逾期未治理"
        ];
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
    /* viewInfo(info) {
      this.$router.push({
        name: "隐患处理",
        path: "/analysis/troubleSituation",
        params: {
          projectName: info.PROJECT_NAME
        }
      });
    }, */
    //根据传入的prop获取列表信息
    getPrjLists() {
      this.tableLoading = true;
      request({
        url: "SuperTrouble/ListDangerCountSuper",
        method: "post",
        data: {
          adcd: this.adcdSel,
          status: this.dangerInfo.dangerType, //this.dangerInfo.dangerType
          projName: this.stopWaterSel.prjName,
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
      this.pageNumber = 1;
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
    },
    //查看工程详情
    viewInfo(type, row) {
      switch (type) {
        case 4:
          this.hideDangerInfo.title = row.PROJECT_NAME + "逾期未治理记录";
          break;
        case 2:
          this.hideDangerInfo.title = row.PROJECT_NAME + "待治理记录";
          break;
        case 3:
          this.hideDangerInfo.title = row.PROJECT_NAME + "治理中记录";
          break;
        case 1:
          this.hideDangerInfo.title = row.PROJECT_NAME + "已治理记录";
          break;
        case "":
          this.hideDangerInfo.title = row.PROJECT_NAME + "全部记录";
          break;
        default:
          break;
      }
      this.dialogVisable = true;
      this.hideDangerInfo.dangerType = type;
      this.hideDangerInfo.prjCode = row.PROJECT_CODE;
      this.$nextTick(_ => {
        this.$refs.dangerInfoDia.initPage(); //刷新pag
        //this.$refs.dangerInfoDia.refleshThreeTrash(); //先刷新adcd
        this.$refs.dangerInfoDia.getPrjLists(); //加载表格数据
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