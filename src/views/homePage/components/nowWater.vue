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
          <el-input v-model="stopWaterSel.prjName" style="width:180px"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="warning" size="mini" class="m-l-10">搜索</el-button>
      <el-button type="primary" size="mini" class="pull-right" @click="exportTable">
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
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="key1" label="市"></el-table-column>
        <el-table-column prop="key2" label="县"></el-table-column>
        <el-table-column prop="key3" label="工程名称"></el-table-column>
        <el-table-column prop="key4" label="开始供水时间"></el-table-column>
        <el-table-column prop="key5" label="持续供水时长(h)"></el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
import ThreeTrash from "@/components/select"; //三级联动下拉框
export default {
  name: "nowWater", //停止供水的弹窗内容
  components: { ThreeTrash },
  props: {},
  data() {
    return {
      tableData: [{ key1: 1, key2: 2, key3: 3, key4: 4, key5: 5 }],
      adcd: [
        {
          ADCD: "33",
          ADMIN_DIV_NAME: "浙江省",
          children: [],
          level: 1
        } // 初始化传入当前行政区划的顶级
      ],
      initAdcd: { adcd: "33", level: 1, step: 3 }, // 传入初始化的用户行政区划信息,step代表几级联动，最多支持4级联动，1级联动不使用该组件
      stopWaterSel: { prjName: "" } //停止供水模态框内容
    };
  },
  watch: {},
  computed: {},
  methods: {
    getChildAdcd: function(adcd) {
      const Num = adcd.length;
      console.log("来自子页面的" + adcd[Num - 1]); //定义了sendAdcd接收组件的值
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
      import("@/vendor/Export2Excel").then(excel => {
        const theader = [
          "序号",
          "市",
          "县",
          "工程名称",
          "开始供水时间",
          "持续供水时长(h)"
        ];
        const filterVal = [];
        const data = this.formatJson(filterVal, this.tableData);
        excel.export_json_to_excel({
          header: theader,
          data,
          filename: "停止供水表" + this.$moment().format("YYYY_MM_DD_HH_mm_ss"),
          autoWidth: true,
          bookType: "xlsx"
        });
      });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>
</style>