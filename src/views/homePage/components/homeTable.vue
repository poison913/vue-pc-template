<template>
  <el-table
    :data="tableData"
    :height="this.tableHeight"
    border
    style="width:100%"
    size="small"
    ref="table"
    stripe 
    header-row-class-name="with_bac"
  >
    <template v-for="list in tableColumns">
      <el-table-column
        :prop="list.prop"
        :key="list.ADCD"
        :label="list.label"
        :min-width="list.width"
        :fixed="list.fixed"
      ></el-table-column>
    </template>
  </el-table>
</template>

<script>
export default {
  name: "homeTable",
  components: {},
  props: {
    tableHeight: {
      type: Number,
      default: null
    },
    tableInsertData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      tableColumns: [],
      tableData: []
    };
  },
  watch: {},
  computed: {},
  methods: {
    calTableData() {
      let columns = [{ prop: "类型", label: "类型" }];
      let tableData = [
        { 类型: "达标人口覆盖率" },
        { 类型: "供水保证率" },
        { 类型: "水质达标率" }
      ];
      for (let obj of this.tableInsertData.LISTADMINDIV) {
        columns.push({ prop: obj.ADMIN_DIV_NAME, label: obj.ADMIN_DIV_NAME });
        tableData[0][obj.ADMIN_DIV_NAME] = obj.POPULATION_STANDARD_RATE?(obj.POPULATION_STANDARD_RATE+ "%"):'-' ;
        tableData[1][obj.ADMIN_DIV_NAME] = obj.SUPPLY_STANDARD_RATE + "%";
        tableData[2][obj.ADMIN_DIV_NAME] = obj.WQ_STANDARD_RATE + "%";
      }
      this.tableColumns = columns;
      this.bindTableWidth(); //宽度计算
      this.tableData = tableData; //刷新表格
    },
    bindTableWidth() {
      const _W = (window.innerWidth - 40) / 2 - 20; //当前的容器宽度
      this.tableColumns.forEach((list, i) => {
        if (i === 0) {
          list.width = 118;
          list.fixed = true;
        } else {
          list.width = 70;
        }
      });
    }
  },
  created() {
  },
  mounted() {
  }
};
</script>
<style lang="less" scoped>
</style>