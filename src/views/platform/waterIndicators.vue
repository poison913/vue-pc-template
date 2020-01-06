/* 作者：陈博文  开发日期：2019-04-01
   页面描述：水质指标
   修改人员：****  修改日期：****
 */
<template>
  <div class="p-10">
    <el-row>
      <el-col :span="24">
        <el-form :model="params" size="mini" class="search-row" inline>
          <el-form-item label="水样类型" :label-width="formLabelWidth" prop="waterType">
            <el-cascader :options="options" v-model="params.type" change-on-select clearable></el-cascader>
          </el-form-item>
          <el-form-item label="指标名称" :label-width="formLabelWidth" prop="appType">
            <el-input v-model="params.indexName" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="getTableData">
              <span class="fa fa-search m-r-5"></span>搜索
            </el-button>
          </el-form-item>
          <!-- <el-form-item class="right-btn">
            <el-button type="success" @click="handleAdd">
              <font-awesome-icon icon="plus" class="m-r-5"></font-awesome-icon>添加
            </el-button>
          </el-form-item>-->
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border
        stripe
        header-row-class-name="with_bac"
        style="width: 100%"
        size="mini"
      >
        <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center"></el-table-column>
        <el-table-column prop="INDEX_NAME" label="指标名称" align="center"></el-table-column>
        <el-table-column prop="WATER_TYPE" label="水样类型" width="150" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.WATER_TYPE | spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="MONITOR_TYPE" label="检测类型" width="150" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.MONITOR_TYPE | spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="INDEX_UPPER_VALUE" label="检测值上限" width="150" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.INDEX_UPPER_VALUE | spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="INDEX_LOWER_VALUE" label="检测值下限" width="150" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.INDEX_LOWER_VALUE | spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="INDEX_UNIT" label="指标单位" width="150" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.INDEX_UNIT | spaceX}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="DESCRIPTION" label="描述" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.DESCRIPTION | spaceX}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="text primary" @click="handleEdit(scope.row)">
              <b>编辑</b>
            </el-button>
            <el-button size="mini" type="text danger" @click="handleDelete(scope.row)">
              <b>删除</b>
            </el-button>
          </template>
        </el-table-column>-->
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalDataCount"
      ></el-pagination>
    </el-row>
  </div>
</template>

<script>
import requestDC from "@/utils/requestDC";
export default {
  data() {
    return {
      params: {
        type: [],
        indexName: ""
      },
      options: [
        {
          value: "出厂水",
          label: "出厂水",
          children: [
            { value: "日常检测", label: "日常检测" },
            { value: "季度检测", label: "季度检测" },
            { value: "丰水期检测", label: "丰水期检测" },
            { value: "枯水期检测", label: "枯水期检测" }
          ]
        },
        {
          value: "水源水",
          label: "水源水",
          children: [{ value: "其他", label: "其他" }]
        },
        {
          value: "末梢水",
          label: "末梢水",
          children: [{ value: "其他", label: "其他" }]
        }
      ],
      tableData: [],
      pageSize: 20,
      currentPage: 1,
      tableLoading: true,
      totalDataCount: 1,
      formLabelWidth: "80px"
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData(event) {
      if (event) {
        this.currentPage = 1;
      }
      this.tableLoading = true;
      requestDC({
        url: "WaterIndex/ListIndexs",
        method: "post",
        data: {
          waterType: this.params.type[0] ? this.params.type[0] : "",
          monitorType: this.params.type[1] ? this.params.type[1] : "",
          indexName: this.params.indexName,
          pageSize: this.pageSize,
          pageNumber: this.currentPage
        }
      })
        .then(res => {
          setTimeout(() => {
            this.tableLoading = false;
          }, 300);
          this.tableData = res.message.rows;
          this.totalDataCount = res.message.total;
        })
        .catch(error => {
          setTimeout(() => {
            this.tableLoading = false;
          }, 300);
          this.$message({
            type: "error",
            message: error
          });
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.getTableData();
    },
    //index索引方法
    indexMethod(index) {
      return index + (this.currentPage - 1) * this.pageSize + 1;
    }
    // handleAdd() {},
  }
};
</script>

<style lang="less" scoped>
.p-10 {
  padding: 10px;
}
.right-btn {
  float: right;
}
.el-pagination {
  margin-top: 10px;
  text-align: right;
}
</style>
