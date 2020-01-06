<template>
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
      <el-button type="warning" v-loading="loading" @click="search()" size="mini" class="m-l-10">
        <span class="fa fa-search m-r-5"></span>搜索
      </el-button>
      <el-button
        type="primary"
        v-loading="startExport"
        size="mini"
        class="pull-right"
        @click="exportTable"
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
        <el-table-column align="center" type="index" :index="indexMethod" label="序号"></el-table-column>
        <el-table-column align="center" prop="CITY" label="市">
          <template slot-scope="scope">
            <div>{{scope.row.CITY|spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="COUNTY" label="县">
          <template slot-scope="scope">
            <div>{{scope.row.COUNTY|spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="PROJECT_NAME" label="工程名称">
          <template slot-scope="scope">
            <div>{{scope.row.PROJECT_NAME|spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          v-if="stopWaterInfo.resultType"
          width="120"
          prop="LAST_SUPPLY_TIME"
          label="最近开始供水时间"
        >
          <template slot-scope="scope">
            <div>{{scope.row.LAST_SUPPLY_TIME|spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" v-else prop="LAST_SUPPLY_TIME" width="140" label="最近停止供水时间">
          <template slot-scope="scope">
            <div>{{scope.row.LAST_SUPPLY_TIME|spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          v-if="stopWaterInfo.resultType"
          prop="STATUS_DURATION"
          label="持续供水时长(h)"
        >
          <template slot-scope="scope">
            <div>{{scope.row.STATUS_DURATION|spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" v-else prop="STATUS_DURATION" label="停止供水时长(h)">
          <template slot-scope="scope">
            <div>{{scope.row.STATUS_DURATION|spaceX}}</div>
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
</template>

<script>
import ThreeTrash from "@/components/select"; //三级联动下拉框
import request from "@/utils/requestDC"; //http请求
import { getUserInfo } from "@/utils/auth";
export default {
  name: "stopWater", //停止供水的弹窗内容
  components: { ThreeTrash },
  props: {
    stopWaterInfo: {
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
      loading: false,
      tableLoading: false,
      startExport: false, //等待动画
      adcdSel: userInfos.ADCD,
      totalNum: 0, //表格总数据量
      pageSize: 10,
      pageNumber: 1,
      pagShow: false,
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
      this.startExport = true;
      let xlsxName = this.stopWaterInfo.resultType ? "正在供水" : "停止供水";
      import("@/vendor/Export2Excel").then(excel => {
        let theader = [];
        if (this.stopWaterInfo.resultType) {
          theader = ["市", "县", "工程名称", "持续供水时间", "持续供水时长(h)"];
        } else {
          theader = ["市", "县", "工程名称", "停止供水时间", "停止供水时长(h)"];
        }
        const filterVal = [
          "CITY",
          "COUNTY",
          "PROJECT_NAME",
          "LAST_SUPPLY_TIME",
          "STATUS_DURATION"
        ];
        const data = this.formatJson(filterVal, this.tableData);
        //debugger
        excel.export_json_to_excel({
          header: theader,
          data,
          filename:
            xlsxName +
            "工程列表" +
            this.$moment().format("YYYY_MM_DD_HH_mm_ss"),
          autoWidth: true,
          bookType: "xlsx"
        });
        this.startExport = false;
      });
    },
    getTableData() {
      this.tableLoading = true;
      request({
        url: "SuperviseRunStatue/ListWaterSupply",
        method: "post",
        data: {
          ADCD: this.adcdSel,
          isSupply: this.stopWaterInfo.resultType,
          projectName: this.stopWaterSel.prjName,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
        }
      })
        .then(({ message }) => {
          this.loading = false;
          this.tableLoading = false; //等待动画消失
          console.log(message);
          this.tableData = message.rows;
          this.totalNum = message.total;
        })
        .catch(err => {});
    },
    search() {
      this.loading = true;
      this.pageNumber = 1; //回归到1
      this.getTableData();
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